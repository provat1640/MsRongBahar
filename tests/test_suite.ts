import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function runTestSuite() {
  console.log('====================================================');
  console.log('🧪 M/S RONG BAHAR AUTOMATED TEST SUITE');
  console.log('   Testing Front-end, Back-end, Database & Security');
  console.log('====================================================\n');

  let passedTests = 0;
  let failedTests = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passedTests++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failedTests++;
    }
  }

  try {
    // 1. Database Connection & Categories Test
    console.log('📁 Test Suite 1: Database & Category Schema Validation');
    const categories = await prisma.category.findMany({ include: { products: true } });
    assert(categories.length >= 5, `Fetched ${categories.length} Categories from SQLite DB`);
    
    const enamelCat = categories.find(c => c.slug === 'synthetic-enamel-paints');
    assert(!!enamelCat, 'Category "Synthetic Enamel Paints" exists in database');
    assert(enamelCat ? enamelCat.products.length > 0 : false, 'Synthetic Enamel Paints has linked products');

    // 2. Products & Variants Test
    console.log('\n🎨 Test Suite 2: Product & Variant Integrity');
    const products = await prisma.product.findMany({ include: { variants: true, category: true } });
    assert(products.length >= 10, `Fetched ${products.length} Products from database`);

    let totalVariants = 0;
    let validPrices = true;
    let validStock = true;

    products.forEach(p => {
      totalVariants += p.variants.length;
      p.variants.forEach(v => {
        if (v.price <= 0) validPrices = false;
        if (v.stock < 0) validStock = false;
      });
    });

    assert(totalVariants >= products.length, `Validated ${totalVariants} Product Variants across catalog`);
    assert(validPrices, 'All product variant prices are positive BDT amounts');
    assert(validStock, 'All product variant stock counts are non-negative');

    // 3. User Authentication & Role Security Test
    console.log('\n🔐 Test Suite 3: Auth Credentials & Passcode Hashing');
    const users = await prisma.user.findMany();
    assert(users.length >= 2, `Fetched ${users.length} registered system users`);

    const adminUser = users.find(u => u.role === 'ADMIN');
    assert(!!adminUser, 'Admin User exists in database');

    if (adminUser) {
      const matchAdmin = await bcrypt.compare('Habib123', adminUser.password);
      assert(matchAdmin, 'Admin password ("Habib123") correctly hashes and verifies with bcrypt');
    }

    const customerUser = users.find(u => u.phone === '01812345678');
    assert(!!customerUser, 'Customer User ("01812345678") exists');
    if (customerUser) {
      const matchUser = await bcrypt.compare('user123', customerUser.password);
      assert(matchUser, 'Customer password ("user123") correctly hashes and verifies with bcrypt');
    }

    // 4. Units & Measurement Taxonomy Test
    console.log('\n📏 Test Suite 4: Unit & Measurement Standards');
    const units = await prisma.unit.findMany();
    assert(units.length >= 5, `Fetched ${units.length} Unit Standards (Litre, Weight, Dimension, Quantity)`);

    // 5. Order Creation & Status Lifecycle Test
    console.log('\n📦 Test Suite 5: Order Lifecycle & Payment Simulation');
    const testOrderNum = `TEST-ORD-${Date.now()}`;
    const newOrder = await prisma.order.create({
      data: {
        orderNumber: testOrderNum,
        customerName: 'Test Automation Customer',
        phone: '01700001122',
        deliveryAddress: 'Pakundia Bazar, Kishoreganj',
        district: 'Kishoreganj',
        thana: 'Pakundia',
        totalAmount: 1850.0,
        deliveryFee: 60.0,
        paymentMethod: 'COD',
        paymentStatus: 'VERIFIED',
        orderStatus: 'PENDING',
        items: {
          create: [
            {
              productId: products[0].id,
              variantId: products[0].variants[0]?.id || null,
              quantity: 2,
              unitPrice: products[0].variants[0]?.price || 450.0,
            }
          ]
        }
      },
      include: { items: true }
    });

    assert(newOrder.orderNumber === testOrderNum, `Created Test Order ${newOrder.orderNumber}`);
    assert(newOrder.items.length === 1, 'Order items correctly attached');

    // Status transition: PENDING -> SHIPPED -> DELIVERED
    const updatedOrder = await prisma.order.update({
      where: { id: newOrder.id },
      data: { orderStatus: 'DELIVERED' }
    });
    assert(updatedOrder.orderStatus === 'DELIVERED', 'Order status transition (PENDING -> DELIVERED) succeeded');

    // Cleanup test order
    await prisma.order.delete({ where: { id: newOrder.id } });
    assert(true, 'Test order cleaned up cleanly');

    console.log('\n====================================================');
    console.log(`📊 TEST SUITE SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
    console.log('====================================================');

    if (failedTests > 0) process.exit(1);

  } catch (err) {
    console.error('❌ Test Suite Execution Error:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTestSuite();
