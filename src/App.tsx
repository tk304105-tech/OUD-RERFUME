import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/storefront/Header';
import { Footer } from './components/storefront/Footer';
import { Hero } from './components/storefront/Hero';
import { PerfumeFinder } from './components/storefront/PerfumeFinder';
import { ProductCard } from './components/storefront/ProductCard';
import { ShopView } from './components/storefront/ShopView';
import { ProductDetailView } from './components/storefront/ProductDetailView';
import { CartDrawer } from './components/storefront/CartDrawer';
import { CheckoutView } from './components/storefront/CheckoutView';
import { OrderSuccessView } from './components/storefront/OrderSuccessView';
import { OrderTrackingView } from './components/storefront/OrderTrackingView';
import { WishlistView } from './components/storefront/WishlistView';
import { AccountView } from './components/storefront/AccountView';
import { AboutPage, ContactPage, FAQPage } from './components/storefront/ContentPages';
import { SearchModal } from './components/storefront/SearchModal';
import { AuthModal } from './components/storefront/AuthModal';

// Admin Components
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminHeader } from './components/admin/AdminHeader';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminPOS } from './components/admin/AdminPOS';
import { AdminInventoryList } from './components/admin/AdminInventoryList';
import { AdminFragranceDetail } from './components/admin/AdminFragranceDetail';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminSuppliers } from './components/admin/AdminSuppliers';
import { AdminCustomers } from './components/admin/AdminCustomers';
import { AdminReports } from './components/admin/AdminReports';
import { AdminExpenses } from './components/admin/AdminExpenses';
import { AdminNotifications } from './components/admin/AdminNotifications';
import { AdminAnalytics } from './components/admin/AdminAnalytics';
import { AddEditProductModal, StockAdjustModal, RoleTesterModal } from './components/admin/AdminModals';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { WarehouseApp } from './components/wims/WarehouseApp';
import { Product } from './types';

import { 
  ArrowRight, 
  Sparkles, 
  Compass, 
  ChevronRight, 
  Package, 
  SlidersHorizontal, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  X,
  Store,
  LayoutDashboard
} from 'lucide-react';

