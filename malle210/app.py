from flask import Flask, jsonify, render_template, request, redirect, url_for
from flask_cors import CORS
from time import time
from datetime import datetime
import logging

from .malle import Malle
from .state import LastStateFile
from .utils import read_content, write_content, raw_dump

app = Flask(__name__)
# app.config.from_object(__name__)  # wad dis?
CORS(app, resources={r'/*': {'origins': '*'}})
malle = Malle()

logger = logging.getLogger(__name__)

start_time = None


@app.before_first_request
def startup():
    global start_time
    last_device = read_content(LastStateFile.device_name)
    malle.set_output(last_device)
    if not malle.output_name:
        write_content(LastStateFile.device_name, "")
    start_time = time()


@app.route('/')
def index(data=None):
    msg = f"Hello. Live since {datetime.fromtimestamp(start_time)}"
    malle.stop_tracks()
    return render_template(
        'index.html',
        title="Malle210 - matzes awe-inspiring live loop engine",
        message=msg,
        connected=malle.output_set(),
        device_name=malle.output_name,
        footer=raw_dump(data)
    )

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
        message="Select one (probably not the Midi Through, but who am I to judge)",
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
    return redirect('/')


@app.route('/disconnect/')
def disconnect():
    malle.set_output(None)
    return redirect(url_for('list_devices'))


@app.route('/status')
def status():
    return index(data={
        'output_set': malle.output_set(),
        'playing': malle.is_playing(),
        'time_sec': malle.get_runtime_sec(),
        'name': malle.output_name
    })


@app.route('/test')
def test_notes():
    result = malle.test_notes()
    return index(data=result)


@app.route('/mute')
def mute_all():
    result = malle.clear_all()
    return index(data=result)


@app.route('/force-off')
def all_note_off():
    result = malle.clear_all(force_note_off=True)
    return index(data=result)


@app.route('/mayhem')
def start_mayhem():
    current_number = request.args.get("number", default=0)
    malle.set_current_number(current_number)
    if not malle.is_playing():
        malle.start_tracks()
    return render_template(
        'playing.html',
        time_sec=malle.get_runtime_sec()
    )


@app.route('/time_sec')
def get_time_sec():
    return f"{malle.get_runtime_sec():.3f}"
