import axiosInstance from './axiosInstance';
import { User } from '../types/User';

interface UserFilters {
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  [key: string]: unknown;
}

interface UsersResponse {
  results: User[];
  count: number;
}

// Интерфейсы для профиля пользователя и данных авторизации
export interface UserProfile {
  role: string;
  permissions: string[];
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface RefreshTokenData {
  refresh: string;
}

// Функция для получения списка пользователей
export const fetchUsers = async (
  filters: UserFilters
): Promise<UsersResponse> => {
  const response = await axiosInstance.get('/users/', { params: filters });
  return response.data;
};

// Функция для создания пользователя
export const createUser = async (userData: User): Promise<User> => {
  const response = await axiosInstance.post('/users/', userData);
  return response.data;
};

// Функция для обновления данных пользователя
export const updateUser = async (
  userId: number,
  userData: User
): Promise<User> => {
  const response = await axiosInstance.put(`/users/${userId}/`, userData);
  return response.data;
};

// Дополнительные функции для удаления и массового обновления пользователей
export const deleteUser = async (userId: number): Promise<void> => {
  await axiosInstance.delete(`/users/${userId}/`);
};

// Функции для авторизации и работы с профилем пользователя
export const loginUser = async (
  data: LoginData
): Promise<{ access: string; refresh: string }> => {
  const response = await axiosInstance.post('/api/auth/login/', data);
  console.log('Ответ сервера при авторизации:', response.data);
  return response.data;
};

export const registerUser = async (
  data: RegisterData
): Promise<{ access: string; refresh: string }> => {
  const response = await axiosInstance.post('/api/auth/register/', data);
  return response.data;
};

export const refreshToken = async (
  data: RefreshTokenData
): Promise<{ access: string }> => {
  const response = await axiosInstance.post('/api/auth/refresh/', data);
  return response.data;
};

export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await axiosInstance.get<UserProfile>('/api/users/profile/');
  return response.data;
};

export const updateUserProfile = async (
  data: Partial<UserProfile>
): Promise<UserProfile> => {
  const response = await axiosInstance.put<UserProfile>(
    '/api/users/profile/',
    data
  );
  return response.data;
};

// Функция для массового обновления пользователей
export const bulkUpdateUsers = async (
  userIds: number[],
  data: Partial<UserProfile>
): Promise<void> => {
  await axiosInstance.put('/api/users/bulk_update/', {
    userIds,
    ...data,
  });
};
