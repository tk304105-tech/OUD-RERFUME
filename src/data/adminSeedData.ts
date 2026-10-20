import { SupplierRecord, ExpenseRecord, ReportRecord, NotificationItem } from '../types';

export const INITIAL_SUPPLIERS: SupplierRecord[] = [
  {
    id: 'supp-1',
    name: 'Laboratoires Grasse Essences S.A.',
    code: 'SUP-FRA-01',
    category: 'Raw Materials & Essences',
    contact_person: 'Jean-Luc Moreau (Master Distiller)',
    email: 'j.moreau@grasse-lab.fr',
    phone: '+33 4 93 36 12 40',
    address: {
      street: '42 Route de Cannes, Parc Industriel Aromatique',
      facility_unit: 'Distillerie Bâtiment C',
      district: 'Les Bois de Grasse',
      city: 'Grasse',
      state_province: 'Provence-Alpes-Côte d’Azur',
      postal_code: '06130',
      country: 'France'
    },
    lead_time_days: 14,
    payment_terms: 'Net 30 Days (EUR Wire)',
    minimum_order_quantity: '5 Litres (Extract Concentrate)',
    rating: 4.9,
    status: 'Active',
    raw_materials: ['Taif Rose Otto (Distillate)', 'French Bergamot Reggio', 'Bulgarian Lavender Absolute', 'Jasmine Grandiflorum']
  },
  {
    id: 'supp-2',
    name: 'Dehn Al Oud Tradings LLC',
    code: 'SUP-UAE-02',
    category: 'Raw Materials & Essences',
    contact_person: 'Sheikh Tariq Al-Hashimi',
    email: 'procurement@oudtradings.ae',
    phone: '+971 4 226 7890',
    address: {
      street: 'Al Ras Fragrance Souk, Sikkat Al Khail St.',
      facility_unit: 'Vault Suite 302, Gold & Oud Centre',
      district: 'Deira Heritage Quarter',
      city: 'Dubai',
      state_province: 'Dubai Emirate',
      postal_code: 'PO Box 41892',
      country: 'United Arab Emirates'
    },
    lead_time_days: 10,
    payment_terms: 'Direct TT / Escrow Transfer',
    minimum_order_quantity: '25 Tolas (Pure Dehn Al Oud)',
    rating: 5.0,
    status: 'Active',
    raw_materials: ['18-Year Aged Cambodian Oud', 'Wild Assam Agarwood Chips', 'Kalakassi Vintage Oud', 'Natural Ambergris Tincture']
  },
  {
    id: 'supp-3',
    name: 'Bormioli & Vetro Luigi Prestige Glass',
    code: 'SUP-ITA-03',
    category: 'Glass Flacons & Caps',
    contact_person: 'Matteo Rossi (Prestige Packaging Dir.)',
    email: 'm.rossi@bormioliprestige.it',
    phone: '+39 0521 7931 44',
    address: {
      street: 'Viale Leonardo da Vinci 16/A',
      facility_unit: 'Plant 4 - Precision Hot End Section',
      district: 'Zona Industriale San Leonardo',
      city: 'Parma',
      state_province: 'Emilia-Romagna',
      postal_code: '43122',
      country: 'Italy'
    },
    lead_time_days: 28,
    payment_terms: 'Letter of Credit / Net 45',
    minimum_order_quantity: '1,000 Flacons (Heavy Crystal)',
    rating: 4.8,
    status: 'Active',
    raw_materials: ['100ml Heavy Base Crystal Flacons', '50ml Travel Sprays', 'Zamac Magnetic Caps Gold', 'Micro-mist Brass Pumps']
  },
  {
    id: 'supp-4',
    name: 'Sindh Perfumers Solvent & Ethanol Distillers',
    code: 'SUP-PAK-04',
    category: 'Solvents & Alcohol',
    contact_person: 'Engr. Haris Tariq',
    email: 'procurement@sindhsolvents.pk',
    phone: '+92 21 3506 8812',
    address: {
      street: 'Plot 42-B, Sector 15, Brookes Road',
      facility_unit: 'Refinery Gate 2',
      district: 'Korangi Industrial Area',
      city: 'Karachi',
      state_province: 'Sindh',
      postal_code: '74900',
      country: 'Pakistan'
    },
    lead_time_days: 3,
    payment_terms: 'Cash Against Delivery / Meezan Bank Transfer',
    minimum_order_quantity: '200 Litres (Perfume Grade 99.8%)',
    rating: 4.7,
    status: 'Active',
    raw_materials: ['99.8% Perfume Grade Ethanol Denat.', 'Dipropylene Glycol (DPG High Purity)', 'Propylene Glycol USP', 'Deionized Distilled Water']
  },
  {
    id: 'supp-5',
    name: 'Amber & Botanicals Luxury Packaging Lahore',
    code: 'SUP-PAK-05',
    category: 'Packaging & Boxes',
    contact_person: 'Zeeshan Akhtar (Production Head)',
    email: 'contact@amberbotanicals.com.pk',
    phone: '+92 42 3582 4491',
    address: {
      street: '18-KM Ferozepur Road, Industrial Estate',
      facility_unit: 'Unit 9 - Rigid Box Section',
      district: 'Kahna Nau Industrial Park',
      city: 'Lahore',
      state_province: 'Punjab',
      postal_code: '54760',
      country: 'Pakistan'
    },
    lead_time_days: 7,
    payment_terms: '50% Advance / 50% on Delivery',
    minimum_order_quantity: '500 Rigid Boxes',
    rating: 4.6,
    status: 'Active',
    raw_materials: ['Velvet Flocked Rigid Presentation Boxes', 'Embossed Gold Hot-Foil Sleeves', 'Olfactive Blotter Strips (300 GSM)', 'Tamper Hologram Seals']
  }
];