function AppContent() {
  const { 
    mode, 
    setMode, 
    storefrontView, 
    setStorefrontView, 
    adminView, 
    setAdminView, 
    products, 
    setSelectedProduct, 
    selectedProduct,
    toasts,
    removeToast,
    showToast,
    adminUser,
    isAdminLoginModalOpen,
    setIsAdminLoginModalOpen
  } = useApp();

  // Admin Modals
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isStockAdjustOpen, setIsStockAdjustOpen] = useState(false);
  const [inspectProduct, setInspectProduct] = useState<Product | null>(null);

  const availableProducts = products.filter(p => {
    if (p.status !== 'Published') return false;
    const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
    return totalStock > 0;
  });

  const bestSellers = availableProducts.filter(p => p.badge === 'Best Seller' || p.badge === 'Atelier Flagship');
  const signatureCollection = availableProducts.slice(0, 6);

  const handleOpenFinder = () => {
    setStorefrontView('home');
    const el = document.getElementById('perfume-finder');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#C8A96B] selection:text-[#111111]">
      
      {/* ================= STOREFRONT MODE ================= */}
      {mode === 'storefront' || !adminUser ? (
        <div className="flex-1 flex flex-col bg-[#F8F5EF]">
          <Header />

          <main className="flex-1">
            {storefrontView === 'home' && (
              <>
                <Hero onOpenFinder={handleOpenFinder} />

                {/* Category Showcase Plinths */}
                <section className="py-16 bg-[#FFFFFF] border-b border-[#E8E0D4]">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-xl mx-auto mb-10">
                      <span className="text-xs font-syne uppercase tracking-widest text-[#8A6D2F] font-bold">
                        Curated Formulations
                      </span>
                      <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#111111] mt-1">
                        Explore by Category
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {[
                        { title: 'Men’s Scents', img: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=400&q=80', filter: 'Men' },
                        { title: 'Women’s Florals', img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=400&q=80', filter: 'Women' },
                        { title: 'Unisex Extraits', img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=400&q=80', filter: 'Unisex' },
                        { title: 'Pure Attar Oils', img: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=400&q=80', category: 'Attars' },
                        { title: 'Discovery Sets', img: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=400&q=80', category: 'Discovery' },
                        { title: 'Atelier Flagships', img: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=400&q=80', line: 'Heritage Oud' }
                      ].map((cat, idx) => (
                        <div
                          key={idx}
                          onClick={() => setStorefrontView('shop')}
                          className="group relative aspect-[4/5] overflow-hidden bg-[#111111] cursor-pointer border border-[#E8E0D4] hover:border-[#C8A96B] transition-all"
                        >
                          <img
                            src={cat.img}
                            alt={cat.title}
                            className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/30 to-transparent flex items-end p-3">
                            <span className="font-serif-luxury text-sm font-bold text-white group-hover:text-[#FFE09D] transition-colors leading-tight">
                              {cat.title}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Best Sellers Carousel Section */}
                <section className="py-20 bg-[#F8F5EF] border-b border-[#E8E0D4]">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[#E8E0D4] gap-4 mb-10">
                      <div>
                        <span className="text-xs font-syne uppercase tracking-widest text-[#8A6D2F] font-bold">
                          Patron Favorites across Pakistan
                        </span>
                        <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#111111] mt-1">
                          The Connoisseur Best Sellers
                        </h2>
                      </div>
                      <button
                        onClick={() => setStorefrontView('shop')}
                        className="text-xs font-syne uppercase font-bold tracking-widest text-[#8A6D2F] hover:text-[#111111] flex items-center gap-1.5"
                      >
                        <span>View All Flacons</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {bestSellers.slice(0, 4).map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                </section>

                {/* Interactive 4-Step Perfume Finder */}
                <PerfumeFinder />

                {/* Signature Collection Grid */}
                <section className="py-20 bg-[#FFFFFF] border-b border-[#E8E0D4]">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-xl mx-auto mb-12">
                      <span className="text-xs font-syne uppercase tracking-widest text-[#8A6D2F] font-bold">
                        Pure Distillations
                      </span>
                      <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#111111] mt-1">
                        The Signature Collection
                      </h2>
                      <p className="text-xs text-[#6B6B6B] mt-2 font-serif-luxury">
                        Engineered with unhurried maceration in temperature-calibrated bonded vaults.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {signatureCollection.map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>

                    <div className="mt-12 text-center">
                      <button
                        onClick={() => setStorefrontView('shop')}
                        className="px-8 py-3.5 bg-[#111111] text-[#FFE09D] hover:bg-[#8A6D2F] text-xs uppercase font-syne font-bold tracking-widest transition-all shadow-md inline-flex items-center gap-2"
                      >
                        <span>Browse Entire Catalog ({products.length} Flacons)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </section>

                {/* Discovery Set Banner */}
                <section className="py-16 bg-[#111111] text-[#E8E0D4] border-b border-[#333333]">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-10">
                    <div className="space-y-4 max-w-xl">
                      <div className="inline-flex items-center gap-2 text-xs font-syne uppercase tracking-widest text-[#C8A96B] font-bold">
                        <Package className="w-4 h-4" />
                        <span>The Olfactive Anthology</span>
                      </div>
                      <h3 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white leading-tight">
                        Experience 5 Iconic Specimens in Our Handcrafted Discovery Set
                      </h3>
                      <p className="text-xs text-[#999080] leading-relaxed">
                        Includes 10ml travel flacons of Oud Royale Extrait, Velvet Rose EDP, Citrus Riviera, Imperial Santal, and Vanilla Bourbon. Includes PKR 4,000 voucher towards your first 100ml flacon.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const dsc = products.find(p => p.category === 'Discovery');
                        if (dsc) {
                          setSelectedProduct(dsc);
                          setStorefrontView('product-detail');
                        } else {
                          setStorefrontView('shop');
                        }
                      }}
                      className="px-8 py-4 bg-[#C8A96B] text-[#111111] hover:bg-[#ffe09d] text-xs font-syne font-bold uppercase tracking-widest whitespace-nowrap shadow-xl"
                    >
                      Acquire Discovery Set · PKR 4,950
                    </button>
                  </div>
                </section>
              </>
            )}

            {storefrontView === 'shop' && <ShopView />}
            {storefrontView === 'product-detail' && <ProductDetailView />}
            {storefrontView === 'checkout' && <CheckoutView />}
            {storefrontView === 'order-success' && <OrderSuccessView />}
            {storefrontView === 'order-tracking' && <OrderTrackingView />}
            {storefrontView === 'wishlist' && <WishlistView />}
            {storefrontView === 'account' && <AccountView />}
            {storefrontView === 'about' && <AboutPage />}
            {storefrontView === 'contact' && <ContactPage />}
            {storefrontView === 'faq' && <FAQPage />}
          </main>

          <CartDrawer />
          <SearchModal />
          <AuthModal />
          <AdminLoginModal />
          <Footer />
        </div>
      ) : (
        /* ================= WAREHOUSE INVENTORY MANAGEMENT SYSTEM (WIMS) ================= */
        <WarehouseApp 
          onSwitchToStorefront={() => setMode('storefront')}
          showToast={showToast}
        />
      )}

      {/* Floating Notification Toasts */}
      <div className="fixed bottom-6 right-4 z-50 space-y-2 max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`p-3.5 border shadow-2xl flex items-start gap-2.5 text-xs font-mono-data pointer-events-auto transition-all ${
              toast.type === 'success' 
                ? 'bg-[#0E2319] border-[#2EE59D] text-[#2EE59D]' 
                : toast.type === 'error' 
                ? 'bg-[#240F11] border-[#E5484D] text-[#E5484D]' 
                : toast.type === 'warning' 
                ? 'bg-[#231A0B] border-[#E5A83B] text-[#E5A83B]' 
                : 'bg-[#191C20] border-[#999080] text-[#E1E2E8]'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 leading-snug">{toast.message}</div>
            <button onClick={() => removeToast(toast.id)} className="opacity-70 hover:opacity-100">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
