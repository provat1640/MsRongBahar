import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Initializing Clean M/S Rong Bahar PostgreSQL Database...');

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

  // Seed Admin & Manager User
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
  await prisma.unit.createMany({
    data: [
      { name: 'Volume (Litre)', category: 'Volume' },
      { name: 'Weight (gm / kg)', category: 'Weight' },
      { name: 'Dimension (mm / Inch)', category: 'Dimension' },
      { name: 'Fluid Ounce (oz / ml)', category: 'Fluid Ounce' },
      { name: 'Quantity (Piece / Pack)', category: 'Quantity' },
    ],
  });
  console.log('📏 Seeded Measurement Units');

  // Seed Categories (Core Store Taxonomy)
  await prisma.category.createMany({
    data: [
      {
        name: 'Synthetic Enamel Paints',
        slug: 'synthetic-enamel-paints',
        description: 'Berger Robbialac, Aqua Paints CNG Green & Polac high gloss synthetic enamel paints.',
      },
      {
        name: 'Acrylic Lacquer Sprays',
        slug: 'acrylic-lacquer-sprays',
        description: 'JM Acrylic Lacquer spray cans 400ml (Light Green 37, Clear Gloss).',
      },
      {
        name: 'Adhesives & Glues',
        slug: 'adhesives-and-glues',
        description: 'Fevicol 1K PUR Polyurethane waterproof wood adhesive & super glue.',
      },
      {
        name: 'Paint Brushes & Tools',
        slug: 'paint-brushes-and-tools',
        description: 'Wooden handle brushes (Size 125 / 4") and 4-row steel wire scraping brushes.',
      },
      {
        name: 'Padlocks & Security',
        slug: 'padlocks-and-security',
        description: 'HMBR stainless steel heavy duty top security padlocks (50mm, 60mm).',
      },
      {
        name: 'Power & Scale Tools',
        slug: 'power-and-scale-tools',
        description: 'Omega digital price computing 30kg scales & XParT electric glue guns.',
      },
      {
        name: 'Cutting Blades & Discs',
        slug: 'cutting-blades-and-discs',
        description: '4 inch diamond tile cutting blades & metal iron grinding discs.',
      },
      {
        name: 'Interior Paints',
        slug: 'interior-paints',
        description: 'Berger Easy Clean, Robbialac Silk, Aqua Muslin & Superstar luxury interior paints.',
      },
      {
        name: 'Exterior Paints',
        slug: 'exterior-paints',
        description: 'Berger WeatherCoat Supreme & LongLife, Aqua Platina weatherproof exterior paints.',
      },
      {
        name: 'Waterproofing Systems',
        slug: 'waterproofing-systems',
        description: 'Berger DampShield Elasto & Aqua DampStop hydrostatic dampness defense coatings.',
      },
    ],
  });

  console.log('📂 Seeded Core Store Categories');
  console.log('✨ Clean Database Ready: Product catalog is blank (0 products), ready for live camera & gallery uploads!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
