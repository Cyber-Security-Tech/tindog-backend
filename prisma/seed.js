const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Optional: clear all dogs first
  await prisma.dog.deleteMany();

  const dogs = await prisma.dog.createMany({
    data: [
      {
        name: 'Bella',
        breed: 'Labrador',
        age: '2',
        about: 'Playful and loves walks.',
        image: 'https://placedog.net/500/400?id=1'
      },
      {
        name: 'Max',
        breed: 'Golden Retriever',
        age: '3',
        about: 'Gentle and friendly.',
        image: 'https://placedog.net/500/400?id=2'
      },
      {
        name: 'Luna',
        breed: 'German Shepherd',
        age: '1',
        about: 'Smart and energetic.',
        image: 'https://placedog.net/500/400?id=3'
      },
      {
        name: 'Charlie',
        breed: 'Poodle',
        age: '4',
        about: 'Loves cuddles.',
        image: 'https://placedog.net/500/400?id=4'
      },
      {
        name: 'Lucy',
        breed: 'Beagle',
        age: '5',
        about: 'Always curious.',
        image: 'https://placedog.net/500/400?id=5'
      }
    ]
  });

  console.log(`✅ Inserted ${dogs.count} dogs.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
