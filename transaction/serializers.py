from rest_framework import serializers
from .models import Category, Transaction
from booking.models import Booking
from django.contrib.auth import get_user_model
import logging

User = get_user_model()  # Получаем текущую модель пользователя
logger = logging.getLogger(__name__)

class CategorySerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели Category
    """
    class Meta:
        model = Category
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели Transaction с пользовательской валидацией и привязкой текущего пользователя.
    """
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    booking = serializers.PrimaryKeyRelatedField(
        queryset=Booking.objects.all(),
        required=False,
        allow_null=True
    )
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        source='category',
        queryset=Category.objects.all(),
        write_only=True,
        error_messages={'does_not_exist': 'Указанная категория не существует.'}
    )

    class Meta:
        model = Transaction
        fields = '__all__'
        
    
    def validate(self, attrs):
        """
        Проверка: тип категории должен соответствовать типу транзакции.
        """
        transaction_type = attrs.get('type')
        category = attrs.get('category')

        if category and category.type != transaction_type:
            logger.error("Тип категории не соответствует типу транзакции.")
            raise serializers.ValidationError("Тип категории не соответствует типу транзакции.")
        return attrs

    def create(self, validated_data):
        """
        Создание транзакции: назначение текущего пользователя и логирование.
        """
        validated_data.pop('user', None)
        # Назначаем пользователя, переданного в контексте
        user = self.context['request'].user
        transaction = Transaction.objects.create(user=user, **validated_data)
        logger.info(f"Транзакция {transaction.id} создана пользователем {user.username}.")
        return transaction

