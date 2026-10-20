import React, { useState, useEffect } from 'react';
import { X, Plus, Check, Boxes, AlertCircle } from 'lucide-react';
import { WimsProduct, wimsDb } from '../../services/supabase';

interface WimsAddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: WimsProduct | null;
  onSuccess: (savedProduct: WimsProduct) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export function WimsAddEditModal({
  isOpen,
  onClose,
  productToEdit,
  onSuccess,
  showToast
}: WimsAddEditModalProps) {
  const categories = wimsDb.getCategories();
  const existingProducts = wimsDb.getProducts(true);

  // Form Fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Finished Fragrances');
  const [description, setDescription] = useState('');
  const [supplier, setSupplier] = useState('');
  const [purchasePrice, setPurchasePrice] = useState<number>(3000);
  const [sellingPrice, setSellingPrice] = useState<number>(7500);
  const [currentStock, setCurrentStock] = useState<number>(50);
  const [minimumStock, setMinimumStock] = useState<number>(15);
  const [maximumStock, setMaximumStock] = useState<number>(300);
  const [warehouseLocation, setWarehouseLocation] = useState('Vault Bay A-01');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  // Reset or fill when modal opens
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setSku(productToEdit.sku);
      setCategory(productToEdit.category);
      setDescription(productToEdit.description || '');
      setSupplier(productToEdit.supplier || '');
      setPurchasePrice(productToEdit.purchase_price);
      setSellingPrice(productToEdit.selling_price);
      setCurrentStock(productToEdit.current_stock);
      setMinimumStock(productToEdit.minimum_stock);
      setMaximumStock(productToEdit.maximum_stock);
      setWarehouseLocation(productToEdit.warehouse_location);
      setImageUrl(productToEdit.image_url || '');
    } else {
      resetFields();
    }
    setError('');
  }, [productToEdit, isOpen]);

  const resetFields = () => {
    setName('');
    setSku(`WIMS-${Math.floor(1000 + Math.random() * 9000)}`);
    setCategory('Finished Fragrances');
    setDescription('');
    setSupplier('Laboratoires Grasse Essences S.A.');
    setPurchasePrice(2800);
    setSellingPrice(6500);
    setCurrentStock(50);
    setMinimumStock(15);
    setMaximumStock(400);
    setWarehouseLocation('Vault Bay A-02');
    setImageUrl('https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80');
    setError('');
  };

  if (!isOpen) return null;

  const validate = (): boolean => {
    if (!name.trim()) {
      setError('Product Name is required.');
      return false;
    }
    if (!sku.trim()) {
      setError('Unique SKU code is required.');
      return false;
    }

    // Check unique SKU
    const cleanSku = sku.trim().toUpperCase();
    const isDuplicate = existingProducts.some(p => 
      p.sku.toUpperCase() === cleanSku && (!productToEdit || p.id !== productToEdit.id)
    );

    if (isDuplicate) {
      setError(`SKU "${cleanSku}" already exists. SKU must be globally unique across all products.`);
      return false;
    }

    if (purchasePrice < 0 || sellingPrice < 0) {
      setError('Prices cannot be negative values.');
      return false;
    }

    if (currentStock < 0 || minimumStock < 0 || maximumStock < 0) {
      setError('Stock counts cannot be negative.');
      return false;
    }

    return true;
  };

  const handleSave = (addAnother: boolean = false) => {
    if (!validate()) return;

    try {
      const payload: Partial<WimsProduct> = {
        name: name.trim(),
        sku: sku.trim().toUpperCase(),
        category,
        description: description.trim(),
        supplier: supplier.trim(),
        purchase_price: Number(purchasePrice),
        selling_price: Number(sellingPrice),
        current_stock: Number(currentStock),
        minimum_stock: Number(minimumStock),
        maximum_stock: Number(maximumStock),
        warehouse_location: warehouseLocation.trim(),
        image_url: imageUrl.trim() || undefined
      };

      if (productToEdit) {
        payload.id = productToEdit.id;
      }
      const saved = wimsDb.saveProduct(payload as any);

      onSuccess(saved);
      showToast(
        productToEdit ? `Product "${saved.name}" updated successfully.` : `Product "${saved.name}" registered in vault.`,
        'success'
      );

      if (addAnother) {
        resetFields();
      } else {
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to save product specification.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm p-4 flex items-center justify-center animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#FFFFFF] border border-[#E8E0D4] rounded shadow-2xl p-6 sm:p-7 font-mono-data text-xs space-y-5 text-[#111111]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D4]">
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-[#8A6D2F]" />
            <div>
              <h3 className="font-serif-luxury text-lg font-bold text-[#111111] uppercase">
                {productToEdit ? 'Edit Product Specification' : 'Register New Warehouse Product'}
              </h3>
              <span className="text-[10px] text-[#6B6B6B]">
                Strict schema validation with unique SKU and atomic threshold controls
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#6B6B6B] hover:text-[#111111]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-[#FFF2F2] border border-[#FFCDD2] text-[#B33939] rounded flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSave(false); }} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          
          {/* Row 1: Name & SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-[#6B6B6B] uppercase font-bold block mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Amber Nobile Extrait 100ml"
                className="w-full h-10 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-[#111111] rounded focus:outline-none focus:border-[#8A6D2F]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#6B6B6B] uppercase font-bold block mb-1">Unique SKU Code *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                placeholder="e.g. AUR-AMB-8001"
                className="w-full h-10 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-[#8A6D2F] font-bold rounded focus:outline-none focus:border-[#8A6D2F]"
              />
            </div>
          </div>

          {/* Row 2: Category & Supplier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-[#6B6B6B] uppercase font-bold block mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-[#111111] rounded focus:outline-none cursor-pointer"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#6B6B6B] uppercase font-bold block mb-1">Supplier / Distiller *</label>
              <input
                type="text"
                required
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="e.g. Laboratoires Grasse Essences S.A."
                className="w-full h-10 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-[#111111] rounded focus:outline-none focus:border-[#8A6D2F]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] text-[#6B6B6B] uppercase font-bold block mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Olfactive notes, distillation parameters, storage criteria..."
              className="w-full p-2.5 bg-[#F8F5EF] border border-[#E8E0D4] text-[#111111] rounded focus:outline-none focus:border-[#8A6D2F]"
            />
          </div>

          {/* Row 3: Prices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#F8F5EF] border border-[#E8E0D4] rounded">
            <div>
              <label className="text-[10px] text-[#6B6B6B] uppercase font-bold block mb-1">Purchase Unit Cost (PKR) *</label>
              <input
                type="number"
                min="0"
                required
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                className="w-full h-9 px-3 bg-[#FFFFFF] border border-[#E8E0D4] text-[#111111] rounded focus:outline-none font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#6B6B6B] uppercase font-bold block mb-1">Selling Retail Price (PKR) *</label>
              <input
                type="number"
                min="0"
                required
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full h-9 px-3 bg-[#FFFFFF] border border-[#E8E0D4] text-[#8A6D2F] font-bold rounded focus:outline-none"
              />
            </div>
          </div>

          {/* Row 4: Stock Limits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-[#F8F5EF] border border-[#E8E0D4] rounded">
            <div>
              <label className="text-[10px] text-[#6B6B6B] uppercase font-bold block mb-1">Initial Stock Units *</label>
              <input
                type="number"
                min="0"
                required
                value={currentStock}
                onChange={(e) => setCurrentStock(Number(e.target.value))}
                className="w-full h-9 px-3 bg-[#FFFFFF] border border-[#E8E0D4] text-[#2E7D32] font-bold rounded focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#6B6B6B] uppercase font-bold block mb-1">Minimum Safety Stock *</label>
              <input
                type="number"
                min="1"
                required
                value={minimumStock}
                onChange={(e) => setMinimumStock(Number(e.target.value))}
                className="w-full h-9 px-3 bg-[#FFFFFF] border border-[#E8E0D4] text-[#F57F17] font-bold rounded focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#6B6B6B] uppercase font-bold block mb-1">Maximum Vault Capacity *</label>
              <input
                type="number"
                min="1"
                required
                value={maximumStock}
                onChange={(e) => setMaximumStock(Number(e.target.value))}
                className="w-full h-9 px-3 bg-[#FFFFFF] border border-[#E8E0D4] text-[#111111] font-bold rounded focus:outline-none"
              />
            </div>
          </div>

          {/* Row 5: Warehouse Location & Image URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-[#6B6B6B] uppercase font-bold block mb-1">Storage Bay Location *</label>
              <input
                type="text"
                required
                value={warehouseLocation}
                onChange={(e) => setWarehouseLocation(e.target.value)}
                placeholder="e.g. Vault Bay A-03"
                className="w-full h-10 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-[#111111] rounded focus:outline-none focus:border-[#8A6D2F]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#6B6B6B] uppercase font-bold block mb-1">Product Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full h-10 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-[#111111] rounded focus:outline-none focus:border-[#8A6D2F]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-[#E8E0D4] flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#F8F5EF] border border-[#E8E0D4] text-[#6B6B6B] hover:text-[#111111] uppercase rounded font-bold"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              {!productToEdit && (
                <button
                  type="button"
                  onClick={() => handleSave(true)}
                  className="px-4 py-2 bg-[#FFFFFF] hover:bg-[#F3EFE6] border border-[#E8E0D4] text-[#1D4ED8] font-bold uppercase rounded transition-colors"
                >
                  Save & Add Another
                </button>
              )}

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#111111] text-[#FFE09D] font-syne font-bold uppercase rounded hover:bg-[#8A6D2F] transition-all shadow-md"
              >
                {productToEdit ? 'Update Specification' : 'Save Product'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
