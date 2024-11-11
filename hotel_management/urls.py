# hotel_management/urls.py

from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from django.views.generic import TemplateView
from django.http import JsonResponse
from django.urls import path

def trigger_error(request):
    division_by_zero = 1 / 0

urlpatterns = [
    path('sentry-debug/', trigger_error),
    # ...
]

urlpatterns = [
    path('admin/', admin.site.urls),

    # Подключение маршрутов аутентификации
    path('api/auth/', include('user_management.auth_urls')),

    # Подключение других приложений
    path('api/users/', include('user_management.urls')),
    path('api/bookings/', include('booking.urls')),
    path('api/transaction/', include('transaction.urls')),
    path('api/', include('roles.urls')),
    path('api/', include('activity_log.urls')),

    # Документация API
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

# Подключение debug_toolbar только в режиме отладки
if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [
        path('__debug__/', include(debug_toolbar.urls)),
    ]

# Пойманный маршрут для фронтенда (должен быть последним)
urlpatterns += [
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]

# Кастомный обработчик 404
def custom_404(request, exception):
    if request.path.startswith('/api/'):
        return JsonResponse({'error': 'Not found'}, status=404)
    else:
        return TemplateView.as_view(template_name='404.html')(request)

handler404 = 'hotel_management.urls.custom_404'
