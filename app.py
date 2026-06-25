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
                background-color: #ffffff;
            }
            h1 {
                margin: 0 0 20px 0;
                text-align: center;
                width: 100%;
            }
            /* Контейнер по центру страницы, как было раньше */
            .content-container {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                gap: 30px; /* Расстояние между текстом и фото */
                width: 100%;
                max-width: 900px;
                position: relative;
            }
            /* Блок со строчками слева */
            .info-list {
                font-size: 18px;
                line-height: 1.8;
                font-weight: bold;
                color: #222222;
                white-space: nowrap; /* Чтобы строчки не переносились */
            }
            .info-item {
                margin-bottom: 12px;
            }
            /* Блок с фото и номером */
            .photo-wrapper {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                max-width: 550px;
                width: 100%;
            }
            img {
                width: 100%;
                max-height: calc(100vh - 180px); 
                object-fit: contain;
                display: block;
            }
            .phone-number {
                margin-top: 10px;
                font-size: 13px;
                color: #666666;
                font-weight: bold;
            }
            /* Адаптивность для экранов мобильных */
            @media (max-width: 680px) {
                .content-container {
                    flex-direction: column;
                    gap: 15px;
                }
                .info-list {
                    text-align: center;
                }
                .photo-wrapper {
                    align-items: center;
                }
            }
        </style>
    </head>
    <body>
        <h1>Arseniy goat!!!</h1>
        
        <div class="content-container">
            <!-- Блок с текстом без цифр -->
            <div class="info-list">
                <div class="info-item">Арсений Петруша</div>
                <div class="info-item">174/14 см</div>
                <div class="info-item">60 кг</div>
            </div>
            
            <!-- Блок с фото и номером телефона -->
            <div class="photo-wrapper">
                <img src="/get-photo" alt="Arseniy Goat">
                <div class="phone-number">номер телефона:+375 (33) 647-94-61</div>
            </div>
        </div>
    </body>
    </html>
    """

@app.route('/get-photo')
def get_photo():
    return send_from_directory(BASE_DIR, 'photo.jpg')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
