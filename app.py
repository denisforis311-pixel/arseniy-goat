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
                padding: 10px;
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
                margin: 10px 0 15px 0;
                text-align: center;
            }
            .content-container {
                width: 100%;
                max-width: 800px;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            img {
                width: 100%;
                max-height: calc(100vh - 160px); 
                object-fit: contain;
                display: block;
            }
            .phone-number {
                align-self: flex-end;
                margin-top: 10px;
                font-size: 13px;
                color: #666666;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <h1>Arseniy goat!!!</h1>
        <div class="content-container">
            <img src="/get-photo" alt="Arseniy Goat">
            <div class="phone-number">номер телефона:+375 (33) 647-94-61</div>
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
