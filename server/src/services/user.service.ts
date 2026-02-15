import { prisma } from '../config/prisma';
import { AppError } from '../utils/errors';

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      volunteerProfile: true,
      organization: true,
    },
  });
  if (!user) throw new AppError('משתמש לא נמצא', 404);
  const { passwordHash, ...safe } = user;
  return safe;
}

export async function updateUserProfile(userId: string, data: {
  firstName?: string;
  lastName?: string;
  phone?: string;
}) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });
  const { passwordHash, ...safe } = user;
  return safe;
}

export async function upsertVolunteerProfile(userId: string, data: {
  area: any;
  radiusKm: number;
  preferredTypes: any[];
  availableDays: any[];
  availableStartHour: number;
  availableEndHour: number;
  bio?: string;
}) {
  return prisma.volunteerProfile.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  });
}

export async function getVolunteerProfile(userId: string) {
  return prisma.volunteerProfile.findUnique({
    where: { userId },
  });
}
