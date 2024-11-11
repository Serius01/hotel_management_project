// src/pages/Bookings/BookingForm.tsx

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

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
}

interface BookingFormProps {
  bookingId: number;
  onClose: () => void;
  onBookingUpdated: () => void;
}

const createBooking = async (
  newBooking: BookingCreate
): Promise<AxiosResponse<Booking>> => {
  return axios.post('/api/bookings', newBooking);
};

const updateBooking = async (
  updatedBooking: BookingUpdate
): Promise<AxiosResponse<Booking>> => {
  return axios.put(`/api/bookings/${updatedBooking.id}`, updatedBooking);
};

const BookingForm: React.FC<BookingFormProps> = ({
  bookingId,
  onClose,
  onBookingUpdated,
}) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<BookingCreate | BookingUpdate>({
    date: '',
    guest: '',
    roomNumber: 0,
    status: '',
  });
  // Мутация для создания бронирования
  const createMutation = useMutation<
    AxiosResponse<Booking>,
    Error,
    BookingCreate
  >({
    mutationFn: (newBooking: BookingCreate) => createBooking(newBooking),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      onBookingUpdated();
      onClose();
    },
    onError: (error: Error) => {
      console.error('Ошибка при создании бронирования:', error);
    },
  });

  // Мутация для обновления бронирования
  const updateMutation = useMutation<
    AxiosResponse<Booking>,
    Error,
    BookingUpdate
  >({
    mutationFn: (updatedBooking: BookingUpdate) =>
      updateBooking(updatedBooking),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      onBookingUpdated();
      onClose();
    },
    onError: (error: Error) => {
      console.error('Ошибка при обновлении бронирования:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingId === 0) {
      // Создаем новое бронирование
      createMutation.mutate(formData as BookingCreate);
    } else {
      // Обновляем существующее бронирование
      updateMutation.mutate({ ...formData, id: bookingId } as BookingUpdate);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'roomNumber' ? parseInt(value, 10) : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Имя гостя:
        <input
          type="text"
          name="guest"
          value={formData.guest || ''}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Дата:
        <input
          type="date"
          name="date"
          value={formData.date || ''}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Номер комнаты:
        <input
          type="number"
          name="roomNumber"
          value={formData.roomNumber || 0}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Статус:
        <select
          name="status"
          value={formData.status || ''}
          onChange={handleChange}
          required
        >
          <option value="">Выберите статус</option>
          <option value="confirmed">Подтверждено</option>
          <option value="pending">В ожидании</option>
          <option value="cancelled">Отменено</option>
        </select>
      </label>
      <button type="submit">
        {bookingId === 0 ? 'Создать бронирование' : 'Обновить бронирование'}
      </button>
      <button type="button" onClick={onClose}>
        Отмена
      </button>
    </form>
  );
};

export default BookingForm;
