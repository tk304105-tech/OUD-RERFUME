import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { validateCoupon } from '../../api/mockApi';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Check } from 'lucide-react';

export function CartDrawer() {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    cartSubtotal, 
    formatPKR, 
    setStorefrontView,
    clearCart,
    showToast
  } = useApp();

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponFeedback, setCouponFeedback] = useState<{ message: string; valid: boolean } | null>(null);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 5000;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const res = await validateCoupon(couponCode, cartSubtotal);
    setCouponFeedback({ message: res.message, valid: res.valid });
    if (res.valid) {
      setAppliedDiscount(res.discount);
      showToast(res.message, 'success');
    } else {
      setAppliedDiscount(0);
      showToast(res.message, 'warning');
    }
  };

  const estimatedTotal = Math.max(0, cartSubtotal - appliedDiscount);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-[#111111]/70 backdrop-blur-sm transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFFFF] border-l border-[#E8E0D4] shadow-2xl flex flex-col justify-between">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#E8E0D4] bg-[#F8F5EF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#8A6D2F]" />
              <h2 className="font-serif-luxury text-xl font-bold uppercase tracking-wider text-[#111111]">
                Your Shopping Bag
              </h2>
              <span className="font-mono-data text-xs text-[#6B6B6B]">
                ({cart.reduce((total, item) => total + item.quantity, 0)})
              </span>
            </div>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#6B6B6B] hover:text-[#111111] transition-colors"
              aria-label="Close Shopping Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-6 py-3.5 bg-[#111111] text-[#E8E0D4] border-b border-[#262626]">
            <div className="flex items-center justify-between text-xs font-mono-data mb-1.5">
              {amountToFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-[#FFE09D]">{formatPKR(amountToFreeShipping)}</strong> for Complimentary Express Delivery
                </span>
              ) : (
                <span className="text-[#2EE59D] font-bold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Complimentary Express Shipping Unlocked!</span>
                </span>
              )}
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#272A2E] h-1.5 overflow-hidden">
              <div 
                className="bg-[#C8A96B] h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-[#E8E0D4]">
            {cart.length > 0 ? (
              cart.map((item) => {
                const price = item.variant.sale_price || item.variant.price;
                return (
                  <div key={item.variant.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                    {/* Thumbnail */}
                    <div className="w-20 h-24 bg-[#F8F5EF] border border-[#E8E0D4] flex-shrink-0 overflow-hidden">
                      <img 
                        src={item.product.images.main} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <h4 className="font-serif-luxury font-bold text-sm text-[#111111] line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.variant.id)}
                            className="text-[#6B6B6B] hover:text-[#A33A3A] p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-[11px] text-[#8A6D2F] font-mono-data mt-0.5">
                          {item.variant.size_ml}ML · {item.variant.sku}
                        </div>
                        <div className="text-xs font-mono-data text-[#111111] font-bold mt-1">
                          {formatPKR(price)}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E8E0D4]/60">
                        <div className="flex items-center border border-[#E8E0D4] h-7 bg-[#F8F5EF]">
                          <button
                            onClick={() => updateCartQuantity(item.variant.id, item.quantity - 1)}
                            className="px-2 text-xs font-bold text-[#6B6B6B] hover:text-[#111111]"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-xs font-mono-data font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.variant.id, item.quantity + 1)}
                            disabled={item.quantity >= item.variant.stock}
                            className="px-2 text-xs font-bold text-[#6B6B6B] hover:text-[#111111]"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-mono-data text-xs font-bold text-[#111111]">
                          Total: {formatPKR(price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-20 text-center space-y-4">
                <ShoppingBag className="w-12 h-12 mx-auto text-[#E8E0D4]" />
                <h3 className="font-serif-luxury text-xl font-bold text-[#111111]">
                  Your fragrance wishlist is empty
                </h3>
                <p className="text-xs text-[#6B6B6B] max-w-xs mx-auto">
                  Explore our curated extraits, aged attars, and discovery sets crafted with pure agarwood.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setStorefrontView('shop');
                  }}
                  className="px-6 py-2.5 bg-[#111111] text-[#E8E0D4] text-xs font-semibold uppercase tracking-wider hover:bg-[#8A6D2F] transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            )}
          </div>

          {/* Drawer Footer & Checkout Controls */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#F8F5EF] border-t border-[#E8E0D4] space-y-4">
              
              {/* Promo Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-[#8A6D2F] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Promo Code (e.g. AURA10)"
                      className="w-full h-9 pl-9 pr-2 bg-white border border-[#E8E0D4] text-xs uppercase font-mono-data focus:outline-none focus:border-[#8A6D2F]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 bg-[#111111] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#8A6D2F] transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponFeedback && (
                  <p className={`text-[11px] font-mono-data ${couponFeedback.valid ? 'text-[#2F6B4F]' : 'text-[#A33A3A]'}`}>
                    {couponFeedback.message}
                  </p>
                )}
              </form>

              {/* Computations */}
              <div className="space-y-1.5 text-xs font-mono-data">
                <div className="flex justify-between text-[#6B6B6B]">
                  <span>Subtotal</span>
                  <span className="text-[#111111] font-semibold">{formatPKR(cartSubtotal)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-[#2F6B4F]">
                    <span>Coupon Discount</span>
                    <span>- {formatPKR(appliedDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#6B6B6B]">
                  <span>Shipping Across Pakistan</span>
                  <span>{cartSubtotal >= freeShippingThreshold ? 'FREE' : formatPKR(250)}</span>
                </div>
                <div className="pt-2 border-t border-[#E8E0D4] flex justify-between text-sm font-bold text-[#111111]">
                  <span className="font-serif-luxury text-base">Estimated Total</span>
                  <span className="text-base text-[#8A6D2F]">{formatPKR(estimatedTotal + (cartSubtotal >= freeShippingThreshold ? 0 : 250))}</span>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setStorefrontView('checkout');
                }}
                className="w-full py-4 bg-[#111111] hover:bg-[#8A6D2F] text-[#FFFFFF] text-xs uppercase font-syne font-bold tracking-widest transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[10px] text-[#6B6B6B] font-mono-data flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2F6B4F]" />
                <span>Cash on Delivery · Bank Transfer · Card Secured</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
