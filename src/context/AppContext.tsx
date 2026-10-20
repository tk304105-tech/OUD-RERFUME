import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, ProductVariant, CartItem, Order, AdminRole, UserRolePermissions, AdminAccount } from '../types';
import { getProducts, getOrders, initializeStorage, saveCustomer } from '../api/mockApi';

export type AppMode = 'storefront' | 'admin';

export type StorefrontView = 
  | 'home' 
  | 'shop' 
  | 'product-detail' 
  | 'cart' 
  | 'checkout' 
  | 'order-success' 
  | 'order-tracking' 
  | 'wishlist' 
  | 'account' 
  | 'about' 
  | 'contact' 
  | 'faq';

export type AdminView = 
  | 'dashboard' 
  | 'inventory-overview' 
  | 'inventory-list' 
  | 'fragrance-profiles' 
  | 'stock-management-adjustments' 
  | 'sales-pos' 
  | 'purchases-orders' 
  | 'suppliers' 
  | 'customers' 
  | 'expenses' 
  | 'reports' 
  | 'analytics' 
  | 'notifications' 
  | 'users-roles' 
  | 'settings';

import { AppUser, getCurrentUser, loginWithGoogle as fbLoginWithGoogle, loginWithUserEmail as fbLoginWithUserEmail, logoutUser as fbLogoutUser, updateUserProfile as fbUpdateUserProfile } from '../services/firebase';
import { wimsDb } from '../services/supabase';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  mode: AppMode;
  setMode: (m: AppMode) => void;
  storefrontView: StorefrontView;
  setStorefrontView: (v: StorefrontView) => void;
  adminView: AdminView;
  setAdminView: (v: AdminView) => void;
  
  // User Authentication & Patron Profile
  user: AppUser | null;
  loginWithGoogle: () => Promise<void>;
  loginWithUserEmail: (email: string, name?: string, phone?: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<AppUser>) => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (b: boolean) => void;

  // Staff / Admin Authentication
  adminUser: AdminAccount | null;
  loginAdmin: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  isAdminLoginModalOpen: boolean;
  setIsAdminLoginModalOpen: (b: boolean) => void;

  // Products & Catalog
  products: Product[];
  refreshProducts: () => Promise<void>;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  selectedVariant: ProductVariant | null;
  setSelectedVariant: (v: ProductVariant | null) => void;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeFromCart: (variantId: string) => void;
  updateCartQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (o: Order | null) => void;
  orders: Order[];
  refreshOrders: () => Promise<void>;

  // Search Modal
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Roles & Admin Permissions
  currentRole: AdminRole;
  setCurrentRole: (role: AdminRole) => void;
  permissions: UserRolePermissions;

  // Helpers & UI
  formatPKR: (amount: number) => string;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const ROLE_PERMISSIONS_MAP: Record<AdminRole, UserRolePermissions> = {
  'Super Admin': {
    canViewDashboard: true,
    canManageProducts: true,
    canEditPrices: true,
    canManageInventory: true,
    canManageOrders: true,
    canIssueRefunds: true,
    canManageCustomers: true,
    canManageCoupons: true,
    canManageContent: true,
    canAccessSettings: true,
    canViewAuditLogs: true
  },
  'Manager': {
    canViewDashboard: true,
    canManageProducts: true,
    canEditPrices: true,
    canManageInventory: true,
    canManageOrders: true,
    canIssueRefunds: true,
    canManageCustomers: true,
    canManageCoupons: true,
    canManageContent: true,
    canAccessSettings: false,
    canViewAuditLogs: false
  },
  'Inventory Manager': {
    canViewDashboard: true,
    canManageProducts: true,
    canEditPrices: false,
    canManageInventory: true,
    canManageOrders: false,
    canIssueRefunds: false,
    canManageCustomers: false,
    canManageCoupons: false,
    canManageContent: false,
    canAccessSettings: false,
    canViewAuditLogs: false
  },
  'Order Manager': {
    canViewDashboard: true,
    canManageProducts: false,
    canEditPrices: false,
    canManageInventory: false,
    canManageOrders: true,
    canIssueRefunds: true,
    canManageCustomers: true,
    canManageCoupons: false,
    canManageContent: false,
    canAccessSettings: false,
    canViewAuditLogs: false
  },
  'Content Manager': {
    canViewDashboard: true,
    canManageProducts: false,
    canEditPrices: false,
    canManageInventory: false,
    canManageOrders: false,
    canIssueRefunds: false,
    canManageCustomers: false,
    canManageCoupons: true,
    canManageContent: true,
    canAccessSettings: false,
    canViewAuditLogs: false
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AppMode>('storefront');
  const [storefrontView, setStorefrontView] = useState<StorefrontView>('home');
  const [adminView, setAdminView] = useState<AdminView>('dashboard');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  // User & Patron Auth
  const [user, setUser] = useState<AppUser | null>(() => getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aura_oud_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  const loginWithGoogle = async () => {
    try {
      const loggedUser = await fbLoginWithGoogle();
      setUser(loggedUser);
      showToast(`Welcome back, ${loggedUser.displayName} (${loggedUser.tier})`, 'success');
      setIsAuthModalOpen(false);
    } catch (err: any) {
      showToast(err?.message || 'Authentication failed', 'error');
    }
  };

  const loginWithUserEmail = async (email: string, name?: string, phone?: string, password?: string) => {
    try {
      const loggedUser = await fbLoginWithUserEmail(email, name, phone, password);
      setUser(loggedUser);

      // Save customer to persistent ledger for IMS visibility
      try {
        await saveCustomer({
          id: loggedUser.uid,
          name: loggedUser.displayName,
          email: loggedUser.email,
          phone: loggedUser.phone,
          tier: loggedUser.tier,
          city: 'Lahore'
        });
      } catch (e) {
        console.warn("Could not save to customer ledger:", e);
      }

      showToast(`Welcome to Aura Oud, ${loggedUser.displayName}!`, 'success');
      setIsAuthModalOpen(false);
    } catch (err: any) {
      showToast(err?.message || 'Authentication failed', 'error');
    }
  };

  const logout = async () => {
    await fbLogoutUser();
    setUser(null);
    setStorefrontView('home');
    setMode('storefront');
    showToast('Signed out of patron account', 'info');
  };

  const updateUser = async (data: Partial<AppUser>) => {
    try {
      const updated = await fbUpdateUserProfile(data);
      setUser(updated);
      showToast('Patron profile updated successfully', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to update profile', 'error');
    }
  };

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aura_oud_wishlist');
      return saved ? JSON.parse(saved) : ['prod-1', 'prod-3'];
    } catch {
      return ['prod-1', 'prod-3'];
    }
  });

  // Search
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Last placed order
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Staff / Admin Authentication
  const [adminUser, setAdminUser] = useState<AdminAccount | null>(() => {
    try {
      const saved = localStorage.getItem('aura_oud_admin_session_v2');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // Admin Role
  const [currentRole, setCurrentRole] = useState<AdminRole>(() => {
    try {
      const saved = localStorage.getItem('aura_oud_admin_session_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.role || 'Super Admin';
      }
      return 'Super Admin';
    } catch {
      return 'Super Admin';
    }
  });

  const loginAdmin = async (emailInput: string, passwordInput?: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPass = (passwordInput || '').trim();

    const isAdmin = cleanEmail === 'tk304105@gmail.com' || cleanEmail === 'admin@warehouse.io' || cleanEmail.includes('admin') || cleanEmail.includes('staff');
    if (!isAdmin) {
      showToast('Invalid administrative email.', 'error');
      return { success: false, error: 'Invalid administrative credentials. Access restricted to authorized personnel.' };
    }

    if (!cleanPass) {
      return { success: false, error: 'Please enter your password.' };
    }

    const name = cleanEmail === 'tk304105@gmail.com' ? 'Tayyaba Khan' : cleanEmail.includes('staff') ? 'Staff Operator' : 'Super Admin';
    const role: AdminRole = cleanEmail.includes('staff') ? 'Inventory Manager' : 'Super Admin';

    const account: AdminAccount = {
      email: cleanEmail,
      name,
      role,
      lastLogin: new Date().toISOString()
    };

    setAdminUser(account);
    setCurrentRole(role);
    localStorage.setItem('aura_oud_admin_session_v2', JSON.stringify(account));

    // Direct synchronization with WIMS session so no secondary auth prompt appears
    wimsDb.setActiveUser({
      id: cleanEmail === 'tk304105@gmail.com' ? 'u-admin-02' : cleanEmail.includes('staff') ? 'u-staff-01' : 'u-admin-01',
      email: cleanEmail,
      full_name: name,
      role: role === 'Super Admin' ? 'ADMIN' : 'STAFF',
      status: 'ACTIVE',
      created_at: new Date().toISOString()
    });

    setMode('admin');
    setIsAdminLoginModalOpen(false);
    showToast(`Welcome to Admin Console, ${account.name}`, 'success');
    return { success: true };
  };

  const logoutAdmin = () => {
    localStorage.removeItem('aura_oud_admin_session_v2');
    setAdminUser(null);
    setMode('storefront');
    showToast('Signed out of Atelier IMS', 'info');
  };

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    initializeStorage();
    refreshProducts();
    refreshOrders();
  }, []);

  useEffect(() => {
    localStorage.setItem('aura_oud_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('aura_oud_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const refreshProducts = async () => {
    const list = await getProducts();
    setProducts(list);
    if (selectedProduct) {
      const updated = list.find(p => p.id === selectedProduct.id);
      if (updated) setSelectedProduct(updated);
    }
  };

  const refreshOrders = async () => {
    const list = await getOrders();
    setOrders(list);
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const formatPKR = (amount: number): string => {
    return `PKR ${Math.round(amount).toLocaleString('en-PK')}`;
  };

  const addToCart = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    const chosenVariant = variant || product.variants[0];
    if (!chosenVariant || chosenVariant.stock <= 0) {
      showToast('This fragrance variant is currently out of stock.', 'warning');
      return;
    }

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.variant.id === chosenVariant.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        const newQty = Math.min(chosenVariant.stock, updated[existingIndex].quantity + quantity);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty
        };
        return updated;
      } else {
        return [...prev, { product, variant: chosenVariant, quantity: Math.min(chosenVariant.stock, quantity) }];
      }
    });

    showToast(`Added ${product.name} (${chosenVariant.label}) to your bag.`, 'success');
    setIsCartOpen(true);
  };

  const removeFromCart = (variantId: string) => {
    setCart(prev => prev.filter(item => item.variant.id !== variantId));
    showToast('Item removed from shopping bag.', 'info');
  };

  const updateCartQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.variant.id === variantId) {
        return {
          ...item,
          quantity: Math.min(item.variant.stock, quantity)
        };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from your fragrance wishlist.', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to your fragrance wishlist.', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.includes(productId);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => {
    const price = item.variant.sale_price || item.variant.price;
    return total + price * item.quantity;
  }, 0);

  const permissions = ROLE_PERMISSIONS_MAP[currentRole];

  return (
    <AppContext.Provider
      value={{
        mode,
        setMode,
        storefrontView,
        setStorefrontView,
        adminView,
        setAdminView,
        user,
        loginWithGoogle,
        loginWithUserEmail,
        logout,
        updateUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        adminUser,
        loginAdmin,
        logoutAdmin,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        products,
        refreshProducts,
        selectedProduct,
        setSelectedProduct,
        selectedVariant,
        setSelectedVariant,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        lastPlacedOrder,
        setLastPlacedOrder,
        orders,
        refreshOrders,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        currentRole,
        setCurrentRole,
        permissions,
        formatPKR,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
