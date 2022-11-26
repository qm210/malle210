import mido
from .midi_manager import MalleMidiManager
from threading import Thread
from time import time

# there is CC 120 and 123 to mute all, but 123 respects the sustain
_CLEAR_MESSAGE = mido.Message('control_change', control=120)


class Malle:

    output_name = None
    _output = None
    _run_threads: list[Thread] = []
    _start_time = None

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
                    self._output.send(mido.Message('note_off', note=note, channel=channel))
            self._output.send(_CLEAR_MESSAGE.copy(channel=channel))
        return "cleared."

    def test_notes(self):
        if self._output is None:
            return "not initialized, use connect first"
        for ch in range(16):
            msg = mido.Message('note_on', note=41, velocity=127, channel=ch)
            self._output.send(msg)
        return "done"

    def start_tracks(self):
        self.stop_tracks()
        print(f"try to start, threads are {self._run_threads}")
        self._start_time = time()
        for name in self.manager.names:
            number = self.manager.current_number[name]
            print(f"== {name.upper()} ==> play #{number}")
            thread = Thread(target=self.run_track, args=(self.manager.tracks[name][number],))
            self._run_threads.append(thread)
        for thread in self._run_threads:
            thread.start()

    def stop_tracks(self):
        print(f"stop tracks, threads are {self._run_threads}")
        for thread in self._run_threads:
            try:
                thread.join()
            except RuntimeError:  # happens if a thread isn't started yet
                pass
        self._run_threads = []

    def run_track(self, midifile: mido.MidiFile):
        # print("deal with", midifile)
        while True:
            pass

    def get_runtime_sec(self):
        if not self.is_playing():
            return 0
        now_sec = time()
        return now_sec - self._start_time

    def is_playing(self):
        return self._start_time is not None
