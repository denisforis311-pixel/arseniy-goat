from flask import Flask, request, send_from_directory, render_template
import os

app = Flask(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.route('/')
def home():
    return render_template('age_check.html')

@app.route('/check-age', methods=['POST'])
def check_age():
    age = int(request.form['user_age'])
    
    if age >= 18:
        return render_template('arseniy.html')
    else:
        return "Извините, этот сайт только для совершеннолетних.", 403

@app.route('/get-photo')
def get_photo():
    return send_from_directory(BASE_DIR, 'photo.jpg')

if __name__ == '__main__':
    app.run(debug=True)