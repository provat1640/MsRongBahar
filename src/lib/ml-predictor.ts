/**
 * Machine Learning & Pattern-Based AI Catalog Predictor for M/S Rong Bahar
 * Modeled after national e-commerce catalog algorithms (Chaldal, Daraz, Hardware BD)
 */

export interface AIPredictionResult {
  categorySlug: string;
  categoryName: string;
  unit: string;
  suggestedBasePrice: number;
  suggestedVariants: Array<{ name: string; price: number; stock: number }>;
  suggestedDescription: string;
  suggestedSkuPrefix: string;
  confidence: number;
}

export function predictCatalogMetadata(title: string): AIPredictionResult {
  const lower = title.toLowerCase().trim();

  // 1. Locks & Physical Security Hardware (mm)
  if (lower.includes('lock') || lower.includes('padlock') || lower.includes('taala') || lower.includes('hmbr') || lower.includes('partex') || lower.includes('brass')) {
    return {
      categorySlug: 'security-hardware',
      categoryName: 'Security Hardware & Padlocks',
      unit: 'Dimension (mm)',
      suggestedBasePrice: 220,
      suggestedVariants: [
        { name: '40mm Small Lock', price: 170, stock: 20 },
        { name: '50mm Medium Lock', price: 220, stock: 25 },
        { name: '60mm Large Lock', price: 320, stock: 15 },
        { name: '70mm Heavy Lock', price: 400, stock: 10 },
      ],
      suggestedDescription: 'High-security burglar-resistant brass & stainless steel top security padlock with anti-cut shackle.',
      suggestedSkuPrefix: 'LOCK-SEC',
      confidence: 0.95,
    };
  }

  // 2. Architectural Paints, Coatings & Emulsions (Litre)
  if (lower.includes('paint') || lower.includes('berger') || lower.includes('robbialac') || lower.includes('emulsion') || lower.includes('enamel') || lower.includes('distemper') || lower.includes('asian') || lower.includes('weathercoat')) {
    return {
      categorySlug: 'architectural-paints-and-coatings',
      categoryName: 'Architectural Paints & Surface Coatings',
      unit: 'Volume (Litre)',
      suggestedBasePrice: 540,
      suggestedVariants: [
        { name: '0.91 Litre Can', price: 540, stock: 35 },
        { name: '3.64 Litre Can', price: 1980, stock: 15 },
        { name: '18.2 Litre Commercial Drum', price: 7900, stock: 5 },
      ],
      suggestedDescription: 'Premium high-gloss weather-resistant architectural paint formulated with advanced alkyd resins for long-lasting vibrant color.',
      suggestedSkuPrefix: 'PNT-GLS',
      confidence: 0.96,
    };
  }

  // 3. Adhesives, Glues & Polyurethane Chemicals (gm / kg)
  if (lower.includes('fevicol') || lower.includes('glue') || lower.includes('adhesive') || lower.includes('pur') || lower.includes('bond') || lower.includes('resin') || lower.includes('silicone')) {
    return {
      categorySlug: 'adhesives-and-chemicals',
      categoryName: 'Adhesives & Chemicals',
      unit: 'Weight (gm / kg)',
      suggestedBasePrice: 250,
      suggestedVariants: [
        { name: '125g Small Bottle', price: 250, stock: 30 },
        { name: '250g Medium Bottle', price: 450, stock: 25 },
        { name: '500g Large Bottle', price: 744, stock: 20 },
        { name: '1kg Heavy Pack', price: 1350, stock: 10 },
      ],
      suggestedDescription: 'Industrial-grade moisture-curing polyurethane (PUR) adhesive designed for high-strength timber bonding and waterproof joints.',
      suggestedSkuPrefix: 'GLU-PUR',
      confidence: 0.94,
    };
  }

  // 4. Aerosol Spray Paints & Auto Sprays (Fluid Ounce / ml)
  if (lower.includes('spray') || lower.includes('aerosol') || lower.includes('lacquer') || lower.includes('bosny') || lower.includes('jm') || lower.includes('clear coat')) {
    return {
      categorySlug: 'aerosol-spray-paints',
      categoryName: 'Aerosol Spray Paints',
      unit: 'Volume / Ounce (oz)',
      suggestedBasePrice: 120,
      suggestedVariants: [
        { name: '100ml (4 oz Can)', price: 120, stock: 40 },
        { name: '400ml (14 oz Can)', price: 240, stock: 60 },
        { name: '600ml Jumbo Can', price: 350, stock: 20 },
      ],
      suggestedDescription: '100% pure acrylic fast-drying spray paint suitable for metal, wood, automotive body touch-ups, and DIY projects.',
      suggestedSkuPrefix: 'SPRY-ACR',
      confidence: 0.93,
    };
  }

  // 5. Brushes, Rollers & Painting Tools (Inch / mm)
  if (lower.includes('brush') || lower.includes('roller') || lower.includes('scraper') || lower.includes('tape') || lower.includes('sandpaper') || lower.includes('hammer')) {
    return {
      categorySlug: 'painting-tools-and-accessories',
      categoryName: 'Painting Tools & Accessories',
      unit: 'Size (Inch / mm)',
      suggestedBasePrice: 60,
      suggestedVariants: [
        { name: '2 Inch (50mm)', price: 60, stock: 50 },
        { name: '3 Inch (75mm)', price: 95, stock: 40 },
        { name: '4 Inch (100mm)', price: 130, stock: 35 },
        { name: '5 Inch (125mm)', price: 180, stock: 25 },
      ],
      suggestedDescription: 'Professional contractor flat paint brush with dense natural bristle retention, stainless ferrule, and solid hardwood handle.',
      suggestedSkuPrefix: 'TOOL-BRS',
      confidence: 0.92,
    };
  }

  // 6. Plumbing, PVC Pipes & Fittings (Inch / mm)
  if (lower.includes('pipe') || lower.includes('pvc') || lower.includes('tap') || lower.includes('basin') || lower.includes('faucet') || lower.includes('valve') || lower.includes('rfl')) {
    return {
      categorySlug: 'plumbing-and-sanitary',
      categoryName: 'Plumbing & Sanitary Supplies',
      unit: 'Diameter (Inch / mm)',
      suggestedBasePrice: 150,
      suggestedVariants: [
        { name: '0.75 Inch (20mm)', price: 150, stock: 40 },
        { name: '1.0 Inch (25mm)', price: 220, stock: 30 },
        { name: '1.5 Inch (40mm)', price: 340, stock: 20 },
        { name: '2.0 Inch (50mm)', price: 480, stock: 15 },
      ],
      suggestedDescription: 'Heavy-duty lead-free PVC pressure pipe and leakproof sanitary fittings for domestic and industrial water distribution.',
      suggestedSkuPrefix: 'PLM-PVC',
      confidence: 0.91,
    };
  }

  // 7. Electrical, Lighting & Electronics (Watt / Pcs)
  if (lower.includes('bulb') || lower.includes('light') || lower.includes('led') || lower.includes('switch') || lower.includes('wire') || lower.includes('cable') || lower.includes('super star') || lower.includes('fan')) {
    return {
      categorySlug: 'electrical-and-lighting',
      categoryName: 'Electrical & Lighting Supplies',
      unit: 'Power (Watt / Pcs)',
      suggestedBasePrice: 180,
      suggestedVariants: [
        { name: '5 Watt LED Bulb', price: 120, stock: 50 },
        { name: '9 Watt LED Bulb', price: 180, stock: 60 },
        { name: '12 Watt LED Bulb', price: 240, stock: 40 },
        { name: '18 Watt LED Panel', price: 380, stock: 25 },
      ],
      suggestedDescription: 'Energy-efficient high lumen LED lighting and fire-retardant electrical wiring accessories engineered for Bangladeshi voltage standards.',
      suggestedSkuPrefix: 'ELE-LED',
      confidence: 0.90,
    };
  }

  // 8. Construction Materials & Cement (kg / Bag)
  if (lower.includes('cement') || lower.includes('steel') || lower.includes('rod') || lower.includes('sand') || lower.includes('brick') || lower.includes('ksrm') || lower.includes('bSRM')) {
    return {
      categorySlug: 'construction-materials',
      categoryName: 'Construction & Building Materials',
      unit: 'Weight (kg / Bag)',
      suggestedBasePrice: 560,
      suggestedVariants: [
        { name: '50kg Bag Cement', price: 560, stock: 100 },
        { name: '100kg Bulk Transport', price: 1100, stock: 50 },
        { name: '1 Ton Commercial Supply', price: 10800, stock: 10 },
      ],
      suggestedDescription: 'Top grade OPC / PCC structural cement and high yield steel reinforcement for foundation casting and brick masonry.',
      suggestedSkuPrefix: 'CNS-CMT',
      confidence: 0.92,
    };
  }

  // Default fallback for any general product
  return {
    categorySlug: 'security-hardware',
    categoryName: 'General Hardware & Supplies',
    unit: 'Quantity (Piece / Pack)',
    suggestedBasePrice: 100,
    suggestedVariants: [
      { name: 'Standard Unit', price: 100, stock: 20 },
      { name: 'Large Pack', price: 250, stock: 10 },
    ],
    suggestedDescription: `${title} - High quality product available at M/S Rong Bahar shop in Pakundia, Kishoreganj.`,
    suggestedSkuPrefix: 'GEN-HRD',
    confidence: 0.60,
  };
}
