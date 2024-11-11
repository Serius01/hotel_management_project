from django.contrib import admin
from .models import Booking
from django.contrib import admin
from .models import Booking, Room, Guest, BlacklistedGuest

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ['number', 'room_type', 'status']
    list_filter = ['status', 'room_type']
    search_fields = ['number', 'room_type']

@admin.register(Guest)
class GuestAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'passport_number', 'email', 'phone_number']
    search_fields = ['first_name', 'last_name', 'passport_number']

@admin.register(BlacklistedGuest)
class BlacklistedGuestAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'passport_number', 'added_at']
    search_fields = ['first_name', 'last_name', 'passport_number']
    list_filter = ['added_at']

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['room', 'check_in', 'check_out', 'status', 'user']
    search_fields = ('room', 'user__username')
