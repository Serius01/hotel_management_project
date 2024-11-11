// src/api/activityLogAPI.ts

import axiosInstance from './axiosInstance';
import { ActivityLog, ActivityLogFilters } from '../types/ActivityLog';

export const fetchActivityLogs = async (
  filters: ActivityLogFilters
): Promise<ActivityLog[]> => {
  const response = await axiosInstance.get('/activity-logs/', {
    params: filters,
  });
  return response.data;
};
