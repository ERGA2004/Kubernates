# Указываем базовый образ
FROM node:20-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь код приложения
COPY . .

# Указываем порт, который слушает приложение
EXPOSE 3000

# Запускаем приложение
CMD ["node", "server.js"]
