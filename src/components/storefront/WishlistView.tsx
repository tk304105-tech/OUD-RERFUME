import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

export function WishlistView() {
  const { products, wishlist, setStorefrontView } = useApp();

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="bg-[#F8F5EF] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[#E8E0D4] gap-4 mb-10">
          <div>
            <span className="text-xs font-syne uppercase tracking-widest text-[#8A6D2F] font-bold">
              Personal Fragrance Curation
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#111111] mt-1">
              Saved Flacons & Extraits
            </h1>
          </div>
          <span className="font-mono-data text-xs text-[#6B6B6B]">
            {wishlistedProducts.length} Specimens Saved
          </span>
        </div>

        {wishlistedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#E8E0D4] p-16 text-center space-y-4 max-w-xl mx-auto">
            <Heart className="w-12 h-12 text-[#E8E0D4] mx-auto" />
            <h3 className="font-serif-luxury text-2xl font-bold text-[#111111]">
              Your fragrance wishlist is waiting
            </h3>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              Explore our aged Cambodian agarwood extraits, Grasse roses, and discovery sets. Click the heart icon on any flacon to curate your private anthology.
            </p>
            <button
              onClick={() => setStorefrontView('shop')}
              className="px-6 py-3 bg-[#111111] text-[#FFE09D] hover:bg-[#8A6D2F] text-xs uppercase font-syne font-bold tracking-widest transition-colors inline-flex items-center gap-2"
            >
              <span>Explore Boutique</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
