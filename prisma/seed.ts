import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding M/S Rong Bahar catalog with expanded categories (Plumbing, Electrical, Construction)...');

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
      { name: 'Power (Watt / Pcs)', category: 'Electrical' },
      { name: 'Diameter (Inch / mm)', category: 'Plumbing' },
      { name: 'Quantity (Piece / Pack)', category: 'Quantity' },
    ],
  });

  // Categories
  const catSecurity = await prisma.category.create({
    data: {
      name: 'Security Hardware & Padlocks',
      slug: 'security-hardware',
      description: 'Heavy duty stainless steel top security padlocks and burglar-resistant door locks (50mm, 60mm, 70mm).',
      image: '/products/2415.jpg',
    },
  });

  const catPaints = await prisma.category.create({
    data: {
      name: 'Architectural Paints & Surface Coatings',
      slug: 'architectural-paints-and-coatings',
      description: 'High durability interior, exterior, marine, spray, and anti-corrosive synthetic enamel paints (0.145L, 0.91L, 3.64L, 18L).',
      image: '/products/2412.jpg',
    },
  });

  const catAdhesives = await prisma.category.create({
    data: {
      name: 'Adhesives & Chemicals',
      slug: 'adhesives-and-chemicals',
      description: 'Industrial strength 1K PUR polyurethane wood glues and chemical bonding agents (125g, 250g, 500g, 1kg).',
      image: '/products/2413.jpg',
    },
  });

  const catSprays = await prisma.category.create({
    data: {
      name: 'Aerosol Spray Paints',
      slug: 'aerosol-spray-paints',
      description: '100% pure acrylic fast-drying aerosol paints in multiple can sizes (100ml, 400ml, 600ml / 12 oz).',
      image: '/products/2414.jpg',
    },
  });

  const catTools = await prisma.category.create({
    data: {
      name: 'Painting Tools & Accessories',
      slug: 'painting-tools-and-accessories',
      description: 'Professional industrial flat paint brushes, rollers, scrapers (2 Inch, 3 Inch, 4 Inch, 5 Inch / 125mm).',
      image: '/products/2417.jpg',
    },
  });

  const catPlumbing = await prisma.category.create({
    data: {
      name: 'Plumbing & Sanitary Supplies',
      slug: 'plumbing-and-sanitary',
      description: 'Heavy duty PVC pressure pipes, water taps, basin faucets, and leakproof sanitary fittings.',
      image: '/products/2422.jpg',
    },
  });

  const catElectrical = await prisma.category.create({
    data: {
      name: 'Electrical & Lighting Supplies',
      slug: 'electrical-and-lighting',
      description: 'High lumen LED bulbs, switches, cables, and energy-efficient electrical fixtures.',
      image: '/products/2425.jpg',
    },
  });

  const catConstruction = await prisma.category.create({
    data: {
      name: 'Construction & Building Materials',
      slug: 'construction-materials',
      description: 'Top grade OPC/PCC cement bags, steel reinforcement rods, and masonry supplies.',
      image: '/products/2428.jpg',
    },
  });

  // PRODUCTS & MULTI-UNIT SUB-PRODUCTS SEED

  // 1. HMBR Stainless Steel Top Security Padlock (Sub-units: 50mm, 60mm, 70mm)
  await prisma.product.create({
    data: {
      title: 'HMBR Stainless Steel Heavy-Duty Top Security Padlock',
      slug: 'hmbr-security-padlock-series',
      description: 'Protect your property with the unyielding strength of the HMBR Stainless Steel Top Security Padlock series. Built with a solid stainless steel casing and hardened anti-cut steel shackle. Select sub-units from 50mm, 60mm, to 70mm.',
      categoryId: catSecurity.id,
      basePrice: 220,
      stock: 45,
      sku: 'HMBR-PL-SERIES',
      unit: 'Dimension (mm)',
      images: JSON.stringify(['/products/2415.jpg', '/products/2426.jpg']),
      variants: {
        create: [
          { name: '50mm Lock', price: 220, stock: 25, sku: 'HMBR-PL-50MM' },
          { name: '60mm Lock', price: 320, stock: 12, sku: 'HMBR-PL-60MM' },
          { name: '70mm Lock', price: 400, stock: 8, sku: 'HMBR-PL-70MM' },
        ],
      },
    },
  });

  // 2. Berger Robbialac Super Gloss Synthetic Enamel – Blue (Sub-units: 0.91L, 3.64L, 18.2L Drum)
  await prisma.product.create({
    data: {
      title: 'Berger Robbialac Super Gloss Synthetic Enamel – Blue',
      slug: 'berger-robbialac-enamel-blue-series',
      description: 'Upgrade metal and wooden surfaces with the ultra-durable protection of Berger Robbialac Super Gloss Synthetic Enamel. Specially formulated with advanced alkyd resins and ESP fortification for high gloss retention.',
      categoryId: catPaints.id,
      basePrice: 540,
      stock: 55,
      sku: 'BER-ROB-SGE-SERIES',
      unit: 'Volume (Litre)',
      images: JSON.stringify(['/products/2412.jpg', '/products/2418.jpg']),
      variants: {
        create: [
          { name: '0.91 Litre Can', price: 540, stock: 35, sku: 'BER-ROB-SGE-091L' },
          { name: '3.64 Litre Can', price: 1980, stock: 15, sku: 'BER-ROB-SGE-364L' },
          { name: '18.2 Litre Commercial Drum', price: 7900, stock: 5, sku: 'BER-ROB-SGE-182L' },
        ],
      },
    },
  });

  // 3. Fevicol 1K PUR Moisture-Curing Adhesive (Sub-units: 125g, 250g, 500g, 1kg)
  await prisma.product.create({
    data: {
      title: 'Fevicol 1K PUR Moisture-Curing Polyurethane Adhesive',
      slug: 'fevicol-1k-pur-adhesive-series',
      description: 'Deliver unbreakable structural integrity to your woodworking projects with Fevicol 1K PUR Polyurethane Adhesive.',
      categoryId: catAdhesives.id,
      basePrice: 250,
      stock: 85,
      sku: 'FEV-1KPUR-SERIES',
      unit: 'Weight (gm / kg)',
      images: JSON.stringify(['/products/2413.jpg']),
      variants: {
        create: [
          { name: '125g Small Bottle', price: 250, stock: 30, sku: 'FEV-1KPUR-125G' },
          { name: '250g Medium Bottle', price: 450, stock: 25, sku: 'FEV-1KPUR-250G' },
          { name: '500g Large Bottle', price: 744, stock: 20, sku: 'FEV-1KPUR-500G' },
          { name: '1kg Heavy Pack', price: 1350, stock: 10, sku: 'FEV-1KPUR-1KG' },
        ],
      },
    },
  });

  // 4. Professional Industrial Flat Paint Brush (Sub-units: 2 Inch, 3 Inch, 4 Inch, 5 Inch / 125mm)
  await prisma.product.create({
    data: {
      title: 'Professional Industrial Flat Paint Brush Series',
      slug: 'industrial-paint-brush-series',
      description: 'Streamline painting jobs with Professional Industrial Flat Paint Brushes.',
      categoryId: catTools.id,
      basePrice: 60,
      stock: 150,
      sku: 'PBR-IND-SERIES',
      unit: 'Size (Inch / mm)',
      images: JSON.stringify(['/products/2417.jpg']),
      variants: {
        create: [
          { name: '2 Inch Brush', price: 60, stock: 50, sku: 'PBR-IND-2IN' },
          { name: '3 Inch Brush', price: 95, stock: 40, sku: 'PBR-IND-3IN' },
          { name: '4 Inch Brush', price: 130, stock: 35, sku: 'PBR-IND-4IN' },
          { name: '5 Inch (125mm)', price: 180, stock: 25, sku: 'PBR-IND-5IN' },
        ],
      },
    },
  });

  // 5. RFL PVC Water Pressure Pipe Series (Sub-units: 0.75", 1.0", 1.5", 2.0")
  await prisma.product.create({
    data: {
      title: 'RFL PVC Heavy-Duty Water Pressure Pipe',
      slug: 'rfl-pvc-water-pipe-series',
      description: 'Lead-free high pressure PVC water distribution pipe engineered for domestic and agricultural water supply in Kishoreganj.',
      categoryId: catPlumbing.id,
      basePrice: 150,
      stock: 100,
      sku: 'PLM-PVC-SERIES',
      unit: 'Diameter (Inch / mm)',
      images: JSON.stringify(['/products/2422.jpg']),
      variants: {
        create: [
          { name: '0.75 Inch (20mm)', price: 150, stock: 40, sku: 'PLM-PVC-075IN' },
          { name: '1.0 Inch (25mm)', price: 220, stock: 30, sku: 'PLM-PVC-100IN' },
          { name: '1.5 Inch (40mm)', price: 340, stock: 20, sku: 'PLM-PVC-150IN' },
          { name: '2.0 Inch (50mm)', price: 480, stock: 10, sku: 'PLM-PVC-200IN' },
        ],
      },
    },
  });

  // 6. Super Star High Lumen Energy LED Bulb Series (Sub-units: 5W, 9W, 12W, 18W)
  await prisma.product.create({
    data: {
      title: 'Super Star Energy Efficient High Lumen LED Bulb',
      slug: 'super-star-led-bulb-series',
      description: 'Long life 90% energy saving daylight white LED light bulb with surge protection.',
      categoryId: catElectrical.id,
      basePrice: 120,
      stock: 175,
      sku: 'ELE-LED-SERIES',
      unit: 'Power (Watt / Pcs)',
      images: JSON.stringify(['/products/2425.jpg']),
      variants: {
        create: [
          { name: '5 Watt LED Bulb', price: 120, stock: 50, sku: 'ELE-LED-05W' },
          { name: '9 Watt LED Bulb', price: 180, stock: 60, sku: 'ELE-LED-09W' },
          { name: '12 Watt LED Bulb', price: 240, stock: 40, sku: 'ELE-LED-12W' },
          { name: '18 Watt LED Panel', price: 380, stock: 25, sku: 'ELE-LED-18W' },
        ],
      },
    },
  });

  console.log('M/S Rong Bahar multi-category catalog seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
