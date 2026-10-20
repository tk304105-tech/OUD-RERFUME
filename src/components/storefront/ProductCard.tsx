import React, { useState } from 'react';
import { Product, ProductVariant } from '../../types';
import { useApp } from '../../context/AppContext';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { 
    setSelectedProduct, 
    setStorefrontView, 
    addToCart, 
    isInWishlist, 
    toggleWishlist,
    formatPKR 
  } = useApp();

  const [selectedSizeId, setSelectedSizeId] = useState<string>(product.variants[0]?.id || '');
  const [showQuickSizes, setShowQuickSizes] = useState(false);

  const activeVariant: ProductVariant = product.variants.find(v => v.id === selectedSizeId) || product.variants[0];
  const isOutOfStock = activeVariant.stock <= 0;
  const isLowStock = activeVariant.stock > 0 && activeVariant.stock <= activeVariant.low_stock_threshold;
  const inWishlist = isInWishlist(product.id);

  const handleCardClick = () => {
    setSelectedProduct(product);
    setStorefrontView('product-detail');
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.variants.length > 1 && !showQuickSizes) {
      setShowQuickSizes(true);
      return;
    }
    addToCart(product, activeVariant, 1);
    setShowQuickSizes(false);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative bg-[#FFFFFF] border border-[#E8E0D4] flex flex-col justify-between transition-all duration-300 hover:border-[#C8A96B] hover:shadow-lg cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative w-full aspect-[4/5] bg-[#F8F5EF] overflow-hidden">
        {/* Main Image */}
        <img
          src={product.images.main}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {product.badge && (
            <span className="px-2 py-0.5 bg-[#111111] text-[#FFE09D] text-[10px] font-syne uppercase tracking-wider font-semibold">
              {product.badge}
            </span>
          )}
          {isOutOfStock ? (
            <span className="px-2 py-0.5 bg-[#A33A3A] text-white text-[10px] uppercase font-bold tracking-wider">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="px-2 py-0.5 bg-[#B7791F] text-white text-[10px] uppercase font-semibold tracking-wider">
              Only {activeVariant.stock} Left
            </span>
          ) : null}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 flex items-center justify-center transition-colors z-10 ${
            inWishlist ? 'bg-[#8A6D2F] text-white' : 'bg-[#FFFFFF]/80 hover:bg-[#FFFFFF] text-[#111111]'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
        </button>

        {/* Olfactive Family Pill */}
        <div className="absolute bottom-2.5 left-2.5 bg-[#111111]/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-mono-data text-[#E8E0D4] tracking-wider uppercase">
          {product.families.join(' · ')}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#8A6D2F] font-syne uppercase tracking-wider mb-1">
            <span>{product.collection}</span>
            <span className="font-mono-data text-[#6B6B6B]">{activeVariant.size_ml}ML · {product.gender}</span>
          </div>

          <h3 className="font-serif-luxury text-lg font-bold text-[#111111] group-hover:text-[#8A6D2F] transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-[#6B6B6B] line-clamp-1 mt-0.5">
            {product.subtitle}
          </p>

          {/* Key Notes Teaser */}
          <div className="mt-2 text-[11px] text-[#6B6B6B] font-mono-data line-clamp-1 border-t border-[#E8E0D4]/60 pt-1.5">
            <span className="text-[#8A6D2F]">Notes:</span> {product.top_notes[0]}, {product.heart_notes[0]}, {product.base_notes[0]}
          </div>
        </div>

        {/* Pricing and Quick Actions */}
        <div className="mt-4 pt-3 border-t border-[#E8E0D4] flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono-data font-bold text-sm text-[#111111]">
                {formatPKR(activeVariant.sale_price || activeVariant.price)}
              </span>
              {activeVariant.sale_price && activeVariant.sale_price < activeVariant.price && (
                <span className="font-mono-data text-xs text-[#6B6B6B] line-through">
                  {formatPKR(activeVariant.price)}
                </span>
              )}
            </div>
            <div className="text-[10px] text-[#2F6B4F] font-medium mt-0.5">
              Complimentary 2ml Sample Included
            </div>
          </div>

          {/* Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              isOutOfStock 
                ? 'bg-[#E8E0D4] text-[#6B6B6B] cursor-not-allowed' 
                : 'bg-[#111111] text-[#FFFFFF] hover:bg-[#8A6D2F]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Sold Out' : 'Add'}</span>
          </button>
        </div>

        {/* Multi-Size Picker Flyout */}
        {showQuickSizes && product.variants.length > 1 && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="mt-3 p-2 bg-[#F8F5EF] border border-[#C8A96B] space-y-1.5 animate-fadeIn"
          >
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#8A6D2F]">
              <span>Select Flacon Size:</span>
              <button 
                onClick={() => setShowQuickSizes(false)} 
                className="text-[#6B6B6B] hover:text-[#111111]"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedSizeId(v.id);
                    addToCart(product, v, 1);
                    setShowQuickSizes(false);
                  }}
                  disabled={v.stock <= 0}
                  className={`p-1.5 text-left border text-xs flex flex-col justify-between ${
                    v.id === selectedSizeId 
                      ? 'border-[#8A6D2F] bg-white font-semibold' 
                      : 'border-[#E8E0D4] hover:border-[#C8A96B]'
                  } ${v.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="text-[11px]">{v.size_ml}ml</span>
                  <span className="font-mono-data text-[10px] text-[#8A6D2F]">
                    {v.stock <= 0 ? 'Sold Out' : formatPKR(v.sale_price || v.price)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
