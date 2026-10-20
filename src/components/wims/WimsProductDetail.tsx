import React from 'react';
import { 
  ArrowLeft, 
  Boxes, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Sliders, 
  Edit3, 
  Trash2, 
  Building2, 
  MapPin, 
  Clock, 
  DollarSign, 
  History,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon
} from 'lucide-react';
import { WimsProduct, WimsStockMovement, WimsUser } from '../../services/supabase';

interface WimsProductDetailProps {
  product: WimsProduct;
  movements: WimsStockMovement[];
  currentUser: WimsUser | null;
  onBack: () => void;
  onEdit: (p: WimsProduct) => void;
  onDelete: (p: WimsProduct) => void;
  onOpenInbound: (p: WimsProduct) => void;
  onOpenOutbound: (p: WimsProduct) => void;
  onOpenAdjust: (p: WimsProduct) => void;
}

export function WimsProductDetail({
  product,
  movements,
  currentUser,
  onBack,
  onEdit,
  onDelete,
  onOpenInbound,
  onOpenOutbound,
  onOpenAdjust
}: WimsProductDetailProps) {
  const isAdmin = currentUser?.role === 'ADMIN';

  // Product specific movements
  const productMovements = movements.filter(m => m.product_id === product.id);

  // Financial calculations
  const unitMarginPKR = product.selling_price - product.purchase_price;
  const marginPct = product.selling_price > 0 ? ((unitMarginPKR / product.selling_price) * 100).toFixed(1) : '0';
  const totalValuation = product.current_stock * product.selling_price;
  const totalCostBasis = product.current_stock * product.purchase_price;

  let statusBadge = 'bg-[#1e231a] text-[#4ade80] border-[#2d4a22]';
  if (product.status === 'LOW STOCK') statusBadge = 'bg-[#2b2516] text-[#e5a83b] border-[#4d3a14]';
  if (product.status === 'OUT OF STOCK') statusBadge = 'bg-[#3b171a] text-[#ff8080] border-[#5e2329]';

  return (
    <div className="p-4 sm:p-6 space-y-6 text-[#e1e2e8]">
      
      {/* Back Button & Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#32363e]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono-data text-[#ffe09d] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Product Catalog</span>
        </button>

        {/* Action Triggers */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpenInbound(product)}
            className="px-3 py-1.5 bg-[#1e231a] border border-[#2d4a22] text-[#4ade80] hover:bg-[#2d4a22]/40 text-xs font-mono-data uppercase rounded flex items-center gap-1.5 transition-colors"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Receive Stock</span>
          </button>

          <button
            onClick={() => onOpenOutbound(product)}
            className="px-3 py-1.5 bg-[#1b2b3b] border border-[#28435d] text-[#70b5f9] hover:bg-[#28435d]/40 text-xs font-mono-data uppercase rounded flex items-center gap-1.5 transition-colors"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Dispatch Stock</span>
          </button>

          <button
            onClick={() => onOpenAdjust(product)}
            className="px-3 py-1.5 bg-[#252016] border border-[#4d3a14] text-[#e5a83b] hover:bg-[#4d3a14]/40 text-xs font-mono-data uppercase rounded flex items-center gap-1.5 transition-colors"
          >
            <Sliders className="w-4 h-4" />
            <span>Adjust / Audit</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => onEdit(product)}
              className="px-3 py-1.5 bg-[#161a20] hover:bg-[#20252e] border border-[#32363e] text-[#ffe09d] text-xs font-mono-data rounded flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Spec</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => onDelete(product)}
              className="px-3 py-1.5 bg-[#2a1719] hover:bg-[#3d1c20] border border-[#5e2329] text-[#ff8080] text-xs font-mono-data rounded flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Archive</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Attribute Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Image & Quick Indicators */}
        <div className="bg-[#14171d] border border-[#32363e] rounded p-5 space-y-4">
          <div className="aspect-square w-full rounded bg-[#0b0e12] border border-[#32363e] overflow-hidden flex items-center justify-center">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80';
              }}
            />
          </div>

          <div className="p-3 bg-[#0e1116] border border-[#32363e] rounded space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-data text-[#999080]">Current Vault Balance</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusBadge}`}>
                {product.status}
              </span>
            </div>
            <div className="font-syne text-3xl font-bold text-[#ffe09d]">
              {product.current_stock} <span className="text-xs font-mono-data font-normal text-[#999080]">bottles</span>
            </div>
            
            <div className="w-full bg-[#161a20] h-2 rounded overflow-hidden">
              <div
                style={{ width: `${Math.min(100, (product.current_stock / product.maximum_stock) * 100)}%` }}
                className={`h-full ${product.current_stock <= product.minimum_stock ? 'bg-[#e5a83b]' : 'bg-[#4ade80]'}`}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono-data text-[#999080]">
              <span>Min: {product.minimum_stock}</span>
              <span>Capacity: {product.maximum_stock}</span>
            </div>
          </div>
        </div>

        {/* Right Columns: Full Specifications & Financial Yield */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Header Spec */}
          <div className="bg-[#14171d] border border-[#32363e] rounded p-5 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 bg-[#0e1116] border border-[#ffe09d]/30 text-[#ffe09d] text-[11px] font-mono-data font-bold rounded">
                SKU: {product.sku}
              </span>
              <span className="px-2 py-0.5 bg-[#0e1116] border border-[#32363e] text-[#c2cad6] text-[11px] font-mono-data rounded">
                {product.category}
              </span>
            </div>

            <h1 className="font-syne text-2xl sm:text-3xl font-bold text-[#e1e2e8]">
              {product.name}
            </h1>

            <p className="text-xs font-mono-data text-[#999080] leading-relaxed">
              {product.description || 'No specialized description logged in database.'}
            </p>
          </div>

          {/* Key Attributes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#14171d] border border-[#32363e] rounded">
              <span className="text-[10px] font-mono-data text-[#999080] uppercase block">Unit Cost (COGS)</span>
              <div className="font-syne text-lg font-bold text-[#e1e2e8] mt-0.5">
                PKR {product.purchase_price.toLocaleString()}
              </div>
            </div>

            <div className="p-3 bg-[#14171d] border border-[#32363e] rounded">
              <span className="text-[10px] font-mono-data text-[#999080] uppercase block">Retail Price</span>
              <div className="font-syne text-lg font-bold text-[#ffe09d] mt-0.5">
                PKR {product.selling_price.toLocaleString()}
              </div>
            </div>

            <div className="p-3 bg-[#14171d] border border-[#32363e] rounded">
              <span className="text-[10px] font-mono-data text-[#999080] uppercase block">Unit Gross Margin</span>
              <div className="font-syne text-lg font-bold text-[#4ade80] mt-0.5">
                {marginPct}% (+PKR {unitMarginPKR.toLocaleString()})
              </div>
            </div>

            <div className="p-3 bg-[#14171d] border border-[#32363e] rounded">
              <span className="text-[10px] font-mono-data text-[#999080] uppercase block">Storage Bay</span>
              <div className="font-mono-data text-xs font-bold text-[#c2cad6] mt-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#ffe09d]" />
                <span>{product.warehouse_location}</span>
              </div>
            </div>
          </div>

          {/* Supplier & Vault Metadata */}
          <div className="p-4 bg-[#14171d] border border-[#32363e] rounded grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-data">
            <div>
              <span className="text-[10px] text-[#999080] uppercase block">Distillation Supplier</span>
              <div className="text-white font-medium mt-1 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#ffe09d]" />
                <span>{product.supplier}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-[#999080] uppercase block">Stock Asset Valuation</span>
              <div className="text-white font-medium mt-1">
                Cost Basis: <span className="text-[#999080]">PKR {totalCostBasis.toLocaleString()}</span> · Retail: <span className="text-[#ffe09d] font-bold">PKR {totalValuation.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movement Ledger for This Product */}
      <div className="p-5 bg-[#14171d] border border-[#32363e] rounded space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#ffe09d]" />
            <h2 className="font-syne text-base font-bold text-[#e1e2e8] uppercase">
              Product Movement & Transaction History ({productMovements.length})
            </h2>
          </div>
        </div>

        {productMovements.length === 0 ? (
          <div className="py-8 text-center text-[#999080] text-xs font-mono-data">
            No stock movements recorded yet for this product. Use Receive or Dispatch above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono-data">
              <thead className="bg-[#0b0e12] text-[#999080] uppercase text-[10px] border-b border-[#32363e]">
                <tr>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3 text-right">Quantity</th>
                  <th className="py-2.5 px-3 text-center">Previous → New</th>
                  <th className="py-2.5 px-3">Reference / Reason</th>
                  <th className="py-2.5 px-3">Operator</th>
                  <th className="py-2.5 px-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#32363e]/40">
                {productMovements.map(mov => {
                  let badge = 'bg-[#1e231a] text-[#4ade80] border-[#2d4a22]';
                  if (mov.movement_type === 'OUTBOUND') badge = 'bg-[#1b2b3b] text-[#70b5f9] border-[#28435d]';
                  if (mov.movement_type === 'ADJUSTMENT') badge = 'bg-[#2b2516] text-[#e5a83b] border-[#4d3a14]';
                  if (mov.movement_type === 'RETURN') badge = 'bg-[#261c36] text-[#c084fc] border-[#4c2d6a]';

                  return (
                    <tr key={mov.id} className="hover:bg-[#1a1d24]">
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge}`}>
                          {mov.movement_type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold">
                        <span className={mov.movement_type === 'OUTBOUND' ? 'text-[#70b5f9]' : 'text-[#4ade80]'}>
                          {mov.movement_type === 'OUTBOUND' ? '-' : '+'}{Math.abs(mov.quantity)}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center text-[#999080]">
                        <span>{mov.previous_stock}</span>
                        <span className="px-1 text-[#ffe09d]">→</span>
                        <span className="font-bold text-white">{mov.new_stock}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="text-[#e1e2e8]">{mov.reason}</div>
                        <div className="text-[10px] text-[#999080]">Ref: {mov.reference_number} {mov.notes && `· ${mov.notes}`}</div>
                      </td>
                      <td className="py-2.5 px-3 text-[#999080]">
                        {mov.user_email}
                      </td>
                      <td className="py-2.5 px-3 text-right text-[#999080]">
                        {new Date(mov.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
