import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Store, 
  Plus, 
  Bell, 
  User, 
  ChevronDown, 
  ArrowRight, 
  Boxes, 
  Receipt, 
  Sliders, 
  FlaskConical,
  LogOut
} from 'lucide-react';

interface AdminHeaderProps {
  onOpenAddProduct: () => void;
  onOpenStockAdjust: () => void;
}

export function AdminHeader({ onOpenAddProduct, onOpenStockAdjust }: AdminHeaderProps) {
  const { setAdminView, setMode, adminUser, logoutAdmin, currentRole } = useApp();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-[#0b0e12]/90 backdrop-blur-md border-b border-[#4d4639]/30 z-40 px-6 flex items-center justify-between gap-6">
      
      {/* Search Bar with ⌘K Badge */}
      <div className="flex-1 max-w-xl">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#999080] absolute left-3.5" />
          <input
            type="text"
            placeholder="Search perfumes, SKU, notes, brands, suppliers..."
            className="w-full h-10 pl-10 pr-14 bg-[#191c20] border border-[#4d4639]/40 text-[#e1e2e8] placeholder:text-[#999080] text-xs font-mono-data focus:outline-none focus:border-[#e5c378]"
          />
          <span className="absolute right-3 px-1.5 py-0.5 border border-[#4d4639] font-mono-data text-[10px] text-[#999080]">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right Command Controls */}
      <div className="flex items-center gap-4">
        
        {/* Vault & Boutique Plinth */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-[#191c20] border border-[#4d4639]/40 text-xs font-mono-data">
          <Store className="w-4 h-4 text-[#ffe09d]" />
          <span className="text-[#e1e2e8]">Main Vault & Boutique</span>
          <span className="text-[#999080]">-</span>
          <span className="text-[#e9c176] uppercase font-bold text-[10px]">London / Dubai / Lahore</span>
        </div>

        {/* Action "+ Add" Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="flex items-center gap-1.5 px-3.5 h-10 bg-[#e5c378] text-[#3f2e00] hover:bg-[#ffe09d] text-xs font-syne uppercase font-bold tracking-wider transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {showAddMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[#1d2024] border border-[#4d4639] shadow-2xl py-1 text-xs font-mono-data z-50 animate-fadeIn">
              <button
                onClick={() => {
                  setShowAddMenu(false);
                  onOpenAddProduct();
                }}
                className="w-full px-4 py-2 text-left text-[#e1e2e8] hover:bg-[#272a2e] flex items-center gap-2"
              >
                <FlaskConical className="w-4 h-4 text-[#ffe09d]" />
                <span>+ Add New Fragrance Spec</span>
              </button>
              <button
                onClick={() => {
                  setShowAddMenu(false);
                  onOpenStockAdjust();
                }}
                className="w-full px-4 py-2 text-left text-[#e1e2e8] hover:bg-[#272a2e] flex items-center gap-2"
              >
                <Sliders className="w-4 h-4 text-[#e9c176]" />
                <span>Record Stock Adjustment</span>
              </button>
              <button
                onClick={() => {
                  setShowAddMenu(false);
                  setAdminView('sales-pos');
                }}
                className="w-full px-4 py-2 text-left text-[#e1e2e8] hover:bg-[#272a2e] flex items-center gap-2"
              >
                <Receipt className="w-4 h-4 text-[#2EE59D]" />
                <span>New Sale (POS Terminal)</span>
              </button>
              <button
                onClick={() => {
                  setShowAddMenu(false);
                  setAdminView('purchases-orders');
                }}
                className="w-full px-4 py-2 text-left text-[#e1e2e8] hover:bg-[#272a2e] flex items-center gap-2"
              >
                <Boxes className="w-4 h-4 text-[#dee3ee]" />
                <span>Create Supplier PO (Grasse)</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-[#d0c5b4] hover:text-white transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#93000a] text-[#ffdad6] text-[9px] font-mono-data flex items-center justify-center font-bold">
              5
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#1d2024] border border-[#4d4639] shadow-2xl p-4 text-xs font-mono-data space-y-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-[#4d4639]/40 font-bold text-[#ffe09d]">
                <span>Vault Critical Alerts (5)</span>
                <span className="text-[10px] text-[#999080]">Live feed</span>
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="p-2 bg-[#93000a]/20 border border-[#93000a]/40 text-[#ffdad6]">
                  <strong>Out of Stock:</strong> Amber Noir Pure Dehn Al Oud depleted (0 btls).
                </div>
                <div className="p-2 bg-[#604403]/30 border border-[#604403] text-[#ffe09d]">
                  <strong>Low Stock Warning:</strong> Velvet Rose 50ml below minimum threshold (18 btls).
                </div>
                <div className="p-2 bg-[#191c20] text-[#e1e2e8]">
                  <strong>Bank Transfer Receipt:</strong> Order #ORD-1022 verified Meezan proof.
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-[#4d4639]/40"></div>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 pl-1">
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold text-[#e1e2e8] leading-tight">
              {adminUser?.name || 'Tayyaba'}
            </span>
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              <span className="px-1.5 py-0.2 bg-[#604403] text-[#dab36a] text-[9px] uppercase font-mono-data font-bold tracking-wider">
                {currentRole}
              </span>
              <span className="text-[10px] text-[#999080] font-mono-data max-w-[140px] truncate">
                {adminUser?.email || 'tk304105@gmail.com'}
              </span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-none bg-[#ffe09d] text-[#251a00] flex items-center justify-center font-bold font-syne text-xs border border-[#e5c378]">
            {(adminUser?.name || 'Tayyaba').substring(0, 2).toUpperCase()}
          </div>
          <button
            onClick={() => {
              logoutAdmin();
              setMode('storefront');
            }}
            className="p-1.5 text-[#999080] hover:text-[#ffdad6] transition-colors"
            title="Sign Out of Admin IMS"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Direct Link to Storefront */}
        <button
          onClick={() => setMode('storefront')}
          className="ml-2 px-3 py-1.5 bg-[#191c20] hover:bg-[#272a2e] border border-[#4d4639]/50 text-xs font-syne text-[#e9c176] uppercase tracking-wider flex items-center gap-1.5 transition-colors"
        >
          <span>Storefront</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}
