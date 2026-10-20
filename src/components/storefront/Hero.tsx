import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Compass, Sparkles, ShieldCheck, Award } from 'lucide-react';
import heroFlaconImg from '../../assets/images/hero_luxury_oud_flacon_1792416386651.jpg';

interface HeroProps {
  onOpenFinder: () => void;
}

export function Hero({ onOpenFinder }: HeroProps) {
  const { setStorefrontView } = useApp();

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#090B0E] via-[#0F1217] to-[#090B0E] text-[#E8E0D4] border-b border-[#C8A96B]/20">
      
      {/* Ambient Radial Golden Glow */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#C8A96B]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 left-10 w-[450px] h-[350px] bg-[#8A6D2F]/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Atmospheric Flacon Photography Backdrop - Clearly Visible Luxury Black Theme */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroFlaconImg}
          alt="Aura Oud Haute Parfumerie Flacon"
          className="w-full h-full object-cover object-center lg:object-[78%_center] opacity-80 md:opacity-85 brightness-95 contrast-105 scale-100 transform motion-safe:transition-transform duration-1000"
        />
        {/* Soft luxury dark gradient so left text is crystal clear while flacon is beautifully visible on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#090B0E] via-[#090B0E]/75 md:via-[#090B0E]/45 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#090B0E] via-transparent to-[#090B0E]/45"></div>
      </div>

      {/* Hero Content Monolith */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 flex flex-col justify-center min-h-[620px]">
        <div className="max-w-2xl space-y-7">
          
          {/* Atelier Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[#191C22]/90 border border-[#C8A96B]/40 shadow-lg backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#FFE09D] animate-pulse" />
            <span className="font-syne text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#FFE09D] font-bold">
              Haute Parfumerie · 2026 Vault Reserve
            </span>
          </div>

          {/* Majestic Hero Headline */}
          <h1 className="font-serif-luxury text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08]">
            The Sacred Art of <br />
            <span className="bg-gradient-to-r from-[#FFE09D] via-[#C8A96B] to-[#E5C378] bg-clip-text text-transparent italic font-normal">
              Pure Agarwood
            </span>
          </h1>

          <p className="font-serif-luxury text-base sm:text-xl text-[#D0C5B4] font-light leading-relaxed max-w-xl">
            Sourced from 18-year aged Cambodian boles, Taif rose absolute, and French distillation stills. Hand-macerated in climate-calibrated bonded vaults for Pakistan’s connoisseurs.
          </p>

          {/* Primary CTA + Secondary Link */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={() => setStorefrontView('shop')}
              className="px-8 py-4 bg-gradient-to-r from-[#C8A96B] via-[#FFE09D] to-[#C8A96B] text-[#111111] hover:brightness-110 text-xs font-syne uppercase tracking-[0.18em] font-bold transition-all shadow-[0_4px_25px_rgba(200,169,107,0.3)] flex items-center justify-center gap-2.5 active:scale-[0.99]"
            >
              <span>Acquire Signature Flacon</span>
              <ArrowRight className="w-4 h-4 text-[#111111]" />
            </button>

            <button
              onClick={onOpenFinder}
              className="px-6 py-4 bg-[#191C22]/80 hover:bg-[#252830] border border-[#C8A96B]/40 text-xs uppercase tracking-[0.14em] text-[#FFE09D] font-semibold transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <Compass className="w-4 h-4 text-[#C8A96B]" />
              <span>Fragrance Finder (4-Step Quiz)</span>
            </button>
          </div>

          {/* Micro Provenance Proof Strip */}
          <div className="pt-8 border-t border-[#C8A96B]/20 grid grid-cols-3 gap-6 text-xs font-mono-data">
            <div>
              <div className="text-[#FFE09D] font-bold text-base sm:text-lg">18-YR</div>
              <div className="text-[10px] uppercase text-[#999080] tracking-wider mt-0.5">Aged Cambodian Oud</div>
            </div>
            <div>
              <div className="text-[#FFE09D] font-bold text-base sm:text-lg">30-35%</div>
              <div className="text-[10px] uppercase text-[#999080] tracking-wider mt-0.5">Extrait de Parfum</div>
            </div>
            <div>
              <div className="text-[#FFE09D] font-bold text-base sm:text-lg">24-48H</div>
              <div className="text-[10px] uppercase text-[#999080] tracking-wider mt-0.5">Express Across Pakistan</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
