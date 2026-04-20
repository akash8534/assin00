const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing old data...');
  await prisma.rSVP.deleteMany();
  await prisma.match.deleteMany();
  await prisma.post.deleteMany();
  await prisma.team.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creating users...');
  const captain = await prisma.user.create({ data: { id: 'u_cap', name: 'Arjun (Captain)', role: 'CAPTAIN' } });
  const player = await prisma.user.create({ data: { id: 'u_play', name: 'Rahul (Player)', role: 'PLAYER' } });
  const organiser = await prisma.user.create({ data: { id: 'u_org', name: 'Sunny (Organiser)', role: 'ORGANISER' } });
  const fan = await prisma.user.create({ data: { id: 'u_fan', name: 'Ishaan (Fan)', role: 'FAN' } });

  console.log('Creating team...');
  const team = await prisma.team.create({
    data: {
      id: 't_fb',
      name: 'Gully United',
      sport: 'FOOTBALL',
      captainId: captain.id,
      players: { connect: [{ id: player.id }, { id: captain.id }] }
    }
  });

  console.log('Creating matches...');
  await prisma.match.create({
    data: { teamId: team.id, opponent: 'City Strikers', date: new Date(Date.now() + 86400000 * 2), isTraining: false }
  });

  console.log('Creating social post...');
  // 🚨 THIS WAS THE MISSING PIECE!
  await prisma.post.create({
    data: {
      teamId: team.id,
      content: 'Ready for the weekend tournament! ⚽ #GullyStars',
      imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018',
      likes: 42
    }
  });
  
  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });