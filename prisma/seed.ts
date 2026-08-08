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

  // PRODUCTS & MULTI-UNIT SUB-PRODUCTS SEED

  // 1. Synthetic Enamel Paints
  await prisma.product.create({
    data: {
      title: 'Berger Robbialac Synthetic Gloss Enamel (Yellow / White)',
      slug: 'berger-robbialac-enamel-series',
      description: 'High gloss synthetic enamel paint for wood & metal protection.',
      categoryId: catEnamel.id,
      basePrice: 440,
      stock: 50,
      sku: 'BER-ROB-SGE-SERIES',
      unit: 'Volume (Litre)',
      images: JSON.stringify(['/products/2412.jpg']),
      variants: {
        create: [
          { name: '0.91 Litre Tin', price: 440, stock: 35, sku: 'BER-ROB-SGE-091L' },
          { name: '3.64 Litre Gallon Tin', price: 1650, stock: 15, sku: 'BER-ROB-SGE-364L' },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      title: 'Aqua Paints Rongila Synthetic Gloss Enamel (Brill White)',
      slug: 'aqua-paints-rongila-enamel',
      description: 'Shade: Brill White • High Gloss Finish • 0.91 Litre MRP Tk 430',
      categoryId: catEnamel.id,
      basePrice: 430,
      stock: 35,
      sku: 'AQU-RNG-WHITE-091L',
      unit: 'Volume (Litre)',
      images: JSON.stringify(['/products/2412.jpg']),
      variants: {
        create: [
          { name: '0.91 Litre Tin (Brill White)', price: 430, stock: 35, sku: 'AQU-RNG-091L' },
        ],
      },
    },
  });

  // 2. Acrylic Lacquer Sprays
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

  // 3. Adhesives & Glues
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

  // 4. Paint Brushes & Tools
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

  // 5. Padlocks & Security
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
