import { 
  Product, 
  Order, 
  Customer, 
  Coupon, 
  Review, 
  AuditLog, 
  OrderStatus, 
  PaymentMethod,
  Courier,
  ShippingAddress,
  CartItem,
  SupplierRecord,
  ExpenseRecord,
  ReportRecord,
  NotificationItem
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_CUSTOMERS, 
  INITIAL_COUPONS, 
  INITIAL_REVIEWS, 
  INITIAL_AUDIT_LOGS 
} from '../data/seedData';
import {
  INITIAL_SUPPLIERS,
  INITIAL_EXPENSES,
  INITIAL_REPORTS,
  INITIAL_NOTIFICATIONS
} from '../data/adminSeedData';

const STORAGE_KEYS = {
  PRODUCTS: 'aura_oud_products_v2',
  ORDERS: 'aura_oud_orders_v2',
  CUSTOMERS: 'aura_oud_customers_v2',
  COUPONS: 'aura_oud_coupons_v2',
  REVIEWS: 'aura_oud_reviews_v2',
  AUDIT_LOGS: 'aura_oud_audit_logs_v2',
  SUPPLIERS: 'aura_oud_suppliers_v2',
  EXPENSES: 'aura_oud_expenses_v2',
  REPORTS: 'aura_oud_reports_v2',
  NOTIFICATIONS: 'aura_oud_notifications_v2'
};

