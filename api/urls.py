# api/urls.py
from django.urls import path, include
from .views import HealthCheckView
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet

router = DefaultRouter()
router.register(r'items', ItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

router = DefaultRouter()

# Подключение маршрутов других приложений
urlpatterns = [
    path('health/', HealthCheckView.as_view(), name='health_check'),
    path('booking/', include('booking.urls')),  # Маршруты для booking
    path('user_management/', include('user_management.urls')),  # Маршруты для управления пользователями
    # Подключите другие приложения здесь, например:
    # path('finance/', include('finance.urls')),
    # path('analytics/', include('analytics.urls')),
]

urlpatterns += router.urls
