import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface WimsUser {
  id: string;
  email: string;
  full_name: string;
  role: 'ADMIN' | 'STAFF';
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
}

export interface WimsProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  supplier: string;
  purchase_price: number;
  selling_price: number;
  current_stock: number;
  minimum_stock: number;
  maximum_stock: number;
  warehouse_location: string;
  image_url: string;
  status: 'IN STOCK' | 'LOW STOCK' | 'OUT OF STOCK';
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export type MovementType = 'INBOUND' | 'OUTBOUND' | 'ADJUSTMENT' | 'RETURN';

export interface WimsStockMovement {
  id: string;
  product_id: string;
  product_name?: string;
  product_sku?: string;
  movement_type: MovementType;
  quantity: number;
  previous_stock: number;
  new_stock: number;
  user_id?: string;
  user_email: string;
  reason: string;
  reference_number: string;
  notes?: string;
  created_at: string;
}

export interface WimsNotification {
  id: string;
  title: string;
  message: string;
  type: 'LOW_STOCK' | 'OUT_OF_STOCK' | 'CRITICAL' | 'SYSTEM';
  is_read: boolean;
  product_id?: string;
  created_at: string;
}

export interface WimsSettings {
  allow_negative_stock: boolean;
  default_min_threshold: number;
  default_warehouse_location: string;
  supabase_url: string;
  supabase_anon_key: string;
}

// Default Seed Data
const INITIAL_USERS: WimsUser[] = [
  {
    id: 'u-admin-01',
    email: 'admin@warehouse.io',
    full_name: 'Tayyaba (Super Admin)',
    role: 'ADMIN',
    status: 'ACTIVE',
    created_at: '2026-01-10T08:00:00Z'
  },
  {
    id: 'u-admin-02',
    email: 'tk304105@gmail.com',
    full_name: 'Tayyaba Khan',
    role: 'ADMIN',
    status: 'ACTIVE',
    created_at: '2026-01-10T08:00:00Z'
  },
  {
    id: 'u-staff-01',
    email: 'staff@warehouse.io',
    full_name: 'Warehouse Operations Lead',
    role: 'STAFF',
    status: 'ACTIVE',
    created_at: '2026-02-15T09:30:00Z'
  }
];

const INITIAL_CATEGORIES = [
  'Raw Materials & Essences',
  'Finished Fragrances',
  'Glass Flacons & Caps',
  'Packaging & Atomizers',
  'Solvents & Organic Ethanol',
  'Testers & Discovery'
];

