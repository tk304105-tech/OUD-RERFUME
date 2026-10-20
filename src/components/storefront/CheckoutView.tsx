import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { createStorefrontOrder, validateCoupon } from '../../api/mockApi';
import { PaymentMethod, ShippingAddress } from '../../types';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Banknote, 
  Building2, 
  Smartphone, 
  ArrowLeft, 
  CheckCircle2, 
  Lock, 
  AlertCircle, 
  Upload 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function CheckoutView() {
  const { 
    cart, 
    cartSubtotal, 
    formatPKR, 
    setStorefrontView, 
    setLastPlacedOrder, 
    clearCart,
    showToast,
    refreshProducts,
    refreshOrders,
    user
  } = useApp();

  // Contact Info
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(user?.phone || '03');
  const [isGuest, setIsGuest] = useState(!user);

  // Address
  const primaryAddr = user?.addresses?.find(a => a.is_primary) || user?.addresses?.[0];
  const [province, setProvince] = useState(primaryAddr?.province || 'Punjab');
  const [city, setCity] = useState(primaryAddr?.city || 'Lahore');
  const [otherCity, setOtherCity] = useState('');
  const [addressLine, setAddressLine] = useState(primaryAddr?.address_line || '');
  const [postalCode, setPostalCode] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Delivery & Payment
  const [deliveryMethod, setDeliveryMethod] = useState<'Standard (3-5 days)' | 'Express (24-48 hrs)'>('Standard (3-5 days)');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');
  const [proofFileUrl, setProofFileUrl] = useState<string>('');
  
  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Wallet
  const [walletPhone, setWalletPhone] = useState('');

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="font-serif-luxury text-3xl font-bold text-[#111111]">Your bag is currently empty</h2>
        <p className="text-xs text-[#6B6B6B]">Please add a fragrance flacon to your bag before proceeding to checkout.</p>
        <button
          onClick={() => setStorefrontView('shop')}
          className="px-6 py-2.5 bg-[#111111] text-white text-xs uppercase font-syne font-bold"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  // Delivery fees
  const isFreeStandard = cartSubtotal >= 5000;
  const isFreeExpress = cartSubtotal >= 8000;
  const shippingFee = deliveryMethod === 'Standard (3-5 days)' 
    ? (isFreeStandard ? 0 : 250) 
    : (isFreeExpress ? 0 : 450);

  // COD handling fee
  const codFee = paymentMethod === 'Cash on Delivery' ? (cartSubtotal > 8000 ? 0 : 150) : 0;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee + codFee);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    const res = await validateCoupon(couponCode, cartSubtotal);
    if (res.valid) {
      setDiscountAmount(res.discount);
      showToast(res.message, 'success');
      setErrorMessage('');
    } else {
      setErrorMessage(res.message);
      showToast(res.message, 'warning');
    }
  };

  const handleProofUploadSimulation = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Simulate receipt upload with placeholder preview
      setProofFileUrl('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80');
      showToast('Payment proof screenshot attached.', 'success');
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Phone validation for Pakistan: 03XX-XXXXXXX or 03XXXXXXXXX (11 digits)
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone.startsWith('03') || cleanPhone.length !== 11) {
      setErrorMessage('Please enter a valid Pakistani mobile number (e.g. 03001234567).');
      showToast('Invalid Pakistani mobile number.', 'error');
      return;
    }

    if (!addressLine.trim()) {
      setErrorMessage('Please enter complete delivery address.');
      return;
    }

    if (paymentMethod === 'Bank Transfer' && !proofFileUrl) {
      setErrorMessage('Please upload proof of bank transfer or screenshot.');
      return;
    }

    setIsSubmitting(true);

    try {
      const finalCity = city === 'Other' ? otherCity || 'Pakistan' : city;
      const order = await createStorefrontOrder({
        customer: {
          name,
          email,
          phone: `+92 ${cleanPhone.substring(1)}`,
          is_guest: isGuest
        },
        items: cart,
        shippingAddress: {
          name,
          phone: cleanPhone,
          province,
          city: finalCity,
          address_line: addressLine,
          postal_code: postalCode,
          special_instructions: specialInstructions
        },
        deliveryMethod,
        paymentMethod,
        couponCode: discountAmount > 0 ? couponCode : undefined,
        paymentProofUrl: proofFileUrl || undefined,
        notes: specialInstructions
      });

      // Fire victory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      clearCart();
      await refreshProducts();
      await refreshOrders();
      setLastPlacedOrder(order);
      setStorefrontView('order-success');
      showToast(`Order ${order.order_number} successfully placed!`, 'success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place order.');
      showToast('Order creation failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8F5EF] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <button
          onClick={() => setStorefrontView('shop')}
          className="inline-flex items-center gap-1.5 text-xs uppercase font-syne tracking-wider text-[#6B6B6B] hover:text-[#111111] mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Boutique Collection</span>
        </button>

        <div className="mb-8">
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#111111]">
            Secure Checkout
          </h1>
          <p className="text-xs text-[#6B6B6B] font-mono-data mt-1">
            Complimentary signature presentation packaging & 2ml tester included with all deliveries.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-[#A33A3A]/10 border border-[#A33A3A] text-[#A33A3A] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Form Fields (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Contact Information */}
            <div className="bg-white border border-[#E8E0D4] p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D4]">
                <h3 className="font-syne text-xs uppercase tracking-widest font-bold text-[#111111] flex items-center gap-2">
                  <span className="w-5 h-5 bg-[#111111] text-white flex items-center justify-center text-[11px]">1</span>
                  <span>Contact Information</span>
                </h3>
                <label className="flex items-center gap-1.5 text-xs text-[#6B6B6B] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isGuest}
                    onChange={(e) => setIsGuest(e.target.value === 'true' || e.target.checked)}
                    className="accent-[#8A6D2F] rounded-none"
                  />
                  <span>Checkout as Guest</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase font-mono-data text-[#6B6B6B] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tariq@example.pk"
                    className="w-full h-11 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-xs text-[#111111] focus:outline-none focus:border-[#8A6D2F]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono-data text-[#6B6B6B] mb-1">
                    Pakistani Mobile Phone * (for Courier SMS)
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03001234567"
                    maxLength={11}
                    className="w-full h-11 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-xs font-mono-data text-[#111111] focus:outline-none focus:border-[#8A6D2F]"
                  />
                  <span className="text-[10px] text-[#8A6D2F] font-mono-data mt-0.5 block">Format: 03XX-XXXXXXX (11 digits)</span>
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Destination */}
            <div className="bg-white border border-[#E8E0D4] p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D4]">
                <h3 className="font-syne text-xs uppercase tracking-widest font-bold text-[#111111] flex items-center gap-2">
                  <span className="w-5 h-5 bg-[#111111] text-white flex items-center justify-center text-[11px]">2</span>
                  <span>Delivery Address in Pakistan</span>
                </h3>
              </div>

              {user?.addresses && user.addresses.length > 0 && (
                <div className="p-3 bg-[#F8F5EF] border border-[#E8E0D4] space-y-1.5">
                  <span className="text-[10px] uppercase font-syne tracking-wider text-[#8A6D2F] font-bold block">
                    Select From Saved Patron Residences:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {user.addresses.map((addr, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setAddressLine(addr.address_line);
                          setCity(addr.city);
                          setProvince(addr.province);
                          setPhone(addr.phone);
                        }}
                        className="px-2.5 py-1 text-xs font-mono-data bg-white border border-[#C8A96B] hover:bg-[#8A6D2F] hover:text-white transition-all text-[#111111]"
                      >
                        {addr.title} ({addr.city})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase font-mono-data text-[#6B6B6B] mb-1">
                    Full Recipient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sheikh Tariq Al-Mansoor"
                    className="w-full h-11 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-xs text-[#111111] focus:outline-none focus:border-[#8A6D2F]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase font-mono-data text-[#6B6B6B] mb-1">
                      Province *
                    </label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full h-11 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-xs text-[#111111] focus:outline-none focus:border-[#8A6D2F] cursor-pointer"
                    >
                      <option value="Punjab">Punjab</option>
                      <option value="Sindh">Sindh</option>
                      <option value="Islamabad Capital Territory">Islamabad Capital Territory</option>
                      <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                      <option value="Balochistan">Balochistan</option>
                      <option value="Azad Jammu & Kashmir">Azad Jammu & Kashmir</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-mono-data text-[#6B6B6B] mb-1">
                      City *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-11 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-xs text-[#111111] focus:outline-none focus:border-[#8A6D2F] cursor-pointer"
                    >
                      <option value="Lahore">Lahore</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Multan">Multan</option>
                      <option value="Peshawar">Peshawar</option>
                      <option value="Quetta">Quetta</option>
                      <option value="Sialkot">Sialkot</option>
                      <option value="Gujranwala">Gujranwala</option>
                      <option value="Other">Other City...</option>
                    </select>
                  </div>
                </div>

                {city === 'Other' && (
                  <div>
                    <label className="block text-[11px] uppercase font-mono-data text-[#6B6B6B] mb-1">
                      Enter City Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={otherCity}
                      onChange={(e) => setOtherCity(e.target.value)}
                      placeholder="e.g. Abbottabad, Bahawalpur, Hyderabad"
                      className="w-full h-11 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-xs text-[#111111] focus:outline-none focus:border-[#8A6D2F]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] uppercase font-mono-data text-[#6B6B6B] mb-1">
                    Street Address / Sector / Phase / House # *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder="e.g. House 42-B, Street 14, Sector Y, Phase 5, DHA"
                    className="w-full h-11 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-xs text-[#111111] focus:outline-none focus:border-[#8A6D2F]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono-data text-[#6B6B6B] mb-1">
                    Special Delivery Notes / Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Call before delivery, near Lalik Jan Chowk"
                    className="w-full h-11 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-xs text-[#111111] focus:outline-none focus:border-[#8A6D2F]"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Courier Delivery Method */}
            <div className="bg-white border border-[#E8E0D4] p-6 space-y-4">
              <div className="pb-3 border-b border-[#E8E0D4]">
                <h3 className="font-syne text-xs uppercase tracking-widest font-bold text-[#111111] flex items-center gap-2">
                  <span className="w-5 h-5 bg-[#111111] text-white flex items-center justify-center text-[11px]">3</span>
                  <span>Delivery Method & Speed</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`p-4 border cursor-pointer transition-all flex flex-col justify-between ${
                  deliveryMethod === 'Standard (3-5 days)' 
                    ? 'border-[#8A6D2F] bg-[#F8F5EF] ring-1 ring-[#8A6D2F]' 
                    : 'border-[#E8E0D4] hover:border-[#C8A96B]'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-serif-luxury text-base font-bold text-[#111111]">Standard Tracked Courier</div>
                      <div className="text-xs text-[#6B6B6B] mt-0.5">3–5 Business Days via Leopards / Trax</div>
                    </div>
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'Standard (3-5 days)'}
                      onChange={() => setDeliveryMethod('Standard (3-5 days)')}
                      className="accent-[#8A6D2F]"
                    />
                  </div>
                  <div className="mt-3 font-mono-data text-xs font-bold text-[#8A6D2F]">
                    {isFreeStandard ? 'FREE (Orders > PKR 5,000)' : 'PKR 250'}
                  </div>
                </label>

                <label className={`p-4 border cursor-pointer transition-all flex flex-col justify-between ${
                  deliveryMethod === 'Express (24-48 hrs)' 
                    ? 'border-[#8A6D2F] bg-[#F8F5EF] ring-1 ring-[#8A6D2F]' 
                    : 'border-[#E8E0D4] hover:border-[#C8A96B]'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-serif-luxury text-base font-bold text-[#111111]">TCS Priority Overnight</div>
                      <div className="text-xs text-[#6B6B6B] mt-0.5">24–48 Hours Priority Air Freight</div>
                    </div>
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'Express (24-48 hrs)'}
                      onChange={() => setDeliveryMethod('Express (24-48 hrs)')}
                      className="accent-[#8A6D2F]"
                    />
                  </div>
                  <div className="mt-3 font-mono-data text-xs font-bold text-[#8A6D2F]">
                    {isFreeExpress ? 'FREE (Orders > PKR 8,000)' : 'PKR 450'}
                  </div>
                </label>
              </div>
            </div>

            {/* Step 4: Payment Method */}
            <div className="bg-white border border-[#E8E0D4] p-6 space-y-4">
              <div className="pb-3 border-b border-[#E8E0D4]">
                <h3 className="font-syne text-xs uppercase tracking-widest font-bold text-[#111111] flex items-center gap-2">
                  <span className="w-5 h-5 bg-[#111111] text-white flex items-center justify-center text-[11px]">4</span>
                  <span>Select Payment Method</span>
                </h3>
              </div>

              {/* Payment Type Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'Cash on Delivery', label: 'Cash on Delivery', icon: Banknote },
                  { id: 'Bank Transfer', label: 'Direct Bank Wire', icon: Building2 },
                  { id: 'JazzCash', label: 'JazzCash / Easy', icon: Smartphone },
                  { id: 'Credit/Debit Card', label: 'Card (Visa/MC)', icon: CreditCard }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPaymentMethod(item.id as PaymentMethod)}
                      className={`p-3 text-center border text-xs flex flex-col items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === item.id 
                          ? 'border-[#8A6D2F] bg-[#111111] text-[#FFE09D] font-bold' 
                          : 'border-[#E8E0D4] bg-[#F8F5EF] text-[#6B6B6B] hover:text-[#111111]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-mono-data text-[11px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Specific Payment Flow Containers */}
              {paymentMethod === 'Cash on Delivery' && (
                <div className="p-4 bg-[#F8F5EF] border border-[#E8E0D4] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#111111]">
                    <Banknote className="w-4 h-4 text-[#8A6D2F]" />
                    <span>Pay Exact Cash to Courier Upon Arrival</span>
                  </div>
                  <p className="text-xs text-[#6B6B6B] leading-relaxed">
                    You can pay the courier rider in cash upon unboxing your parcel anywhere in Pakistan.
                    {codFee > 0 ? ` (A nominal PKR ${codFee} insurance and secure cash handling fee applies).` : ' Complimentary COD on orders over PKR 8,000.'}
                  </p>
                </div>
              )}

              {paymentMethod === 'Bank Transfer' && (
                <div className="p-5 bg-[#F8F5EF] border border-[#C8A96B] space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-syne uppercase tracking-wider text-[#8A6D2F] font-bold">
                      Aura Oud Atelier Corporate Account
                    </span>
                    <div className="font-mono-data text-xs space-y-1 bg-white p-3 border border-[#E8E0D4]">
                      <div><strong>Bank:</strong> Meezan Bank Limited (Islamic Banking)</div>
                      <div><strong>Account Title:</strong> Aura Oud Parfums Private Limited</div>
                      <div><strong>Account Number:</strong> 0288-0105829101</div>
                      <div><strong>IBAN:</strong> PK64MEZN0002880105829101</div>
                      <div><strong>Branch:</strong> DHA Phase 5 Commercial, Lahore</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#111111]">
                      Upload Wire Transfer Screenshot / ATM Slip Proof: *
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="px-4 py-2.5 bg-white border border-[#8A6D2F] text-[#8A6D2F] text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-[#F8F5EF] transition-colors flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Select Receipt File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProofUploadSimulation}
                          className="hidden"
                        />
                      </label>
                      {proofFileUrl && (
                        <span className="text-xs text-[#2F6B4F] font-mono-data flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Meezan_wire_receipt_884.jpg attached</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#6B6B6B] block">Order will be held in "Awaiting Proof Verification" until finance validates the transaction.</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'JazzCash' && (
                <div className="p-4 bg-[#F8F5EF] border border-[#E8E0D4] space-y-3">
                  <span className="text-xs font-bold text-[#111111]">JazzCash Mobile Account Prompt</span>
                  <div>
                    <label className="text-[10px] uppercase font-mono-data text-[#6B6B6B] block mb-1">
                      Enter JazzCash Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={walletPhone}
                      onChange={(e) => setWalletPhone(e.target.value)}
                      placeholder="03001234567"
                      className="w-full h-10 px-3 bg-white border border-[#E8E0D4] text-xs font-mono-data focus:outline-none focus:border-[#8A6D2F]"
                    />
                    <span className="text-[10px] text-[#6B6B6B] block mt-1">An approval MPIN prompt will appear on your phone upon placing this order.</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'Credit/Debit Card' && (
                <div className="p-4 bg-[#F8F5EF] border border-[#E8E0D4] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111111]">Card Details (256-bit SSL Protected)</span>
                    <Lock className="w-4 h-4 text-[#8A6D2F]" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono-data text-[#6B6B6B] block mb-1">16-Digit Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 •••• •••• 4242"
                      maxLength={19}
                      className="w-full h-10 px-3 bg-white border border-[#E8E0D4] text-xs font-mono-data focus:outline-none focus:border-[#8A6D2F]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase font-mono-data text-[#6B6B6B] block mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        maxLength={5}
                        className="w-full h-10 px-3 bg-white border border-[#E8E0D4] text-xs font-mono-data focus:outline-none focus:border-[#8A6D2F]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-mono-data text-[#6B6B6B] block mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        maxLength={4}
                        className="w-full h-10 px-3 bg-white border border-[#E8E0D4] text-xs font-mono-data focus:outline-none focus:border-[#8A6D2F]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary (5 Cols) */}
          <div className="lg:col-span-5 bg-white border border-[#E8E0D4] p-6 sm:p-8 space-y-6 sticky top-28">
            <h3 className="font-syne text-xs uppercase tracking-widest font-bold text-[#111111] pb-3 border-b border-[#E8E0D4]">
              Order Summary ({cart.reduce((t, i) => t + i.quantity, 0)} Items)
            </h3>

            {/* Items List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.variant.id} className="flex items-center justify-between text-xs font-mono-data">
                  <div className="flex items-center gap-2.5">
                    <img src={item.product.images.main} alt="" className="w-10 h-12 object-cover border border-[#E8E0D4]" />
                    <div>
                      <div className="font-bold text-[#111111] font-serif-luxury text-sm line-clamp-1">{item.product.name}</div>
                      <div className="text-[10px] text-[#8A6D2F]">{item.variant.size_ml}ml · Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <span className="font-bold text-[#111111]">
                    {formatPKR((item.variant.sale_price || item.variant.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Code Input */}
            <div className="pt-3 border-t border-[#E8E0D4] space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon (e.g. AURA10)"
                  className="flex-1 h-9 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-xs uppercase font-mono-data focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-3 bg-[#111111] text-white text-xs font-semibold uppercase hover:bg-[#8A6D2F] transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-3 border-t border-[#E8E0D4] space-y-2 text-xs font-mono-data">
              <div className="flex justify-between text-[#6B6B6B]">
                <span>Merchandise Subtotal</span>
                <span className="text-[#111111] font-medium">{formatPKR(cartSubtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#2F6B4F]">
                  <span>Voucher / VIP Discount</span>
                  <span>- {formatPKR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#6B6B6B]">
                <span>Shipping ({deliveryMethod.split(' ')[0]})</span>
                <span>{shippingFee === 0 ? 'FREE' : formatPKR(shippingFee)}</span>
              </div>
              {codFee > 0 && (
                <div className="flex justify-between text-[#6B6B6B]">
                  <span>COD Handling Insurance</span>
                  <span>{formatPKR(codFee)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-[#E8E0D4] flex justify-between text-base font-bold text-[#111111]">
                <span className="font-serif-luxury text-lg">Grand Total</span>
                <span className="text-lg text-[#8A6D2F]">{formatPKR(grandTotal)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#111111] hover:bg-[#8A6D2F] text-[#FFFFFF] text-xs uppercase font-syne font-bold tracking-widest transition-all shadow-xl flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Reserving Batch Stock & Finalizing...</span>
              ) : (
                <span>Place Order · {formatPKR(grandTotal)}</span>
              )}
            </button>

            <div className="text-center text-[10px] text-[#6B6B6B] font-mono-data space-y-1">
              <div>By placing this order you agree to Aura Oud Atelier's client charter.</div>
              <div className="text-[#8A6D2F] font-semibold">Overnight courier tracking SMS sent upon dispatch.</div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
