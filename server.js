const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

let database = {
    comments: [
        { id: 1, author: "Инвестор", text: "Проект пушка, закидываю 2 миллиона баксов!", time: "Только что" },
        { id: 2, author: "Аноним", text: "Арсений реально GOAT, параметры подтверждаю.", time: "5 минут назад" }
    ],
    statistics: { totalViews: 0, ageChecksPassed: 0, ageChecksFailed: 0, babkaTriggered: 0, eblanTriggered: 0 },
    memes: [
        "Арсений не спит. Он ждет.",
        "Калибр 14 см внесен в реестр мирового наследия ЮНЕСКО.",
        "По статистике, 100% Арсениев являются Петрушами.",
        "Если Арсений звонит вам — сбросьте, вы недостойны.",
        "Вес в 60 кг идеален для маневрирования от налоговой."
    ]
};

const BANNED_WORDS = ['хуй', 'пизда', 'еблан', 'мудак', 'сука'];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: 'arseniy_goat_secret_key_9999',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// Express сам раздаст папки css, js и img изнутри static!
app.use('/static', express.static(path.join(__dirname, 'static')));

app.use((req, res, next) => {
    database.statistics.totalViews++;
    next();
});

function requireAgeVerification(req, res, next) {
    if (req.session && req.session.isVerified) return next();
    res.redirect('/');
}

app.get('/', (req, res) => {
    if (req.session && req.session.isVerified) return res.redirect('/dashboard');
    res.sendFile(path.join(__dirname, 'templates', 'age_check.html'));
});

app.post('/check-age', (req, res) => {
    const inputVal = req.body.user_age ? req.body.user_age.trim() : "";

    if (inputVal === "кимоно") {
        return res.sendFile(path.join(__dirname, 'templates', 'kimono.html'));
    }

    const age = parseInt(inputVal);

    if (isNaN(age)) {
        return res.status(400).send("Вы ввели некорректные данные. Введите возраст или чит-код.");
    }

    if (age > 100) {
        database.statistics.babkaTriggered++;
        return res.sendFile(path.join(__dirname, 'templates', 'cb.html'));
    } else if (age === 67) {
        database.statistics.eblanTriggered++;
        return res.sendFile(path.join(__dirname, 'templates', 'welcome.html'));
    } else if (age >= 18) {
        req.session.isVerified = true;
        req.session.userAge = age;
        database.statistics.ageChecksPassed++;
        return res.redirect('/dashboard');
    } else {
        database.statistics.ageChecksFailed++;
        return res.status(403).sendFile(path.join(__dirname, 'templates', 'restricted.html'));
    }
});

app.get('/dashboard', requireAgeVerification, (req, res) => {
    fs.readFile(path.join(__dirname, 'templates', 'dashboard.html'), 'utf8', (err, htmlText) => {
        if (err) return res.status(500).send("Ошибка ядра сервера.");

        let commentsMarkup = database.comments.map(c => `
            <div class="db-comment-card">
                <div class="db-comment-header">
                    <span class="db-comment-author">⚡ ${c.author}</span>
                    <span class="db-comment-time">${c.time}</span>
                </div>
                <p class="db-comment-text">"${c.text}"</p>
            </div>
        `).join('');

        if (database.comments.length === 0) commentsMarkup = '<p class="empty-state">Архив пуст.</p>';

        let renderedHtml = htmlText
            .replace('{{COMMENTS_PLACEHOLDER}}', commentsMarkup)
            .replace('{{TOTAL_VIEWS}}', database.statistics.totalViews)
            .replace('{{PASSED_CHECKS}}', database.statistics.ageChecksPassed)
            .replace('{{RANDOM_MEME}}', database.memes[Math.floor(Math.random() * database.memes.length)]);

        res.send(renderedHtml);
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

app.post('/api/comment', requireAgeVerification, (req, res) => {
    let { author, text } = req.body;
    author = author ? author.trim() : "Анонимный Маргинал";
    text = text ? text.trim() : "";

    if (!text) return res.status(400).json({ success: false });

    BANNED_WORDS.forEach(word => {
        text = text.replace(new RegExp(word, 'gi'), '[ЦЕНЗУРА АРСЕНИЯ]');
    });

    const newComment = {
        id: database.comments.length + 1,
        author,
        text,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };

    database.comments.unshift(newComment);
    res.json({ success: true, comment: newComment });
});

app.get('/api/random-fact', (req, res) => {
    res.json({ fact: database.memes[Math.floor(Math.random() * database.memes.length)] });
});

app.listen(PORT, '0.0.0.0', () => console.log(`Сервер на http://localhost:${PORT}`));
