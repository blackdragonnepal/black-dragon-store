import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();

  if (products.length === 0) {
    console.log('No products found in DB. Please run node prisma/seed.js first.');
    return;
  }

  const proj = products.find((p) => p.sku === 'HY350MAX-PROJ') || products[0];
  const consoleItem = products.find((p) => p.sku === 'R36S-CONSOLE') || products[1] || products[0];

  // Seed sample order 1
  await prisma.order.create({
    data: {
      customerName: 'Aarav Sharma',
      phone: '9841000000',
      address: 'New Road, Kathmandu',
      totalAmount: proj.price,
      status: 'PENDING',
      items: {
        create: [
          {
            productId: proj.id,
            quantity: 1,
            price: proj.price,
          },
        ],
      },
    },
  });

  // Seed sample order 2
  await prisma.order.create({
    data: {
      customerName: 'Sita Gurung',
      phone: '9812345678',
      address: 'Lakeside, Pokhara',
      totalAmount: consoleItem.price,
      status: 'DELIVERED',
      items: {
        create: [
          {
            productId: consoleItem.id,
            quantity: 1,
            price: consoleItem.price,
          },
        ],
      },
    },
  });

  console.log('Successfully seeded sample orders!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
