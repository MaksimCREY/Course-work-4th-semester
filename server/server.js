// Убедитесь, что у вас подключена библиотека express и mssql
const express = require('express');
const mssql = require('mssql');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 5500;

// Подключение к базе данных
const config = {
    user: 'user1',
    password: 'test123',
    server: 'MaksimCREY',
    database: 'pythonbd',
    options: {
        encrypt: true, // Для обеспечения безопасного подключения к базе данных Azure
        trustServerCertificate: true // Требуется для Azure SQL Database
    }
};

// Подключение к базе данных
mssql.connect(config)
    .then(() => console.log('Подключение к базе данных MSSQL успешно установлено'))
    .catch(err => console.error('Ошибка подключения к базе данных:', err));

// Middleware для обработки JSON и URL-encoded данных
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Маршрут для регистрации (обработка POST запроса)
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Выполняем запрос к базе данных для регистрации пользователя
        const result = await mssql.query`INSERT INTO Users (email, password) VALUES (${email}, ${password})`;
        console.log('Пользователь успешно зарегистрирован:', result);
        res.status(200).send('Пользователь успешно зарегистрирован');
    } catch (error) {
        console.error('Ошибка при регистрации пользователя:', error);
        res.status(500).send('Ошибка при регистрации пользователя');
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
