import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, ProductVariant, AdminRole } from '../../types';
import { saveProduct, adjustVariantStock } from '../../api/mockApi';
import { X, Plus, Trash2, Check, Sliders, ShieldCheck } from 'lucide-react';

interface AddEditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export function AddEditProductModal({ isOpen, onClose, productToEdit }: AddEditProductModalProps) {
  const { refreshProducts, showToast } = useApp();

  const [name, setName] = useState(productToEdit?.name || '');
  const [subtitle, setSubtitle] = useState(productToEdit?.subtitle || 'Private Blend Collection · Master Distillate');
  const [description, setDescription] = useState(productToEdit?.description || 'Formulated with rare agarwood and aged floral absolutes.');
  const [collection, setCollection] = useState(productToEdit?.collection || 'Private Reserve');
  const [category, setCategory] = useState(productToEdit?.category || 'Extraits');
  const [gender, setGender] = useState(productToEdit?.gender || 'Unisex');
  const [concentration, setConcentration] = useState(productToEdit?.concentration || 'Extrait de Parfum (30-35%)');
  const [longevity, setLongevity] = useState(productToEdit?.longevity || 'Eternal (14+ hrs)');
  const [sillage, setSillage] = useState(productToEdit?.sillage || 'Heavy Projection');
  const [topNotes, setTopNotes] = useState(productToEdit?.top_notes.join(', ') || 'Bergamot Reggio, Saffron Threads');
  const [heartNotes, setHeartNotes] = useState(productToEdit?.heart_notes.join(', ') || 'Taif Rose Absolute, Smoked Leather');
  const [baseNotes, setBaseNotes] = useState(productToEdit?.base_notes.join(', ') || 'Aged Cambodian Oud, Ambergris, Sandalwood');
  const [sizeMl, setSizeMl] = useState(productToEdit?.variants[0]?.size_ml || 100);
  const [sku, setSku] = useState(productToEdit?.variants[0]?.sku || `AUR-SPEC-${Math.floor(100 + Math.random() * 900)}`);
  const [price, setPrice] = useState(productToEdit?.variants[0]?.price || 6500);
  const [costPrice, setCostPrice] = useState(productToEdit?.variants[0]?.cost_price || 2800);
  const [stock, setStock] = useState(productToEdit?.variants[0]?.stock || 50);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await saveProduct({
        id: productToEdit?.id,
        name,
        subtitle,
        description,
        collection: collection as any,
        category: category as any,
        gender: gender as any,
        concentration: concentration as any,
        longevity: longevity as any,
        sillage: sillage as any,
        top_notes: topNotes.split(',').map(s => s.trim()).filter(Boolean),
        heart_notes: heartNotes.split(',').map(s => s.trim()).filter(Boolean),
        base_notes: baseNotes.split(',').map(s => s.trim()).filter(Boolean),
        variants: [
          {
            id: productToEdit?.variants[0]?.id || `var-${Date.now()}-100`,
            size_ml: Number(sizeMl),
            label: `${sizeMl}ml Flacon`,
            sku,
            price: Number(price),
            cost_price: Number(costPrice),
            stock: Number(stock),
            reserved: 0,
            low_stock_threshold: 20,
            barcode: `890${Math.floor(1000000000 + Math.random() * 9000000000)}`
          }
        ]
      });

