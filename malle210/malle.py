from pygame import midi
from midi import MidiConnector
from serial import SerialException


class Malle:

    device = None
    conn = None

    def __init__(self, *args, **kwargs):
        self.device = kwargs.get('device', '/dev/serial0')
        self.setup()

    def setup(self):
        if self.device is None:
            return
        try:
            self.conn = MidiConnector(self.device, timeout=5)
        except SerialException:
            print("Could not open device at port " + self.device)

    @staticmethod
    def list_devices():
        midi.init()
        devices = []
        device_count = midi.get_count()
        for d in range(device_count):
            device = midi.get_device_info(d)
            device_name = device[1].decode()
            device_type = device[2]
            print(device_name, device_type, device_type == 1, type(device_type))
            if device_type == 1:
                input_device = midi.MidiDevice(d, device_name)
                devices.append(input_device)
        midi.quit()
        return devices
