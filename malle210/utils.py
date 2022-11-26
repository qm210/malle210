

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
