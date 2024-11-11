# Используем официальный Python 3.9 образ
FROM python

# Устанавливаем переменную окружения для Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файл зависимостей
COPY requirements.txt /app/

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем весь проект
COPY . /app/

# Открываем порт 8000
EXPOSE 8000

# Команда запуска приложения
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
