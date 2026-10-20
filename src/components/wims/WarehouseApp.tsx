import React, { useState, useEffect } from 'react';
import { wimsDb, WimsProduct, WimsStockMovement, WimsNotification, WimsUser } from '../../services/supabase';
import { WimsNavbar } from './WimsNavbar';
import { WimsSidebar, WimsPage } from './WimsSidebar';
import { WimsDashboard } from './WimsDashboard';
import { WimsProductList } from './WimsProductList';
import { WimsProductDetail } from './WimsProductDetail';
import { WimsStockMovements } from './WimsStockMovements';
import { WimsAlerts } from './WimsAlerts';
import { WimsReports } from './WimsReports';
import { WimsStaffManagement } from './WimsStaffManagement';
import { WimsSettings } from './WimsSettings';
import { WimsAddEditModal } from './WimsAddEditModal';
import { WimsGlobalSearch } from './WimsGlobalSearch';
import { WimsNotificationsModal } from './WimsNotificationsModal';
import { WimsAuthModal } from './WimsAuthModal';
import { ConfirmModal } from '../common/ConfirmModal';

interface WarehouseAppProps {
  onSwitchToStorefront: () => void;
  onSwitchToAdminPortal?: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export function WarehouseApp({ onSwitchToStorefront, onSwitchToAdminPortal, showToast }: WarehouseAppProps) {
  // Active User session
  const [currentUser, setCurrentUser] = useState<WimsUser>(() => {
    return wimsDb.getActiveUser() || {
      id: 'u-admin-02',
      email: 'tk304105@gmail.com',
      full_name: 'Tayyaba Khan',
      role: 'ADMIN',
      status: 'ACTIVE',
      created_at: '2026-01-10T08:00:00Z'
    };
  });

  // Active page
  const [currentPage, setCurrentPage] = useState<WimsPage>('dashboard');

  // Database Data States
  const [products, setProducts] = useState<WimsProduct[]>(wimsDb.getProducts());
  const [movements, setMovements] = useState<WimsStockMovement[]>(wimsDb.getStockMovements());
  const [notifications, setNotifications] = useState<WimsNotification[]>(wimsDb.getNotifications());

  // Selected product for inspection or edit
  const [selectedProduct, setSelectedProduct] = useState<WimsProduct | null>(products[0] || null);
  const [productToEdit, setProductToEdit] = useState<WimsProduct | null>(null);

  // Modals
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const refreshAllData = () => {
    setProducts(wimsDb.getProducts());
    setMovements(wimsDb.getStockMovements());
    setNotifications(wimsDb.getNotifications());
    if (selectedProduct) {
      const refreshed = wimsDb.getProductById(selectedProduct.id);
      if (refreshed) setSelectedProduct(refreshed);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const handleLogout = () => {
    wimsDb.logout();
    showToast('Signed out of warehouse session.', 'info');
    onSwitchToStorefront();
  };

  const handleSwitchUser = (user: WimsUser) => {
    wimsDb.setActiveUser(user);
    setCurrentUser(user);
    showToast(`Switched active profile to ${user.full_name} (${user.role}).`, 'success');
  };

  const [productToDelete, setProductToDelete] = useState<WimsProduct | null>(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);

  const handleSoftDeleteProduct = (p: WimsProduct) => {
    if (currentUser?.role !== 'ADMIN') {
      showToast('Action denied: Only Super Administrators can delete products.', 'error');
      return;
    }
    setProductToDelete(p);
  };

  const handleConfirmDeleteProduct = () => {
    if (!productToDelete) return;
    setIsDeletingProduct(true);
    try {
      wimsDb.deleteProduct(productToDelete.id);
      refreshAllData();
      showToast(`Product "${productToDelete.name}" (${productToDelete.sku}) has been soft-deleted (archived).`, 'info');
      if (selectedProduct?.id === productToDelete.id) {
        setCurrentPage('products');
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to archive product', 'error');
    } finally {
      setIsDeletingProduct(false);
      setProductToDelete(null);
    }
  };

  const handleInspectProduct = (p: WimsProduct) => {
    setSelectedProduct(p);
    setCurrentPage('product-detail');
  };

  const unreadAlertsCount = notifications.filter(n => !n.is_read).length;
  const lowStockAlertsCount = products.filter(p => !p.archived && (p.status === 'LOW STOCK' || p.status === 'OUT OF STOCK')).length;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F8F5EF] flex flex-col font-sans selection:bg-[#C8A96B] selection:text-[#111111]">
      
      {/* Top Navbar */}
      <WimsNavbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onSwitchToStorefront={onSwitchToStorefront}
        onSwitchToAdminPortal={onSwitchToAdminPortal}
        unreadCount={unreadAlertsCount}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Responsive Sidebar */}
        <WimsSidebar
          currentPage={currentPage}
          onSelectPage={(p) => { setCurrentPage(p); }}
          currentUser={currentUser}
          lowStockCount={lowStockAlertsCount}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#F8F5EF] min-h-[calc(100vh-4rem)]">
          {currentPage === 'dashboard' && (
            <WimsDashboard
              products={products}
              movements={movements}
              onOpenAddProduct={() => {
                setProductToEdit(null);
                setIsAddProductOpen(true);
              }}
              onOpenInbound={() => {
                setCurrentPage('movements');
              }}
              onOpenOutbound={() => {
                setCurrentPage('movements');
              }}
              onNavigateToAlerts={() => setCurrentPage('alerts')}
              onNavigateToReports={() => setCurrentPage('reports')}
              onNavigateToHistory={() => setCurrentPage('movements')}
              onSelectProduct={handleInspectProduct}
            />
          )}

          {currentPage === 'products' && (
            <WimsProductList
              products={products}
              currentUser={currentUser}
              onSelectProduct={handleInspectProduct}
              onEditProduct={(p) => {
                setProductToEdit(p);
                setIsAddProductOpen(true);
              }}
              onDeleteProduct={handleSoftDeleteProduct}
              onOpenAddProduct={() => {
                setProductToEdit(null);
                setIsAddProductOpen(true);
              }}
              onOpenInbound={(p) => {
                if (p) setSelectedProduct(p);
                setCurrentPage('movements');
              }}
              onOpenOutbound={(p) => {
                if (p) setSelectedProduct(p);
                setCurrentPage('movements');
              }}
            />
          )}

          {currentPage === 'product-detail' && selectedProduct && (
            <WimsProductDetail
              product={selectedProduct}
              movements={movements}
              currentUser={currentUser}
              onBack={() => setCurrentPage('products')}
              onEdit={(p) => {
                setProductToEdit(p);
                setIsAddProductOpen(true);
              }}
              onDelete={handleSoftDeleteProduct}
              onOpenInbound={() => setCurrentPage('movements')}
              onOpenOutbound={() => setCurrentPage('movements')}
              onOpenAdjust={() => setCurrentPage('movements')}
            />
          )}

          {(currentPage === 'movements' || currentPage === 'history') && (
            <WimsStockMovements
              products={products}
              movements={movements}
              currentUser={currentUser}
              onRefreshData={refreshAllData}
              showToast={showToast}
            />
          )}

          {currentPage === 'alerts' && (
            <WimsAlerts
              products={products}
              currentUser={currentUser}
              onOpenInbound={(p) => {
                setSelectedProduct(p);
                setCurrentPage('movements');
              }}
              onEditThreshold={(p) => {
                setProductToEdit(p);
                setIsAddProductOpen(true);
              }}
              onSelectProduct={handleInspectProduct}
            />
          )}

          {currentPage === 'reports' && (
            <WimsReports
              products={products}
              movements={movements}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Add / Edit Product Modal */}
      <WimsAddEditModal
        isOpen={isAddProductOpen}
        onClose={() => {
          setIsAddProductOpen(false);
          setProductToEdit(null);
        }}
        productToEdit={productToEdit}
        onSuccess={() => {
          refreshAllData();
        }}
        showToast={showToast}
      />

      {/* Global Search Modal */}
      <WimsGlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={handleInspectProduct}
      />

      {/* Notifications Drawer Modal */}
      <WimsNotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onRefreshNotifs={refreshAllData}
        onSelectProductById={(prodId) => {
          const target = products.find(p => p.id === prodId);
          if (target) handleInspectProduct(target);
        }}
        showToast={showToast}
      />


      {/* Product Deletion / Soft-delete Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(productToDelete)}
        title="Soft-Delete (Archive) Product"
        message={`Are you sure you want to soft-delete / archive "${productToDelete?.name}" (${productToDelete?.sku})? This product will be marked as archived and removed from active picking & dispatch ledgers.`}
        confirmLabel="Archive Product"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={isDeletingProduct}
        onConfirm={handleConfirmDeleteProduct}
        onCancel={() => setProductToDelete(null)}
      />
    </div>
  );
}
