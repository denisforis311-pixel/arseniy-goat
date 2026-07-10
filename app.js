const express = require('express');
const path = require('path');
const fs = require('fs'); // Подключаем модуль файловой системы для работы с readFile
const app = express();
const PORT = process.env.PORT || 5000;

// Глобальная переменная для хранения отзыва в памяти сервера
let globalComment = "Отзывов пока нет";

// Учим сервер расшифровывать данные из HTML-форм
app.use(express.urlencoded({ extended: true }));

// Открываем прямой доступ к папке static для CSS-стилей
app.use('/static', express.static(path.join(__dirname, 'static')));

// 1. ГЛАВНАЯ СТРАНИЦА: Показываем экран ввода возраста
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'age_check.html'));
});

// 2. ЛОГИКА ПРОВЕРКИ: Обработка возраста и вклейка отзывов
app.post('/check-age', (req, res) => {
    const age = parseInt(req.body.user_age);

    if (age > 100) {
        // Пасхалка про бабушку
        res.sendFile(path.join(__dirname, 'templates', 'grandma.html'));
    } 
    else if (age === 67) {
        // Вторая пасхалка
        res.sendFile(path.join(__dirname, 'templates', '67years.html'));
    } 
    else if (age >= 18) {
        // Обычный вход: динамически читаем HTML и вклеиваем отзыв
        const filePath = path.join(__dirname, 'templates', 'arseniy.html');

        fs.readFile(filePath, 'utf8', (err, htmlText) => {
            if (err) {
                console.error("Ошибка при чтении файла arseniy.html:", err);
                return res.status(500).send("Ошибка на сервере при чтении профиля");
            }
            // Заменяем метку на сохраненный в памяти отзыв
            const updateHtml = htmlText.replace('{{COMMENT_PLACEHOLDER}}', globalComment);
            // Отправляем готовую страницу в браузер
            res.send(updateHtml);
        });
    } 
    else {
        
        res.status(403).sendFile(path.join(__dirname, 'templates', 'restricted.html'));
    }
});


app.post('/add-comment', (req, res) => {
    
    const comment = req.body.user_comment;
    
    
    globalComment = comment;

    console.log("В консоль сервера прилетел отзыв: " + globalComment);

    
    res.redirect('/');
});


app.get('/get-photo', (req, res) => {
    res.sendFile(path.join(__dirname, 'photo.jpg'));
});


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Сервер JavaScript успешно запущен на порту ${PORT}`);
});
