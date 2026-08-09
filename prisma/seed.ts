import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding M/S Rong Bahar catalog with verified shop stock categories...');

  // Clean existing data
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.unit.deleteMany({});
  await prisma.user.deleteMany({});

  // Password hashes
  const adminPassword = await bcrypt.hash('Habib123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  // Admin User (Strict ID: Habib01722452836)
  await prisma.user.create({
    data: {
      name: 'M/S Rong Bahar Manager (Habib)',
      phone: 'Habib01722452836',
      email: 'Habib01722452836',
      password: adminPassword,
      role: 'ADMIN',
      address: 'Mothkhola Road, Pakundia',
      district: 'Kishoreganj',
      thana: 'Pakundia',
    },
  });

  // Customer User (ID: 01812345678)
  await prisma.user.create({
    data: {
      name: 'Rahim Chowdhury',
      phone: '01812345678',
      email: 'rahim@gmail.com',
      password: userPassword,
      role: 'USER',
      address: 'Mothkhola Bazar Road, Pakundia',
      district: 'Kishoreganj',
      thana: 'Pakundia',
    },
  });

  // Seed Units
  await prisma.unit.createMany({
    data: [
      { name: 'Dimension (mm)', category: 'Dimension' },
      { name: 'Size (Inch / mm)', category: 'Dimension' },
      { name: 'Volume (Litre)', category: 'Volume' },
      { name: 'Weight (gm / kg)', category: 'Weight' },
      { name: 'Volume / Ounce (oz)', category: 'Fluid Ounce' },
      { name: 'Quantity (Piece / Pack)', category: 'Quantity' },
    ],
  });

  // Categories (Matching Shop Inventory & SRS Specifications)
  const catEnamel = await prisma.category.create({
    data: {
      name: 'Synthetic Enamel Paints',
      slug: 'synthetic-enamel-paints',
      description: 'Berger Robbialac, Aqua Paints CNG Green & Polac high gloss synthetic enamel paints.',
      image: '/products/2412.jpg',
    },
  });

  const catLacquer = await prisma.category.create({
    data: {
      name: 'Acrylic Lacquer Sprays',
      slug: 'acrylic-lacquer-sprays',
      description: 'JM Acrylic Lacquer spray cans 400ml (Light Green 37, Clear Gloss).',
      image: '/products/2414.jpg',
    },
  });

  const catAdhesives = await prisma.category.create({
    data: {
      name: 'Adhesives & Glues',
      slug: 'adhesives-and-glues',
      description: 'Fevicol 1K PUR Polyurethane waterproof wood adhesive & super glue.',
      image: '/products/2413.jpg',
    },
  });

  const catBrushes = await prisma.category.create({
    data: {
      name: 'Paint Brushes & Tools',
      slug: 'paint-brushes-and-tools',
      description: 'Wooden handle brushes (Size 125 / 4") and 4-row steel wire scraping brushes.',
      image: '/products/2417.jpg',
    },
  });

  const catLocks = await prisma.category.create({
    data: {
      name: 'Padlocks & Security',
      slug: 'padlocks-and-security',
      description: 'HMBR stainless steel heavy duty top security padlocks (50mm, 60mm).',
      image: '/products/2415.jpg',
    },
  });

  const catPowerScale = await prisma.category.create({
    data: {
      name: 'Power & Scale Tools',
      slug: 'power-and-scale-tools',
      description: 'Omega digital price computing 30kg scales & XParT electric glue guns.',
      image: '/products/2425.jpg',
    },
  });

  const catHammers = await prisma.category.create({
    data: {
      name: 'Hammers & Striking Tools',
      slug: 'hammers-and-striking-tools',
      description: '500g claw hammers & 2kg heavy sledgehammers with rubber grips.',
      image: '/products/2426.jpg',
    },
  });

  const catCutting = await prisma.category.create({
    data: {
      name: 'Cutting Blades & Discs',
      slug: 'cutting-blades-and-discs',
      description: '4 inch diamond tile cutting blades & metal iron grinding discs.',
      image: '/products/2427.jpg',
    },
  });

  const catMarine = await prisma.category.create({
    data: {
      name: 'Marine Coatings',
      slug: 'marine-coatings',
      description: 'Polac & Rainbow marine grade anti-corrosive red oxide primers.',
      image: '/products/2418.jpg',
    },
  });

  const catInterior = await prisma.category.create({
    data: {
      name: 'Interior Paints',
      slug: 'interior-paints',
      description: 'Berger Easy Clean, Robbialac Silk, Aqua Muslin & Superstar interior top coats & primers.',
      image: '/products/2412.jpg',
    },
  });

  const catExterior = await prisma.category.create({
    data: {
      name: 'Exterior Paints',
      slug: 'exterior-paints',
      description: 'Berger WeatherCoat Supreme & LongLife, Aqua Platina weatherproof exterior paints.',
      image: '/products/2412.jpg',
    },
  });

  const catWaterproofing = await prisma.category.create({
    data: {
      name: 'Waterproofing Systems',
      slug: 'waterproofing-systems',
      description: 'Berger DampShield Elasto & Aqua DampStop hydrostatic dampness defense coatings.',
      image: '/products/2412.jpg',
    },
  });

  const catWoodCoating = await prisma.category.create({
    data: {
      name: 'Wood Coating & Varnish',
      slug: 'wood-coating-and-varnish',
      description: 'Berger WoodKeeper PU Varnish, Innova & Aqua WoodShine clear wood lacquers.',
      image: '/products/2412.jpg',
    },
  });

  const catUndercoats = await prisma.category.create({
    data: {
      name: 'Undercoats & Putty',
      slug: 'undercoats-and-putty',
      description: 'Berger Robbialac Undercoat White Sealer & Aqua Joy Wall Putty.',
      image: '/products/2412.jpg',
    },
  });

  // PRODUCTS & MULTI-UNIT SUB-PRODUCTS SEED

  // 1. Synthetic Enamel Paints
  await prisma.product.create({
    data: {
      title: 'Berger Robbialac Super Gloss Synthetic Enamel',
      slug: 'berger-robbialac-enamel-series',
      description: 'High gloss protective shield synthetic enamel paint for wood & metal surfaces.',
      categoryId: catEnamel.id,
      basePrice: 240,
      stock: 95,
      sku: 'BER-ROB-SGE-SERIES',
      unit: 'Volume (Litre)',
      images: JSON.stringify(['/products/2412.jpg']),
      variants: {
        create: [
          { name: '0.455 Litre Can', price: 240, stock: 40, sku: 'BER-ROB-SGE-045L' },
          { name: '0.91 Litre Tin', price: 450, stock: 35, sku: 'BER-ROB-SGE-091L' },
          { name: '3.64 Litre Gallon', price: 1700, stock: 20, sku: 'BER-ROB-SGE-364L' },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      title: 'Berger Easy Clean Fresh Interior Silk Emulsion',
      slug: 'berger-easy-clean-fresh',
      description: 'Stain resistant fresh fragrance luxury silk washable interior wall coating.',
      categoryId: catInterior.id,
      basePrice: 2650,
      stock: 28,
      sku: 'BER-EZC-FRESH',
      unit: 'Volume (Litre)',
      images: JSON.stringify(['/products/2412.jpg']),
      variants: {
        create: [
          { name: '3.64 Litre Gallon', price: 2650, stock: 20, sku: 'BER-EZC-364L' },
          { name: '18.2 Litre Drum', price: 12500, stock: 8, sku: 'BER-EZC-182L' },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      title: 'Berger WeatherCoat Supreme Plus Exterior',
      slug: 'berger-weathercoat-supreme-plus',
      description: '10-Year weather protection rain shield anti-fungal exterior wall coating.',
      categoryId: catExterior.id,
      basePrice: 920,
      stock: 37,
      sku: 'BER-WCS-PLUS',
      unit: 'Volume (Litre)',
      images: JSON.stringify(['/products/2412.jpg']),
      variants: {
        create: [
          { name: '1 Litre Can', price: 920, stock: 25, sku: 'BER-WCS-100L' },
          { name: '3.64 Litre Gallon', price: 3450, stock: 12, sku: 'BER-WCS-364L' },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      title: 'Berger DampShield Elasto Waterproofing Coating',
      slug: 'berger-dampshield-elasto',
      description: 'Elastomeric waterproofing membrane with 7 bar hydrostatic resistance.',
      categoryId: catWaterproofing.id,
      basePrice: 980,
      stock: 30,
      sku: 'BER-DMP-ELASTO',
      unit: 'Volume (Litre)',
      images: JSON.stringify(['/products/2412.jpg']),
      variants: {
        create: [
          { name: '1 Litre Can', price: 980, stock: 20, sku: 'BER-DMP-100L' },
          { name: '4 Litre Bucket', price: 3600, stock: 10, sku: 'BER-DMP-400L' },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      title: 'Berger Woodkeeper Clear Polyurethane Varnish',
      slug: 'berger-woodkeeper-varnish',
      description: 'Scratch resistant polyurethane clear gloss varnish for timber furniture.',
      categoryId: catWoodCoating.id,
      basePrice: 1250,
      stock: 15,
      sku: 'BER-WDK-VARNISH',
      unit: 'Volume (Litre)',
      images: JSON.stringify(['/products/2412.jpg']),
      variants: {
        create: [
          { name: '1 Litre Can', price: 1250, stock: 15, sku: 'BER-WDK-100L' },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      title: 'Berger Robbialac Undercoat White Sealer',
      slug: 'berger-robbialac-undercoat-white',
      description: 'High opacity matt base undercoat sealer for enamel paint and wood fillers.',
      categoryId: catUndercoats.id,
      basePrice: 460,
      stock: 50,
      sku: 'BER-ROB-UNDR-WHITE',
      unit: 'Volume (Litre)',
      images: JSON.stringify(['/products/2412.jpg']),
      variants: {
        create: [
          { name: '0.91 Litre Can', price: 460, stock: 35, sku: 'BER-UND-091L' },
          { name: '3.64 Litre Can', price: 1650, stock: 15, sku: 'BER-UND-364L' },
        ],
      },
    },
  });

  // AQUA PAINTS PRODUCTS
  await prisma.product.create({
    data: {
      title: 'Aqua Muslin Ultra-Premium Silk Emulsion',
      slug: 'aqua-muslin-silk-emulsion',
      description: 'Ultra-rich silk sheen smooth washable interior wall coating.',
      categoryId: catInterior.id,
      basePrice: 620,
      stock: 39,
      sku: 'AQU-MSL-SILK',
      unit: 'Volume (Litre)',
      images: JSON.stringify(['/products/2412.jpg']),
      variants: {
        create: [
          { name: '1 Litre Can', price: 620, stock: 25, sku: 'AQU-MSL-100L' },
          { name: '3.64 Litre Gallon', price: 2350, stock: 14, sku: 'AQU-MSL-364L' },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      title: 'Aqua Platina Weatherproof Exterior Emulsion',
      slug: 'aqua-platina-exterior',
      description: 'All-weather UV & anti-fungal exterior wall defense emulsion.',
      categoryId: catExterior.id,
      basePrice: 780,
      stock: 34,
      sku: 'AQU-PLT-EXT',
      unit: 'Volume (Litre)',
      images: JSON.stringify(['/products/2412.jpg']),
      variants: {
        create: [
          { name: '1 Litre Can', price: 780, stock: 22, sku: 'AQU-PLT-100L' },
          { name: '3.64 Litre Gallon', price: 2890, stock: 12, sku: 'AQU-PLT-364L' },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      title: 'Aqua Captain Synthetic Enamel',
      slug: 'aqua-captain-synthetic-enamel',
      description: 'High-grade alkyd gloss enamel for wood & steel surfaces.',
      categoryId: catEnamel.id,
      basePrice: 480,
      stock: 45,
      sku: 'AQU-CPT-ENAMEL',
      unit: 'Volume (Litre)',
      images: JSON.stringify(['/products/2412.jpg']),
      variants: {
        create: [
          { name: '0.91 Litre Tin', price: 480, stock: 30, sku: 'AQU-CPT-091L' },
          { name: '3.64 Litre Gallon', price: 1780, stock: 15, sku: 'AQU-CPT-364L' },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      title: 'Aqua DampStop Water Proofing Coating',
      slug: 'aqua-dampstop-waterproofing',
      description: 'Dampness & salt efflorescence heavy defense waterproofing coating.',
      categoryId: catWaterproofing.id,
      basePrice: 880,
      stock: 18,
      sku: 'AQU-DMP-STOP',
      unit: 'Volume (Litre)',
      images: JSON.stringify(['/products/2412.jpg']),
      variants: {
        create: [
          { name: '1 Litre Can', price: 880, stock: 18, sku: 'AQU-DMP-100L' },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      title: 'Aqua Joy Wall Putty Powder',
      slug: 'aqua-joy-wall-putty',
      description: 'Smooth crack-filling acrylic base wall putty.',
      categoryId: catUndercoats.id,
      basePrice: 280,
      stock: 70,
      sku: 'AQU-JOY-PUTTY',
      unit: 'Weight (gm / kg)',
      images: JSON.stringify(['/products/2412.jpg']),
      variants: {
        create: [
          { name: '5 KG Pack', price: 280, stock: 45, sku: 'AQU-PUT-5KG' },
          { name: '20 KG Bag', price: 950, stock: 25, sku: 'AQU-PUT-20KG' },
        ],
      },
    },
  });

  // HARDWARE TOOLS SEEDS
  await prisma.product.create({
    data: {
      title: 'JM Acrylic Lacquer Spray 400ml (37 Light Green / Clear Gloss)',
      slug: 'jm-lacquer-spray-series',
      description: 'Fast drying aerosol spray paint for metal, wood & plastic touchups.',
      categoryId: catLacquer.id,
      basePrice: 220,
      stock: 70,
      sku: 'JM-LSP-SERIES',
      unit: 'Volume / Ounce (oz)',
      images: JSON.stringify(['/products/2414.jpg']),
      variants: {
        create: [
          { name: '400ml Spray Can (Light Green 37)', price: 220, stock: 40, sku: 'JM-LSP-37LGRN' },
          { name: '400ml Spray Can (Clear Gloss)', price: 220, stock: 30, sku: 'JM-LSP-CLEAR' },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      title: 'Fevicol 1K PUR Polyurethane Wood Adhesive & Super Glue',
      slug: 'fevicol-1k-pur-adhesive-series',
      description: 'Waterproof D4 grade polyurethane wood adhesive & instant bond super glue.',
      categoryId: catAdhesives.id,
      basePrice: 100,
      stock: 75,
      sku: 'FEV-1KPUR-SERIES',
      unit: 'Weight (gm / kg)',
      images: JSON.stringify(['/products/2413.jpg']),
      variants: {
        create: [
          { name: '500g Bottle', price: 340, stock: 25, sku: 'FEV-1KPUR-500G' },
          { name: 'Super Glue 3g Tube (Pack of 5)', price: 100, stock: 50, sku: 'FEV-SGLUE-5PK' },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      title: 'Wooden Handle Paint Brush (Size 125 / 4 Inch) & Wire Brushes',
      slug: 'paint-brush-wire-brush-series',
      description: 'Natural bristle wooden handle paint brushes & steel wire scraping brushes.',
      categoryId: catBrushes.id,
      basePrice: 85,
      stock: 110,
      sku: 'PBR-SERIES',
      unit: 'Size (Inch / mm)',
      images: JSON.stringify(['/products/2417.jpg']),
      variants: {
        create: [
          { name: '4 Inch / Size 125 Brush', price: 95, stock: 50, sku: 'PBR-IND-4IN' },
          { name: '4-Row Steel Wire Scraping Brush', price: 85, stock: 60, sku: 'WBR-STEEL-4R' },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      title: 'HMBR Stainless Steel Heavy Duty Top Security Padlock',
      slug: 'hmbr-security-padlock-series',
      description: 'Hardened anti-cut steel shackle top security padlock with 4 brass keys.',
      categoryId: catLocks.id,
      basePrice: 220,
      stock: 40,
      sku: 'HMBR-PL-SERIES',
      unit: 'Dimension (mm)',
      images: JSON.stringify(['/products/2415.jpg']),
      variants: {
        create: [
          { name: '50mm Stainless Lock', price: 220, stock: 25, sku: 'HMBR-PL-50MM' },
          { name: '60mm Heavy Duty Lock', price: 320, stock: 15, sku: 'HMBR-PL-60MM' },
        ],
      },
    },
  });

  // 6. Power & Scale Tools
  await prisma.product.create({
    data: {
      title: 'Omega Digital Price Computing Scale (Type ACS 30kg) & Glue Guns',
      slug: 'omega-scale-glue-gun-series',
      description: 'Capacity: 30kg • Dual LED Display • AC/Battery power & 100W hot melt glue guns.',
      categoryId: catPowerScale.id,
      basePrice: 650,
      stock: 30,
      sku: 'PWR-SCALE-SERIES',
      unit: 'Quantity (Piece / Pack)',
      images: JSON.stringify(['/products/2425.jpg']),
      variants: {
        create: [
          { name: 'Omega 30kg Scale (Type ACS)', price: 2950, stock: 10, sku: 'OMG-SCL-30KG' },
          { name: 'XParT 100W Electric Glue Gun Kit', price: 650, stock: 20, sku: 'XPT-GLU-100W' },
        ],
      },
    },
  });

  // 7. Hammers & Striking Tools
  await prisma.product.create({
    data: {
      title: 'Heavy Duty Claw Hammer 500g & Sledgehammer 2kg (Rubber Grip)',
      slug: 'hammer-striking-tools-series',
      description: 'Drop forged carbon steel anti-vibration shock absorbent claw & sledgehammers.',
      categoryId: catHammers.id,
      basePrice: 280,
      stock: 32,
      sku: 'HMR-SERIES',
      unit: 'Weight (gm / kg)',
      images: JSON.stringify(['/products/2426.jpg']),
      variants: {
        create: [
          { name: '500g Claw Hammer', price: 280, stock: 20, sku: 'HMR-CLW-500G' },
          { name: '2kg Heavy Sledgehammer', price: 580, stock: 12, sku: 'HMR-SLD-2KG' },
        ],
      },
    },
  });

  // 8. Cutting Blades & Discs
  await prisma.product.create({
    data: {
      title: '4 Inch Diamond Tile & Marble Cutting Disc / Iron Grinding Disc',
      slug: 'cutting-blades-discs-series',
      description: 'High speed 15,300 RPM diamond tile cutting blades & iron metal discs.',
      categoryId: catCutting.id,
      basePrice: 160,
      stock: 70,
      sku: 'CUT-DISC-SERIES',
      unit: 'Size (Inch / mm)',
      images: JSON.stringify(['/products/2427.jpg']),
      variants: {
        create: [
          { name: '4" Diamond Tile Cutting Disc', price: 160, stock: 40, sku: 'CUT-TL-4IN' },
          { name: '4" Iron Metal Cutting Disc (Pack of 5)', price: 180, stock: 30, sku: 'CUT-MTL-4IN-5PK' },
        ],
      },
    },
  });

  // 9. Marine Coatings
  await prisma.product.create({
    data: {
      title: 'Polac / Rainbow Marine Anti-Corrosive Red Oxide Paint',
      slug: 'marine-red-oxide-paint-series',
      description: 'Marine duty heavy anti-rust protection paint for steel, boats & metal structures.',
      categoryId: catMarine.id,
      basePrice: 420,
      stock: 37,
      sku: 'MAR-REDOX-SERIES',
      unit: 'Volume (Litre)',
      images: JSON.stringify(['/products/2418.jpg']),
      variants: {
        create: [
          { name: '0.91 Litre Tin', price: 420, stock: 25, sku: 'MAR-REDOX-091L' },
          { name: '3.64 Litre Gallon Tin', price: 1580, stock: 12, sku: 'MAR-REDOX-364L' },
        ],
      },
    },
  });

  console.log('✓ M/S Rong Bahar catalog seed updated with verified shop inventory!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
