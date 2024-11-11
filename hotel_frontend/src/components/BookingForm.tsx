// src/components/BookingForm.tsx

import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios'; // Удалили AxiosError, так как он не используется
import { toast } from 'react-toastify';
import '../styles/BookingForm.css';

interface BookingFormProps {
  bookingId: number;
  onClose: () => void;
  onBookingUpdated: () => void;
}

interface BookingData {
  id: number;
  check_in: string;
  check_out: string;
  status: string;
  guest_name: string;
}

const BookingForm: React.FC<BookingFormProps> = ({
  bookingId,
  onClose,
  onBookingUpdated,
}) => {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Используем useCallback для мемоизации функции
  const fetchBookingData = useCallback(async () => {
    try {
      const response = await axiosInstance.get<BookingData>(
        `/api/bookings/bookings/${bookingId}/`
      );
      setBookingData(response.data);
      setLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Ошибка при получении данных бронирования:', error);
        toast.error('Ошибка при получении данных бронирования');
      } else {
        console.error('Неизвестная ошибка:', error);
      }
      setLoading(false);
    }
  }, [bookingId]);

  // Фетчим данные о бронировании при монтировании компонента или изменении bookingId
  useEffect(() => {
    fetchBookingData();
  }, [fetchBookingData]);

  // Обработка изменения значений полей формы
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (bookingData) {
      setBookingData({
        ...bookingData,
        [e.target.name]: e.target.value,
      });
    }
  };

  // Обработка отправки формы для обновления данных о бронировании
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingData) {
      try {
        await axiosInstance.put(
          `/api/bookings/bookings/${bookingId}/`,
          bookingData
        );
        toast.success('Бронирование успешно обновлено');
        onBookingUpdated();
        onClose();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Ошибка при обновлении бронирования:', error);
          toast.error('Ошибка при обновлении бронирования');
        } else {
          console.error('Неизвестная ошибка:', error);
        }
      }
    }
  };

  // Отображение состояния загрузки
  if (loading) {
    return <div>Загрузка...</div>;
  }

  // Основной контент формы
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Редактирование бронирования</h2>
        <form onSubmit={handleSubmit}>
          {/* Поля формы для редактирования бронирования */}
          <label>
            Дата заезда:
            <input
              type="datetime-local"
              name="check_in"
              value={bookingData?.check_in}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Дата выезда:
            <input
              type="datetime-local"
              name="check_out"
              value={bookingData?.check_out}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Статус:
            <select
              name="status"
              value={bookingData?.status}
              onChange={handleInputChange}
            >
              <option value="pending">В ожидании</option>
              <option value="confirmed">Подтверждено</option>
              <option value="cancelled">Отменено</option>
            </select>
          </label>
          {/* Добавьте другие поля по необходимости */}
          <div className="button-group">
            <button type="submit" className="save-button">
              Сохранить
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