const INITIAL_PRODUCTS: WimsProduct[] = [
  {
    id: 'prod-wims-01',
    name: 'Royal Cambodian Oud Extrait',
    sku: 'AUR-OUD-1001',
    category: 'Finished Fragrances',
    description: '35-year aged wild agarwood distillation in crystal flacon with gold vermeil cap.',
    supplier: 'Laboratoires Grasse Essences S.A.',
    purchase_price: 3200,
    selling_price: 7800,
    current_stock: 45,
    minimum_stock: 15,
    maximum_stock: 200,
    warehouse_location: 'Vault Bay A-01',
    image_url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80',
    status: 'IN STOCK',
    archived: false,
    created_at: '2026-02-01T10:00:00Z',
    updated_at: '2026-02-01T10:00:00Z'
  },
  {
    id: 'prod-wims-02',
    name: 'Taif Rose & Saffron Elixir',
    sku: 'AUR-ROSE-2002',
    category: 'Finished Fragrances',
    description: 'High-altitude hand-harvested Taif rose absolute combined with Kashmiri saffron.',
    supplier: 'Al-Haramain Distillers Grasse',
    purchase_price: 2600,
    selling_price: 6400,
    current_stock: 12,
    minimum_stock: 20,
    maximum_stock: 150,
    warehouse_location: 'Vault Bay A-04',
    image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
    status: 'LOW STOCK',
    archived: false,
    created_at: '2026-02-05T11:20:00Z',
    updated_at: '2026-02-05T11:20:00Z'
  },
  {
    id: 'prod-wims-03',
    name: 'Imperial Santal & Ambergris',
    sku: 'AUR-SAN-3003',
    category: 'Finished Fragrances',
    description: 'Aged Mysore sandalwood heart infused with floating grey ambergris tincture.',
    supplier: 'Verreries Pochet du Courval',
    purchase_price: 3900,
    selling_price: 9200,
    current_stock: 0,
    minimum_stock: 10,
    maximum_stock: 100,
    warehouse_location: 'Vault Bay B-02',
    image_url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80',
    status: 'OUT OF STOCK',
    archived: false,
    created_at: '2026-02-10T14:15:00Z',
    updated_at: '2026-02-10T14:15:00Z'
  },
  {
    id: 'prod-wims-04',
    name: 'Heavy Base Crystal Flacon 100ml',
    sku: 'PKG-FLAC-4004',
    category: 'Glass Flacons & Caps',
    description: 'Ultra-clear flint glass container with weighted magnetic zamac stopper.',
    supplier: 'Verreries Pochet du Courval',
    purchase_price: 650,
    selling_price: 1500,
    current_stock: 280,
    minimum_stock: 100,
    maximum_stock: 800,
    warehouse_location: 'Aisle C-Rack 3',
    image_url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=600&q=80',
    status: 'IN STOCK',
    archived: false,
    created_at: '2026-02-12T09:00:00Z',
    updated_at: '2026-02-12T09:00:00Z'
  },
  {
    id: 'prod-wims-05',
    name: 'Wild Assam Agarwood Chips (Grade AAA)',
    sku: 'RAW-ASSAM-5005',
    category: 'Raw Materials & Essences',
    description: 'Resin-dense raw oud wood chips for hydro-distillation and maceration extraction.',
    supplier: 'Laboratoires Grasse Essences S.A.',
    purchase_price: 8500,
    selling_price: 18000,
    current_stock: 6,
    minimum_stock: 15,
    maximum_stock: 50,
    warehouse_location: 'Cold Storage Vault 2',
    image_url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
    status: 'LOW STOCK',
    archived: false,
    created_at: '2026-02-15T16:45:00Z',
    updated_at: '2026-02-15T16:45:00Z'
  },
  {
    id: 'prod-wims-06',
    name: 'Olfactive Discovery Box (5x10ml)',
    sku: 'SET-DISC-6006',
    category: 'Testers & Discovery',
    description: 'Rigid magnetic velvet presentation box containing 5 signature sample specimens.',
    supplier: 'Autajon Cartonnages Packaging',
    purchase_price: 1800,
    selling_price: 4950,
    current_stock: 65,
    minimum_stock: 25,
    maximum_stock: 300,
    warehouse_location: 'Aisle D-Shelf 1',
    image_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80',
    status: 'IN STOCK',
    archived: false,
    created_at: '2026-02-20T12:00:00Z',
    updated_at: '2026-02-20T12:00:00Z'
  }
];

const INITIAL_MOVEMENTS: WimsStockMovement[] = [
  {
    id: 'mov-101',
    product_id: 'prod-wims-01',
    product_name: 'Royal Cambodian Oud Extrait',
    product_sku: 'AUR-OUD-1001',
    movement_type: 'INBOUND',
    quantity: 50,
    previous_stock: 0,
    new_stock: 50,
    user_email: 'admin@warehouse.io',
    reason: 'Grasse Batch Distillation PO-8834 Delivery',
    reference_number: 'PO-8834',
    notes: 'Received in temperature-sealed aluminum canisters.',
    created_at: '2026-10-18T09:15:00Z'
  },
  {
    id: 'mov-102',
    product_id: 'prod-wims-01',
    product_name: 'Royal Cambodian Oud Extrait',
    product_sku: 'AUR-OUD-1001',
    movement_type: 'OUTBOUND',
    quantity: 5,
    previous_stock: 50,
    new_stock: 45,
    user_email: 'staff@warehouse.io',
    reason: 'Dispatch to Retail Boutique Lahore',
    reference_number: 'DISP-7721',
    notes: 'Urgent weekend boutique restock order.',
    created_at: '2026-10-19T02:30:00Z'
  },
  {
    id: 'mov-103',
    product_id: 'prod-wims-02',
    product_name: 'Taif Rose & Saffron Elixir',
    product_sku: 'AUR-ROSE-2002',
    movement_type: 'OUTBOUND',
    quantity: 18,
    previous_stock: 30,
    new_stock: 12,
    user_email: 'staff@warehouse.io',
    reason: 'Customer Bulk Order Shipment',
    reference_number: 'SO-9920',
    notes: 'Dispatched via TCS Priority Express.',
    created_at: '2026-10-19T04:10:00Z'
  },
  {
    id: 'mov-104',
    product_id: 'prod-wims-03',
    product_name: 'Imperial Santal & Ambergris',
    product_sku: 'AUR-SAN-3003',
    movement_type: 'ADJUSTMENT',
    quantity: -15,
    previous_stock: 15,
    new_stock: 0,
    user_email: 'admin@warehouse.io',
    reason: 'Quarterly Physical Vault Audit Discrepancy',
    reference_number: 'AUDIT-Q3',
    notes: 'Bottles allocated to VIP Private Tasting Room.',
    created_at: '2026-10-19T05:00:00Z'
  }
];

