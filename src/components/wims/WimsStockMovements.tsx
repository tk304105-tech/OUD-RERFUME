import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Sliders, 
  RotateCcw, 
  Search, 
  Download, 
  Filter, 
  CheckCircle2, 
  AlertTriangle,
  FileSpreadsheet,
  Calendar,
  X,
  History
} from 'lucide-react';
import { WimsProduct, WimsStockMovement, WimsUser, MovementType, wimsDb } from '../../services/supabase';

interface WimsStockMovementsProps {
  products: WimsProduct[];
  movements: WimsStockMovement[];
  currentUser: WimsUser | null;
  onRefreshData: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export function WimsStockMovements({
  products,
  movements,
  currentUser,
  onRefreshData,
  showToast
}: WimsStockMovementsProps) {
  // Movement Type Filter & Search
  const [activeTab, setActiveTab] = useState<'all' | 'INBOUND' | 'OUTBOUND' | 'ADJUSTMENT' | 'RETURN'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Stock Movement Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<MovementType>('INBOUND');
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(10);
  const [adjustmentSign, setAdjustmentSign] = useState<'+' | '-'>('+');
  const [reference, setReference] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  // Selected Product for Preview
  const activeProduct = products.find(p => p.id === selectedProductId) || products[0];

  const openModal = (type: MovementType, prodId?: string) => {
    setModalType(type);
    setSelectedProductId(prodId || products[0]?.id || '');
    setQuantity(10);
    setAdjustmentSign('+');
    setNotes('');
    setModalError('');

    if (type === 'INBOUND') {
      setReference(`PO-${Math.floor(1000 + Math.random() * 9000)}`);
      setReason('Direct Distillation Replenishment from Grasse');
    } else if (type === 'OUTBOUND') {
      setReference(`SO-${Math.floor(1000 + Math.random() * 9000)}`);
      setReason('Dispatch to Retail Boutique & VIP Client Orders');
    } else if (type === 'ADJUSTMENT') {
      setReference(`AUD-${Math.floor(100 + Math.random() * 900)}`);
      setReason('Vault Stocktake Cycle Count Reconciliation');
    } else if (type === 'RETURN') {
      setReference(`RMA-${Math.floor(100 + Math.random() * 900)}`);
      setReason('Customer Flacon Exchange / Sealed Return');
    }

    setIsModalOpen(true);
  };

  // Atomic Execution
  const handleSubmitMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');

    if (!selectedProductId) {
      setModalError('Please select a product specification.');
      return;
    }

    const qtyNum = Number(quantity);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      setModalError('Quantity must be a valid positive number.');
      return;
    }

    if (!reference.trim()) {
      setModalError('Reference number / PO code is required.');
      return;
    }

    if (!reason.trim()) {
      setModalError('Reason / operation note is required.');
      return;
    }

    setSubmitting(true);

