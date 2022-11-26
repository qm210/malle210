import re
from os import listdir, getcwd, path
from typing import Dict
from operator import itemgetter
from mido import MidiFile


MIDI_FOLDER = "./malle210/midis"

'''
https://mido.readthedocs.io/en/latest/midi_files.html

There are three types of MIDI files:

type 0 (single track): all messages are saved in one track
type 1 (synchronous): all tracks start at the same time
type 2 (asynchronous): each track is independent of the others
'''

class MalleMidiManager:

    files = []
    tracks = {}
    names = []
    current_number = {}

    _matcher = re.compile(r"(?P<name>[a-zA-Z_]+)(?P<number>[0-9])")

    def __init__(self):
        self.read_all_files()

    def read_all_files(self):
        try:
            self.files = listdir(MIDI_FOLDER)
            self.files = [file for file in self.files if file.lower().endswith((".mid", ".midi"))]
            self.tracks = self.read_tracks(self.files)
            self.names = list(self.tracks.keys())
            self.current_number = {name: 0 for name in self.names}
        except Exception as ex:
            print("Could not read files", ex)
        print(self.files, getcwd())

    @staticmethod
    def read_tracks(files) -> Dict[str, list[MidiFile]]:
        result = {}
        for file in files:
            group = MalleMidiManager._matcher.match(file).groupdict()
            name, number = itemgetter('name', 'number')(group)
            try:
                midi = MidiFile(path.join(MIDI_FOLDER, file), clip=True)  # clip=True caps velocity at max. 127
                if name not in result:
                    result[name] = []
                result[name].append({number: midi})
            except Exception as ex:
                print(f"Trouble with {file}, {repr(ex)}")
        return result
