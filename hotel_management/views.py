# hotel_management/views.py

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status
import logging

# Настройте логирование
logger = logging.getLogger(__name__)

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        # Логируем полученные данные
        print("Данные запроса на авторизацию:", request.data)
        logger.info("Запрос на авторизацию получен")
        logger.info(f"Данные запроса: {request.data}")

        # Проверяем наличие данных username и password
        username = request.data.get('username', None)
        password = request.data.get('password', None)
        
        if not username or not password:
            logger.error("Отсутствует имя пользователя или пароль в запросе.")
            return Response({"detail": "Отсутствуют необходимые данные"}, status=status.HTTP_400_BAD_REQUEST)

        # Выполняем стандартный процесс авторизации через родительский класс
        response = super().post(request, *args, **kwargs)

        # Логируем ответ
        if response.status_code == 200:
            logger.info("Авторизация прошла успешно")
        else:
            logger.warning("Ошибка авторизации")
            logger.warning(f"Ответ сервера: {response.data}")

        return response