    try {
      let finalQty = qtyNum;
      if (modalType === 'ADJUSTMENT' && adjustmentSign === '-') {
        finalQty = -qtyNum;
      }

      wimsDb.recordStockMovement({
        product_id: selectedProductId,
        movement_type: modalType,
        quantity: finalQty,
        reference_number: reference.trim(),
        reason: reason.trim(),
        notes: notes.trim() || undefined,
        user_email: currentUser?.email || 'admin@warehouse.io'
      });

      onRefreshData();
      setIsModalOpen(false);
      showToast(`Successfully recorded ${modalType} operation for ${activeProduct?.name || 'Product'}.`, 'success');
    } catch (err: any) {
      setModalError(err?.message || 'Failed to record stock movement.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredMovements = movements.filter(m => {
    const matchesTab = activeTab === 'all' || m.movement_type === activeTab;
    const matchesSearch = 
      (m.product_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.product_sku || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.reference_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.user_email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = ["Movement ID", "Product Name", "SKU", "Type", "Quantity", "Prev Stock", "New Stock", "Reference", "Reason", "Operator", "Timestamp"];
    const rows = filteredMovements.map(m => [
      `"${m.id}"`,
      `"${(m.product_name || '').replace(/"/g, '""')}"`,
      `"${m.product_sku || ''}"`,
      `"${m.movement_type}"`,
      m.quantity,
      m.previous_stock,
      m.new_stock,
      `"${m.reference_number}"`,
      `"${m.reason.replace(/"/g, '""')}"`,
      `"${m.user_email}"`,
      `"${m.created_at}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", `wims_stock_movements_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 text-[#111111] max-w-7xl mx-auto">
      
      {/* Top Header & Fast Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E0D4]">
        <div>
          <div className="flex items-center gap-2 text-xs font-syne text-[#8A6D2F] uppercase tracking-wider font-bold">
            <ArrowRightLeft className="w-4 h-4 text-[#8A6D2F]" />
            <span>Stock Movements & Receiving</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#111111] mt-1">
            Inventory Stock Operations & Audit Log
          </h1>
          <p className="text-xs font-mono-data text-[#6B6B6B] mt-1">
            Atomic stock balance updates: Inbound intake, Outbound dispatch, Return RMA & Reconciliations
          </p>
        </div>

        {/* 4 Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => openModal('INBOUND')}
            className="px-4 py-2.5 bg-[#E8F5E9] hover:bg-[#C8E6C9] border border-[#C8E6C9] text-[#2E7D32] text-xs font-mono-data uppercase font-bold rounded flex items-center gap-1.5 transition-all shadow-sm"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>+ Inbound Receiving</span>
          </button>

          <button
            onClick={() => openModal('OUTBOUND')}
            className="px-4 py-2.5 bg-[#EFF6FF] hover:bg-[#BFDBFE] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-mono-data uppercase font-bold rounded flex items-center gap-1.5 transition-all shadow-sm"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>- Outbound Dispatch</span>
          </button>

          <button
            onClick={() => openModal('ADJUSTMENT')}
            className="px-4 py-2 bg-[#FFFBEB] hover:bg-[#FEF3C7] border border-[#FEF3C7] text-[#B45309] text-xs font-mono-data uppercase font-bold rounded flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Sliders className="w-4 h-4" />
            <span>± Stock Adjustment</span>
          </button>

          <button
            onClick={() => openModal('RETURN')}
            className="px-4 py-2 bg-[#F3E8FF] hover:bg-[#E9D5FF] border border-[#E9D5FF] text-[#7E22CE] text-xs font-mono-data uppercase font-bold rounded flex items-center gap-1.5 transition-all shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>+ Return RMA</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="p-4 bg-[#FFFFFF] border border-[#E8E0D4] shadow-sm rounded space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-[#F8F5EF] p-1 border border-[#E8E0D4] rounded overflow-x-auto text-xs font-mono-data">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-2 rounded uppercase font-bold transition-all ${
                activeTab === 'all' ? 'bg-[#111111] text-[#FFE09D]' : 'text-[#6B6B6B] hover:text-[#111111]'
              }`}
            >
              All Movements ({movements.length})
            </button>

            <button
              onClick={() => setActiveTab('INBOUND')}
              className={`px-3 py-2 rounded uppercase font-bold transition-all ${
                activeTab === 'INBOUND' ? 'bg-[#2E7D32] text-white' : 'text-[#2E7D32] hover:bg-[#E8F5E9]'
              }`}
            >
              Inbound ({movements.filter(m => m.movement_type === 'INBOUND').length})
            </button>

            <button
              onClick={() => setActiveTab('OUTBOUND')}
              className={`px-3 py-2 rounded uppercase font-bold transition-all ${
                activeTab === 'OUTBOUND' ? 'bg-[#1D4ED8] text-white' : 'text-[#1D4ED8] hover:bg-[#EFF6FF]'
              }`}
            >
              Outbound ({movements.filter(m => m.movement_type === 'OUTBOUND').length})
            </button>

            <button
              onClick={() => setActiveTab('ADJUSTMENT')}
              className={`px-3 py-2 rounded uppercase font-bold transition-all ${
                activeTab === 'ADJUSTMENT' ? 'bg-[#B45309] text-white' : 'text-[#B45309] hover:bg-[#FFFBEB]'
              }`}
            >
              Adjustments ({movements.filter(m => m.movement_type === 'ADJUSTMENT').length})
            </button>

            <button
              onClick={() => setActiveTab('RETURN')}
              className={`px-3 py-2 rounded uppercase font-bold transition-all ${
                activeTab === 'RETURN' ? 'bg-[#7E22CE] text-white' : 'text-[#7E22CE] hover:bg-[#F3E8FF]'
              }`}
            >
              Returns ({movements.filter(m => m.movement_type === 'RETURN').length})
            </button>
          </div>

          {/* Search Box & Export CSV */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 lg:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ledger by SKU, reason..."
                className="w-full h-10 pl-9 pr-3 bg-[#F8F5EF] border border-[#E8E0D4] text-xs font-mono-data text-[#111111] rounded focus:outline-none focus:border-[#8A6D2F]"
              />
            </div>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 bg-[#FFFFFF] hover:bg-[#F3EFE6] border border-[#E8E0D4] text-xs font-mono-data text-[#111111] rounded flex items-center gap-1.5 transition-colors font-bold shadow-sm whitespace-nowrap"
            >
              <Download className="w-4 h-4 text-[#8A6D2F]" />
              <span>CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Movements Table Card */}
      <div className="bg-[#FFFFFF] border border-[#E8E0D4] rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-data">
            <thead className="bg-[#F8F5EF] text-[#6B6B6B] uppercase text-[10px] font-syne border-b border-[#E8E0D4]">
              <tr>
                <th className="py-3 px-4 font-bold">Type</th>
                <th className="py-3 px-3 font-bold">Product Specification</th>
                <th className="py-3 px-3 font-bold">SKU</th>
                <th className="py-3 px-3 text-right font-bold">Quantity</th>
                <th className="py-3 px-3 text-center font-bold">Stock Transition</th>
                <th className="py-3 px-3 font-bold">Reference / Reason</th>
                <th className="py-3 px-3 font-bold">Operator</th>
                <th className="py-3 px-4 text-right font-bold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0D4]">
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-[#6B6B6B]">
                    <History className="w-10 h-10 mx-auto mb-3 text-[#8A6D2F] opacity-60" />
                    <div className="font-serif-luxury text-base font-bold text-[#111111]">No stock movement records found</div>
                    <div className="text-xs text-[#6B6B6B] mt-1 font-mono-data">Execute a stock operation or adjust filter criteria.</div>
                  </td>
                </tr>
              ) : (
                filteredMovements.map(mov => {
                  let badge = 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]';
                  if (mov.movement_type === 'OUTBOUND') badge = 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]';
                  if (mov.movement_type === 'ADJUSTMENT') badge = 'bg-[#FFFBEB] text-[#B45309] border-[#FEF3C7]';
                  if (mov.movement_type === 'RETURN') badge = 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]';

                  return (
                    <tr key={mov.id} className="hover:bg-[#FBF9F5] transition-colors">
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${badge}`}>
                          {mov.movement_type}
                        </span>
                      </td>

                      <td className="py-4 px-3">
                        <div className="font-serif-luxury font-bold text-[#111111] text-sm">
                          {mov.product_name || 'Inventory Item'}
                        </div>
                      </td>

                      <td className="py-4 px-3 font-bold text-[#8A6D2F]">
                        {mov.product_sku || 'N/A'}
                      </td>

                      <td className="py-4 px-3 text-right font-bold text-sm">
                        <span className={mov.movement_type === 'OUTBOUND' ? 'text-[#1D4ED8]' : 'text-[#2E7D32]'}>
                          {mov.movement_type === 'OUTBOUND' ? '-' : '+'}{Math.abs(mov.quantity)}
                        </span>
                      </td>

                      <td className="py-4 px-3 text-center text-[#6B6B6B]">
                        <span className="text-[#6B6B6B]">{mov.previous_stock}</span>
                        <span className="px-1.5 text-[#8A6D2F]">→</span>
                        <span className="font-bold text-[#111111]">{mov.new_stock}</span>
                      </td>

                      <td className="py-4 px-3">
                        <div className="font-bold text-[#111111]">{mov.reason}</div>
                        <div className="text-[10px] text-[#6B6B6B]">Ref: {mov.reference_number}</div>
                      </td>

                      <td className="py-4 px-3 text-[#6B6B6B] text-[11px] font-bold">
                        {mov.user_email}
                      </td>

                      <td className="py-4 px-4 text-right text-[#6B6B6B] text-[11px]">
                        {new Date(mov.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Movement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#FFFFFF] border border-[#E8E0D4] rounded shadow-2xl p-6 space-y-4 font-mono-data text-xs text-[#111111]">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D4]">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-[#8A6D2F]" />
                <h3 className="font-serif-luxury text-base font-bold text-[#111111] uppercase">
                  Record {modalType} Stock Operation
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-[#6B6B6B] hover:text-[#111111]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-[#FFF2F2] border border-[#FFCDD2] text-[#B33939] rounded">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSubmitMovement} className="space-y-4">
              <div>
                <label className="text-[10px] text-[#6B6B6B] uppercase font-bold block mb-1">Select Product Specification *</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-[#111111] rounded font-bold focus:outline-none cursor-pointer"
                >
                  {products.filter(p => !p.archived).map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku}) — Stock: {p.current_stock}
                    </option>
                  ))}
                </select>
              </div>

              {activeProduct && (
                <div className="p-3 bg-[#F8F5EF] border border-[#E8E0D4] rounded text-[11px] space-y-1">
                  <div className="font-bold text-[#111111]">Active Vault Location: {activeProduct.warehouse_location}</div>
                  <div className="text-[#6B6B6B]">Current Physical Stock: {activeProduct.current_stock} units (Min: {activeProduct.minimum_stock})</div>
                </div>
              )}

              {modalType === 'ADJUSTMENT' && (
                <div>
                  <label className="text-[10px] text-[#6B6B6B] uppercase font-bold block mb-1">Adjustment Direction *</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setAdjustmentSign('+')}
                      className={`flex-1 py-2 rounded border font-bold ${adjustmentSign === '+' ? 'bg-[#2E7D32] text-white border-[#2E7D32]' : 'bg-[#F8F5EF] text-[#6B6B6B] border-[#E8E0D4]'}`}
                    >
                      + Add Stock (Found/Audit)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdjustmentSign('-')}
                      className={`flex-1 py-2 rounded border font-bold ${adjustmentSign === '-' ? 'bg-[#B33939] text-white border-[#B33939]' : 'bg-[#F8F5EF] text-[#6B6B6B] border-[#E8E0D4]'}`}
                    >
                      - Subtract Stock (Shrinkage/Damage)
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[#6B6B6B] uppercase font-bold block mb-1">Quantity Units *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-[#111111] font-bold rounded focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#6B6B6B] uppercase font-bold block mb-1">Reference / PO / SO Code *</label>
                  <input
                    type="text"
                    required
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full h-10 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-[#111111] font-bold rounded focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#6B6B6B] uppercase font-bold block mb-1">Reason / Operation Note *</label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-[#111111] font-bold rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#6B6B6B] uppercase font-bold block mb-1">Additional Operator Remarks</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional batch numbers, courier tracking, quality inspection status..."
                  className="w-full p-2.5 bg-[#F8F5EF] border border-[#E8E0D4] text-[#111111] rounded focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-[#E8E0D4] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#F8F5EF] border border-[#E8E0D4] text-[#6B6B6B] hover:text-[#111111] font-bold uppercase rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#111111] hover:bg-[#8A6D2F] text-[#FFE09D] font-syne font-bold uppercase rounded shadow-md transition-all"
                >
                  {submitting ? 'Recording...' : `Commit ${modalType} Operation`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