export const INITIAL_EXPENSES: ExpenseRecord[] = [
  {
    id: 'exp-101',
    title: 'Cambodian Oud Absolute & Taif Rose Import Batch #77',
    category: 'Raw Materials',
    supplier_name: 'Laboratoires Grasse Essences S.A.',
    invoice_number: 'INV-FRA-8841',
    date: '2026-10-12',
    amount_pkr: 345000,
    payment_status: 'Paid',
    payment_method: 'Meezan Bank Wire',
    tax_amount_pkr: 17250,
    notes: 'Direct import of Grade A extracts for Oud Royale Extrait maceration.'
  },
  {
    id: 'exp-102',
    title: 'Custom Heavy Crystal 100ml Flacons & Magnetic Zamac Caps',
    category: 'Packaging & Bottles',
    supplier_name: 'Bormioli & Vetro Luigi Prestige Glass',
    invoice_number: 'INV-ITA-20419',
    date: '2026-10-08',
    amount_pkr: 220000,
    payment_status: 'Paid',
    payment_method: 'Bank Wire / LC',
    tax_amount_pkr: 11000,
    notes: '2,000 units of custom beveled heavy-base crystal bottles with champagne gold atomizer pumps.'
  },
  {
    id: 'exp-103',
    title: 'Wild Assam Agarwood Chips & Kalakassi Distillate',
    category: 'Raw Materials',
    supplier_name: 'Dehn Al Oud Tradings LLC',
    invoice_number: 'INV-DXB-902',
    date: '2026-10-04',
    amount_pkr: 195000,
    payment_status: 'Paid',
    payment_method: 'Direct TT Transfer',
    tax_amount_pkr: 9750,
    notes: 'Distillation of 500g wild agarwood chips for maceration vaults.'
  },
  {
    id: 'exp-104',
    title: 'High Purity 99.8% Perfume Grade Ethanol (500L)',
    category: 'Solvents & Alcohol' as any,
    supplier_name: 'Sindh Perfumers Solvent & Ethanol Distillers',
    invoice_number: 'INV-KHI-4401',
    date: '2026-10-14',
    amount_pkr: 88000,
    payment_status: 'Paid',
    payment_method: 'Cash / Bank Transfer',
    tax_amount_pkr: 4400,
    notes: 'Denatured with Bitrex & t-butyl alcohol under customs supervision.'
  },
  {
    id: 'exp-105',
    title: 'Velvet Flocked Gift Boxes & Gold Foil Sleeves',
    category: 'Packaging & Bottles',
    supplier_name: 'Amber & Botanicals Luxury Packaging Lahore',
    invoice_number: 'INV-LHR-3021',
    date: '2026-10-15',
    amount_pkr: 115000,
    payment_status: 'Due in 15 Days',
    payment_method: 'Cheque Pending',
    tax_amount_pkr: 5750,
    notes: 'Discovery Sets box production run and Signature Collection coffrets.'
  },
  {
    id: 'exp-106',
    title: 'TCS & Leopards Courier Express Nationwide Distribution',
    category: 'Logistics & Shipping',
    supplier_name: 'TCS Express Pakistan Logistics',
    invoice_number: 'INV-TCS-OCT26',
    date: '2026-10-17',
    amount_pkr: 64500,
    payment_status: 'Pending',
    payment_method: 'Corporate COD Billing',
    tax_amount_pkr: 3225,
    notes: 'Fulfillment and COD remittance charges for 180 parcels across Pakistan.'
  }
];

