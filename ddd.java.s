const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.urlencoded({extended:true}));


app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname, 'templates',age_check.html'));
});


app.post('/check-age', (req,res) => {
    const age = parseInt(req.body.user_age);


    if (age >=18)  {
        res.sendFile(path.join(__dirname, 'photo.jpg));
    }
});


app.get('/get-photo',(req,res) => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
