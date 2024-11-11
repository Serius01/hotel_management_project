# booking/permissions.py
from rest_framework.permissions import BasePermission
from user_management.models import Role

from rest_framework.permissions import BasePermission
from user_management.models import Role

class IsBookingManager(BasePermission):
    """
    Разрешение для проверки, является ли пользователь менеджером по бронированию.
    """
    def has_permission(self, request, view):
        # Проверка, что пользователь аутентифицирован и имеет роль 'Менеджер по бронированию'
        if not request.user.is_authenticated:
            return False
        
        return request.user.roles.filter(name='Менеджер по бронированию').exists()


# Дополнительные классы разрешений можно создать аналогичным образом, например, для администратора.
class IsAdmin(BasePermission):
    """
    Разрешение для администратора.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.roles.filter(name='Администратор').exists()


class HasPermission(BasePermission):
    """
    Универсальное разрешение для проверки, имеет ли пользователь нужное разрешение.
    """
    def has_permission(self, request, view):
        required_permission = getattr(view, 'required_permission', None)
        if not required_permission:
            # Если в представлении не указано необходимое разрешение, доступ запрещен
            return False
        
        return request.user.is_authenticated and request.user.has_permission(required_permission)


class IsManagerOrReadOnly(BasePermission):
    """
    Позволяет доступ к чтению всем аутентифицированным пользователям.
    Запись доступна только менеджерам.
    """

    def has_permission(self, request, view):
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return request.user.is_authenticated
        return request.user.is_staff  # Или другая логика определения менеджера