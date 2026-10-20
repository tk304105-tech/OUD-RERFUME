import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ExpenseRecord } from '../../types';
import { getExpenses, saveExpense, deleteExpense } from '../../api/mockApi';
import { ConfirmModal } from '../common/ConfirmModal';
import { 
  CreditCard, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  DollarSign, 
  Percent, 
  TrendingUp, 
  Calendar, 
  Receipt, 
  CheckCircle2, 
  Clock, 
  X 
} from 'lucide-react';

export function AdminExpenses() {
  const { formatPKR, showToast } = useApp();
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseRecord | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseRecord['category']>('Raw Materials');
  const [supplierName, setSupplierName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amountPKR, setAmountPKR] = useState(50000);
  const [paymentStatus, setPaymentStatus] = useState<ExpenseRecord['payment_status']>('Paid');
  const [paymentMethod, setPaymentMethod] = useState('Bank Wire');
  const [notes, setNotes] = useState('');

  const loadData = async () => {
    setLoading(true);
    const data = await getExpenses();
    setExpenses(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalExpenseAmount = expenses.reduce((sum, e) => sum + e.amount_pkr, 0);
  const rawMaterialCost = expenses
    .filter(e => e.category === 'Raw Materials' || (e.category as string) === 'Solvents & Alcohol')
    .reduce((sum, e) => sum + e.amount_pkr, 0);

  const openAddModal = () => {
    setEditingExpense(null);
    setTitle('');
    setCategory('Raw Materials');
    setSupplierName('Laboratoires Grasse Essences S.A.');
    setInvoiceNumber(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
    setDate(new Date().toISOString().split('T')[0]);
    setAmountPKR(45000);
    setPaymentStatus('Paid');
    setPaymentMethod('Bank Wire');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (exp: ExpenseRecord) => {
    setEditingExpense(exp);
    setTitle(exp.title);
    setCategory(exp.category);
    setSupplierName(exp.supplier_name);
    setInvoiceNumber(exp.invoice_number);
    setDate(exp.date);
    setAmountPKR(exp.amount_pkr);
    setPaymentStatus(exp.payment_status);
    setPaymentMethod(exp.payment_method);
    setNotes(exp.notes || '');
    setIsModalOpen(true);
  };

  const [expenseToDelete, setExpenseToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = (id: string, expenseTitle: string) => {
    setExpenseToDelete({ id, title: expenseTitle });
  };

  const handleConfirmDelete = async () => {
    if (!expenseToDelete) return;
    setIsDeleting(true);
    try {
      await deleteExpense(expenseToDelete.id);
      setExpenses(prev => prev.filter(e => e.id !== expenseToDelete.id));
      showToast(`Expense "${expenseToDelete.title}" deleted successfully`, 'info');
    } catch (err: any) {
      showToast(err?.message || 'Failed to remove expense', 'error');
    } finally {
      setIsDeleting(false);
      setExpenseToDelete(null);
    }
  };

  const handleSaveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amountPKR <= 0) {
      showToast('Title and a valid amount are required', 'error');
      return;
    }

    const saved = await saveExpense({
      id: editingExpense?.id,
      title: title.trim(),
      category,
      supplier_name: supplierName.trim() || 'Grasse Distillers',
      invoice_number: invoiceNumber.trim() || `INV-${Date.now().toString().slice(-4)}`,
      date,
      amount_pkr: Number(amountPKR),
      payment_status: paymentStatus,
      payment_method: paymentMethod,
      notes: notes.trim()
    });

    if (editingExpense) {
      setExpenses(prev => prev.map(e => e.id === saved.id ? saved : e));
      showToast(`Expense "${saved.title}" updated successfully`, 'success');
    } else {
      setExpenses(prev => [saved, ...prev]);
      showToast(`Expense "${saved.title}" logged in ledger`, 'success');
    }

    setIsModalOpen(false);
  };

  const filteredExpenses = expenses.filter(e => {
    if (categoryFilter !== 'All' && e.category !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return e.title.toLowerCase().includes(q) ||
             e.supplier_name.toLowerCase().includes(q) ||
             e.invoice_number.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full bg-[#111418] text-[#e1e2e8] min-h-screen">
      {/* Top Header */}
      <div className="px-6 py-6 bg-[#0b0e12]/90 border-b border-[#4d4639]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-data text-[#999080] uppercase tracking-widest">
            <CreditCard className="w-4 h-4 text-[#ffe09d]" />
            <span>Atelier Cost of Goods Sold & Margins</span>
          </div>
          <h1 className="font-syne text-2xl sm:text-3xl font-bold uppercase text-[#e1e2e8] mt-1">
            Expenses & Margin Analysis
          </h1>
          <p className="text-xs text-[#999080] font-mono-data mt-0.5">
            Procurement expenditure for raw agarwood, French essences, Italian flacons & logistics
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#8A6D2F] hover:bg-[#C8A96B] text-white text-xs font-syne uppercase font-bold tracking-wider flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Expense</span>
        </button>
      </div>

      {/* KPI Margin Bar */}
      <div className="p-6 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-[#191c20] border border-[#4d4639]/40">
            <span className="text-[10px] font-mono-data uppercase text-[#999080] tracking-widest block">
              Total Recorded Expenses
            </span>
            <span className="font-syne text-2xl font-bold text-[#ffe09d] mt-1 block">
              {formatPKR(totalExpenseAmount)}
            </span>
            <span className="text-[10px] font-mono-data text-[#999080] mt-0.5 block">
              {expenses.length} active invoices logged
            </span>
          </div>

          <div className="p-4 bg-[#191c20] border border-[#4d4639]/40">
            <span className="text-[10px] font-mono-data uppercase text-[#999080] tracking-widest block">
              Raw Extracts & Ethanol COGS
            </span>
            <span className="font-syne text-2xl font-bold text-[#e1e2e8] mt-1 block">
              {formatPKR(rawMaterialCost)}
            </span>
            <span className="text-[10px] font-mono-data text-[#999080] mt-0.5 block">
              61.2% of operational expenditure
            </span>
          </div>

          <div className="p-4 bg-[#191c20] border border-[#4d4639]/40">
            <span className="text-[10px] font-mono-data uppercase text-[#999080] tracking-widest block">
              Gross Extrait Margin
            </span>
            <span className="font-syne text-2xl font-bold text-[#ffe09d] mt-1 block">
              63.4%
            </span>
            <span className="text-[10px] font-mono-data text-[#999080] mt-0.5 block">
              Target benchmark: 60.0%+
            </span>
          </div>

          <div className="p-4 bg-[#191c20] border border-[#4d4639]/40">
            <span className="text-[10px] font-mono-data uppercase text-[#999080] tracking-widest block">
              Pending Payable Balance
            </span>
            <span className="font-syne text-2xl font-bold text-[#ffdad6] mt-1 block">
              {formatPKR(expenses.filter(e => e.payment_status !== 'Paid').reduce((s, e) => s + e.amount_pkr, 0))}
            </span>
            <span className="text-[10px] font-mono-data text-[#999080] mt-0.5 block">
              Due within net payment windows
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 bg-[#191c20]/60 border border-[#4d4639]/30 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#999080]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search expenses by title, invoice or supplier..."
              className="w-full h-10 pl-9 pr-3 bg-[#111418] border border-[#4d4639] text-xs font-mono-data text-[#e1e2e8] focus:border-[#ffe09d] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {['All', 'Raw Materials', 'Packaging & Bottles', 'Logistics & Shipping', 'Marketing & Studio'].map(c => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`px-3 py-1.5 text-xs font-mono-data whitespace-nowrap transition-all ${
                  categoryFilter === c
                    ? 'bg-[#ffe09d] text-[#111111] font-bold'
                    : 'bg-[#111418] text-[#999080] hover:text-[#e1e2e8] border border-[#4d4639]/30'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Expense Table */}
        {loading ? (
          <div className="p-16 text-center text-[#999080] font-mono-data text-xs">
            Loading expense ledger...
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="p-12 text-center bg-[#191c20]/40 border border-[#4d4639]/30 font-mono-data">
            <Receipt className="w-8 h-8 text-[#999080] mx-auto mb-3 opacity-50" />
            <h3 className="text-sm font-bold text-[#e1e2e8] uppercase">No Expenses Found</h3>
            <p className="text-xs text-[#999080] mt-1">Adjust search parameters or log a new operational invoice.</p>
          </div>
        ) : (
          <div className="bg-[#191c20] border border-[#4d4639]/40 overflow-x-auto">
            <table className="w-full text-left font-mono-data text-xs">
              <thead className="bg-[#111418] text-[#999080] uppercase tracking-wider text-[10px] border-b border-[#4d4639]/30">
                <tr>
                  <th className="py-3 px-4">Expense Title & Category</th>
                  <th className="py-3 px-4">Supplier / Vendor</th>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions (Edit / Delete / Remove)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4d4639]/20">
                {filteredExpenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-[#272a2e]/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-syne font-bold text-[#e1e2e8]">{exp.title}</div>
                      <span className="text-[10px] text-[#999080] uppercase mt-0.5 block">{exp.category}</span>
                    </td>

                    <td className="py-3.5 px-4 text-[#d0c5b4]">
                      {exp.supplier_name}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-[#111418] border border-[#4d4639]/40 text-[#ffe09d] text-[10px]">
                        {exp.invoice_number}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[#999080]">
                      {exp.date}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[#ffe09d]">
                      {formatPKR(exp.amount_pkr)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 text-[10px] uppercase font-bold border ${
                        exp.payment_status === 'Paid'
                          ? 'bg-[#191c20] text-[#ffe09d] border-[#ffe09d]/40'
                          : 'bg-[#93000a]/20 text-[#ffdad6] border-[#93000a]/50'
                      }`}>
                        {exp.payment_status}
                      </span>
                    </td>

                    {/* EDIT, DELETE, REMOVE BUTTONS AS REQUESTED */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(exp)}
                          className="px-2.5 py-1.5 bg-[#111418] hover:bg-[#272a2e] text-[#ffe09d] border border-[#e5c378]/30 text-xs flex items-center gap-1 transition-all"
                          title="Edit Expense"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDelete(exp.id, exp.title)}
                          className="px-2.5 py-1.5 bg-[#93000a]/20 hover:bg-[#93000a]/40 text-[#ffdad6] border border-[#93000a]/40 text-xs flex items-center gap-1 transition-all"
                          title="Delete / Remove Expense"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111418] border border-[#e5c378]/40 p-6 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#999080] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-syne text-xl font-bold uppercase text-[#ffe09d] mb-4">
              {editingExpense ? 'Edit Expense Record' : 'Log New Operational Expense'}
            </h3>

            <form onSubmit={handleSaveExpense} className="space-y-4 font-mono-data text-xs">
              <div>
                <label className="block text-[#999080] uppercase mb-1">Expense Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Taif Rose Absolute Import Batch #77"
                  className="w-full h-10 px-3 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:border-[#ffe09d] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#999080] uppercase mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full h-10 px-2 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:outline-none"
                  >
                    <option value="Raw Materials">Raw Materials</option>
                    <option value="Packaging & Bottles">Packaging & Bottles</option>
                    <option value="Lab Distillation">Lab Distillation</option>
                    <option value="Logistics & Shipping">Logistics & Shipping</option>
                    <option value="Marketing & Studio">Marketing & Studio</option>
                    <option value="Facility & Vault">Facility & Vault</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#999080] uppercase mb-1">Supplier Name</label>
                  <input
                    type="text"
                    value={supplierName}
                    onChange={e => setSupplierName(e.target.value)}
                    placeholder="e.g. Laboratoires Grasse Essences"
                    className="w-full h-10 px-3 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:border-[#ffe09d] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#999080] uppercase mb-1">Invoice Number</label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={e => setInvoiceNumber(e.target.value)}
                    placeholder="INV-FRA-8841"
                    className="w-full h-10 px-3 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:border-[#ffe09d] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#999080] uppercase mb-1">Expense Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full h-10 px-3 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#999080] uppercase mb-1">Amount (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={amountPKR}
                    onChange={e => setAmountPKR(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:border-[#ffe09d] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#999080] uppercase mb-1">Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={e => setPaymentStatus(e.target.value as any)}
                    className="w-full h-10 px-2 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:outline-none"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Due in 15 Days">Due in 15 Days</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#999080] uppercase mb-1">Notes & Specifications</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Specify batch ID or maceration allocation..."
                  className="w-full p-2.5 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#4d4639]/30">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#191c20] text-[#999080] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#8A6D2F] hover:bg-[#C8A96B] text-white font-syne uppercase font-bold"
                >
                  {editingExpense ? 'Save Changes' : 'Log Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense Deletion Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(expenseToDelete)}
        title="Remove Expense Record"
        message={`Are you sure you want to remove expense record "${expenseToDelete?.title}" from the operating ledger?`}
        confirmLabel="Remove Expense"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setExpenseToDelete(null)}
      />
    </div>
  );
}
