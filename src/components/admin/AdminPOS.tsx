import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { executePOSTransaction } from '../../api/mockApi';
import { 
  Scan, 
  PauseCircle, 
  Search, 
  Plus, 
  X, 
  CreditCard, 
  Banknote, 
  Building2, 
  QrCode, 
  Printer, 
  Mail, 
  CheckCircle2, 
  RefreshCw, 
  Diamond,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface POSItem {
  id: string;
  sku: string;
  name: string;
  subtitle: string;
  unitPrice: number;
  quantity: number;
  size_ml: number;
}

export function AdminPOS() {
  const { products, formatPKR, refreshProducts, showToast } = useApp();

  const [activeSegment, setActiveSegment] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [tenderMethod, setTenderMethod] = useState<'Credit Card' | 'Cash' | 'Wire / Bank' | 'UPI / App'>('Credit Card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [saleSuccessInvoice, setSaleSuccessInvoice] = useState<string | null>(null);

  // Initial bill state matching Image 3
  const [billItems, setBillItems] = useState<POSItem[]>([
    {
      id: 'pos-1',
      sku: 'SKU-AOR-091',
      name: 'Oud Royale 100ml',
      subtitle: 'Extrait de Parfum · Pure Assam Oud',
      unitPrice: 6500,
      quantity: 1,
      size_ml: 100
    },
    {
      id: 'pos-2',
      sku: 'SKU-ACR-108',
      name: 'Citrus Riviera 100ml',
      subtitle: 'Eau de Parfum · Bergamot & Salty Neroli',
      unitPrice: 3800,
      quantity: 2,
      size_ml: 100
    },
    {
      id: 'pos-3',
      sku: 'SKU-AVR-042',
      name: 'Velvet Rose 50ml',
      subtitle: 'Eau de Parfum · Grasse Rose Otto & Vanilla',
      unitPrice: 4200,
      quantity: 1,
      size_ml: 50
    }
  ]);

  const vipDiscountPercent = 10; // Sheikh Tariq Al-Mansoor VIP Gold

  const filteredProducts = products.filter(p => {
    if (activeSegment === 'Extraits') return p.category === 'Extraits';
    if (activeSegment === 'EDPs') return p.category === 'EDPs';
    if (activeSegment === 'Attars') return p.category === 'Attars';
    if (activeSegment === 'Discovery') return p.category === 'Discovery';
    if (activeSegment === 'Testers') return p.category === 'Testers';
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || 
             p.variants.some(v => v.sku.toLowerCase().includes(q) || v.barcode.includes(q)) ||
             p.families.some(f => f.toLowerCase().includes(q));
    }
    return true;
  });

  const addItemToBill = (product: any, variant: any) => {
    setBillItems(prev => {
      const existing = prev.find(item => item.sku === variant.sku);
      if (existing) {
        return prev.map(item => 
          item.sku === variant.sku ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [
          {
            id: `pos-${Date.now()}`,
            sku: variant.sku,
            name: `${product.name} ${variant.size_ml}ml`,
            subtitle: `${product.concentration} · ${product.families[0]}`,
            unitPrice: variant.sale_price || variant.price,
            quantity: 1,
            size_ml: variant.size_ml
          },
          ...prev
        ];
      }
    });
    showToast(`Added ${product.name} to active bill.`, 'info');
  };

  const updateQuantity = (sku: string, delta: number) => {
    setBillItems(prev => 
      prev.map(item => {
        if (item.sku === sku) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as POSItem[]
    );
  };

  const removeItem = (sku: string) => {
    setBillItems(prev => prev.filter(item => item.sku !== sku));
  };

  const subtotal = billItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const vipDiscount = Math.round((subtotal * vipDiscountPercent) / 100);
  const tax = Math.round((subtotal - vipDiscount) * 0.05); // 5% GST
  const grandTotal = subtotal - vipDiscount + tax;

  const handleCompleteSale = async () => {
    if (billItems.length === 0) return;
    setIsProcessing(true);

    try {
      const res = await executePOSTransaction({
        items: billItems.map(i => ({
          sku: i.sku,
          name: i.name,
          quantity: i.quantity,
          unitPrice: i.unitPrice
        })),
        customerName: 'Sheikh Tariq Al-Mansoor',
        vipDiscountPercent,
        tenderMethod
      });

      try {
        confetti({ particleCount: 50, spread: 60 });
      } catch {}

      await refreshProducts();
      setSaleSuccessInvoice(res.invoiceNumber);
      showToast(`Sale finalized. Invoice ${res.invoiceNumber} recorded in bonded vault ledger.`, 'success');
      
      setTimeout(() => {
        setBillItems([]);
        setSaleSuccessInvoice(null);
      }, 3500);
    } catch (err) {
      showToast('Transaction reconciliation failed.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-[#111418] text-[#e1e2e8] min-h-[calc(100vh-4rem)]">
      <div className="grid grid-cols-12 min-h-[calc(100vh-4rem)]">
        
        {/* Left Column (8 Cols): Fast Catalog Execution */}
        <div className="col-span-12 xl:col-span-8 flex flex-col p-6 bg-[#111418] border-r border-[#4d4639]/40">
          
          {/* Top Tactical Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 bg-[#272a2e] text-[#ffe09d] font-mono-data text-xs tracking-widest uppercase font-bold">
                TERM-04 // LONDON VAULT
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#2EE59D] rounded-none animate-pulse"></span>
                <span className="font-mono-data text-xs text-[#d0c5b4]">BARCODE ENGINE SYNCHRONIZED</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => showToast('Optical barcode scan reader ready.', 'info')}
                className="px-3 py-1.5 bg-[#272a2e] text-[#dee3ee] hover:text-[#ffe09d] transition-colors font-mono-data text-xs uppercase flex items-center gap-1.5"
              >
                <Scan className="w-3.5 h-3.5" />
                <span>Scan Reader</span>
              </button>
              <button
                type="button"
                onClick={() => showToast('Active ticket held on register memory.', 'info')}
                className="px-3 py-1.5 bg-[#272a2e] text-[#dee3ee] hover:text-[#ffe09d] transition-colors font-mono-data text-xs uppercase flex items-center gap-1.5"
              >
                <PauseCircle className="w-3.5 h-3.5" />
                <span>Hold Bill (3)</span>
              </button>
            </div>
          </div>

          {/* Barcode Search Lookup Input */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ffe09d]">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search perfume name, scan barcode, SKU, or olfactive notes..."
              className="w-full h-14 pl-12 pr-28 bg-[#0b0e12] text-[#e1e2e8] placeholder:text-[#999080] font-mono-data text-sm focus:outline-none focus:bg-[#191c20] border border-[#4d4639]/40"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
              <span className="px-2 py-1 bg-[#272a2e] text-[#999080] font-mono-data text-xs">
                F2 FOCUS
              </span>
            </div>
          </div>

          {/* Segment Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
            {[
              { id: 'All', label: 'All Fragrances (142)' },
              { id: 'Extraits', label: 'Extraits (100ml)' },
              { id: 'EDPs', label: 'EDPs (50ml/75ml)' },
              { id: 'Attars', label: 'Pure Attars & Oils' },
              { id: 'Discovery', label: 'Discovery Sets' },
              { id: 'Testers', label: 'Testers & Samples' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSegment(tab.id)}
                className={`px-4 py-2 text-xs font-mono-data uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeSegment === tab.id 
                    ? 'bg-[#ffe09d] text-[#251a00] font-bold shadow-sm' 
                    : 'bg-[#1d2024] text-[#d0c5b4] hover:bg-[#272a2e] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Product Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 flex-1">
            {filteredProducts.slice(0, 6).map(prod => {
              const variant = prod.variants[0];
              const isLow = variant.stock <= variant.low_stock_threshold;

              return (
                <div
                  key={prod.id}
                  className="group relative flex flex-col justify-between bg-[#191c20] p-4 border border-[#4d4639]/30 hover:border-[#ffe09d] transition-all"
                >
                  <div>
                    {/* Visual Flacon Specimen */}
                    <div className="relative w-full h-40 mb-3 overflow-hidden bg-[#0b0e12]">
                      <img
                        src={prod.images.main}
                        alt={prod.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 bg-[#0b0e12]/90 backdrop-blur-md">
                        <span className="w-1.5 h-1.5 bg-[#e9c176]"></span>
                        <span className="font-mono-data text-[10px] text-[#e1e2e8] uppercase">
                          {prod.families[0]}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#0b0e12] text-[#ffe09d] font-mono-data text-xs font-bold">
                        {variant.size_ml} ML
                      </div>
                    </div>

                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <span className="font-mono-data text-[10px] text-[#999080] uppercase tracking-wider block">
                          {variant.sku}
                        </span>
                        <h3 className="font-serif-luxury text-base font-bold text-[#e1e2e8] group-hover:text-[#ffe09d] transition-colors leading-tight">
                          {prod.name}
                        </h3>
                      </div>
                      <span className="font-mono-data text-sm font-bold text-[#ffe09d]">
                        Rs. {(variant.sale_price || variant.price).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#d0c5b4] mb-3 font-mono-data">
                      <span>Batch #{variant.barcode.slice(-4)}</span>
                      <span className={`px-1.5 py-0.2 text-[10px] ${
                        isLow ? 'bg-[#93000a] text-[#ffdad6]' : 'bg-[#272a2e] text-[#e9c176]'
                      }`}>
                        {isLow ? `Low Stock: ${variant.stock}` : `In Stock: ${variant.stock}`}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => addItemToBill(prod, variant)}
                    className="w-full py-2 bg-[#323539] hover:bg-[#ffe09d] hover:text-[#251a00] text-[#ffe09d] font-mono-data text-xs uppercase font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add To Bill</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer Quick Status */}
          <div className="mt-6 flex items-center justify-between py-2 text-[#d0c5b4] font-mono-data text-xs border-t border-[#4d4639]/30">
            <div className="flex items-center gap-4">
              <span>Catalog active: <strong>6 displayed of 142 items</strong></span>
              <span className="text-[#999080]">/</span>
              <span>Warehouse: <strong>Bonded Vault Dubai + London Boutique</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-[#e9c176]">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Stock levels live synchronized</span>
            </div>
          </div>
        </div>

        {/* Right Column (4 Cols): Active Bill & Settlement */}
        <div className="col-span-12 xl:col-span-4 bg-[#0b0e12] flex flex-col justify-between shadow-2xl">
          
          <div className="p-6 flex flex-col gap-4">
            
            {/* Cart Top Control Line */}
            <div className="flex items-center justify-between pb-3 border-b border-[#4d4639]/40">
              <div className="flex items-center gap-2">
                <span className="font-syne text-sm font-bold uppercase tracking-tight text-[#e1e2e8]">Active Bill</span>
                <span className="px-2 py-0.5 bg-[#e5c378] text-[#3f2e00] font-mono-data text-xs font-bold">
                  #INV-2024-884
                </span>
              </div>
              <button
                type="button"
                onClick={() => setBillItems([])}
                className="text-[#999080] hover:text-[#ffb4ab] text-xs font-mono-data uppercase"
              >
                Clear
              </button>
            </div>

            {/* VIP Patron Selection Plinth */}
            <div className="bg-[#191c20] p-4 border border-[#4d4639]/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#e9c176]">
                  <Diamond className="w-4 h-4" />
                  <span className="font-mono-data text-xs uppercase font-bold tracking-wider">VIP Patron Registered</span>
                </div>
                <button 
                  onClick={() => showToast('VIP patron registry active: Sheikh Tariq Al-Mansoor.', 'info')}
                  className="font-mono-data text-[10px] text-[#ffe09d] hover:underline uppercase"
                >
                  Change
                </button>
              </div>

              <div className="flex items-start justify-between text-xs font-mono-data">
                <div>
                  <div className="font-bold text-[#e1e2e8]">Sheikh Tariq Al-Mansoor</div>
                  <div className="text-[11px] text-[#999080]">CLIENT-VIP-9022 // +971 50 882 1940</div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 bg-[#604403] text-[#e9c176] text-[10px] uppercase font-bold">
                    Gold Tier
                  </span>
                  <div className="text-[10px] text-[#e9c176] mt-0.5">10% VIP Benefit Applied</div>
                </div>
              </div>
            </div>

            {/* Items Ledger Header */}
            <div className="flex items-center justify-between text-[#999080] font-mono-data text-[11px] uppercase pb-1">
              <span>Items Ledger ({billItems.length} lines)</span>
              <span>Tabular Value</span>
            </div>

            {/* Dynamic Items Container */}
            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {billItems.map(item => (
                <div key={item.id} className="bg-[#1d2024] p-3 border border-[#4d4639]/30 space-y-2">
                  <div className="flex items-start justify-between font-mono-data">
                    <div className="flex-1 pr-2">
                      <span className="text-[10px] text-[#999080] block">{item.sku}</span>
                      <span className="text-xs font-bold text-[#e1e2e8] block leading-tight">{item.name}</span>
                      <span className="text-[10px] text-[#999080]">{item.subtitle}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#ffe09d]">
                        Rs. {(item.unitPrice * item.quantity).toLocaleString()}
                      </div>
                      <span className="text-[10px] text-[#999080]">@ Rs. {item.unitPrice.toLocaleString()}/ea</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#4d4639]/20 font-mono-data">
                    <div className="flex items-center gap-1 bg-[#0b0e12] p-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.sku, -1)}
                        className="w-5 h-5 flex items-center justify-center text-[#999080] hover:text-white font-bold"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-[#e1e2e8]">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.sku, 1)}
                        className="w-5 h-5 flex items-center justify-center text-[#999080] hover:text-white font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.sku)}
                      className="text-[#999080] hover:text-[#ffb4ab] p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Complimentary VIP line item */}
              <div className="bg-[#272a2e] p-2.5 border border-[#4d4639]/30 flex items-center justify-between text-xs font-mono-data">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#e9c176]"></span>
                  <div>
                    <span className="font-bold text-[#e1e2e8] block">Luxury Velvet Pouch & 2ml Sample</span>
                    <span className="text-[10px] text-[#e9c176]">VIP Complimentary Allotment</span>
                  </div>
                </div>
                <span className="font-bold text-[#e9c176] uppercase text-[10px]">Free</span>
              </div>
            </div>
          </div>

          {/* Lower Financial Computations & Settlement */}
          <div className="p-6 bg-[#191c20] border-t border-[#4d4639]/40 space-y-4">
            
            {/* Computations */}
            <div className="space-y-1.5 font-mono-data text-xs">
              <div className="flex justify-between text-[#d0c5b4]">
                <span>Subtotal ({billItems.reduce((t, i) => t + i.quantity, 0)} items)</span>
                <span className="text-[#e1e2e8] font-bold">Rs. {subtotal.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between text-[#e9c176]">
                <span>VIP Client Discount (10%)</span>
                <span>- Rs. {vipDiscount.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between text-[#d0c5b4]">
                <span>Boutique Tax (5% GST)</span>
                <span>+ Rs. {tax.toLocaleString()}.50</span>
              </div>

              <div className="pt-2 mt-2 flex items-baseline justify-between bg-[#0b0e12] p-3 border border-[#4d4639]/30">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-[#999080]">Grand Total Payable</span>
                  <span className="text-[10px] text-[#999080]">Roundoff: 0.00</span>
                </div>
                <div className="text-xl font-syne font-bold text-[#ffe09d]">
                  Rs. {grandTotal.toLocaleString()}.50
                </div>
              </div>
            </div>

            {/* Tender Method */}
            <div className="space-y-1.5">
              <span className="font-mono-data text-[10px] uppercase text-[#999080] tracking-wider block">
                Select Tender Method
              </span>
              <div className="grid grid-cols-4 gap-1.5 font-mono-data text-[10px]">
                {[
                  { id: 'Credit Card', label: 'Credit Card', icon: CreditCard },
                  { id: 'Cash', label: 'Cash', icon: Banknote },
                  { id: 'Wire / Bank', label: 'Wire / Bank', icon: Building2 },
                  { id: 'UPI / App', label: 'UPI / App', icon: QrCode }
                ].map(tender => {
                  const Icon = tender.icon;
                  return (
                    <button
                      key={tender.id}
                      type="button"
                      onClick={() => setTenderMethod(tender.id as any)}
                      className={`p-2 border uppercase flex flex-col items-center justify-center gap-1 transition-all ${
                        tenderMethod === tender.id 
                          ? 'bg-[#ffe09d] text-[#251a00] font-bold border-[#ffe09d]' 
                          : 'bg-[#1d2024] text-[#d0c5b4] border-[#4d4639]/30 hover:border-[#ffe09d]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tender.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Complete Sale Dispatch Button */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                disabled={isProcessing || billItems.length === 0}
                onClick={handleCompleteSale}
                className="w-full py-4 bg-[#ffe09d] text-[#251a00] hover:bg-[#e5c378] active:scale-[0.99] transition-all flex flex-col items-center justify-center shadow-lg group font-syne font-bold disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2 text-xs uppercase">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Reconciling Vault Inventory Across Cellars...</span>
                  </span>
                ) : saleSuccessInvoice ? (
                  <span className="flex items-center gap-2 text-xs uppercase text-[#2F6B4F]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sale Finalized & Invoice Dispatched!</span>
                  </span>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-sm uppercase tracking-tight">
                      <span>Complete Sale & Deduct Inventory</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                    <span className="font-mono-data text-[10px] uppercase font-normal opacity-85">
                      Auto-generates Invoice #INV-2024-884 & updates stock records
                    </span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-2 font-mono-data text-xs">
                <button
                  type="button"
                  onClick={() => showToast('Thermal receipt printing simulated.', 'info')}
                  className="py-2 bg-[#1d2024] hover:bg-[#272a2e] text-[#d0c5b4] hover:text-white transition-colors uppercase flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-[#999080]" />
                  <span>Thermal Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Invoice emailed to tariq.almansoor@royalestate.ae.', 'info')}
                  className="py-2 bg-[#1d2024] hover:bg-[#272a2e] text-[#d0c5b4] hover:text-white transition-colors uppercase flex items-center justify-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[#999080]" />
                  <span>Email Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
