import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Boxes, 
  Banknote, 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  Sliders, 
  Share2, 
  Receipt, 
  Hourglass, 
  Check, 
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  History
} from 'lucide-react';

interface AdminDashboardProps {
  onOpenAddProduct: () => void;
  onOpenStockAdjust: () => void;
}

export function AdminDashboard({ onOpenAddProduct, onOpenStockAdjust }: AdminDashboardProps) {
  const { setAdminView, formatPKR, products, orders, showToast, adminUser } = useApp();
  const [chartGranularity, setChartGranularity] = useState<'today' | 'week' | 'month' | 'custom'>('today');

  const handleExportSummary = () => {
    showToast('Executive ledger summary exported to PDF/CSV.', 'success');
  };

  const adminDisplayName = adminUser?.name || 'Tayyaba';

  // Real-time inventory metrics calculation
  const totalProductsCount = products.length;
  const totalStockUnits = products.reduce((sum, p) => sum + p.variants.reduce((vSum, v) => vSum + v.stock, 0), 0);
  const totalStockVal = products.reduce((sum, p) => sum + p.variants.reduce((vSum, v) => vSum + (v.price * v.stock), 0), 0);
  const outOfStockItems = products.filter(p => p.variants.every(v => v.stock <= 0)).length;
  const lowStockItems = products.filter(p => p.variants.some(v => v.stock > 0 && v.stock <= v.low_stock_threshold)).length;

  return (
    <div className="flex flex-col w-full bg-[#111418] text-[#e1e2e8] min-h-screen">
      
      {/* Ambient Atmospheric Glow */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-32 right-1/4 w-96 h-96 bg-[#ffe09d]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-96 -left-20 w-80 h-80 bg-[#e9c176]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="px-6 py-6 space-y-6">
          
          {/* Top Executive Control Bar */}
          <section className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 pb-2 border-b border-[#4d4639]/30">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#1e231a] border border-[#2d4a22] text-[#4ade80] text-[10px] font-mono-data uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse"></span>
                  <span>Real-Time Inventory Live Sync Active</span>
                </div>
                <span className="text-[#999080] font-mono-data text-[10px]">· Updated just now</span>
              </div>
              <h1 className="font-syne text-3xl sm:text-4xl font-bold text-[#e1e2e8] tracking-tight">
                Good Morning, {adminDisplayName}
              </h1>
              <p className="text-xs text-[#d0c5b4] font-mono-data max-w-2xl">
                Real-time perfume inventory status, stock health, and revenue pulse across all bonded cellars and retail suites.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Vault & Date Selector Plinth */}
              <div className="flex items-center gap-2 px-3 h-10 bg-[#191c20] border border-[#4d4639]/40 text-xs font-mono-data">
                <Calendar className="w-4 h-4 text-[#ffe09d]" />
                <span className="text-[#e1e2e8] font-medium">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span className="text-[#4d4639] px-1">/</span>
                <span className="text-[#e9c176] uppercase font-bold text-[10px] tracking-wider">All Vaults (LHR · KHI)</span>
              </div>

              {/* Secondary Filter Trigger */}
              <button
                type="button"
                onClick={() => setAdminView('inventory-list')}
                className="h-10 px-3 bg-[#191c20] hover:bg-[#272a2e] border border-[#4d4639]/40 text-[#e1e2e8] transition-colors flex items-center gap-2 font-mono-data text-xs uppercase"
              >
                <Sliders className="w-3.5 h-3.5 text-[#999080]" />
                <span>Filters</span>
              </button>

              {/* Primary Action Button */}
              <button
                type="button"
                onClick={handleExportSummary}
                className="h-10 px-5 bg-[#ffe09d] text-[#251a00] hover:bg-[#e5c378] transition-all flex items-center gap-2 font-syne text-xs uppercase font-bold shadow-md"
              >
                <Share2 className="w-4 h-4" />
                <span>Export Executive Summary</span>
              </button>
            </div>
          </section>

          {/* KPI Metric Matrix: 6 High-Impact Architectural Tiles */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-3">
            
            {/* Tile 1: Total Products */}
            <div 
              onClick={() => setAdminView('inventory-list')}
              className="p-4 bg-[#191c20] border border-[#4d4639]/30 flex flex-col justify-between hover:bg-[#272a2e] transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="w-4 h-0.5 bg-[#ffe09d] mb-1.5"></div>
                  <span className="font-mono-data text-[10px] uppercase text-[#999080] tracking-wider">Total Products</span>
                </div>
                <span className="font-mono-data text-xs text-[#999080] group-hover:text-[#ffe09d]">{totalProductsCount} SKUs</span>
              </div>
              <div className="mt-4">
                <div className="font-syne text-2xl font-bold text-[#e1e2e8] tracking-tight">{totalProductsCount}</div>
                <div className="flex items-center gap-1.5 mt-1 font-mono-data text-[11px]">
                  <span className="text-[#e9c176] font-semibold">Live Catalogue</span>
                  <span className="text-[#999080]">· 100% active</span>
                </div>
              </div>
            </div>

            {/* Tile 2: Stock Units */}
            <div 
              onClick={() => setAdminView('inventory-list')}
              className="p-4 bg-[#191c20] border border-[#4d4639]/30 flex flex-col justify-between hover:bg-[#272a2e] transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="w-4 h-0.5 bg-[#e9c176] mb-1.5"></div>
                  <span className="font-mono-data text-[10px] uppercase text-[#999080] tracking-wider">Stock Units</span>
                </div>
                <Boxes className="w-4 h-4 text-[#999080] group-hover:text-[#e9c176]" />
              </div>
              <div className="mt-4">
                <div className="font-syne text-2xl font-bold text-[#e1e2e8] tracking-tight">
                  {totalStockUnits.toLocaleString()} <span className="text-xs font-mono-data text-[#999080] font-normal">btls</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 font-mono-data text-[11px]">
                  <span className="text-[#dee3ee]">Real-time balance</span>
                </div>
              </div>
            </div>

            {/* Tile 3: Total Stock Value */}
            <div className="p-4 bg-[#191c20] border border-[#4d4639]/30 flex flex-col justify-between hover:bg-[#272a2e] transition-colors">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="w-4 h-0.5 bg-[#ffdf9b] mb-1.5"></div>
                  <span className="font-mono-data text-[10px] uppercase text-[#999080] tracking-wider">Total Stock Value</span>
                </div>
                <span className="text-xs font-mono-data text-[#ffe09d]">MSRP</span>
              </div>
              <div className="mt-4">
                <div className="font-syne text-2xl font-bold text-[#ffe09d] tracking-tight">
                  {totalStockVal >= 1000000 ? `Rs. ${(totalStockVal / 1000000).toFixed(2)}M` : formatPKR(totalStockVal)}
                </div>
                <div className="flex items-center gap-1.5 mt-1 font-mono-data text-[11px]">
                  <span className="text-[#e9c176] font-semibold">Active Vault Worth</span>
                </div>
              </div>
            </div>

            {/* Tile 4: Out of Stock Alerts */}
            <div 
              onClick={() => setAdminView('inventory-list')}
              className="p-4 bg-[#191c20] border border-[#4d4639]/30 flex flex-col justify-between hover:bg-[#272a2e] transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="w-4 h-0.5 bg-[#ef4444] mb-1.5"></div>
                  <span className="font-mono-data text-[10px] uppercase text-[#999080] tracking-wider">Out of Stock</span>
                </div>
                <AlertTriangle className="w-4 h-4 text-[#ef4444]" />
              </div>
              <div className="mt-4">
                <div className="font-syne text-2xl font-bold text-[#ef4444] tracking-tight">{outOfStockItems} SKUs</div>
                <div className="flex items-center gap-1.5 mt-1 font-mono-data text-[11px]">
                  <span className="text-[#999080]">Requires replenishment</span>
                </div>
              </div>
            </div>

            {/* Tile 5: Low Stock Alerts */}
            <div 
              onClick={() => setAdminView('inventory-list')}
              className="p-4 bg-[#191c20] border border-[#4d4639]/30 flex flex-col justify-between hover:bg-[#272a2e] transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="w-4 h-0.5 bg-[#f59e0b] mb-1.5"></div>
                  <span className="font-mono-data text-[10px] uppercase text-[#999080] tracking-wider">Low Stock Warnings</span>
                </div>
                <Hourglass className="w-4 h-4 text-[#f59e0b]" />
              </div>
              <div className="mt-4">
                <div className="font-syne text-2xl font-bold text-[#f59e0b] tracking-tight">{lowStockItems} SKUs</div>
                <div className="flex items-center gap-1.5 mt-1 font-mono-data text-[11px]">
                  <span className="text-[#999080]">Below threshold</span>
                </div>
              </div>
            </div>

            {/* Tile 6: Total Orders */}
            <div 
              onClick={() => setAdminView('purchases-orders')}
              className="p-4 bg-[#191c20] border border-[#4d4639]/30 flex flex-col justify-between hover:bg-[#272a2e] transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="w-4 h-0.5 bg-[#e9c176] mb-1.5"></div>
                  <span className="font-mono-data text-[10px] uppercase text-[#999080] tracking-wider">Total Orders</span>
                </div>
                <Receipt className="w-4 h-4 text-[#999080] group-hover:text-[#ffe09d]" />
              </div>
              <div className="mt-4">
                <div className="font-syne text-2xl font-bold text-[#e1e2e8] tracking-tight">{orders.length}</div>
                <div className="flex items-center gap-1.5 mt-1 font-mono-data text-[11px]">
                  <span className="text-[#e9c176] font-semibold">Live Dispatch Queue</span>
                </div>
              </div>
            </div>

          </section>

          {/* Main Split Workspace: 65% / 35% Grid */}

          {/* Main Split Workspace: 65% / 35% Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column (8 Cols): Charts, Urgent Action Center, Real-Time Movements */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* SECTION 1: INVENTORY & SALES REAL-TIME MOVEMENT (Interactive Precision SVG Graph) */}
              <div className="p-6 bg-[#191c20] border border-[#4d4639]/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#4d4639]/20">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#ffe09d]"></span>
                      <h2 className="font-syne text-lg font-bold text-[#e1e2e8] tracking-tight">
                        Revenue & Velocity Cadence
                      </h2>
                    </div>
                    <p className="text-xs text-[#999080] font-mono-data">
                      Real-time hourly volume & turnover aggregate across luxury boutique retail and trade distribution
                    </p>
                  </div>

                  {/* Time Granularity Selector */}
                  <div className="inline-flex bg-[#0b0e12] p-0.5">
                    {(['today', 'week', 'month', 'custom'] as const).map(tab => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setChartGranularity(tab)}
                        className={`px-3 py-1 font-mono-data text-[10px] uppercase font-bold transition-all ${
                          chartGranularity === tab 
                            ? 'bg-[#ffe09d] text-[#251a00] shadow-sm' 
                            : 'text-[#999080] hover:text-[#e1e2e8]'
                        }`}
                      >
                        {tab === 'today' ? 'Today' : tab === 'week' ? 'This Week' : tab === 'month' ? 'Month' : 'Custom'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mini Spec Ribbon */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 bg-[#1d2024] px-4 font-mono-data text-xs">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#999080] block">Peak Hour Velocity</span>
                    <span className="text-[#e1e2e8] font-bold">14:00 - 15:00 (+42k)</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#999080] block">Dispatched Batches</span>
                    <span className="text-[#e1e2e8] font-bold">19 Bottles (7 Orders)</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#999080] block">Gross Margin Pulse</span>
                    <span className="text-[#e9c176] font-bold">67.4% Today</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#999080] block">Depletion Run-Rate</span>
                    <span className="text-[#ffe09d] font-bold">3.8 btls / hr</span>
                  </div>
                </div>

                {/* Interactive SVG Chart Curve */}
                <div className="relative w-full h-64 pt-4">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                    <div className="w-full h-px bg-[#999080]"></div>
                    <div className="w-full h-px bg-[#999080]"></div>
                    <div className="w-full h-px bg-[#999080]"></div>
                    <div className="w-full h-px bg-[#999080]"></div>
                    <div className="w-full h-px bg-[#999080]"></div>
                  </div>

                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 220">
                    <defs>
                      <linearGradient id="primaryGlow" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#ffe09d" stopOpacity="0.35"></stop>
                        <stop offset="100%" stopColor="#ffe09d" stopOpacity="0.0"></stop>
                      </linearGradient>
                      <linearGradient id="secondaryArea" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#e9c176" stopOpacity="0.18"></stop>
                        <stop offset="100%" stopColor="#e9c176" stopOpacity="0.0"></stop>
                      </linearGradient>
                    </defs>

                    {/* Comparative Previous Period Curve */}
                    <path d="M 0 170 Q 100 160 200 150 T 400 130 T 600 90 T 800 70 L 800 220 L 0 220 Z" fill="url(#secondaryArea)" opacity="0.5"></path>
                    <path d="M 0 170 Q 100 160 200 150 T 400 130 T 600 90 T 800 70" fill="none" opacity="0.6" stroke="#999080" strokeDasharray="3 3" strokeWidth="1.5"></path>

                    {/* Current High-Intensity Curve */}
                    <path d="M 0 190 C 80 185, 120 160, 200 135 C 280 110, 320 140, 400 80 C 480 20, 560 90, 640 45 C 720 0, 760 30, 800 15 L 800 220 L 0 220 Z" fill="url(#primaryGlow)"></path>
                    <path d="M 0 190 C 80 185, 120 160, 200 135 C 280 110, 320 140, 400 80 C 480 20, 560 90, 640 45 C 720 0, 760 30, 800 15" fill="none" stroke="#ffe09d" strokeWidth="2.5"></path>

                    {/* Sharp Zero-Radius Anchor Points */}
                    <rect x="196" y="131" width="8" height="8" fill="#ffe09d" className="shadow-sm"></rect>
                    <rect x="396" y="76" width="8" height="8" fill="#ffe09d" className="shadow-sm"></rect>
                    <rect x="636" y="41" width="8" height="8" fill="#ffe09d" className="shadow-sm"></rect>
                    <rect x="794" y="11" width="8" height="8" fill="#ffe09d" className="shadow-sm"></rect>
                  </svg>

                  {/* Chart X-Axis Markings */}
                  <div className="flex justify-between font-mono-data text-[11px] text-[#999080] pt-2">
                    <span>08:00</span>
                    <span>10:00</span>
                    <span>12:00</span>
                    <span>14:00 (Peak)</span>
                    <span>16:00</span>
                    <span>18:00</span>
                    <span>20:00 (Now)</span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: URGENT INVENTORY ACTION CENTER */}
              <div className="bg-[#191c20] border border-[#4d4639]/30 overflow-hidden">
                <div className="p-4 bg-[#1d2024] flex flex-wrap items-center justify-between gap-3 border-b border-[#4d4639]/20">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#ffb4ab]" />
                    <h3 className="font-syne text-sm uppercase tracking-wider font-bold text-[#e1e2e8]">
                      Urgent Inventory Action Center
                    </h3>
                    <span className="px-2 py-0.5 bg-[#93000a] text-[#ffdad6] font-mono-data text-[11px] font-bold">
                      3 CRITICAL LOTS
                    </span>
                  </div>
                  <button
                    onClick={() => setAdminView('inventory-list')}
                    className="font-mono-data text-[11px] uppercase text-[#e9c176] hover:text-[#ffe09d] flex items-center gap-1"
                  >
                    <span>View Full Alert Log</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Formulation Ledger Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse font-mono-data text-xs">
                    <thead>
                      <tr className="bg-[#0b0e12] text-[#999080] uppercase text-[10px] tracking-wider">
                        <th className="py-2.5 px-4">Product / Formulation Spec</th>
                        <th className="py-2.5 px-3 text-center">Batch Lot</th>
                        <th className="py-2.5 px-3 text-right">Available</th>
                        <th className="py-2.5 px-3 text-right">Safety Min</th>
                        <th className="py-2.5 px-4">Primary Supplier</th>
                        <th className="py-2.5 px-4 text-right">Direct Resolution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#323539]/40 text-[#e1e2e8]">
                      {/* Row 1: Oud Royale */}
                      <tr className="hover:bg-[#1d2024] transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#ffe09d]">Oud Royale Extrait 100ml</div>
                          <div className="text-[10px] text-[#999080]">SKU: OUD-ROY-100 · Extrait (35%)</div>
                        </td>
                        <td className="py-3 px-3 text-center text-[#999080]">#LT-8910-B</td>
                        <td className="py-3 px-3 text-right">
                          <span className="px-2 py-0.5 bg-[#604403] text-[#e9c176] font-bold">2 units</span>
                        </td>
                        <td className="py-3 px-3 text-right text-[#999080]">25 units</td>
                        <td className="py-3 px-4 text-[#d0c5b4]">Grasse Essences SARL</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={onOpenStockAdjust}
                            className="px-3 py-1.5 bg-[#ffe09d] text-[#251a00] hover:bg-[#e5c378] text-[10px] uppercase font-bold tracking-wider"
                          >
                            Reorder Stock
                          </button>
                        </td>
                      </tr>

                      {/* Row 2: Velvet Rose */}
                      <tr className="hover:bg-[#1d2024] transition-colors bg-[#93000a]/10">
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#ffb4ab]">Velvet Rose EDP 50ml</div>
                          <div className="text-[10px] text-[#ffdad6]">SKU: VLV-ROS-050 · Out of Stock Alert</div>
                        </td>
                        <td className="py-3 px-3 text-center text-[#999080]">#LT-7201-A</td>
                        <td className="py-3 px-3 text-right">
                          <span className="px-2 py-0.5 bg-[#93000a] text-[#ffdad6] font-bold">0 units</span>
                        </td>
                        <td className="py-3 px-3 text-right text-[#999080]">20 units</td>
                        <td className="py-3 px-4 text-[#d0c5b4]">Anatolian Floral Co.</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={onOpenStockAdjust}
                            className="px-3 py-1.5 bg-[#93000a] text-[#ffdad6] hover:bg-[#ffb4ab] hover:text-[#251a00] text-[10px] uppercase font-bold tracking-wider"
                          >
                            Create PO
                          </button>
                        </td>
                      </tr>

                      {/* Row 3: Amber Noir */}
                      <tr className="hover:bg-[#1d2024] transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#e9c176]">Amber Noir Pure Attar 12ml</div>
                          <div className="text-[10px] text-[#999080]">SKU: AMB-NOI-012 · Non-Alcoholic Oil</div>
                        </td>
                        <td className="py-3 px-3 text-center text-[#999080]">#LT-9944-X</td>
                        <td className="py-3 px-3 text-right">
                          <span className="px-2 py-0.5 bg-[#604403] text-[#e9c176] font-bold">4 units</span>
                        </td>
                        <td className="py-3 px-3 text-right text-[#999080]">30 units</td>
                        <td className="py-3 px-4 text-[#d0c5b4]">Kannauj Heritage Distillers</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={onOpenStockAdjust}
                            className="px-3 py-1.5 bg-[#323539] text-[#e1e2e8] hover:bg-[#ffe09d] hover:text-[#251a00] text-[10px] uppercase font-bold tracking-wider"
                          >
                            Reorder Stock
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION 3: QUICK INVENTORY MOVEMENTS FEED */}
              <div className="p-6 bg-[#191c20] border border-[#4d4639]/30 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#4d4639]/20 font-mono-data">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-[#dee3ee]" />
                    <h3 className="font-syne text-xs uppercase tracking-widest font-bold text-[#e1e2e8]">
                      Recent Inventory Ledger Entries
                    </h3>
                  </div>
                  <span className="text-[11px] text-[#999080]">LIVE FEED SYNCED</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono-data text-xs">
                  <div className="p-3 bg-[#1d2024] border border-[#4d4639]/20 flex items-start gap-3">
                    <div className="w-7 h-7 bg-[#323539] flex items-center justify-center text-[#ffe09d] flex-shrink-0">
                      <Receipt className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[#e9c176] font-bold">#ORD-1024</span>
                        <span className="text-[#ffb4ab] font-bold">-3 bottles</span>
                      </div>
                      <p className="text-[#e1e2e8] text-xs truncate">Sale via Dubai Boutique Suite POS</p>
                      <span className="text-[10px] text-[#999080]">12 mins ago · Cashier POS-02</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#1d2024] border border-[#4d4639]/20 flex items-start gap-3">
                    <div className="w-7 h-7 bg-[#323539] flex items-center justify-center text-[#2EE59D] flex-shrink-0">
                      <Boxes className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[#ffe09d] font-bold">#PO-882</span>
                        <span className="text-[#2EE59D] font-bold">+120 bottles</span>
                      </div>
                      <p className="text-[#e1e2e8] text-xs truncate">Received Royal Santal EDP 100ml</p>
                      <span className="text-[10px] text-[#999080]">48 mins ago · Main bonded vault</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (4 Cols): Leaderboards, Spectrum & Quick Hub */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* COMPONENT 1: BEST-SELLING PERFUME LEADERBOARD */}
              <div className="p-5 bg-[#191c20] border border-[#4d4639]/30 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#4d4639]/20 font-mono-data">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#ffe09d]"></span>
                      <h3 className="font-syne text-xs uppercase tracking-widest font-bold text-[#e1e2e8]">
                        Top Performer Guild
                      </h3>
                    </div>
                    <p className="text-[11px] text-[#999080]">Ranked by volumetric yield & revenue</p>
                  </div>
                  <span className="text-xs text-[#ffe09d] font-bold">#1 REVENUE</span>
                </div>

                {/* Perfume Visual Showcase Micro-card */}
                <div className="relative h-28 bg-[#0b0e12] overflow-hidden flex items-end p-3 border border-[#4d4639]/40">
                  <img
                    src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80"
                    alt="Oud Royale"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                  />
                  <div className="relative z-10 w-full flex items-end justify-between bg-[#0b0e12]/85 p-2 backdrop-blur-sm">
                    <div>
                      <span className="font-mono-data text-[9px] uppercase tracking-wider text-[#e9c176] font-bold">
                        Atelier Flagship
                      </span>
                      <div className="font-serif-luxury text-base font-bold text-[#ffe09d]">
                        Oud Royale Master Extract
                      </div>
                    </div>
                    <div className="font-mono-data text-xs text-[#ffe09d] font-bold">Rs. 684,000</div>
                  </div>
                </div>

                {/* Leaderboard List */}
                <div className="space-y-2 font-mono-data text-xs">
                  {[
                    { rank: '01', name: 'Oud Royale', units: 342, rev: 'Rs. 684,000', margin: '68% Margin' },
                    { rank: '02', name: 'Velvet Rose', units: 289, rev: 'Rs. 433,500', margin: 'EDP' },
                    { rank: '03', name: 'Amber Noir', units: 215, rev: 'Rs. 387,000', margin: 'Pure Attar' },
                    { rank: '04', name: 'Citrus Bloom', units: 180, rev: 'Rs. 270,000', margin: 'Cologne' }
                  ].map(perfume => (
                    <div key={perfume.rank} className="p-2.5 bg-[#1d2024] border border-[#4d4639]/20 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[#ffe09d] font-bold">{perfume.rank}</span>
                        <span className="text-[#e1e2e8] font-medium">{perfume.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#ffe09d]">{perfume.rev}</span>
                        <span className="text-[10px] text-[#999080] block">{perfume.units} btls</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* COMPONENT 2: OLFACTIVE FAMILY STOCK DISTRIBUTION */}
              <div className="p-5 bg-[#191c20] border border-[#4d4639]/30 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#4d4639]/20 font-mono-data">
                  <h3 className="font-syne text-xs uppercase tracking-widest font-bold text-[#e1e2e8]">
                    Olfactive Spectrum
                  </h3>
                  <span className="text-[10px] text-[#ffe09d] font-bold">5 ACCORDS</span>
                </div>

                {/* Proportional Visual Stack Bar */}
                <div className="w-full h-3 flex overflow-hidden">
                  <div className="bg-[#d0c5b4]" style={{ width: '38%' }} title="Woody (38%)"></div>
                  <div className="bg-[#e5c378]" style={{ width: '26%' }} title="Oriental (26%)"></div>
                  <div className="bg-[#e9c176]" style={{ width: '18%' }} title="Floral (18%)"></div>
                  <div className="bg-[#c1c7d2]" style={{ width: '12%' }} title="Fresh (12%)"></div>
                  <div className="bg-[#745b1a]" style={{ width: '6%' }} title="Gourmand (6%)"></div>
                </div>

                {/* Breakdown List */}
                <div className="space-y-1.5 font-mono-data text-xs">
                  <div className="flex items-center justify-between py-1 px-2 bg-[#1d2024]">
                    <span className="text-[#e1e2e8]">Woody / Agarwood</span>
                    <span className="font-bold text-[#ffe09d]">3,211 btls (38%)</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2 bg-[#1d2024]">
                    <span className="text-[#e1e2e8]">Oriental / Resins</span>
                    <span className="font-bold text-[#ffe09d]">2,197 btls (26%)</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2 bg-[#1d2024]">
                    <span className="text-[#e1e2e8]">Floral / Rose</span>
                    <span className="font-bold text-[#ffe09d]">1,521 btls (18%)</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2 bg-[#1d2024]">
                    <span className="text-[#e1e2e8]">Fresh / Bergamot</span>
                    <span className="font-bold text-[#ffe09d]">1,014 btls (12%)</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2 bg-[#1d2024]">
                    <span className="text-[#e1e2e8]">Gourmand / Tonka</span>
                    <span className="font-bold text-[#ffe09d]">509 btls (6%)</span>
                  </div>
                </div>

                <div className="p-2.5 bg-[#0b0e12] flex items-center justify-between text-xs font-mono-data">
                  <span className="text-[#999080]">Cellar Maturation Queue</span>
                  <span className="text-[#ffe09d] font-bold">14 Vats Aging</span>
                </div>
              </div>

              {/* COMPONENT 3: OPERATIONS HUB (Fast Execution) */}
              <div className="p-5 bg-[#191c20] border border-[#4d4639]/30 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#4d4639]/20 font-mono-data">
                  <h3 className="font-syne text-xs uppercase tracking-widest font-bold text-[#e1e2e8]">
                    Operations Hub
                  </h3>
                  <span className="text-[10px] text-[#999080] uppercase">Fast Execution</span>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono-data">
                  <button
                    type="button"
                    onClick={() => setAdminView('sales-pos')}
                    className="p-3 bg-[#1d2024] hover:bg-[#ffe09d] hover:text-[#251a00] text-left transition-all group flex flex-col justify-between h-24 border border-[#4d4639]/30"
                  >
                    <Receipt className="w-5 h-5 text-[#ffe09d] group-hover:text-[#251a00]" />
                    <span className="text-xs uppercase font-bold leading-tight">
                      New Sale<br />(POS Register)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={onOpenStockAdjust}
                    className="p-3 bg-[#1d2024] hover:bg-[#e9c176] hover:text-[#251a00] text-left transition-all group flex flex-col justify-between h-24 border border-[#4d4639]/30"
                  >
                    <Sliders className="w-5 h-5 text-[#e9c176] group-hover:text-[#251a00]" />
                    <span className="text-xs uppercase font-bold leading-tight">
                      Record Stock<br />Adjustment
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdminView('purchases-orders')}
                    className="p-3 bg-[#1d2024] hover:bg-[#323539] text-left transition-all group flex flex-col justify-between h-24 border border-[#4d4639]/30"
                  >
                    <Boxes className="w-5 h-5 text-[#dee3ee] group-hover:text-[#ffe09d]" />
                    <span className="text-xs uppercase font-bold leading-tight text-[#e1e2e8]">
                      Create<br />Supplier PO
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={onOpenAddProduct}
                    className="p-3 bg-[#1d2024] hover:bg-[#323539] text-left transition-all group flex flex-col justify-between h-24 border border-[#4d4639]/30"
                  >
                    <PlusCircle className="w-5 h-5 text-[#ffe09d]" />
                    <span className="text-xs uppercase font-bold leading-tight text-[#e1e2e8]">
                      Add New<br />Fragrance Spec
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom Vault Telemetry Strip */}
          <section className="p-3 bg-[#0b0e12] border border-[#4d4639]/30 flex flex-wrap items-center justify-between gap-4 text-[#999080] font-mono-data text-[11px]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-none bg-[#2EE59D]"></span>
                <span>BONDED VAULT LHR: ONLINE (18.4°C / 45% HUMIDITY)</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-none bg-[#2EE59D]"></span>
                <span>CELLAR DXB: ONLINE (17.9°C / 42% HUMIDITY)</span>
              </div>
            </div>
            <div className="flex items-center gap-2 uppercase text-[10px]">
              <span>HAUTE PARFUMERIE INVENTORY ARCHITECTURE</span>
              <span>·</span>
              <span className="text-[#e9c176] font-bold">SECURE REPOSITORY ACCESS LEVEL 4</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
