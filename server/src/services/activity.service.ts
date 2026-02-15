import { prisma } from '../config/prisma';
import { AppError } from '../utils/errors';

export async function createActivity(organizationId: string, data: {
  title: string;
  description: string;
  type: any;
  area: any;
  address: string;
  minVolunteers: number;
  maxVolunteers: number;
  commitmentType: any;
  timeSlots: { date: string; startTime: string; endTime: string }[];
}) {
  const { timeSlots, ...activityData } = data;

  return prisma.activity.create({
    data: {
      ...activityData,
      organizationId,
      timeSlots: {
        create: timeSlots.map(slot => ({
          date: new Date(slot.date),
          startTime: slot.startTime,
          endTime: slot.endTime,
        })),
      },
    },
    include: { timeSlots: true },
  });
}

export async function getActivities(filters: {
  type?: string;
  area?: string;
  fromDate?: string;
  toDate?: string;
  hasCapacity?: boolean;
  page?: number;
  limit?: number;
}) {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where: any = { isActive: true };

  if (filters.type) where.type = filters.type;
  if (filters.area) where.area = filters.area;
  if (filters.fromDate || filters.toDate) {
    where.timeSlots = {
      some: {
        date: {
          ...(filters.fromDate && { gte: new Date(filters.fromDate) }),
          ...(filters.toDate && { lte: new Date(filters.toDate) }),
        },
      },
    };
  }

  const [activities, total] = await Promise.all([
    prisma.activity.findMany({
      where,
      include: {
        organization: { select: { name: true, id: true } },
        timeSlots: {
          include: {
            _count: { select: { registrations: { where: { status: 'CONFIRMED' } } } },
          },
          orderBy: { date: 'asc' },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.activity.count({ where }),
  ]);

  return {
    data: activities,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getActivityById(id: string) {
  const activity = await prisma.activity.findUnique({
    where: { id },
    include: {
      organization: { select: { name: true, id: true, ownerId: true } },
      timeSlots: {
        include: {
          _count: { select: { registrations: { where: { status: 'CONFIRMED' } } } },
        },
        orderBy: { date: 'asc' },
      },
    },
  });
  if (!activity) throw new AppError('פעילות לא נמצאה', 404);
  return activity;
}

export async function updateActivity(id: string, organizationId: string, data: any) {
  const activity = await prisma.activity.findUnique({ where: { id } });
  if (!activity) throw new AppError('פעילות לא נמצאה', 404);
  if (activity.organizationId !== organizationId) throw new AppError('אין הרשאה לעדכן פעילות זו', 403);

  const { timeSlots, ...activityData } = data;

  if (timeSlots) {
    await prisma.timeSlot.deleteMany({ where: { activityId: id, registrations: { none: {} } } });
    await Promise.all(
      timeSlots.map((slot: any) =>
        prisma.timeSlot.create({
          data: {
            activityId: id,
            date: new Date(slot.date),
            startTime: slot.startTime,
            endTime: slot.endTime,
          },
        })
      )
    );
  }

  return prisma.activity.update({
    where: { id },
    data: activityData,
    include: { timeSlots: true },
  });
}

export async function deactivateActivity(id: string, organizationId: string) {
  const activity = await prisma.activity.findUnique({ where: { id } });
  if (!activity) throw new AppError('פעילות לא נמצאה', 404);
  if (activity.organizationId !== organizationId) throw new AppError('אין הרשאה למחוק פעילות זו', 403);

  return prisma.activity.update({
    where: { id },
    data: { isActive: false },
  });
}

export async function getActivityRegistrants(activityId: string, organizationId: string) {
  const activity = await prisma.activity.findUnique({ where: { id: activityId } });
  if (!activity) throw new AppError('פעילות לא נמצאה', 404);
  if (activity.organizationId !== organizationId) throw new AppError('אין הרשאה לצפות ברשומים', 403);

  return prisma.timeSlot.findMany({
    where: { activityId },
    include: {
      registrations: {
        where: { status: 'CONFIRMED' },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        },
      },
    },
    orderBy: { date: 'asc' },
  });
}

export async function getCalendarData(userId: string, year: number, month: number) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const timeSlots = await prisma.timeSlot.findMany({
    where: {
      date: { gte: startDate, lte: endDate },
      activity: { isActive: true },
    },
    include: {
      activity: {
        include: {
          organization: { select: { name: true } },
        },
      },
      _count: {
        select: { registrations: { where: { status: 'CONFIRMED' } } },
      },
      registrations: {
        where: { userId, status: 'CONFIRMED' },
        select: { id: true },
      },
    },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  });

  const calendarDays = new Map<string, any>();

  for (const slot of timeSlots) {
    const dateKey = slot.date.toISOString().split('T')[0];
    if (!calendarDays.has(dateKey)) {
      calendarDays.set(dateKey, { date: dateKey, events: [] });
    }

    const confirmedCount = slot._count.registrations;
    const { maxVolunteers, minVolunteers } = slot.activity;

    let capacityStatus: 'full' | 'low' | 'available';
    if (confirmedCount >= maxVolunteers) {
      capacityStatus = 'full';
    } else if (confirmedCount < minVolunteers) {
      capacityStatus = 'low';
    } else {
      capacityStatus = 'available';
    }

    calendarDays.get(dateKey)!.events.push({
      timeSlotId: slot.id,
      activityId: slot.activity.id,
      activityTitle: slot.activity.title,
      activityType: slot.activity.type,
      organizationName: slot.activity.organization.name,
      startTime: slot.startTime,
      endTime: slot.endTime,
      area: slot.activity.area,
      confirmedCount,
      maxVolunteers,
      minVolunteers,
      capacityStatus,
      isUserRegistered: slot.registrations.length > 0,
    });
  }

  return Array.from(calendarDays.values());
}
