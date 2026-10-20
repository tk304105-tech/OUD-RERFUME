import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import { FragranceFamily, Gender } from '../../types';
import { SlidersHorizontal, X, RotateCcw, ChevronDown, Check } from 'lucide-react';

export function ShopView() {
  const { products, formatPKR } = useApp();

  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [selectedFamily, setSelectedFamily] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCollection, setSelectedCollection] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(12000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);

  const families: FragranceFamily[] = ['Woody', 'Oriental', 'Floral', 'Fresh', 'Gourmand', 'Spicy'];
  const categories = ['Extraits', 'EDPs', 'Attars', 'Discovery', 'Testers'];
  const collections = ['Heritage Oud', 'Atelier Florals', 'Private Reserve', 'Summer Reserve', 'Master Distillates'];

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (product.status !== 'Published') return false;
      const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
      if (totalStock <= 0) return false;
      if (selectedGender !== 'All' && product.gender !== selectedGender && product.gender !== 'Unisex') {
        return false;
      }
      if (selectedFamily !== 'All' && !product.families.includes(selectedFamily as FragranceFamily)) {
        return false;
      }
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      if (selectedCollection !== 'All' && product.collection !== selectedCollection) {
        return false;
      }
      // Price filter checking lowest variant price
      const lowestPrice = Math.min(...product.variants.map(v => v.sale_price || v.price));
      if (lowestPrice > maxPrice) return false;

      // In stock check
      if (inStockOnly) {
        const hasStock = product.variants.some(v => v.stock > 0);
        if (!hasStock) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.variants[0]?.sale_price || a.variants[0]?.price || 0;
      const priceB = b.variants[0]?.sale_price || b.variants[0]?.price || 0;

      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    });
  }, [products, selectedGender, selectedFamily, selectedCategory, selectedCollection, maxPrice, inStockOnly, sortBy]);

  const clearAllFilters = () => {
    setSelectedGender('All');
    setSelectedFamily('All');
    setSelectedCategory('All');
    setSelectedCollection('All');
    setMaxPrice(12000);
    setInStockOnly(false);
  };

  const hasActiveFilters = 
    selectedGender !== 'All' || 
    selectedFamily !== 'All' || 
    selectedCategory !== 'All' || 
    selectedCollection !== 'All' || 
    maxPrice < 12000 || 
    inStockOnly;

  return (
    <div className="bg-[#F8F5EF] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Title */}
        <div className="mb-8">
          <div className="text-xs uppercase font-mono-data text-[#8A6D2F] tracking-widest mb-1">
            Haute Parfumerie · Pakistan Catalog
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E8E0D4]">
            <div>
              <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#111111]">
                The Fragrance Collection
              </h1>
              <p className="text-xs text-[#6B6B6B] mt-1 font-serif-luxury">
                Distilled from aged wild woods, amber resins, and noble botanical extracts.
              </p>
            </div>

            {/* Mobile Filter Trigger & Sort */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden px-3.5 py-2 bg-white border border-[#E8E0D4] text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters {hasActiveFilters ? '•' : ''}</span>
              </button>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-10 pl-3 pr-8 bg-white border border-[#E8E0D4] text-xs font-medium uppercase tracking-wider text-[#111111] appearance-none focus:outline-none focus:border-[#C8A96B] cursor-pointer"
                >
                  <option value="featured">Sort: Featured Collection</option>
                  <option value="newest">Sort: Newest Distillations</option>
                  <option value="price-low">Sort: Price: Low to High</option>
                  <option value="price-high">Sort: Price: High to Low</option>
                  <option value="rating">Sort: Connoisseur Rating</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#6B6B6B] absolute right-2.5 top-3.5 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-[#6B6B6B] font-mono-data mr-1">Active:</span>
            {selectedGender !== 'All' && (
              <span className="px-2.5 py-1 bg-white border border-[#C8A96B] text-[11px] font-mono-data flex items-center gap-1.5">
                <span>Gender: {selectedGender}</span>
                <button onClick={() => setSelectedGender('All')}><X className="w-3 h-3 text-[#8A6D2F]" /></button>
              </span>
            )}
            {selectedFamily !== 'All' && (
              <span className="px-2.5 py-1 bg-white border border-[#C8A96B] text-[11px] font-mono-data flex items-center gap-1.5">
                <span>Accord: {selectedFamily}</span>
                <button onClick={() => setSelectedFamily('All')}><X className="w-3 h-3 text-[#8A6D2F]" /></button>
              </span>
            )}
            {selectedCategory !== 'All' && (
              <span className="px-2.5 py-1 bg-white border border-[#C8A96B] text-[11px] font-mono-data flex items-center gap-1.5">
                <span>Type: {selectedCategory}</span>
                <button onClick={() => setSelectedCategory('All')}><X className="w-3 h-3 text-[#8A6D2F]" /></button>
              </span>
            )}
            {selectedCollection !== 'All' && (
              <span className="px-2.5 py-1 bg-white border border-[#C8A96B] text-[11px] font-mono-data flex items-center gap-1.5">
                <span>Line: {selectedCollection}</span>
                <button onClick={() => setSelectedCollection('All')}><X className="w-3 h-3 text-[#8A6D2F]" /></button>
              </span>
            )}
            {maxPrice < 12000 && (
              <span className="px-2.5 py-1 bg-white border border-[#C8A96B] text-[11px] font-mono-data flex items-center gap-1.5">
                <span>Max: {formatPKR(maxPrice)}</span>
                <button onClick={() => setMaxPrice(12000)}><X className="w-3 h-3 text-[#8A6D2F]" /></button>
              </span>
            )}
            {inStockOnly && (
              <span className="px-2.5 py-1 bg-white border border-[#C8A96B] text-[11px] font-mono-data flex items-center gap-1.5">
                <span>In Stock Only</span>
                <button onClick={() => setInStockOnly(false)}><X className="w-3 h-3 text-[#8A6D2F]" /></button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-[#8A6D2F] hover:underline font-semibold uppercase tracking-wider ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block bg-white border border-[#E8E0D4] p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D4]">
              <span className="font-syne text-xs uppercase tracking-widest text-[#111111] font-bold">
                Refine Selection
              </span>
              {hasActiveFilters && (
                <button onClick={clearAllFilters} className="text-[11px] text-[#8A6D2F] hover:underline">
                  Reset
                </button>
              )}
            </div>

            {/* Gender Filter */}
            <div>
              <h4 className="text-xs uppercase font-syne font-semibold text-[#111111] mb-2.5">
                Target Gender
              </h4>
              <div className="space-y-1.5">
                {['All', 'Men', 'Women', 'Unisex'].map(g => (
                  <button
                    key={g}
                    onClick={() => setSelectedGender(g)}
                    className={`w-full text-left text-xs px-2.5 py-1.5 transition-colors flex items-center justify-between ${
                      selectedGender === g ? 'bg-[#F8F5EF] text-[#8A6D2F] font-bold' : 'text-[#6B6B6B] hover:text-[#111111]'
                    }`}
                  >
                    <span>{g}</span>
                    {selectedGender === g && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Olfactive Family */}
            <div className="pt-4 border-t border-[#E8E0D4]">
              <h4 className="text-xs uppercase font-syne font-semibold text-[#111111] mb-2.5">
                Olfactive Accord
              </h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedFamily('All')}
                  className={`w-full text-left text-xs px-2.5 py-1.5 transition-colors flex items-center justify-between ${
                    selectedFamily === 'All' ? 'bg-[#F8F5EF] text-[#8A6D2F] font-bold' : 'text-[#6B6B6B] hover:text-[#111111]'
                  }`}
                >
                  <span>All Accords</span>
                  {selectedFamily === 'All' && <Check className="w-3.5 h-3.5" />}
                </button>
                {families.map(f => (
                  <button
                    key={f}
                    onClick={() => setSelectedFamily(f)}
                    className={`w-full text-left text-xs px-2.5 py-1.5 transition-colors flex items-center justify-between ${
                      selectedFamily === f ? 'bg-[#F8F5EF] text-[#8A6D2F] font-bold' : 'text-[#6B6B6B] hover:text-[#111111]'
                    }`}
                  >
                    <span>{f}</span>
                    {selectedFamily === f && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Fragrance Type */}
            <div className="pt-4 border-t border-[#E8E0D4]">
              <h4 className="text-xs uppercase font-syne font-semibold text-[#111111] mb-2.5">
                Formulation Type
              </h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`w-full text-left text-xs px-2.5 py-1.5 transition-colors flex items-center justify-between ${
                    selectedCategory === 'All' ? 'bg-[#F8F5EF] text-[#8A6D2F] font-bold' : 'text-[#6B6B6B] hover:text-[#111111]'
                  }`}
                >
                  <span>All Types</span>
                  {selectedCategory === 'All' && <Check className="w-3.5 h-3.5" />}
                </button>
                {categories.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`w-full text-left text-xs px-2.5 py-1.5 transition-colors flex items-center justify-between ${
                      selectedCategory === c ? 'bg-[#F8F5EF] text-[#8A6D2F] font-bold' : 'text-[#6B6B6B] hover:text-[#111111]'
                    }`}
                  >
                    <span>{c}</span>
                    {selectedCategory === c && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="pt-4 border-t border-[#E8E0D4]">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs uppercase font-syne font-semibold text-[#111111]">
                  Max Price
                </h4>
                <span className="font-mono-data text-xs text-[#8A6D2F] font-bold">
                  {formatPKR(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min="2000"
                max="12000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#8A6D2F] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#6B6B6B] font-mono-data mt-1">
                <span>PKR 2,000</span>
                <span>PKR 12,000+</span>
              </div>
            </div>

            {/* Stock Availability Toggle */}
            <div className="pt-4 border-t border-[#E8E0D4]">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#111111]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-[#8A6D2F] w-4 h-4 rounded-none"
                />
                <span>In Stock Flacons Only</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4 text-xs font-mono-data text-[#6B6B6B]">
              <span>Showing {filteredProducts.length} exquisite specimens</span>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#E8E0D4] p-12 text-center space-y-4">
                <h3 className="font-serif-luxury text-2xl font-bold text-[#111111]">
                  No matching fragrances found
                </h3>
                <p className="text-xs text-[#6B6B6B] max-w-md mx-auto">
                  Try adjusting your olfactive filters or resetting your price range to discover other handcrafted distillations.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-[#111111] text-[#E8E0D4] text-xs uppercase font-syne tracking-wider font-semibold hover:bg-[#8A6D2F] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
