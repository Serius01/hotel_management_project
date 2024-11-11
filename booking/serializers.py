from rest_framework import serializers
from .models import Booking, Room, Guest, BlacklistedGuest
import logging

logger = logging.getLogger(__name__)

class GuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guest
        fields = ['id', 'first_name', 'last_name', 'passport_number', 'email', 'phone_number']

class BookingSerializer(serializers.ModelSerializer):
    guest = GuestSerializer()

    class Meta:
        model = Booking
        fields = ['id', 'room', 'guest', 'check_in', 'check_out', 'total_price', 'status', 'user']

    def create(self, validated_data):
        guest_data = validated_data.pop('guest')
        
        # Проверка черного списка
        if BlacklistedGuest.objects.filter(passport_number=guest_data['passport_number']).exists():
            logger.warning(f"Гость {guest_data['passport_number']} находится в черном списке")
            raise serializers.ValidationError("Этот гость находится в черном списке.")

        # Создание гостя
        guest, created = Guest.objects.get_or_create(passport_number=guest_data['passport_number'], defaults=guest_data)
        logger.info(f"Гость с номером паспорта {guest.passport_number} {'создан' if created else 'найден'}.")

        # Создание бронирования
        booking = Booking.objects.create(guest=guest, **validated_data)
        logger.info(f"Бронирование {booking.id} для гостя {guest.passport_number} успешно создано.")
        return booking

    def update(self, instance, validated_data):
        guest_data = validated_data.pop('guest', None)
        if guest_data:
            guest = instance.guest
            for attr, value in guest_data.items():
                setattr(guest, attr, value)
            guest.save()

            # Проверка черного списка при обновлении
            if BlacklistedGuest.objects.filter(passport_number=guest.passport_number).exists():
                raise serializers.ValidationError("Этот гость находится в черном списке.")

            logger.info(f"Информация о госте {guest.passport_number} была обновлена.")

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        logger.info(f"Бронирование {instance.id} было обновлено.")
        return instance

class BookingDataSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    guest_name = serializers.CharField()
    check_in = serializers.DateTimeField(format='%Y-%m-%dT%H:%M:%S')
    check_out = serializers.DateTimeField(format='%Y-%m-%dT%H:%M:%S')
    status = serializers.CharField()
    is_blacklisted = serializers.BooleanField()

class OccupancyDataSerializer(serializers.Serializer):
    room_number = serializers.CharField()
    room_type = serializers.CharField()
    status = serializers.CharField()
    bookings = BookingDataSerializer(many=True)

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'
