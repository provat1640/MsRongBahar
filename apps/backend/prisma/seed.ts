import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding M/S Rong Bahar PostgreSQL Database...');

  // Clean existing tables in reverse dependency order
  await prisma.review.deleteMany({});
  await prisma.inventoryReservation.deleteMany({});
  await prisma.productRequest.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.unit.deleteMany({});
  await prisma.user.deleteMany({});

  // Seed Users
  const adminPassword = await bcrypt.hash('Habib123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'M/S Rong Bahar Manager (Habib)',
      phone: '01722452836',
      email: 'habib@msrongbahar.com',
      password: adminPassword,
      role: 'ADMIN',
      address: 'Mothkhola Road, Pakundia Bazar',
      district: 'Kishoreganj',
      thana: 'Pakundia',
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Rahim Chowdhury',
      phone: '01812345678',
      email: 'rahim.customer@gmail.com',
      password: userPassword,
      role: 'USER',
      address: 'Hospital Road, Pakundia',
      district: 'Kishoreganj',
      thana: 'Pakundia',
    },
  });

  console.log(`👤 Created Users: Admin (${admin.phone}), Customer (${customer.phone})`);

  // Seed Measurement Units
  const units = await prisma.unit.createMany({
    data: [
      { name: 'Volume (Litre)', category: 'Volume' },
      { name: 'Weight (gm / kg)', category: 'Weight' },
      { name: 'Dimension (mm / Inch)', category: 'Dimension' },
      { name: 'Fluid Ounce (oz / ml)', category: 'Fluid Ounce' },
      { name: 'Quantity (Piece / Pack)', category: 'Quantity' },
    ],
  });
  console.log('📏 Seeded Measurement Units');

  // Seed Categories
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

  const catTools = await prisma.category.create({
    data: {
      name: 'Power & Scale Tools',
      slug: 'power-and-scale-tools',
      description: 'Omega digital price computing 30kg scales & XParT electric glue guns.',
      image: '/products/2425.jpg',
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

  const catInterior = await prisma.category.create({
    data: {
      name: 'Interior Paints',
      slug: 'interior-paints',
      description: 'Berger Easy Clean, Robbialac Silk, Aqua Muslin & Superstar luxury interior paints.',
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

  console.log('📂 Seeded 10 Core Store Categories');

  // Seed Products & Multi-unit Variants
  const p1 = await prisma.product.create({
    data: {
      title: 'Berger Robbialac Super Gloss Synthetic Enamel',
      slug: 'berger-robbialac-enamel-series',
      description: 'High gloss protective shield synthetic enamel paint for wood, metal, and architectural steel surfaces. Formulated with alkyd resin and UV-resistant pigments for a mirror-like finish that prevents rust and corrosion.',
      categoryId: catEnamel.id,
      basePrice: 240,
      stock: 95,
      sku: 'BER-ROB-SGE-SERIES',
      unit: 'Volume (Litre)',
      images: JSON.stringify(['/products/2412.jpg', '/products/2414.jpg']),
      variants: {
        create: [
          { name: '0.455 Litre Can', price: 240, stock: 40, sku: 'BER-ROB-SGE-045L' },
          { name: '0.91 Litre Tin', price: 450, stock: 35, sku: 'BER-ROB-SGE-091L' },
          { name: '3.64 Litre Gallon', price: 1700, stock: 20, sku: 'BER-ROB-SGE-364L' },
        ],
      },
    },
  });

  const p2 = await prisma.product.create({
    data: {
      title: 'Fevicol 1K PUR Polyurethane Adhesive',
      slug: 'fevicol-1k-pur-adhesive',
      description: 'Single component moisture curing polyurethane wood adhesive for high strength, waterproof D4 bond. Exceptional resistance to boiling water, moisture, and extreme temperature variations.',
      categoryId: catAdhesives.id,
      basePrice: 744,
      stock: 60,
      sku: 'FEV-1KPUR-SERIES',
      unit: 'Weight (gm / kg)',
      images: JSON.stringify(['/products/2413.jpg']),
      variants: {
        create: [
          { name: '500g Bottle', price: 744, stock: 45, sku: 'FEV-1KPUR-500G' },
          { name: '1kg Pro Pack', price: 1420, stock: 15, sku: 'FEV-1KPUR-1KG' },
        ],
      },
    },
  });

  const p3 = await prisma.product.create({
    data: {
      title: 'JM Acrylic Lacquer Aerosol Spray Paint',
      slug: 'jm-acrylic-lacquer-spray',
      description: 'Quick-drying 100% acrylic aerosol spray paint delivering a uniform high gloss film with superior adhesion on metal, plastic, wood, and automotive parts.',
      categoryId: catLacquer.id,
      basePrice: 240,
      stock: 120,
      sku: 'JM-LSP-SERIES',
      unit: 'Fluid Ounce (oz / ml)',
      images: JSON.stringify(['/products/2414.jpg']),
      variants: {
        create: [
          { name: '37 Light Green (400ml)', price: 240, stock: 50, sku: 'JM-LSP-37-LGRN' },
          { name: 'Clear Gloss Lacquer (400ml)', price: 240, stock: 40, sku: 'JM-LSP-CLEAR' },
          { name: 'Matte Black 40 (400ml)', price: 240, stock: 30, sku: 'JM-LSP-BLK-40' },
        ],
      },
    },
  });

  const p4 = await prisma.product.create({
    data: {
      title: 'HMBR Heavy Duty Stainless Steel Padlock',
      slug: 'hmbr-security-padlock',
      description: 'Hardened boron steel shackle with anti-drill cylinder and pick-resistant pin tumbler mechanism. Top tier security for shop shutters, gates, and warehouse doors.',
      categoryId: catLocks.id,
      basePrice: 490,
      stock: 55,
      sku: 'HMBR-PL-SERIES',
      unit: 'Dimension (mm / Inch)',
      images: JSON.stringify(['/products/2415.jpg']),
      variants: {
        create: [
          { name: '50mm Top Security Lock', price: 490, stock: 30, sku: 'HMBR-PL-50MM' },
          { name: '60mm Heavy Armour Lock', price: 650, stock: 15, sku: 'HMBR-PL-60MM' },
          { name: '70mm Master Shutter Lock', price: 820, stock: 10, sku: 'HMBR-PL-70MM' },
        ],
      },
    },
  });

  const p5 = await prisma.product.create({
    data: {
      title: 'Aqua Paints Rangila Synthetic Enamel',
      slug: 'aqua-rangila-enamel',
      description: 'Vibrant CNG Green and primary enamel paint for auto rickshaws, gates, grills, and commercial sheet metal. High hiding power and rapid touch-dry finish.',
      categoryId: catEnamel.id,
      basePrice: 200,
      stock: 80,
      sku: 'AQU-RNG-SERIES',
      unit: 'Volume (Litre)',
      images: JSON.stringify(['/products/2416.jpg']),
      variants: {
        create: [
          { name: '0.145 Litre Mini Can (CNG Green)', price: 200, stock: 50, sku: 'AQU-RNG-CNG-145' },
          { name: '0.91 Litre Can (CNG Green)', price: 390, stock: 30, sku: 'AQU-RNG-CNG-091' },
        ],
      },
    },
  });

  const p6 = await prisma.product.create({
    data: {
      title: 'Professional 125mm (5-Inch) Industrial Paint Brush',
      slug: 'industrial-paint-brush-125mm',
      description: 'High-density natural bristle with ergonomic hardwood handle and stainless steel ferrule for lint-free smooth application with enamel, distemper, and varnishes.',
      categoryId: catBrushes.id,
      basePrice: 180,
      stock: 120,
      sku: 'PBR-IND-125MM',
      unit: 'Dimension (mm / Inch)',
      images: JSON.stringify(['/products/2417.jpg']),
      variants: {
        create: [
          { name: '125mm (5 Inch) Wooden Handle', price: 180, stock: 70, sku: 'PBR-IND-125MM-V1' },
          { name: '100mm (4 Inch) Standard Handle', price: 140, stock: 50, sku: 'PBR-IND-100MM-V1' },
        ],
      },
    },
  });

  const p7 = await prisma.product.create({
    data: {
      title: 'Berger Easy Clean Fresh Interior Silk Emulsion',
      slug: 'berger-easy-clean-fresh',
      description: 'Stain resistant luxury silk washable interior wall coating with cross-linking polymers that resist household stains while emitting a pleasant refreshing fragrance.',
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

  const p8 = await prisma.product.create({
    data: {
      title: 'Berger WeatherCoat Supreme Plus Exterior',
      slug: 'berger-weathercoat-supreme-plus',
      description: '10-Year warranty exterior paint featuring Silicon-Enhanced Dirt Pickup Resistance and Anti-Algal Biocides to withstand Bangladesh monsoons and intense sun exposure.',
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

  const p9 = await prisma.product.create({
    data: {
      title: 'Berger DampShield Elasto Waterproof Coating',
      slug: 'berger-dampshield-elasto',
      description: 'Elastomeric waterproofing coating bridging micro-cracks up to 2mm with 7-bar hydrostatic positive water pressure resistance for roofs, parapets, and exterior walls.',
      categoryId: catWaterproofing.id,
      basePrice: 1450,
      stock: 30,
      sku: 'BER-DAMP-ELASTO',
      unit: 'Volume (Litre)',
      images: JSON.stringify(['/products/2412.jpg']),
      variants: {
        create: [
          { name: '1 Litre Can', price: 1450, stock: 18, sku: 'BER-DAMP-01L' },
          { name: '4 Litre Pack', price: 5400, stock: 12, sku: 'BER-DAMP-04L' },
        ],
      },
    },
  });

  const p10 = await prisma.product.create({
    data: {
      title: 'Omega 30kg Digital Price Computing Scale',
      slug: 'omega-digital-scale-30kg',
      description: 'High-precision dual-display digital weighing scale for shop counter trade with rechargeable battery backup, stainless steel tray, and auto-tare calculation.',
      categoryId: catTools.id,
      basePrice: 3200,
      stock: 14,
      sku: 'OMG-SCL-30KG',
      unit: 'Quantity (Piece / Pack)',
      images: JSON.stringify(['/products/2425.jpg']),
      variants: {
        create: [
          { name: '30kg Standard Model (Rechargeable)', price: 3200, stock: 14, sku: 'OMG-SCL-30KG-STD' },
        ],
      },
    },
  });

  console.log('🎨 Seeded 10 Rich Catalog Products with Full Multi-Unit Variants');

  // Seed Initial Reviews
  await prisma.review.createMany({
    data: [
      {
        productId: p1.id,
        customerName: 'Kabir Ahmed (Contractor)',
        rating: 5,
        comment: 'Authentic Berger paint! Delivered to Pakundia in under 2 hours. High gloss shine and perfect coverage on grill gates.',
      },
      {
        productId: p2.id,
        customerName: 'Master Carpenter Salam',
        rating: 5,
        comment: 'The Fevicol 1K PUR is 100% genuine waterproof adhesive. Extremely strong bond on hardwood doors.',
      },
      {
        productId: p4.id,
        customerName: 'Mahmudul Hasan',
        rating: 5,
        comment: 'Heavy solid lock with solid brass keys. Very sturdy protection for my shop shutter.',
      },
    ],
  });

  // Seed Sample Order
  const sampleOrder = await prisma.order.create({
    data: {
      orderNumber: 'ORD-9821',
      userId: customer.id,
      customerName: 'Rahim Chowdhury',
      phone: '01812345678',
      deliveryAddress: 'Hospital Road, Pakundia Bazar',
      district: 'Kishoreganj',
      thana: 'Pakundia',
      totalAmount: 1850.0,
      deliveryFee: 60.0,
      paymentMethod: 'COD',
      paymentStatus: 'VERIFIED',
      orderStatus: 'CONFIRMED',
      items: {
        create: [
          {
            productId: p1.id,
            quantity: 2,
            unitPrice: 450.0,
          },
          {
            productId: p4.id,
            quantity: 1,
            unitPrice: 490.0,
          },
          {
            productId: p6.id,
            quantity: 2,
            unitPrice: 180.0,
          },
        ],
      },
    },
  });

  console.log(`📦 Seeded Sample Order: ${sampleOrder.orderNumber}`);
  console.log('✅ PostgreSQL Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
