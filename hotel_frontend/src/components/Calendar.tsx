// src/components/Calendar.tsx

import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import { EventInput, EventContentArg } from '@fullcalendar/core';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axiosInstance from '../api/axiosInstance';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookingForm from './BookingForm';

interface OccupancyData {
  room_number: string;
  room_type: string;
  status: string;
  bookings: BookingData[];
}

interface BookingData {
  id: number;
  guest_name: string;
  check_in: string;
  check_out: string;
  status: string;
  is_blacklisted: boolean;
}

interface EventExtendedProps {
  roomNumber: string;
  roomType: string;
  status: string;
  isBlacklisted: boolean;
  guestName: string;
}

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCalendarData();
    }
  }, [isAuthenticated]);

  const fetchCalendarData = async () => {
    try {
      const response = await axiosInstance.get('/api/bookings/calendar/');
      const occupancy: OccupancyData[] = response.data.occupancy;

      const eventsData: EventInput[] = [];

      occupancy.forEach((room) => {
        room.bookings.forEach((booking) => {
          eventsData.push({
            id: booking.id.toString(),
            title: `${room.room_number} - ${booking.guest_name}${booking.is_blacklisted ? ' ⚠️' : ''}`,
            start: booking.check_in,
            end: booking.check_out,
            color: booking.is_blacklisted
              ? 'red'
              : room.status === 'available'
                ? 'green'
                : 'yellow',
            extendedProps: {
              roomNumber: room.room_number,
              roomType: room.room_type,
              status: booking.status,
              isBlacklisted: booking.is_blacklisted,
              guestName: booking.guest_name,
            } as EventExtendedProps,
          });
        });
      });

      setEvents(eventsData);
    } catch (error: unknown) {
      console.error('Ошибка при получении данных календаря:', error);
      toast.error('Ошибка при получении данных календаря');
    }
  };

  const eventRender = (info: EventContentArg) => {
    const event = info.event;
    const isBlacklisted = event.extendedProps.isBlacklisted;

    const tooltipContent = (
      <div>
        <strong>Комната:</strong> {event.extendedProps.roomNumber}
        <br />
        <strong>Гость:</strong> {event.extendedProps.guestName}
        <br />
        <strong>Статус:</strong> {event.extendedProps.status}
        <br />
        {isBlacklisted && (
          <strong style={{ color: 'red' }}>Гость в черном списке!</strong>
        )}
      </div>
    );

    return (
      <Tippy content={tooltipContent} placement="top" animation="scale">
        <div>{event.title}</div>
      </Tippy>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEventClick = (info: any) => {
    const event = info.event;
    const bookingId = parseInt(event.id);
    setSelectedBookingId(bookingId);
    setIsModalOpen(true);
  };

  return (
    <div>
      {/* Форма фильтрации */}
      {/* ... ваш код формы фильтрации ... */}

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventContent={eventRender}
        eventClick={handleEventClick}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        locale="ru"
      />

      {isModalOpen && selectedBookingId && (
        <BookingForm
          bookingId={selectedBookingId}
          onClose={() => setIsModalOpen(false)}
          onBookingUpdated={fetchCalendarData}
        />
      )}
    </div>
  );
};

export default Calendar;
