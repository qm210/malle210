import re
from os import listdir, getcwd, path
from typing import Dict
from operator import itemgetter
from mido import MidiFile
from dataclasses import dataclass

from .utils import raw_dump


MIDI_FOLDER = "./malle210/midis"

'''
https://mido.readthedocs.io/en/latest/midi_files.html

There are three types of MIDI files:

type 0 (single track): all messages are saved in one track
type 1 (synchronous): all tracks start at the same time
type 2 (asynchronous): each track is independent of the others
'''


@dataclass
class MalleMidiMapping:
    def __init__(self, *args, **kwargs):
        self.channel = kwargs.get('channel', 0)
        self.current_number = kwargs.get('current_number', 2)  # 2 is default for Meet&Beep now, no time left...


class MalleMidiManager:

    files = []
    tracks = {}
    names = []
    mapping: Dict[str, MalleMidiMapping] = {}

    _matcher = re.compile(r"(?P<name>[a-zA-Z_]+)(?P<number>[0-9])")

    def __init__(self):
        self.read_all_files()
        self.print()

    def read_all_files(self):
        try:
            self.files = listdir(MIDI_FOLDER)
            self.files = [file for file in self.files if file.lower().endswith((".mid", ".midi"))]
            self.tracks = self.read_tracks(self.files)
            self.names = list(self.tracks.keys())
            self.mapping = {
                    name: MalleMidiMapping(channel=index)
                    for index, name in enumerate(self.names)
                }
        except Exception as ex:
            print("Could not read files", ex)

    @staticmethod
    def read_tracks(files) -> Dict[str, Dict[int, MidiFile]]:
        result = {}
        for file in files:
            try:
                group = MalleMidiManager._matcher.match(file).groupdict()
                print("group?", group)
                name, number = itemgetter('name', 'number')(group)
                midi = MidiFile(path.join(MIDI_FOLDER, file), clip=True)  # clip=True caps velocity at max. 127
                if name not in result:
                    result[name] = {}
                result[name][int(number)] = midi
            except AttributeError:
                print(f"Ignore {file}: wrong nomenclature ($NAME$NUMBER.mid, $NAME = letters, $NUMBER")
            except Exception as ex:
                print(f"Unknown trouble with {file}: {repr(ex)}")
        return result

    def print(self):
        print("TRACKS", raw_dump(self.tracks))
        print("MAPPING", raw_dump(self.mapping))

    def get_track(self, name):
        if name not in self.tracks:
            return None
        current_number = self.mapping[name].current_number
        return self.tracks[name][current_number]

    def set_mapping(self, current_number=None, channel=None, track_name=None, debug=False):
        if track_name is None:
            for track_name in self.names:
                self.set_mapping(current_number=current_number, channel=channel, track_name=track_name)
        else:
            mapping = self.mapping[track_name]
            if current_number is not None:
                mapping.current_number = current_number
            if channel is not None:
                mapping.channel = channel
            if debug:
                print("set_mapping done:", track_name, mapping)

