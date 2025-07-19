const { execSync } = require('child_process');

try {
  execSync('npx ts-node --compiler-options \'{"module":"CommonJS"}\' prisma/seed.ts', { 
    stdio: 'inherit' 
  });
  console.log('✅ Database seeded successfully!');
} catch (error) {
  console.error('❌ Error seeding database:', error.message);
  process.exit(1);
} 