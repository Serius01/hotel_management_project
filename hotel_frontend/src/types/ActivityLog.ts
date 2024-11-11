// src/types/ActivityLog.ts

export interface ActivityLog {
  id: number;
  user: string;
  actionType: string;
  date: string;
  description: string;
  ipAddress: string;
  deviceInfo: string;
}

export interface ActivityLogFilters {
  user?: string;
  actionType?: string;
  startDate?: string;
  endDate?: string;
}
