import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, MapPin, Phone, Mail, Clock, MessageSquare, ChevronDown, Search, CheckCircle2 } from 'lucide-react';

export function AboutPage() {
  const { setStorefrontView } = useApp();

  return (
    <div className="bg-[#F8F5EF] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-syne uppercase tracking-widest text-[#8A6D2F] font-bold">
            The Philosophy of Haute Parfumerie
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-6xl font-bold text-[#111111]">
            The Aura Oud Atelier
          </h1>
          <p className="font-serif-luxury text-lg text-[#6B6B6B] max-w-xl mx-auto italic">
            Where 18th-century French hydro-distillation meets wild centuries-old Asian agarwood forests.
          </p>
        </div>

        {/* Hero Specimen Image */}
        <div className="w-full aspect-[21/9] bg-[#111111] overflow-hidden border border-[#E8E0D4] relative">
          <img 
            src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1600&q=85" 
            alt="Aura Oud Atelier Flacon" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            <span className="font-serif-luxury text-2xl sm:text-3xl text-white font-light tracking-wide max-w-lg">
              "We do not create fragrances for crowds; we distill essences for legacies."
            </span>
          </div>
        </div>

        {/* Narrative Sections */}
        <div className="bg-white border border-[#E8E0D4] p-8 sm:p-12 space-y-8 text-sm text-[#111111] leading-relaxed">
          <div className="space-y-3">
            <h2 className="font-serif-luxury text-2xl font-bold text-[#111111]">
              The Provenance of Our Agarwood
            </h2>
            <p className="text-[#6B6B6B] leading-relaxed font-serif-luxury text-base">
              Every drop of our oud begins in the remote rainforests of Cambodia, Assam, and Trat. We reject rapid chemical extraction in favor of vintage artisanal batch distillations aged for up to 18 years in temperature-calibrated terracotta vessels. The result is pure, medicinal, dark resinous oil devoid of synthetic screech.
            </p>
          </div>

          <div className="space-y-3 pt-6 border-t border-[#E8E0D4]">
            <h2 className="font-serif-luxury text-2xl font-bold text-[#111111]">
              Grasse Laboratory Formulation
            </h2>
            <p className="text-[#6B6B6B] leading-relaxed font-serif-luxury text-base">
              Partnering with <strong className="text-[#111111]">Laboratoires Grasse Essences S.A.</strong> on the French Riviera, our master nose harmonizes heavy oriental fixatives with luminous Mediterranean top notes—Bergamot Reggio, Tunisian Neroli, and Bulgarian Rosa Damascena—crafting flacons that radiate nobility from first mist to deep drydown.
            </p>
          </div>

          <div className="space-y-3 pt-6 border-t border-[#E8E0D4]">
            <h2 className="font-serif-luxury text-2xl font-bold text-[#111111]">
              Engineered for the Subcontinent
            </h2>
            <p className="text-[#6B6B6B] leading-relaxed font-serif-luxury text-base">
              Western fragrances frequently dissipate within two hours in the intense heat and humidity of Pakistan. Aura Oud perfumes are formulated at high Extrait concentrations (30% to 35% essence) with natural plant fixatives and ambergris tinctures, ensuring 14+ hours of persistent, dignified sillage.
            </p>
          </div>

          <div className="pt-6 border-t border-[#E8E0D4] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-mono-data text-[#8A6D2F]">
              Direct boutique salons in Lahore DHA and Karachi Clifton.
            </div>
            <button
              onClick={() => setStorefrontView('shop')}
              className="px-6 py-3 bg-[#111111] text-[#FFE09D] hover:bg-[#8A6D2F] text-xs uppercase font-syne font-bold tracking-widest transition-colors"
            >
              Explore Our Creations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="bg-[#F8F5EF] min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-syne uppercase tracking-widest text-[#8A6D2F] font-bold">
            Private Client Service
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-[#111111]">
            Contact Our Concierge
          </h1>
          <p className="text-xs text-[#6B6B6B] font-mono-data">
            Personal bespoke consultations, corporate gifting, and order tracking queries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct WhatsApp & Salons (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* WhatsApp Direct Plinth */}
            <div className="bg-[#111111] text-[#E8E0D4] p-6 border border-[#C8A96B] space-y-3">
              <div className="flex items-center gap-2 text-xs font-syne uppercase tracking-wider text-[#C8A96B] font-bold">
                <MessageSquare className="w-4 h-4" />
                <span>Instant VIP WhatsApp Concierge</span>
              </div>
              <p className="text-xs text-[#999080] leading-relaxed">
                Connect directly with our master fragrance specialist for sizing assistance, custom discovery sets, or urgent wedding orders.
              </p>
              <a
                href="https://wa.me/923008821940"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-[#C8A96B] text-[#111111] hover:bg-[#ffe09d] text-xs uppercase font-syne font-bold tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <span>Chat on WhatsApp (+92 300 8821940)</span>
              </a>
            </div>

            {/* Salons List */}
            <div className="bg-white border border-[#E8E0D4] p-6 space-y-4">
              <h3 className="font-syne text-xs uppercase tracking-widest font-bold text-[#111111]">
                Boutique Salons in Pakistan
              </h3>

              <div className="space-y-4 text-xs font-mono-data">
                <div className="space-y-1 pb-3 border-b border-[#E8E0D4]">
                  <div className="font-bold text-[#111111] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#8A6D2F]" />
                    <span>Lahore Atelier Flagship</span>
                  </div>
                  <div className="text-[#6B6B6B]">Sector Y Commercial, DHA Phase 5, Lahore</div>
                  <div className="text-[#8A6D2F]">Hours: 11:00 AM – 10:00 PM (Mon–Sun)</div>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-[#111111] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#8A6D2F]" />
                    <span>Karachi Private Suite</span>
                  </div>
                  <div className="text-[#6B6B6B]">26th Street, Phase 6, DHA, Karachi</div>
                  <div className="text-[#8A6D2F]">Hours: 12:00 PM – 11:00 PM (By Appointment)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-[#E8E0D4] p-8">
            <h3 className="font-serif-luxury text-2xl font-bold text-[#111111] mb-2">
              Send an Atelier Inquiry
            </h3>
            <p className="text-xs text-[#6B6B6B] mb-6">
              Our concierge responds within 3 hours during boutique working hours.
            </p>

            {submitted ? (
              <div className="p-6 bg-[#F8F5EF] border border-[#2F6B4F] text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-[#2F6B4F] mx-auto" />
                <h4 className="font-serif-luxury text-xl font-bold text-[#111111]">Message Received</h4>
                <p className="text-xs text-[#6B6B6B]">
                  Our fragrance concierge will contact you via WhatsApp/Phone shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                <div>
                  <label className="text-[11px] uppercase font-mono-data text-[#6B6B6B] block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Faraz Malik"
                    className="w-full h-11 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-xs text-[#111111] focus:outline-none focus:border-[#8A6D2F]"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase font-mono-data text-[#6B6B6B] block mb-1">Mobile Phone (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03XXXXXXXXX"
                    className="w-full h-11 px-3 bg-[#F8F5EF] border border-[#E8E0D4] text-xs font-mono-data text-[#111111] focus:outline-none focus:border-[#8A6D2F]"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase font-mono-data text-[#6B6B6B] block mb-1">Inquiry / Fragrance Assistance *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry, wedding order requirements, or specific fragrance family question..."
                    className="w-full p-3 bg-[#F8F5EF] border border-[#E8E0D4] text-xs text-[#111111] focus:outline-none focus:border-[#8A6D2F]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#111111] text-[#FFE09D] hover:bg-[#8A6D2F] text-xs uppercase font-syne font-bold tracking-widest transition-colors"
                >
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FAQPage() {
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Are your fragrances authentic and IFRA compliant?',
      a: 'Yes. All formulations are distilled with organic, sustainably sourced Cambodian and Assam agarwood, Grasse Centifolia roses, and compliant with the 51st Amendment of the International Fragrance Association (IFRA). We provide certificate of analysis references with every numbered batch.'
    },
    {
      q: 'How long do your Extrait de Parfums last in Pakistani climate?',
      a: 'Our Extrait de Parfums contain 30% to 35% pure fragrance oil, allowing them to easily withstand summer heat and humidity. Expect 14+ hours on skin and up to 48 hours on natural fabrics like wool, raw silk, and cashmere.'
    },
    {
      q: 'What are the delivery timelines and charges across Pakistan?',
      a: 'Orders above PKR 5,000 qualify for complimentary Express shipping. For orders below PKR 5,000, Standard courier delivery is PKR 250. Lahore orders placed before 2:00 PM are delivered same-day or next morning. Karachi and Islamabad arrive within 24 hours via TCS air freight.'
    },
    {
      q: 'Is Cash on Delivery (COD) supported?',
      a: 'Yes, we provide Cash on Delivery across 200+ cities in Pakistan via TCS, Leopards, and Trax couriers. You inspect the sealed package before handing cash to the delivery rider.'
    },
    {
      q: 'Can I test the fragrance before breaking the main flacon seal?',
      a: 'Yes! Every full-size flacon order includes a complimentary 2ml matching tester vial. You can test the 2ml sample on your skin. If you do not fall in love with it, you can return the unopened, sealed full-size flacon within 7 days for a 100% refund.'
    },
    {
      q: 'How should I apply an Extrait de Parfum for maximum projection?',
      a: 'Apply 1-2 sprays onto warm pulse points: the base of your throat, behind the ears, and inner wrists. Do not rub your wrists together as friction fractures top notes. For an intense sillage, mist lightly on shoulders or collar.'
    }
  ];

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(search.toLowerCase()) || 
    f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#F8F5EF] min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-syne uppercase tracking-widest text-[#8A6D2F] font-bold">
            Client Knowledge Base
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#111111]">
            Frequently Asked Questions
          </h1>
          <p className="text-xs text-[#6B6B6B] font-mono-data">
            Everything you need to know regarding distillation, longevity, delivery, and guarantees.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#8A6D2F] absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FAQs (e.g. delivery, longevity, COD, sample)..."
            className="w-full h-11 pl-10 pr-4 bg-white border border-[#E8E0D4] text-xs text-[#111111] focus:outline-none focus:border-[#8A6D2F]"
          />
        </div>

        {/* Accordions */}
        <div className="bg-white border border-[#E8E0D4] divide-y divide-[#E8E0D4]">
          {filteredFaqs.map((faq, idx) => (
            <div key={idx}>
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between hover:bg-[#F8F5EF] transition-colors"
              >
                <span className="font-serif-luxury text-lg font-bold text-[#111111] pr-4">
                  {faq.q}
                </span>
                <ChevronDown className={`w-5 h-5 text-[#8A6D2F] flex-shrink-0 transition-transform ${openIndex === idx ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === idx && (
                <div className="p-5 pt-0 text-xs text-[#6B6B6B] font-mono-data leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
