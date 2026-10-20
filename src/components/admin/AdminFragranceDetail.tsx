import React from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { 
  ArrowLeft, 
  Edit, 
  QrCode, 
  Sliders, 
  ShoppingBag, 
  Lock, 
  CheckCircle2, 
  Clock, 
  Wind, 
  Sparkles, 
  Truck, 
  AlertTriangle 
} from 'lucide-react';

interface AdminFragranceDetailProps {
  product: Product;
  onBack: () => void;
  onEdit: () => void;
  onStockAdjust: () => void;
}

export function AdminFragranceDetail({ 
  product, 
  onBack, 
  onEdit, 
  onStockAdjust 
}: AdminFragranceDetailProps) {
  const { formatPKR, showToast, setAdminView } = useApp();

  const variant = product.variants[0];
  const unitMargin = variant.price - variant.cost_price;
  const marginPercent = Math.round((unitMargin / variant.price) * 100);
  const totalValuation = variant.price * variant.stock;

  return (
    <div className="flex flex-col w-full bg-[#111418] text-[#e1e2e8] min-h-screen">
      
      {/* Command Header & Breadcrumb Strip */}
      <div className="w-full bg-[#0b0e12] px-6 py-5 border-b border-[#4d4639]/30 flex flex-col gap-4 font-mono-data">
        <div className="flex items-center gap-2 text-xs">
          <button onClick={onBack} className="text-[#999080] hover:text-[#ffe09d] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Products</span>
          </button>
          <span className="text-[#4d4639]">/</span>
          <span className="text-[#999080]">{product.collection}</span>
          <span className="text-[#4d4639]">/</span>
          <span className="text-[#ffe09d] font-bold">{product.name}</span>
        </div>

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2 py-0.5 bg-[#272a2e] text-[#ffe09d] uppercase">
                SKU: {variant.sku}
              </span>
              <span className="px-2 py-0.5 bg-[#272a2e] text-[#e9c176] uppercase">
                {product.collection}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#0E2319] text-[#2EE59D] font-bold">
                <span className="w-1.5 h-1.5 bg-[#2EE59D]"></span>
                In Stock ({variant.stock} bottles)
              </span>
            </div>
            <h1 className="font-syne text-2xl sm:text-3xl font-bold text-[#e1e2e8] uppercase">
              {product.name}
            </h1>
          </div>

          {/* Quick Action Console */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono-data uppercase">
            <button
              type="button"
              onClick={onEdit}
              className="h-10 px-4 bg-[#272a2e] hover:bg-[#323539] text-[#e1e2e8] flex items-center gap-2 transition-colors border border-[#4d4639]/30"
            >
              <Edit className="w-3.5 h-3.5 text-[#ffe09d]" />
              <span>Edit Perfume</span>
            </button>
            <button
              type="button"
              onClick={() => showToast(`Printing EAN-13 barcodes for ${variant.sku}...`, 'info')}
              className="h-10 px-4 bg-[#272a2e] hover:bg-[#323539] text-[#e1e2e8] flex items-center gap-2 transition-colors border border-[#4d4639]/30"
            >
              <QrCode className="w-3.5 h-3.5 text-[#dee3ee]" />
              <span>Print Barcode Labels</span>
            </button>
            <button
              type="button"
              onClick={onStockAdjust}
              className="h-10 px-4 bg-[#272a2e] hover:bg-[#323539] text-[#e1e2e8] flex items-center gap-2 transition-colors border border-[#4d4639]/30"
            >
              <Sliders className="w-3.5 h-3.5 text-[#e9c176]" />
              <span>Adjust Stock</span>
            </button>
            <button
              type="button"
              onClick={() => showToast('Replenishment Purchase Order dispatched to Grasse S.A.', 'success')}
              className="h-10 px-4 bg-[#e5c378] hover:bg-[#ffe09d] text-[#3f2e00] font-bold flex items-center gap-2 transition-colors shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Create PO to Grasse Essences</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Technical Split Matrix */}
      <div className="w-full px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (5 Cols): Flacon Artifact, Vault Positioning, Financial Yield */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Flacon Artifact Specimen */}
          <div className="bg-[#0b0e12] border border-[#4d4639]/30 p-5 flex flex-col gap-4 font-mono-data">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#999080] uppercase tracking-widest text-[10px]">Atelier Flacon Specimen</span>
              <span className="text-[#ffe09d] font-bold">BATCH #{variant.barcode.slice(-7)}</span>
            </div>

            <div className="relative w-full aspect-[4/5] bg-[#191c20] overflow-hidden flex items-center justify-center">
              <img
                src={product.images.main}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e12] via-transparent to-transparent opacity-80"></div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                <span className="px-2 py-1 bg-[#0b0e12]/90 text-[#ffe09d] font-bold">
                  {variant.size_ml} ml (3.4 FL. OZ.)
                </span>
                <span className="px-2 py-1 bg-[#0b0e12]/90 text-[#d0c5b4] uppercase text-[10px]">
                  {product.concentration}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#191c20] p-3 border border-[#4d4639]/20">
                <span className="text-[10px] text-[#999080] uppercase block">Maceration State</span>
                <span className="text-sm font-bold text-[#e1e2e8]">{product.maceration_days} Days Cured</span>
              </div>
              <div className="bg-[#191c20] p-3 border border-[#4d4639]/20">
                <span className="text-[10px] text-[#999080] uppercase block">Density Index</span>
                <span className="text-sm font-bold text-[#e1e2e8]">{product.density_index}</span>
              </div>
            </div>
          </div>

          {/* Barcode & Vault Coordinate */}
          <div className="bg-[#0b0e12] border border-[#4d4639]/30 p-5 space-y-3 font-mono-data">
            <div className="flex items-center justify-between text-xs text-[#999080] uppercase tracking-wider">
              <span>Vault Architecture</span>
              <span className="text-[#ffe09d]">Active Bay</span>
            </div>

            <div className="bg-[#191c20] p-4 border border-[#4d4639]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col gap-1 w-full sm:w-auto">
                <div className="h-10 w-44 flex items-stretch gap-[2px] bg-white/90 p-1">
                  {[1, 0.5, 2, 0.5, 1, 3, 0.5, 1.5, 0.5, 2, 1, 0.5, 2, 1.5, 0.5, 2.5, 1].map((w, i) => (
                    <div key={i} className="bg-black" style={{ width: `${w * 3}px` }}></div>
                  ))}
                </div>
                <span className="text-[10px] text-[#d0c5b4] tracking-widest">EAN-13: {variant.barcode}</span>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-[#999080] uppercase block">Physical Coordinate</span>
                <span className="font-syne text-base font-bold text-[#e9c176]">{product.vault_location.vault}, {product.vault_location.rack}</span>
                <span className="text-[11px] text-[#dee3ee] block">Bay Level: {product.vault_location.bay}</span>
              </div>
            </div>
          </div>

          {/* Pricing & Margin Breakdown Ledger */}
          <div className="bg-[#0b0e12] border border-[#4d4639]/30 p-5 space-y-3 font-mono-data">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-0.5 bg-[#ffe09d]"></span>
                <span className="text-[#999080] uppercase tracking-widest text-[10px]">Financial Yield Metric</span>
              </div>
              <span className="text-[#ffe09d] uppercase text-[10px] font-bold">Active Valuation</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#191c20] p-3 border border-[#4d4639]/20">
                <span className="text-[10px] text-[#999080] uppercase block">Unit Acquisition Cost</span>
                <div className="font-syne text-lg font-bold text-[#e1e2e8]">Rs. {variant.cost_price.toLocaleString()}</div>
                <span className="text-[10px] text-[#999080]">Ex-factory Grasse import</span>
              </div>

              <div className="bg-[#191c20] p-3 border border-[#4d4639]/20">
                <span className="text-[10px] text-[#999080] uppercase block">Standard Retail Price</span>
                <div className="font-syne text-lg font-bold text-[#ffe09d]">Rs. {variant.price.toLocaleString()}</div>
                <span className="text-[10px] text-[#999080]">Direct Boutique POS rate</span>
              </div>
            </div>

            <div className="bg-[#1d2024] p-3 border border-[#4d4639]/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#999080] uppercase block">Net Unit Margin</span>
                <div className="font-syne text-base font-bold text-[#e1e2e8]">
                  Rs. {unitMargin.toLocaleString()} <span className="text-xs text-[#e9c176]">/ unit</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#2EE59D] uppercase block">{marginPercent}% Margin</span>
                <span className="text-[10px] text-[#999080]">Optimal Yield Range</span>
              </div>
            </div>

            <div className="bg-[#272a2e] p-3 border border-[#4d4639]/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#999080] uppercase block">Cumulative Asset Holding</span>
                <div className="font-syne text-lg font-bold text-[#ffe09d]">
                  Rs. {totalValuation.toLocaleString()}
                </div>
              </div>
              <Lock className="w-5 h-5 text-[#ffe09d]" />
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Olfactive Pyramid, Lifecycle & Sourcing */}
        <div className="lg:col-span-7 flex flex-col gap-6 font-mono-data">
          
          {/* Olfactive Pyramid Stack */}
          <div className="bg-[#0b0e12] border border-[#4d4639]/30 p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#4d4639]/30">
              <div>
                <span className="text-[10px] text-[#999080] uppercase tracking-widest block">Olfactive Classification</span>
                <h2 className="font-syne text-xl font-bold text-[#e1e2e8]">
                  {product.families.join(' · ')} Essence
                </h2>
              </div>
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="px-2 py-0.5 bg-[#1d2024] text-[#dee3ee] uppercase">Formula Lab 04</span>
                <span className="px-2 py-0.5 bg-[#604403] text-[#e9c176] uppercase">Artisanal Distillate</span>
              </div>
            </div>

            {/* Pyramid Layers */}
            <div className="space-y-2 text-xs">
              {/* Top Notes */}
              <div className="bg-[#191c20] p-4 border border-[#4d4639]/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#ffe09d]"></span>
                    <span className="font-bold text-[#ffe09d] uppercase">Top Notes</span>
                    <span className="text-[10px] text-[#999080]">(Initial Volatility: First 15–30 mins)</span>
                  </div>
                  <span className="text-[10px] text-[#999080] uppercase">High Diffusion</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {product.top_notes.map((note, i) => (
                    <span key={i} className="px-2.5 py-1 bg-[#1d2024] border border-[#4d4639]/40 text-[#e1e2e8] uppercase text-[11px]">
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Heart Notes */}
              <div className="bg-[#191c20] p-4 border border-[#4d4639]/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#e9c176]"></span>
                    <span className="font-bold text-[#e9c176] uppercase">Heart / Middle Notes</span>
                    <span className="text-[10px] text-[#999080]">(Core Resonance: 2–6 hours)</span>
                  </div>
                  <span className="text-[10px] text-[#999080] uppercase">Medium Evaporation</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {product.heart_notes.map((note, i) => (
                    <span key={i} className="px-2.5 py-1 bg-[#1d2024] border border-[#4d4639]/40 text-[#e1e2e8] uppercase text-[11px]">
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Base Notes */}
              <div className="bg-[#191c20] p-4 border border-[#4d4639]/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#d0c5b4]"></span>
                    <span className="font-bold text-[#d0c5b4] uppercase">Base Notes</span>
                    <span className="text-[10px] text-[#999080]">(Substantive Drydown: 8–24+ hours)</span>
                  </div>
                  <span className="text-[10px] text-[#999080] uppercase">Persistent Fixative</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {product.base_notes.map((note, i) => (
                    <span key={i} className="px-2.5 py-1 bg-[#1d2024] border border-[#4d4639]/40 text-[#e1e2e8] uppercase text-[11px]">
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-xs">
              <div className="bg-[#191c20] p-3 border border-[#4d4639]/20">
                <span className="text-[10px] text-[#999080] uppercase block">Sillage</span>
                <span className="font-bold text-[#e1e2e8] mt-1 block">{product.sillage}</span>
                <div className="w-full bg-[#1d2024] h-1 mt-2">
                  <div className="bg-[#ffe09d] h-full w-[85%]"></div>
                </div>
              </div>

              <div className="bg-[#191c20] p-3 border border-[#4d4639]/20">
                <span className="text-[10px] text-[#999080] uppercase block">Longevity</span>
                <span className="font-bold text-[#e1e2e8] mt-1 block">{product.longevity}</span>
                <div className="w-full bg-[#1d2024] h-1 mt-2">
                  <div className="bg-[#ffe09d] h-full w-[96%]"></div>
                </div>
              </div>

              <div className="bg-[#191c20] p-3 border border-[#4d4639]/20">
                <span className="text-[10px] text-[#999080] uppercase block">Best Season</span>
                <span className="font-bold text-[#e1e2e8] mt-1 block">{product.best_season}</span>
                <div className="w-full bg-[#1d2024] h-1 mt-2">
                  <div className="bg-[#e9c176] h-full w-[100%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Sourcing Partner Dossier */}
          <div className="bg-[#0b0e12] border border-[#4d4639]/30 p-5 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#999080] uppercase tracking-widest text-[10px]">Primary Origin Partner</span>
              <span className="px-2 py-0.5 bg-[#1d2024] text-[#e9c176] text-[10px] uppercase font-bold">Approved Sourcing</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#191c20] p-4 border border-[#4d4639]/20">
              <div>
                <span className="text-[10px] text-[#999080] uppercase block">Vendor Designation</span>
                <div className="font-syne text-base font-bold text-[#e1e2e8]">{product.supplier.name}</div>
                <span className="text-xs text-[#999080]">{product.supplier.location}</span>
              </div>
              <div className="md:text-right">
                <span className="text-[10px] text-[#999080] uppercase block">Transit Lead Time</span>
                <div className="font-syne text-base font-bold text-[#ffe09d]">{product.supplier.lead_time_days} Business Days</div>
                <span className="text-xs text-[#999080]">Cold-chain bonded freight</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
