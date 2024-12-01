const redis = require('redis');

// Устанавливаем значения по умолчанию для переменных окружения
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1'; // Локальный Redis по умолчанию
const REDIS_PORT = process.env.REDIS_PORT || 6379; // Порт Redis по умолчанию

// Создаем клиента Redis
const client = redis.createClient({
    url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});

// Событие успешного подключения
client.on('connect', () => console.log(`Connected to Redis at ${REDIS_HOST}:${REDIS_PORT}`));

// Обработка ошибок подключения
client.on('error', (err) => console.error('Redis error:', err));

// Асинхронное подключение к Redis
(async () => {
    try {
        await client.connect();
        console.log('Redis client successfully connected');
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
    }
})();

// Обеспечиваем корректное закрытие соединения при завершении работы приложения
process.on('SIGINT', async () => {
    try {
        await client.quit();
        console.log('Redis connection closed');
        process.exit(0);
    } catch (err) {
        console.error('Error closing Redis connection:', err);
        process.exit(1);
    }
});

module.exports = client;
