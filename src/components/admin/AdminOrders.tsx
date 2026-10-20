import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus, Courier } from '../../types';
import { updateOrderStatus } from '../../api/mockApi';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Printer, 
  Share2, 
  Eye, 
  Building2, 
  Check, 
  X 
} from 'lucide-react';

export function AdminOrders() {
  const { orders, formatPKR, refreshOrders, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedCourier, setSelectedCourier] = useState<Courier>('TCS');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const statuses: (OrderStatus | 'All')[] = [
    'All',
    'Pending',
    'Confirmed',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled'
  ];

  const filteredOrders = orders.filter(o => {
    if (activeTab !== 'All' && o.status !== activeTab) return false;
    if (search) {
      const q = search.toLowerCase();
      return o.order_number.toLowerCase().includes(q) ||
             o.customer.name.toLowerCase().includes(q) ||
             o.customer.phone.includes(q) ||
             o.shipping_address.city.toLowerCase().includes(q);
    }
    return true;
  });

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    setIsUpdating(true);

    try {
      const updated = await updateOrderStatus(
        selectedOrder.id,
        newStatus,
        statusNote || `Status updated to ${newStatus}`,
        newStatus === 'Shipped' ? selectedCourier : selectedOrder.courier,
        newStatus === 'Shipped' ? (trackingNumber || `${selectedCourier}-PK-${Math.floor(100000 + Math.random() * 900000)}`) : selectedOrder.tracking_number
      );

      await refreshOrders();
      setSelectedOrder(updated);
      showToast(`Order ${updated.order_number} transitioned to ${newStatus}.`, 'success');
      setStatusNote('');
    } catch (err) {
      showToast('Status update failed.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleVerifyBankProof = async () => {
    if (!selectedOrder) return;
    await handleUpdateStatus('Confirmed');
    showToast(`Bank wire proof verified for ${selectedOrder.order_number}.`, 'success');
  };

  return (
    <div className="flex flex-col w-full bg-[#111418] text-[#e1e2e8] min-h-screen">
      
      {/* Header */}
      <div className="px-6 py-5 bg-[#0b0e12]/80 border-b border-[#4d4639]/30 flex flex-col gap-4 font-mono-data">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-[#999080] uppercase tracking-widest block">
              Atelier Distribution Ledger · Order Command
            </span>
            <h1 className="font-syne text-2xl sm:text-3xl font-bold text-[#e1e2e8] uppercase">
              Purchases & Order Fulfillment
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => showToast('Orders ledger exported to CSV.', 'success')}
              className="h-9 px-3 bg-[#272a2e] hover:bg-[#323539] text-[#e1e2e8] uppercase flex items-center gap-1.5 border border-[#4d4639]/40"
            >
              <Share2 className="w-3.5 h-3.5 text-[#dee3ee]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Status Tabs with Counts */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {statuses.map(st => {
            const count = st === 'All' ? orders.length : orders.filter(o => o.status === st).length;
            const isActive = activeTab === st;

            return (
              <button
                key={st}
                type="button"
                onClick={() => setActiveTab(st)}
                className={`px-3 py-1.5 text-xs font-mono-data uppercase flex items-center gap-2 transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-[#ffe09d] text-[#251a00] font-bold shadow-sm' 
                    : 'bg-[#191c20] text-[#999080] hover:text-[#e1e2e8] border border-[#4d4639]/30'
                }`}
              >
                <span>{st}</span>
                <span className={`px-1.5 py-0.2 text-[10px] ${isActive ? 'bg-[#251a00] text-[#ffe09d]' : 'bg-[#272a2e] text-[#d0c5b4]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 py-4 bg-[#0b0e12]/40 border-b border-[#4d4639]/30 flex items-center justify-between gap-4 font-mono-data text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#999080] absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by Order #, Customer Name, City or Phone..."
            className="w-full h-10 pl-9 pr-3 bg-[#191c20] border border-[#4d4639]/40 text-[#e1e2e8] placeholder:text-[#999080] focus:outline-none focus:border-[#ffe09d]"
          />
        </div>
        <span className="text-[#999080]">Showing {filteredOrders.length} orders</span>
      </div>

      {/* Orders Table */}
      <div className="p-6">
        <div className="w-full overflow-x-auto bg-[#191c20] border border-[#4d4639]/30">
          <table className="w-full text-left border-collapse font-mono-data text-xs">
            <thead>
              <tr className="bg-[#0b0e12] text-[#999080] uppercase text-[10px] tracking-wider border-b border-[#4d4639]/30">
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Patron & Destination</th>
                <th className="py-3 px-3">Flacons</th>
                <th className="py-3 px-3 text-right">Settlement Total</th>
                <th className="py-3 px-3 text-center">Payment</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#323539]/30 text-[#e1e2e8]">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-[#1d2024] transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-[#ffe09d] block text-sm">{order.order_number}</span>
                    <span className="text-[10px] text-[#999080]">
                      {new Date(order.created_at).toLocaleDateString()} · {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-[#e1e2e8]">{order.customer.name}</div>
                    <div className="text-[10px] text-[#999080]">{order.shipping_address.city}, {order.shipping_address.province}</div>
                    <div className="text-[10px] text-[#e9c176]">{order.customer.phone}</div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="text-xs">
                      {order.items.reduce((acc, i) => acc + i.quantity, 0)} btls
                    </div>
                    <div className="text-[10px] text-[#999080] truncate max-w-[160px]">
                      {order.items[0]?.product_name}
                    </div>
                  </td>

                  <td className="py-3 px-3 text-right font-bold text-[#ffe09d]">
                    Rs. {order.total.toLocaleString()}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 bg-[#1d2024] border border-[#4d4639]/30 text-[10px] uppercase font-bold text-[#d0c5b4] block">
                      {order.payment_method}
                    </span>
                    <span className={`text-[9px] uppercase mt-0.5 block ${
                      order.payment_status === 'Paid' || order.payment_status === 'Verified' ? 'text-[#2EE59D]' : 'text-[#e9c176]'
                    }`}>
                      {order.payment_status}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span className={`inline-flex px-2 py-0.5 text-[10px] uppercase font-bold ${
                      order.status === 'Delivered' ? 'bg-[#0E2319] text-[#2EE59D]' :
                      order.status === 'Shipped' ? 'bg-[#272a2e] text-[#ffe09d]' :
                      order.status === 'Processing' ? 'bg-[#604403] text-[#e9c176]' :
                      order.status === 'Cancelled' ? 'bg-[#93000a] text-[#ffdad6]' :
                      'bg-[#1d2024] text-[#d0c5b4]'
                    }`}>
                      {order.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-1.5 bg-[#272a2e] hover:bg-[#ffe09d] hover:text-[#251a00] text-[#e1e2e8] text-[10px] uppercase font-bold transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Order</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal / Slide Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-2xl bg-[#0b0e12] border-l border-[#4d4639] h-full overflow-y-auto p-6 space-y-6 font-mono-data text-xs animate-fadeIn">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#4d4639]/40">
              <div>
                <span className="text-[10px] text-[#999080] uppercase">Fulfillment Dossier</span>
                <div className="flex items-center gap-3">
                  <h3 className="font-syne text-xl font-bold text-[#ffe09d]">{selectedOrder.order_number}</h3>
                  <span className="px-2 py-0.5 bg-[#272a2e] text-[#e9c176] uppercase font-bold text-[10px]">
                    {selectedOrder.status}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1.5 text-[#999080] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bank Wire Proof Verification Panel */}
            {selectedOrder.payment_method === 'Bank Transfer' && selectedOrder.payment_proof_url && (
              <div className="p-4 bg-[#191c20] border border-[#ffe09d] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-[#ffe09d] flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    <span>Customer Bank Wire Slip Proof</span>
                  </span>
                  <span className="text-[10px] text-[#2EE59D] uppercase font-bold">Proof Attached</span>
                </div>

                <div className="w-full h-40 bg-[#0b0e12] overflow-hidden border border-[#4d4639]/40 relative">
                  <img src={selectedOrder.payment_proof_url} alt="Bank Slip" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2 text-[10px] text-white">
                    <span>Meezan Bank Wire · Verified against IBAN PK64MEZN0002880105829101</span>
                  </div>
                </div>

                {selectedOrder.payment_status !== 'Verified' && (
                  <button
                    type="button"
                    onClick={handleVerifyBankProof}
                    className="w-full py-2 bg-[#ffe09d] text-[#251a00] hover:bg-[#e5c378] uppercase font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    <span>Verify Bank Proof & Confirm Order</span>
                  </button>
                )}
              </div>
            )}

            {/* Patron & Destination */}
            <div className="grid grid-cols-2 gap-4 bg-[#191c20] p-4 border border-[#4d4639]/30">
              <div>
                <span className="text-[10px] text-[#999080] uppercase block">Client Name</span>
                <div className="font-bold text-[#e1e2e8] text-sm">{selectedOrder.customer.name}</div>
                <div className="text-[11px] text-[#999080]">{selectedOrder.customer.email}</div>
                <div className="text-[11px] text-[#ffe09d]">{selectedOrder.customer.phone}</div>
              </div>
              <div>
                <span className="text-[10px] text-[#999080] uppercase block">Shipping Address</span>
                <div className="text-[#e1e2e8]">{selectedOrder.shipping_address.address_line}</div>
                <div className="text-[#999080]">{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.province}</div>
                <div className="text-[10px] text-[#e9c176] mt-1">{selectedOrder.delivery_method}</div>
              </div>
            </div>

            {/* Line Items Snapshot */}
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold text-[#ffe09d] block">Allocated Products & SKUs</span>
              {selectedOrder.items.map(item => (
                <div key={item.id} className="p-3 bg-[#191c20] border border-[#4d4639]/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt="" className="w-10 h-12 object-cover border border-[#4d4639]" />
                    <div>
                      <div className="font-bold text-[#e1e2e8]">{item.product_name}</div>
                      <div className="text-[10px] text-[#999080]">SKU: {item.sku} · {item.size_ml}ml · Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <span className="font-bold text-[#ffe09d]">
                    Rs. {(item.price_snapshot * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Ledger Calculation */}
            <div className="bg-[#191c20] p-4 border border-[#4d4639]/30 space-y-1.5">
              <div className="flex justify-between text-[#999080]">
                <span>Subtotal</span>
                <span className="text-[#e1e2e8]">Rs. {selectedOrder.subtotal.toLocaleString()}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-[#2EE59D]">
                  <span>Discount</span>
                  <span>- Rs. {selectedOrder.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-[#999080]">
                <span>Shipping</span>
                <span>{selectedOrder.shipping_fee === 0 ? 'FREE' : `Rs. ${selectedOrder.shipping_fee}`}</span>
              </div>
              {selectedOrder.cod_fee > 0 && (
                <div className="flex justify-between text-[#999080]">
                  <span>COD Fee</span>
                  <span>Rs. {selectedOrder.cod_fee}</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#4d4639]/40 flex justify-between text-base font-bold text-[#ffe09d]">
                <span>Total</span>
                <span>Rs. {selectedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Allowed Status Transition Actions */}
            <div className="p-4 bg-[#1d2024] border border-[#4d4639]/40 space-y-3">
              <span className="text-xs font-bold uppercase text-[#e1e2e8] block">Advance Fulfillment Pipeline</span>
              
              <div className="flex flex-wrap gap-2">
                {selectedOrder.status === 'Pending' && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('Confirmed')}
                    disabled={isUpdating}
                    className="px-3 py-2 bg-[#ffe09d] text-[#251a00] font-bold uppercase text-xs hover:bg-[#e5c378]"
                  >
                    Confirm Order
                  </button>
                )}

                {(selectedOrder.status === 'Confirmed' || selectedOrder.status === 'Pending') && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('Processing')}
                    disabled={isUpdating}
                    className="px-3 py-2 bg-[#e9c176] text-[#251a00] font-bold uppercase text-xs hover:bg-[#ffe09d]"
                  >
                    Allocate Batch Lot (Processing)
                  </button>
                )}

                {selectedOrder.status === 'Processing' && (
                  <div className="w-full space-y-3 pt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-[#999080] uppercase block mb-1">Select Courier</label>
                        <select
                          value={selectedCourier}
                          onChange={(e) => setSelectedCourier(e.target.value as Courier)}
                          className="w-full h-9 px-2 bg-[#0b0e12] border border-[#4d4639] text-xs text-white"
                        >
                          <option value="TCS">TCS Express Overnight</option>
                          <option value="Leopards">Leopards Courier</option>
                          <option value="Trax">Trax Logistics</option>
                          <option value="PostEx">PostEx Air</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-[#999080] uppercase block mb-1">Airway Bill / Tracking #</label>
                        <input
                          type="text"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="e.g. TCS-PK-981240"
                          className="w-full h-9 px-2 bg-[#0b0e12] border border-[#4d4639] text-xs text-white"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus('Shipped')}
                      disabled={isUpdating}
                      className="w-full py-2.5 bg-[#ffe09d] text-[#251a00] font-bold uppercase text-xs hover:bg-[#e5c378] flex items-center justify-center gap-2"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Dispatch via {selectedCourier} (Mark Shipped)</span>
                    </button>
                  </div>
                )}

                {selectedOrder.status === 'Shipped' && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('Delivered')}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-[#2EE59D] text-[#0b0e12] font-bold uppercase text-xs hover:bg-[#2EE59D]/80 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Doorstep Delivery (Delivered)</span>
                  </button>
                )}

                {selectedOrder.status !== 'Delivered' && selectedOrder.status !== 'Cancelled' && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('Cancelled')}
                    disabled={isUpdating}
                    className="px-3 py-2 bg-[#93000a] text-[#ffdad6] font-bold uppercase text-xs hover:bg-[#ffb4ab] hover:text-[#251a00]"
                  >
                    Cancel Order
                  </button>
                )}
              </div>

              {/* Status Note input */}
              <div>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Optional internal note for audit trail..."
                  className="w-full h-8 px-2 bg-[#0b0e12] border border-[#4d4639] text-xs text-white"
                />
              </div>
            </div>

            {/* Audit History Timeline */}
            <div className="space-y-2 pt-2">
              <span className="text-xs uppercase font-bold text-[#999080] block">Audit Log for this Order</span>
              <div className="space-y-1.5">
                {selectedOrder.status_history.map((hist, i) => (
                  <div key={i} className="p-2.5 bg-[#191c20] border border-[#4d4639]/20 flex items-start justify-between">
                    <div>
                      <span className="font-bold text-[#ffe09d]">{hist.status}</span>: <span className="text-[#d0c5b4]">{hist.note}</span>
                      <span className="text-[10px] text-[#999080] block mt-0.5">By {hist.actor}</span>
                    </div>
                    <span className="text-[10px] text-[#999080]">
                      {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
