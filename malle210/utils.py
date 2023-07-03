from json import dumps


def read_content(filename, default=""):
    result = default
    try:
        with open(filename, 'r') as handle:
            result = handle.read()
    except FileNotFoundError:
        pass
    return result if result != "" else default


def write_content(filename, content):
    with open(filename, 'w') as handle:
        handle.write(content)


def raw_dump(data):
    if data is None:
        return ""
    return dumps(data, indent=4, default=lambda x: "NONSERIALIZABLE")  # x.__dict__ ?