export const INITIAL_REPORTS: ReportRecord[] = [
  {
    id: 'rep-01',
    title: 'October 2026 Monthly Sales & Revenue Audit',
    type: 'Sales Ledger',
    date_range: 'Oct 01, 2026 - Oct 19, 2026',
    generated_at: '2026-10-19 11:30 AM',
    generated_by: 'Tayyaba (Super Admin)',
    file_format: 'PDF',
    file_size_kb: 480,
    records_count: 142,
    summary_metric: 'Gross Revenue: PKR 1,842,500 · Margin: 63.4%',
    status: 'Ready'
  },
  {
    id: 'rep-02',
    title: 'Vault Inventory Stock Valuation & Reorder Thresholds',
    type: 'Stock Valuation',
    date_range: 'As of Today (Real-time)',
    generated_at: '2026-10-19 09:15 AM',
    generated_by: 'Inventory Vault Automation',
    file_format: 'CSV',
    file_size_kb: 215,
    records_count: 12,
    summary_metric: 'Total Inventory Valuation: PKR 3,920,000 · 3 Low Stock Flags',
    status: 'Ready'
  },
  {
    id: 'rep-03',
    title: 'Outbound Courier & COD Settlement Reconciliations',
    type: 'Outbound Courier',
    date_range: 'Last 14 Days (Oct 05 - Oct 19)',
    generated_at: '2026-10-18 04:00 PM',
    generated_by: 'Julian Vance',
    file_format: 'XLSX',
    file_size_kb: 340,
    records_count: 88,
    summary_metric: '100% Delivery Success Rate · TCS & Leopards',
    status: 'Ready'
  },
  {
    id: 'rep-04',
    title: 'Fragrance Maceration & Extract Yield Audit',
    type: 'Margin & Profitability',
    date_range: 'Q3 - Q4 2026',
    generated_at: '2026-10-16 02:45 PM',
    generated_by: 'Atelier Formula Lab',
    file_format: 'PDF',
    file_size_kb: 610,
    records_count: 24,
    summary_metric: 'Average Extrait Profit Margin: 68.2%',
    status: 'Ready'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Low Stock Critical Warning',
    message: 'Velvet Rose Eau de Parfum (100ml) has only 4 flacons remaining in Vault A, below the reorder threshold of 20.',
    category: 'inventory',
    severity: 'high',
    timestamp: '10 minutes ago',
    read: false,
    action_label: 'Adjust Stock / Reorder'
  },
  {
    id: 'notif-2',
    title: 'Bank Wire Proof Pending Verification',
    message: 'Patron Hamza Tariq uploaded bank receipt proof for order #AUR-8921 (PKR 14,200). Verification needed.',
    category: 'orders',
    severity: 'high',
    timestamp: '25 minutes ago',
    read: false,
    action_label: 'Verify Wire Proof'
  },
  {
    id: 'notif-3',
    title: 'New VIP Patron Account Created',
    message: 'Dr. Ayesha Malik has registered an account with the Atelier and placed her first signature discovery order.',
    category: 'orders',
    severity: 'low',
    timestamp: '2 hours ago',
    read: true,
    action_label: 'View Customer Profile'
  },
  {
    id: 'notif-4',
    title: 'Low Stock Alert: Imperial Santal 50ml',
    message: 'Imperial Santal 50ml stock is down to 8 units. Supplier lead time is 14 days from Grasse.',
    category: 'inventory',
    severity: 'high',
    timestamp: '4 hours ago',
    read: false,
    action_label: 'Contact Grasse Supplier'
  },
  {
    id: 'notif-5',
    title: 'Security Vault Log Access Verified',
    message: 'Super Admin Tayyaba (tk304105@gmail.com) authenticated successfully into the Atelier IMS.',
    category: 'security',
    severity: 'low',
    timestamp: 'Today 08:30 AM',
    read: true
  }
];
