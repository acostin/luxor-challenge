import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type BidStatus = 'pending' | 'accepted' | 'rejected';

async function main() {
  // 1. Create 10 users
  const users = await Promise.all(
    Array.from({ length: 10 }).map((_, i) =>
      prisma.user.create({
        data: {
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
        },
      })
    )
  );

  // 2. Create 100 collections, distributed among users
  const collections = await Promise.all(
    Array.from({ length: 100 }).map((_, i) => {
      const owner = users[i % users.length];
      return prisma.collection.create({
        data: {
          name: `Collection ${i + 1}`,
          description: `Description for collection ${i + 1}`,
          stocks: Math.floor(Math.random() * 100) + 1,
          price: parseFloat((Math.random() * 1000 + 10).toFixed(2)),
          ownerId: owner.id,
        },
      });
    })
  );

  // 3. For each collection, create 10 bids from random users (not the owner)
  for (const collection of collections) {
    const bidders = users.filter(u => u.id !== collection.ownerId);
    for (let j = 0; j < 10; j++) {
      const bidder = bidders[j % bidders.length];
      await prisma.bid.create({
        data: {
          collectionId: collection.id,
          price: parseFloat((collection.price * (0.8 + Math.random() * 0.4)).toFixed(2)),
          userId: bidder.id,
          status: 'pending', // Used string literal 'pending'
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        },
      });
    }
  }

  console.log('Database seeded!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 