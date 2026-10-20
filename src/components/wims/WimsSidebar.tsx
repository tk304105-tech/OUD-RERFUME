import React from 'react';
import { 
  LayoutDashboard, 
  Boxes, 
  ArrowRightLeft, 
  AlertTriangle, 
  History, 
  FileSpreadsheet, 
  Users, 
  Settings, 
  ShieldCheck,
  PackagePlus,
  Truck
} from 'lucide-react';
import { WimsUser } from '../../services/supabase';

export type WimsPage = 
  | 'dashboard' 
  | 'products' 
  | 'product-detail' 
  | 'movements' 
  | 'alerts' 
  | 'history' 
  | 'reports';

interface WimsSidebarProps {
  currentPage: WimsPage;
  onSelectPage: (page: WimsPage) => void;
  currentUser: WimsUser | null;
  lowStockCount: number;
  isOpen: boolean;
  onClose: () => void;
}

export function WimsSidebar({
  currentPage,
  onSelectPage,
  currentUser,
  lowStockCount,
  isOpen,
  onClose
}: WimsSidebarProps) {
  const isAdmin = currentUser?.role === 'ADMIN';

  const navItems = [
    {
      id: 'dashboard' as WimsPage,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      adminOnly: false
    },
    {
      id: 'products' as WimsPage,
      label: 'Products & Inventory',
      icon: Boxes,
      badge: null,
      adminOnly: false
    },
    {
      id: 'movements' as WimsPage,
      label: 'Stock Operations',
      icon: ArrowRightLeft,
      badge: 'In/Out',
      badgeColor: 'bg-[#1b2b3b] text-[#70b5f9]',
      adminOnly: false
    },
    {
      id: 'alerts' as WimsPage,
      label: 'Low Stock Alerts',
      icon: AlertTriangle,
      badge: lowStockCount > 0 ? `${lowStockCount}` : null,
      badgeColor: 'bg-[#93000a] text-[#ffdad6] font-bold',
      adminOnly: false
    },
    {
      id: 'history' as WimsPage,
      label: 'Movements Audit Log',
      icon: History,
      badge: null,
      adminOnly: false
    },
    {
      id: 'reports' as WimsPage,
      label: 'Reports & Valuation',
      icon: FileSpreadsheet,
      badge: null,
      adminOnly: false
    }
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      <aside className={`fixed md:relative inset-y-0 left-0 z-50 w-64 bg-[#FFFFFF] border-r border-[#E8E0D4] flex flex-col justify-between select-none transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-4 space-y-6">
          {/* Navigation Category Label */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-syne text-[#6B6B6B] uppercase tracking-widest font-bold">
              Warehouse Operations
            </div>

            <nav className="space-y-1">
              {navItems
                .filter(item => !item.adminOnly || isAdmin)
                .map(item => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id || (item.id === 'products' && currentPage === 'product-detail');

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectPage(item.id);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-mono-data transition-all text-left ${
                        isActive
                          ? 'bg-[#111111] text-[#FFE09D] font-bold shadow-sm'
                          : 'text-[#6B6B6B] hover:bg-[#F8F5EF] hover:text-[#111111]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#FFE09D]' : 'text-[#8A6D2F]'}`} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${isActive ? 'bg-[#111111] text-[#ffe09d]' : item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
            </nav>
          </div>
        </div>

        {/* Bottom Clearance Info */}
        <div className="p-4 border-t border-[#E8E0D4] bg-[#F8F5EF]">
          <div className="flex items-center gap-2 text-xs font-mono-data text-[#6B6B6B]">
            <ShieldCheck className="w-4 h-4 text-[#8A6D2F]" />
            <span>Role: <strong className={isAdmin ? 'text-[#8A6D2F]' : 'text-[#1D4ED8]'}>{currentUser?.role}</strong></span>
          </div>
          <div className="text-[10px] font-mono-data text-[#6B6B6B] mt-1">
            {isAdmin ? 'Full Vault Clearance & Rules' : 'Standard Inbound/Outbound Operator'}
          </div>
        </div>
      </aside>
    </>
  );
}
