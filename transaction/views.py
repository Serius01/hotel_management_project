from rest_framework import generics, permissions
from .models import Category, Transaction
from .serializers import CategorySerializer, TransactionSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
import logging

logger = logging.getLogger(__name__)

class CategoryListCreateView(generics.ListCreateAPIView):
    """
    Представление для списка и создания категорий транзакций
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]  # Только администраторы могут управлять категориями
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['type', 'is_active']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'type']

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Представление для детального просмотра, обновления и удаления категории
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['type', 'is_active']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'type']

class TransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Представление для детального просмотра, обновления и удаления транзакции.
    Ограничивает доступ к транзакции только для владельца.
    """
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Ограничивает доступ к транзакции для владельца.
        """
        user = self.request.user
        logger.debug(f"Доступ к транзакции для пользователя {user.username}")
        return Transaction.objects.filter(user=user)

class TransactionListCreateView(generics.ListCreateAPIView):
    """
    Представление для списка и создания транзакций.
    Ограничивает список транзакций текущим пользователем.
    """
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['type', 'status', 'category', 'booking__room__number', 'user__username']
    search_fields = ['category__name', 'booking__room__number', 'user__username']
    ordering_fields = ['date', 'amount', 'status']

    def get_queryset(self):
        """ Ограничивает список транзакций только для текущего пользователя. """
        user = self.request.user
        logger.debug(f"Получение списка транзакций для пользователя {user.username}")
        queryset = Transaction.objects.filter(user=user)
        logger.debug(f"Количество транзакций: {queryset.count()}")
        return queryset

    def perform_create(self, serializer):
        """
        Создает транзакцию для текущего пользователя с логированием.
        """
        transaction = serializer.save(user=self.request.user)  # Убираем дублирующий вызов save
        logger.info(f"Транзакция {transaction.id} создана пользователем {self.request.user.username}")
