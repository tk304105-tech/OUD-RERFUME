import React, { useState } from 'react';
import { Product, Gender, FragranceFamily } from '../../types';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import { Compass, RotateCcw, ArrowRight, ArrowLeft, Check, Sparkles, Package } from 'lucide-react';

interface MatchResult {
  product: Product;
  score: number;
  reason: string;
}

export function PerfumeFinder() {
  const { products, setStorefrontView, setSelectedProduct } = useApp();

  const [step, setStep] = useState<number>(1);
  const [selectedGender, setSelectedGender] = useState<Gender | 'Any'>('Any');
  const [selectedFamily, setSelectedFamily] = useState<FragranceFamily | 'Any'>('Any');
  const [selectedMood, setSelectedMood] = useState<string>('Any');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('Any');
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);

  const resetQuiz = () => {
    setStep(1);
    setSelectedGender('Any');
    setSelectedFamily('Any');
    setSelectedMood('Any');
    setSelectedOccasion('Any');
    setHasCompleted(false);
  };

  // Compute matched products using formula:
  // Score = 3×family match + 2×mood match + 2×occasion match + 1×gender match
  const calculateMatches = (): MatchResult[] => {
    const results: MatchResult[] = [];

    for (const prod of products) {
      if (prod.status !== 'Published') continue;

      // Hard gender filter (Unisex always qualifies)
      if (selectedGender !== 'Any' && prod.gender !== 'Unisex' && prod.gender !== selectedGender) {
        continue;
      }

      let score = 0;
      const matchedTokens: string[] = [];

      // 1. Family match (weight = 3)
      if (selectedFamily !== 'Any') {
        if (prod.families.includes(selectedFamily)) {
          score += 3;
          matchedTokens.push(selectedFamily);
        }
      } else {
        matchedTokens.push(prod.families[0]);
      }

      // 2. Mood match (weight = 2)
      if (selectedMood !== 'Any') {
        const matchesMood = prod.moods.some(m => m.toLowerCase().includes(selectedMood.toLowerCase()));
        if (matchesMood) {
          score += 2;
          matchedTokens.push(selectedMood);
        }
      } else {
        matchedTokens.push(prod.moods[0] || 'Refined');
      }

      // 3. Occasion match (weight = 2)
      if (selectedOccasion !== 'Any') {
        const matchesOccasion = prod.occasions.some(o => o.toLowerCase().includes(selectedOccasion.toLowerCase()));
        if (matchesOccasion) {
          score += 2;
          matchedTokens.push(selectedOccasion);
        }
      } else {
        matchedTokens.push(prod.occasions[0] || 'Evening');
      }

      // 4. Gender match (weight = 1)
      if (selectedGender !== 'Any' && (prod.gender === selectedGender || prod.gender === 'Unisex')) {
        score += 1;
      }

      const reason = matchedTokens.slice(0, 3).join(' · ');
      results.push({ product: prod, score, reason });
    }

    // Sort descending by score
    return results.sort((a, b) => b.score - a.score).slice(0, 6);
  };

  const matches = calculateMatches();

  return (
    <section id="perfume-finder" className="py-20 bg-[#F8F5EF] border-y border-[#E8E0D4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-syne uppercase tracking-widest text-[#8A6D2F] font-semibold mb-2">
            <Compass className="w-4 h-4" />
            <span>Interactive Bespoke Guidance</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#111111]">
            The Olfactive Signature Finder
          </h2>
          <p className="text-sm text-[#6B6B6B] mt-3 font-serif-luxury">
            Answer 4 intuitive questions about your temperament, preferences, and wear occasions to reveal your ideal bespoke flacon.
          </p>
        </div>

        {!hasCompleted ? (
          <div className="max-w-3xl mx-auto bg-[#FFFFFF] border border-[#E8E0D4] p-6 sm:p-10 shadow-sm">
            
            {/* Progress Stepper Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs font-mono-data text-[#8A6D2F] uppercase mb-2">
                <span>Step {step} of 4</span>
                <span>{step === 1 ? 'Gender Filter' : step === 2 ? 'Fragrance Family' : step === 3 ? 'Desired Mood' : 'Primary Occasion'}</span>
              </div>
              <div className="w-full bg-[#E8E0D4] h-1.5 overflow-hidden">
                <div 
                  className="bg-[#8A6D2F] h-full transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Step 1: Gender */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="font-serif-luxury text-2xl font-bold text-[#111111]">
                  Who is this fragrance created for?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Men', desc: 'Deeper woods, vetiver, smoked leather & dark spices' },
                    { label: 'Women', desc: 'Narcotic roses, white florals, radiant amber & soft vanilla' },
                    { label: 'Unisex', desc: 'Pure agarwood, ambergris, frankincense & rare musks' }
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setSelectedGender(item.label as Gender);
                        setStep(2);
                      }}
                      className={`p-5 text-left border transition-all ${
                        selectedGender === item.label 
                          ? 'border-[#8A6D2F] bg-[#F8F5EF]' 
                          : 'border-[#E8E0D4] hover:border-[#C8A96B]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif-luxury text-xl font-bold text-[#111111]">{item.label}</span>
                        {selectedGender === item.label && <Check className="w-4 h-4 text-[#8A6D2F]" />}
                      </div>
                      <p className="text-xs text-[#6B6B6B] mt-2 leading-relaxed">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Fragrance Family */}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="font-serif-luxury text-2xl font-bold text-[#111111]">
                  Which olfactive family resonates with you most?
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Woody', notes: 'Cambodian Oud, Sandalwood, Atlas Cedar' },
                    { label: 'Oriental', notes: 'Golden Amber, Frankincense, Resins' },
                    { label: 'Floral', notes: 'Grasse Rose, Jasmine, Neroli Bloom' },
                    { label: 'Fresh', notes: 'Calabrian Bergamot, Sea Salt, Citrus' },
                    { label: 'Gourmand', notes: 'Bourbon Vanilla, Tonka, Honey' },
                    { label: 'Spicy', notes: 'Kashmiri Saffron, Cardamom, Nutmeg' }
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setSelectedFamily(item.label as FragranceFamily);
                        setStep(3);
                      }}
                      className={`p-4 text-left border transition-all ${
                        selectedFamily === item.label 
                          ? 'border-[#8A6D2F] bg-[#F8F5EF]' 
                          : 'border-[#E8E0D4] hover:border-[#C8A96B]'
                      }`}
                    >
                      <div className="font-serif-luxury text-lg font-bold text-[#111111]">{item.label}</div>
                      <div className="text-[11px] text-[#6B6B6B] mt-1 font-mono-data">{item.notes}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Mood */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="font-serif-luxury text-2xl font-bold text-[#111111]">
                  What presence or emotion should the scent project?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Regal', desc: 'Opulent, commanding, heavy agarwood & royal saffron' },
                    { label: 'Sensual', desc: 'Intoxicating, romantic, roasted tonka & velvety rose' },
                    { label: 'Clean', desc: 'Crisp, invigorating, sea breeze & aristocratic citrus' },
                    { label: 'Meditative', desc: 'Grounded, sacred, pure attar oils & temple incense' }
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setSelectedMood(item.label);
                        setStep(4);
                      }}
                      className={`p-4 text-left border transition-all ${
                        selectedMood === item.label 
                          ? 'border-[#8A6D2F] bg-[#F8F5EF]' 
                          : 'border-[#E8E0D4] hover:border-[#C8A96B]'
                      }`}
                    >
                      <div className="font-serif-luxury text-lg font-bold text-[#111111]">{item.label}</div>
                      <div className="text-xs text-[#6B6B6B] mt-1">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Occasion */}
            {step === 4 && (
              <div className="space-y-6">
                <h3 className="font-serif-luxury text-2xl font-bold text-[#111111]">
                  Where will you wear this fragrance primarily?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Weddings', desc: 'Grand Pakistani celebrations, black tie banquets, festive galas' },
                    { label: 'Daily Signature', desc: 'Executive office presence, meetings, effortless distinction' },
                    { label: 'Evening Romance', desc: 'Intimate dinners, dates, private soirées' },
                    { label: 'Summer Daytime', desc: 'Heat-resistant freshness for daytime warmth' }
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setSelectedOccasion(item.label);
                        setHasCompleted(true);
                      }}
                      className={`p-4 text-left border transition-all ${
                        selectedOccasion === item.label 
                          ? 'border-[#8A6D2F] bg-[#F8F5EF]' 
                          : 'border-[#E8E0D4] hover:border-[#C8A96B]'
                      }`}
                    >
                      <div className="font-serif-luxury text-lg font-bold text-[#111111]">{item.label}</div>
                      <div className="text-xs text-[#6B6B6B] mt-1">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigational Controls */}
            <div className="mt-8 pt-6 border-t border-[#E8E0D4] flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="text-xs font-semibold uppercase tracking-wider text-[#6B6B6B] hover:text-[#111111] flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              ) : (
                <div></div>
              )}

              <button
                type="button"
                onClick={() => {
                  if (step < 4) setStep(step + 1);
                  else setHasCompleted(true);
                }}
                className="text-xs font-semibold uppercase tracking-wider text-[#8A6D2F] hover:underline flex items-center gap-1"
              >
                <span>Skip to Results</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Results View */
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-[#FFFFFF] border border-[#E8E0D4] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="font-syne text-[11px] uppercase tracking-widest text-[#8A6D2F] font-bold">
                  Bespoke Recommendations Calculated
                </span>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#111111] mt-1">
                  Matched for: {selectedFamily !== 'Any' ? selectedFamily : 'All Accords'} · {selectedMood !== 'Any' ? selectedMood : 'Any Mood'}
                </h3>
                <p className="text-xs text-[#6B6B6B] mt-1 font-mono-data">
                  Ranked by formula compatibility index (Family 3x, Mood 2x, Occasion 2x).
                </p>
              </div>

              <button
                onClick={resetQuiz}
                className="px-4 py-2 border border-[#C8A96B] text-[#8A6D2F] hover:bg-[#F8F5EF] text-xs uppercase tracking-wider font-semibold flex items-center gap-2 whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Finder</span>
              </button>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map(({ product, reason }) => (
                <div key={product.id} className="relative flex flex-col">
                  <div className="mb-2 px-3 py-1 bg-[#111111] text-[#FFE09D] text-[10px] font-mono-data uppercase tracking-wider flex items-center gap-1.5 self-start">
                    <Sparkles className="w-3 h-3 text-[#C8A96B]" />
                    <span>Why this matches: {reason}</span>
                  </div>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Low Matches or Try Discovery Set Promotion */}
            {matches.length < 3 && (
              <div className="bg-[#111111] text-[#E8E0D4] p-8 border border-[#C8A96B] flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 text-xs font-syne text-[#C8A96B] uppercase font-bold tracking-widest">
                    <Package className="w-4 h-4" />
                    <span>Uncertain Which Flacon Suits You Best?</span>
                  </div>
                  <h4 className="font-serif-luxury text-2xl font-bold text-white">
                    Acquire the Atelier Discovery Anthology (5 x 10ml)
                  </h4>
                  <p className="text-xs text-[#999080] max-w-xl leading-relaxed">
                    Test 5 iconic specimens on your skin across different seasons before acquiring a full-size flacon.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const dsc = products.find(p => p.category === 'Discovery');
                    if (dsc) {
                      setSelectedProduct(dsc);
                      setStorefrontView('product-detail');
                    }
                  }}
                  className="px-6 py-3.5 bg-[#C8A96B] text-[#111111] hover:bg-[#ffe09d] text-xs uppercase font-syne font-bold tracking-widest whitespace-nowrap"
                >
                  Order Discovery Set (PKR 4,950)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
