import React from 'react';
import { useApp, AdminView } from '../../context/AppContext';
import { 
  LayoutGrid, 
  BarChart3, 
  Boxes, 
  FlaskConical, 
  Sliders, 
  Receipt, 
  ShoppingBag, 
  Truck, 
  Users, 
  CreditCard, 
  FileText, 
  TrendingUp, 
  Bell, 
  ShieldAlert, 
  Settings, 
  ArrowLeft,
  Sparkles,
  ExternalLink,
  LogOut
} from 'lucide-react';

export function AdminSidebar() {
  const { adminView, setAdminView, setMode, currentRole, permissions, adminUser, logoutAdmin } = useApp();

  const navSections = [
    {
      title: 'Core',
      items: [
        { id: 'dashboard' as AdminView, label: 'Dashboard', icon: LayoutGrid, allowed: permissions.canViewDashboard },
        { id: 'inventory-overview' as AdminView, label: 'Inventory Overview', icon: BarChart3, badge: '24 Alert', badgeColor: 'bg-[#604403] text-[#e9c176] border border-[#e9c176]/30', allowed: permissions.canManageInventory },
        { id: 'inventory-list' as AdminView, label: 'Inventory List', icon: Boxes, badge: '24 Low Stock', badgeColor: 'bg-[#93000a] text-[#ffdad6]', allowed: permissions.canManageInventory },
        { id: 'fragrance-profiles' as AdminView, label: 'Products & Lab', icon: FlaskConical, allowed: permissions.canManageProducts }
      ]
    },
    {
      title: 'Operations',
      items: [
        { id: 'fragrance-profiles' as AdminView, label: 'Fragrance Profiles', icon: FlaskConical, badge: 'Formula Lab', badgeColor: 'bg-[#323539] text-[#dee3ee]', allowed: permissions.canManageProducts },
        { id: 'stock-management-adjustments' as AdminView, label: 'Stock Adjustments', icon: Sliders, allowed: permissions.canManageInventory },
        { id: 'sales-pos' as AdminView, label: 'Sales & POS', icon: Receipt, allowed: permissions.canManageOrders },
        { id: 'purchases-orders' as AdminView, label: 'Purchases & Orders', icon: ShoppingBag, allowed: permissions.canManageOrders }
      ]
    },
    {
      title: 'Relations',
      items: [
        { id: 'suppliers' as AdminView, label: 'Suppliers (Grasse)', icon: Truck, allowed: permissions.canManageProducts },
        { id: 'customers' as AdminView, label: 'Customers', icon: Users, allowed: permissions.canManageCustomers },
        { id: 'expenses' as AdminView, label: 'Expenses & Margins', icon: CreditCard, allowed: permissions.canViewDashboard }
      ]
    },
    {
      title: 'Intelligence',
      items: [
        { id: 'reports' as AdminView, label: 'Reports', icon: FileText, allowed: permissions.canViewDashboard },
        { id: 'analytics' as AdminView, label: 'Analytics', icon: TrendingUp, allowed: permissions.canViewDashboard },
        { id: 'notifications' as AdminView, label: 'Notifications', icon: Bell, badge: '5', badgeColor: 'bg-[#e5c378] text-[#3f2e00] font-bold', allowed: true }
      ]
    }
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-[#0b0e12] z-50 flex flex-col justify-between border-r border-[#4d4639]/40 select-none">
      
      {/* Top Brand Monolith Header */}
      <div className="flex flex-col h-full overflow-hidden">
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#4d4639]/30 bg-[#0b0e12]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1d2024] border border-[#e5c378]/40 flex items-center justify-center text-[#ffe09d]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-syne text-base font-bold tracking-wider text-[#ffe09d] uppercase leading-none">
                Aura Oud
              </span>
              <span className="font-mono-data text-[10px] uppercase text-[#999080] tracking-widest mt-1">
                Parfums IMS · Vault
              </span>
            </div>
          </div>

          {/* Quick Exit to Public Storefront */}
          <button
            onClick={() => setMode('storefront')}
            className="p-1.5 text-[#999080] hover:text-[#ffe09d] transition-colors"
            title="Switch to Customer Storefront"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Nav Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {navSections.map((section, sIdx) => {
            const visibleItems = section.items.filter(i => i.allowed !== false);
            if (visibleItems.length === 0) return null;

            return (
              <div key={sIdx} className="space-y-1">
                <div className="px-2 py-1 font-mono-data text-[10px] text-[#999080] uppercase tracking-widest flex items-center justify-between">
                  <span>{section.title}</span>
                  <span className="h-px flex-1 bg-[#4d4639]/20 ml-2"></span>
                </div>

                <nav className="space-y-0.5">
                  {visibleItems.map(item => {
                    const Icon = item.icon;
                    const isActive = adminView === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setAdminView(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono-data transition-all text-left ${
                          isActive 
                            ? 'bg-[#272a2e] text-[#ffe09d] font-semibold border-l-2 border-[#ffe09d]' 
                            : 'text-[#d0c5b4] hover:bg-[#1d2024] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-[#ffe09d]' : 'text-[#999080]'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`px-1.5 py-0.5 text-[9px] font-mono-data uppercase ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            );
          })}
        </div>

        {/* Bottom Vault Telemetry Plinth */}
        <div className="p-4 border-t border-[#4d4639]/30 bg-[#191c20]/50">
          <div className="flex items-center justify-between text-xs font-mono-data">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-none bg-[#2EE59D] animate-pulse"></div>
              <span className="text-[#d0c5b4] text-[11px]">VAULT STATUS: ACTIVE</span>
            </div>
            <span className="text-[#999080] text-[10px]">v4.8.2</span>
          </div>

          <div className="mt-3 pt-3 border-t border-[#4d4639]/20 flex items-center justify-between text-[10px] font-mono-data text-[#999080]">
            <div>
              <span className="text-[#ffe09d] font-bold block">{adminUser?.name || 'Tayyaba'}</span>
              <span>{currentRole}</span>
            </div>
            <button 
              onClick={() => {
                logoutAdmin();
                setMode('storefront');
              }}
              className="text-[#ffdad6] hover:underline uppercase flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              <span>Exit IMS</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
