import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import { getCustomers, saveCustomer, deleteCustomer } from '../../api/mockApi';
import { ConfirmModal } from '../common/ConfirmModal';
import { 
  Users, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  Crown, 
  Check, 
  X,
  UserCheck
} from 'lucide-react';

export function AdminCustomers() {
  const { formatPKR, showToast } = useApp();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [tier, setTier] = useState<Customer['tier']>('VIP Gold');
  const [totalSpent, setTotalSpent] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  const loadData = async () => {
    setLoading(true);
    const data = await getCustomers();
    setCustomers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingCustomer(null);
    setName('');
    setEmail('');
    setPhone('+92 300 ');
    setCity('Lahore');
    setTier('VIP Gold');
    setTotalSpent(0);
    setOrderCount(0);
    setIsModalOpen(true);
  };

  const openEditModal = (c: Customer) => {
    setEditingCustomer(c);
    setName(c.name);
    setEmail(c.email);
    setPhone(c.phone);
    setCity(c.city);
    setTier(c.tier);
    setTotalSpent(c.total_spent);
    setOrderCount(c.order_count);
    setIsModalOpen(true);
  };

  const [customerToDelete, setCustomerToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = (id: string, customerName: string) => {
    setCustomerToDelete({ id, name: customerName });
  };

  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;
    setIsDeleting(true);
    try {
      await deleteCustomer(customerToDelete.id);
      setCustomers(prev => prev.filter(c => c.id !== customerToDelete.id));
      showToast(`Patron "${customerToDelete.name}" deleted from registry`, 'info');
    } catch (err: any) {
      showToast(err?.message || 'Failed to remove patron', 'error');
    } finally {
      setIsDeleting(false);
      setCustomerToDelete(null);
    }
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Name and Email are required', 'error');
      return;
    }

    const saved = await saveCustomer({
      id: editingCustomer?.id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      city: city.trim(),
      tier,
      total_spent: Number(totalSpent) || 0,
      order_count: Number(orderCount) || 0,
      addresses: editingCustomer?.addresses || [
        {
          name: name.trim(),
          phone: phone.trim(),
          city: city.trim(),
          province: 'Punjab',
          address_line: 'Gulberg III, Luxury Suite'
        }
      ]
    });

    if (editingCustomer) {
      setCustomers(prev => prev.map(c => c.id === saved.id ? saved : c));
      showToast(`Patron profile "${saved.name}" updated successfully`, 'success');
    } else {
      setCustomers(prev => [saved, ...prev]);
      showToast(`Patron "${saved.name}" added to VIP registry`, 'success');
    }

    setIsModalOpen(false);
  };

  const filteredCustomers = customers.filter(c => {
    if (tierFilter !== 'All' && c.tier !== tierFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) ||
             c.email.toLowerCase().includes(q) ||
             c.phone.includes(q) ||
             c.city.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full bg-[#111418] text-[#e1e2e8] min-h-screen">
      {/* Top Header */}
      <div className="px-6 py-6 bg-[#0b0e12]/90 border-b border-[#4d4639]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-data text-[#999080] uppercase tracking-widest">
            <Users className="w-4 h-4 text-[#ffe09d]" />
            <span>Patron & VIP Registry · Atelier Clientele</span>
          </div>
          <h1 className="font-syne text-2xl sm:text-3xl font-bold uppercase text-[#e1e2e8] mt-1">
            Customers & VIP Connoisseurs
          </h1>
          <p className="text-xs text-[#999080] font-mono-data mt-0.5">
            Manage patrons, view lifetime values, update tiers, or edit/remove patron records
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#8A6D2F] hover:bg-[#C8A96B] text-white text-xs font-syne uppercase font-bold tracking-wider flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Patron</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="px-6 py-4 bg-[#191c20]/60 border-b border-[#4d4639]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#999080]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search patron by name, email, phone, city..."
            className="w-full h-10 pl-9 pr-3 bg-[#111418] border border-[#4d4639] text-xs font-mono-data text-[#e1e2e8] focus:border-[#ffe09d] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {['All', 'VIP Gold', 'Platinum Connoisseur', 'Patron', 'New Client'].map(t => (
            <button
              key={t}
              onClick={() => setTierFilter(t)}
              className={`px-3 py-1.5 text-xs font-mono-data whitespace-nowrap transition-all ${
                tierFilter === t
                  ? 'bg-[#ffe09d] text-[#111111] font-bold'
                  : 'bg-[#111418] text-[#999080] hover:text-[#e1e2e8] border border-[#4d4639]/30'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Registry Table */}
      <div className="p-6 max-w-7xl">
        {loading ? (
          <div className="p-16 text-center text-[#999080] font-mono-data text-xs">
            Loading patron database...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center bg-[#191c20]/40 border border-[#4d4639]/30 font-mono-data">
            <Users className="w-8 h-8 text-[#999080] mx-auto mb-3 opacity-50" />
            <h3 className="text-sm font-bold text-[#e1e2e8] uppercase">No Customers Found</h3>
            <p className="text-xs text-[#999080] mt-1">Adjust search parameters or register a new patron.</p>
          </div>
        ) : (
          <div className="bg-[#191c20] border border-[#4d4639]/40 overflow-x-auto">
            <table className="w-full text-left font-mono-data text-xs">
              <thead className="bg-[#111418] text-[#999080] uppercase tracking-wider text-[10px] border-b border-[#4d4639]/30">
                <tr>
                  <th className="py-3 px-4">Patron Details</th>
                  <th className="py-3 px-4">Tier Status</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Orders</th>
                  <th className="py-3 px-4">Lifetime Spend</th>
                  <th className="py-3 px-4 text-right">Actions (Edit / Delete / Remove)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4d4639]/20">
                {filteredCustomers.map(cust => (
                  <tr key={cust.id} className="hover:bg-[#272a2e]/40 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#111418] border border-[#e5c378]/40 flex items-center justify-center font-bold text-[#ffe09d] text-xs">
                          {cust.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-syne font-bold text-[#e1e2e8]">{cust.name}</div>
                          <div className="text-[11px] text-[#999080] flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3 h-3 text-[#999080]" />
                            <span>{cust.email}</span>
                          </div>
                          <div className="text-[10px] text-[#999080] flex items-center gap-1.5 mt-0.5">
                            <Phone className="w-3 h-3 text-[#999080]" />
                            <span>{cust.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase font-bold border ${
                        cust.tier === 'Platinum Connoisseur' 
                          ? 'bg-[#ffe09d]/10 border-[#ffe09d] text-[#ffe09d]' 
                          : cust.tier === 'VIP Gold'
                            ? 'bg-[#8A6D2F]/20 border-[#C8A96B] text-[#FFE09D]'
                            : 'bg-[#111418] border-[#4d4639] text-[#999080]'
                      }`}>
                        <Crown className="w-3 h-3" />
                        <span>{cust.tier}</span>
                      </span>
                    </td>

                    <td className="py-4 px-4 text-[#e1e2e8]">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#999080]" />
                        <span>{cust.city}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 bg-[#111418] text-[#ffe09d] font-bold border border-[#4d4639]/30">
                        {cust.order_count} Orders
                      </span>
                    </td>

                    <td className="py-4 px-4 font-bold text-[#ffe09d]">
                      {formatPKR(cust.total_spent)}
                    </td>

                    {/* EDIT, DELETE, REMOVE BUTTONS AS REQUESTED */}
                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(cust)}
                          className="px-2.5 py-1.5 bg-[#111418] hover:bg-[#272a2e] text-[#ffe09d] border border-[#e5c378]/30 text-xs flex items-center gap-1 transition-all"
                          title="Edit Customer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDelete(cust.id, cust.name)}
                          className="px-2.5 py-1.5 bg-[#93000a]/20 hover:bg-[#93000a]/40 text-[#ffdad6] border border-[#93000a]/40 text-xs flex items-center gap-1 transition-all"
                          title="Delete / Remove Customer"
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

      {/* Add / Edit Customer Modal */}
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
              {editingCustomer ? 'Edit Patron Profile' : 'Enroll New Patron'}
            </h3>

            <form onSubmit={handleSaveCustomer} className="space-y-4 font-mono-data text-xs">
              <div>
                <label className="block text-[#999080] uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Dr. Ayesha Malik"
                  className="w-full h-10 px-3 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:border-[#ffe09d] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#999080] uppercase mb-1">Gmail / Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="patron@gmail.com"
                    className="w-full h-10 px-3 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:border-[#ffe09d] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#999080] uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full h-10 px-3 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:border-[#ffe09d] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#999080] uppercase mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Lahore / Karachi / Islamabad"
                    className="w-full h-10 px-3 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:border-[#ffe09d] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#999080] uppercase mb-1">VIP Tier</label>
                  <select
                    value={tier}
                    onChange={e => setTier(e.target.value as any)}
                    className="w-full h-10 px-2 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:outline-none"
                  >
                    <option value="VIP Gold">VIP Gold</option>
                    <option value="Platinum Connoisseur">Platinum Connoisseur</option>
                    <option value="Patron">Patron</option>
                    <option value="New Client">New Client</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#999080] uppercase mb-1">Total Lifetime Spend (PKR)</label>
                  <input
                    type="number"
                    value={totalSpent}
                    onChange={e => setTotalSpent(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#999080] uppercase mb-1">Order Count</label>
                  <input
                    type="number"
                    value={orderCount}
                    onChange={e => setOrderCount(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:outline-none"
                  />
                </div>
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
                  {editingCustomer ? 'Save Changes' : 'Enroll Patron'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patron Deletion Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(customerToDelete)}
        title="Remove Patron from Registry"
        message={`Are you sure you want to remove patron "${customerToDelete?.name}"? Their order history and tier status will be disassociated.`}
        confirmLabel="Remove Patron"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setCustomerToDelete(null)}
      />
    </div>
  );
}
