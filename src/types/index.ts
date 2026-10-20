export type Gender = 'Men' | 'Women' | 'Unisex';

export type FragranceFamily = 
  | 'Woody' 
  | 'Oriental' 
  | 'Floral' 
  | 'Fresh' 
  | 'Gourmand' 
  | 'Musk' 
  | 'Spicy' 
  | 'Aquatic';

export type Concentration = 
  | 'Extrait de Parfum (30-35%)' 
  | 'Eau de Parfum (18-20%)' 
  | 'Cologne Intense' 
  | 'Pure Attar / Concentrated Oil';

export type LongevityRating = 'Moderate (6-8 hrs)' | 'Long Lasting (8-12 hrs)' | 'Eternal (14+ hrs)';
export type SillageRating = 'Intimate' | 'Moderate' | 'Heavy Projection' | 'Enormous (Room-filling)';

export interface ProductVariant {
  id: string;
  size_ml: number;
  label: string;
  sku: string;
  price: number; // in PKR
  sale_price?: number;
  cost_price: number;
  stock: number;
  reserved: number;
  low_stock_threshold: number;
  barcode: string;
}

export interface FragranceNote {
  name: string;
  category: 'Top' | 'Heart' | 'Base';
  volatilityInfo?: string;
  diffusionType?: string;
  colorSwatch?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  subtitle: string;
  description: string;
  category: 'Extraits' | 'EDPs' | 'Attars' | 'Discovery' | 'Testers';
  collection: 'Private Reserve' | 'Heritage Oud' | 'Atelier Florals' | 'Summer Reserve' | 'Master Distillates';
  gender: Gender;
  concentration: Concentration;
  longevity: LongevityRating;
  sillage: SillageRating;
  best_season: string;
  maceration_days: number;
  density_index: string;
  vault_location: {
    vault: string;
    rack: string;
    bay: string;
  };
  supplier: {
    name: string;
    location: string;
    lead_time_days: number;
  };
  families: FragranceFamily[];
  moods: string[];
  occasions: string[];
  top_notes: string[];
  heart_notes: string[];
  base_notes: string[];
  ingredients: string;
  allergen_notice?: string;
  how_to_use?: string;
  images: {
    main: string;
    hover: string;
    gallery: string[];
    lifestyle?: string;
  };
  variants: ProductVariant[];
  rating: number;
  review_count: number;
  badge?: 'Best Seller' | 'New Arrival' | 'Atelier Flagship' | 'Limited Stock' | 'Rare Vintage';
  is_featured?: boolean;
  status: 'Published' | 'Draft' | 'Archived';
  created_at: string;
}

export type OrderStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'Processing' 
  | 'Shipped' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Cancelled' 
  | 'Returned';

export type PaymentMethod = 
  | 'Cash on Delivery' 
  | 'Bank Transfer' 
  | 'JazzCash' 
  | 'Easypaisa' 
  | 'Credit/Debit Card';

export type PaymentStatus = 'Pending' | 'Awaiting Proof' | 'Verified' | 'Paid' | 'Failed' | 'Refunded';

export type Courier = 'TCS' | 'Leopards' | 'Trax' | 'PostEx';

export interface ShippingAddress {
  name: string;
  phone: string;
  province: string;
  city: string;
  address_line: string;
  postal_code?: string;
  special_instructions?: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_slug: string;
  variant_id: string;
  size_ml: number;
  sku: string;
  image: string;
  price_snapshot: number;
  quantity: number;
}

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note: string;
  actor: string;
}

export interface Order {
  id: string;
  order_number: string;
  created_at: string;
  customer: {
    id?: string;
    name: string;
    email: string;
    phone: string;
    is_guest: boolean;
  };
  items: OrderItem[];
  shipping_address: ShippingAddress;
  delivery_method: 'Standard (3-5 days)' | 'Express (24-48 hrs)';
  subtotal: number;
  discount: number;
  shipping_fee: number;
  cod_fee: number;
  total: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_proof_url?: string;
  courier?: Courier;
  tracking_number?: string;
  status_history: OrderStatusHistoryItem[];
  notes?: string;
}

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface Coupon {
  code: string;
  discount_type: 'percentage' | 'fixed' | 'free_shipping';
  discount_value: number; // percentage or PKR amount
  min_order_amount: number;
  max_discount_amount?: number;
  is_active: boolean;
  usage_count: number;
  description: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_name: string;
  user_city?: string;
  rating: number;
  title: string;
  body: string;
  is_verified_purchase: boolean;
  helpful_votes: number;
  created_at: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  tier: 'VIP Gold' | 'Platinum Connoisseur' | 'Patron' | 'New Client';
  total_spent: number;
  order_count: number;
  created_at: string;
  addresses: ShippingAddress[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  target_entity: string;
  details: string;
}

export type AdminRole = 
  | 'Super Admin' 
  | 'Manager' 
  | 'Inventory Manager' 
  | 'Order Manager' 
  | 'Content Manager';

export interface UserRolePermissions {
  canViewDashboard: boolean;
  canManageProducts: boolean;
  canEditPrices: boolean;
  canManageInventory: boolean;
  canManageOrders: boolean;
  canIssueRefunds: boolean;
  canManageCustomers: boolean;
  canManageCoupons: boolean;
  canManageContent: boolean;
  canAccessSettings: boolean;
  canViewAuditLogs: boolean;
}

export interface AdminAccount {
  email: string;
  name: string;
  role: AdminRole;
  lastLogin?: string;
}

export interface SupplierAddress {
  street: string;
  facility_unit?: string;
  district: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
}

export interface SupplierRecord {
  id: string;
  name: string;
  code: string;
  category: 'Raw Materials & Essences' | 'Glass Flacons & Caps' | 'Solvents & Alcohol' | 'Packaging & Boxes';
  contact_person: string;
  email: string;
  phone: string;
  address: SupplierAddress;
  lead_time_days: number;
  payment_terms: string;
  minimum_order_quantity: string;
  rating: number;
  status: 'Active' | 'Pending Review' | 'Inactive';
  raw_materials: string[];
}

export interface ExpenseRecord {
  id: string;
  title: string;
  category: 'Raw Materials' | 'Packaging & Bottles' | 'Lab Distillation' | 'Logistics & Shipping' | 'Marketing & Studio' | 'Facility & Vault';
  supplier_name: string;
  invoice_number: string;
  date: string;
  amount_pkr: number;
  payment_status: 'Paid' | 'Pending' | 'Due in 15 Days';
  payment_method: string;
  tax_amount_pkr: number;
  notes?: string;
}

export interface ReportRecord {
  id: string;
  title: string;
  type: 'Sales Ledger' | 'Stock Valuation' | 'Low Stock Audit' | 'Margin & Profitability' | 'Outbound Courier' | 'Custom Audit';
  date_range: string;
  generated_at: string;
  generated_by: string;
  file_format: 'CSV' | 'PDF' | 'XLSX';
  file_size_kb: number;
  records_count: number;
  summary_metric: string;
  status: 'Ready' | 'Generating' | 'Archived';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'inventory' | 'orders' | 'security' | 'system';
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  read: boolean;
  action_url?: string;
  action_label?: string;
}


