# Generated by Django 5.1.2 on 2024-10-26 18:48

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("booking", "0004_useractionlog_user"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Category",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "name",
                    models.CharField(
                        max_length=100, unique=True, verbose_name="Название категории"
                    ),
                ),
                (
                    "description",
                    models.TextField(blank=True, verbose_name="Описание категории"),
                ),
                (
                    "type",
                    models.CharField(
                        choices=[("income", "Доход"), ("expense", "Расход")],
                        max_length=10,
                        verbose_name="Тип категории",
                    ),
                ),
                (
                    "is_active",
                    models.BooleanField(default=True, verbose_name="Активна"),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Transaction",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "type",
                    models.CharField(
                        choices=[("income", "Доход"), ("expense", "Расход")],
                        max_length=10,
                        verbose_name="Тип транзакции",
                    ),
                ),
                (
                    "amount",
                    models.DecimalField(
                        decimal_places=2, max_digits=10, verbose_name="Сумма"
                    ),
                ),
                (
                    "date",
                    models.DateTimeField(
                        auto_now_add=True, verbose_name="Дата транзакции"
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("completed", "Завершена"),
                            ("pending", "В ожидании"),
                            ("cancelled", "Отменена"),
                        ],
                        default="pending",
                        max_length=20,
                        verbose_name="Статус транзакции",
                    ),
                ),
                (
                    "created_at",
                    models.DateTimeField(
                        auto_now_add=True, verbose_name="Дата создания"
                    ),
                ),
                (
                    "updated_at",
                    models.DateTimeField(
                        auto_now=True, verbose_name="Дата последнего обновления"
                    ),
                ),
                (
                    "booking",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="transactions",
                        to="booking.booking",
                        verbose_name="Бронирование",
                    ),
                ),
                (
                    "category",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="transactions",
                        to="transaction.category",
                        verbose_name="Категория",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="transactions",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="Пользователь",
                    ),
                ),
            ],
        ),
    ]
