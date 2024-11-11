import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { AxiosError } from 'axios';

interface Room {
  id: number;
  number: string;
}

const CreateBooking: React.FC = () => {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Получаем список комнат с бэкенда
    axiosInstance
      .get('/api/rooms/')
      .then((response) => setRooms(response.data))
      .catch((error) =>
        console.error('Ошибка при получении списка комнат:', error)
      );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Сбрасываем ошибку перед новым запросом

    if (!selectedRoomId) {
      setError('Пожалуйста, выберите комнату');
      return;
    }

    try {
      const response = await axiosInstance.post('/api/bookings/bookings/', {
        room: selectedRoomId,
        check_in: `${checkIn}T00:00:00Z`,
        check_out: `${checkOut}T00:00:00Z`,
        total_price: totalPrice,
      });

      console.log('Бронирование создано', response.data);
      navigate('/bookings');
    } catch (error: unknown) {
      console.log('Ошибка создания бронирования', error);

      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.data
      ) {
        setError('Ошибка: ' + JSON.stringify(error.response.data));
      } else {
        setError('Ошибка при создании бронирования');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>Комната</label>
        <select
          value={selectedRoomId || ''}
          onChange={(e) => setSelectedRoomId(Number(e.target.value))}
          required
        >
          <option value="" disabled>
            Выберите комнату
          </option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.number}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Дата заезда</label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Дата выезда</label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Цена</label>
        <input
          type="number"
          value={totalPrice}
          onChange={(e) => setTotalPrice(Number(e.target.value))}
          required
        />
      </div>
      <button type="submit">Создать бронирование</button>
    </form>
  );
};

export default CreateBooking;
