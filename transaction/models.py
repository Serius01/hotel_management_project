from django.db import models
from django.conf import settings
from booking.models import Booking

class Transaction(models.Model):
    """
    Финансовая транзакция (доход или расход)
    """
    TYPE_CHOICES = (
        ('income', 'Доход'),
        ('expense', 'Расход'),
    )
    STATUS_CHOICES = (
        ('completed', 'Завершена'),
        ('pending', 'В ожидании'),
        ('cancelled', 'Отменена'),
    )
    
    booking = models.ForeignKey(Booking, on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions', verbose_name="Бронирование")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='transactions', verbose_name="Пользователь")
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, verbose_name="Тип транзакции")
    category = models.ForeignKey(
        'Category',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='transactions',
        verbose_name="Категория",
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Сумма")
    description = models.TextField(blank=True, null=True, verbose_name="Описание")  # Добавлено поле
    date = models.DateTimeField(auto_now_add=True, verbose_name="Дата транзакции")
    payment_method = models.CharField(
    max_length=20,
    choices=[
        ('cash', 'Наличные'),
        ('non_cash', 'Безнал'),
        ('terminal', 'Терминал'),
        ('qr', 'QR-код'),
        ('bank_transfer', 'Банковский перевод'),  
        ('crypto', 'Криптовалюта')
    ],
    verbose_name="Метод оплаты"
)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="Статус транзакции")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата последнего обновления")

    def __str__(self):
        return f"{self.get_type_display()} - {self.amount} - {self.user.username}"
    
class Category(models.Model):
    """
    Категория транзакции (доход или расход)
    """
    TYPE_CHOICES = (
        ('income', 'Доход'),
        ('expense', 'Расход'),
    )
    
    name = models.CharField(max_length=100, unique=True, verbose_name="Название категории")
    description = models.TextField(blank=True, verbose_name="Описание категории")
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, verbose_name="Тип категории")
    is_active = models.BooleanField(default=True, verbose_name="Активна")

    def __str__(self):
        return f"{self.get_type_display()} - {self.name}"
