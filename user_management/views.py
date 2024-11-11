from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
import logging

from .models import UserProfile
from .serializers import UserProfileSerializer

logger = logging.getLogger(__name__)

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Кастомное представление для получения JWT-токенов.
    """
    def post(self, request, *args, **kwargs):
        logger.info("Запрос на авторизацию получен.")
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            logger.info(f"Авторизация успешна для пользователя {request.data.get('username')}")
        else:
            logger.warning("Ошибка авторизации.")
        return response

class UserProfileView(APIView):
    """
    Представление для получения профиля пользователя.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Возвращает данные текущего аутентифицированного пользователя.
        """
        user = request.user
        serializer = UserProfileSerializer(user)
        logger.info(f"Профиль пользователя {user.username} получен.")
        return Response(serializer.data, status=status.HTTP_200_OK)

class RegisterView(APIView):
    """
    Представление для регистрации нового пользователя.
    """
    def post(self, request):
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"Новый пользователь зарегистрирован: {serializer.data['username']}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.warning("Ошибка регистрации пользователя.")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    """
    Представление для выхода пользователя из системы с аннулированием refresh-токена.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                logger.warning("Отсутствует refresh-токен для логаута.")
                return Response({"detail": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()
            logger.info(f"Пользователь {request.user.username} успешно вышел из системы.")
            return Response(status=status.HTTP_205_RESET_CONTENT)

        except Exception as e:
            logger.error(f"Ошибка при логауте: {e}")
            return Response({"detail": "Ошибка при попытке логаута."}, status=status.HTTP_400_BAD_REQUEST)
