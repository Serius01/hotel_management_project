# Используем официальный образ Node.js
FROM node:20-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь код приложения
COPY . /app/

# Собираем приложение
RUN npm run build

# Устанавливаем сервер для статических файлов
RUN npm install -g serve

# Открываем порт 3000
EXPOSE 3000

# Команда запуска приложения
CMD ["npm", "run", "dev"]

