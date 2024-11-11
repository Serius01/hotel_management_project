from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import UserProfile

@admin.register(UserProfile)
class UserProfileAdmin(UserAdmin):
    list_display = ('username', 'email', 'is_active', 'is_staff', 'get_role')
    list_filter = ('is_active', 'is_staff', 'role')  # Добавлены фильтры для удобства
    search_fields = ('username', 'email')  # Поиск по имени пользователя и email
    date_hierarchy = 'date_joined'  # Фильтрация по дате регистрации
    ordering = ('-date_joined',)  # Упорядочивание по дате регистрации (от новых к старым)
    
    # Добавляем 'role' и 'phone_number' в fieldsets
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role', 'phone_number')}),
    )
    
    def get_role(self, obj):
        return obj.role.name if obj.role else 'No role'
    get_role.short_description = 'Роль'
