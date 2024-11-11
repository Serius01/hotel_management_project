# booking/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Booking, BlacklistedGuest
from django.core.mail import send_mail
from django.conf import settings

@receiver(post_save, sender=Booking)
def check_blacklisted_guest(sender, instance, created, **kwargs):
    guest = instance.guest
    if BlacklistedGuest.objects.filter(passport_number=guest.passport_number).exists():
        # Отправка уведомления персоналу
        send_mail(
            'Гость из черного списка',
            f'Гость {guest.first_name} {guest.last_name} (паспорт {guest.passport_number}) находится в черном списке.',
            settings.DEFAULT_FROM_EMAIL,
            ['staff@example.com'],
            fail_silently=False,
        )
