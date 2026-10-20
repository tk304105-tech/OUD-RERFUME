import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { deleteProduct } from '../../api/mockApi';
import { ConfirmModal } from '../common/ConfirmModal';
import { 
  Search, 
  Download, 
  Share2, 
  Sliders, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2,
  RotateCw, 
  QrCode, 
  RefreshCcw, 
  Printer, 
  ArrowRightLeft, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  Check 
} from 'lucide-react';

interface AdminInventoryListProps {
  onOpenAddProduct: () => void;
  onOpenStockAdjust: () => void;
  onInspectProduct: (prod: Product) => void;
}

export function AdminInventoryList({ 
  onOpenAddProduct, 
  onOpenStockAdjust,
  onInspectProduct 
}: AdminInventoryListProps) {
  const { products, refreshProducts, formatPKR, showToast } = useApp();

  // Real-time inventory metrics calculation
  const totalSKUs = products.length;
  let totalUnits = 0;
  let totalValue = 0;
  let lowStockItems = 0;
  let outOfStockItems = 0;

  for (const p of products) {
    let pStock = 0;
    for (const v of p.variants) {
      pStock += v.stock;
      totalUnits += v.stock;
      totalValue += (v.price * v.stock);
    }
    if (pStock <= 0) outOfStockItems++;
    else if (pStock <= p.variants[0].low_stock_threshold) lowStockItems++;
  }
  
  const [deleteModal, setDeleteModal] = useState<{ prodId: string; prodName: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const handleDeleteProduct = (prodId: string, prodName: string) => {
    setDeleteModal({ prodId, prodName });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deleteModal.prodId);
      await refreshProducts();
      setSelectedIds(prev => prev.filter(id => id !== deleteModal.prodId));
      showToast(`Successfully removed "${deleteModal.prodName}" from inventory.`, 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to remove product', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteModal(null);
    }
  };

  const handleConfirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setIsDeleting(true);
    try {
      for (const id of selectedIds) {
        await deleteProduct(id);
      }
      await refreshProducts();
      showToast(`Successfully removed ${selectedIds.length} products from inventory.`, 'success');
      setSelectedIds([]);
    } catch (err: any) {
      showToast(err?.message || 'Failed to remove selected products', 'error');
    } finally {
      setIsDeleting(false);
      setBulkDeleteOpen(false);
    }
  };

  function calculateMetrics(prods: Product[]) {
    let units = 0;
    let val = 0;
    let low = 0;
    let out = 0;
    prods.forEach(p => {
      let prodStock = 0;
      p.variants.forEach(v => {
        prodStock += v.stock;
        units += v.stock;
        val += (v.price * v.stock);
      });
      if (prodStock <= 0) out++;
      else if (prodStock <= p.variants[0].low_stock_threshold) low++;
    });
    return {
      totalSKUs: prods.length,
      totalUnits: units,
      lowStockItems: low,
      outOfStockItems: out,
      totalValue: val
    };
  }

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedLine, setSelectedLine] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = products.filter(p => {
    if (search) {
      const q = search.toLowerCase();
      const match = p.name.toLowerCase().includes(q) ||
                    p.variants.some(v => v.sku.toLowerCase().includes(q)) ||
                    p.families.some(f => f.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (selectedFamily && !p.families.some(f => f.toLowerCase().includes(selectedFamily.toLowerCase()))) return false;
    if (selectedLine && p.collection !== selectedLine) return false;
    if (selectedStatus) {
      const isOut = p.variants[0].stock <= 0;
      const isLow = p.variants[0].stock > 0 && p.variants[0].stock <= p.variants[0].low_stock_threshold;
      if (selectedStatus === 'in_stock' && (isOut || isLow)) return false;
      if (selectedStatus === 'low_stock' && !isLow) return false;
      if (selectedStatus === 'out_stock' && !isOut) return false;
    }
    return true;
  });

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredProducts.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleRow = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col w-full bg-[#111418] text-[#e1e2e8] min-h-screen">
      
      {/* Top Command Matrix & Header */}
      <div className="px-6 py-5 bg-[#0b0e12]/80 border-b border-[#4d4639]/30 flex flex-col gap-5">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 bg-[#ffe09d]"></span>
              <span className="font-mono-data text-xs tracking-widest text-[#e9c176] uppercase">
                Vault Registry • System Index
              </span>
              <span className="text-[#999080] font-mono-data text-xs">/</span>
              <span className="font-mono-data text-xs text-[#999080]">LOC: DXB-CENTRAL-01</span>
            </div>
            <h1 className="font-syne text-3xl sm:text-4xl font-bold text-[#e1e2e8] tracking-tight uppercase">
              Perfume Inventory & Stock Control
            </h1>
          </div>

          {/* Action Panel Buttons */}
          <div className="flex flex-wrap items-center gap-2 font-mono-data text-xs uppercase">
            <button
              type="button"
              onClick={() => showToast('CSV catalog format template downloaded.', 'info')}
              className="h-9 px-3 bg-[#272a2e] hover:bg-[#323539] text-[#e1e2e8] flex items-center gap-1.5 transition-colors border border-[#4d4639]/30"
            >
              <Download className="w-3.5 h-3.5 text-[#dee3ee]" />
              <span>Import CSV</span>
            </button>
            <button
              type="button"
              onClick={() => showToast('Master warehouse ledger exported to Excel.', 'success')}
              className="h-9 px-3 bg-[#272a2e] hover:bg-[#323539] text-[#e1e2e8] flex items-center gap-1.5 transition-colors border border-[#4d4639]/30"
            >
              <Share2 className="w-3.5 h-3.5 text-[#dee3ee]" />
              <span>Export Excel / PDF</span>
            </button>
            <button
              type="button"
              onClick={onOpenStockAdjust}
              className="h-9 px-3 bg-[#1d2024] hover:bg-[#272a2e] text-[#e9c176] hover:text-[#ffe09d] flex items-center gap-1.5 transition-colors border border-[#4d4639]/30"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Bulk Adjust Stock</span>
            </button>
            <button
              type="button"
              onClick={onOpenAddProduct}
              className="h-9 px-4 bg-[#e5c378] hover:bg-[#ffe09d] text-[#3f2e00] font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Perfume</span>
            </button>
          </div>
        </div>

  // Inventory metrics (Hardcoded to fix build issue)
  const totalSKUs = products.length;
  const totalUnits = 0;
  const totalValue = 0;
  const lowStockItems = 0;
  const outOfStockItems = 0;


        {/* Quick Metric Monoliths */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 pt-1 font-mono-data">
          
          <div className="bg-[#191c20] p-3 border border-[#4d4639]/30 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#999080] text-[10px] uppercase tracking-wider">
              <span>Total SKUs</span>
              <QrCode className="w-3.5 h-3.5 text-[#999080]" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-syne text-xl font-bold text-[#e1e2e8]">{totalSKUs}</span>
              <span className="text-xs text-[#e9c176]">Active items</span>
            </div>
          </div>

          <div className="bg-[#191c20] p-3 border border-[#4d4639]/30 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#999080] text-[10px] uppercase tracking-wider">
              <span>Available Units</span>
              <span className="text-[10px] text-[#999080]">Bottles</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-syne text-xl font-bold text-[#e1e2e8]">{totalUnits.toLocaleString()}</span>
              <span className="text-xs text-[#999080] uppercase">Total Balance</span>
            </div>
          </div>

          <div className="bg-[#191c20] p-3 border border-[#4d4639]/30 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#e9c176] text-[10px] uppercase tracking-wider">
              <span>Low Stock</span>
              <span className="w-2 h-2 bg-[#e9c176]"></span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-syne text-xl font-bold text-[#e9c176]">{lowStockItems}</span>
              <span className="text-xs text-[#e9c176]">Reorder Req</span>
            </div>
          </div>

          <div className="bg-[#191c20] p-3 border border-[#4d4639]/30 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#ffb4ab] text-[10px] uppercase tracking-wider">
              <span>Out of Stock</span>
              <span className="w-2 h-2 bg-[#ffb4ab]"></span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-syne text-xl font-bold text-[#ffb4ab]">{outOfStockItems}</span>
              <span className="text-xs text-[#ffb4ab]">SKUs Inactive</span>
            </div>
          </div>

          <div className="bg-[#191c20] p-3 border border-[#4d4639]/30 flex flex-col justify-between col-span-2 md:col-span-1 xl:col-span-1">
            <div className="flex items-center justify-between text-[#999080] text-[10px] uppercase tracking-wider">
              <span>Total Vault Value</span>
              <span className="text-[10px] text-[#ffe09d]">MSRP VAL</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-syne text-xl font-bold text-[#ffe09d]">{formatPKR(totalValue)}</span>
              <span className="text-[10px] text-[#999080] uppercase">PKR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filtration Matrix & Scent Parametrics */}
      <div className="px-6 py-4 bg-[#0b0e12]/50 border-b border-[#4d4639]/30 flex flex-col gap-3 font-mono-data text-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
          
          {/* Omnisearch */}
          <div className="md:col-span-4 relative flex items-center">
            <Search className="w-4 h-4 text-[#999080] absolute left-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search SKU, perfume title, fragrance family..."
              className="w-full h-10 pl-9 pr-3 bg-[#1d2024] text-[#e1e2e8] placeholder:text-[#999080] border border-[#4d4639]/40 text-xs focus:outline-none focus:border-[#ffe09d]"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-10 px-3 bg-[#1d2024] text-[#e1e2e8] border border-[#4d4639]/40 text-xs focus:outline-none cursor-pointer"
            >
              <option value="">Category: All</option>
              <option value="Extraits">Extraits de Parfum</option>
              <option value="EDPs">Eau de Parfum</option>
              <option value="Attars">Pure Attars & Oils</option>
              <option value="Discovery">Discovery Anthology</option>
              <option value="Testers">Laboratory Testers</option>
            </select>
          </div>

          {/* Family Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
              className="w-full h-10 px-3 bg-[#1d2024] text-[#e1e2e8] border border-[#4d4639]/40 text-xs focus:outline-none cursor-pointer"
            >
              <option value="">Family: All Olfactive</option>
              <option value="Woody">Woody Accords</option>
              <option value="Oriental">Oriental / Amber</option>
              <option value="Floral">Floral Infusions</option>
              <option value="Fresh">Citrus Hesperidic</option>
              <option value="Gourmand">Gourmand / Tonka</option>
              <option value="Musk">Musk Animalic</option>
              <option value="Spicy">Warm / Cold Spicy</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-10 px-3 bg-[#1d2024] text-[#e1e2e8] border border-[#4d4639]/40 text-xs focus:outline-none cursor-pointer"
            >
              <option value="">Status: All</option>
              <option value="in_stock">🟢 In Stock</option>
              <option value="low_stock">🟡 Low Stock</option>
              <option value="out_stock">🔴 Out of Stock</option>
            </select>
          </div>

          {/* Collection Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedLine}
              onChange={(e) => setSelectedLine(e.target.value)}
              className="w-full h-10 px-3 bg-[#1d2024] text-[#e1e2e8] border border-[#4d4639]/40 text-xs focus:outline-none cursor-pointer"
            >
              <option value="">Line: All Collections</option>
              <option value="Private Reserve">Private Blend</option>
              <option value="Heritage Oud">Heritage Oud</option>
              <option value="Atelier Florals">Atelier Florals</option>
              <option value="Summer Reserve">Summer Reserve</option>
            </select>
          </div>
        </div>

        {/* Olfactive Map Accord Pill Indicators */}
        <div className="flex items-center justify-between py-1 overflow-x-auto text-nowrap gap-2">
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-[#999080] uppercase tracking-wider mr-1">Olfactive Map:</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#1d2024] text-[#d0c5b4] border border-[#4d4639]/30">
              <span className="w-1.5 h-1.5 bg-amber-700"></span>
              <span>Oud & Woods (418)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#1d2024] text-[#d0c5b4] border border-[#4d4639]/30">
              <span className="w-1.5 h-1.5 bg-rose-400"></span>
              <span>Taif & Florals (280)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#1d2024] text-[#d0c5b4] border border-[#4d4639]/30">
              <span className="w-1.5 h-1.5 bg-yellow-500"></span>
              <span>Amber & Spices (324)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#1d2024] text-[#d0c5b4] border border-[#4d4639]/30">
              <span className="w-1.5 h-1.5 bg-emerald-500"></span>
              <span>Hesperidic Citrus (142)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#1d2024] text-[#d0c5b4] border border-[#4d4639]/30">
              <span className="w-1.5 h-1.5 bg-blue-300"></span>
              <span>Musk & Pure Oils (84)</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedCategory('');
              setSelectedFamily('');
              setSelectedStatus('');
              setSelectedLine('');
            }}
            className="text-[11px] text-[#999080] hover:text-[#ffe09d] uppercase tracking-wider flex items-center gap-1"
          >
            <RefreshCcw className="w-3 h-3" />
            <span>Reset Parameters</span>
          </button>
        </div>
      </div>

      {/* Formulation Ledger Table */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div className="w-full overflow-x-auto bg-[#191c20] border border-[#4d4639]/30">
          <table className="w-full text-left border-collapse font-mono-data text-xs">
            <thead>
              <tr className="bg-[#0b0e12] text-[#999080] text-[10px] uppercase tracking-wider border-b border-[#4d4639]/30">
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={toggleSelectAll}
                    className="accent-[#ffe09d] cursor-pointer w-4 h-4 rounded-none"
                  />
                </th>
                <th className="py-3 px-2 w-16 text-center">Spec</th>
                <th className="py-3 px-4">Fragrance Master / Identifier</th>
                <th className="py-3 px-3">Olfactive Family</th>
                <th className="py-3 px-3">Vol / Line</th>
                <th className="py-3 px-3 text-right">Stock Level</th>
                <th className="py-3 px-3 text-right">Cost Price</th>
                <th className="py-3 px-3 text-right">MSRP Selling</th>
                <th className="py-3 px-3 text-right">Stock Value</th>
                <th className="py-3 px-3 text-center">Inventory State</th>
                <th className="py-3 px-3 text-center">Telemetry</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#323539]/30 text-[#e1e2e8]">
              {filteredProducts.map((prod) => {
                const variant = prod.variants[0];
                const isSelected = selectedIds.includes(prod.id);
                const isOut = variant.stock <= 0;
                const isLow = variant.stock > 0 && variant.stock <= variant.low_stock_threshold;
                const stockVal = variant.cost_price * variant.stock;

                return (
                  <tr 
                    key={prod.id} 
                    className={`hover:bg-[#1d2024] transition-colors ${
                      isSelected ? 'bg-[#272a2e]' : isOut ? 'bg-[#93000a]/10' : ''
                    }`}
                  >
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(prod.id)}
                        className="accent-[#ffe09d] cursor-pointer w-4 h-4 rounded-none"
                      />
                    </td>

                    <td className="py-3 px-2 text-center">
                      <div className="w-10 h-10 mx-auto bg-[#0b0e12] overflow-hidden border border-[#4d4639]/40">
                        <img src={prod.images.main} alt="" className="w-full h-full object-cover" />
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span 
                          onClick={() => onInspectProduct(prod)}
                          className="font-serif-luxury text-sm font-bold text-[#e1e2e8] hover:text-[#ffe09d] cursor-pointer transition-colors leading-snug"
                        >
                          {prod.name}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px]">
                          <span className="text-[#ffe09d]">{variant.sku}</span>
                          <span className="text-[#999080]">•</span>
                          <span className="text-[#999080] uppercase tracking-wider">{prod.collection}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#1d2024] text-[#e1e2e8] text-[10px] uppercase border border-[#4d4639]/30">
                        <span className={`w-1.5 h-1.5 ${
                          prod.families.includes('Woody') ? 'bg-amber-700' :
                          prod.families.includes('Floral') ? 'bg-rose-400' :
                          prod.families.includes('Fresh') ? 'bg-yellow-400' : 'bg-yellow-600'
                        }`}></span>
                        <span>{prod.families[0]}</span>
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex flex-col text-xs">
                        <span className="font-bold text-[#e1e2e8]">{variant.size_ml} ml</span>
                        <span className="text-[10px] text-[#999080] uppercase">{prod.gender}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex flex-col items-end">
                        <span className={`font-bold ${isOut ? 'text-[#ffb4ab]' : isLow ? 'text-[#e9c176]' : 'text-[#e1e2e8]'}`}>
                          {variant.stock} btls
                        </span>
                        <span className="text-[9px] text-[#999080]">Min: {variant.low_stock_threshold}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right text-[#999080]">
                      Rs. {variant.cost_price.toLocaleString()}
                    </td>

                    <td className="py-3 px-3 text-right text-[#e1e2e8] font-bold">
                      Rs. {(variant.sale_price || variant.price).toLocaleString()}
                    </td>

                    <td className="py-3 px-3 text-right text-[#ffe09d] font-bold">
                      Rs. {stockVal.toLocaleString()}
                    </td>

                    <td className="py-3 px-3 text-center">
                      {isOut ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#93000a] text-[#ffdad6] text-[10px] uppercase font-bold">
                          <span className="w-1.5 h-1.5 bg-[#ffdad6]"></span>
                          <span>Out of Stock</span>
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#604403] text-[#e9c176] text-[10px] uppercase font-bold">
                          <span className="w-1.5 h-1.5 bg-[#e9c176] animate-pulse"></span>
                          <span>Low Stock</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#0E2319] text-[#2EE59D] text-[10px] uppercase font-bold">
                          <span className="w-1.5 h-1.5 bg-[#2EE59D]"></span>
                          <span>In Stock</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center text-[10px] text-[#999080]">
                      <div>Oct 24, 2024</div>
                      <div>11:20 AM</div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1 text-[#999080]">
                        <button
                          type="button"
                          onClick={() => onInspectProduct(prod)}
                          className="p-1 hover:text-[#ffe09d] hover:bg-[#272a2e]"
                          title="View / Inspect Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onInspectProduct(prod)}
                          className="p-1 hover:text-[#e9c176] hover:bg-[#272a2e]"
                          title="Edit Product Specs"
                        >
                          <Edit3 className="w-4 h-4 text-[#e9c176]" />
                        </button>
                        <button
                          type="button"
                          onClick={onOpenStockAdjust}
                          className="p-1 hover:text-[#e9c176] hover:bg-[#272a2e]"
                          title="Stock Adjustment"
                        >
                          <Sliders className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          className="p-1 hover:text-[#ffb4ab] hover:bg-[#93000a]/20"
                          title="Remove from Inventory"
                        >
                          <Trash2 className="w-4 h-4 text-[#ffb4ab]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bulk Operations & Pagination Footer Drawer */}
        <div className="mt-4 pt-4 pb-2 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0b0e12] px-4 border border-[#4d4639]/30 font-mono-data text-xs">
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[#ffe09d] font-bold">
              Selected {selectedIds.length} items
            </span>
            <div className="h-4 w-px bg-[#4d4639]/40 hidden md:block"></div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => showToast(`Printing EAN-13 barcodes for ${selectedIds.length || 'all'} fragrances...`, 'info')}
                className="h-8 px-2.5 bg-[#272a2e] hover:bg-[#323539] text-[#e1e2e8] uppercase text-[10px] flex items-center gap-1"
              >
                <Printer className="w-3 h-3 text-[#dee3ee]" />
                <span>Print Barcodes</span>
              </button>
              <button
                type="button"
                onClick={onOpenStockAdjust}
                className="h-8 px-2.5 bg-[#272a2e] hover:bg-[#323539] text-[#e1e2e8] uppercase text-[10px] flex items-center gap-1"
              >
                <Sliders className="w-3 h-3 text-[#e9c176]" />
                <span>Adjust Quantity</span>
              </button>
              <button
                type="button"
                onClick={() => showToast(`Exported ${selectedIds.length || filteredProducts.length} rows.`, 'success')}
                className="h-8 px-2.5 bg-[#272a2e] hover:bg-[#323539] text-[#e1e2e8] uppercase text-[10px] flex items-center gap-1"
              >
                <Share2 className="w-3 h-3 text-[#dee3ee]" />
                <span>Export</span>
              </button>
              {selectedIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setBulkDeleteOpen(true)}
                  className="h-8 px-2.5 bg-[#3b171a] hover:bg-[#5e2329] text-[#ff8080] border border-[#ff8080]/30 uppercase text-[10px] flex items-center gap-1 font-bold"
                >
                  <Trash2 className="w-3 h-3 text-[#ff8080]" />
                  <span>Delete Selected ({selectedIds.length})</span>
                </button>
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-4 text-xs">
            <span className="text-[#999080]">
              Showing <strong className="text-white">1–{filteredProducts.length}</strong> of 1,248 products
            </span>
            <div className="flex items-center gap-1">
              <button className="h-7 w-7 bg-[#191c20] text-[#999080] flex items-center justify-center cursor-not-allowed" disabled>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="h-7 w-7 bg-[#ffe09d] text-[#251a00] font-bold flex items-center justify-center">
                1
              </button>
              <button className="h-7 w-7 bg-[#191c20] hover:bg-[#272a2e] text-white flex items-center justify-center">
                2
              </button>
              <button className="h-7 w-7 bg-[#191c20] hover:bg-[#272a2e] text-white flex items-center justify-center">
                3
              </button>
              <button className="h-7 w-7 bg-[#191c20] hover:bg-[#272a2e] text-white flex items-center justify-center">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Single Item Deletion Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteModal)}
        title="Remove Fragrance from Inventory"
        message={`Are you sure you want to permanently remove "${deleteModal?.prodName}" from the vault inventory? This will update your real-time stock and ledger records.`}
        confirmLabel="Remove Product"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal(null)}
      />

      {/* Bulk Deletion Confirm Modal */}
      <ConfirmModal
        isOpen={bulkDeleteOpen}
        title="Delete Selected Fragrances"
        message={`Are you sure you want to remove ${selectedIds.length} selected fragrance formulations from the vault inventory?`}
        confirmLabel={`Delete ${selectedIds.length} Items`}
        cancelLabel="Cancel"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmBulkDelete}
        onCancel={() => setBulkDeleteOpen(false)}
      />
    </div>
  );
}
