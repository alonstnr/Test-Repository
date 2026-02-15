import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create organization user
  const orgPasswordHash = await bcrypt.hash('password123', 12);
  const orgUser = await prisma.user.upsert({
    where: { email: 'org@example.com' },
    update: {},
    create: {
      email: 'org@example.com',
      passwordHash: orgPasswordHash,
      firstName: 'דוד',
      lastName: 'כהן',
      role: 'ORGANIZATION',
      authProvider: 'LOCAL',
    },
  });

  // Create organization
  const org = await prisma.organization.upsert({
    where: { ownerId: orgUser.id },
    update: {},
    create: {
      name: 'עמותת יד ביד',
      description: 'עמותה לסיוע קהילתי ברחבי הארץ. אנו מארגנים פעילויות התנדבות מגוונות לטובת הקהילה.',
      contactEmail: 'org@example.com',
      contactPhone: '03-1234567',
      area: 'CENTER',
      address: 'רחוב הרצל 15, תל אביב',
      ownerId: orgUser.id,
    },
  });

  // Create volunteer user
  const volPasswordHash = await bcrypt.hash('password123', 12);
  const volUser = await prisma.user.upsert({
    where: { email: 'volunteer@example.com' },
    update: {},
    create: {
      email: 'volunteer@example.com',
      passwordHash: volPasswordHash,
      firstName: 'שרה',
      lastName: 'לוי',
      role: 'VOLUNTEER',
      authProvider: 'LOCAL',
    },
  });

  // Create volunteer profile
  await prisma.volunteerProfile.upsert({
    where: { userId: volUser.id },
    update: {},
    create: {
      userId: volUser.id,
      area: 'CENTER',
      radiusKm: 30,
      preferredTypes: ['RENOVATION', 'ELDERLY_HELP', 'FOOD_DISTRIBUTION'],
      availableDays: ['FRIDAY', 'SATURDAY'],
      availableStartHour: 8,
      availableEndHour: 16,
      bio: 'מתנדבת מנוסה, אוהבת לעזור לקהילה',
    },
  });

  // Create sample activities
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const twoWeeks = new Date(today);
  twoWeeks.setDate(today.getDate() + 14);

  const activity1 = await prisma.activity.create({
    data: {
      title: 'קטיף תפוזים בפרדס',
      description: 'התנדבות בקטיף תפוזים בפרדס בשרון. נדרשת הגעה עצמאית, מומלץ להביא כובע ומים.',
      type: 'HARVESTING',
      area: 'SHARON',
      address: 'פרדס חנה, רחוב הפרדסים 5',
      minVolunteers: 5,
      maxVolunteers: 20,
      commitmentType: 'PICK_SPECIFIC',
      organizationId: org.id,
      timeSlots: {
        create: [
          { date: nextWeek, startTime: '07:00', endTime: '12:00' },
          { date: twoWeeks, startTime: '07:00', endTime: '12:00' },
        ],
      },
    },
  });

  const activity2 = await prisma.activity.create({
    data: {
      title: 'שיפוץ דירת קשיש',
      description: 'סיוע בשיפוץ דירה של קשיש בודד במרכז תל אביב. כלי עבודה יסופקו במקום.',
      type: 'RENOVATION',
      area: 'TEL_AVIV',
      address: 'רחוב דיזנגוף 100, תל אביב',
      minVolunteers: 3,
      maxVolunteers: 8,
      commitmentType: 'ALL_SESSIONS',
      organizationId: org.id,
      timeSlots: {
        create: [
          { date: nextWeek, startTime: '09:00', endTime: '16:00' },
          { date: twoWeeks, startTime: '09:00', endTime: '16:00' },
        ],
      },
    },
  });

  const activity3 = await prisma.activity.create({
    data: {
      title: 'חלוקת מזון למשפחות נזקקות',
      description: 'חלוקת חבילות מזון למשפחות נזקקות באזור ירושלים.',
      type: 'FOOD_DISTRIBUTION',
      area: 'JERUSALEM',
      address: 'מחסן ראשי, ירושלים',
      minVolunteers: 10,
      maxVolunteers: 30,
      commitmentType: 'PICK_SPECIFIC',
      organizationId: org.id,
      timeSlots: {
        create: [
          { date: nextWeek, startTime: '14:00', endTime: '18:00' },
        ],
      },
    },
  });

  console.log('Seed completed successfully!');
  console.log('Organization user: org@example.com / password123');
  console.log('Volunteer user: volunteer@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
