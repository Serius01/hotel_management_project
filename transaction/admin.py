from django.contrib import admin
from .models import Category, Transaction

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'is_active')
    list_filter = ('type', 'is_active')
    search_fields = ('name', 'description')
    ordering = ('name',)  # Упорядочивание по имени

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'type', 'category', 'amount', 'status', 'user', 'booking', 'date')
    list_filter = ('type', 'status', 'category')
    search_fields = ('user__username', 'booking__room__number', 'category__name')
    raw_id_fields = ('user', 'booking', 'category')
    date_hierarchy = 'date'  # Фильтрация по дате
    ordering = ('-date',)  # Упорядочивание по дате (от новых к старым)
