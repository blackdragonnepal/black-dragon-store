const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      sku: 'HY350MAX-PROJ',
      name: 'HY350 MAX Ultra HD Smart Projector',
      description: 'Native 1080P resolution, Android 11, Auto Keystone Correction, Wi-Fi 6',
      price: 18500,
      stock: 15,
      category: 'PROJECTORS',
      imageUrl: '/images/hy350max.jpg'
    },
    {
      sku: 'R36S-CONSOLE',
      name: 'R36S Retro Handheld Gaming Console (64GB)',
      description: '3.5 inch IPS screen, Linux open source system, 15,000+ preloaded classic games',
      price: 4800,
      stock: 25,
      category: 'ELECTRONIC_TOYS',
      imageUrl: '/images/r36s.jpg'
    },
    {
      sku: 'PK400S-LIGHT',
      name: 'Plokama PK400S Studio Softbox Lighting Kit',
      description: 'Professional video photography lighting setup with adjustable height stand',
      price: 6500,
      stock: 10,
      category: 'MOBILE_ACCESSORIES',
      imageUrl: '/images/pk400s.jpg'
    },
    {
      sku: 'VGR-071-TRIM',
      name: 'VGR V-071 Professional Precision Trimmer',
      description: 'Rechargeable cordless hair clipper with stainless steel T-blade',
      price: 2200,
      stock: 30,
      category: 'GROOMING_TOOLS',
      imageUrl: '/images/vgr071.jpg'
    }
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: p,
      create: p,
    });
  }

  console.log('✅ Successfully seeded Black Dragon catalog items into dev.db!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });