import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  TrendingUp, 
  DollarSign, 
  Boxes, 
  Layers, 
  PieChart, 
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { WimsProduct, WimsStockMovement } from '../../services/supabase';

interface WimsReportsProps {
  products: WimsProduct[];
  movements: WimsStockMovement[];
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export function WimsReports({ products, movements, showToast }: WimsReportsProps) {
  const [reportType, setReportType] = useState<'valuation' | 'turnover' | 'margins'>('valuation');

  // Inventory Financial Aggregations
  const activeProducts = products.filter(p => !p.archived);
  const totalUnits = activeProducts.reduce((sum, p) => sum + p.current_stock, 0);
  const totalCostBasis = activeProducts.reduce((sum, p) => sum + (p.purchase_price * p.current_stock), 0);
  const totalRetailValuation = activeProducts.reduce((sum, p) => sum + (p.selling_price * p.current_stock), 0);
  const projectedGrossProfit = totalRetailValuation - totalCostBasis;
  const portfolioMarginPct = totalRetailValuation > 0 ? ((projectedGrossProfit / totalRetailValuation) * 100).toFixed(1) : '0';

  // Category breakdown
  const categorySummary: { [cat: string]: { units: number; costVal: number; retailVal: number } } = {};
  for (const p of activeProducts) {
    if (!categorySummary[p.category]) {
      categorySummary[p.category] = { units: 0, costVal: 0, retailVal: 0 };
    }
    categorySummary[p.category].units += p.current_stock;
    categorySummary[p.category].costVal += (p.purchase_price * p.current_stock);
    categorySummary[p.category].retailVal += (p.selling_price * p.current_stock);
  }

  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];

    if (reportType === 'valuation') {
      headers = ["SKU", "Product Name", "Category", "Current Stock", "Unit Cost", "Selling Price", "Total Cost Basis", "Total Retail Valuation", "Gross Margin"];
      rows = activeProducts.map(p => [
        `"${p.sku}"`,
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.category}"`,
        p.current_stock,
        p.purchase_price,
        p.selling_price,
        p.current_stock * p.purchase_price,
        p.current_stock * p.selling_price,
        p.selling_price > 0 ? `${(((p.selling_price - p.purchase_price) / p.selling_price) * 100).toFixed(1)}%` : '0%'
      ]);
    } else {
      headers = ["Category", "Total Units", "Total Cost Basis (PKR)", "Total Retail Value (PKR)", "Expected Gross Profit (PKR)"];
      rows = Object.entries(categorySummary).map(([cat, data]) => [
        `"${cat}"`,
        data.units,
        data.costVal,
        data.retailVal,
        data.retailVal - data.costVal
      ]);
    }

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", `wims_${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${reportType.toUpperCase()} report (CSV).`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 text-[#e1e2e8]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#32363e]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-data text-[#ffe09d] uppercase tracking-wider">
            <FileSpreadsheet className="w-4 h-4 text-[#ffe09d]" />
            <span>Financial & Stock Intelligence</span>
          </div>
          <h1 className="font-syne text-2xl font-bold text-[#e1e2e8] mt-0.5">
            Inventory Valuation & Margin Analytics
          </h1>
          <p className="text-xs font-mono-data text-[#999080]">
            Comprehensive ledger auditing, cost of goods (COGS), and revenue projections
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3 py-2 bg-[#161a20] hover:bg-[#20252e] border border-[#32363e] text-xs font-mono-data text-[#c2cad6] rounded flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[#ffe09d]" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-[#ffe09d] text-[#111111] hover:bg-[#e5c378] text-xs font-syne font-bold uppercase rounded flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#14171d] border border-[#32363e] rounded">
          <span className="text-[10px] font-mono-data text-[#999080] uppercase block">Total Cost Basis (COGS)</span>
          <div className="font-syne text-2xl font-bold text-white mt-1">
            PKR {totalCostBasis.toLocaleString()}
          </div>
          <span className="text-[10px] font-mono-data text-[#999080] mt-1 block">Acquisition cost for {totalUnits.toLocaleString()} units</span>
        </div>

        <div className="p-4 bg-[#14171d] border border-[#32363e] rounded">
          <span className="text-[10px] font-mono-data text-[#ffe09d] uppercase block">Total Retail Asset Valuation</span>
          <div className="font-syne text-2xl font-bold text-[#ffe09d] mt-1">
            PKR {totalRetailValuation.toLocaleString()}
          </div>
          <span className="text-[10px] font-mono-data text-[#999080] mt-1 block">Based on published catalog pricing</span>
        </div>

        <div className="p-4 bg-[#14171d] border border-[#32363e] rounded">
          <span className="text-[10px] font-mono-data text-[#4ade80] uppercase block">Projected Gross Profit</span>
          <div className="font-syne text-2xl font-bold text-[#4ade80] mt-1">
            PKR {projectedGrossProfit.toLocaleString()}
          </div>
          <span className="text-[10px] font-mono-data text-[#999080] mt-1 block">Unrealized catalog inventory profit</span>
        </div>

        <div className="p-4 bg-[#14171d] border border-[#32363e] rounded">
          <span className="text-[10px] font-mono-data text-[#70b5f9] uppercase block">Overall Portfolio Margin</span>
          <div className="font-syne text-2xl font-bold text-[#70b5f9] mt-1">
            {portfolioMarginPct}%
          </div>
          <span className="text-[10px] font-mono-data text-[#999080] mt-1 block">Weighted gross margin across all bays</span>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="p-5 bg-[#14171d] border border-[#32363e] rounded space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-syne text-base font-bold text-[#e1e2e8] uppercase">
            Valuation Breakdown by Category
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-data">
            <thead className="bg-[#0b0e12] text-[#999080] uppercase text-[10px] border-b border-[#32363e]">
              <tr>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Physical Units</th>
                <th className="py-2.5 px-3 text-right">Cost Basis (PKR)</th>
                <th className="py-2.5 px-3 text-right">Retail Valuation (PKR)</th>
                <th className="py-2.5 px-3 text-right">Expected Margin (PKR)</th>
                <th className="py-2.5 px-3 text-right">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#32363e]/40">
              {Object.entries(categorySummary).map(([cat, data]) => {
                const profit = data.retailVal - data.costVal;
                const mPct = data.retailVal > 0 ? ((profit / data.retailVal) * 100).toFixed(1) : '0';

                return (
                  <tr key={cat} className="hover:bg-[#1a1d24]">
                    <td className="py-3 px-3 font-bold text-[#e1e2e8]">{cat}</td>
                    <td className="py-3 px-3 text-right font-medium text-white">{data.units.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right text-[#c2cad6]">PKR {data.costVal.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right font-bold text-[#ffe09d]">PKR {data.retailVal.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right text-[#4ade80]">PKR {profit.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right font-bold text-white">{mPct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
