import { z } from 'zod';
import { ActivityType } from '../constants/activityTypes';
import { IsraelArea } from '../constants/israelLocations';
import { DayOfWeek } from '../constants/daysOfWeek';

export const registerSchema = z.object({
  email: z.string().email('כתובת אימייל לא תקינה'),
  password: z.string().min(6, 'סיסמה חייבת להכיל לפחות 6 תווים'),
  firstName: z.string().min(1, 'שם פרטי הוא שדה חובה'),
  lastName: z.string().min(1, 'שם משפחה הוא שדה חובה'),
  phone: z.string().optional(),
  role: z.enum(['VOLUNTEER', 'ORGANIZATION']),
});

export const loginSchema = z.object({
  email: z.string().email('כתובת אימייל לא תקינה'),
  password: z.string().min(1, 'סיסמה היא שדה חובה'),
});

export const organizationSchema = z.object({
  name: z.string().min(1, 'שם הארגון הוא שדה חובה'),
  description: z.string().min(10, 'תיאור חייב להכיל לפחות 10 תווים'),
  contactEmail: z.string().email('כתובת אימייל לא תקינה'),
  contactPhone: z.string().optional(),
  website: z.string().url('כתובת אתר לא תקינה').optional().or(z.literal('')),
  area: z.nativeEnum(IsraelArea, { errorMap: () => ({ message: 'יש לבחור אזור' }) }),
  address: z.string().optional(),
});

export const activitySchema = z.object({
  title: z.string().min(1, 'כותרת היא שדה חובה'),
  description: z.string().min(10, 'תיאור חייב להכיל לפחות 10 תווים'),
  type: z.nativeEnum(ActivityType, { errorMap: () => ({ message: 'יש לבחור סוג פעילות' }) }),
  area: z.nativeEnum(IsraelArea, { errorMap: () => ({ message: 'יש לבחור אזור' }) }),
  address: z.string().min(1, 'כתובת היא שדה חובה'),
  minVolunteers: z.number().int().min(1, 'מינימום מתנדב אחד'),
  maxVolunteers: z.number().int().min(1, 'מקסימום מתנדב אחד לפחות'),
  commitmentType: z.enum(['ALL_SESSIONS', 'PICK_SPECIFIC']),
  timeSlots: z.array(z.object({
    date: z.string().min(1, 'תאריך הוא שדה חובה'),
    startTime: z.string().min(1, 'שעת התחלה היא שדה חובה'),
    endTime: z.string().min(1, 'שעת סיום היא שדה חובה'),
  })).min(1, 'יש להוסיף לפחות משבצת זמן אחת'),
}).refine(data => data.maxVolunteers >= data.minVolunteers, {
  message: 'מספר מתנדבים מקסימלי חייב להיות גדול או שווה למינימלי',
  path: ['maxVolunteers'],
});

export const volunteerProfileSchema = z.object({
  area: z.nativeEnum(IsraelArea, { errorMap: () => ({ message: 'יש לבחור אזור' }) }),
  radiusKm: z.number().int().min(5).max(200),
  preferredTypes: z.array(z.nativeEnum(ActivityType)).min(1, 'יש לבחור לפחות סוג התנדבות אחד'),
  availableDays: z.array(z.nativeEnum(DayOfWeek)).min(1, 'יש לבחור לפחות יום אחד'),
  availableStartHour: z.number().int().min(0).max(23),
  availableEndHour: z.number().int().min(0).max(23),
  bio: z.string().optional(),
}).refine(data => data.availableEndHour > data.availableStartHour, {
  message: 'שעת הסיום חייבת להיות אחרי שעת ההתחלה',
  path: ['availableEndHour'],
});

export const registrationSchema = z.object({
  activityId: z.string().uuid(),
  timeSlotIds: z.array(z.string().uuid()).min(1, 'יש לבחור לפחות משבצת זמן אחת'),
});

export const messageSchema = z.object({
  receiverId: z.string().uuid(),
  subject: z.string().min(1, 'נושא הוא שדה חובה'),
  body: z.string().min(1, 'תוכן ההודעה הוא שדה חובה'),
  threadId: z.string().uuid().optional(),
});
