import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { Search, Truck, CheckCircle2, Clock, AlertCircle, PackageCheck, MapPin } from 'lucide-react';

export function OrderTrackingView() {
  const { orders, lastPlacedOrder, formatPKR, setStorefrontView } = useApp();

  const [orderNumberInput, setOrderNumberInput] = useState(lastPlacedOrder?.order_number || 'ORD-1024');
  const [phoneInput, setPhoneInput] = useState(lastPlacedOrder?.customer.phone || '03008821940');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(lastPlacedOrder || orders[0] || null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const cleanNum = orderNumberInput.trim().toUpperCase();
    const found = orders.find(o => 
      o.order_number.toUpperCase() === cleanNum || 
      o.id.toUpperCase() === cleanNum
    );
    setSearchedOrder(found || null);
  };

  const steps: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered'
  ];

  const getStepIndex = (status: OrderStatus) => {
    return steps.indexOf(status);
  };

  const currentStepIndex = searchedOrder ? getStepIndex(searchedOrder.status) : -1;

  return (
    <div className="bg-[#F8F5EF] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Title */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-syne uppercase tracking-widest text-[#8A6D2F] font-bold">
            Atelier Logistics Radar
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#111111]">
            Track Your Fragrance Parcel
          </h1>
          <p className="text-xs text-[#6B6B6B] font-mono-data">
            Monitor real-time vault allocation, temperature-controlled courier transit, and delivery status across Pakistan.
          </p>
        </div>

        {/* Tracking Search Form */}
        <div className="bg-white border border-[#E8E0D4] p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="text-[11px] uppercase font-mono-data text-[#6B6B6B] block mb-1">
                Order Identifier (e.g. ORD-1024)
              </label>
              <input
                type="text"
                required
                value={orderNumberInput}
                onChange={(e) => setOrderNumberInput(e.target.value)}
                placeholder="ORD-XXXX"
                className="w-full h-11 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-xs font-mono-data text-[#111111] focus:outline-none focus:border-[#8A6D2F]"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase font-mono-data text-[#6B6B6B] block mb-1">
                Recipient Mobile Number
              </label>
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="03XXXXXXXXX"
                className="w-full h-11 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-xs font-mono-data text-[#111111] focus:outline-none focus:border-[#8A6D2F]"
              />
            </div>

            <button
              type="submit"
              className="h-11 px-6 bg-[#111111] text-[#FFE09D] hover:bg-[#8A6D2F] text-xs uppercase font-syne font-bold tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Track Parcel</span>
            </button>
          </form>
        </div>

        {/* Tracking Results View */}
        {searchedOrder ? (
          <div className="bg-white border border-[#E8E0D4] p-6 sm:p-8 space-y-8 animate-fadeIn">
            
            {/* Order Status Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8E0D4] gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono-data text-xl font-bold text-[#111111]">
                    {searchedOrder.order_number}
                  </span>
                  <span className="px-2.5 py-0.5 bg-[#8A6D2F]/15 text-[#8A6D2F] text-xs font-bold uppercase font-mono-data">
                    {searchedOrder.status}
                  </span>
                </div>
                <div className="text-xs text-[#6B6B6B] font-mono-data mt-1">
                  Placed on {new Date(searchedOrder.created_at).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-[#6B6B6B] font-mono-data uppercase block">Courier Transit AWB</span>
                <div className="font-mono-data text-xs font-bold text-[#111111] flex items-center sm:justify-end gap-1.5 mt-0.5">
                  <Truck className="w-4 h-4 text-[#8A6D2F]" />
                  <span>{searchedOrder.courier || 'TCS Express'}: {searchedOrder.tracking_number || 'TRK-992140-PK'}</span>
                </div>
              </div>
            </div>

            {/* Visual Stepper Timeline */}
            <div>
              <h3 className="font-syne text-xs uppercase tracking-widest text-[#111111] font-bold mb-6">
                Real-Time Fulfillment Timeline
              </h3>

              <div className="relative">
                {/* Connecting Line */}
                <div className="hidden sm:block absolute top-5 left-0 right-0 h-0.5 bg-[#E8E0D4]">
                  <div 
                    className="bg-[#8A6D2F] h-full transition-all duration-700"
                    style={{ 
                      width: `${Math.max(0, Math.min(100, (currentStepIndex / (steps.length - 1)) * 100))}%` 
                    }}
                  ></div>
                </div>

                {/* Steps Nodes */}
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 relative z-10">
                  {steps.map((st, idx) => {
                    const isDone = currentStepIndex >= idx;
                    const isCurrent = currentStepIndex === idx;

                    return (
                      <div key={st} className="flex flex-col items-center text-center">
                        <div className={`w-10 h-10 flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                          isDone 
                            ? 'bg-[#111111] text-[#FFE09D] ring-2 ring-[#8A6D2F]' 
                            : 'bg-[#F8F5EF] text-[#6B6B6B] border border-[#E8E0D4]'
                        }`}>
                          {isDone ? <CheckCircle2 className="w-5 h-5 text-[#C8A96B]" /> : idx + 1}
                        </div>
                        <span className={`text-xs mt-2 font-mono-data ${isCurrent ? 'font-bold text-[#8A6D2F]' : isDone ? 'text-[#111111]' : 'text-[#6B6B6B]'}`}>
                          {st}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Audit History Log */}
            <div className="pt-6 border-t border-[#E8E0D4] space-y-3">
              <h4 className="font-syne text-xs uppercase tracking-widest text-[#111111] font-bold">
                Logistics Ledger Entries
              </h4>
              <div className="space-y-2">
                {searchedOrder.status_history.map((hist, i) => (
                  <div key={i} className="p-3 bg-[#F8F5EF] border border-[#E8E0D4] flex items-start justify-between text-xs font-mono-data">
                    <div className="space-y-0.5">
                      <div className="font-bold text-[#111111]">{hist.status}</div>
                      <div className="text-[#6B6B6B]">{hist.note}</div>
                      <div className="text-[10px] text-[#8A6D2F]">Logged by: {hist.actor}</div>
                    </div>
                    <span className="text-[10px] text-[#6B6B6B]">
                      {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Destination Coordinates */}
            <div className="pt-4 border-t border-[#E8E0D4] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-data bg-[#F8F5EF] p-4 border border-[#E8E0D4]">
              <div>
                <span className="text-[10px] text-[#6B6B6B] uppercase block">Delivery Destination</span>
                <div className="font-bold text-[#111111]">{searchedOrder.shipping_address.name}</div>
                <div className="text-[#6B6B6B]">{searchedOrder.shipping_address.address_line}</div>
                <div className="text-[#6B6B6B]">{searchedOrder.shipping_address.city}, {searchedOrder.shipping_address.province}</div>
              </div>
              <div>
                <span className="text-[10px] text-[#6B6B6B] uppercase block">Payment State</span>
                <div className="font-bold text-[#111111]">{searchedOrder.payment_method}</div>
                <div className="text-[#8A6D2F] font-semibold">{searchedOrder.payment_status} · Total: {formatPKR(searchedOrder.total)}</div>
              </div>
            </div>
          </div>
        ) : hasSearched ? (
          <div className="bg-white border border-[#E8E0D4] p-12 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-[#A33A3A] mx-auto" />
            <h3 className="font-serif-luxury text-xl font-bold text-[#111111]">
              Order Not Found
            </h3>
            <p className="text-xs text-[#6B6B6B]">
              Please double check the order number (e.g. ORD-1024) or contact our concierge on WhatsApp (+92 300 8821940).
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
