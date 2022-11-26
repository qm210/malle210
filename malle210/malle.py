import mido
from .midi_manager import MalleMidiManager
from threading import Thread
from time import time
from sys import stdout
import logging

from .utils import raw_dump

# there is CC 120 and 123 to mute all, but 123 respects the sustain
_CLEAR_MESSAGE_120 = mido.Message('control_change', control=120)
_CLEAR_MESSAGE_123 = mido.Message('control_change', control=123)

logger = logging.getLogger(__name__)


class Malle:

    output_name = None
    _output = None
    _run_threads: list[Thread] = []
    _start_time = None
    _stop_flag = False

    def __init__(self, *args, **kwargs):
        # read kwargs.get(key, default) if you want
        self.manager = MalleMidiManager()

    @staticmethod
    def list_devices():
        return list(set(mido.get_output_names()))

    def output_set(self):
        return self._output is not None

    def set_output(self, name):
        self.stop_tracks()
        if self._output:
            self._output.close()
        try:
            self._output = mido.open_output(name)
            self.output_name = name
        except OSError:
            self._output = None
            self.output_name = None

    def clear_all(self, force_note_off=False):
        for channel in range(16):
            if force_note_off:
                for note in range(128):
                    self.mute(note=note, channel=channel)
            self._output.send(_CLEAR_MESSAGE_120.copy(channel=channel))
            self._output.send(_CLEAR_MESSAGE_123.copy(channel=channel))
        return "cleared."

    def mute(self, note, channel=None):
        if channel is None:
            for channel in range(16):
                self.mute(note, channel=channel)
        else:
            self._output.send(mido.Message('note_off', note=note, channel=channel))

    def test_notes(self):
        if self._output is None:
            return "not initialized, use connect first"
        for ch in range(16):
            msg = mido.Message('note_on', note=41, velocity=127, channel=ch)
            self._output.send(msg)
        return "done"

    def start_tracks(self):
        self.stop_tracks()
        if not self._output:
            return False
        self._output.reset()
        logger.info(f"start_tracks, threads are {self._run_threads}")
        self._start_time = time()
        self._stop_flag = False
        for name in self.manager.names:
            number = self.manager.current_number[name]
            print(f"== {name.upper()} ==> play #{number}")
            thread = Thread(
                target=self.run_track,
                args=(self.manager.tracks[name][number], self.manager.channel_mapping[name])
            )
            self._run_threads.append(thread)
        for thread in self._run_threads:
            thread.start()
        return True

    def stop_tracks(self):
        logger.info(f"stop_tracks, threads are {self._run_threads}")
        self._stop_flag = True
        for thread in self._run_threads:
            try:
                thread.join()
            except RuntimeError:  # happens if a thread isn't started yet
                pass
        self._run_threads = []
        self._start_time = None
        logger.debug(f"stop flag is {self._stop_flag}")

    def run_track(self, midifile: mido.MidiFile, channel=None):
        last_note = 0
        while True:
            for message in midifile.play(meta_messages=True):
                if self._stop_flag:
                    self.mute(note=last_note)
                    return
                if isinstance(message, mido.Message):
                    if channel is not None:
                        message = message.copy(channel=channel)
                    stdout.write(f"Message: {message} {self._stop_flag}\n")
                    stdout.flush()
                    last_note = message.note
                    self._output.send(message)
                else:
                    stdout.write(f"not interpreted Message: {message}\n")
                    stdout.flush()

    def get_runtime_sec(self):
        if not self.is_playing():
            return 0
        now_sec = time()
        return now_sec - self._start_time

    def is_playing(self):
        return self._start_time is not None
