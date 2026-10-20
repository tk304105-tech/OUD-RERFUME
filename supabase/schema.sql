-- ============================================================================
-- WAREHOUSE INVENTORY MANAGEMENT SYSTEM (WIMS)
-- PostgreSQL / Supabase Schema Definition & Row Level Security (RLS) Policies
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('ADMIN', 'STAFF')),
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    supplier TEXT,
    purchase_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    selling_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    current_stock INTEGER NOT NULL DEFAULT 0,
    minimum_stock INTEGER NOT NULL DEFAULT 10,
    maximum_stock INTEGER NOT NULL DEFAULT 500,
    warehouse_location TEXT DEFAULT 'Bay A-01',
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'IN STOCK' CHECK (status IN ('IN STOCK', 'LOW STOCK', 'OUT OF STOCK')),
    archived BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexing for fast search & filtering
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_archived ON public.products(archived);

-- 4. STOCK MOVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    movement_type TEXT NOT NULL CHECK (movement_type IN ('INBOUND', 'OUTBOUND', 'ADJUSTMENT', 'RETURN')),
    quantity INTEGER NOT NULL,
    previous_stock INTEGER NOT NULL,
    new_stock INTEGER NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    user_email TEXT,
    reason TEXT,
    reference_number TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON public.stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_type ON public.stock_movements(movement_type);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON public.stock_movements(created_at DESC);

-- 5. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'SYSTEM' CHECK (type IN ('LOW_STOCK', 'OUT_OF_STOCK', 'CRITICAL', 'SYSTEM')),
    is_read BOOLEAN NOT NULL DEFAULT false,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- 6. SYSTEM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Initialize default settings
