from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth.signals import user_logged_in, user_logged_out
from .models import ActivityLog
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model

User = get_user_model()

@receiver(post_save, sender=User)
def log_user_save(sender, instance, created, **kwargs):
    action = 'create' if created else 'update'
    ActivityLog.objects.create(
        user=instance,
        action_type=action,
        description=f'Пользователь {instance.username} был {"создан" if created else "обновлен"}.'
    )

@receiver(post_delete, sender=User)
def log_user_delete(sender, instance, **kwargs):
    ActivityLog.objects.create(
        user=instance,
        action_type='delete',
        description=f'Пользователь {instance.username} был удален.'
    )

@receiver(user_logged_in)
def log_user_login(sender, user, request, **kwargs):
    ActivityLog.objects.create(
        user=user,
        action_type='login',
        description='Пользователь вошел в систему.',
        ip_address=get_client_ip(request),
        device_info=get_device_info(request),
    )

@receiver(user_logged_out)
def log_user_logout(sender, user, request, **kwargs):
    ActivityLog.objects.create(
        user=user,
        action_type='logout',
        description='Пользователь вышел из системы.',
        ip_address=get_client_ip(request),
        device_info=get_device_info(request),
    )

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def get_device_info(request):
    return request.META.get('HTTP_USER_AGENT', 'unknown')
