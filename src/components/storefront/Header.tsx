import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, ShoppingCart, Menu, X, ArrowRight, ShieldCheck, ChevronDown, User, Boxes } from 'lucide-react';

export function Header() {
  const { 
    setMode, 
    storefrontView, 
    setStorefrontView, 
    cartCount, 
    setIsCartOpen, 
    wishlist, 
    setIsSearchOpen,
    setSelectedProduct,
    user,
    setIsAuthModalOpen,
    adminUser,
    setIsAdminLoginModalOpen
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', view: 'home' as const },
    { label: 'Shop All', view: 'shop' as const },
    { label: 'Men', view: 'shop' as const, filter: 'Men' },
    { label: 'Women', view: 'shop' as const, filter: 'Women' },
    { label: 'Unisex', view: 'shop' as const, filter: 'Unisex' },
    { label: 'Discovery Sets', view: 'shop' as const, category: 'Discovery' },
    { label: 'Atelier Story', view: 'about' as const },
    { label: 'Concierge', view: 'contact' as const }
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Main Luxury Header */}
      <div className={`transition-all duration-300 ${isScrolled ? 'bg-[#F8F5EF]/95 backdrop-blur-md shadow-sm py-3' : 'bg-[#F8F5EF] py-4'} border-b border-[#E8E0D4]`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="lg:hidden p-2 text-[#111111] hover:text-[#8A6D2F]"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Luxury Brand Monogram / Logo */}
          <div 
            onClick={() => { setStorefrontView('home'); setSelectedProduct(null); }}
            className="cursor-pointer text-center flex flex-col items-center"
          >
            <span className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-[0.22em] text-[#111111] uppercase leading-none">
              Aura Oud
            </span>
            <span className="font-syne text-[9px] uppercase tracking-[0.35em] text-[#8A6D2F] mt-1 font-semibold">
              Parfums & Atelier · Grasse / Lahore
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setStorefrontView(item.view);
                  setSelectedProduct(null);
                }}
                className={`text-xs uppercase tracking-[0.14em] font-medium transition-colors hover:text-[#8A6D2F] relative py-1 ${
                  storefrontView === item.view ? 'text-[#8A6D2F] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-[#8A6D2F]' : 'text-[#111111]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4 sm:space-x-5">
            {/* Search Trigger */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 text-[#111111] hover:text-[#8A6D2F] transition-colors relative"
              aria-label="Search Fragrances"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Customer Account / Orders / Google Auth */}
            {user ? (
              <button 
                onClick={() => setStorefrontView('account')}
                className="flex items-center gap-1.5 p-1 text-[#111111] hover:text-[#8A6D2F] transition-colors relative"
                aria-label="Customer Account"
                title={`${user.displayName} (${user.tier})`}
              >
                <div className="w-6 h-6 rounded-full bg-[#111111] text-[#FFE09D] flex items-center justify-center font-serif-luxury text-[11px] font-bold border border-[#C8A96B]">
                  {user.displayName.substring(0, 1).toUpperCase()}
                </div>
                <span className="hidden xl:inline text-[11px] font-syne uppercase tracking-wider text-[#8A6D2F] font-bold">
                  {user.displayName.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 p-1.5 text-[#111111] hover:text-[#8A6D2F] transition-colors relative"
                aria-label="Customer Account Sign In"
                title="Sign in to Patron Account"
              >
                <User className="w-5 h-5 stroke-[1.5]" />
                <span className="hidden md:inline text-[11px] font-syne uppercase tracking-wider text-[#6B6B6B] hover:text-[#111111]">
                  Sign In
                </span>
              </button>
            )}

            {/* Shopping Cart Drawer */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 p-1.5 text-[#111111] hover:text-[#8A6D2F] transition-colors relative"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 stroke-[1.5]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#111111] text-[#E8E0D4] text-[10px] w-4 h-4 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-mono-data text-xs font-semibold tracking-wider">
                CART {cartCount > 0 ? `(${cartCount})` : ''}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[88px] bg-[#111111]/60 backdrop-blur-sm z-50">
          <div className="bg-[#F8F5EF] w-4/5 max-w-sm h-full p-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E0D4]">
                <span className="font-serif-luxury text-lg font-bold tracking-wider">Navigation</span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-5 h-5 text-[#6B6B6B]" />
                </button>
              </div>
              <div className="flex flex-col space-y-3 pt-2">
                {navItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setStorefrontView(item.view);
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left text-sm uppercase tracking-widest py-2 text-[#111111] hover:text-[#8A6D2F] border-b border-[#E8E0D4]/40"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#E8E0D4] space-y-3">
              <button 
                onClick={() => { setStorefrontView('order-tracking'); setIsMobileMenuOpen(false); }}
                className="w-full py-2.5 bg-[#E8E0D4] text-[#111111] text-xs font-semibold uppercase tracking-wider text-center"
              >
                Track An Order
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
