import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '30s', target: 10 }, // Разгон: 10 пользователей за 30 секунд
        { duration: '1m', target: 50 }, // Нагрузка: 50 пользователей в течение 1 минуты
        { duration: '30s', target: 0 }, // Снижение нагрузки
    ],
};

export default function () {
    const url = 'http://127.0.0.1:62465/books';
    const payload = JSON.stringify({
        title: 'Test Book',
        author: 'John Doe',
        price: 19.99,
        genre: 'Fiction',
        description: 'A test book description',
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(url, payload, params);

    check(res, {
        'is status 200': (r) => r.status === 200,
        'is status 500': (r) => r.status === 500, // Дополнительно проверяем на ошибки
    });

    sleep(1); // Имитация задержки между запросами
}
