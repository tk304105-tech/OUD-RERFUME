import React, { useState } from 'react';
import { 
  Boxes, 
  Search, 
  Bell, 
  UserCheck, 
  ShieldCheck, 
  LogOut, 
  Database, 
  Store, 
  AlertTriangle, 
  X,
  CheckCircle2,
  Sliders,
  ChevronDown,
  Layers
} from 'lucide-react';
import { wimsDb, WimsUser, WimsNotification } from '../../services/supabase';

interface WimsNavbarProps {
  currentUser: WimsUser | null;
  onLogout: () => void;
  onSwitchUser: (user: WimsUser) => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onSwitchToStorefront: () => void;
  onSwitchToAdminPortal?: () => void;
  unreadCount: number;
  onToggleSidebar: () => void;
}

export function WimsNavbar({
  currentUser,
  onLogout,
  onSwitchUser,
  onOpenSearch,
  onOpenNotifications,
  onSwitchToStorefront,
  onSwitchToAdminPortal,
  unreadCount,
  onToggleSidebar
}: WimsNavbarProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const isRemote = wimsDb.isUsingRemoteSupabase();
  const allUsers = wimsDb.getUsers();

  return (
    <header className="h-16 bg-[#FFFFFF] border-b border-[#E8E0D4] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 text-[#111111] shadow-sm">
      {/* Brand & System Title */}
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="p-1 md:hidden">
          <Layers className="w-5 h-5 text-[#111111]" />
        </button>
        <div className="w-9 h-9 bg-gradient-to-br from-[#ffe09d] to-[#8A6D2F] flex items-center justify-center text-[#111111] font-bold rounded shadow-md">
          <Boxes className="w-5 h-5 text-[#111111]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-syne text-base font-bold uppercase tracking-wider text-[#ffe09d]">
              Warehouse IMS
            </span>
            <span className="px-1.5 py-0.5 text-[9px] font-mono-data uppercase bg-[#1d2229] border border-[#ffe09d]/30 text-[#ffe09d] rounded">
              v3.2
            </span>
          </div>
          <span className="text-[10px] text-[#999080] font-mono-data hidden sm:inline">
            Bonded Inventory Management System & Ledger
          </span>
        </div>
      </div>



      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Icon */}
        <button
          onClick={onOpenSearch}
          className="p-2 text-[#999080] hover:text-[#ffe09d] md:hidden"
          title="Search Inventory"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Database Sync Status Badge */}
        <div 
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-[#161a20] border border-[#32363e] rounded text-[11px] font-mono-data"
          title={isRemote ? 'Connected to live Supabase Postgres' : 'Running on High-Performance Local Postgres-compatible Engine'}
        >
          <span className={`w-2 h-2 rounded-full ${isRemote ? 'bg-[#2EE59D] animate-pulse' : 'bg-[#e5c378]'}`} />
          <span className="text-[#999080]">DB:</span>
          <span className={isRemote ? 'text-[#2EE59D] font-bold' : 'text-[#e5c378] font-bold'}>
            {isRemote ? 'Supabase Live' : 'Postgres Engine'}
          </span>
        </div>

        {/* Notifications Trigger */}
        <button
          onClick={onOpenNotifications}
          className="p-2 text-[#999080] hover:text-[#ffe09d] relative transition-colors"
          title="View Inventory & Low Stock Alerts"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#E5484D] text-white text-[9px] font-bold flex items-center justify-center rounded-full">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Switch to Storefront Button */}
        <button
          onClick={onSwitchToStorefront}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#161a20] hover:bg-[#20252e] border border-[#32363e] text-[#999080] hover:text-[#ffe09d] text-xs font-mono-data rounded transition-colors"
          title="View Customer Facing Storefront"
        >
          <Store className="w-3.5 h-3.5 text-[#ffe09d]" />
          <span>Storefront</span>
        </button>

        {/* Direct Sign Out Button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#240F11] hover:bg-[#3d181b] border border-[#E5484D]/40 text-[#ffdad6] text-xs font-mono-data rounded transition-colors"
          title="Sign Out of Admin Session"
        >
          <LogOut className="w-3.5 h-3.5 text-[#E5484D]" />
          <span>Sign Out</span>
        </button>

        {/* User Account / Role Menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1.5 bg-[#161a20] hover:bg-[#20252e] border border-[#32363e] rounded text-left transition-colors"
          >
            <div className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold ${
              currentUser?.role === 'ADMIN' ? 'bg-[#3b2a0c] text-[#ffe09d] border border-[#ffe09d]/40' : 'bg-[#1b2b3b] text-[#70b5f9] border border-[#70b5f9]/40'
            }`}>
              {currentUser?.role === 'ADMIN' ? 'A' : 'S'}
            </div>
            <div className="hidden sm:block pr-1 leading-tight">
              <div className="text-xs font-medium text-[#e1e2e8] truncate max-w-[120px]">
                {currentUser?.full_name || 'Staff User'}
              </div>
              <div className="text-[10px] font-mono-data text-[#999080] uppercase">
                {currentUser?.role === 'ADMIN' ? 'Super Admin' : 'Staff Operator'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#999080]" />
          </button>

          {/* User Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#111418] border border-[#4d4639] rounded shadow-2xl p-2 z-50 text-xs font-mono-data animate-fadeIn">
              <div className="p-2 border-b border-[#32363e] mb-1">
                <div className="font-bold text-[#e1e2e8]">{currentUser?.full_name}</div>
                <div className="text-[11px] text-[#999080]">{currentUser?.email}</div>
                <div className="mt-1 inline-block px-1.5 py-0.5 bg-[#1e231a] text-[#4ade80] text-[9px] font-bold rounded uppercase">
                  {currentUser?.role} Clearance Level
                </div>
              </div>

              <div className="text-[10px] text-[#999080] uppercase px-2 py-1 font-bold">
                Switch Test Account
              </div>

              <div className="space-y-1 mb-2">
                {allUsers.map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSwitchUser(u);
                      setIsUserMenuOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between text-xs transition-colors ${
                      currentUser?.id === u.id 
                        ? 'bg-[#1d2229] text-[#ffe09d] font-bold' 
                        : 'text-[#999080] hover:text-[#e1e2e8] hover:bg-[#161a20]'
                    }`}
                  >
                    <div>
                      <div>{u.full_name}</div>
                      <div className="text-[10px] opacity-70">{u.role} · {u.email}</div>
                    </div>
                    {currentUser?.id === u.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#ffe09d]" />}
                  </button>
                ))}
              </div>

              <div className="border-t border-[#32363e] pt-1">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-2 py-1.5 text-xs text-[#E5484D] hover:bg-[#240F11] rounded flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
