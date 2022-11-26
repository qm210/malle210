from dataclasses import dataclass
import string


@dataclass
class LastStateFile:
    device_name: string = ".last.device"
