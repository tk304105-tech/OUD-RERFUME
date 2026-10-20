import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Package, MapPin, ShieldCheck, Heart, LogOut, ArrowRight, Clock, Truck, Sparkles, Plus, Check } from 'lucide-react';

export function AccountView() {
  const { 
    orders, 
    formatPKR, 
    setStorefrontView, 
    setLastPlacedOrder,
    user,
    loginWithGoogle,
    logout,
    updateUser,
    setIsAuthModalOpen,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile' | 'security'>('orders');

  // Form states for profile editing
  const [name, setName] = useState(user?.displayName || 'Tariq Al-Mansoor');
  const [phone, setPhone] = useState(user?.phone || '+92 300 8821940');
  const [isSaving, setIsSaving] = useState(false);

  // Address add form
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('Lahore');
  const [newProvince, setNewProvince] = useState('Punjab');
  const [newPhone, setNewPhone] = useState('+92 300 8821940');

  const customerName = user?.displayName || (user ? 'Valued Patron' : 'Guest Connoisseur');
  const customerEmail = user?.email || (user ? 'patron@auraoud.com' : 'Sign in with your User Gmail');
  const customerPhone = user?.phone || (user ? '+92 300 1234567' : 'Not Provided');
  const patronTier = user?.tier || 'Guest';

  // Addresses list
  const addresses = user?.addresses || [
    {
      title: 'Primary Residence (Lahore)',
      address_line: 'Villa 14, Sector Y, Phase 5, DHA',
      city: 'Lahore',
      province: 'Punjab',
      phone: '+92 300 8821940',
      is_primary: true
    },
    {
      title: 'Karachi Boutique Suite',
      address_line: 'B-42, 26th Street, Phase 6, DHA',
      city: 'Karachi',
      province: 'Sindh',
      phone: '+92 321 4559081',
      is_primary: false
    }
  ];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateUser({ displayName: name, phone });
    setIsSaving(false);
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim()) return;
    const updatedAddresses = [
      ...addresses,
      {
        title: newTitle || 'Residence',
        address_line: newAddress,
        city: newCity,
        province: newProvince,
        phone: newPhone,
        is_primary: false
      }
    ];
    await updateUser({ addresses: updatedAddresses });
    setIsAddingAddress(false);
    setNewAddress('');
    setNewTitle('');
    showToast('New shipping address saved to patron ledger', 'success');
  };

  return (
    <div className="bg-[#F8F5EF] min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Welcome Banner */}
        <div className="bg-white border border-[#E8E0D4] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#111111] text-[#FFE09D] flex items-center justify-center font-serif-luxury text-2xl font-bold border border-[#C8A96B]">
              {customerName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif-luxury text-2xl font-bold text-[#111111]">{customerName}</h1>
                <span className="px-2.5 py-0.5 bg-[#8A6D2F]/20 text-[#8A6D2F] font-mono-data text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{patronTier} Patron</span>
                </span>
              </div>
              <div className="text-xs text-[#6B6B6B] font-mono-data mt-0.5">
                {customerEmail} · {customerPhone}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono-data border-t sm:border-t-0 sm:border-l border-[#E8E0D4] pt-4 sm:pt-0 sm:pl-6">
            <div>
              <div className="text-[#6B6B6B] uppercase text-[10px]">Total Orders</div>
              <div className="text-base font-bold text-[#111111]">{orders.length} Dispatched</div>
            </div>
            <div>
              <div className="text-[#6B6B6B] uppercase text-[10px]">VIP Benefit</div>
              <div className="text-base font-bold text-[#8A6D2F]">10% Sitewide</div>
            </div>
            {user ? (
              <button
                onClick={() => logout()}
                className="px-3 py-1.5 border border-[#E8E0D4] hover:bg-[#F8F5EF] text-[#6B6B6B] hover:text-[#A33A3A] transition-colors uppercase text-[10px] tracking-wider"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3 py-1.5 bg-[#111111] text-[#FFE09D] hover:bg-[#8A6D2F] transition-colors uppercase text-[10px] tracking-wider font-bold"
              >
                Sign In as Patron
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E8E0D4] space-x-6 text-xs uppercase font-syne font-semibold tracking-wider">
          {[
            { id: 'orders', label: 'My Orders', icon: Package },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
            { id: 'profile', label: 'Patron Profile', icon: User },
            { id: 'security', label: 'Security & Database', icon: ShieldCheck }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === tab.id 
                    ? 'border-[#8A6D2F] text-[#8A6D2F] font-bold' 
                    : 'border-transparent text-[#6B6B6B] hover:text-[#111111]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white border border-[#E8E0D4] p-12 text-center space-y-4">
                <Package className="w-12 h-12 mx-auto text-[#8A6D2F] stroke-[1]" />
                <h3 className="font-serif-luxury text-xl font-bold text-[#111111]">No Orders on Record</h3>
                <p className="text-xs text-[#6B6B6B] max-w-sm mx-auto">
                  Your acquisitions from the atelier will appear here with live airway tracking and courier links.
                </p>
                <button
                  onClick={() => setStorefrontView('shop')}
                  className="px-6 py-2.5 bg-[#111111] text-[#FFE09D] hover:bg-[#8A6D2F] text-xs font-syne uppercase font-bold tracking-widest transition-all"
                >
                  Explore Fragrances
                </button>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white border border-[#E8E0D4] p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8E0D4] gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono-data text-base font-bold text-[#111111]">{order.order_number}</span>
                      <span className="px-2 py-0.5 bg-[#8A6D2F]/15 text-[#8A6D2F] font-mono-data text-xs font-bold uppercase">
                        {order.status}
                      </span>
                      <span className="text-xs text-[#6B6B6B] font-mono-data">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono-data text-sm font-bold text-[#111111]">
                        {formatPKR(order.total)}
                      </span>
                      <button
                        onClick={() => {
                          setLastPlacedOrder(order);
                          setStorefrontView('order-tracking');
                        }}
                        className="px-3 py-1.5 bg-[#F8F5EF] hover:bg-[#E8E0D4] text-[#111111] text-xs font-mono-data font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Truck className="w-3.5 h-3.5 text-[#8A6D2F]" />
                        <span>Track Parcel</span>
                      </button>
                    </div>
                  </div>

                  {/* Line Items */}
                  <div className="space-y-3">
                    {order.items.map(item => (
                      <div key={item.id} className="flex items-center justify-between text-xs font-mono-data">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt="" className="w-10 h-12 object-cover border border-[#E8E0D4]" />
                          <div>
                            <div className="font-bold text-[#111111] font-serif-luxury text-sm">{item.product_name}</div>
                            <div className="text-[#6B6B6B]">{item.size_ml}ml · Qty: {item.quantity} · {item.sku}</div>
                          </div>
                        </div>
                        <span className="text-[#111111] font-bold">
                          {formatPKR(item.price_snapshot * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#E8E0D4] flex items-center justify-between text-xs font-mono-data text-[#6B6B6B]">
                    <div>Destination: {order.shipping_address.city}, {order.shipping_address.province}</div>
                    <div>Payment: {order.payment_method} ({order.payment_status})</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {addresses.map((addr, idx) => (
                <div key={idx} className={`bg-white border p-6 space-y-2 relative ${addr.is_primary ? 'border-[#C8A96B]' : 'border-[#E8E0D4]'}`}>
                  {addr.is_primary && (
                    <span className="absolute top-4 right-4 px-2 py-0.5 bg-[#8A6D2F] text-white text-[10px] uppercase font-bold font-mono-data">
                      Primary Residence
                    </span>
                  )}
                  <h3 className="font-serif-luxury text-lg font-bold text-[#111111]">{addr.title}</h3>
                  <div className="text-xs text-[#6B6B6B] font-mono-data space-y-1">
                    <div>{addr.address_line}</div>
                    <div>{addr.city}, {addr.province}</div>
                    <div>Phone: {addr.phone}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Address Option */}
            {isAddingAddress ? (
              <form onSubmit={handleAddAddress} className="bg-white border border-[#C8A96B] p-6 max-w-xl space-y-4">
                <h3 className="font-serif-luxury text-lg font-bold text-[#111111]">Add New Delivery Residence</h3>
                <div className="space-y-3 font-mono-data text-xs">
                  <div>
                    <label className="block text-[#6B6B6B] mb-1">Residence Label</label>
                    <input
                      type="text"
                      placeholder="e.g. Islamabad Summer House"
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      className="w-full h-10 px-3 bg-[#F8F5EF] border border-[#E8E0D4]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#6B6B6B] mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. House 12, Street 4, F-7/2"
                      value={newAddress}
                      onChange={e => setNewAddress(e.target.value)}
                      className="w-full h-10 px-3 bg-[#F8F5EF] border border-[#E8E0D4]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#6B6B6B] mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={newCity}
                        onChange={e => setNewCity(e.target.value)}
                        className="w-full h-10 px-3 bg-[#F8F5EF] border border-[#E8E0D4]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#6B6B6B] mb-1">Province</label>
                      <input
                        type="text"
                        required
                        value={newProvince}
                        onChange={e => setNewProvince(e.target.value)}
                        className="w-full h-10 px-3 bg-[#F8F5EF] border border-[#E8E0D4]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#6B6B6B] mb-1">Contact Phone</label>
                    <input
                      type="text"
                      required
                      value={newPhone}
                      onChange={e => setNewPhone(e.target.value)}
                      className="w-full h-10 px-3 bg-[#F8F5EF] border border-[#E8E0D4]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#111111] text-[#FFE09D] hover:bg-[#8A6D2F] text-xs font-syne uppercase font-bold tracking-widest transition-all"
                  >
                    Save to Ledger
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="px-4 py-2.5 border border-[#E8E0D4] text-xs font-syne uppercase tracking-wider text-[#6B6B6B]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsAddingAddress(true)}
                className="px-4 py-3 border border-dashed border-[#8A6D2F] text-[#8A6D2F] hover:bg-[#8A6D2F]/10 text-xs font-syne uppercase tracking-wider font-bold flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Additional Residence Address</span>
              </button>
            )}
          </div>
        )}

        {/* Tab 3: Profile */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="bg-white border border-[#E8E0D4] p-8 max-w-xl space-y-4">
            <h3 className="font-serif-luxury text-xl font-bold text-[#111111]">Patron Details & Preferences</h3>
            <div className="space-y-3 font-mono-data text-xs">
              <div>
                <label className="text-[#6B6B6B] block mb-1">Full Legal / Display Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-[#111111] focus:border-[#C8A96B] focus:outline-none" 
                />
              </div>
              <div>
                <label className="text-[#6B6B6B] block mb-1">Authenticated Email</label>
                <input 
                  type="text" 
                  readOnly 
                  value={customerEmail} 
                  className="w-full h-10 px-3 bg-[#E8E0D4]/30 border border-[#E8E0D4] text-[#6B6B6B] cursor-not-allowed" 
                />
                <span className="text-[10px] text-[#8A6D2F] mt-1 block">Verified Patron Credential</span>
              </div>
              <div>
                <label className="text-[#6B6B6B] block mb-1">Mobile Phone (Pakistan SMS Tracking)</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-[#111111] focus:border-[#C8A96B] focus:outline-none" 
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#111111] text-[#FFE09D] hover:bg-[#8A6D2F] text-xs font-syne uppercase font-bold tracking-widest transition-all mt-4"
            >
              {isSaving ? 'Synchronizing...' : 'Update Patron Record'}
            </button>
          </form>
        )}

        {/* Tab 4: Security */}
        {activeTab === 'security' && (
          <div className="bg-white border border-[#E8E0D4] p-8 max-w-2xl space-y-5">
            <h3 className="font-serif-luxury text-xl font-bold text-[#111111]">Security & Database Integrity</h3>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              Aura Oud employs zero-trust cryptographic token authentication alongside Cloud Firestore rule validation and local storage failover.
            </p>
            
            <div className="space-y-3 font-mono-data text-xs">
              <div className="p-3 bg-[#F8F5EF] border border-[#2F6B4F] text-[#2F6B4F] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  <span>Encrypted Patron Identity Status</span>
                </div>
                <span className="font-bold">VERIFIED</span>
              </div>

              <div className="p-3 bg-[#F8F5EF] border border-[#E8E0D4] flex items-center justify-between text-[#111111]">
                <span>Data Schema Spec</span>
                <span className="text-[#8A6D2F] font-bold">firebase-blueprint.json v2.0</span>
              </div>

              <div className="p-3 bg-[#F8F5EF] border border-[#E8E0D4] flex items-center justify-between text-[#111111]">
                <span>Security Rules Engine</span>
                <span className="text-[#2F6B4F] font-bold">firestore.rules (RBAC Enforcement)</span>
              </div>

              <div className="p-3 bg-[#F8F5EF] border border-[#E8E0D4] flex items-center justify-between text-[#111111]">
                <span>Two-Factor SMS Verification</span>
                <span className="text-[#8A6D2F] font-bold">Mandatory &gt; PKR 15,000</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
