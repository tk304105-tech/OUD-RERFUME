import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Truck, Package, ArrowRight, FileText, PhoneCall, Building2 } from 'lucide-react';

export function OrderSuccessView() {
  const { lastPlacedOrder, setStorefrontView, formatPKR } = useApp();

  if (!lastPlacedOrder) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <p className="text-sm text-[#6B6B6B]">No recent order found.</p>
        <button 
          onClick={() => setStorefrontView('home')} 
          className="mt-4 px-6 py-2 bg-[#111111] text-white text-xs uppercase"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F5EF] min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Banner */}
        <div className="bg-white border border-[#E8E0D4] p-8 sm:p-10 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 mx-auto bg-[#2F6B4F]/10 text-[#2F6B4F] flex items-center justify-center rounded-none">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="font-syne text-xs uppercase tracking-widest text-[#8A6D2F] font-bold block">
            Atelier Allocation Confirmed
          </span>

          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#111111]">
            Thank you, {lastPlacedOrder.customer.name}
          </h1>

          <p className="text-sm text-[#6B6B6B] max-w-lg mx-auto font-serif-luxury">
            Your fragrance order <strong className="text-[#111111] font-mono-data">#{lastPlacedOrder.order_number}</strong> has been secured in our vault ledger. A confirmation SMS and email have been dispatched.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setStorefrontView('order-tracking')}
              className="px-6 py-3 bg-[#111111] text-[#FFE09D] hover:bg-[#8A6D2F] text-xs uppercase font-syne font-bold tracking-widest transition-colors flex items-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Delivery Timeline</span>
            </button>

            <button
              onClick={() => setStorefrontView('shop')}
              className="px-6 py-3 border border-[#E8E0D4] text-[#111111] hover:bg-[#F8F5EF] text-xs uppercase font-syne font-semibold tracking-wider transition-colors"
            >
              Continue Exploring
            </button>
          </div>
        </div>

        {/* Bank Wire Proof Notice if applicable */}
        {lastPlacedOrder.payment_method === 'Bank Transfer' && (
          <div className="mt-6 p-6 bg-white border border-[#C8A96B] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#8A6D2F] uppercase font-syne">
              <Building2 className="w-4 h-4" />
              <span>Bank Transfer Order Status: Awaiting Proof Verification</span>
            </div>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              Your payment receipt has been received and routed to our finance desk. As soon as the wire settles in Meezan Bank, your order will transition to "Processing" and courier airway bills will be generated.
            </p>
          </div>
        )}

        {/* Order Details Grid */}
        <div className="mt-8 bg-white border border-[#E8E0D4] p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E0D4]">
            <div>
              <span className="text-[10px] text-[#6B6B6B] font-mono-data uppercase">Order Number</span>
              <div className="font-mono-data text-lg font-bold text-[#111111]">{lastPlacedOrder.order_number}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#6B6B6B] font-mono-data uppercase">Payment Method</span>
              <div className="font-mono-data text-sm font-semibold text-[#8A6D2F]">{lastPlacedOrder.payment_method}</div>
            </div>
          </div>

          {/* Delivery Snapshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-data">
            <div>
              <span className="text-[#6B6B6B] uppercase text-[10px] block mb-1">Destination Address</span>
              <div className="font-semibold text-[#111111]">{lastPlacedOrder.shipping_address.name}</div>
              <div className="text-[#6B6B6B]">{lastPlacedOrder.shipping_address.address_line}</div>
              <div className="text-[#6B6B6B]">{lastPlacedOrder.shipping_address.city}, {lastPlacedOrder.shipping_address.province}</div>
              <div className="text-[#8A6D2F] mt-1">{lastPlacedOrder.shipping_address.phone}</div>
            </div>
            <div>
              <span className="text-[#6B6B6B] uppercase text-[10px] block mb-1">Estimated Courier Window</span>
              <div className="font-semibold text-[#111111]">{lastPlacedOrder.delivery_method}</div>
              <div className="text-[#6B6B6B] mt-1">Dispatched via cold-chain bonded freight to preserve delicate olfactory top notes.</div>
            </div>
          </div>

          {/* Ordered Line Items */}
          <div className="pt-4 border-t border-[#E8E0D4] space-y-3">
            <span className="text-xs font-syne uppercase font-bold text-[#111111] block">Allocated Flacons</span>
            {lastPlacedOrder.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs font-mono-data py-2 border-b border-[#E8E0D4]/40 last:border-0">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt="" className="w-10 h-12 object-cover border border-[#E8E0D4]" />
                  <div>
                    <div className="font-bold text-[#111111] font-serif-luxury text-sm">{item.product_name}</div>
                    <div className="text-[11px] text-[#8A6D2F]">{item.size_ml}ml · SKU: {item.sku} · Qty: {item.quantity}</div>
                  </div>
                </div>
                <span className="font-bold text-[#111111]">
                  {formatPKR(item.price_snapshot * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="pt-4 border-t border-[#E8E0D4] flex justify-between items-baseline font-mono-data">
            <span className="font-serif-luxury text-base font-bold text-[#111111]">Total Settlement</span>
            <span className="text-xl font-bold text-[#8A6D2F]">{formatPKR(lastPlacedOrder.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
