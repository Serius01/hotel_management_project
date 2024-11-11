from django.contrib import admin
from .models import Role

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    filter_horizontal = ('permissions',)  # Удобный интерфейс для ManyToManyField

# Не регистрируем модель Permission повторно, оставляем стандартную админку Django
