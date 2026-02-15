export enum UserRole {
  VOLUNTEER = 'VOLUNTEER',
  ORGANIZATION = 'ORGANIZATION',
}

export enum AuthProvider {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  authProvider: AuthProvider;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VolunteerProfile {
  id: string;
  area: IsraelArea;
  radiusKm: number;
  preferredTypes: ActivityType[];
  availableDays: DayOfWeek[];
  availableStartHour: number;
  availableEndHour: number;
  bio?: string;
  userId: string;
}

// Re-export used enums
import { IsraelArea } from '../constants/israelLocations';
import { ActivityType } from '../constants/activityTypes';
import { DayOfWeek } from '../constants/daysOfWeek';