function getStored<T>(key: string, fallback: T): T {
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

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to persist to localStorage [${key}]:`, err);
  }
}

// Ensure initial seed
export function initializeStorage(): void {
  getStored(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  getStored(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  getStored(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  getStored(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
  getStored(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  getStored(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
}

// ---------------- PRODUCTS API ----------------
export async function getProducts(): Promise<Product[]> {
  await new Promise(r => setTimeout(r, 60));
  return getStored(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find(p => p.slug === slug || p.id === slug) || null;
}

export async function saveProduct(product: Partial<Product> & { name: string }): Promise<Product> {
  const products = await getProducts();
  const existingIndex = products.findIndex(p => p.id === product.id);

  let updatedProduct: Product;

  if (existingIndex >= 0) {
    updatedProduct = { ...products[existingIndex], ...product } as Product;
    products[existingIndex] = updatedProduct;
    await logAuditEvent('Product Updated', `Modified product spec for "${updatedProduct.name}" (${updatedProduct.id})`);
  } else {
    const newId = `prod-${Date.now()}`;
    const slug = product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    updatedProduct = {
      ...product,
      id: newId,
      slug,
      brand: product.brand || 'Aura Oud',
      subtitle: product.subtitle || 'Private Blend Collection',
      description: product.description || '',
      category: product.category || 'Extraits',
      collection: product.collection || 'Private Reserve',
      gender: product.gender || 'Unisex',
      concentration: product.concentration || 'Extrait de Parfum (30-35%)',
      longevity: product.longevity || 'Eternal (14+ hrs)',
      sillage: product.sillage || 'Heavy Projection',
      best_season: product.best_season || 'Autumn / Winter',
      maceration_days: product.maceration_days || 90,
      density_index: product.density_index || '0.940 g/cm³',
      vault_location: product.vault_location || { vault: 'Vault A', rack: 'Rack 01', bay: 'Shelf A1' },
      supplier: product.supplier || { name: 'Laboratoires Grasse Essences', location: 'Grasse, France', lead_time_days: 14 },
      families: product.families || ['Woody', 'Oriental'],
      moods: product.moods || ['Regal', 'Sensual'],
      occasions: product.occasions || ['Formal', 'Evening'],
      top_notes: product.top_notes || ['Bergamot', 'Saffron'],
      heart_notes: product.heart_notes || ['Rose', 'Cedarwood'],
      base_notes: product.base_notes || ['Oud', 'Amber'],
      ingredients: product.ingredients || 'Alcohol Denat., Parfum, Aqua.',
      images: product.images || {
        main: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85',
        hover: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=85',
        gallery: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85']
      },
      variants: product.variants || [
        {
          id: `var-${Date.now()}-100`,
          size_ml: 100,
          label: '100ml Flacon',
          sku: `AUR-${Math.floor(100 + Math.random() * 900)}`,
          price: 6500,
          cost_price: 2500,
          stock: 50,
          reserved: 0,
          low_stock_threshold: 20,
          barcode: `890${Math.floor(1000000000 + Math.random() * 9000000000)}`
        }
      ],
      rating: 5.0,
      review_count: 0,
      status: product.status || 'Published',
      created_at: new Date().toISOString().split('T')[0]
    } as Product;
    products.unshift(updatedProduct);
    await logAuditEvent('Product Created', `Added new fragrance spec "${updatedProduct.name}" (${updatedProduct.id})`);
  }

  setStored(STORAGE_KEYS.PRODUCTS, products);
  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<void> {
  const products = await getProducts();
  const filtered = products.filter(p => p.id !== id);
  setStored(STORAGE_KEYS.PRODUCTS, filtered);
  await logAuditEvent('Product Deleted', `Removed product ID ${id} from vault inventory`);
}

export async function adjustVariantStock(
  productId: string, 
  variantId: string, 
  delta: number, 
  reason: string
): Promise<{ product: Product; newStock: number }> {
  const products = await getProducts();
  const prod = products.find(p => p.id === productId);
  if (!prod) throw new Error('Product not found');

  const variant = prod.variants.find(v => v.id === variantId);
  if (!variant) throw new Error('Variant not found');

  const oldStock = variant.stock;
  const newStock = Math.max(0, oldStock + delta);
  variant.stock = newStock;

  setStored(STORAGE_KEYS.PRODUCTS, products);
  await logAuditEvent(
    'Stock Adjusted',
    `${prod.name} (${variant.sku}): ${oldStock} -> ${newStock} btls (Delta: ${delta >= 0 ? '+' : ''}${delta}). Reason: ${reason}`
  );

  return { product: prod, newStock };
}

// ---------------- ORDERS API ----------------
export async function getOrders(): Promise<Order[]> {
  await new Promise(r => setTimeout(r, 60));
  return getStored(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const orders = await getOrders();
  return orders.find(o => o.id === orderId || o.order_number === orderId) || null;
}

export async function createStorefrontOrder(params: {
  customer: { name: string; email: string; phone: string; is_guest: boolean };
  items: CartItem[];
  shippingAddress: ShippingAddress;
  deliveryMethod: 'Standard (3-5 days)' | 'Express (24-48 hrs)';
  paymentMethod: PaymentMethod;
  couponCode?: string;
  paymentProofUrl?: string;
  notes?: string;
}): Promise<Order> {
  const products = await getProducts();
  const orders = await getOrders();

  let subtotal = 0;
  const orderItems = params.items.map(cartItem => {
    // Deduct / reserve inventory
    const prod = products.find(p => p.id === cartItem.product.id);
    if (prod) {
      const v = prod.variants.find(v => v.id === cartItem.variant.id);
      if (v) {
        v.stock = Math.max(0, v.stock - cartItem.quantity);
        v.reserved = (v.reserved || 0) + cartItem.quantity;
      }
    }

    const price = cartItem.variant.sale_price || cartItem.variant.price;
    subtotal += price * cartItem.quantity;

    return {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      product_id: cartItem.product.id,
      product_name: cartItem.product.name,
      product_slug: cartItem.product.slug,
      variant_id: cartItem.variant.id,
      size_ml: cartItem.variant.size_ml,
      sku: cartItem.variant.sku,
      image: cartItem.product.images.main,
      price_snapshot: price,
      quantity: cartItem.quantity
    };
  });

  // Calculate discount
  let discount = 0;
  if (params.couponCode) {
    const couponValidation = await validateCoupon(params.couponCode, subtotal);
    if (couponValidation.valid) {
      discount = couponValidation.discount;
    }
  }

  // Shipping fee
  // Free delivery over PKR 5,000 threshold
  let shipping_fee = subtotal >= 5000 ? 0 : 250;
  if (params.deliveryMethod.includes('Express')) {
    shipping_fee = subtotal >= 8000 ? 0 : 450;
  }

  // COD handling fee
  const cod_fee = params.paymentMethod === 'Cash on Delivery' ? (subtotal > 8000 ? 0 : 150) : 0;
  const total = Math.max(0, subtotal - discount + shipping_fee + cod_fee);

  const orderNum = `ORD-${Math.floor(1000 + orders.length + 1)}`;
  const now = new Date().toISOString();

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    order_number: orderNum,
    created_at: now,
    customer: params.customer,
    items: orderItems,
    shipping_address: params.shippingAddress,
    delivery_method: params.deliveryMethod,
    subtotal,
    discount,
    shipping_fee,
    cod_fee,
    total,
    status: params.paymentMethod === 'Bank Transfer' ? 'Pending' : 'Confirmed',
    payment_method: params.paymentMethod,
    payment_status: params.paymentMethod === 'Bank Transfer' ? 'Awaiting Proof' : (params.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid'),
    payment_proof_url: params.paymentProofUrl,
    status_history: [
      {
        status: 'Pending',
        timestamp: now,
        note: `Order placed online via ${params.paymentMethod}`,
        actor: params.customer.name
      }
    ],
    notes: params.notes
  };

  if (params.paymentMethod !== 'Bank Transfer' && params.paymentMethod !== 'Cash on Delivery') {
    newOrder.status_history.push({
      status: 'Confirmed',
      timestamp: now,
      note: 'Payment authorized and settled',
      actor: 'Payment Gateway Adapter'
    });
  }

  orders.unshift(newOrder);
  setStored(STORAGE_KEYS.ORDERS, orders);
  setStored(STORAGE_KEYS.PRODUCTS, products);

  await logAuditEvent('New Order Created', `Order ${newOrder.order_number} created for ${params.customer.name} (PKR ${total.toLocaleString()})`);

  return newOrder;
}

export async function updateOrderStatus(
  orderId: string, 
  newStatus: OrderStatus, 
  note: string, 
  courier?: Courier, 
  trackingNumber?: string
): Promise<Order> {
  const orders = await getOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) throw new Error('Order not found');

  const oldStatus = order.status;
  order.status = newStatus;
  if (courier) order.courier = courier;
  if (trackingNumber) order.tracking_number = trackingNumber;

  if (newStatus === 'Delivered') {
    order.payment_status = 'Paid';
  }

  order.status_history.push({
    status: newStatus,
    timestamp: new Date().toISOString(),
    note: note || `Status transitioned from ${oldStatus} to ${newStatus}`,
    actor: 'Julian Vance (Admin)'
  });

  setStored(STORAGE_KEYS.ORDERS, orders);
  await logAuditEvent('Order Status Changed', `Order ${order.order_number} moved from ${oldStatus} to ${newStatus}`);

  return order;
}

// ---------------- POS REGISTER API ----------------
export async function executePOSTransaction(params: {
  items: { sku: string; quantity: number; unitPrice: number; name: string }[];
  customerName: string;
  vipDiscountPercent: number;
  tenderMethod: string;
}): Promise<{ invoiceNumber: string; grandTotal: number }> {
  const products = await getProducts();
  const orders = await getOrders();

  let subtotal = 0;
  for (const item of params.items) {
    subtotal += item.unitPrice * item.quantity;
    // Deduct inventory
    for (const prod of products) {
      const v = prod.variants.find(v => v.sku === item.sku);
      if (v) {
        v.stock = Math.max(0, v.stock - item.quantity);
      }
    }
  }

  const discountAmount = Math.round((subtotal * params.vipDiscountPercent) / 100);
  const tax = Math.round((subtotal - discountAmount) * 0.05); // 5% boutique GST
  const grandTotal = subtotal - discountAmount + tax;
  const invoiceNumber = `INV-2024-${Math.floor(800 + Math.random() * 199)}`;

  setStored(STORAGE_KEYS.PRODUCTS, products);

  // Record audit log
  await logAuditEvent(
    'POS Sale Finalized',
    `Vault POS Terminal 04 issued ${invoiceNumber} for ${params.customerName}. Deducted ${params.items.reduce((acc, i) => acc + i.quantity, 0)} bottles. Total: PKR ${grandTotal.toLocaleString()} (${params.tenderMethod})`
  );

  return { invoiceNumber, grandTotal };
}

// ---------------- COUPONS API ----------------
export async function getCoupons(): Promise<Coupon[]> {
  return getStored(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
}

export async function validateCoupon(
  code: string, 
  orderSubtotal: number
): Promise<{ valid: boolean; discount: number; message: string }> {
  const coupons = await getCoupons();
  const c = coupons.find(item => item.code.toUpperCase() === code.trim().toUpperCase());

  if (!c) {
    return { valid: false, discount: 0, message: 'Invalid fragrance promo code.' };
  }
  if (!c.is_active) {
    return { valid: false, discount: 0, message: 'This coupon has expired.' };
  }
  if (orderSubtotal < c.min_order_amount) {
    return { 
      valid: false, 
      discount: 0, 
      message: `Minimum order amount of PKR ${c.min_order_amount.toLocaleString()} required.` 
    };
  }

  let discount = 0;
  if (c.discount_type === 'percentage') {
    discount = Math.round((orderSubtotal * c.discount_value) / 100);
    if (c.max_discount_amount && discount > c.max_discount_amount) {
      discount = c.max_discount_amount;
    }
  } else if (c.discount_type === 'fixed') {
    discount = c.discount_value;
  } else if (c.discount_type === 'free_shipping') {
    discount = 250;
  }

  return { 
    valid: true, 
    discount, 
    message: `Promo code "${c.code}" applied: ${c.description}` 
  };
}

// ---------------- REVIEWS API ----------------
export async function getReviews(productId?: string): Promise<Review[]> {
  const reviews = getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  if (productId) {
    return reviews.filter(r => r.product_id === productId && r.status === 'Approved');
  }
  return reviews;
}

export async function submitReview(review: Omit<Review, 'id' | 'created_at' | 'helpful_votes' | 'status'>): Promise<Review> {
  const reviews = getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  const newReview: Review = {
    ...review,
    id: `rev-${Date.now()}`,
    created_at: new Date().toISOString().split('T')[0],
    helpful_votes: 0,
    status: 'Approved' // auto-approve for seamless test UX
  };
  reviews.unshift(newReview);
  setStored(STORAGE_KEYS.REVIEWS, reviews);
  return newReview;
}

// ---------------- CUSTOMERS API ----------------
export async function getCustomers(): Promise<Customer[]> {
  return getStored(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
}

export async function saveCustomer(customer: Partial<Customer> & { name: string; email: string }): Promise<Customer> {
  const customers = await getCustomers();
  const index = customers.findIndex(c => c.id === customer.id || c.email.toLowerCase() === customer.email.toLowerCase());

  let updated: Customer;
  if (index >= 0) {
    updated = { ...customers[index], ...customer };
    customers[index] = updated;
    await logAuditEvent('Customer Updated', `Updated profile & patron tier for "${updated.name}" (${updated.email})`);
  } else {
    updated = {
      id: customer.id || `cust-${Date.now()}`,
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '+92 300 0000000',
      city: customer.city || 'Karachi',
      tier: customer.tier || 'VIP Gold',
      total_spent: customer.total_spent || 0,
      order_count: customer.order_count || 0,
      created_at: new Date().toISOString().split('T')[0],
      addresses: customer.addresses || []
    };
    customers.unshift(updated);
    await logAuditEvent('Customer Created', `Enrolled new patron "${updated.name}" into VIP Registry`);
  }

  setStored(STORAGE_KEYS.CUSTOMERS, customers);
  return updated;
}

export async function deleteCustomer(id: string): Promise<void> {
  const customers = await getCustomers();
  const filtered = customers.filter(c => c.id !== id);
  setStored(STORAGE_KEYS.CUSTOMERS, filtered);
  await logAuditEvent('Customer Removed', `Removed patron account ID ${id} from registry`);
}

// ---------------- SUPPLIERS API (Grasse & International) ----------------
export async function getSuppliers(): Promise<SupplierRecord[]> {
  return getStored(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
}

export async function saveSupplier(supplier: Partial<SupplierRecord> & { name: string }): Promise<SupplierRecord> {
  const suppliers = await getSuppliers();
  const index = suppliers.findIndex(s => s.id === supplier.id);

  let updated: SupplierRecord;
  if (index >= 0) {
    updated = { ...suppliers[index], ...supplier };
    suppliers[index] = updated;
    await logAuditEvent('Supplier Updated', `Updated vendor profile & facility address for "${updated.name}" (${updated.code})`);
  } else {
    updated = {
      id: supplier.id || `supp-${Date.now()}`,
      name: supplier.name,
      code: supplier.code || `SUP-${Math.floor(100 + Math.random() * 900)}`,
      category: supplier.category || 'Raw Materials & Essences',
      contact_person: supplier.contact_person || 'Procurement Officer',
      email: supplier.email || 'contact@supplier.com',
      phone: supplier.phone || '+33 4 93 00 00 00',
      address: supplier.address || {
        street: 'Route de Cannes',
        district: 'Grasse Aromatique',
        city: 'Grasse',
        state_province: 'Côte d’Azur',
        postal_code: '06130',
        country: 'France'
      },
      lead_time_days: supplier.lead_time_days || 14,
      payment_terms: supplier.payment_terms || 'Net 30',
      minimum_order_quantity: supplier.minimum_order_quantity || '10 Litres',
      rating: supplier.rating || 5.0,
      status: supplier.status || 'Active',
      raw_materials: supplier.raw_materials || ['Agarwood Extracts', 'Rose Distillate']
    };
    suppliers.unshift(updated);
    await logAuditEvent('Supplier Added', `Registered new supplier partner "${updated.name}" with full address`);
  }

  setStored(STORAGE_KEYS.SUPPLIERS, suppliers);
  return updated;
}

export async function deleteSupplier(id: string): Promise<void> {
  const suppliers = await getSuppliers();
  const filtered = suppliers.filter(s => s.id !== id);
  setStored(STORAGE_KEYS.SUPPLIERS, filtered);
  await logAuditEvent('Supplier Deleted', `Removed supplier partner ID ${id}`);
}

// ---------------- EXPENSES & MARGINS API ----------------
export async function getExpenses(): Promise<ExpenseRecord[]> {
  return getStored(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
}

export async function saveExpense(expense: Partial<ExpenseRecord> & { title: string; amount_pkr: number }): Promise<ExpenseRecord> {
  const expenses = await getExpenses();
  const index = expenses.findIndex(e => e.id === expense.id);

  let updated: ExpenseRecord;
  if (index >= 0) {
    updated = { ...expenses[index], ...expense };
    expenses[index] = updated;
    await logAuditEvent('Expense Updated', `Updated cost record for "${updated.title}" - PKR ${updated.amount_pkr.toLocaleString()}`);
  } else {
    updated = {
      id: expense.id || `exp-${Date.now()}`,
      title: expense.title,
      category: expense.category || 'Raw Materials',
      supplier_name: expense.supplier_name || 'Grasse Essences',
      invoice_number: expense.invoice_number || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      date: expense.date || new Date().toISOString().split('T')[0],
      amount_pkr: expense.amount_pkr,
      payment_status: expense.payment_status || 'Paid',
      payment_method: expense.payment_method || 'Bank Wire',
      tax_amount_pkr: expense.tax_amount_pkr || Math.round(expense.amount_pkr * 0.05),
      notes: expense.notes || ''
    };
    expenses.unshift(updated);
    await logAuditEvent('Expense Created', `Logged new operational expense "${updated.title}" - PKR ${updated.amount_pkr.toLocaleString()}`);
  }

  setStored(STORAGE_KEYS.EXPENSES, expenses);
  return updated;
}

export async function deleteExpense(id: string): Promise<void> {
  const expenses = await getExpenses();
  const filtered = expenses.filter(e => e.id !== id);
  setStored(STORAGE_KEYS.EXPENSES, filtered);
  await logAuditEvent('Expense Removed', `Removed expense ledger entry ID ${id}`);
}

// ---------------- REPORTS API ----------------
export async function getReports(): Promise<ReportRecord[]> {
  return getStored(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
}

export async function saveReport(report: Partial<ReportRecord> & { title: string }): Promise<ReportRecord> {
  const reports = await getReports();
  const index = reports.findIndex(r => r.id === report.id);

  let updated: ReportRecord;
  if (index >= 0) {
    updated = { ...reports[index], ...report };
    reports[index] = updated;
    await logAuditEvent('Report Updated', `Modified report parameter for "${updated.title}"`);
  } else {
    updated = {
      id: report.id || `rep-${Date.now()}`,
      title: report.title,
      type: report.type || 'Sales Ledger',
      date_range: report.date_range || 'Current Month',
      generated_at: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      generated_by: report.generated_by || 'Tayyaba (Super Admin)',
      file_format: report.file_format || 'PDF',
      file_size_kb: report.file_size_kb || 350,
      records_count: report.records_count || 45,
      summary_metric: report.summary_metric || 'Verified by Atelier Intelligence',
      status: report.status || 'Ready'
    };
    reports.unshift(updated);
    await logAuditEvent('Report Generated', `Compiled new analytical report "${updated.title}"`);
  }

  setStored(STORAGE_KEYS.REPORTS, reports);
  return updated;
}

export async function deleteReport(id: string): Promise<void> {
  const reports = await getReports();
  const filtered = reports.filter(r => r.id !== id);
  setStored(STORAGE_KEYS.REPORTS, filtered);
  await logAuditEvent('Report Removed', `Deleted report archive ID ${id}`);
}

// ---------------- NOTIFICATIONS API ----------------
export async function getNotifications(): Promise<NotificationItem[]> {
  return getStored(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
}

export async function markNotificationRead(id: string): Promise<void> {
  const notifs = await getNotifications();
  const item = notifs.find(n => n.id === id);
  if (item) {
    item.read = true;
    setStored(STORAGE_KEYS.NOTIFICATIONS, notifs);
  }
}

export async function deleteNotification(id: string): Promise<void> {
  const notifs = await getNotifications();
  const filtered = notifs.filter(n => n.id !== id);
  setStored(STORAGE_KEYS.NOTIFICATIONS, filtered);
}

export async function clearAllNotifications(): Promise<void> {
  setStored(STORAGE_KEYS.NOTIFICATIONS, []);
}

export async function addNotification(notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): Promise<NotificationItem> {
  const notifs = await getNotifications();
  const newItem: NotificationItem = {
    ...notif,
    id: `notif-${Date.now()}`,
    timestamp: 'Just now',
    read: false
  };
  notifs.unshift(newItem);
  setStored(STORAGE_KEYS.NOTIFICATIONS, notifs);
  return newItem;
}

// ---------------- AUDIT LOGS ----------------
export async function getAuditLogs(): Promise<AuditLog[]> {
  return getStored(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
}

export async function logAuditEvent(action: string, details: string, actor: string = 'Julian Vance', role: string = 'Super Admin'): Promise<void> {
  const logs = getStored<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  const newLog: AuditLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    actor,
    role,
    action,
    target_entity: 'Atelier Ledger',
    details
  };
  logs.unshift(newLog);
  setStored(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 100)); // retain last 100
}
