import React, { useState, useEffect } from 'react';
import { Search, X, Boxes, MapPin, Building2, ArrowRight } from 'lucide-react';
import { WimsProduct } from '../../services/supabase';

interface WimsGlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  products: WimsProduct[];
  onSelectProduct: (p: WimsProduct) => void;
}

export function WimsGlobalSearch({
  isOpen,
  onClose,
  products,
  onSelectProduct
}: WimsGlobalSearchProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = products.filter(p => {
    if (!query.trim()) return false;
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.supplier.toLowerCase().includes(q) ||
      p.warehouse_location.toLowerCase().includes(q)
    );
  }).slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-[#111418] border border-[#ffe09d] rounded-lg shadow-2xl overflow-hidden font-mono-data text-xs text-[#e1e2e8]">
        
        {/* Search Input Bar */}
        <div className="p-4 bg-[#14171d] border-b border-[#32363e] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#ffe09d] flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type product name, unique SKU, supplier, or vault location..."
            className="flex-1 bg-transparent border-none text-sm text-[#e1e2e8] placeholder-[#6e7683] focus:outline-none"
          />
          <button onClick={onClose} className="p-1 text-[#999080] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-[#32363e]/40">
          {!query.trim() ? (
            <div className="p-6 text-center text-[#999080]">
              <div className="text-[11px]">Type to search all {products.length} products in warehouse...</div>
              <div className="text-[10px] text-[#6e7683] mt-1">Search by SKU code (e.g. AUR-OUD), Name, Bay or Supplier</div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-6 text-center text-[#999080]">
              <div>No matching products found for "{query}".</div>
            </div>
          ) : (
            results.map(prod => (
              <button
                key={prod.id}
                onClick={() => {
                  onSelectProduct(prod);
                  onClose();
                }}
                className="w-full p-3 hover:bg-[#1a1d24] rounded flex items-center justify-between text-left transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={prod.image_url}
                    alt={prod.name}
                    className="w-10 h-10 object-cover rounded bg-[#0b0e12] border border-[#32363e]"
                  />
                  <div>
                    <div className="font-bold text-[#e1e2e8] group-hover:text-[#ffe09d] transition-colors">
                      {prod.name}
                    </div>
                    <div className="text-[10px] text-[#999080] flex items-center gap-2 mt-0.5">
                      <span className="text-[#ffe09d] font-bold">{prod.sku}</span>
                      <span>·</span>
                      <span>{prod.category}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-[#ffe09d]" />
                        {prod.warehouse_location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex items-center gap-3">
                  <div>
                    <div className={`font-bold ${
                      prod.status === 'OUT OF STOCK' ? 'text-[#ff8080]' : prod.status === 'LOW STOCK' ? 'text-[#e5a83b]' : 'text-[#4ade80]'
                    }`}>
                      {prod.current_stock} units
                    </div>
                    <span className="text-[10px] text-[#999080]">{prod.status}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#999080] group-hover:text-white transition-colors" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer Hint */}
        <div className="p-2.5 bg-[#0b0e12] border-t border-[#32363e] flex items-center justify-between text-[10px] text-[#999080]">
          <span>Search index updated live with database</span>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-[#14171d] border border-[#32363e] rounded">ESC</kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
