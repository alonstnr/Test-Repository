import { ActivityType } from '../constants/activityTypes';
import { IsraelArea } from '../constants/israelLocations';

export enum CommitmentType {
  ALL_SESSIONS = 'ALL_SESSIONS',
  PICK_SPECIFIC = 'PICK_SPECIFIC',
}

export enum RegistrationStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  area: IsraelArea;
  address?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  type: ActivityType;
  area: IsraelArea;
  address: string;
  minVolunteers: number;
  maxVolunteers: number;
  commitmentType: CommitmentType;
  isActive: boolean;
  organizationId: string;
  organization?: Organization;
  timeSlots?: TimeSlot[];
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  activityId: string;
  activity?: Activity;
  registrationCount?: number;
}

export interface Registration {
  id: string;
  status: RegistrationStatus;
  note?: string;
  userId: string;
  timeSlotId: string;
  timeSlot?: TimeSlot;
  createdAt: string;
  updatedAt: string;
}

export type CapacityStatus = 'full' | 'low' | 'available';

export interface CalendarEvent {
  timeSlotId: string;
  activityId: string;
  activityTitle: string;
  activityType: ActivityType;
  organizationName: string;
  startTime: string;
  endTime: string;
  area: IsraelArea;
  confirmedCount: number;
  maxVolunteers: number;
  minVolunteers: number;
  capacityStatus: CapacityStatus;
  isUserRegistered: boolean;
}

export interface CalendarDay {
  date: string;
  events: CalendarEvent[];
}
