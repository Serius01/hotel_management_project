from django.db import models
from django.contrib.auth.models import Permission

class Role(models.Model):
    """
    Модель роли, которая может иметь набор разрешений.
    """
    name = models.CharField(max_length=100, unique=True)  # Поле с названием роли
    permissions = models.ManyToManyField(
        Permission,
        related_name='roles_in_roles_app',  # Уникальное related_name
        blank=True
    )  # Поле для привязки разрешений к роли

    def __str__(self):
        return self.name  # Метод для отображения имени роли в виде строки
