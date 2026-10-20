import React, { useState } from 'react';
import { 
  AlertTriangle, 
  AlertOctagon, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowDownLeft, 
  Sliders, 
  Edit3, 
  Search, 
  Download,
  Package,
  Layers,
  ArrowRight
} from 'lucide-react';
import { WimsProduct, WimsUser } from '../../services/supabase';

interface WimsAlertsProps {
  products: WimsProduct[];
  currentUser: WimsUser | null;
  onOpenInbound: (p: WimsProduct) => void;
  onEditThreshold: (p: WimsProduct) => void;
  onSelectProduct: (p: WimsProduct) => void;
}

export function WimsAlerts({
  products,
  currentUser,
  onOpenInbound,
  onEditThreshold,
  onSelectProduct
}: WimsAlertsProps) {
  const [filterType, setFilterType] = useState<'all' | 'out' | 'low' | 'critical'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Identify alerted items
  const alertedProducts = products.filter(p => {
    if (p.archived) return false;
    if (p.status === 'OUT OF STOCK') return true;
    if (p.status === 'LOW STOCK') return true;
    return false;
  });

  const criticalShortageItems = alertedProducts.filter(p => p.current_stock <= Math.floor(p.minimum_stock / 2));
  const outOfStockItems = alertedProducts.filter(p => p.current_stock <= 0);
  const lowStockItems = alertedProducts.filter(p => p.current_stock > 0 && p.current_stock <= p.minimum_stock);

  const displayedProducts = alertedProducts.filter(p => {
    if (filterType === 'out' && p.current_stock > 0) return false;
    if (filterType === 'low' && (p.current_stock <= 0 || p.current_stock > p.minimum_stock)) return false;
    if (filterType === 'critical' && p.current_stock > Math.floor(p.minimum_stock / 2)) return false;

    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.warehouse_location.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const totalDeficit = alertedProducts.reduce((sum, p) => sum + Math.max(0, p.minimum_stock - p.current_stock), 0);

  return (
    <div className="p-4 sm:p-8 space-y-6 text-[#E2E8F0] max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#2A303C]">
        <div>
          <div className="flex items-center gap-2 text-xs font-syne uppercase tracking-widest text-[#FF6B6B] font-bold">
            <AlertTriangle className="w-4 h-4 text-[#FF6B6B]" />
            <span>Inventory Depletion Telemetry & Safety Audits</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white mt-1">
            Low Stock & Critical Shortage Alerts
          </h1>
          <p className="text-xs font-mono-data text-[#94A3B8] mt-1">
            Automated deficit calculation and instant replenishment purchase triggers for atelier vaults.
          </p>
        </div>

        {/* Total Deficit Summary Card */}
        <div className="flex items-center gap-3">
          <div className="p-4 bg-[#131720] border border-[#2A303C] shadow-lg flex items-center gap-4 rounded">
            <div className="w-10 h-10 bg-[#3B171A] border border-[#5C2226] flex items-center justify-center text-[#FF6B6B]">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[#94A3B8] block text-[10px] font-syne uppercase tracking-wider font-bold">Total Shortage Deficit</span>
              <span className="text-[#FF6B6B] font-mono-data font-bold text-lg">
                {totalDeficit} Units Required
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar Card */}
      <div className="p-4 bg-[#131720] border border-[#2A303C] shadow-lg rounded space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-[#0B0E14] p-1 border border-[#2A303C] rounded overflow-x-auto text-xs font-mono-data">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-2 rounded uppercase font-bold transition-all ${
                filterType === 'all' ? 'bg-[#D4AF37] text-[#0B0E14]' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              All Alerts ({alertedProducts.length})
            </button>

            <button
              onClick={() => setFilterType('critical')}
              className={`px-3 py-2 rounded uppercase font-bold transition-all ${
                filterType === 'critical' ? 'bg-[#FF6B6B] text-[#0B0E14]' : 'text-[#FF6B6B] hover:bg-[#3B171A]'
              }`}
            >
              Critical Shortage ({criticalShortageItems.length})
            </button>

            <button
              onClick={() => setFilterType('out')}
              className={`px-3 py-2 rounded uppercase font-bold transition-all ${
                filterType === 'out' ? 'bg-[#E53E3E] text-white' : 'text-[#E53E3E] hover:bg-[#3B171A]'
              }`}
            >
              Out of Stock ({outOfStockItems.length})
            </button>

            <button
              onClick={() => setFilterType('low')}
              className={`px-3 py-2 rounded uppercase font-bold transition-all ${
                filterType === 'low' ? 'bg-[#D4AF37] text-[#0B0E14]' : 'text-[#D4AF37] hover:bg-[#2A2410]'
              }`}
            >
              Low Stock ({lowStockItems.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 lg:max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search alert by SKU or title..."
              className="w-full h-10 pl-9 pr-3 bg-[#0B0E14] border border-[#2A303C] text-xs font-mono-data text-white rounded focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>
      </div>

      {/* Alerts Table Card */}
      <div className="bg-[#131720] border border-[#2A303C] rounded shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-data">
            <thead className="bg-[#0B0E14] text-[#94A3B8] uppercase text-[10px] font-syne border-b border-[#2A303C]">
              <tr>
                <th className="py-3 px-4 font-bold">Severity Status</th>
                <th className="py-3 px-3 font-bold">Product Spec</th>
                <th className="py-3 px-3 font-bold">SKU</th>
                <th className="py-3 px-3 text-right font-bold">Current Stock</th>
                <th className="py-3 px-3 text-right font-bold">Min Threshold</th>
                <th className="py-3 px-3 text-center font-bold">Shortage Deficit</th>
                <th className="py-3 px-3 font-bold">Supplier & Bay</th>
                <th className="py-3 px-4 text-right font-bold">Replenish Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A303C]">
              {displayedProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-[#94A3B8]">
                    <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-[#48BB78]" />
                    <div className="font-serif-luxury text-base font-bold text-white">All warehouse stock levels are healthy</div>
                    <div className="text-xs text-[#94A3B8] mt-1 font-mono-data">No items currently violate minimum safety stock thresholds.</div>
                  </td>
                </tr>
              ) : (
                displayedProducts.map(prod => {
                  const deficit = Math.max(0, prod.minimum_stock - prod.current_stock);
                  const isOut = prod.current_stock <= 0;
                  const isCritical = prod.current_stock <= Math.floor(prod.minimum_stock / 2);

                  return (
                    <tr key={prod.id} className="hover:bg-[#1A202C] transition-colors">
                      <td className="py-4 px-4">
                        {isOut ? (
                          <span className="px-2.5 py-1 bg-[#3B171A] border border-[#5C2226] text-[#FF6B6B] font-bold rounded text-[10px]">
                            OUT OF STOCK
                          </span>
                        ) : isCritical ? (
                          <span className="px-2.5 py-1 bg-[#3B2B16] border border-[#6B4B1C] text-[#F6AD55] font-bold rounded text-[10px]">
                            CRITICAL SHORTAGE
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-[#2A2410] border border-[#5C4818] text-[#ECC94B] font-bold rounded text-[10px]">
                            LOW STOCK
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-3">
                        <button
                          onClick={() => onSelectProduct(prod)}
                          className="font-bold text-white hover:text-[#D4AF37] text-left block font-serif-luxury text-sm"
                        >
                          {prod.name}
                        </button>
                        <span className="text-[10px] text-[#94A3B8] font-mono-data uppercase">{prod.category}</span>
                      </td>

                      <td className="py-4 px-3 font-bold text-[#D4AF37]">
                        {prod.sku}
                      </td>

                      <td className="py-4 px-3 text-right font-bold text-sm">
                        <span className={isOut ? 'text-[#FF6B6B]' : 'text-[#F6AD55]'}>
                          {prod.current_stock}
                        </span>
                        <span className="text-[10px] text-[#94A3B8] ml-1 font-normal">units</span>
                      </td>

                      <td className="py-4 px-3 text-right text-[#94A3B8]">
                        {prod.minimum_stock} units
                      </td>

                      {/* Deficit Calculation */}
                      <td className="py-4 px-3 text-center">
                        <span className="px-3 py-1.5 bg-[#B33939] text-white font-bold rounded text-xs whitespace-nowrap shadow-sm">
                          {deficit} Units Shortage
                        </span>
                      </td>

                      <td className="py-4 px-3 text-[11px]">
                        <div className="font-bold text-white truncate max-w-[150px]">{prod.supplier}</div>
                        <div className="text-[#94A3B8]">{prod.warehouse_location}</div>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onOpenInbound(prod)}
                            className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#E5C378] text-[#0B0E14] rounded flex items-center gap-1.5 font-bold text-[11px] transition-colors shadow-md"
                            title="Generate Restock Inbound Intake"
                          >
                            <ArrowDownLeft className="w-3.5 h-3.5 text-[#0B0E14]" />
                            <span>Restock PO</span>
                          </button>

                          <button
                            onClick={() => onEditThreshold(prod)}
                            className="p-1.5 bg-[#0B0E14] hover:bg-[#1A202C] border border-[#2A303C] text-[#E2E8F0] rounded transition-colors"
                            title="Edit Minimum Threshold"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
