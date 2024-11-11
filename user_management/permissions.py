# user_management/permissions.py

from rest_framework.permissions import BasePermission

class HasPermission(BasePermission):
    """
    Проверка на наличие определенного разрешения у пользователя.
    """
    def has_permission(self, request, view):
        required_permission_codename = getattr(view, 'required_permission', None)
        if not request.user.is_authenticated or not required_permission_codename:
            return False

        # Проверка, есть ли у пользователя необходимое разрешение через роли
        return request.user.has_permission(required_permission_codename)

class RolePermission(BasePermission):
    """
    Базовый класс для разрешений на основе ролей.
    """
    role_name = None

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role is not None and
            request.user.role.name == self.role_name
        )

class IsAdmin(RolePermission):
    role_name = 'Администратор'

class IsFinanceManager(RolePermission):
    role_name = 'Финансовый менеджер'

class IsBookingManager(RolePermission):
    role_name = 'Менеджер по бронированию'

class IsHotelManager(RolePermission):
    role_name = 'Руководитель отеля'

class IsReceptionist(RolePermission):
    role_name = 'Сотрудник ресепшн'

class IsGuest(RolePermission):
    role_name = 'Гость'
