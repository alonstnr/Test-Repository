export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'VOLUNTEER' | 'ORGANIZATION';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateOrganizationRequest {
  name: string;
  description: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  area: string;
  address?: string;
}

export interface CreateActivityRequest {
  title: string;
  description: string;
  type: string;
  area: string;
  address: string;
  minVolunteers: number;
  maxVolunteers: number;
  commitmentType: 'ALL_SESSIONS' | 'PICK_SPECIFIC';
  timeSlots: {
    date: string;
    startTime: string;
    endTime: string;
  }[];
}

export interface CreateRegistrationRequest {
  activityId: string;
  timeSlotIds: string[];
}

export interface SendMessageRequest {
  receiverId: string;
  subject: string;
  body: string;
  threadId?: string;
}

export interface UpdateVolunteerProfileRequest {
  area: string;
  radiusKm: number;
  preferredTypes: string[];
  availableDays: string[];
  availableStartHour: number;
  availableEndHour: number;
  bio?: string;
}

export interface ActivityFilters {
  type?: string;
  area?: string;
  fromDate?: string;
  toDate?: string;
  hasCapacity?: boolean;
  page?: number;
  limit?: number;
}
