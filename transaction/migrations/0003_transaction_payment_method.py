# Generated by Django 5.1.2 on 2024-11-01 17:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("transaction", "0002_transaction_description"),
    ]

    operations = [
        migrations.AddField(
            model_name="transaction",
            name="payment_method",
            field=models.CharField(
                choices=[("cash", "Cash"), ("non_cash", "Non Cash")],
                default="cash",
                max_length=20,
                verbose_name="Метод оплаты",
            ),
        ),
    ]
