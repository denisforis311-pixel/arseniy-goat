const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));


app.use('/static', express.static(path.join(__dirname, 'static')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'age_check.html'));
});

app.post('/check-age', (req, res) => {
    const age = parseInt(req.body.user_age);

    if (age > 100) {
        
        res.sendFile(path.join(__dirname, 'templates', 'cb.html'));
    } 
    else if (age === 67) {
        
        res.sendFile(path.join(__dirname, 'templates', 'welcome.html'));
    } 
    else if (age >= 18) {
        
        res.sendFile(path.join(__dirname, 'templates', 'arseniy.html'));
    } 
    else {
        
        res.status(403).sendFile(path.join(__dirname, 'templates','restricted.html'));
    }
});

app.get('/get-photo', (req, res) => {
    res.sendFile(path.join(__dirname, 'photo.jpg'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Сервер JavaScript запущен на порту ${PORT}`);
});