const INITIAL_NOTIFICATIONS: WimsNotification[] = [
  {
    id: 'notif-01',
    title: 'Product Out of Stock Alert',
    message: 'Stock for Imperial Santal & Ambergris (AUR-SAN-3003) dropped to 0 units. Immediate supplier PO required.',
    type: 'OUT_OF_STOCK',
    is_read: false,
    product_id: 'prod-wims-03',
    created_at: '2026-10-19T05:01:00Z'
  },
  {
    id: 'notif-02',
    title: 'Low Stock Replenishment Alert',
    message: 'Taif Rose & Saffron Elixir (AUR-ROSE-2002) is at 12 units (Safety threshold: 20 units).',
    type: 'LOW_STOCK',
    is_read: false,
    product_id: 'prod-wims-02',
    created_at: '2026-10-19T04:11:00Z'
  },
  {
    id: 'notif-03',
    title: 'Raw Agarwood Stock Warning',
    message: 'Wild Assam Agarwood Chips has only 6 units remaining.',
    type: 'CRITICAL',
    is_read: false,
    product_id: 'prod-wims-05',
    created_at: '2026-10-19T01:00:00Z'
  }
];

const STORAGE_KEYS = {
  USERS: 'wims_users_v3',
  PRODUCTS: 'wims_products_v3',
  MOVEMENTS: 'wims_movements_v3',
  NOTIFICATIONS: 'wims_notifications_v3',
  SETTINGS: 'wims_settings_v3',
  SESSION: 'wims_active_session_v3'
};

function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

// ============================================================================
// SUPABASE & POSTGRES DATABASE CLIENT
// ============================================================================
class WimsDatabaseService {
  private supabase: SupabaseClient | null = null;
  private isRemoteConfigured = false;

  constructor() {
    this.initSupabase();
  }

  public initSupabase() {
    const settings = this.getSettings();
    const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

    const url = settings.supabase_url || envUrl;
    const key = settings.supabase_anon_key || envKey;

    if (url && key && url.startsWith('http') && key.length > 20) {
      try {
        this.supabase = createClient(url, key);
        this.isRemoteConfigured = true;
      } catch (err) {
        console.warn('Failed to initialize Supabase client:', err);
        this.supabase = null;
        this.isRemoteConfigured = false;
      }
    } else {
      this.supabase = null;
      this.isRemoteConfigured = false;
    }
  }

  public isUsingRemoteSupabase(): boolean {
    return this.isRemoteConfigured && this.supabase !== null;
  }

  // Session & Auth
  public getActiveUser(): WimsUser | null {
    return getLocal<WimsUser | null>(STORAGE_KEYS.SESSION, INITIAL_USERS[0]);
  }

  public setActiveUser(user: WimsUser | null) {
    setLocal(STORAGE_KEYS.SESSION, user);
  }

  public async login(email: string): Promise<{ success: boolean; user?: WimsUser; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const users = this.getUsers();
    
    // Look for matching user or fallback to standard Admin / Staff
    let user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      if (cleanEmail.includes('admin') || cleanEmail === 'tk304105@gmail.com') {
        user = {
          id: `u-${Date.now()}`,
          email: cleanEmail,
          full_name: 'Administrator',
          role: 'ADMIN',
          status: 'ACTIVE',
          created_at: new Date().toISOString()
        };
        this.saveUser(user);
      } else {
        user = {
          id: `u-${Date.now()}`,
          email: cleanEmail,
          full_name: 'Staff Operator',
          role: 'STAFF',
          status: 'ACTIVE',
          created_at: new Date().toISOString()
        };
        this.saveUser(user);
      }
    }

    if (user.status !== 'ACTIVE') {
      return { success: false, error: 'User account has been suspended or deactivated.' };
    }

