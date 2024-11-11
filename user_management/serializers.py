from rest_framework import serializers
from .models import UserProfile
import logging

logger = logging.getLogger(__name__)

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели UserProfile.
    """
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'role', 'is_active', 'phone_number']  # Указываем необходимые поля

    def validate_email(self, value):
        """
        Проверка уникальности email.
        """
        if UserProfile.objects.filter(email=value).exclude(pk=self.instance.pk).exists():
            logger.warning("Пользователь с таким email уже существует.")
            raise serializers.ValidationError("Пользователь с таким email уже существует.")
        return value

    def create(self, validated_data):
        """
        Логирование создания пользователя и сохранение данных.
        """
        logger.info(f"Создание нового пользователя: {validated_data.get('username')}")
        user = UserProfile.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        """
        Обновление данных пользователя с логированием.
        """
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        logger.info(f"Обновлен профиль пользователя: {instance.username}")
        return instance
