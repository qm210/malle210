from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from time import time
import logging

from .malle import Malle
from .state import LastStateFile
from .utils import read_content, write_content

app = Flask(__name__)
# app.config.from_object(__name__)  # wad dis?
CORS(app, resources={r'/*': {'origins': '*'}})
malle = Malle()

logger = logging.getLogger(__name__)

start_time = "not-initialized"


@app.before_first_request
def startup():
    global start_time
    last_device = read_content(LastStateFile.device_name)
    malle.set_output(last_device)
    if not malle.output_name:
        write_content(LastStateFile.device_name, "")
    start_time = time()

@app.route('/')
def index():
    msg = f"Hello. Live since {start_time}"
    if malle.output_set():
        msg += f" - connected to \"{malle.output_name}\""
    return msg

# @app.route('/favicon.ico')
# def favicon():
#     return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')


@app.route('/devices/')
def list_devices():
    devices = malle.list_devices()
    href = [f"../connect?device={device}" for device in devices]
    return render_template(
        'list.html',
        title='Midi Output Devices',
        message="Select one (probably not the Midi Through, but who am I to judge",
        list=devices,
        href=href
    )


@app.route('/connect/')
def connect():
    device = request.args.get("device")
    if device is None:
        return "Device not given. Use with ...?device=... (and escape %20 etc. accordingly)"
    malle.set_output(device)
    write_content(LastStateFile.device_name, malle.output_name)
    return f"Yay. Malle now uses device: {malle.output_name}"


@app.route('/status')
def status():
    return jsonify({
        'output_set': malle.output_set(),
        'playing': malle.is_playing(),
        'time_sec': malle.get_runtime_sec(),
        'name': malle.output_name
    })

@app.route('/test')
def test_notes():
    result = malle.test_notes()
    return jsonify(result)

@app.route('/off')
def all_note_off():
    result = malle.clear_all()
    return jsonify(result)


@app.route('/mayhem')
def start_mayhem():
    malle.start_tracks()
    return render_template(
        'playing.html',
        time_sec=malle.get_runtime_sec(),
        list=[]
    )