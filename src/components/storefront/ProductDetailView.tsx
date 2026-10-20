import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductVariant } from '../../types';
import { ProductCard } from './ProductCard';
import { 
  Heart, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  ChevronRight, 
  ChevronDown, 
  Star, 
  Check, 
  Clock, 
  Wind, 
  Sparkles, 
  Package, 
  ArrowLeft 
} from 'lucide-react';

export function ProductDetailView() {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    setStorefrontView, 
    addToCart, 
    isInWishlist, 
    toggleWishlist, 
    formatPKR,
    products 
  } = useApp();

  if (!selectedProduct) {
    return (
      <div className="py-24 text-center">
        <p className="text-sm text-[#6B6B6B]">No fragrance selected.</p>
        <button 
          onClick={() => setStorefrontView('shop')}
          className="mt-4 px-6 py-2 bg-[#111111] text-white text-xs uppercase"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(selectedProduct.variants[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [selectedCity, setSelectedCity] = useState('Lahore');
  const [activeAccordion, setActiveAccordion] = useState<string>('notes');

  // Review Form State
  const [reviewName, setReviewName] = useState('');
  const [reviewCity, setReviewCity] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);

  const activeVariant: ProductVariant = 
    selectedProduct.variants.find(v => v.id === selectedVariantId) || selectedProduct.variants[0];

  const inWishlist = isInWishlist(selectedProduct.id);
  const isOutOfStock = activeVariant.stock <= 0;
  const isLowStock = activeVariant.stock > 0 && activeVariant.stock <= activeVariant.low_stock_threshold;

  // City delivery estimate
  const getCityDeliveryEstimate = (city: string) => {
    switch (city) {
      case 'Lahore':
        return 'Same-Day or Next-Day Morning Delivery (Local Atelier Dispatch)';
      case 'Karachi':
        return 'Overnight Express (24 Hours via TCS Cold-Chain)';
      case 'Islamabad':
      case 'Rawalpindi':
        return '24 Hours Delivery via Leopards Express Courier';
      default:
        return '24–48 Hours Nationwide Tracked Courier Dispatch';
    }
  };

  const allImages = [
    selectedProduct.images.main,
    selectedProduct.images.hover,
    ...(selectedProduct.images.gallery || [])
  ].filter(Boolean);

  const handleBuyNow = () => {
    addToCart(selectedProduct, activeVariant, quantity);
    setStorefrontView('checkout');
  };

  // Recommendations: Similar family
  const similarProducts = products
    .filter(p => p.id !== selectedProduct.id && p.families.some(f => selectedProduct.families.includes(f)))
    .slice(0, 3);

  // Discovery or complementary
  const complementaryProducts = products
    .filter(p => p.id !== selectedProduct.id && (p.category === 'Discovery' || p.category === 'Attars'))
    .slice(0, 3);

  return (
    <div className="bg-[#F8F5EF] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono-data text-[#6B6B6B] uppercase mb-8">
          <button onClick={() => setStorefrontView('home')} className="hover:text-[#111111]">Home</button>
          <span>/</span>
          <button onClick={() => setStorefrontView('shop')} className="hover:text-[#111111]">Shop</button>
          <span>/</span>
          <span className="text-[#8A6D2F] truncate">{selectedProduct.name}</span>
        </div>

        {/* Top Product Spec Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Visual Flacon Gallery (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            
            {/* Thumbnails Vertical Strip */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-24 flex-shrink-0 bg-white border transition-all ${
                    activeImageIndex === idx ? 'border-[#8A6D2F] ring-1 ring-[#8A6D2F]' : 'border-[#E8E0D4] hover:border-[#C8A96B]'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Primary Flacon Showcase */}
            <div className="relative flex-1 aspect-[4/5] bg-white border border-[#E8E0D4] overflow-hidden group">
              <img
                src={allImages[activeImageIndex] || selectedProduct.images.main}
                alt={selectedProduct.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {selectedProduct.badge && (
                <div className="absolute top-4 left-4 bg-[#111111] text-[#FFE09D] px-3 py-1 font-syne text-xs uppercase tracking-widest font-bold">
                  {selectedProduct.badge}
                </div>
              )}

              <button
                onClick={() => toggleWishlist(selectedProduct.id)}
                className={`absolute top-4 right-4 w-10 h-10 flex items-center justify-center transition-colors shadow-sm ${
                  inWishlist ? 'bg-[#8A6D2F] text-white' : 'bg-white/90 text-[#111111] hover:bg-white'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-white' : ''}`} />
              </button>
            </div>
          </div>

          {/* Right Column: Buy Box & Formulation Spec (5 Cols) */}
          <div className="lg:col-span-5 bg-white border border-[#E8E0D4] p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs font-syne uppercase tracking-widest text-[#8A6D2F] font-semibold">
                <span>{selectedProduct.brand} · {selectedProduct.collection}</span>
                <span className="font-mono-data text-[#6B6B6B]">{activeVariant.sku}</span>
              </div>

              <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#111111] mt-1.5 leading-tight">
                {selectedProduct.name}
              </h1>

              <p className="text-xs text-[#6B6B6B] font-serif-luxury mt-1">
                {selectedProduct.subtitle}
              </p>

              {/* Rating Teaser */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#E8E0D4]/70">
                <div className="flex text-[#8A6D2F]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#8A6D2F]" />
                  ))}
                </div>
                <span className="text-xs font-mono-data font-bold text-[#111111]">{selectedProduct.rating}</span>
                <span className="text-xs text-[#6B6B6B] font-mono-data">({selectedProduct.review_count} connoisseur reviews)</span>
              </div>
            </div>

            {/* Price Plinth */}
            <div className="p-4 bg-[#F8F5EF] border border-[#E8E0D4] flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-[#6B6B6B] font-mono-data uppercase block">Price in Pakistani Rupees</span>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono-data text-2xl font-bold text-[#111111]">
                    {formatPKR(activeVariant.sale_price || activeVariant.price)}
                  </span>
                  {activeVariant.sale_price && activeVariant.sale_price < activeVariant.price && (
                    <span className="font-mono-data text-sm text-[#6B6B6B] line-through">
                      {formatPKR(activeVariant.price)}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[11px] font-mono-data text-[#2F6B4F] bg-[#2F6B4F]/10 px-2 py-0.5 font-medium">
                Tax & Customs Included
              </span>
            </div>

            {/* Size Variant Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-syne uppercase tracking-wider text-[#111111]">
                <span className="font-bold">Select Volume & Formulation:</span>
                <span className="font-mono-data text-[#8A6D2F] font-semibold">{activeVariant.label}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {selectedProduct.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`p-3 text-left border transition-all flex flex-col justify-between ${
                      variant.id === selectedVariantId 
                        ? 'border-[#8A6D2F] bg-[#F8F5EF] ring-1 ring-[#8A6D2F]' 
                        : 'border-[#E8E0D4] hover:border-[#C8A96B]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono-data text-xs font-bold text-[#111111]">{variant.size_ml} ML</span>
                      <span className="text-[10px] font-mono-data text-[#6B6B6B]">{variant.sku}</span>
                    </div>
                    <span className="font-mono-data text-xs text-[#8A6D2F] font-semibold mt-1">
                      {formatPKR(variant.sale_price || variant.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Scarcity Status */}
            <div className="text-xs font-mono-data">
              {isOutOfStock ? (
                <div className="p-3 bg-[#A33A3A]/10 border border-[#A33A3A] text-[#A33A3A] flex items-center gap-2 font-semibold">
                  <span>Currently Out of Stock in Bonded Cellars. Next distillation batch curing.</span>
                </div>
              ) : isLowStock ? (
                <div className="p-2.5 bg-[#B7791F]/10 border border-[#B7791F] text-[#B7791F] flex items-center justify-between">
                  <span className="font-bold">Urgent: Only {activeVariant.stock} bottles remaining in current batch.</span>
                  <span className="text-[10px] uppercase font-mono-data">Batch #{activeVariant.barcode.slice(-4)}</span>
                </div>
              ) : (
                <div className="text-[#2F6B4F] flex items-center gap-1.5 font-medium">
                  <Check className="w-4 h-4" />
                  <span>In Stock & Ready for Same-Day Dispatch ({activeVariant.stock} units available)</span>
                </div>
              )}
            </div>

            {/* Quantity Selector + Add to Bag + Buy Now */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-[#E8E0D4] bg-white h-12 px-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="text-[#6B6B6B] hover:text-[#111111] font-bold px-2"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-mono-data font-semibold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(activeVariant.stock, quantity + 1))}
                    disabled={quantity >= activeVariant.stock || isOutOfStock}
                    className="text-[#6B6B6B] hover:text-[#111111] font-bold px-2"
                  >
                    +
                  </button>
                </div>

                {/* Add To Bag */}
                <button
                  onClick={() => addToCart(selectedProduct, activeVariant, quantity)}
                  disabled={isOutOfStock}
                  className={`flex-1 h-12 uppercase text-xs font-syne font-bold tracking-widest flex items-center justify-center gap-2 transition-all ${
                    isOutOfStock 
                      ? 'bg-[#E8E0D4] text-[#6B6B6B] cursor-not-allowed' 
                      : 'bg-[#111111] text-[#FFFFFF] hover:bg-[#8A6D2F]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Depleted' : 'Add To Bag'}</span>
                </button>
              </div>

              {/* Buy Now Direct Button */}
              {!isOutOfStock && (
                <button
                  onClick={handleBuyNow}
                  className="w-full h-12 bg-[#8A6D2F] hover:bg-[#ffe09d] hover:text-[#111111] text-[#FFFFFF] uppercase text-xs font-syne font-bold tracking-widest transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <span>Instant Checkout · Cash on Delivery</span>
                </button>
              )}
            </div>

            {/* Pakistan City Delivery Calculator */}
            <div className="pt-4 border-t border-[#E8E0D4] space-y-2">
              <div className="flex items-center justify-between text-xs font-syne uppercase text-[#111111]">
                <span className="font-semibold flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#8A6D2F]" />
                  <span>Delivery Estimate for Your City:</span>
                </span>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-[#F8F5EF] border border-[#E8E0D4] text-xs font-mono-data px-2 py-1 outline-none"
                >
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Multan">Multan</option>
                  <option value="Peshawar">Peshawar</option>
                  <option value="Quetta">Quetta</option>
                </select>
              </div>
              <p className="text-xs text-[#6B6B6B] font-mono-data bg-[#F8F5EF] p-2.5 border border-[#E8E0D4]">
                {getCityDeliveryEstimate(selectedCity)}
              </p>
            </div>
          </div>
        </div>

        {/* Technical Accordions & Olfactive Architecture */}
        <div className="mt-16 bg-white border border-[#E8E0D4] divide-y divide-[#E8E0D4]">
          
          {/* Accordion 1: Olfactive Pyramid */}
          <div>
            <button
              onClick={() => setActiveAccordion(activeAccordion === 'notes' ? '' : 'notes')}
              className="w-full p-6 text-left flex items-center justify-between hover:bg-[#F8F5EF] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#8A6D2F]"></span>
                <h3 className="font-syne text-sm uppercase tracking-widest font-bold text-[#111111]">
                  Visual Olfactive Notes Pyramid
                </h3>
              </div>
              <ChevronDown className={`w-5 h-5 text-[#8A6D2F] transition-transform ${activeAccordion === 'notes' ? 'rotate-180' : ''}`} />
            </button>

            {activeAccordion === 'notes' && (
              <div className="p-6 pt-0 space-y-4">
                <p className="text-xs text-[#6B6B6B] max-w-2xl leading-relaxed">
                  Our formulations strictly follow traditional 3-tier molecular evaporation architecture, transitioning harmoniously from initial sparkling volatility to eternal fixative resonance.
                </p>

                <div className="space-y-3 pt-2">
                  {/* Top Notes */}
                  <div className="p-4 bg-[#F8F5EF] border border-[#E8E0D4]">
                    <div className="flex items-center justify-between text-xs font-mono-data uppercase text-[#8A6D2F] font-bold">
                      <span>Top Notes (First 15–30 Mins · High Volatility)</span>
                      <span className="text-[10px] text-[#6B6B6B]">Initial Radiance</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedProduct.top_notes.map((note, i) => (
                        <span key={i} className="px-3 py-1 bg-white border border-[#E8E0D4] text-xs font-mono-data text-[#111111]">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Heart Notes */}
                  <div className="p-4 bg-[#F8F5EF] border border-[#E8E0D4]">
                    <div className="flex items-center justify-between text-xs font-mono-data uppercase text-[#C8A96B] font-bold">
                      <span>Heart / Middle Notes (2–6 Hours · Core Resonance)</span>
                      <span className="text-[10px] text-[#6B6B6B]">The Scent Soul</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedProduct.heart_notes.map((note, i) => (
                        <span key={i} className="px-3 py-1 bg-white border border-[#E8E0D4] text-xs font-mono-data text-[#111111]">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Base Notes */}
                  <div className="p-4 bg-[#F8F5EF] border border-[#E8E0D4]">
                    <div className="flex items-center justify-between text-xs font-mono-data uppercase text-[#111111] font-bold">
                      <span>Base Notes (8–24+ Hours · Persistent Fixatives)</span>
                      <span className="text-[10px] text-[#6B6B6B]">Substantive Drydown</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedProduct.base_notes.map((note, i) => (
                        <span key={i} className="px-3 py-1 bg-white border border-[#E8E0D4] text-xs font-mono-data text-[#111111]">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Accordion 2: Longevity & Sillage Radar Meters */}
          <div>
            <button
              onClick={() => setActiveAccordion(activeAccordion === 'performance' ? '' : 'performance')}
              className="w-full p-6 text-left flex items-center justify-between hover:bg-[#F8F5EF] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#8A6D2F]"></span>
                <h3 className="font-syne text-sm uppercase tracking-widest font-bold text-[#111111]">
                  Longevity & Sillage Technical Performance
                </h3>
              </div>
              <ChevronDown className={`w-5 h-5 text-[#8A6D2F] transition-transform ${activeAccordion === 'performance' ? 'rotate-180' : ''}`} />
            </button>

            {activeAccordion === 'performance' && (
              <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-[#F8F5EF] border border-[#E8E0D4] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-syne uppercase text-[#8A6D2F] font-bold">
                    <Clock className="w-4 h-4" />
                    <span>Longevity on Skin</span>
                  </div>
                  <div className="font-serif-luxury text-xl font-bold text-[#111111]">
                    {selectedProduct.longevity}
                  </div>
                  <div className="w-full bg-[#E8E0D4] h-1.5 mt-2 overflow-hidden">
                    <div className="bg-[#8A6D2F] h-full w-[95%]"></div>
                  </div>
                  <span className="text-[10px] text-[#6B6B6B] block">Tested across humid 38°C climate conditions</span>
                </div>

                <div className="p-4 bg-[#F8F5EF] border border-[#E8E0D4] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-syne uppercase text-[#8A6D2F] font-bold">
                    <Wind className="w-4 h-4" />
                    <span>Sillage & Scent Trail</span>
                  </div>
                  <div className="font-serif-luxury text-xl font-bold text-[#111111]">
                    {selectedProduct.sillage}
                  </div>
                  <div className="w-full bg-[#E8E0D4] h-1.5 mt-2 overflow-hidden">
                    <div className="bg-[#8A6D2F] h-full w-[85%]"></div>
                  </div>
                  <span className="text-[10px] text-[#6B6B6B] block">Projects 2 to 3 meters within first 4 hours</span>
                </div>

                <div className="p-4 bg-[#F8F5EF] border border-[#E8E0D4] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-syne uppercase text-[#8A6D2F] font-bold">
                    <Sparkles className="w-4 h-4" />
                    <span>Optimal Season</span>
                  </div>
                  <div className="font-serif-luxury text-xl font-bold text-[#111111]">
                    {selectedProduct.best_season}
                  </div>
                  <div className="w-full bg-[#E8E0D4] h-1.5 mt-2 overflow-hidden">
                    <div className="bg-[#8A6D2F] h-full w-[100%]"></div>
                  </div>
                  <span className="text-[10px] text-[#6B6B6B] block">Formulated with temperature fixatives</span>
                </div>
              </div>
            )}
          </div>

          {/* Accordion 3: Ingredients & Allergen Transparency */}
          <div>
            <button
              onClick={() => setActiveAccordion(activeAccordion === 'ingredients' ? '' : 'ingredients')}
              className="w-full p-6 text-left flex items-center justify-between hover:bg-[#F8F5EF] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#8A6D2F]"></span>
                <h3 className="font-syne text-sm uppercase tracking-widest font-bold text-[#111111]">
                  Ingredients & IFRA Allergen Transparency
                </h3>
              </div>
              <ChevronDown className={`w-5 h-5 text-[#8A6D2F] transition-transform ${activeAccordion === 'ingredients' ? 'rotate-180' : ''}`} />
            </button>

            {activeAccordion === 'ingredients' && (
              <div className="p-6 pt-0 space-y-3 text-xs text-[#6B6B6B] font-mono-data leading-relaxed">
                <p><strong className="text-[#111111]">Composition:</strong> {selectedProduct.ingredients}</p>
                <p><strong className="text-[#111111]">Safety Certification:</strong> {selectedProduct.allergen_notice || 'Compliant with IFRA 51st amendment standards. Free of phthalates and synthetic nitromusks.'}</p>
                <p><strong className="text-[#111111]">Maceration State:</strong> Cured for {selectedProduct.maceration_days} days in temperature-stabilized cellars before bottling.</p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews & Testimonials Section */}
        <div className="mt-16 bg-white border border-[#E8E0D4] p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E0D4]">
            <div>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#111111]">
                Connoisseur Reviews
              </h3>
              <p className="text-xs text-[#6B6B6B] font-mono-data mt-1">
                Verified reviews from patrons across Karachi, Lahore, and Islamabad.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-serif-luxury font-bold text-[#111111]">{selectedProduct.rating}</span>
              <div className="flex flex-col">
                <div className="flex text-[#8A6D2F]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#8A6D2F]" />
                  ))}
                </div>
                <span className="text-[11px] text-[#6B6B6B] font-mono-data">Based on {selectedProduct.review_count} orders</span>
              </div>
            </div>
          </div>

          {/* Write a Review Form */}
          <div className="mt-8 p-6 bg-[#F8F5EF] border border-[#E8E0D4]">
            <h4 className="font-syne text-xs uppercase tracking-widest text-[#111111] font-bold mb-3">
              Share Your Olfactive Experience
            </h4>

            {isReviewSubmitted ? (
              <div className="p-4 bg-white border border-[#2F6B4F] text-[#2F6B4F] text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Thank you. Your review has been submitted and verified into our connoisseur register.</span>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!reviewName || !reviewBody) return;
                  setIsReviewSubmitted(true);
                }} 
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-mono-data text-[#6B6B6B] block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g. Tariq Khan"
                      className="w-full h-10 px-3 bg-white border border-[#E8E0D4] text-xs text-[#111111] focus:outline-none focus:border-[#8A6D2F]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono-data text-[#6B6B6B] block mb-1">City in Pakistan</label>
                    <input
                      type="text"
                      value={reviewCity}
                      onChange={(e) => setReviewCity(e.target.value)}
                      placeholder="e.g. Lahore, DHA"
                      className="w-full h-10 px-3 bg-white border border-[#E8E0D4] text-xs text-[#111111] focus:outline-none focus:border-[#8A6D2F]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono-data text-[#6B6B6B] block mb-1">Rating</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="w-full h-10 px-3 bg-white border border-[#E8E0D4] text-xs text-[#111111] focus:outline-none focus:border-[#8A6D2F]"
                    >
                      <option value="5">★★★★★ (5/5) Masterpiece</option>
                      <option value="4">★★★★☆ (4/5) Highly Recommended</option>
                      <option value="3">★★★☆☆ (3/5) Average</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono-data text-[#6B6B6B] block mb-1">Review Headline</label>
                  <input
                    type="text"
                    required
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="e.g. Remarkable drydown and longevity"
                    className="w-full h-10 px-3 bg-white border border-[#E8E0D4] text-xs text-[#111111] focus:outline-none focus:border-[#8A6D2F]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono-data text-[#6B6B6B] block mb-1">Detailed Sensory Impressions</label>
                  <textarea
                    rows={3}
                    required
                    value={reviewBody}
                    onChange={(e) => setReviewBody(e.target.value)}
                    placeholder="Describe the projection, notes evolution, and longevity you observed..."
                    className="w-full p-3 bg-white border border-[#E8E0D4] text-xs text-[#111111] focus:outline-none focus:border-[#8A6D2F]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#111111] text-[#FFFFFF] text-xs uppercase font-syne font-bold tracking-widest hover:bg-[#8A6D2F] transition-colors"
                >
                  Publish Verified Review
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Recommendations Section */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E8E0D4]">
              <div>
                <span className="text-xs font-syne uppercase tracking-widest text-[#8A6D2F] font-bold">
                  Curated Affinity
                </span>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#111111]">
                  You May Also Admire
                </h3>
              </div>
              <button 
                onClick={() => setStorefrontView('shop')}
                className="text-xs uppercase font-semibold text-[#8A6D2F] hover:underline"
              >
                View Full Collection →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
