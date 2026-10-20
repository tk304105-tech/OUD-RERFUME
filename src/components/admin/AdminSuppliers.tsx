import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SupplierRecord, SupplierAddress } from '../../types';
import { getSuppliers, saveSupplier, deleteSupplier } from '../../api/mockApi';
import { ConfirmModal } from '../common/ConfirmModal';
import { 
  Truck, 
  MapPin, 
  Mail, 
  Phone, 
  Building2, 
  Clock, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  CheckCircle2, 
  X, 
  ExternalLink,
  ShieldCheck,
  Star
} from 'lucide-react';

export function AdminSuppliers() {
  const { showToast } = useApp();
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Edit / Add Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<SupplierRecord | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState<SupplierRecord['category']>('Raw Materials & Essences');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [facilityUnit, setFacilityUnit] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [stateProvince, setStateProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('France');
  const [leadTimeDays, setLeadTimeDays] = useState(14);
  const [paymentTerms, setPaymentTerms] = useState('Net 30 Days');
  const [moq, setMoq] = useState('5 Litres');
  const [status, setStatus] = useState<SupplierRecord['status']>('Active');
  const [rawMaterialsStr, setRawMaterialsStr] = useState('');

  const loadData = async () => {
    setLoading(true);
    const data = await getSuppliers();
    setSuppliers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingSupplier(null);
    setName('');
    setCode(`SUP-${Math.floor(100 + Math.random() * 900)}`);
    setCategory('Raw Materials & Essences');
    setContactPerson('');
    setEmail('');
    setPhone('');
    setStreet('');
    setFacilityUnit('');
    setDistrict('');
    setCity('');
    setStateProvince('');
    setPostalCode('');
    setCountry('France');
    setLeadTimeDays(14);
    setPaymentTerms('Net 30 Days');
    setMoq('5 Litres');
    setStatus('Active');
    setRawMaterialsStr('');
    setIsModalOpen(true);
  };

  const openEditModal = (supp: SupplierRecord) => {
    setEditingSupplier(supp);
    setName(supp.name);
    setCode(supp.code);
    setCategory(supp.category);
    setContactPerson(supp.contact_person);
    setEmail(supp.email);
    setPhone(supp.phone);
    setStreet(supp.address?.street || '');
    setFacilityUnit(supp.address?.facility_unit || '');
    setDistrict(supp.address?.district || '');
    setCity(supp.address?.city || '');
    setStateProvince(supp.address?.state_province || '');
    setPostalCode(supp.address?.postal_code || '');
    setCountry(supp.address?.country || 'France');
    setLeadTimeDays(supp.lead_time_days || 14);
    setPaymentTerms(supp.payment_terms || 'Net 30 Days');
    setMoq(supp.minimum_order_quantity || '5 Litres');
    setStatus(supp.status);
    setRawMaterialsStr(supp.raw_materials?.join(', ') || '');
    setIsModalOpen(true);
  };

  const [supplierToDelete, setSupplierToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = (id: string, supplierName: string) => {
    setSupplierToDelete({ id, name: supplierName });
  };

  const handleConfirmDelete = async () => {
    if (!supplierToDelete) return;
    setIsDeleting(true);
    try {
      await deleteSupplier(supplierToDelete.id);
      setSuppliers(prev => prev.filter(s => s.id !== supplierToDelete.id));
      showToast(`Supplier "${supplierToDelete.name}" deleted successfully`, 'info');
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete supplier', 'error');
    } finally {
      setIsDeleting(false);
      setSupplierToDelete(null);
    }
  };

  const handleSaveSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Supplier Name is required', 'error');
      return;
    }

    const supplierAddress: SupplierAddress = {
      street: street.trim() || 'Grasse Fragrance Park',
      facility_unit: facilityUnit.trim() || undefined,
      district: district.trim() || 'Distillery Quarter',
      city: city.trim() || 'Grasse',
      state_province: stateProvince.trim() || 'Provence',
      postal_code: postalCode.trim() || '06130',
      country: country.trim() || 'France'
    };

    const rawMaterialsList = rawMaterialsStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const saved = await saveSupplier({
      id: editingSupplier?.id,
      name: name.trim(),
      code: code.trim() || `SUP-${Math.floor(100 + Math.random() * 900)}`,
      category,
      contact_person: contactPerson.trim() || 'Procurement Rep',
      email: email.trim() || 'procurement@supplier.com',
      phone: phone.trim() || '+33 4 93 00 00 00',
      address: supplierAddress,
      lead_time_days: Number(leadTimeDays) || 14,
      payment_terms: paymentTerms.trim() || 'Net 30',
      minimum_order_quantity: moq.trim() || '5 Litres',
      status,
      raw_materials: rawMaterialsList.length > 0 ? rawMaterialsList : ['Agarwood Extract', 'Taif Rose Otto'],
      rating: editingSupplier ? editingSupplier.rating : 5.0
    });

    if (editingSupplier) {
      setSuppliers(prev => prev.map(s => s.id === saved.id ? saved : s));
      showToast(`Supplier "${saved.name}" updated successfully with full address`, 'success');
    } else {
      setSuppliers(prev => [saved, ...prev]);
      showToast(`Supplier "${saved.name}" added successfully with verified address`, 'success');
    }

    setIsModalOpen(false);
  };

  const filteredSuppliers = suppliers.filter(s => {
    if (categoryFilter !== 'All' && s.category !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const addr = s.address;
      const addrMatch = addr ? (
        addr.street.toLowerCase().includes(q) ||
        addr.city.toLowerCase().includes(q) ||
        addr.country.toLowerCase().includes(q) ||
        addr.postal_code.toLowerCase().includes(q)
      ) : false;

      return s.name.toLowerCase().includes(q) ||
             s.contact_person.toLowerCase().includes(q) ||
             s.email.toLowerCase().includes(q) ||
             s.code.toLowerCase().includes(q) ||
             addrMatch;
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full bg-[#111418] text-[#e1e2e8] min-h-screen">
      {/* Top Header */}
      <div className="px-6 py-6 bg-[#0b0e12]/90 border-b border-[#4d4639]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-data text-[#999080] uppercase tracking-widest">
            <Truck className="w-4 h-4 text-[#ffe09d]" />
            <span>Atelier Supply Chain & Grasse Partner Vaults</span>
          </div>
          <h1 className="font-syne text-2xl sm:text-3xl font-bold uppercase text-[#e1e2e8] mt-1">
            Suppliers & Provenance Directory
          </h1>
          <p className="text-xs text-[#999080] font-mono-data mt-0.5">
            Verified addresses, distillation facilities & raw essence lead-times across Grasse, Parma, Dubai & Lahore
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#8A6D2F] hover:bg-[#C8A96B] text-white text-xs font-syne uppercase font-bold tracking-wider flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Supplier</span>
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
            placeholder="Search suppliers by name, address, city, country, contact..."
            className="w-full h-10 pl-9 pr-3 bg-[#111418] border border-[#4d4639] text-xs font-mono-data text-[#e1e2e8] focus:border-[#ffe09d] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {['All', 'Raw Materials & Essences', 'Glass Flacons & Caps', 'Solvents & Alcohol', 'Packaging & Boxes'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-mono-data whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-[#ffe09d] text-[#111111] font-bold'
                  : 'bg-[#111418] text-[#999080] hover:text-[#e1e2e8] border border-[#4d4639]/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Suppliers Cards Grid */}
      <div className="p-6 max-w-7xl">
        {loading ? (
          <div className="p-16 text-center text-[#999080] font-mono-data text-xs">
            Loading supplier provenance & facility directory...
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="p-12 text-center bg-[#191c20]/40 border border-[#4d4639]/30 font-mono-data">
            <Building2 className="w-8 h-8 text-[#999080] mx-auto mb-3 opacity-50" />
            <h3 className="text-sm font-bold text-[#e1e2e8] uppercase">No Suppliers Found</h3>
            <p className="text-xs text-[#999080] mt-1">Adjust search filter or register a new partner.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSuppliers.map(supp => {
              const addr = supp.address;
              return (
                <div 
                  key={supp.id}
                  className="bg-[#191c20] border border-[#4d4639]/40 p-5 flex flex-col justify-between hover:border-[#ffe09d]/50 transition-all space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header Strip */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-[#111418] border border-[#e5c378]/30 text-[#ffe09d] text-[10px] font-mono-data uppercase font-bold">
                            {supp.code}
                          </span>
                          <span className="text-[10px] font-mono-data text-[#999080] uppercase">
                            {supp.category}
                          </span>
                        </div>
                        <h3 className="font-syne text-lg font-bold text-[#e1e2e8] mt-1">
                          {supp.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => openEditModal(supp)}
                          className="p-2 bg-[#111418] hover:bg-[#272a2e] text-[#ffe09d] border border-[#4d4639] transition-all"
                          title="Edit Supplier & Address"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(supp.id, supp.name)}
                          className="p-2 bg-[#93000a]/20 hover:bg-[#93000a]/40 text-[#ffdad6] border border-[#93000a]/40 transition-all"
                          title="Delete / Remove Supplier"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* COMPLETE DETAILED SUPPLIER ADDRESS SECTION */}
                    <div className="p-3.5 bg-[#111418] border border-[#4d4639]/40 rounded-none space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-mono-data font-bold text-[#ffe09d] uppercase">
                        <MapPin className="w-3.5 h-3.5 text-[#e5c378]" />
                        <span>Registered Facility & Distillation Address:</span>
                      </div>
                      
                      {addr ? (
                        <div className="font-mono-data text-xs text-[#d0c5b4] leading-relaxed pl-5">
                          <div>
                            <span className="text-[#999080]">Street: </span>
                            <span className="text-[#e1e2e8] font-semibold">{addr.street}</span>
                            {addr.facility_unit && <span className="text-[#ffe09d]"> ({addr.facility_unit})</span>}
                          </div>
                          <div>
                            <span className="text-[#999080]">District / Area: </span>
                            <span>{addr.district}</span>
                          </div>
                          <div>
                            <span className="text-[#999080]">City & Postal Code: </span>
                            <span className="text-white font-bold">{addr.city}</span>, <span>{addr.postal_code}</span>
                          </div>
                          <div>
                            <span className="text-[#999080]">State / Country: </span>
                            <span className="text-[#ffe09d]">{addr.state_province}, {addr.country}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-[#93000a] pl-5 font-mono-data">No address configured. Click Edit to add.</div>
                      )}
                    </div>

                    {/* Contact & Terms Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono-data text-[#999080] pt-1">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-[#999080]" />
                        <span className="text-[#e1e2e8] truncate">{supp.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#999080]" />
                        <span className="text-[#e1e2e8]">{supp.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#999080]" />
                        <span>Lead Time: <strong className="text-[#ffe09d]">{supp.lead_time_days} Days</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#999080]" />
                        <span>MOQ: <strong className="text-[#e1e2e8]">{supp.minimum_order_quantity}</strong></span>
                      </div>
                    </div>

                    {/* Raw Materials Supplied Tags */}
                    {supp.raw_materials && supp.raw_materials.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[10px] font-mono-data text-[#999080] uppercase block mb-1">
                          Essences & Raw Components Provided:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {supp.raw_materials.map((mat, mIdx) => (
                            <span 
                              key={mIdx}
                              className="px-2 py-0.5 bg-[#111418] border border-[#4d4639]/30 text-[10px] font-mono-data text-[#d0c5b4]"
                            >
                              {mat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Terms & Actions */}
                  <div className="pt-3 border-t border-[#4d4639]/20 flex items-center justify-between text-[11px] font-mono-data">
                    <span className="text-[#999080]">Terms: {supp.payment_terms}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(supp)}
                        className="text-xs text-[#ffe09d] hover:underline uppercase font-bold"
                      >
                        Edit Details
                      </button>
                      <span className="text-[#4d4639]">·</span>
                      <button
                        onClick={() => handleDelete(supp.id, supp.name)}
                        className="text-xs text-[#ffdad6] hover:underline uppercase"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Supplier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#111418] border border-[#e5c378]/40 p-6 max-w-2xl w-full shadow-2xl relative my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#999080] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-syne text-xl font-bold uppercase text-[#ffe09d] mb-4">
              {editingSupplier ? 'Edit Supplier & Facility Address' : 'Register New Partner Supplier'}
            </h3>

            <form onSubmit={handleSaveSupplier} className="space-y-4 font-mono-data text-xs">
              {/* Row 1: Name and Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[#999080] uppercase mb-1">Supplier Company Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Laboratoires Grasse Essences S.A."
                    className="w-full h-10 px-3 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:border-[#ffe09d] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#999080] uppercase mb-1">Partner Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="SUP-FRA-01"
                    className="w-full h-10 px-3 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:border-[#ffe09d] focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Category & Contact Person */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#999080] uppercase mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full h-10 px-2 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:outline-none"
                  >
                    <option value="Raw Materials & Essences">Raw Materials & Essences</option>
                    <option value="Glass Flacons & Caps">Glass Flacons & Caps</option>
                    <option value="Solvents & Alcohol">Solvents & Alcohol</option>
                    <option value="Packaging & Boxes">Packaging & Boxes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#999080] uppercase mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={e => setContactPerson(e.target.value)}
                    placeholder="e.g. Jean-Luc Moreau (Master Distiller)"
                    className="w-full h-10 px-3 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:border-[#ffe09d] focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Email and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#999080] uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="procurement@supplier.com"
                    className="w-full h-10 px-3 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:border-[#ffe09d] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#999080] uppercase mb-1">Phone / Telephone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+33 4 93 36 12 40"
                    className="w-full h-10 px-3 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:border-[#ffe09d] focus:outline-none"
                  />
                </div>
              </div>

              {/* DETAILED SUPPLIER ADDRESS SECTION IN MODAL */}
              <div className="p-4 bg-[#191c20] border border-[#4d4639] space-y-3">
                <div className="text-xs font-bold text-[#ffe09d] uppercase flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#e5c378]" />
                  <span>Physical Facility & Plant Address</span>
                </div>

                <div>
                  <label className="block text-[#999080] uppercase mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                    placeholder="e.g. 42 Route de Cannes, Parc Industriel Aromatique"
                    className="w-full h-10 px-3 bg-[#111418] border border-[#4d4639] text-[#e1e2e8] focus:border-[#ffe09d] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#999080] uppercase mb-1">Facility / Unit / Gate</label>
                    <input
                      type="text"
                      value={facilityUnit}
                      onChange={e => setFacilityUnit(e.target.value)}
                      placeholder="e.g. Distillerie Bâtiment C"
                      className="w-full h-10 px-3 bg-[#111418] border border-[#4d4639] text-[#e1e2e8] focus:border-[#ffe09d] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#999080] uppercase mb-1">District / Zone</label>
                    <input
                      type="text"
                      value={district}
                      onChange={e => setDistrict(e.target.value)}
                      placeholder="e.g. Les Bois de Grasse"
                      className="w-full h-10 px-3 bg-[#111418] border border-[#4d4639] text-[#e1e2e8] focus:border-[#ffe09d] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[#999080] uppercase mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="e.g. Grasse"
                      className="w-full h-10 px-3 bg-[#111418] border border-[#4d4639] text-[#e1e2e8] focus:border-[#ffe09d] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#999080] uppercase mb-1">State / Region</label>
                    <input
                      type="text"
                      value={stateProvince}
                      onChange={e => setStateProvince(e.target.value)}
                      placeholder="e.g. Côte d’Azur"
                      className="w-full h-10 px-3 bg-[#111418] border border-[#4d4639] text-[#e1e2e8] focus:border-[#ffe09d] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#999080] uppercase mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={e => setPostalCode(e.target.value)}
                      placeholder="06130"
                      className="w-full h-10 px-3 bg-[#111418] border border-[#4d4639] text-[#e1e2e8] focus:border-[#ffe09d] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#999080] uppercase mb-1">Country *</label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      placeholder="France / Italy / UAE / Pakistan"
                      className="w-full h-10 px-3 bg-[#111418] border border-[#4d4639] text-[#e1e2e8] focus:border-[#ffe09d] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Row: Commercial Terms */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#999080] uppercase mb-1">Lead Time (Days)</label>
                  <input
                    type="number"
                    value={leadTimeDays}
                    onChange={e => setLeadTimeDays(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#999080] uppercase mb-1">Payment Terms</label>
                  <input
                    type="text"
                    value={paymentTerms}
                    onChange={e => setPaymentTerms(e.target.value)}
                    placeholder="Net 30 Days / LC"
                    className="w-full h-10 px-3 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#999080] uppercase mb-1">Min Order Qty (MOQ)</label>
                  <input
                    type="text"
                    value={moq}
                    onChange={e => setMoq(e.target.value)}
                    placeholder="5 Litres / 1000 Bottles"
                    className="w-full h-10 px-3 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#999080] uppercase mb-1">Supplied Raw Materials (comma-separated)</label>
                <input
                  type="text"
                  value={rawMaterialsStr}
                  onChange={e => setRawMaterialsStr(e.target.value)}
                  placeholder="Aged Cambodian Oud, Taif Rose Otto, French Bergamot Reggio"
                  className="w-full h-10 px-3 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#4d4639]/30">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-[#191c20] text-[#999080] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#8A6D2F] hover:bg-[#C8A96B] text-white font-syne uppercase font-bold"
                >
                  {editingSupplier ? 'Save Changes' : 'Register Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supplier Deletion Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(supplierToDelete)}
        title="Remove Supplier from Registry"
        message={`Are you sure you want to remove supplier "${supplierToDelete?.name}"? All associated procurement contracts and lead times will be archived.`}
        confirmLabel="Remove Supplier"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setSupplierToDelete(null)}
      />
    </div>
  );
}
