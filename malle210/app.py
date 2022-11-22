from flask import Flask, jsonify
from flask_cors import CORS
from time import time

from .malle import Malle

app = Flask(__name__)
# app.config.from_object(__name__)  # wad dis?
CORS(app, resources={r'/*': {'origins': '*'}})
malle = Malle()

start_time = "not-initialized"

@app.before_first_request
def startup():
    global start_time
    start_time = time()

@app.route('/')
def index():
    return f"Hello. Live since {start_time}"

# @app.route('/favicon.ico')
# def favicon():
#     return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')


@app.route('/connect/')
def connect(**kwargs):
    return jsonify({
        'devices': malle.list_devices()
    })
