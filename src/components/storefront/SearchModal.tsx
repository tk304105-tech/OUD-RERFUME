import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';

export function SearchModal() {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    searchQuery, 
    setSearchQuery, 
    products, 
    setSelectedProduct, 
    setStorefrontView,
    formatPKR 
  } = useApp();

  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isSearchOpen) return null;

  const results = debouncedQuery.trim()
    ? products.filter(p => {
        if (p.status !== 'Published') return false;
        const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
        if (totalStock <= 0) return false;
        return (
          p.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          p.families.some(f => f.toLowerCase().includes(debouncedQuery.toLowerCase())) ||
          p.top_notes.some(n => n.toLowerCase().includes(debouncedQuery.toLowerCase())) ||
          p.heart_notes.some(n => n.toLowerCase().includes(debouncedQuery.toLowerCase())) ||
          p.base_notes.some(n => n.toLowerCase().includes(debouncedQuery.toLowerCase()))
        );
      })
    : [];

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
    setStorefrontView('product-detail');
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#111111]/80 backdrop-blur-md p-4 sm:p-6 lg:p-10 flex items-start justify-center">
      <div className="w-full max-w-3xl bg-white border border-[#C8A96B] shadow-2xl overflow-hidden mt-12 animate-fadeIn">
        
        {/* Search Bar Input */}
        <div className="relative border-b border-[#E8E0D4] bg-[#F8F5EF] p-4 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#8A6D2F] flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by perfume name, notes (e.g. Saffron, Amber, Rose), SKU or family..."
            className="w-full bg-transparent text-sm sm:text-base font-serif-luxury text-[#111111] placeholder:text-[#6B6B6B] focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 text-[#6B6B6B] hover:text-[#111111]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Popular Tags / Recent Searches */}
        {!debouncedQuery.trim() && (
          <div className="p-6 space-y-4">
            <span className="text-xs uppercase font-syne font-bold text-[#8A6D2F] tracking-widest block">
              Popular Olfactive Searches in Pakistan
            </span>
            <div className="flex flex-wrap gap-2">
              {['Oud Royale', 'Centifolia Rose', 'Mysore Sandalwood', 'Kashmiri Saffron', 'Extrait de Parfum', 'Pure Attar', 'Discovery Set'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="px-3 py-1.5 bg-[#F8F5EF] hover:bg-[#E8E0D4] text-xs font-mono-data text-[#111111] border border-[#E8E0D4]"
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E8E0D4]">
              <span className="text-xs uppercase font-syne font-bold text-[#6B6B6B] tracking-widest block mb-3">
                Curated Recommendations
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {products.filter(p => {
                  if (p.status !== 'Published') return false;
                  const ts = p.variants.reduce((acc, v) => acc + v.stock, 0);
                  return ts > 0;
                }).slice(0, 4).map(p => (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProduct(p)}
                    className="p-3 bg-[#F8F5EF] border border-[#E8E0D4] hover:border-[#8A6D2F] cursor-pointer flex items-center gap-3 transition-colors"
                  >
                    <img src={p.images.main} alt="" className="w-10 h-12 object-cover border border-[#E8E0D4]" />
                    <div className="overflow-hidden">
                      <div className="font-serif-luxury text-sm font-bold text-[#111111] truncate">{p.name}</div>
                      <div className="text-[11px] font-mono-data text-[#8A6D2F]">
                        {formatPKR(p.variants[0]?.sale_price || p.variants[0]?.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results List */}
        {debouncedQuery.trim() && (
          <div className="p-6 max-h-[460px] overflow-y-auto space-y-3">
            <div className="text-xs font-mono-data text-[#6B6B6B]">
              Found {results.length} matching specimens for "{debouncedQuery}"
            </div>

            {results.length > 0 ? (
              <div className="divide-y divide-[#E8E0D4]">
                {results.map(p => (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProduct(p)}
                    className="py-3 flex items-center justify-between hover:bg-[#F8F5EF] px-2 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.images.main} alt="" className="w-12 h-14 object-cover border border-[#E8E0D4]" />
                      <div>
                        <div className="font-serif-luxury text-base font-bold text-[#111111]">{p.name}</div>
                        <div className="text-xs text-[#6B6B6B] font-mono-data">{p.families.join(', ')} · {p.concentration}</div>
                        <div className="text-[11px] text-[#8A6D2F] font-mono-data">Notes: {p.top_notes[0]}, {p.heart_notes[0]}, {p.base_notes[0]}</div>
                      </div>
                    </div>
                    <div className="text-right font-mono-data text-xs">
                      <div className="font-bold text-[#111111]">
                        {formatPKR(p.variants[0]?.sale_price || p.variants[0]?.price)}
                      </div>
                      <span className="text-[10px] text-[#8A6D2F]">View Details →</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-[#6B6B6B]">
                No fragrances match your inquiry. Try searching for "Oud", "Rose", "Amber" or "Sandalwood".
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