      await refreshProducts();
      showToast(`Fragrance spec "${name}" saved to vault catalogue.`, 'success');
      onClose();
    } catch {
      showToast('Failed to save fragrance spec.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-[#0b0e12] border border-[#ffe09d] shadow-2xl p-6 sm:p-8 font-mono-data text-xs space-y-6 text-[#e1e2e8] animate-fadeIn">
        
        <div className="flex items-center justify-between pb-3 border-b border-[#4d4639]/40">
          <div>
            <span className="text-[10px] text-[#999080] uppercase">Formula Laboratory Console</span>
            <h3 className="font-syne text-xl font-bold text-[#ffe09d]">
              {productToEdit ? 'Modify Fragrance Spec' : 'Add New Fragrance Specification'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#999080] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-[#999080] uppercase block mb-1">Perfume Title *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Royal Santal Extrait"
                className="w-full h-10 px-3 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:outline-none focus:border-[#ffe09d]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#999080] uppercase block mb-1">Collection</label>
              <select
                value={collection}
                onChange={(e) => setCollection(e.target.value as any)}
                className="w-full h-10 px-3 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:outline-none cursor-pointer"
              >
                <option value="Private Reserve">Private Reserve</option>
                <option value="Heritage Oud">Heritage Oud</option>
                <option value="Atelier Florals">Atelier Florals</option>
                <option value="Summer Reserve">Summer Reserve</option>
                <option value="Master Distillates">Master Distillates</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-[#999080] uppercase block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full h-10 px-2 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:outline-none cursor-pointer"
              >
                <option value="Extraits">Extraits de Parfum</option>
                <option value="EDPs">Eau de Parfum</option>
                <option value="Attars">Pure Attars & Oils</option>
                <option value="Discovery">Discovery Anthology</option>
                <option value="Testers">Showroom Tester</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#999080] uppercase block mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full h-10 px-2 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:outline-none cursor-pointer"
              >
                <option value="Unisex">Unisex</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#999080] uppercase block mb-1">Concentration</label>
              <select
                value={concentration}
                onChange={(e) => setConcentration(e.target.value as any)}
                className="w-full h-10 px-2 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:outline-none cursor-pointer"
              >
                <option value="Extrait de Parfum (30-35%)">Extrait (30-35%)</option>
                <option value="Eau de Parfum (18-20%)">EDP (18-20%)</option>
                <option value="Pure Attar / Concentrated Oil">Pure Attar</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#999080] uppercase block mb-1">Subtitle / Line Identifier</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full h-9 px-3 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:outline-none focus:border-[#ffe09d]"
            />
          </div>

          {/* Olfactive Pyramid Inputs */}
          <div className="p-3 bg-[#191c20] border border-[#4d4639]/30 space-y-3">
            <span className="text-[10px] uppercase font-bold text-[#ffe09d] block">Olfactive Notes Pyramid</span>
            <div>
              <label className="text-[9px] text-[#999080] uppercase block mb-0.5">Top Notes (comma-separated)</label>
              <input
                type="text"
                value={topNotes}
                onChange={(e) => setTopNotes(e.target.value)}
                className="w-full h-8 px-2 bg-[#0b0e12] border border-[#4d4639] text-[#e1e2e8]"
              />
            </div>
            <div>
              <label className="text-[9px] text-[#999080] uppercase block mb-0.5">Heart Notes (comma-separated)</label>
              <input
                type="text"
                value={heartNotes}
                onChange={(e) => setHeartNotes(e.target.value)}
                className="w-full h-8 px-2 bg-[#0b0e12] border border-[#4d4639] text-[#e1e2e8]"
              />
            </div>
            <div>
              <label className="text-[9px] text-[#999080] uppercase block mb-0.5">Base Notes (comma-separated)</label>
              <input
                type="text"
                value={baseNotes}
                onChange={(e) => setBaseNotes(e.target.value)}
                className="w-full h-8 px-2 bg-[#0b0e12] border border-[#4d4639] text-[#e1e2e8]"
              />
            </div>
          </div>

          {/* Flacon Variant & Valuation */}
          <div className="p-3 bg-[#191c20] border border-[#4d4639]/30 space-y-3">
            <span className="text-[10px] uppercase font-bold text-[#ffe09d] block">Initial Flacon SKU & Financial Yield</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="text-[9px] text-[#999080] uppercase block mb-0.5">Volume (ML)</label>
                <input
                  type="number"
                  value={sizeMl}
                  onChange={(e) => setSizeMl(Number(e.target.value))}
                  className="w-full h-8 px-2 bg-[#0b0e12] border border-[#4d4639] text-[#e1e2e8]"
                />
              </div>
              <div>
                <label className="text-[9px] text-[#999080] uppercase block mb-0.5">SKU Code</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full h-8 px-2 bg-[#0b0e12] border border-[#4d4639] text-[#ffe09d]"
                />
              </div>
              <div>
                <label className="text-[9px] text-[#999080] uppercase block mb-0.5">Retail Price (PKR)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full h-8 px-2 bg-[#0b0e12] border border-[#4d4639] text-[#e1e2e8]"
                />
              </div>
              <div>
                <label className="text-[9px] text-[#999080] uppercase block mb-0.5">Initial Units</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full h-8 px-2 bg-[#0b0e12] border border-[#4d4639] text-[#2EE59D]"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#4d4639]/40 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#191c20] text-[#999080] hover:text-white uppercase text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#ffe09d] text-[#251a00] font-bold uppercase text-xs hover:bg-[#e5c378] shadow-md"
            >
              Save Specification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface StockAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StockAdjustModal({ isOpen, onClose }: StockAdjustModalProps) {
  const { products, refreshProducts, showToast } = useApp();

  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [delta, setDelta] = useState<number>(10);
  const [reason, setReason] = useState('Grasse Replenishment Shipment Received');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentProd = products.find(p => p.id === selectedProductId) || products[0];
  const variant = currentProd?.variants[0];

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProd || !variant) return;

    setIsSubmitting(true);
    try {
      await adjustVariantStock(currentProd.id, variant.id, Number(delta), reason);
      await refreshProducts();
      showToast(`Stock updated for ${currentProd.name} (${delta >= 0 ? '+' : ''}${delta} units).`, 'success');
      onClose();
    } catch {
      showToast('Stock adjustment failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center">
      <div className="w-full max-w-lg bg-[#0b0e12] border border-[#e9c176] shadow-2xl p-6 font-mono-data text-xs space-y-5 text-[#e1e2e8] animate-fadeIn">
        
        <div className="flex items-center justify-between pb-3 border-b border-[#4d4639]/40">
          <div className="flex items-center gap-2 text-[#e9c176]">
            <Sliders className="w-4 h-4" />
            <h3 className="font-syne text-lg font-bold text-[#e1e2e8] uppercase">
              Record Stock Adjustment
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#999080] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleAdjust} className="space-y-4">
          <div>
            <label className="text-[10px] text-[#999080] uppercase block mb-1">Select Fragrance Spec</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full h-10 px-3 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:outline-none cursor-pointer"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.variants[0]?.sku}) - Current: {p.variants[0]?.stock} btls
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-[#191c20] border border-[#4d4639]/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#999080] uppercase block">Current Available Vault Stock</span>
              <div className="font-syne text-xl font-bold text-[#ffe09d]">{variant?.stock} bottles</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#999080] uppercase block">Safety Threshold</span>
              <div className="font-mono-data text-xs text-[#e9c176]">{variant?.low_stock_threshold} units min</div>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#999080] uppercase block mb-1">
              Quantity Adjustment Delta (Positive to add, Negative to deduct) *
            </label>
            <input
              type="number"
              required
              value={delta}
              onChange={(e) => setDelta(Number(e.target.value))}
              placeholder="e.g. +50 or -5"
              className="w-full h-10 px-3 bg-[#191c20] border border-[#4d4639] text-[#ffe09d] font-bold text-sm focus:outline-none"
            />
            <span className="text-[10px] text-[#999080] mt-1 block">
              Resulting Stock after adjustment: <strong className="text-white">{Math.max(0, (variant?.stock || 0) + Number(delta))} bottles</strong>
            </span>
          </div>

          <div>
            <label className="text-[10px] text-[#999080] uppercase block mb-1">Reason for Audit Ledger *</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-10 px-3 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:outline-none cursor-pointer"
            >
              <option value="Grasse Replenishment Shipment Received">Grasse Replenishment Shipment Received (+PO)</option>
              <option value="Damaged Display Tester / Evaporated">Damaged Display Tester / Evaporated (-)</option>
              <option value="Inter-vault transfer: DXB to LHR">Inter-vault transfer: DXB to LHR</option>
              <option value="Stocktake Reconciled Discrepancy">Stocktake Reconciled Discrepancy</option>
              <option value="VIP Client Gifting Allocation">VIP Client Gifting Allocation</option>
            </select>
          </div>

          <div className="pt-3 border-t border-[#4d4639]/40 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#191c20] text-[#999080] hover:text-white uppercase text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#e5c378] text-[#3f2e00] font-bold uppercase text-xs hover:bg-[#ffe09d] shadow-md"
            >
              Commit Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function RoleTesterModal() {
  const { currentRole, setCurrentRole, permissions, showToast } = useApp();

  const roles: AdminRole[] = [
    'Super Admin',
    'Manager',
    'Inventory Manager',
    'Order Manager',
    'Content Manager'
  ];

  return (
    <div className="p-4 bg-[#191c20] border border-[#4d4639] font-mono-data text-xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-[#4d4639]/40">
        <div className="flex items-center gap-1.5 text-[#ffe09d]">
          <ShieldCheck className="w-4 h-4" />
          <span className="font-syne font-bold uppercase">Role-Based Access Control Matrix</span>
        </div>
        <span className="text-[10px] text-[#999080]">Simulation</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {roles.map(r => (
          <button
            key={r}
            type="button"
            onClick={() => {
              setCurrentRole(r);
              showToast(`Switched active staff role to: ${r}`, 'info');
            }}
            className={`px-3 py-1.5 uppercase font-bold text-xs transition-colors ${
              currentRole === r 
                ? 'bg-[#ffe09d] text-[#251a00]' 
                : 'bg-[#0b0e12] text-[#999080] hover:text-white border border-[#4d4639]/30'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="p-3 bg-[#0b0e12] text-[11px] space-y-1">
        <div className="text-[#ffe09d] font-bold">Permissions for {currentRole}:</div>
        <div className="grid grid-cols-2 gap-1 text-[#d0c5b4]">
          <div>• View Dashboard: {permissions.canViewDashboard ? '✓ Allowed' : '✗ Forbidden'}</div>
          <div>• Manage Inventory: {permissions.canManageInventory ? '✓ Allowed' : '✗ Forbidden'}</div>
          <div>• Manage Orders: {permissions.canManageOrders ? '✓ Allowed' : '✗ Forbidden'}</div>
          <div>• Manage Products: {permissions.canManageProducts ? '✓ Allowed' : '✗ Forbidden'}</div>
          <div>• Access Settings: {permissions.canAccessSettings ? '✓ Allowed' : '✗ Forbidden'}</div>
          <div>• Audit Logs: {permissions.canViewAuditLogs ? '✓ Allowed' : '✗ Forbidden'}</div>
        </div>
      </div>
    </div>
  );
}
