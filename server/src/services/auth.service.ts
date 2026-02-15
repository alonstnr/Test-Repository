import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/errors';

export async function registerUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'VOLUNTEER' | 'ORGANIZATION';
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new AppError('כתובת אימייל זו כבר רשומה במערכת', 409);
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: data.role,
      authProvider: 'LOCAL',
    },
  });

  const { passwordHash: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export function sanitizeUser(user: any) {
  const { passwordHash, ...safe } = user;
  return safe;
}
