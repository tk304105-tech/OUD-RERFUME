import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Truck, RefreshCw, Sparkles, Send, Check } from 'lucide-react';

export function Footer() {
  const { setStorefrontView } = useApp();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribed(true);
  };

  return (
    <footer className="bg-[#111111] text-[#E8E0D4] pt-16 pb-12 border-t border-[#333333]">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <span className="font-serif-luxury text-2xl font-bold tracking-[0.2em] text-[#FFFFFF] uppercase block">
            Aura Oud
          </span>
          <p className="text-xs text-[#999080] leading-relaxed">
            Haute Parfumerie engineered for connoisseurs. Bridging ancient Eastern agarwood heritage with contemporary French distillation rigor.
          </p>
          <div className="pt-2 text-[11px] text-[#C8A96B] font-mono-data space-y-1">
            <div>Boutique Suite: Sector Y, DHA Phase 5, Lahore</div>
            <div>Atelier Flagship: 26th Street, DHA Phase 6, Karachi</div>
            <div>Concierge WhatsApp: +92 300 8821940</div>
          </div>
        </div>

        {/* Olfactive Collections */}
        <div>
          <h4 className="font-syne text-xs uppercase tracking-widest text-[#FFFFFF] font-semibold mb-4">
            Collections
          </h4>
          <ul className="space-y-2.5 text-xs text-[#999080]">
            <li><button onClick={() => setStorefrontView('shop')} className="hover:text-[#C8A96B] transition-colors">Heritage Oud Extraits</button></li>
            <li><button onClick={() => setStorefrontView('shop')} className="hover:text-[#C8A96B] transition-colors">Atelier Florals Line</button></li>
            <li><button onClick={() => setStorefrontView('shop')} className="hover:text-[#C8A96B] transition-colors">Summer Reserve Colognes</button></li>
            <li><button onClick={() => setStorefrontView('shop')} className="hover:text-[#C8A96B] transition-colors">Pure Non-Alcoholic Attars</button></li>
          </ul>
        </div>

        {/* Client Concierge */}
        <div>
          <h4 className="font-syne text-xs uppercase tracking-widest text-[#FFFFFF] font-semibold mb-4">
            Client Concierge
          </h4>
          <ul className="space-y-2.5 text-xs text-[#999080]">
            <li><button onClick={() => setStorefrontView('order-tracking')} className="hover:text-[#C8A96B] transition-colors">Track Your Parcel</button></li>
            <li><button onClick={() => setStorefrontView('faq')} className="hover:text-[#C8A96B] transition-colors">Delivery Rates & Policy</button></li>
            <li><button onClick={() => setStorefrontView('contact')} className="hover:text-[#C8A96B] transition-colors">Book Private Sniffing Session</button></li>
            <li><button onClick={() => setStorefrontView('about')} className="hover:text-[#C8A96B] transition-colors">Authenticity & Batch Proof</button></li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div>
          <h4 className="font-syne text-xs uppercase tracking-widest text-[#FFFFFF] font-semibold mb-3">
            The Atelier Dispatch
          </h4>
          <p className="text-xs text-[#999080] mb-3 leading-relaxed">
            Receive exclusive allocations of limited vintage distillations.
          </p>
          {isSubscribed ? (
            <div className="p-3 bg-[#1D2024] border border-[#2F6B4F] text-[#2EE59D] text-xs flex items-center gap-2">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>Welcome to the Collector's Guild.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full h-10 px-3 bg-[#191C20] border border-[#333333] text-xs text-[#FFFFFF] placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#C8A96B]"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-[#C8A96B] text-[#111111] hover:bg-[#ffe09d] transition-colors flex items-center justify-center"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Legal & Payment Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#262626] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#6B6B6B]">
        <div>
          &copy; {new Date().getFullYear()} Aura Oud Parfums. All rights reserved. Registered Haute Parfumerie Pakistan.
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono-data text-[#999080]">
          <span className="px-2 py-0.5 bg-[#191C20] border border-[#333333]">CASH ON DELIVERY</span>
          <span className="px-2 py-0.5 bg-[#191C20] border border-[#333333]">MEEZAN BANK</span>
          <span className="px-2 py-0.5 bg-[#191C20] border border-[#333333]">JAZZCASH</span>
          <span className="px-2 py-0.5 bg-[#191C20] border border-[#333333]">EASYPAISA</span>
          <span className="px-2 py-0.5 bg-[#191C20] border border-[#333333]">VISA / MASTERCARD</span>
        </div>
      </div>
    </footer>
  );
}
