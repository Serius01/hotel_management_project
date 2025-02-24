# Generated by Django 5.1.2 on 2024-11-01 19:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("transaction", "0003_transaction_payment_method"),
    ]

    operations = [
        migrations.AlterField(
            model_name="transaction",
            name="payment_method",
            field=models.CharField(
                choices=[
                    ("cash", "Наличные"),
                    ("non_cash", "Безнал"),
                    ("terminal", "Терминал"),
                    ("qr", "QR-код"),
                    ("bank_transfer", "Банковский перевод"),
                    ("crypto", "Криптовалюта"),
                ],
                max_length=20,
                verbose_name="Метод оплаты",
            ),
        ),
    ]
