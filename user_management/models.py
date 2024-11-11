from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser
from roles.models import Role

class UserProfile(AbstractUser):
    """
    Кастомная модель пользователя, включающая одну роль и дополнительные поля.
    """
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True, related_name='user_profiles')
    email = models.EmailField(unique=True)  # Уникальный email для пользователя
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    
    REQUIRED_FIELDS = ['email']
    USERNAME_FIELD = 'username'

    def __str__(self):
        return f"{self.username} - {self.role.name if self.role else 'No role'}"

    def has_permission(self, permission_codename: str) -> bool:
        """
        Проверка, есть ли у пользователя указанное разрешение через его роль.
        """
        if not self.role:
            return False
        return self.role.permissions.filter(codename=permission_codename).exists()

    def get_all_permissions(self) -> set:
        """
        Получение всех разрешений пользователя через его роль.
        """
        if not self.role:
            return set()
        permissions = self.role.permissions.values_list('codename', flat=True)
        return set(permissions)

class UserActionLog(models.Model):
    """
    Лог действий пользователя для отслеживания активности.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='user_action_logs'
    )
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.action} at {self.timestamp}"
