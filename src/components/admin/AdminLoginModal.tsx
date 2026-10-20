import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, ShieldCheck, X, Eye, EyeOff, Sparkles, KeyRound, Boxes } from 'lucide-react';

export function AdminLoginModal() {
  const { 
    mode,
    isAdminLoginModalOpen, 
    setIsAdminLoginModalOpen, 
    loginAdmin, 
    adminUser,
    logoutAdmin,
    setMode 
  } = useApp();

  const [email, setEmail] = useState('tk304105@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isVisible = isAdminLoginModalOpen || (mode === 'admin' && !adminUser);
  if (!isVisible) return null;

  const handleClose = () => {
    setIsAdminLoginModalOpen(false);
    if (mode === 'admin' && !adminUser) {
      setMode('storefront');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await loginAdmin(email, password);
      if (!result.success) {
        setError(result.error || 'Authentication rejected. Verify credentials.');
      }
    } catch {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('tk304105@gmail.com');
    setPassword('tayyaba009');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn" onClick={handleClose}>
      <div 
        className="bg-[#FFFFFF] border border-[#E8E0D4] w-full max-w-md shadow-2xl relative overflow-hidden text-[#111111] rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Accent Line */}
        <div className="h-1.5 bg-gradient-to-r from-[#8A6D2F] via-[#C8A96B] to-[#8A6D2F]" />

        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-[#6B6B6B] hover:text-[#111111] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-[#F8F5EF] border border-[#E8E0D4] text-[#8A6D2F] flex items-center justify-center mx-auto mb-3 rounded-md">
              <Lock className="w-6 h-6" />
            </div>
            <span className="font-mono-data text-[10px] uppercase font-bold tracking-widest text-[#8A6D2F]">
              Atelier IMS Security Perimeter
            </span>
            <h2 className="font-serif-luxury text-2xl font-bold text-[#111111] mt-1">
              Staff Portal Access
            </h2>
            <p className="text-xs text-[#6B6B6B] font-mono-data mt-1">
              Haute Parfumerie Vault & Inventory Management System
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-[#FFF2F2] border border-[#FFCDD2] text-[#B33939] text-xs font-mono-data leading-relaxed rounded-md font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono-data uppercase tracking-wider text-[#6B6B6B] mb-1.5 font-bold">
                Admin Gmail Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-[#111111] rounded text-xs font-mono-data focus:outline-none focus:border-[#8A6D2F]"
                placeholder="admin@warehouse.io"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono-data uppercase tracking-wider text-[#6B6B6B] mb-1.5 font-bold">
                Vault Passcode
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 px-3 pr-10 bg-[#F8F5EF] border border-[#E8E0D4] text-[#111111] rounded text-xs font-mono-data focus:outline-none focus:border-[#8A6D2F]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#111111]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#111111] text-[#FFE09D] font-syne font-bold uppercase tracking-wider rounded text-xs transition-colors hover:bg-[#8A6D2F] shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Authorize Admin Session'}
            </button>
          </form>

          <button
            onClick={handleFillDemo}
            className="w-full mt-4 text-[10px] text-[#8A6D2F] hover:underline font-mono-data uppercase tracking-wider"
          >
            Autofill Demo Credentials
          </button>
        </div>
      </div>
    </div>
  );
}
