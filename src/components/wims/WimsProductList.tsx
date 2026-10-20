import React, { useState, useMemo } from 'react';
import { 
  Boxes, 
  Search, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  ArrowUpDown, 
  Download, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  AlertOctagon,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Package
} from 'lucide-react';
import { WimsProduct, WimsUser } from '../../services/supabase';

interface WimsProductListProps {
  products: WimsProduct[];
  currentUser: WimsUser | null;
  onSelectProduct: (p: WimsProduct) => void;
  onEditProduct: (p: WimsProduct) => void;
  onDeleteProduct: (p: WimsProduct) => void;
  onOpenAddProduct: () => void;
  onOpenInbound: (p?: WimsProduct) => void;
  onOpenOutbound: (p?: WimsProduct) => void;
}

export function WimsProductList({
  products,
  currentUser,
  onSelectProduct,
  onEditProduct,
  onDeleteProduct,
  onOpenAddProduct,
  onOpenInbound,
  onOpenOutbound
}: WimsProductListProps) {
  const isAdmin = currentUser?.role === 'ADMIN';

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Sorting
  const [sortField, setSortField] = useState<'name' | 'sku' | 'current_stock' | 'selling_price' | 'status'>('name');
  const [sortAsc, setSortAsc] = useState(true);

  // Pagination
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Unique categories
  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (p.archived) return false;

      const matchesSearch = 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.warehouse_location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    }).sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (typeof valA === 'string') {
        const comp = valA.localeCompare(valB);
        return sortAsc ? comp : -comp;
      }
      return sortAsc ? (valA - valB) : (valB - valA);
    });
  }, [products, searchTerm, categoryFilter, statusFilter, sortField, sortAsc]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Name", "SKU", "Category", "Current Stock", "Min Stock", "Max Stock", "Unit Cost", "Selling Price", "Warehouse Location", "Status"];
    const rows = filteredProducts.map(p => [
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.sku}"`,
      `"${p.category}"`,
      p.current_stock,
      p.minimum_stock,
      p.maximum_stock,
      p.purchase_price,
      p.selling_price,
      `"${p.warehouse_location}"`,
      `"${p.status}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", `wims_inventory_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 text-[#111111] max-w-7xl mx-auto">
      
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E0D4]">
        <div>
          <div className="flex items-center gap-2 text-xs font-syne text-[#8A6D2F] uppercase tracking-wider font-bold">
            <Boxes className="w-4 h-4 text-[#8A6D2F]" />
            <span>Product Master Catalog</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#111111] mt-1">
            Inventory Registry & Stock Levels
          </h1>
          <p className="text-xs font-mono-data text-[#6B6B6B] mt-1">
            Viewing {filteredProducts.length} of {products.length} products across storage vaults
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 bg-[#FFFFFF] hover:bg-[#F3EFE6] border border-[#E8E0D4] text-xs font-mono-data text-[#111111] rounded flex items-center gap-1.5 transition-colors font-bold shadow-sm"
          >
            <Download className="w-4 h-4 text-[#8A6D2F]" />
            <span>Export CSV</span>
          </button>

          {isAdmin && (
            <button
              onClick={onOpenAddProduct}
              className="px-4 py-2.5 bg-[#111111] hover:bg-[#8A6D2F] text-[#FFE09D] text-xs font-syne font-bold uppercase tracking-wider rounded flex items-center gap-1.5 shadow-md transition-all"
            >
              <Plus className="w-4 h-4 text-[#FFE09D]" />
              <span>Add Product</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 bg-[#FFFFFF] border border-[#E8E0D4] shadow-sm rounded space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, SKU, supplier or storage bay..."
              className="w-full h-10 pl-9 pr-3 bg-[#F8F5EF] border border-[#E8E0D4] text-xs font-mono-data text-[#111111] rounded focus:outline-none focus:border-[#8A6D2F]"
            />
          </div>

          {/* Category Dropdown Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            <div className="flex items-center gap-1 text-[11px] font-syne uppercase text-[#6B6B6B] font-bold whitespace-nowrap">
              <Filter className="w-3.5 h-3.5 text-[#8A6D2F]" />
              <span>Category:</span>
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-xs font-mono-data text-[#111111] rounded focus:outline-none cursor-pointer font-bold"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-xs font-mono-data text-[#111111] rounded focus:outline-none cursor-pointer font-bold"
            >
              <option value="All">All Statuses</option>
              <option value="IN STOCK">In Stock</option>
              <option value="LOW STOCK">Low Stock</option>
              <option value="OUT OF STOCK">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Table Card */}
      <div className="bg-[#FFFFFF] border border-[#E8E0D4] rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-data">
            <thead className="bg-[#F8F5EF] text-[#6B6B6B] uppercase text-[10px] font-syne border-b border-[#E8E0D4]">
              <tr>
                <th className="py-3 px-4 font-bold cursor-pointer hover:text-[#111111]" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    <span>Product Spec</span>
                    <ArrowUpDown className="w-3 h-3 text-[#8A6D2F]" />
                  </div>
                </th>
                <th className="py-3 px-3 font-bold cursor-pointer hover:text-[#111111]" onClick={() => handleSort('sku')}>
                  <div className="flex items-center gap-1">
                    <span>SKU</span>
                    <ArrowUpDown className="w-3 h-3 text-[#8A6D2F]" />
                  </div>
                </th>
                <th className="py-3 px-3 font-bold">Category</th>
                <th className="py-3 px-3 text-right font-bold cursor-pointer hover:text-[#111111]" onClick={() => handleSort('current_stock')}>
                  <div className="flex items-center justify-end gap-1">
                    <span>Stock Level</span>
                    <ArrowUpDown className="w-3 h-3 text-[#8A6D2F]" />
                  </div>
                </th>
                <th className="py-3 px-3 text-right font-bold cursor-pointer hover:text-[#111111]" onClick={() => handleSort('selling_price')}>
                  <div className="flex items-center justify-end gap-1">
                    <span>Price (PKR)</span>
                    <ArrowUpDown className="w-3 h-3 text-[#8A6D2F]" />
                  </div>
                </th>
                <th className="py-3 px-3 font-bold cursor-pointer hover:text-[#111111]" onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-[#8A6D2F]" />
                  </div>
                </th>
                <th className="py-3 px-3 font-bold">Storage Bay</th>
                <th className="py-3 px-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0D4]">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-[#6B6B6B]">
                    <Package className="w-10 h-10 mx-auto mb-3 text-[#8A6D2F] opacity-60" />
                    <div className="font-serif-luxury text-base font-bold text-[#111111]">No product specifications found</div>
                    <div className="text-xs text-[#6B6B6B] mt-1 font-mono-data">Try adjusting your search terms or filter parameters.</div>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map(prod => {
                  let badge = 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]';
                  if (prod.status === 'LOW STOCK') badge = 'bg-[#FFF3E0] text-[#E65100] border-[#FFE0B2]';
                  if (prod.status === 'OUT OF STOCK') badge = 'bg-[#FFEBEE] text-[#B33939] border-[#FFCDD2]';

                  return (
                    <tr key={prod.id} className="hover:bg-[#FBF9F5] transition-colors">
                      <td className="py-4 px-4">
                        <button
                          onClick={() => onSelectProduct(prod)}
                          className="font-bold text-[#111111] hover:text-[#8A6D2F] text-left block font-serif-luxury text-sm"
                        >
                          {prod.name}
                        </button>
                        <span className="text-[10px] text-[#6B6B6B] font-mono-data">{prod.supplier}</span>
                      </td>

                      <td className="py-4 px-3 font-bold text-[#8A6D2F]">
                        {prod.sku}
                      </td>

                      <td className="py-4 px-3 text-[#111111] font-mono-data">
                        {prod.category}
                      </td>

                      {/* Stock Level */}
                      <td className="py-4 px-3 text-right font-bold text-sm">
                        <span className={prod.current_stock <= prod.minimum_stock ? 'text-[#B33939]' : 'text-[#2E7D32]'}>
                          {prod.current_stock}
                        </span>
                        <span className="text-[10px] text-[#6B6B6B] ml-1 font-normal">/ min {prod.minimum_stock}</span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-3 text-right font-bold text-[#111111]">
                        ₨ {prod.selling_price.toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-3">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${badge}`}>
                          {prod.status}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-3 text-[#6B6B6B] text-[11px] font-bold">
                        {prod.warehouse_location}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectProduct(prod)}
                            className="p-1.5 text-[#111111] hover:text-[#8A6D2F] bg-[#FFFFFF] border border-[#E8E0D4] rounded hover:border-[#8A6D2F] transition-colors"
                            title="View Product Attributes & Movement History"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {isAdmin && (
                            <button
                              onClick={() => onEditProduct(prod)}
                              className="p-1.5 text-[#8A6D2F] hover:bg-[#F3EFE6] bg-[#FFFFFF] border border-[#E8E0D4] rounded transition-colors"
                              title="Edit Product Specification"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}

                          {isAdmin && (
                            <button
                              onClick={() => onDeleteProduct(prod)}
                              className="p-1.5 text-[#B33939] hover:bg-[#FFF2F2] bg-[#FFFFFF] border border-[#E8E0D4] rounded transition-colors"
                              title="Soft-Delete (Archive)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-[#F8F5EF] border-t border-[#E8E0D4] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono-data text-[#6B6B6B]">
          <div className="flex items-center gap-3">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="h-8 px-2 bg-[#FFFFFF] border border-[#E8E0D4] text-[#111111] rounded focus:outline-none cursor-pointer font-bold"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="font-bold text-[#111111]">
              Showing {filteredProducts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredProducts.length)} of {filteredProducts.length} entries
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 bg-[#FFFFFF] border border-[#E8E0D4] text-[#111111] rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F3EFE6]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-2 text-[#111111] font-bold">
              Page <strong className="text-[#111111]">{currentPage}</strong> of <strong className="text-[#111111]">{totalPages}</strong>
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 bg-[#FFFFFF] border border-[#E8E0D4] text-[#111111] rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F3EFE6]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
