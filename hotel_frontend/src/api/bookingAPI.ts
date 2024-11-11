// src/api/bookingAPI.ts

import axiosInstance from './axiosInstance';
import axios, { AxiosResponse } from 'axios';

export interface GetBookingsResponse {
  results: Booking[];
  count: number;
}

// Типы данных (определите их в соответствии с вашей моделью бронирования)
export interface Booking {
  id: number;
  date: string;
  guest: string;
  roomNumber: number;
  status: string;
  // Добавьте другие поля по необходимости
}

export interface BookingCreate {
  date: string;
  guest: string;
  roomNumber: number;
  status: string;
  // Добавьте другие поля по необходимости
}

export interface BookingUpdate {
  id: number; // Сделаем id обязательным, чтобы обновление работало корректно
  date?: string;
  guest?: string;
  roomNumber?: number;
  status?: string;
  // Добавьте другие поля по необходимости
}

export interface FilterParams {
  date?: string;
  status?: string;
  roomNumber?: number;
  search?: string;
  page?: number;
  pageSize?: number;
}

// Возвращаем полный ответ Axios для доступа к заголовкам
export const getBookings = (
  filters: FilterParams
): Promise<AxiosResponse<GetBookingsResponse>> => {
  console.log('Fetching bookings with filters:', filters); // Debug log
  return axiosInstance.get('/api/bookings/', { params: filters });
};

export const getBookingById = async (
  id: number
): Promise<AxiosResponse<Booking>> => {
  console.log('Fetching booking by ID:', id); // Debug log
  return axiosInstance.get(`/api/bookings/${id}/`);
};

export const createBooking = async (
  newBooking: BookingCreate
): Promise<AxiosResponse<Booking>> => {
  console.log('Creating new booking:', newBooking); // Debug log
  return axiosInstance.post('/api/bookings/', newBooking);
};

export const updateBooking = async (
  updatedBooking: BookingUpdate
): Promise<AxiosResponse<Booking>> => {
  console.log(
    'Updating booking with ID:',
    updatedBooking.id,
    'Data:',
    updatedBooking
  ); // Debug log
  return axiosInstance.put(
    `/api/bookings/${updatedBooking.id}/`,
    updatedBooking
  );
};

export const deleteBooking = async (id: number): Promise<void> => {
  console.log('Deleting booking by ID:', id); // Debug log
  await axiosInstance.delete(`/api/bookings/${id}/`);
};

export const partialUpdateBooking = (
  id: number,
  booking: Partial<BookingUpdate>
): Promise<AxiosResponse<Booking>> => {
  console.log('Partially updating booking with ID:', id, 'Data:', booking); // Debug log
  return axiosInstance.patch<Booking>(`/api/bookings/${id}/`, booking);
};

export const exportBookingsCSV = (): Promise<AxiosResponse<Blob>> => {
  console.log('Exporting bookings to CSV'); // Debug log
  return axiosInstance.get('/api/bookings/export_csv/', {
    responseType: 'blob',
  });
};

export const getCalendar = (): Promise<AxiosResponse<unknown>> => {
  console.log('Fetching booking calendar'); // Debug log
  return axiosInstance.get('/api/bookings/calendar/');
};
