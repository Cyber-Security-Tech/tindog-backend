const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.dog.createMany({
        data: [
            { name: 'Bella', breed: 'Labrador', age: '2 years', about: 'Playful and loves walks.', image: 'https://placedog.net/500/400?id=1' },
            { name: 'Max', breed: 'Golden Retriever', age: '3 years', about: 'Gentle and friendly.', image: 'https://placedog.net/500/400?id=2' },
            { name: 'Luna', breed: 'German Shepherd', age: '1 year', about: 'Smart and energetic.', image: 'https://placedog.net/500/400?id=3' },
            { name: 'Charlie', breed: 'Poodle', age: '4 years', about: 'Loves cuddles.', image: 'https://placedog.net/500/400?id=4' },
            { name: 'Lucy', breed: 'Beagle', age: '5 years', about: 'Always curious.', image: 'https://placedog.net/500/400?id=5' }
        ],
    });
    console.log('Seed data inserted!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