INSERT INTO public.system_settings (key, value)
VALUES 
    ('allow_negative_stock', 'false'::jsonb),
    ('default_min_threshold', '10'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- ATOMIC STORED PROCEDURE: RECORD STOCK MOVEMENT
-- ============================================================================
CREATE OR REPLACE FUNCTION public.record_stock_movement(
    p_product_id UUID,
    p_movement_type TEXT,
    p_quantity INTEGER,
    p_user_id UUID DEFAULT NULL,
    p_user_email TEXT DEFAULT NULL,
    p_reason TEXT DEFAULT NULL,
    p_reference_number TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL,
    p_allow_negative BOOLEAN DEFAULT false
) RETURNS JSONB AS $$
DECLARE
    v_prev_stock INTEGER;
    v_new_stock INTEGER;
    v_min_stock INTEGER;
    v_new_status TEXT;
    v_movement_id UUID;
    v_prod_name TEXT;
    v_prod_sku TEXT;
BEGIN
    -- 1. Lock target product record for atomic update
    SELECT current_stock, minimum_stock, name, sku
    INTO v_prev_stock, v_min_stock, v_prod_name, v_prod_sku
    FROM public.products
    WHERE id = p_product_id AND archived = false
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product with ID % not found or is archived', p_product_id;
    END IF;

    -- 2. Calculate New Stock
    -- Formula: New Stock = Previous Stock + Inbound - Outbound ± Adjustment
    IF p_movement_type = 'INBOUND' THEN
        IF p_quantity <= 0 THEN
            RAISE EXCEPTION 'Inbound quantity must be strictly greater than 0';
        END IF;
        v_new_stock := v_prev_stock + p_quantity;

    ELSIF p_movement_type = 'OUTBOUND' THEN
        IF p_quantity <= 0 THEN
            RAISE EXCEPTION 'Outbound quantity must be strictly greater than 0';
        END IF;
        v_new_stock := v_prev_stock - p_quantity;

    ELSIF p_movement_type = 'RETURN' THEN
        IF p_quantity <= 0 THEN
            RAISE EXCEPTION 'Return quantity must be strictly greater than 0';
        END IF;
        v_new_stock := v_prev_stock + p_quantity;

    ELSIF p_movement_type = 'ADJUSTMENT' THEN
        -- Quantity can be positive or negative
        v_new_stock := v_prev_stock + p_quantity;
    ELSE
        RAISE EXCEPTION 'Invalid movement type: %', p_movement_type;
    END IF;

    -- 3. Reject negative stock if negative stock is not allowed
    IF v_new_stock < 0 AND NOT p_allow_negative THEN
        RAISE EXCEPTION 'Operation rejected: Insufficient inventory. Current stock: %, attempted new stock: %', v_prev_stock, v_new_stock;
    END IF;

    -- 4. Calculate new product status
    IF v_new_stock <= 0 THEN
        v_new_status := 'OUT OF STOCK';
    ELSIF v_new_stock <= v_min_stock THEN
        v_new_status := 'LOW STOCK';
    ELSE
        v_new_status := 'IN STOCK';
    END IF;

    -- 5. Update Product Table
    UPDATE public.products
    SET 
        current_stock = v_new_stock,
        status = v_new_status,
        updated_at = timezone('utc'::text, now())
    WHERE id = p_product_id;

    -- 6. Insert Movement Record
    INSERT INTO public.stock_movements (
        product_id,
        movement_type,
        quantity,
        previous_stock,
        new_stock,
        user_id,
        user_email,
        reason,
        reference_number,
        notes
    ) VALUES (
        p_product_id,
        p_movement_type,
        p_quantity,
        v_prev_stock,
        v_new_stock,
        p_user_id,
        p_user_email,
        p_reason,
        p_reference_number,
        p_notes
    ) RETURNING id INTO v_movement_id;

    -- 7. Trigger alert notification if stock entered LOW or OUT OF STOCK
    IF v_new_status IN ('OUT OF STOCK', 'LOW STOCK') THEN
        INSERT INTO public.notifications (
            title,
            message,
            type,
            product_id
        ) VALUES (
            CASE WHEN v_new_status = 'OUT OF STOCK' THEN 'Product Out of Stock Alert' ELSE 'Low Stock Replenishment Alert' END,
            format('Stock for %s (%s) dropped to %s units (Threshold: %s units).', v_prod_name, v_prod_sku, v_new_stock, v_min_stock),
            CASE WHEN v_new_status = 'OUT OF STOCK' THEN 'OUT_OF_STOCK' ELSE 'LOW_STOCK' END,
            p_product_id
        );
    END IF;

    -- Return JSON payload
    RETURN jsonb_build_object(
        'success', true,
        'movement_id', v_movement_id,
        'previous_stock', v_prev_stock,
        'new_stock', v_new_stock,
        'status', v_new_status
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current authenticated user is ADMIN
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'ADMIN' AND status = 'ACTIVE'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Check if current authenticated user is STAFF or ADMIN
CREATE OR REPLACE FUNCTION public.is_staff_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('ADMIN', 'STAFF') AND status = 'ACTIVE'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS: PRODUCTS
CREATE POLICY "Staff and Admins can view products"
    ON public.products FOR SELECT
    USING (public.is_staff_or_admin() OR auth.role() = 'authenticated');

CREATE POLICY "Admins can insert products"
    ON public.products FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update products"
    ON public.products FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admins can soft-delete products"
    ON public.products FOR DELETE
    USING (public.is_admin());

-- RLS: STOCK MOVEMENTS
CREATE POLICY "Staff and Admins can view stock movements"
    ON public.stock_movements FOR SELECT
    USING (public.is_staff_or_admin() OR auth.role() = 'authenticated');

CREATE POLICY "Staff and Admins can insert stock movements"
    ON public.stock_movements FOR INSERT
    WITH CHECK (public.is_staff_or_admin() OR auth.role() = 'authenticated');

-- RLS: NOTIFICATIONS
CREATE POLICY "Staff and Admins can view notifications"
    ON public.notifications FOR SELECT
    USING (public.is_staff_or_admin() OR auth.role() = 'authenticated');

CREATE POLICY "Staff and Admins can update/mark read notifications"
    ON public.notifications FOR UPDATE
    USING (public.is_staff_or_admin() OR auth.role() = 'authenticated');

-- RLS: USERS & SETTINGS
CREATE POLICY "Admins can manage staff accounts"
    ON public.users FOR ALL
    USING (public.is_admin());

CREATE POLICY "Admins can manage settings"
    ON public.system_settings FOR ALL
    USING (public.is_admin());
