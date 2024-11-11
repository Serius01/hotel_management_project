# booking/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookingViewSet,  CalendarView, RoomViewSet

router = DefaultRouter()
router.register(r'bookings', BookingViewSet)  
router.register(r'rooms', RoomViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('calendar/', CalendarView.as_view(), name='calendar'),
    path('bookings/export_csv/', BookingViewSet.as_view({'get': 'export_csv'}), name='export-bookings'),

]