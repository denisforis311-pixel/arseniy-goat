from flask import Flask, send_from_directory
import os

app = Flask(__name__)


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.route('/')
def home():
    return "<h1>Arseniy goat!!!</h1><img src='/get-photo' style='max-width:100%;'>"

@app.route('/get-photo')
def get_photo():
    return send_from_directory(BASE_DIR, 'photo.jpg')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
