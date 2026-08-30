import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Initializing Clean M/S Rong Bahar Root Database...');

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

  // Password hashes
  const adminPassword = await bcrypt.hash('Habib123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  // Admin User (Phone: 01722452836 or Habib01722452836)
  await prisma.user.create({
    data: {
      name: 'M/S Rong Bahar Manager (Habib)',
      phone: '01722452836',
      email: 'Habib01722452836',
      password: adminPassword,
      role: 'ADMIN',
      address: 'Mothkhola Road, Pakundia Bazar',
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

  // Seed Categories
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
        name: 'Hammers & Striking Tools',
        slug: 'hammers-and-striking-tools',
        description: '500g claw hammers & 2kg heavy sledgehammers with rubber grips.',
      },
      {
        name: 'Cutting Blades & Discs',
        slug: 'cutting-blades-and-discs',
        description: '4 inch diamond tile cutting blades & metal iron grinding discs.',
      },
      {
        name: 'Interior Paints',
        slug: 'interior-paints',
        description: 'Berger Easy Clean, Robbialac Silk, Aqua Muslin & Superstar interior top coats & primers.',
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
      {
        name: 'Wood Coating & Varnish',
        slug: 'wood-coating-and-varnish',
        description: 'Berger WoodKeeper PU Varnish, Innova & Aqua WoodShine clear wood lacquers.',
      },
      {
        name: 'Undercoats & Putty',
        slug: 'undercoats-and-putty',
        description: 'Berger Robbialac Undercoat White Sealer & Aqua Joy Wall Putty.',
      },
    ],
  });

  console.log('✓ Clean M/S Rong Bahar catalog ready: 0 products, ready for live camera & gallery uploads!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
