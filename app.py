from flask import Flask, send_from_directory
import os

app = Flask(__name__)

# Получаем точный путь к папке, где лежит этот файл app.py
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.route('/')
def home():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Arseniy Goat</title>
        <style>
            body {
                margin: 0;
                padding: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                min-height: 100vh;
                box-sizing: border-box;
                font-family: sans-serif;
                position: relative; /* Нужно для позиционирования номера телефона */
            }
            h1 {
                margin: 0 0 20px 0;
            }
            img {
                width: 100%;
                /* Резервируем 140px под заголовок сверху и номер снизу, чтобы ничего не накладывалось */
                max-height: calc(100vh - 140px); 
                object-fit: contain;
                display: block;
            }
            .phone-number {
                position: absolute;
                bottom: 15px;
                right: 20px;
                font-size: 14px;
                color: #555;
            }
            /* Стили для мобильных телефонов, чтобы номер не уезжал за экран */
            @media (max-width: 480px) {
                .phone-number {
                    position: static;
                    margin-top: 15px;
                    text-align: right;
                    width: 100%;
                    font-size: 13px;
                }
            }
        </style>
    </head>
    <body>
        <h1>Arseniy goat!!!</h1>
        <img src="/get-photo" alt="Arseniy Goat">
        <div class="phone-number">номер телефона:+375 (33) 647-94-61</div>
    </body>
    </html>
    """

@app.route('/get-photo')
def get_photo():
    return send_from_directory(BASE_DIR, 'photo.jpg')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
