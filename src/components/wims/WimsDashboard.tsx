import React, { useState } from 'react';
import { 
  Boxes, 
  Layers, 
  AlertTriangle, 
  AlertOctagon, 
  ArrowDownLeft, 
  ArrowUpRight, 
  PlusCircle, 
  PackagePlus, 
  Truck, 
  FileSpreadsheet, 
  Calendar, 
  TrendingUp,
  History,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';
import { WimsProduct, WimsStockMovement } from '../../services/supabase';

interface WimsDashboardProps {
  products: WimsProduct[];
  movements: WimsStockMovement[];
  onOpenAddProduct: () => void;
  onOpenInbound: () => void;
  onOpenOutbound: () => void;
  onNavigateToAlerts: () => void;
  onNavigateToReports: () => void;
  onNavigateToHistory: () => void;
  onSelectProduct: (p: WimsProduct) => void;
}

export function WimsDashboard({
  products,
  movements,
  onOpenAddProduct,
  onOpenInbound,
  onOpenOutbound,
  onNavigateToAlerts,
  onNavigateToReports,
  onNavigateToHistory,
  onSelectProduct
}: WimsDashboardProps) {
  const [movementFilter, setMovementFilter] = useState<'today' | '7d' | '30d' | '3m'>('7d');

  // KPI Calculations
  const totalProducts = products.length;
  const totalStockUnits = products.reduce((sum, p) => sum + p.current_stock, 0);
  const lowStockItems = products.filter(p => p.status === 'LOW STOCK').length;
  const outOfStockItems = products.filter(p => p.status === 'OUT OF STOCK').length;
  const inStockItems = products.filter(p => p.status === 'IN STOCK').length;

  // Inbound & Outbound Today
  const todayStr = new Date().toISOString().split('T')[0];
  const inboundToday = movements
    .filter(m => (m.movement_type === 'INBOUND' || m.movement_type === 'RETURN') && m.created_at.startsWith(todayStr))
    .reduce((sum, m) => sum + m.quantity, 0);

  const outboundToday = movements
    .filter(m => m.movement_type === 'OUTBOUND' && m.created_at.startsWith(todayStr))
    .reduce((sum, m) => sum + m.quantity, 0);

  // Recent 6 movements
  const recentMovements = movements.slice(0, 6);

  // Percentages for Health bar
  const inStockPct = totalProducts > 0 ? Math.round((inStockItems / totalProducts) * 100) : 0;
  const lowStockPct = totalProducts > 0 ? Math.round((lowStockItems / totalProducts) * 100) : 0;
  const outOfStockPct = totalProducts > 0 ? Math.max(0, 100 - inStockPct - lowStockPct) : 0;

  // Mock bar chart heights based on timeframe
  const chartData = movementFilter === 'today' 
    ? [
        { label: '08:00', in: 25, out: 10 },
        { label: '10:00', in: 15, out: 30 },
        { label: '12:00', in: 40, out: 18 },
        { label: '14:00', in: 10, out: 45 },
        { label: '16:00', in: 50, out: 22 },
        { label: '18:00', in: 12, out: 15 }
      ]
    : movementFilter === '7d'
    ? [
        { label: 'Mon', in: 120, out: 95 },
        { label: 'Tue', in: 80, out: 110 },
        { label: 'Wed', in: 150, out: 85 },
        { label: 'Thu', in: 200, out: 140 },
        { label: 'Fri', in: 170, out: 160 },
        { label: 'Sat', in: 60, out: 45 },
        { label: 'Sun', in: 40, out: 30 }
      ]
    : movementFilter === '30d'
    ? [
        { label: 'Wk 1', in: 540, out: 480 },
        { label: 'Wk 2', in: 620, out: 590 },
        { label: 'Wk 3', in: 710, out: 650 },
        { label: 'Wk 4', in: 580, out: 530 }
      ]
    : [
        { label: 'Month 1', in: 2400, out: 2150 },
        { label: 'Month 2', in: 2850, out: 2600 },
        { label: 'Month 3', in: 3100, out: 2950 }
      ];

  return (
    <div className="p-4 sm:p-8 space-y-6 text-[#111111] max-w-7xl mx-auto">
      
      {/* Page Title & Quick Actions Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E8E0D4]">
        <div>
          <div className="flex items-center gap-2 text-xs font-syne text-[#8A6D2F] uppercase tracking-wider font-bold">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-ping" />
            <span>Warehouse Live Metrics & Telemetry</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#111111] mt-1">
            Operations & Inventory Overview
          </h1>
          <p className="text-xs font-mono-data text-[#6B6B6B] mt-1">
            Real-time stock levels, inbound receipts, and dispatch velocity across atelier storage bays.
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenAddProduct}
            className="px-4 py-2.5 bg-[#111111] text-[#FFE09D] hover:bg-[#8A6D2F] text-xs font-syne font-bold uppercase tracking-wider rounded flex items-center gap-1.5 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4 text-[#FFE09D]" />
            <span>Add Product</span>
          </button>

          <button
            onClick={onOpenInbound}
            className="px-4 py-2.5 bg-[#FFFFFF] border border-[#E8E0D4] text-[#2E7D32] hover:bg-[#F3EFE6] text-xs font-mono-data uppercase rounded flex items-center gap-1.5 transition-all font-bold shadow-sm"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Receive Stock</span>
          </button>

          <button
            onClick={onOpenOutbound}
            className="px-4 py-2.5 bg-[#FFFFFF] border border-[#E8E0D4] text-[#1D4ED8] hover:bg-[#F3EFE6] text-xs font-mono-data uppercase rounded flex items-center gap-1.5 transition-all font-bold shadow-sm"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Dispatch Stock</span>
          </button>

          <button
            onClick={onNavigateToAlerts}
            className="px-4 py-2.5 bg-[#FFF2F2] border border-[#FADBD8] text-[#B33939] hover:bg-[#FCE8E8] text-xs font-mono-data uppercase rounded flex items-center gap-1.5 transition-all font-bold shadow-sm"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Alerts ({lowStockItems + outOfStockItems})</span>
          </button>

          <button
            onClick={onNavigateToReports}
            className="px-4 py-2.5 bg-[#FFFFFF] border border-[#E8E0D4] text-[#111111] hover:bg-[#F3EFE6] text-xs font-mono-data uppercase rounded flex items-center gap-1.5 transition-all font-bold shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#8A6D2F]" />
            <span>Reports</span>
          </button>
        </div>
      </div>

      {/* 6 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Card 1: Total Products */}
        <div className="p-4 bg-[#FFFFFF] border border-[#E8E0D4] rounded shadow-sm hover:border-[#8A6D2F] transition-colors">
          <div className="flex items-center justify-between text-[#6B6B6B] mb-2">
            <span className="text-[11px] font-syne uppercase tracking-wider font-bold">Total Products</span>
            <Boxes className="w-4 h-4 text-[#8A6D2F]" />
          </div>
          <div className="font-serif-luxury text-2xl font-bold text-[#111111]">{totalProducts}</div>
          <div className="text-[10px] font-mono-data text-[#2E7D32] mt-1 flex items-center gap-1 font-bold">
            <TrendingUp className="w-3 h-3" />
            <span>Active SKUs</span>
          </div>
        </div>

        {/* Card 2: Total Stock Units */}
        <div className="p-4 bg-[#FFFFFF] border border-[#E8E0D4] rounded shadow-sm hover:border-[#8A6D2F] transition-colors">
          <div className="flex items-center justify-between text-[#6B6B6B] mb-2">
            <span className="text-[11px] font-syne uppercase tracking-wider font-bold">Total Stock</span>
            <Layers className="w-4 h-4 text-[#2E7D32]" />
          </div>
          <div className="font-serif-luxury text-2xl font-bold text-[#111111]">{totalStockUnits.toLocaleString()}</div>
          <div className="text-[10px] font-mono-data text-[#6B6B6B] mt-1">Physical Units in Vaults</div>
        </div>

        {/* Card 3: Low Stock */}
        <div className="p-4 bg-[#FFFFFF] border border-[#FFE0B2] rounded shadow-sm hover:border-[#F57F17] transition-colors">
          <div className="flex items-center justify-between text-[#F57F17] mb-2">
            <span className="text-[11px] font-syne uppercase tracking-wider font-bold">Low Stock</span>
            <AlertTriangle className="w-4 h-4 text-[#F57F17]" />
          </div>
          <div className="font-serif-luxury text-2xl font-bold text-[#F57F17]">{lowStockItems}</div>
          <div className="text-[10px] font-mono-data text-[#F57F17] mt-1 font-bold">≤ Minimum Threshold</div>
        </div>

        {/* Card 4: Out of Stock */}
        <div className="p-4 bg-[#FFFFFF] border border-[#FFCDD2] rounded shadow-sm hover:border-[#B33939] transition-colors">
          <div className="flex items-center justify-between text-[#B33939] mb-2">
            <span className="text-[11px] font-syne uppercase tracking-wider font-bold">Out of Stock</span>
            <AlertOctagon className="w-4 h-4 text-[#B33939]" />
          </div>
          <div className="font-serif-luxury text-2xl font-bold text-[#B33939]">{outOfStockItems}</div>
          <div className="text-[10px] font-mono-data text-[#B33939] mt-1 font-bold">Requires Restock PO</div>
        </div>

        {/* Card 5: Inbound Today */}
        <div className="p-4 bg-[#FFFFFF] border border-[#E8E0D4] rounded shadow-sm hover:border-[#2E7D32] transition-colors">
          <div className="flex items-center justify-between text-[#6B6B6B] mb-2">
            <span className="text-[11px] font-syne uppercase tracking-wider font-bold">Inbound Today</span>
            <ArrowDownLeft className="w-4 h-4 text-[#2E7D32]" />
          </div>
          <div className="font-serif-luxury text-2xl font-bold text-[#2E7D32]">+{inboundToday}</div>
          <div className="text-[10px] font-mono-data text-[#6B6B6B] mt-1">Units Received</div>
        </div>

        {/* Card 6: Outbound Today */}
        <div className="p-4 bg-[#FFFFFF] border border-[#E8E0D4] rounded shadow-sm hover:border-[#1D4ED8] transition-colors">
          <div className="flex items-center justify-between text-[#6B6B6B] mb-2">
            <span className="text-[11px] font-syne uppercase tracking-wider font-bold">Outbound Today</span>
            <ArrowUpRight className="w-4 h-4 text-[#1D4ED8]" />
          </div>
          <div className="font-serif-luxury text-2xl font-bold text-[#1D4ED8]">-{outboundToday}</div>
          <div className="text-[10px] font-mono-data text-[#6B6B6B] mt-1">Units Dispatched</div>
        </div>
      </div>

      {/* Middle Grid: Stock Health Bar + Movement Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Stock Status Visual Health Card */}
        <div className="p-6 bg-[#FFFFFF] border border-[#E8E0D4] rounded shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-luxury text-lg font-bold text-[#111111] uppercase">
              Stock Status Health
            </h2>
            <span className="text-xs font-mono-data text-[#6B6B6B] uppercase font-bold">
              {totalProducts} Total SKUs
            </span>
          </div>

          {/* Segmented Progress Bar */}
          <div className="w-full h-3 bg-[#F8F5EF] border border-[#E8E0D4] rounded overflow-hidden flex">
            <div style={{ width: `${inStockPct}%` }} className="bg-[#2E7D32] h-full" title={`In Stock: ${inStockPct}%`} />
            <div style={{ width: `${lowStockPct}%` }} className="bg-[#F57F17] h-full" title={`Low Stock: ${lowStockPct}%`} />
            <div style={{ width: `${outOfStockPct}%` }} className="bg-[#B33939] h-full" title={`Out of Stock: ${outOfStockPct}%`} />
          </div>

          {/* Legend Items */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-mono-data">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#2E7D32]" />
                <span className="font-bold">IN STOCK</span>
              </div>
              <span className="font-bold text-[#2E7D32]">{inStockItems} SKUs ({inStockPct}%)</span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono-data">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#F57F17]" />
                <span className="font-bold">LOW STOCK</span>
              </div>
              <span className="font-bold text-[#F57F17]">{lowStockItems} SKUs ({lowStockPct}%)</span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono-data">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#B33939]" />
                <span className="font-bold">OUT OF STOCK</span>
              </div>
              <span className="font-bold text-[#B33939]">{outOfStockItems} SKUs ({outOfStockPct}%)</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E8E0D4]">
            <button
              onClick={onNavigateToAlerts}
              className="w-full py-2.5 bg-[#F8F5EF] hover:bg-[#E8E0D4] text-xs font-syne font-bold text-[#111111] rounded flex items-center justify-center gap-1.5 transition-colors border border-[#E8E0D4]"
            >
              <span>Manage Low Stock Shortages</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Stock Movements Chart Card */}
        <div className="lg:col-span-2 p-6 bg-[#FFFFFF] border border-[#E8E0D4] rounded shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-serif-luxury text-lg font-bold text-[#111111] uppercase">
                Stock Movement Dynamics
              </h2>
              <p className="text-xs font-mono-data text-[#6B6B6B]">
                Comparing inbound intake vs outbound warehouse dispatches
              </p>
            </div>

            {/* Timeframe Filter Tabs */}
            <div className="flex items-center bg-[#F8F5EF] border border-[#E8E0D4] p-1 rounded">
              {(['today', '7d', '30d', '3m'] as const).map(period => (
                <button
                  key={period}
                  onClick={() => setMovementFilter(period)}
                  className={`px-3 py-1.5 text-xs font-mono-data uppercase rounded transition-all ${
                    movementFilter === period
                      ? 'bg-[#111111] text-[#FFE09D] font-bold shadow-sm'
                      : 'text-[#6B6B6B] hover:text-[#111111]'
                  }`}
                >
                  {period === 'today' ? 'Today' : period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : '3 Months'}
                </button>
              ))}
            </div>
          </div>

          {/* Bar Chart Representation */}
          <div className="pt-4 pb-2">
            <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-[#E8E0D4]">
              {chartData.map((d, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                  <div className="flex items-end gap-1 w-full justify-center">
                    {/* Inbound Bar */}
                    <div
                      style={{ height: `${Math.min(100, Math.max(12, (d.in / 300) * 100))}%` }}
                      className="w-1/2 max-w-[18px] bg-[#2E7D32] rounded-t opacity-90 group-hover:opacity-100 transition-all relative"
                      title={`Inbound: ${d.in} units`}
                    />
                    {/* Outbound Bar */}
                    <div
                      style={{ height: `${Math.min(100, Math.max(12, (d.out / 300) * 100))}%` }}
                      className="w-1/2 max-w-[18px] bg-[#1D4ED8] rounded-t opacity-90 group-hover:opacity-100 transition-all relative"
                      title={`Outbound: ${d.out} units`}
                    />
                  </div>
                  <span className="text-[10px] font-mono-data text-[#6B6B6B] mt-1 whitespace-nowrap font-bold">
                    {d.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Chart Legend */}
            <div className="flex items-center justify-end gap-5 mt-3 text-xs font-mono-data">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#2E7D32] rounded-sm" />
                <span className="text-[#6B6B6B] font-bold">Inbound Receiving</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#1D4ED8] rounded-sm" />
                <span className="text-[#6B6B6B] font-bold">Outbound Dispatches</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Table: Recent Stock Movements */}
      <div className="p-6 bg-[#FFFFFF] border border-[#E8E0D4] rounded shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#8A6D2F]" />
            <h2 className="font-serif-luxury text-lg font-bold text-[#111111] uppercase">
              Recent Stock Movement Ledger
            </h2>
          </div>
          <button
            onClick={onNavigateToHistory}
            className="text-xs font-syne font-bold text-[#8A6D2F] hover:underline flex items-center gap-1"
          >
            <span>View Full Audit Log</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-data">
            <thead className="bg-[#F8F5EF] text-[#6B6B6B] uppercase text-[10px] font-syne border-b border-[#E8E0D4]">
              <tr>
                <th className="py-3 px-3 font-bold">Type</th>
                <th className="py-3 px-3 font-bold">Product / SKU</th>
                <th className="py-3 px-3 text-right font-bold">Quantity</th>
                <th className="py-3 px-3 text-center font-bold">Stock Shift</th>
                <th className="py-3 px-3 font-bold">Reference / Reason</th>
                <th className="py-3 px-3 font-bold">Operator</th>
                <th className="py-3 px-3 text-right font-bold">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0D4]">
              {recentMovements.map(mov => {
                let badgeClass = 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]';
                if (mov.movement_type === 'OUTBOUND') badgeClass = 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]';
                if (mov.movement_type === 'ADJUSTMENT') badgeClass = 'bg-[#FFFBEB] text-[#B45309] border-[#FEF3C7]';
                if (mov.movement_type === 'RETURN') badgeClass = 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]';

                const targetProd = products.find(p => p.id === mov.product_id);

                return (
                  <tr key={mov.id} className="hover:bg-[#FBF9F5] transition-colors">
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${badgeClass}`}>
                        {mov.movement_type}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => targetProd && onSelectProduct(targetProd)}
                        className="font-bold text-[#111111] hover:text-[#8A6D2F] text-left block font-serif-luxury text-sm"
                      >
                        {mov.product_name || 'Inventory Item'}
                      </button>
                      <span className="text-[10px] text-[#6B6B6B] font-mono-data">{mov.product_sku}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-sm">
                      <span className={mov.movement_type === 'OUTBOUND' ? 'text-[#1D4ED8]' : 'text-[#2E7D32]'}>
                        {mov.movement_type === 'OUTBOUND' ? '-' : '+'}{Math.abs(mov.quantity)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center text-[#6B6B6B]">
                      <span className="text-[#6B6B6B]">{mov.previous_stock}</span>
                      <span className="px-1.5 text-[#8A6D2F]">→</span>
                      <span className="font-bold text-[#111111]">{mov.new_stock}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-[#111111]">{mov.reason}</div>
                      <div className="text-[10px] text-[#6B6B6B]">Ref: {mov.reference_number}</div>
                    </td>
                    <td className="py-3 px-3 text-[#6B6B6B] truncate max-w-[130px]">
                      {mov.user_email}
                    </td>
                    <td className="py-3 px-3 text-right text-[#6B6B6B]">
                      {new Date(mov.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
