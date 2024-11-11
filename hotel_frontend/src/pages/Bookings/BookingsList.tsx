// src/pages/Bookings/BookingsList.tsx

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBookings,
  deleteBooking,
  Booking,
  GetBookingsResponse,
  FilterParams,
} from '../../api/bookingAPI';
import './BookingsList.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import BookingForm from './BookingForm'; // Убедитесь, что путь правильный

function BookingsList() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Состояние фильтров
  const [filters, setFilters] = useState<FilterParams>({
    date: '',
    status: '',
    roomNumber: undefined,
    search: '',
    page: 1,
    pageSize: 10,
  });

  // Состояние модального окна
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Запрос для получения списка бронирований с использованием фильтров
  const { data, isLoading, isError, error, refetch } = useQuery<
    GetBookingsResponse,
    Error
  >({
    queryKey: ['bookings', filters],
    queryFn: () => getBookings(filters).then((res) => res.data),
    staleTime: 5000, // Данные будут считаться свежими в течение 5 секунд
  });

  // Логируем ответ API для отладки
  console.log('API response:', data);

  // Извлечение данных на основе структуры ответа API
  let bookings: Booking[] = [];
  let totalItems = 0;

  if (data) {
    if (Array.isArray(data.results)) {
      // Если API возвращает объект с полем results
      bookings = data.results;
      totalItems = data.count;
    }
  }

  const totalPages = Math.ceil(totalItems / (filters.pageSize ?? 10));

  // Мутация для удаления бронирования
  const mutation = useMutation<void, Error, number>({
    mutationFn: (id: number) => deleteBooking(id),
    onSuccess: (_id) => {
      console.log(`Booking with ID ${_id} successfully deleted.`);
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Бронирование успешно удалено');
    },
    onError: (err: Error) => {
      console.error('Ошибка при удалении бронирования:', err);
      toast.error('Ошибка при удалении бронирования');
    },
  });

  // Обработчик удаления бронирования с подтверждением действия
  const handleDelete = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить это бронирование?')) {
      console.log(`Attempting to delete booking with ID: ${id}`);
      mutation.mutate(id);
    }
  };

  // Обработчик отправки фильтров
  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Устанавливаем первую страницу при изменении фильтров
    setFilters((prev) => ({ ...prev, page: 1 }));
    console.log('Filters submitted:', filters);
    refetch();
  };

  // Обработчик экспорта бронирований в CSV
  const handleExport = () => {
    console.log('Exporting bookings to CSV');
    window.location.href = '/api/bookings/bookings/export_csv/';
  };

  // Обработчик смены страницы
  const handlePageChange = (newPage: number) => {
    console.log(`Changing to page: ${newPage}`);
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  // Обработчик изменения значений фильтров
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log(`Filter input changed: ${name} = ${value}`);
    setFilters((prev) => ({
      ...prev,
      [name]:
        name === 'roomNumber'
          ? value
            ? parseInt(value, 10)
            : undefined
          : value,
    }));
  };

  // Обработчик открытия модального окна
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Обработчик закрытия модального окна
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Обработчик успешного создания бронирования
  const handleBookingCreated = () => {
    toast.success('Бронирование успешно создано');
    queryClient.invalidateQueries({ queryKey: ['bookings'], exact: true });
    closeModal();
  };

  return (
    <div className="bookings-list">
      <h1>Список бронирований</h1>

      {/* Кнопка для создания нового бронирования */}
      <button onClick={openModal} className="create-button">
        Создать бронирование
      </button>

      {/* Форма для фильтрации бронирований */}
      <form onSubmit={handleFilterSubmit} className="filters">
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleInputChange}
          placeholder="Дата"
        />
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleInputChange}
          placeholder="Поиск по гостю или номеру"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleInputChange}
        >
          <option value="">Все статусы</option>
          <option value="confirmed">Подтверждено</option>
          <option value="pending">В ожидании</option>
          <option value="cancelled">Отменено</option>
          {/* Добавьте другие статусы по необходимости */}
        </select>
        <input
          type="number"
          name="roomNumber"
          value={filters.roomNumber !== undefined ? filters.roomNumber : ''}
          onChange={handleInputChange}
          placeholder="Номер комнаты"
        />
        <button type="submit">Фильтровать</button>
      </form>

      {/* Кнопка для экспорта бронирований */}
      <button onClick={handleExport} className="export-button">
        Экспорт в CSV
      </button>

      {/* Состояние загрузки данных */}
      {isLoading ? (
        <p>Загрузка...</p>
      ) : isError ? (
        <p className="error">
          {error?.message || 'Ошибка при загрузке бронирований'}
        </p>
      ) : (
        <>
          {/* Таблица с бронированиями */}
          <table className="bookings-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Дата</th>
                <th>Гость</th>
                <th>Номер комнаты</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.id}</td>
                    <td>{booking.date}</td>
                    <td>{booking.guest}</td>
                    <td>{booking.roomNumber}</td>
                    <td>{booking.status}</td>
                    <td>
                      <button
                        onClick={() => navigate(`/bookings/${booking.id}/edit`)}
                      >
                        Редактировать
                      </button>
                      <button onClick={() => handleDelete(booking.id)}>
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>Нет бронирований</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Пагинация */}
          <div className="pagination">
            <button
              onClick={() =>
                handlePageChange(Math.max((filters.page ?? 1) - 1, 1))
              }
              disabled={filters.page === 1 || filters.page === undefined} // Проверяем на undefined
            >
              Назад
            </button>
            <span>
              Страница {filters.page} из {totalPages}
            </span>
            <button
              onClick={() =>
                handlePageChange(Math.min((filters.page ?? 1) + 1, totalPages))
              }
              disabled={
                filters.page === totalPages || filters.page === undefined
              } // Проверяем на undefined
            >
              Вперед
            </button>
          </div>
        </>
      )}

      {/* Модальное окно для создания бронирования */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Создать бронирование"
        className={{
          base: 'modal',
          afterOpen: 'modal--after-open',
          beforeClose: 'modal--before-close',
        }}
        overlayClassName={{
          base: 'overlay',
          afterOpen: 'overlay--after-open',
          beforeClose: 'overlay--before-close',
        }}
        closeTimeoutMS={200} // Длительность анимации
      >
        <BookingForm
          bookingId={0} // 0 для создания нового бронирования
          onClose={closeModal}
          onBookingUpdated={handleBookingCreated}
        />
      </Modal>
    </div>
  );
}

export default BookingsList;
