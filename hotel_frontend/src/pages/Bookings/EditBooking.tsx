// src/pages/Bookings/EditBooking.tsx

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import BookingForm from './BookingForm';
import { toast } from 'react-toastify';

const EditBooking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const bookingId = id ? parseInt(id, 10) : 0;

  const handleClose = () => {
    navigate('/bookings');
  };

  const handleBookingUpdated = () => {
    toast.success('Бронирование обновлено успешно');
    queryClient.invalidateQueries({
      queryKey: ['bookings'],
      exact: true, // Если требуется
    });
  };

  return (
    <BookingForm
      bookingId={bookingId}
      onClose={handleClose}
      onBookingUpdated={handleBookingUpdated}
    />
  );
};

export default EditBooking;
