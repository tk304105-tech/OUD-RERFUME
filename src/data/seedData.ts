import { Product, Order, Customer, Coupon, Review, AuditLog } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Oud Royale Extrait de Parfum',
    slug: 'oud-royale-extrait',
    brand: 'Aura Oud',
    subtitle: 'Private Reserve · Master Distillate',
    description: 'A monument of oriental perfumery. Sourced from 18-year aged Cambodian agarwood and wild Assam agarwood distillation, encased in heavy monolithic glass with brushed champagne gold hardware. Opens with radiant Italian bergamot and rare Iranian saffron before descending into smoked leather and ancient resins.',
    category: 'Extraits',
    collection: 'Heritage Oud',
    gender: 'Unisex',
    concentration: 'Extrait de Parfum (30-35%)',
    longevity: 'Eternal (14+ hrs)',
    sillage: 'Heavy Projection',
    best_season: 'Autumn / Winter / Evening',
    maceration_days: 90,
    density_index: '0.942 g/cm³',
    vault_location: {
      vault: 'Vault A',
      rack: 'Rack 04',
      bay: 'Shelf B2'
    },
    supplier: {
      name: 'Laboratoires Grasse Essences S.A.',
      location: 'Côte d’Azur, Grasse, France',
      lead_time_days: 14
    },
    families: ['Woody', 'Oriental', 'Spicy'],
    moods: ['Regal', 'Intense', 'Mysterious', 'Opulent'],
    occasions: ['Formal Gala', 'Black Tie', 'Weddings', 'Private Evening'],
    top_notes: ['Bergamot Reggio', 'Saffron Threads', 'Cardamom Pods'],
    heart_notes: ['Taif Rose Absolute', 'Smoked Leather', 'Cedarwood Atlas'],
    base_notes: ['Aged Cambodian Oud (18 Yr)', 'Ambergris', 'Bourbon Vanilla', 'Mysore Sandalwood'],
    ingredients: 'Alcohol Denat., Parfum (Fragrance), Aqua, Limonene, Linalool, Alpha-Isomethyl Ionone, Eugenol, Geraniol, Citronellol.',
    allergen_notice: 'IFRA 51st Amendment compliant. Contains natural oakmoss and botanical extracts.',
    how_to_use: 'Depress atomiser at 15cm distance onto warm pulse points: inner wrists, clavicle, and nape. Extrait concentration requires only 1-2 sprays for 16+ hour presence.',
    images: {
      main: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85',
      hover: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=85'
      ],
      lifestyle: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=85'
    },
    variants: [
      {
        id: 'var-1-100',
        size_ml: 100,
        label: '100ml Flacon',
        sku: 'AUR-OUD-001',
        price: 6500,
        sale_price: 6500,
        cost_price: 2800,
        stock: 342,
        reserved: 6,
        low_stock_threshold: 50,
        barcode: '8901234567890'
      },
      {
        id: 'var-1-50',
        size_ml: 50,
        label: '50ml Travel Flacon',
        sku: 'AUR-OUD-002',
        price: 4200,
        sale_price: 4200,
        cost_price: 1800,
        stock: 120,
        reserved: 2,
        low_stock_threshold: 30,
        barcode: '8901234567891'
      }
    ],
    rating: 4.9,
    review_count: 88,
    badge: 'Atelier Flagship',
    is_featured: true,
    status: 'Published',
    created_at: '2024-01-10'
  },
  {
    id: 'prod-2',
    name: 'Velvet Rose & Tonka EDP',
    slug: 'velvet-rose-tonka',
    brand: 'Aura Oud',
    subtitle: 'Atelier Florals Line · Grasse Rose Otto',
    description: 'An alluring clash of narcotic crimson florals and molten roasted tonka beans. Crafted with dawn-harvested Grasse Centifolia rose petals infused with Madagascar vanilla and dark patchouli for an irresistible sillage.',
    category: 'EDPs',
    collection: 'Atelier Florals',
    gender: 'Women',
    concentration: 'Eau de Parfum (18-20%)',
    longevity: 'Long Lasting (8-12 hrs)',
    sillage: 'Heavy Projection',
    best_season: 'Spring / Autumn / All year',
    maceration_days: 60,
    density_index: '0.928 g/cm³',
    vault_location: {
      vault: 'Vault B',
      rack: 'Rack 02',
      bay: 'Shelf A1'
    },
    supplier: {
      name: 'Anatolian Floral Co.',
      location: 'Isparta & Grasse',
      lead_time_days: 10
    },
    families: ['Floral', 'Oriental', 'Gourmand'],
    moods: ['Sensual', 'Romantic', 'Magnetic', 'Sophisticated'],
    occasions: ['Date Night', 'Celebrations', 'Fine Dining', 'Daily Luxury'],
    top_notes: ['Pink Peppercorn', 'Sparkling Mandarin', 'Turkish Damask Dew'],
    heart_notes: ['Grasse Centifolia Rose', 'Bulgarian Rose Absolute', 'Violet Leaves'],
    base_notes: ['Roasted Tonka Bean', 'Amber Crystals', 'Indonesian Patchouli', 'Cashmere Wood'],
    ingredients: 'Alcohol Denat., Parfum, Aqua, Hydroxycitronellal, Geraniol, Coumarin, Benzyl Salicylate.',
    images: {
      main: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=85',
      hover: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1000&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1000&q=85'
      ]
    },
    variants: [
      {
        id: 'var-2-50',
        size_ml: 50,
        label: '50ml Flacon',
        sku: 'AUR-ROSE-014',
        price: 4200,
        sale_price: 3850,
        cost_price: 1600,
        stock: 18,
        reserved: 3,
        low_stock_threshold: 40,
        barcode: '8901234567892'
      },
      {
        id: 'var-2-100',
        size_ml: 100,
        label: '100ml Flacon',
        sku: 'AUR-ROSE-015',
        price: 6800,
        cost_price: 2400,
        stock: 45,
        reserved: 1,
        low_stock_threshold: 25,
        barcode: '8901234567893'
      }
    ],
    rating: 4.8,
    review_count: 52,
    badge: 'Best Seller',
    is_featured: true,
    status: 'Published',
    created_at: '2024-02-14'
  },
  {
    id: 'prod-3',
    name: 'Amber Noir Pure Dehn Al Oud',
    slug: 'amber-noir-attar',
    brand: 'Aura Oud',
    subtitle: 'Private Blend Rare Reserve · 12 Year Distillate',
    description: 'A pure, alcohol-free concentrated perfume oil of extraordinary rarity. Aged in vintage teak casks for over a decade. Thick golden nectar that adheres to skin like silk, exuding warm amber resin, smoked birch, and divine botanical musk.',
    category: 'Attars',
    collection: 'Private Reserve',
    gender: 'Unisex',
    concentration: 'Pure Attar / Concentrated Oil',
    longevity: 'Eternal (14+ hrs)',
    sillage: 'Heavy Projection',
    best_season: 'Winter / Night / Spiritual',
    maceration_days: 180,
    density_index: '0.985 g/cm³',
    vault_location: {
      vault: 'Vault A',
      rack: 'Rack 01',
      bay: 'Vault Safe 08'
    },
    supplier: {
      name: 'Kannauj Heritage Distillers',
      location: 'Uttar Pradesh & Assam',
      lead_time_days: 21
    },
    families: ['Oriental', 'Woody'],
    moods: ['Transcendent', 'Meditative', 'Profound', 'Noble'],
    occasions: ['Jummah', 'Eid Evenings', 'VIP Gatherings', 'Quiet Reflection'],
    top_notes: ['Wild Frankincense', 'Nutmeg Essence', 'Black Cumin'],
    heart_notes: ['Golden Fossil Amber', 'Smoked Birch Bark', 'Labdanum Resinoid'],
    base_notes: ['12-Year Dehn Al Oud', 'White Ambergris Tincture', 'Atlas Musk'],
    ingredients: '100% Pure Botanical Concentrated Fragrance Oil (Simmondsia Chinensis Seed Oil, Parfum). 0% Alcohol.',
    images: {
      main: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=1000&q=85',
      hover: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=1000&q=85'
      ]
    },
    variants: [
      {
        id: 'var-3-12',
        size_ml: 12,
        label: '12ml Crystal Tola Flacon',
        sku: 'AUR-AMB-008',
        price: 11000,
        cost_price: 4500,
        stock: 0, // Out of stock to demonstrate low stock / depleted state & Notify flow
        reserved: 0,
        low_stock_threshold: 25,
        barcode: '8901234567894'
      },
      {
        id: 'var-3-6',
        size_ml: 6,
        label: '6ml Half-Tola Flacon',
        sku: 'AUR-AMB-007',
        price: 6200,
        cost_price: 2500,
        stock: 4,
        reserved: 0,
        low_stock_threshold: 15,
        barcode: '8901234567895'
      }
    ],
    rating: 5.0,
    review_count: 41,
    badge: 'Rare Vintage',
    is_featured: true,
    status: 'Published',
    created_at: '2023-11-20'
  },
  {
    id: 'prod-4',
    name: 'Citrus Riviera & Neroli EDP',
    slug: 'citrus-riviera-neroli',
    brand: 'Aura Oud',
    subtitle: 'Private Blend Summer Reserve · Coastal Sunshine',
    description: 'An invigorating blast of sun-drenched Italian bergamot, crystalline sea salt, and bitter orange blossom. Fresh yet intensely tenaceous, designed to withstand the sweltering Pakistani summer heat while maintaining crisp, aristocratic refinement.',
    category: 'EDPs',
    collection: 'Summer Reserve',
    gender: 'Unisex',
    concentration: 'Eau de Parfum (18-20%)',
    longevity: 'Long Lasting (8-12 hrs)',
    sillage: 'Moderate',
    best_season: 'Summer / Spring / Daytime',
    maceration_days: 45,
    density_index: '0.915 g/cm³',
    vault_location: {
      vault: 'Vault B',
      rack: 'Rack 05',
      bay: 'Shelf C1'
    },
    supplier: {
      name: 'Laboratoires Grasse Essences S.A.',
      location: 'France / Calabria',
      lead_time_days: 14
    },
    families: ['Fresh', 'Aquatic'],
    moods: ['Energizing', 'Crisp', 'Effortless', 'Sunlit'],
    occasions: ['Summer Daytime', 'Executive Meetings', 'Outdoor Brunches', 'Travel'],
    top_notes: ['Calabrian Bergamot', 'Bitter Petitgrain', 'Sunlit Lemon Zest'],
    heart_notes: ['Tunisian Neroli', 'Mediterranean Sea Salt', 'Rosemary Oil'],
    base_notes: ['White Musk', 'Sun-bleached Driftwood', 'Clean Ambroxan'],
    ingredients: 'Alcohol Denat., Parfum, Aqua, Limonene, Linalool, Citral, Farnesol.',
    images: {
      main: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=85',
      hover: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=85'
      ]
    },
    variants: [
      {
        id: 'var-4-100',
        size_ml: 100,
        label: '100ml Flacon',
        sku: 'AUR-CIT-022',
        price: 3800,
        cost_price: 1400,
        stock: 156,
        reserved: 5,
        low_stock_threshold: 30,
        barcode: '8901234567896'
      },
      {
        id: 'var-4-50',
        size_ml: 50,
        label: '50ml Flacon',
        sku: 'AUR-CIT-021',
        price: 2600,
        cost_price: 950,
        stock: 84,
        reserved: 2,
        low_stock_threshold: 20,
        barcode: '8901234567897'
      }
    ],
    rating: 4.7,
    review_count: 67,
    badge: 'Best Seller',
    is_featured: true,
    status: 'Published',
    created_at: '2024-03-01'
  },
  {
    id: 'prod-5',
    name: 'Imperial Santal 75ml',
    slug: 'imperial-santal',
    brand: 'Aura Oud',
    subtitle: 'Heritage Oud Master Line · Pure Mysore Reserve',
    description: 'Smooth, creamy, meditative sandalwood enriched with cardamom pods, iris pallida, and smoked violet wood. A timeless signature scent loved for its effortless elegance and non-cloying warmth.',
    category: 'EDPs',
    collection: 'Master Distillates',
    gender: 'Men',
    concentration: 'Eau de Parfum (18-20%)',
    longevity: 'Eternal (14+ hrs)',
    sillage: 'Moderate',
    best_season: 'All Seasons / Autumn',
    maceration_days: 75,
    density_index: '0.935 g/cm³',
    vault_location: {
      vault: 'Vault A',
      rack: 'Rack 03',
      bay: 'Shelf A4'
    },
    supplier: {
      name: 'Kannauj Heritage Distillers',
      location: 'India',
      lead_time_days: 18
    },
    families: ['Woody', 'Spicy'],
    moods: ['Confident', 'Intellectual', 'Serene', 'Refined'],
    occasions: ['Boardroom', 'Evening Affairs', 'Signature Daily Wear'],
    top_notes: ['Green Cardamom', 'Violet Leaf', 'Papyrus Accord'],
    heart_notes: ['Orris Butter', 'Virginian Cedarwood', 'Incense Smoke'],
    base_notes: ['Mysore Sandalwood Album', 'Leather', 'Warm Amber'],
    ingredients: 'Alcohol Denat., Parfum, Aqua, Alpha-Isomethyl Ionone, Eugenol, Isoeugenol.',
    images: {
      main: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=85',
      hover: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=85'
      ]
    },
    variants: [
      {
        id: 'var-5-75',
        size_ml: 75,
        label: '75ml Flacon',
        sku: 'AUR-AIS-077',
        price: 5900,
        cost_price: 2300,
        stock: 84,
        reserved: 3,
        low_stock_threshold: 25,
        barcode: '8901234567898'
      }
    ],
    rating: 4.85,
    review_count: 49,
    badge: 'Limited Stock',
    is_featured: true,
    status: 'Published',
    created_at: '2024-02-01'
  },
  {
    id: 'prod-6',
    name: 'Vanilla Bourbon Infusion',
    slug: 'vanilla-bourbon-infusion',
    brand: 'Aura Oud',
    subtitle: 'Atelier Gourmand Collection · Dark Nectar',
    description: 'Never cloyingly sweet: this is charred, adult vanilla bean aged in French oak barrels with dark rum notes, amber resins, and a whisper of golden tobacco.',
    category: 'Extraits',
    collection: 'Private Reserve',
    gender: 'Unisex',
    concentration: 'Extrait de Parfum (30-35%)',
    longevity: 'Eternal (14+ hrs)',
    sillage: 'Heavy Projection',
    best_season: 'Winter / Cold Evenings',
    maceration_days: 90,
    density_index: '0.950 g/cm³',
    vault_location: {
      vault: 'Vault B',
      rack: 'Rack 06',
      bay: 'Shelf D2'
    },
    supplier: {
      name: 'Laboratoires Grasse Essences S.A.',
      location: 'France / Madagascar',
      lead_time_days: 14
    },
    families: ['Gourmand', 'Oriental'],
    moods: ['Comforting', 'Intoxicating', 'Cozy', 'Sensuous'],
    occasions: ['Winter Nights', 'Intimate Dinners', 'Special Occasions'],
    top_notes: ['Dark Rum Cask', 'Caramelized Sugar', 'Bitter Almond'],
    heart_notes: ['Madagascar Bourbon Vanilla Pods', 'Smoked Cocoa Butter', 'Tobacco Flower'],
    base_notes: ['Benzoin Siam', 'White Amber', 'Charred Oak Wood'],
    ingredients: 'Alcohol Denat., Parfum, Aqua, Coumarin, Benzyl Benzoate, Vanillin.',
    images: {
      main: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=85',
      hover: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=85'
      ]
    },
    variants: [
      {
        id: 'var-6-50',
        size_ml: 50,
        label: '50ml Flacon',
        sku: 'AUR-AVB-015',
        price: 4600,
        cost_price: 1900,
        stock: 62,
        reserved: 1,
        low_stock_threshold: 20,
        barcode: '8901234567899'
      },
      {
        id: 'var-6-100',
        size_ml: 100,
        label: '100ml Flacon',
        sku: 'AUR-AVB-016',
        price: 7200,
        cost_price: 2900,
        stock: 35,
        reserved: 0,
        low_stock_threshold: 15,
        barcode: '8901234567800'
      }
    ],
    rating: 4.9,
    review_count: 73,
    badge: 'Best Seller',
    is_featured: true,
    status: 'Published',
    created_at: '2024-01-25'
  },
  {
    id: 'prod-7',
    name: 'Musk Al Ghazal 12ml Attar',
    slug: 'musk-al-ghazal',
    brand: 'Aura Oud',
    subtitle: 'Private Reserve · Non-Alcoholic Botanical Tola',
    description: 'An ethereal black botanical deer-musk accord crafted purely through herbal macerations and ambergris extracts. Deeply grounding, hypnotic, and sacred.',
    category: 'Attars',
    collection: 'Private Reserve',
    gender: 'Unisex',
    concentration: 'Pure Attar / Concentrated Oil',
    longevity: 'Eternal (14+ hrs)',
    sillage: 'Moderate',
    best_season: 'All Seasons',
    maceration_days: 120,
    density_index: '0.990 g/cm³',
    vault_location: {
      vault: 'Vault A',
      rack: 'Rack 01',
      bay: 'Vault Safe 02'
    },
    supplier: {
      name: 'Kannauj Heritage Distillers',
      location: 'India',
      lead_time_days: 21
    },
    families: ['Musk', 'Oriental'],
    moods: ['Enigmatic', 'Hypnotic', 'Sacred', 'Clean'],
    occasions: ['Spiritual Practice', 'Evening', 'Signature Fragrance Layering'],
    top_notes: ['Cardamom Pods', 'Sweet Fennel Seed'],
    heart_notes: ['Kashmiri Saffron', 'Rose de Mai', 'Black Licorice Root'],
    base_notes: ['Botanical Black Musk Accord', 'White Oud', 'Amber Stone'],
    ingredients: '100% Pure Essential Perfume Oil. 0% Alcohol.',
    images: {
      main: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=85',
      hover: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=1000&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=85'
      ]
    },
    variants: [
      {
        id: 'var-7-12',
        size_ml: 12,
        label: '12ml Tola Crystal Flacon',
        sku: 'AUR-MAG-003',
        price: 8200,
        cost_price: 3400,
        stock: 29,
        reserved: 1,
        low_stock_threshold: 15,
        barcode: '8901234567801'
      }
    ],
    rating: 4.95,
    review_count: 36,
    badge: 'Limited Stock',
    is_featured: false,
    status: 'Published',
    created_at: '2024-02-28'
  },
  {
    id: 'prod-8',
    name: 'Saffron Imperial Extrait',
    slug: 'saffron-imperial',
    brand: 'Aura Oud',
    subtitle: 'Heritage Oud Master Line · Crimson Gold',
    description: 'Celebrating the crown spice of Persia and Kashmir. Hand-selected deep red saffron stigmas blended with bitter almond, jasmine grandiflorum, and cedarwood.',
    category: 'Extraits',
    collection: 'Heritage Oud',
    gender: 'Unisex',
    concentration: 'Extrait de Parfum (30-35%)',
    longevity: 'Eternal (14+ hrs)',
    sillage: 'Heavy Projection',
    best_season: 'Autumn / Winter',
    maceration_days: 75,
    density_index: '0.938 g/cm³',
    vault_location: {
      vault: 'Vault A',
      rack: 'Rack 04',
      bay: 'Shelf C3'
    },
    supplier: {
      name: 'Laboratoires Grasse Essences S.A.',
      location: 'France',
      lead_time_days: 14
    },
    families: ['Spicy', 'Oriental', 'Woody'],
    moods: ['Opulent', 'Radiant', 'Distinguished', 'Charismatic'],
    occasions: ['Grand Receptions', 'Formal Galas', 'Festive Occasions'],
    top_notes: ['Kashmiri Red Saffron', 'Bitter Almond Oil', 'Blood Orange'],
    heart_notes: ['Egyptian Jasmine', 'Cedarwood Atlas', 'Warm Ambergris'],
    base_notes: ['Fir Balsam', 'Mineral Amber', 'Musk'],
    ingredients: 'Alcohol Denat., Parfum, Aqua, Limonene, Linalool, Evernia Prunastri Extract.',
    images: {
      main: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=85',
      hover: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=85'
      ]
    },
    variants: [
      {
        id: 'var-8-100',
        size_ml: 100,
        label: '100ml Flacon',
        sku: 'AUR-SAF-100',
        price: 7900,
        cost_price: 3100,
        stock: 94,
        reserved: 2,
        low_stock_threshold: 25,
        barcode: '8901234567802'
      }
    ],
    rating: 4.88,
    review_count: 29,
    badge: 'New Arrival',
    is_featured: true,
    status: 'Published',
    created_at: '2024-03-12'
  },
  {
    id: 'prod-9',
    name: 'Fleur de Tabac & Honey',
    slug: 'fleur-de-tabac',
    brand: 'Aura Oud',
    subtitle: 'Private Blend Reserve · Golden Leaf',
    description: 'Dried Cuban tobacco leaf soaked in wild heather honey, ginger blossoms, and tonka bean. Deeply warm, luxurious, and enveloping.',
    category: 'EDPs',
    collection: 'Private Reserve',
    gender: 'Men',
    concentration: 'Eau de Parfum (18-20%)',
    longevity: 'Long Lasting (8-12 hrs)',
    sillage: 'Heavy Projection',
    best_season: 'Autumn / Winter',
    maceration_days: 60,
    density_index: '0.932 g/cm³',
    vault_location: {
      vault: 'Vault B',
      rack: 'Rack 04',
      bay: 'Shelf B1'
    },
    supplier: {
      name: 'Laboratoires Grasse Essences S.A.',
      location: 'France',
      lead_time_days: 14
    },
    families: ['Oriental', 'Gourmand', 'Woody'],
    moods: ['Warm', 'Magnetic', 'Sophisticated', 'Comforting'],
    occasions: ['Evening Out', 'Cigar Lounges', 'Winter Dinners'],
    top_notes: ['Ginger Root', 'Coriander Seeds', 'Golden Apricot'],
    heart_notes: ['Aged Tobacco Leaf', 'Wild Heather Honey', 'Cacao Pods'],
    base_notes: ['Vanilla Bean', 'Tonka Bean', 'Dry Woody Sap'],
    ingredients: 'Alcohol Denat., Parfum, Aqua, Coumarin, Eugenol, Cinnamal.',
    images: {
      main: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=85',
      hover: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=85'
      ]
    },
    variants: [
      {
        id: 'var-9-100',
        size_ml: 100,
        label: '100ml Flacon',
        sku: 'AUR-TAB-100',
        price: 5200,
        cost_price: 2100,
        stock: 112,
        reserved: 3,
        low_stock_threshold: 30,
        barcode: '8901234567803'
      }
    ],
    rating: 4.82,
    review_count: 44,
    badge: 'Best Seller',
    is_featured: false,
    status: 'Published',
    created_at: '2024-01-18'
  },
  {
    id: 'prod-10',
    name: 'Atelier Discovery Set (5 x 10ml)',
    slug: 'atelier-discovery-set',
    brand: 'Aura Oud',
    subtitle: 'The Olfactive Anthology · 5 Iconic Specimens',
    description: 'Experience our complete olfactory range before acquiring a full-size flacon. Includes 10ml atomisers of Oud Royale, Velvet Rose, Citrus Riviera, Imperial Santal, and Vanilla Bourbon in a handcrafted bespoke presentation box.',
    category: 'Discovery',
    collection: 'Master Distillates',
    gender: 'Unisex',
    concentration: 'Eau de Parfum (18-20%)',
    longevity: 'Long Lasting (8-12 hrs)',
    sillage: 'Heavy Projection',
    best_season: 'All Seasons',
    maceration_days: 60,
    density_index: '0.930 g/cm³',
    vault_location: {
      vault: 'Vault B',
      rack: 'Rack 01',
      bay: 'Box Array 04'
    },
    supplier: {
      name: 'Aura Oud Atelier HQ',
      location: 'London & Lahore',
      lead_time_days: 7
    },
    families: ['Woody', 'Oriental', 'Floral', 'Fresh', 'Gourmand'],
    moods: ['Versatile', 'Curious', 'Exploratory'],
    occasions: ['Gifting', 'Sampling', 'Travel Companions'],
    top_notes: ['Varied Across 5 Flacons'],
    heart_notes: ['Varied Across 5 Flacons'],
    base_notes: ['Varied Across 5 Flacons'],
    ingredients: 'Set of 5 luxury 10ml vials with premium travel atomisers.',
    images: {
      main: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85',
      hover: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85'
      ]
    },
    variants: [
      {
        id: 'var-10-50',
        size_ml: 50,
        label: '5 x 10ml Presentation Box',
        sku: 'AUR-DSC-005',
        price: 4950,
        cost_price: 1850,
        stock: 210,
        reserved: 12,
        low_stock_threshold: 40,
        barcode: '8901234567804'
      }
    ],
    rating: 4.96,
    review_count: 118,
    badge: 'Best Seller',
    is_featured: true,
    status: 'Published',
    created_at: '2024-01-05'
  },
  {
    id: 'prod-11',
    name: 'Midnight Sandalwood Tester Flacon',
    slug: 'midnight-sandalwood-tester',
    brand: 'Aura Oud',
    subtitle: 'Showroom Testing Unit · Laboratory Calibration',
    description: 'Internal testing flacon allocated for boutique counters in London, Dubai, and Lahore. Features calibrated apothecary measurement markings.',
    category: 'Testers',
    collection: 'Master Distillates',
    gender: 'Unisex',
    concentration: 'Eau de Parfum (18-20%)',
    longevity: 'Long Lasting (8-12 hrs)',
    sillage: 'Moderate',
    best_season: 'All Seasons',
    maceration_days: 90,
    density_index: '0.932 g/cm³',
    vault_location: {
      vault: 'Vault A',
      rack: 'Rack 07',
      bay: 'Showroom Depot'
    },
    supplier: {
      name: 'Kannauj Heritage Distillers',
      location: 'India',
      lead_time_days: 21
    },
    families: ['Woody', 'Musk'],
    moods: ['Clinical', 'Quiet', 'Woody'],
    occasions: ['Boutique Testing Only'],
    top_notes: ['Pink Pepper', 'Elemi'],
    heart_notes: ['Cedarwood', 'Cypress'],
    base_notes: ['Australian Sandalwood', 'White Musk'],
    ingredients: 'Alcohol Denat., Parfum, Aqua.',
    images: {
      main: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=85',
      hover: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=85'
      ]
    },
    variants: [
      {
        id: 'var-11-100',
        size_ml: 100,
        label: '100ml Tester Unit',
        sku: 'AUR-TST-005',
        price: 4800,
        cost_price: 1200,
        stock: 4, // low stock flag
        reserved: 0,
        low_stock_threshold: 5,
        barcode: '8901234567805'
      }
    ],
    rating: 4.6,
    review_count: 12,
    badge: 'Limited Stock',
    is_featured: false,
    status: 'Published',
    created_at: '2024-03-01'
  },
  {
    id: 'prod-12',
    name: 'Emerald Vetiver & Haitian Woods',
    slug: 'emerald-vetiver',
    brand: 'Aura Oud',
    subtitle: 'Private Reserve · Crisp Earth',
    description: 'Crisp green smoky vetiver roots harvested in Les Cayes, intertwined with pink grapefruit zest, crushed cedar needles, and damp earth. The ultimate gentleman signature.',
    category: 'EDPs',
    collection: 'Private Reserve',
    gender: 'Men',
    concentration: 'Eau de Parfum (18-20%)',
    longevity: 'Long Lasting (8-12 hrs)',
    sillage: 'Moderate',
    best_season: 'Spring / Summer / Daytime',
    maceration_days: 60,
    density_index: '0.925 g/cm³',
    vault_location: {
      vault: 'Vault A',
      rack: 'Rack 02',
      bay: 'Shelf C2'
    },
    supplier: {
      name: 'Laboratoires Grasse Essences S.A.',
      location: 'France / Haiti',
      lead_time_days: 14
    },
    families: ['Woody', 'Fresh'],
    moods: ['Clean', 'Distinguished', 'Grounded', 'Earthy'],
    occasions: ['Executive Daytime', 'Formal Meetings', 'Signature Daily Wear'],
    top_notes: ['Pink Grapefruit', 'Cardamom', 'Bitter Orange'],
    heart_notes: ['Haitian Vetiver Root', 'Geranium Leaf', 'Pink Pepper'],
    base_notes: ['Oakmoss', 'Cedarwood Atlas', 'Clean Musk'],
    ingredients: 'Alcohol Denat., Parfum, Aqua, Limonene, Linalool, Evernia Furfuracea Extract.',
    images: {
      main: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85',
      hover: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85'
      ]
    },
    variants: [
      {
        id: 'var-12-100',
        size_ml: 100,
        label: '100ml Flacon',
        sku: 'AUR-VET-100',
        price: 4900,
        cost_price: 1800,
        stock: 78,
        reserved: 1,
        low_stock_threshold: 20,
        barcode: '8901234567806'
      }
    ],
    rating: 4.78,
    review_count: 31,
    badge: 'New Arrival',
    is_featured: false,
    status: 'Published',
    created_at: '2024-03-20'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Sheikh Tariq Al-Mansoor',
    email: 'tariq.almansoor@royalestate.ae',
    phone: '+92 300 8821940',
    city: 'Lahore',
    tier: 'VIP Gold',
    total_spent: 185000,
    order_count: 14,
    created_at: '2023-08-15',
    addresses: [
      {
        name: 'Sheikh Tariq Al-Mansoor',
        phone: '0300-8821940',
        province: 'Punjab',
        city: 'Lahore',
        address_line: 'Villa 14, Sector Y, Phase 5, DHA',
        postal_code: '54792'
      }
    ]
  },
  {
    id: 'cust-2',
    name: 'Zainab Qureshi',
    email: 'zainab.q@gmail.com',
    phone: '0321-4559081',
    city: 'Karachi',
    tier: 'Platinum Connoisseur',
    total_spent: 98000,
    order_count: 9,
    created_at: '2023-10-04',
    addresses: [
      {
        name: 'Zainab Qureshi',
        phone: '0321-4559081',
        province: 'Sindh',
        city: 'Karachi',
        address_line: 'B-42, 26th Street, Phase 6, DHA',
        postal_code: '75500'
      }
    ]
  },
  {
    id: 'cust-3',
    name: 'Hamza Farooq',
    email: 'hamza.farooq@outlook.com',
    phone: '0333-5120934',
    city: 'Islamabad',
    tier: 'Patron',
    total_spent: 42000,
    order_count: 4,
    created_at: '2024-01-12',
    addresses: [
      {
        name: 'Hamza Farooq',
        phone: '0333-5120934',
        province: 'Islamabad Capital Territory',
        city: 'Islamabad',
        address_line: 'House 18, Street 44, F-7/1',
        postal_code: '44000'
      }
    ]
  },
  {
    id: 'cust-4',
    name: 'Amina Bilal',
    email: 'amina.bilal@yahoo.com',
    phone: '0302-8761234',
    city: 'Faisalabad',
    tier: 'New Client',
    total_spent: 12500,
    order_count: 2,
    created_at: '2024-02-18',
    addresses: [
      {
        name: 'Amina Bilal',
        phone: '0302-8761234',
        province: 'Punjab',
        city: 'Faisalabad',
        address_line: 'Canal Road, Officers Colony No. 1',
        postal_code: '38000'
      }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1024',
    order_number: 'ORD-1024',
    created_at: '2024-10-24T11:20:00Z',
    customer: {
      id: 'cust-1',
      name: 'Sheikh Tariq Al-Mansoor',
      email: 'tariq.almansoor@royalestate.ae',
      phone: '0300-8821940',
      is_guest: false
    },
    items: [
      {
        id: 'item-1',
        product_id: 'prod-1',
        product_name: 'Oud Royale Extrait de Parfum',
        product_slug: 'oud-royale-extrait',
        variant_id: 'var-1-100',
        size_ml: 100,
        sku: 'AUR-OUD-001',
        image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=400&q=80',
        price_snapshot: 6500,
        quantity: 1
      },
      {
        id: 'item-2',
        product_id: 'prod-4',
        product_name: 'Citrus Riviera & Neroli EDP',
        product_slug: 'citrus-riviera-neroli',
        variant_id: 'var-4-100',
        size_ml: 100,
        sku: 'AUR-CIT-022',
        image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=400&q=80',
        price_snapshot: 3800,
        quantity: 2
      }
    ],
    shipping_address: {
      name: 'Sheikh Tariq Al-Mansoor',
      phone: '0300-8821940',
      province: 'Punjab',
      city: 'Lahore',
      address_line: 'Villa 14, Sector Y, Phase 5, DHA',
      postal_code: '54792'
    },
    delivery_method: 'Express (24-48 hrs)',
    subtotal: 14100,
    discount: 1410, // 10% VIP
    shipping_fee: 0, // Free over 5000
    cod_fee: 0,
    total: 12690,
    status: 'Processing',
    payment_method: 'Credit/Debit Card',
    payment_status: 'Paid',
    courier: 'TCS',
    tracking_number: 'TCS-90218841-PK',
    status_history: [
      {
        status: 'Pending',
        timestamp: '2024-10-24T11:20:00Z',
        note: 'Order placed via Online Boutique',
        actor: 'Customer'
      },
      {
        status: 'Confirmed',
        timestamp: '2024-10-24T11:25:00Z',
        note: 'Payment authorized and card settlement confirmed',
        actor: 'Payment Gateway'
      },
      {
        status: 'Processing',
        timestamp: '2024-10-24T11:40:00Z',
        note: 'Cellar batch lot allocated and packed into luxury velvet coffret',
        actor: 'Julian Vance (Admin)'
      }
    ],
    notes: 'VIP Patron. Include complementary 2ml sample of Vanilla Bourbon.'
  },
  {
    id: 'ord-1023',
    order_number: 'ORD-1023',
    created_at: '2024-10-23T15:45:00Z',
    customer: {
      id: 'cust-2',
      name: 'Zainab Qureshi',
      email: 'zainab.q@gmail.com',
      phone: '0321-4559081',
      is_guest: false
    },
    items: [
      {
        id: 'item-3',
        product_id: 'prod-2',
        product_name: 'Velvet Rose & Tonka EDP',
        product_slug: 'velvet-rose-tonka',
        variant_id: 'var-2-50',
        size_ml: 50,
        sku: 'AUR-ROSE-014',
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=400&q=80',
        price_snapshot: 3850,
        quantity: 1
      }
    ],
    shipping_address: {
      name: 'Zainab Qureshi',
      phone: '0321-4559081',
      province: 'Sindh',
      city: 'Karachi',
      address_line: 'B-42, 26th Street, Phase 6, DHA',
      postal_code: '75500'
    },
    delivery_method: 'Standard (3-5 days)',
    subtotal: 3850,
    discount: 0,
    shipping_fee: 250,
    cod_fee: 150,
    total: 4250,
    status: 'Shipped',
    payment_method: 'Cash on Delivery',
    payment_status: 'Pending',
    courier: 'Leopards',
    tracking_number: 'LEO-77192038',
    status_history: [
      {
        status: 'Pending',
        timestamp: '2024-10-23T15:45:00Z',
        note: 'COD order placed',
        actor: 'Customer'
      },
      {
        status: 'Confirmed',
        timestamp: '2024-10-23T16:10:00Z',
        note: 'Phone verification confirmed with client',
        actor: 'Order Desk'
      },
      {
        status: 'Shipped',
        timestamp: '2024-10-24T09:30:00Z',
        note: 'Dispatched via Leopards Courier Express',
        actor: 'Warehouse Lead'
      }
    ]
  },
  {
    id: 'ord-1022',
    order_number: 'ORD-1022',
    created_at: '2024-10-22T09:15:00Z',
    customer: {
      name: 'Daniyal Ahmed',
      email: 'daniyal.ahmed@company.pk',
      phone: '0301-4433221',
      is_guest: true
    },
    items: [
      {
        id: 'item-4',
        product_id: 'prod-10',
        product_name: 'Atelier Discovery Set (5 x 10ml)',
        product_slug: 'atelier-discovery-set',
        variant_id: 'var-10-50',
        size_ml: 50,
        sku: 'AUR-DSC-005',
        image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=400&q=80',
        price_snapshot: 4950,
        quantity: 2
      }
    ],
    shipping_address: {
      name: 'Daniyal Ahmed',
      phone: '0301-4433221',
      province: 'Islamabad Capital Territory',
      city: 'Islamabad',
      address_line: 'Apartment 402, Beverly Centre, Blue Area',
      postal_code: '44010'
    },
    delivery_method: 'Standard (3-5 days)',
    subtotal: 9900,
    discount: 500, // Coupon
    shipping_fee: 0,
    cod_fee: 0,
    total: 9400,
    status: 'Delivered',
    payment_method: 'Bank Transfer',
    payment_status: 'Verified',
    payment_proof_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    courier: 'Trax',
    tracking_number: 'TRX-55102948-PK',
    status_history: [
      {
        status: 'Pending',
        timestamp: '2024-10-22T09:15:00Z',
        note: 'Order created, awaiting bank receipt upload',
        actor: 'Guest'
      },
      {
        status: 'Confirmed',
        timestamp: '2024-10-22T10:30:00Z',
        note: 'Meezan Bank transaction verified by finance',
        actor: 'Finance'
      },
      {
        status: 'Shipped',
        timestamp: '2024-10-22T14:00:00Z',
        note: 'Handed over to Trax Logistics',
        actor: 'Warehouse'
      },
      {
        status: 'Delivered',
        timestamp: '2024-10-24T12:00:00Z',
        note: 'Delivered to client at Blue Area office',
        actor: 'Trax Courier'
      }
    ]
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'AURA10',
    discount_type: 'percentage',
    discount_value: 10,
    min_order_amount: 5000,
    max_discount_amount: 2500,
    is_active: true,
    usage_count: 42,
    description: '10% off on all orders above PKR 5,000'
  },
  {
    code: 'WELCOMEPKR',
    discount_type: 'fixed',
    discount_value: 500,
    min_order_amount: 4000,
    is_active: true,
    usage_count: 88,
    description: 'PKR 500 welcome gift on first order'
  },
  {
    code: 'FREESHIP',
    discount_type: 'free_shipping',
    discount_value: 100,
    min_order_amount: 3000,
    is_active: true,
    usage_count: 31,
    description: 'Complimentary express shipping across Pakistan'
  },
  {
    code: 'VIPROYAL',
    discount_type: 'percentage',
    discount_value: 15,
    min_order_amount: 15000,
    max_discount_amount: 5000,
    is_active: true,
    usage_count: 14,
    description: '15% connoisseur discount on orders over PKR 15,000'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    product_id: 'prod-1',
    user_name: 'Dr. Shahzad K.',
    user_city: 'Islamabad',
    rating: 5,
    title: 'The pinnacle of real Oud in Pakistan',
    body: 'I own Roja and Clive Christian, but this Extrait stands shoulder to shoulder with the greatest niche houses in the world. The Cambodian oud is rich, animalic yet clean, with an extraordinary drydown lasting past 18 hours.',
    is_verified_purchase: true,
    helpful_votes: 24,
    created_at: '2024-02-18',
    status: 'Approved'
  },
  {
    id: 'rev-2',
    product_id: 'prod-1',
    user_name: 'Farhan M.',
    user_city: 'Lahore',
    rating: 5,
    title: 'Immense sillage and regal aura',
    body: 'Sprayed two sprays for a wedding reception at Faletti’s. People were asking about the fragrance across the room. Arrived in DHA within 24 hours via express.',
    is_verified_purchase: true,
    helpful_votes: 19,
    created_at: '2024-03-02',
    status: 'Approved'
  },
  {
    id: 'rev-3',
    product_id: 'prod-2',
    user_name: 'Mariam Siddiqui',
    user_city: 'Karachi',
    rating: 5,
    title: 'Sublime, seductive rose',
    body: 'Not a generic soapy rose. This has depth, roasted warmth, and velvety tonka sweetness that feels utterly Parisian. My absolute signature now.',
    is_verified_purchase: true,
    helpful_votes: 15,
    created_at: '2024-03-14',
    status: 'Approved'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2024-10-24 11:40 AM',
    actor: 'Julian Vance',
    role: 'Super Admin',
    action: 'Order Processed',
    target_entity: 'Order #ORD-1024',
    details: 'Allocated batch lot #OR-2024-B4 and marked status as Processing.'
  },
  {
    id: 'log-2',
    timestamp: '2024-10-24 10:15 AM',
    actor: 'Julian Vance',
    role: 'Super Admin',
    action: 'Stock Reconciliation',
    target_entity: 'Oud Royale 100ml',
    details: 'Deducted 3 units for London Vault POS transaction.'
  },
  {
    id: 'log-3',
    timestamp: '2024-10-23 04:30 PM',
    actor: 'Order Desk (Faraz)',
    role: 'Order Manager',
    action: 'Courier Dispatched',
    target_entity: 'Order #ORD-1023',
    details: 'Generated Leopards airway bill LEO-77192038 for COD parcel.'
  },
  {
    id: 'log-4',
    timestamp: '2024-10-22 10:30 AM',
    actor: 'Accounts Lead',
    role: 'Manager',
    action: 'Bank Proof Verified',
    target_entity: 'Order #ORD-1022',
    details: 'Verified Meezan Bank wire proof for PKR 9,400.'
  }
];
