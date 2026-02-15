import { prisma } from '../config/prisma';
import { AppError } from '../utils/errors';
import { doTimeSlotsOverlap } from '../utils/overlapDetection';

export async function registerForTimeSlots(
  userId: string,
  activityId: string,
  timeSlotIds: string[]
) {
  return prisma.$transaction(async (tx) => {
    const activity = await tx.activity.findUnique({
      where: { id: activityId },
      include: { timeSlots: true },
    });

    if (!activity || !activity.isActive) {
      throw new AppError('פעילות לא נמצאה או אינה פעילה', 404);
    }

    // Validate time slot IDs belong to this activity
    const requestedSlots = activity.timeSlots.filter(ts => timeSlotIds.includes(ts.id));
    if (requestedSlots.length !== timeSlotIds.length) {
      throw new AppError('משבצות זמן לא תקינות', 400);
    }

    // If ALL_SESSIONS, verify all slots are included
    if (activity.commitmentType === 'ALL_SESSIONS') {
      if (requestedSlots.length !== activity.timeSlots.length) {
        throw new AppError('פעילות זו דורשת התחייבות לכל המשבצות', 400);
      }
    }

    // Check capacity for each requested slot
    for (const slot of requestedSlots) {
      const currentCount = await tx.registration.count({
        where: { timeSlotId: slot.id, status: 'CONFIRMED' },
      });
      if (currentCount >= activity.maxVolunteers) {
        throw new AppError(
          `המשבצת בתאריך ${slot.date.toLocaleDateString('he-IL')} מלאה`,
          409
        );
      }
    }

    // Check for already registered
    const existingForSlots = await tx.registration.findMany({
      where: {
        userId,
        timeSlotId: { in: timeSlotIds },
        status: 'CONFIRMED',
      },
    });
    if (existingForSlots.length > 0) {
      throw new AppError('כבר נרשמת לחלק מהמשבצות הללו', 409);
    }

    // Check for time overlaps with existing registrations
    const existingRegistrations = await tx.registration.findMany({
      where: { userId, status: 'CONFIRMED' },
      include: { timeSlot: true },
    });

    for (const requestedSlot of requestedSlots) {
      for (const existing of existingRegistrations) {
        if (doTimeSlotsOverlap(
          { date: requestedSlot.date, startTime: requestedSlot.startTime, endTime: requestedSlot.endTime },
          { date: existing.timeSlot.date, startTime: existing.timeSlot.startTime, endTime: existing.timeSlot.endTime }
        )) {
          throw new AppError(
            `חפיפה בזמנים: התנגשות עם התנדבות קיימת בתאריך ${existing.timeSlot.date.toLocaleDateString('he-IL')}`,
            409
          );
        }
      }
    }

    // Create all registrations
    const registrations = await Promise.all(
      requestedSlots.map(slot =>
        tx.registration.create({
          data: { userId, timeSlotId: slot.id, status: 'CONFIRMED' },
          include: { timeSlot: { include: { activity: true } } },
        })
      )
    );

    return registrations;
  });
}

export async function getUserRegistrations(userId: string) {
  return prisma.registration.findMany({
    where: { userId, status: 'CONFIRMED' },
    include: {
      timeSlot: {
        include: {
          activity: {
            include: {
              organization: { select: { name: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function cancelRegistration(id: string, userId: string) {
  const registration = await prisma.registration.findUnique({ where: { id } });
  if (!registration) throw new AppError('הרשמה לא נמצאה', 404);
  if (registration.userId !== userId) throw new AppError('אין הרשאה לבטל הרשמה זו', 403);

  return prisma.registration.update({
    where: { id },
    data: { status: 'CANCELLED' },
  });
}