    this.setActiveUser(user);
    return { success: true, user };
  }

  public logout() {
    this.setActiveUser(null);
  }

  // Users Management
  public getUsers(): WimsUser[] {
    return getLocal<WimsUser[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  public saveUser(user: WimsUser): WimsUser {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...user };
    } else {
      users.push(user);
    }
    setLocal(STORAGE_KEYS.USERS, users);
    return user;
  }

  public deleteUser(userId: string): boolean {
    let users = this.getUsers();
    users = users.filter(u => u.id !== userId);
    setLocal(STORAGE_KEYS.USERS, users);
    return true;
  }

  // Products CRUD
  public getProducts(includeArchived = false): WimsProduct[] {
    const prods = getLocal<WimsProduct[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    if (includeArchived) return prods;
    return prods.filter(p => !p.archived);
  }

  public getProductById(id: string): WimsProduct | null {
    const prods = this.getProducts(true);
    return prods.find(p => p.id === id) || null;
  }

  public saveProduct(productData: Partial<WimsProduct> & { name: string; sku: string }): WimsProduct {
    const prods = getLocal<WimsProduct[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const existingIdx = prods.findIndex(p => p.id === productData.id || p.sku.toUpperCase() === productData.sku.toUpperCase());

    const stock = Number(productData.current_stock ?? 0);
    const minStock = Number(productData.minimum_stock ?? 10);
    let status: WimsProduct['status'] = 'IN STOCK';
    if (stock <= 0) {
      status = 'OUT OF STOCK';
    } else if (stock <= minStock) {
      status = 'LOW STOCK';
    }

    let saved: WimsProduct;
    const now = new Date().toISOString();

    if (existingIdx >= 0) {
      saved = {
        ...prods[existingIdx],
        ...productData,
        current_stock: stock,
        minimum_stock: minStock,
        status,
        updated_at: now
      };
      prods[existingIdx] = saved;
    } else {
      saved = {
        id: productData.id || `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: productData.name,
        sku: productData.sku.trim().toUpperCase(),
        category: productData.category || 'Finished Fragrances',
        description: productData.description || '',
        supplier: productData.supplier || 'Laboratoires Grasse Essences S.A.',
        purchase_price: Number(productData.purchase_price) || 0,
        selling_price: Number(productData.selling_price) || 0,
        current_stock: stock,
        minimum_stock: minStock,
        maximum_stock: Number(productData.maximum_stock) || 500,
        warehouse_location: productData.warehouse_location || 'Vault Bay A-01',
        image_url: productData.image_url || 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80',
        status,
        archived: false,
        created_at: now,
        updated_at: now
      };
      prods.unshift(saved);
    }

    setLocal(STORAGE_KEYS.PRODUCTS, prods);

    // If stock became low or out, trigger notification
    if (status !== 'IN STOCK') {
      this.addNotification({
        title: status === 'OUT OF STOCK' ? 'Out of Stock Alert' : 'Low Stock Warning',
        message: `${saved.name} (${saved.sku}) is at ${saved.current_stock} units.`,
        type: status === 'OUT OF STOCK' ? 'OUT_OF_STOCK' : 'LOW_STOCK',
        product_id: saved.id
      });
    }

    return saved;
  }

  // Soft Delete Product (Admin only)
  public deleteProduct(id: string): boolean {
    const prods = getLocal<WimsProduct[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const target = prods.find(p => p.id === id);
    if (target) {
      target.archived = true;
      target.updated_at = new Date().toISOString();
      setLocal(STORAGE_KEYS.PRODUCTS, prods);
      return true;
    }
    return false;
  }

  // ==========================================================================
  // ATOMIC STOCK OPERATION (RPC FUNCTION EQUIVALENT)
  // Calculates: New Stock = Previous Stock + Inbound - Outbound ± Adjustment
  // Enforces negative stock rejection & status recalculation & notifications
  // ==========================================================================
  public async recordStockMovement(params: {
    product_id: string;
    movement_type: MovementType;
    quantity: number;
    reason: string;
    reference_number: string;
    notes?: string;
    user_email?: string;
  }): Promise<{ success: boolean; new_stock?: number; error?: string }> {
    const settings = this.getSettings();
    const prods = getLocal<WimsProduct[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const prod = prods.find(p => p.id === params.product_id && !p.archived);

    if (!prod) {
      return { success: false, error: 'Product not found or archived in vault.' };
    }

    const prevStock = prod.current_stock;
    const qty = Math.abs(Number(params.quantity));

    if (qty === 0 && params.movement_type !== 'ADJUSTMENT') {
      return { success: false, error: 'Transaction quantity must be greater than zero.' };
    }

    let newStock = prevStock;

    if (params.movement_type === 'INBOUND' || params.movement_type === 'RETURN') {
      newStock = prevStock + qty;
    } else if (params.movement_type === 'OUTBOUND') {
      newStock = prevStock - qty;
    } else if (params.movement_type === 'ADJUSTMENT') {
      // Adjustment can be positive or negative
      newStock = prevStock + Number(params.quantity);
    }

    // Negative stock check
    if (newStock < 0 && !settings.allow_negative_stock) {
      return {
        success: false,
        error: `Operation rejected: Insufficient stock. Current stock is ${prevStock} units. Cannot dispatch ${qty} units without negative stock permission enabled.`
      };
    }

    // Recalculate status rules:
    // OUT OF STOCK when stock = 0
    // LOW STOCK when stock <= minimum_stock
    // otherwise IN STOCK
    let newStatus: WimsProduct['status'] = 'IN STOCK';
    if (newStock <= 0) {
      newStatus = 'OUT OF STOCK';
    } else if (newStock <= prod.minimum_stock) {
      newStatus = 'LOW STOCK';
    }

    // Apply updates atomically
    prod.current_stock = newStock;
    prod.status = newStatus;
    prod.updated_at = new Date().toISOString();
    setLocal(STORAGE_KEYS.PRODUCTS, prods);

    // Record movement audit ledger entry
    const activeUser = this.getActiveUser();
    const movements = getLocal<WimsStockMovement[]>(STORAGE_KEYS.MOVEMENTS, INITIAL_MOVEMENTS);
    const movementEntry: WimsStockMovement = {
      id: `mov-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      product_id: prod.id,
      product_name: prod.name,
      product_sku: prod.sku,
      movement_type: params.movement_type,
      quantity: params.movement_type === 'ADJUSTMENT' ? Number(params.quantity) : qty,
      previous_stock: prevStock,
      new_stock: newStock,
      user_id: activeUser?.id,
      user_email: params.user_email || activeUser?.email || 'operator@warehouse.io',
      reason: params.reason,
      reference_number: params.reference_number || `REF-${Date.now().toString().slice(-6)}`,
      notes: params.notes,
      created_at: new Date().toISOString()
    };
    movements.unshift(movementEntry);
    setLocal(STORAGE_KEYS.MOVEMENTS, movements);

    // Create notification if status changed to LOW or OUT OF STOCK
    if (newStatus !== 'IN STOCK') {
      this.addNotification({
        title: newStatus === 'OUT OF STOCK' ? 'Product Out of Stock Alert' : 'Low Stock Replenishment Alert',
        message: `Inventory for ${prod.name} (${prod.sku}) dropped to ${newStock} units (Minimum: ${prod.minimum_stock} units).`,
        type: newStatus === 'OUT OF STOCK' ? 'OUT_OF_STOCK' : 'LOW_STOCK',
        product_id: prod.id
      });
    }

    return { success: true, new_stock: newStock };
  }

  // Stock Movements Log
  public getStockMovements(): WimsStockMovement[] {
    return getLocal<WimsStockMovement[]>(STORAGE_KEYS.MOVEMENTS, INITIAL_MOVEMENTS);
  }

  // Notifications
  public getNotifications(): WimsNotification[] {
    return getLocal<WimsNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }

  public addNotification(notif: Omit<WimsNotification, 'id' | 'is_read' | 'created_at'>): WimsNotification {
    const notifs = this.getNotifications();
    const item: WimsNotification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: notif.title,
      message: notif.message,
      type: notif.type,
      is_read: false,
      product_id: notif.product_id,
      created_at: new Date().toISOString()
    };
    notifs.unshift(item);
    setLocal(STORAGE_KEYS.NOTIFICATIONS, notifs);
    return item;
  }

  public markNotificationRead(id: string) {
    const notifs = this.getNotifications();
    const target = notifs.find(n => n.id === id);
    if (target) {
      target.is_read = true;
      setLocal(STORAGE_KEYS.NOTIFICATIONS, notifs);
    }
  }

  public clearAllNotifications() {
    setLocal(STORAGE_KEYS.NOTIFICATIONS, []);
  }

  // Settings
  public getSettings(): WimsSettings {
    return getLocal<WimsSettings>(STORAGE_KEYS.SETTINGS, {
      allow_negative_stock: false,
      default_min_threshold: 15,
      default_warehouse_location: 'Vault Bay A-01',
      supabase_url: '',
      supabase_anon_key: ''
    });
  }

  public saveSettings(settings: Partial<WimsSettings>): WimsSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    setLocal(STORAGE_KEYS.SETTINGS, updated);
    this.initSupabase();
    return updated;
  }

  // Categories
  public getCategories(): string[] {
    return INITIAL_CATEGORIES;
  }
}

export const wimsDb = new WimsDatabaseService();
