import { prisma } from '../config/prisma';
import { AppError } from '../utils/errors';

export async function createOrganization(ownerId: string, data: {
  name: string;
  description: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  area: any;
  address?: string;
}) {
  const existing = await prisma.organization.findUnique({ where: { ownerId } });
  if (existing) {
    throw new AppError('כבר קיים ארגון עבור משתמש זה', 409);
  }

  return prisma.organization.create({
    data: { ownerId, ...data },
  });
}

export async function getOrganizationByOwner(ownerId: string) {
  return prisma.organization.findUnique({
    where: { ownerId },
    include: { activities: { where: { isActive: true } } },
  });
}

export async function getOrganizationById(id: string) {
  const org = await prisma.organization.findUnique({
    where: { id },
    include: {
      owner: { select: { firstName: true, lastName: true } },
    },
  });
  if (!org) throw new AppError('ארגון לא נמצא', 404);
  return org;
}

export async function updateOrganization(id: string, ownerId: string, data: {
  name?: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  area?: any;
  address?: string;
}) {
  const org = await prisma.organization.findUnique({ where: { id } });
  if (!org) throw new AppError('ארגון לא נמצא', 404);
  if (org.ownerId !== ownerId) throw new AppError('אין הרשאה לעדכן ארגון זה', 403);

  return prisma.organization.update({
    where: { id },
    data,
  });
}
