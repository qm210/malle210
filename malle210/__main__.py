from os import getenv

from . import DEBUG, VERSION
from .app import app


port = int(getenv('FLASK_PORT', default=8080))

if __name__ == '__main__':
    print("malle210 v", VERSION)
    if DEBUG:
        app.run(debug=True, host='0.0.0.0', port=port, use_reloader=True)
    else:
        from waitress import serve
        serve(app, host='0.0.0.0', port=port)
