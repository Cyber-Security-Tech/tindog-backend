const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data (order matters due to relations)
  await prisma.favorite.deleteMany();
  await prisma.dog.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  const user = await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'demo@tindog.com',
      password: 'securepassword' // Replace with hashed value if needed
    }
  });

  console.log(`✅ Created demo user: ${user.email}`);

  // Create demo dogs linked to that user
  const demoDogs = [
    {
      name: 'Bella',
      breed: 'Beagle',
      age: '3',
      about: 'Energetic and friendly.',
      image: 'https://placedog.net/400/300?id=1',
      userId: user.id
    },
    {
      name: 'Max',
      breed: 'Labrador',
      age: '5',
      about: 'Loyal and calm.',
      image: 'https://placedog.net/400/300?id=2',
      userId: user.id
    }
  ];

  for (const dog of demoDogs) {
    await prisma.dog.create({ data: dog });
  }

  console.log('✅ Seeded demo dogs.');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
