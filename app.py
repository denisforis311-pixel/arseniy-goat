from flask import Flask
import os

app = Flask(__name__)

@app.route('/')
def home():
    return "Arseniy goat!!!"

if __name__ == '__main__':
    # Этот кусок кода нужен, чтобы хостинг сам выделил свободный порт
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
