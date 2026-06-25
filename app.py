from flask import Flask, send_from_directory
import os

app = Flask(__name__)


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
            }
            h1 {
                margin: 0 0 20px 0;
            }
            img {
                width: 100%;
                /* 100vh — это вся высота экрана. Вычитаем 120px, чтобы влезла надпись и отступы */
                max-height: calc(100vh - 120px); 
                object-fit: contain;
                display: block;
            }
        </style>
    </head>
    <body>
        <h1>Arseniy goat!!!</h1>
        <img src="/get-photo" alt="Arseniy Goat">
    </body>
    </html>
    """

@app.route('/get-photo')
def get_photo():
    return send_from_directory(BASE_DIR, 'photo.jpg')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)

