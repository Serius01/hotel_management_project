# user_management/management/commands/init_roles.py

from django.core.management.base import BaseCommand
from django.db.utils import IntegrityError
import logging
from user_management.models import Role  # Обновлено имя приложения

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Initialize default roles in the system'

    def handle(self, *args, **kwargs):
        roles = [
            {'name': 'Администратор', 'description': 'Полный доступ ко всем разделам системы'},
            {'name': 'Финансовый менеджер', 'description': 'Управление финансовыми операциями'},
            {'name': 'Менеджер по бронированию', 'description': 'Управление бронированиями'},
            {'name': 'Руководитель отеля', 'description': 'Просмотр аналитики и ключевых показателей'},
            {'name': 'Сотрудник ресепшн', 'description': 'Управление заселением и выселением'},
            {'name': 'Гость', 'description': 'Доступ к личной информации и статусу бронирования'},
        ]

        for role_data in roles:
            try:
                role, created = Role.objects.get_or_create(
                    name=role_data['name'], 
                    defaults={'description': role_data['description']}
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Role "{role.name}" created successfully'))
                    logger.info(f'Role "{role.name}" created successfully')
                else:
                    self.stdout.write(f'Role "{role.name}" already exists')
                    logger.info(f'Role "{role.name}" already exists')

            except IntegrityError as e:
                self.stdout.write(self.style.ERROR(f'Error creating role "{role_data["name"]}": {e}'))
                logger.error(f'Error creating role "{role_data["name"]}": {e}')
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Unexpected error: {e}'))
                logger.error(f'Unexpected error: {e}')
