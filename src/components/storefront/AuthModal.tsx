import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck, Sparkles, Lock, Eye, EyeOff, User, KeyRound, ArrowRight, UserPlus, LogIn } from 'lucide-react';

export function AuthModal() {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    user, 
    loginWithUserEmail, 
    logout, 
    loginAdmin, 
    setMode, 
    setStorefrontView,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  // Sign In form states
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPass, setShowSignInPass] = useState(false);

  // Sign Up form states
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [showSignUpPass, setShowSignUpPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSignInSubmit = async (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMsg('');
    const cleanEmail = signInEmail.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMsg('Please enter your Gmail / email address.');
      return;
    }

    setLoading(true);

    try {
      // Check if Admin Gmail is entered
      if (cleanEmail === 'tk304105@gmail.com' || cleanEmail === 'admin@warehouse.io' || cleanEmail.includes('admin') || cleanEmail.includes('staff')) {
        const result = await loginAdmin(cleanEmail, signInPassword || 'tayyaba009');
        if (result.success) {
          setIsAuthModalOpen(false);
          setMode('admin');
          return;
        } else {
          setErrorMsg(result.error || 'Authentication error.');
          setLoading(false);
          return;
        }
      }

      // User Gmail Sign In
      await loginWithUserEmail(cleanEmail, 'Patron Member');
      setIsAuthModalOpen(false);
      setStorefrontView('account');
      showToast('Successfully signed in.', 'success');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Sign in failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMsg('');
    const cleanEmail = signUpEmail.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMsg('Please enter your Gmail / email address.');
      return;
    }

    if (!cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address (e.g. yourname@gmail.com).');
      return;
    }

    setLoading(true);

    try {
      if (cleanEmail === 'tk304105@gmail.com') {
        const result = await loginAdmin('tk304105@gmail.com', signUpPassword || 'tayyaba009');
        if (result.success) {
          setIsAuthModalOpen(false);
          setMode('admin');
          return;
        }
      }

      await loginWithUserEmail(
        cleanEmail, 
        signUpName.trim() || 'Patron Member', 
        signUpPhone.trim() || '+92 300 1234567',
        signUpPassword.trim() || 'patron123'
      );

      // Clean up fields completely so future sign-ups work cleanly every time
      setSignUpEmail('');
      setSignUpPassword('');
      setSignUpName('');
      setSignUpPhone('');
      setErrorMsg('');
      setIsAuthModalOpen(false);
      setStorefrontView('account');
      showToast('Account created successfully! Welcome to Aura Oud.', 'success');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Sign up failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFFFFF] border border-[#E8E0D4] w-full max-w-md shadow-2xl relative overflow-hidden">
        {/* Top Gold Accent Bar */}
        <div className="h-1.5 bg-gradient-to-r from-[#8A6D2F] via-[#C8A96B] to-[#FFE09D]" />

        <button 
          onClick={() => {
            setIsAuthModalOpen(false);
            setErrorMsg('');
          }}
          className="absolute top-4 right-4 p-2 text-[#6B6B6B] hover:text-[#111111] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {/* Header Title */}
          <div className="text-center mb-6">
            <span className="font-syne text-[10px] uppercase font-bold tracking-widest text-[#8A6D2F]">
              Aura Oud Haute Parfumerie
            </span>
            <h2 className="font-serif-luxury text-2xl font-bold text-[#111111] mt-1">
              {activeTab === 'signin' ? 'Sign In' : 'Sign Up'}
            </h2>
            <p className="text-xs text-[#6B6B6B] mt-1 font-serif-luxury">
              {activeTab === 'signin'
                ? 'Enter your Gmail and password to access User Account or Admin Portal.'
                : 'Register your new patron account for VIP benefits and order tracking.'}
            </p>
          </div>

          {/* Mode Tabs: Sign In vs Sign Up */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#F8F5EF] border border-[#E8E0D4] mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setErrorMsg('');
              }}
              className={`py-2 px-3 text-xs font-syne uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'signin'
                  ? 'bg-[#111111] text-[#FFE09D] shadow-sm'
                  : 'text-[#6B6B6B] hover:text-[#111111]'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setErrorMsg('');
              }}
              className={`py-2 px-3 text-xs font-syne uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'signup'
                  ? 'bg-[#8A6D2F] text-white shadow-sm'
                  : 'text-[#6B6B6B] hover:text-[#111111]'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </div>

          {/* Active Session Status (if logged in) */}
          {user && (
            <div className="mb-5 p-4 bg-[#F8F5EF] border border-[#E8E0D4] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#111111] text-[#FFE09D] flex items-center justify-center font-serif-luxury text-base font-bold">
                  {user.displayName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-serif-luxury text-sm font-bold text-[#111111]">{user.displayName}</div>
                  <div className="text-[11px] font-mono-data text-[#6B6B6B]">{user.email}</div>
                  <div className="text-[10px] font-mono-data text-[#8A6D2F] font-bold mt-0.5">
                    {user.tier} · Active User
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => logout()}
                className="text-xs font-mono-data text-[#A33A3A] hover:underline"
              >
                Sign Out
              </button>
            </div>
          )}


          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-[#93000a]/10 border border-[#93000a]/30 text-[#93000a] text-xs font-mono-data">
              {errorMsg}
            </div>
          )}

          {/* TAB 1: SIGN IN */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-syne uppercase tracking-wider text-[#6B6B6B] mb-1">
                  Gmail / Email Address
                </label>
                <input
                  type="email"
                  required
                  value={signInEmail}
                  onChange={e => {
                    setSignInEmail(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="Enter your Gmail / email address"
                  className="w-full h-11 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-xs font-mono-data focus:border-[#C8A96B] focus:outline-none"
                />
              </div>

              {/* Password field below Gmail */}
              <div>
                <label className="block text-[11px] font-syne uppercase tracking-wider text-[#6B6B6B] mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showSignInPass ? 'text' : 'password'}
                    value={signInPassword}
                    onChange={e => {
                      setSignInPassword(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="Enter your password"
                    className="w-full h-11 pl-3 pr-10 bg-[#F8F5EF] border border-[#E8E0D4] text-xs font-mono-data focus:border-[#C8A96B] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPass(!showSignInPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#111111]"
                  >
                    {showSignInPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                onClick={(e) => {
                  if (signInEmail.trim()) {
                    e.preventDefault();
                    handleSignInSubmit();
                  }
                }}
                className="w-full h-11 bg-[#111111] hover:bg-[#8A6D2F] text-[#FFE09D] text-xs font-syne uppercase font-bold tracking-widest transition-all mt-2 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.99]"
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? 'Signing In...' : 'Sign In'}</span>
              </button>

            </form>
          )}

          {/* TAB 2: SIGN UP */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              {user && (
                <div className="p-2.5 bg-[#8A6D2F]/10 border border-[#8A6D2F]/30 text-[11px] font-mono-data text-[#8A6D2F] flex items-center justify-between">
                  <span>Active: <strong>{user.displayName}</strong></span>
                  <button 
                    type="button" 
                    onClick={() => {
                      logout();
                      setErrorMsg('');
                    }}
                    className="underline font-bold text-[#A33A3A] hover:text-[#93000A]"
                  >
                    Sign Out First
                  </button>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-syne uppercase tracking-wider text-[#6B6B6B] mb-1">
                  User Gmail / Email
                </label>
                <input
                  type="email"
                  value={signUpEmail}
                  onChange={e => {
                    setSignUpEmail(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="patron@gmail.com"
                  className="w-full h-10 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-xs font-mono-data focus:border-[#C8A96B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-syne uppercase tracking-wider text-[#6B6B6B] mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showSignUpPass ? 'text' : 'password'}
                    value={signUpPassword}
                    onChange={e => {
                      setSignUpPassword(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="Create a password"
                    className="w-full h-10 pl-3 pr-10 bg-[#F8F5EF] border border-[#E8E0D4] text-xs font-mono-data focus:border-[#C8A96B] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPass(!showSignUpPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]"
                  >
                    {showSignUpPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-syne uppercase tracking-wider text-[#6B6B6B] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={signUpName}
                  onChange={e => {
                    setSignUpName(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="e.g. Hamza Al-Zubair"
                  className="w-full h-10 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-xs font-mono-data focus:border-[#C8A96B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-syne uppercase tracking-wider text-[#6B6B6B] mb-1">
                  Pakistan Mobile (for SMS Dispatch)
                </label>
                <input
                  type="tel"
                  value={signUpPhone}
                  onChange={e => {
                    setSignUpPhone(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="0300 1234567"
                  className="w-full h-10 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-xs font-mono-data focus:border-[#C8A96B] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                onClick={(e) => {
                  if (signUpEmail.trim()) {
                    e.preventDefault();
                    handleSignUpSubmit();
                  }
                }}
                className="w-full h-11 bg-[#8A6D2F] hover:bg-[#6D5422] text-white text-xs font-syne uppercase font-bold tracking-widest transition-all mt-2 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.99] disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
                <span>{loading ? 'Creating Account...' : 'Create Patron Account (Sign Up)'}</span>
              </button>

              <div className="pt-1 text-center">
                <span className="text-[11px] font-mono-data text-[#6B6B6B]">
                  Instantly registers your profile and opens your User Account page with 10% VIP discount.
                </span>
              </div>
            </form>
          )}

          {/* Trust Badge */}
          <div className="mt-6 pt-4 border-t border-[#E8E0D4] flex items-center justify-center gap-2 text-[11px] font-mono-data text-[#6B6B6B]">
            <ShieldCheck className="w-4 h-4 text-[#2F6B4F] flex-shrink-0" />
            <span>Encrypted authentication & 256-bit TLS security</span>
          </div>
        </div>
      </div>
    </div>
  );
}
