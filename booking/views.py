from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.core.mail import send_mail
from django.http import HttpResponse
from .models import BlacklistedGuest, Booking, Room
from .serializers import BookingSerializer, RoomSerializer, OccupancyDataSerializer
from user_management.models import UserActionLog
from rest_framework.views import APIView
from django.utils import timezone
from datetime import datetime, timedelta
import logging
import csv
from drf_spectacular.utils import extend_schema

logger = logging.getLogger(__name__)

class CalendarView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        description="Получить данные занятости комнат по заданным параметрам.",
        responses={200: OccupancyDataSerializer(many=True)}
    )
    def get(self, request):
        logger.info("Получение данных календаря занятости")
        try:
            # Получение параметров фильтра из запроса
            start_date = request.query_params.get('start_date')
            end_date = request.query_params.get('end_date')
            room_type = request.query_params.get('room_type')
            booking_status = request.query_params.get('status')

            # Установка значений по умолчанию для дат
            if not start_date:
                start_date = timezone.now().date()
            if not end_date:
                end_date = start_date + timedelta(days=30)

            # Преобразование дат
            start_date = datetime.strptime(str(start_date), '%Y-%m-%d').date()
            end_date = datetime.strptime(str(end_date), '%Y-%m-%d').date()

            # Применение фильтров
            filters = {}
            if room_type:
                filters['room_type'] = room_type
            if booking_status:
                filters['status'] = booking_status
            rooms = Room.objects.filter(**filters)

            # Формирование занятости комнат
            bookings = Booking.objects.filter(check_in__lte=end_date, check_out__gte=start_date).select_related('room')
            room_bookings_map = {}
            for booking in bookings:
                room_bookings_map.setdefault(booking.room_id, []).append(booking)

            occupancy_data = []
            for room in rooms:
                bookings_data = [
                    {
                        'id': booking.id,
                        'guest_name': f"{booking.guest.first_name} {booking.guest.last_name}",
                        'check_in': booking.check_in,
                        'check_out': booking.check_out,
                        'status': booking.status,
                        'is_blacklisted': BlacklistedGuest.objects.filter(passport_number=booking.guest.passport_number).exists(),
                    }
                    for booking in room_bookings_map.get(room.id, [])
                ]
                occupancy_data.append({
                    'room_number': room.number,
                    'room_type': room.room_type,
                    'status': room.status,
                    'bookings': bookings_data,
                })

            return Response({'occupancy': occupancy_data}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Ошибка при получении данных календаря: {e}")
            return Response({'error': 'Ошибка при получении данных календаря'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['status', 'room', 'check_in', 'check_out']
    ordering_fields = ['check_in', 'check_out', 'total_price', 'created_at']
    search_fields = ['room__number']

    def perform_create(self, serializer):
        booking = serializer.save(user=self.request.user)
        send_mail(
            'Новая бронь',
            f'Бронирование для номера {booking.room.number} подтверждено.',
            'from@example.com',
            [self.request.user.email],
            fail_silently=False,
        )
        self.log_user_action(self.request.user, 'Создание бронирования', metadata={'booking_id': booking.id})

    @staticmethod
    def log_user_action(user, action, metadata=None):
        UserActionLog.objects.create(user=user, action=action, metadata=metadata)

    @extend_schema(
        description="Экспорт бронирований в CSV файл.",
        responses={200: 'text/csv'}
    )
    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        logger.info(f"Экспорт бронирований в CSV. Пользователь: {request.user}")
        bookings = self.get_queryset()

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="bookings.csv"'

        writer = csv.writer(response)
        writer.writerow(['Room Number', 'Check-in', 'Check-out', 'Total Price', 'Status'])
        for booking in bookings:
            writer.writerow([booking.room.number, booking.check_in, booking.check_out, booking.total_price, booking.status])

        return response

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
