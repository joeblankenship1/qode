from gevent.wsgi import WSGIServer
from api import APP, pre_GET_resources, pre_GET_project, before_insert_project
from flask_cors import CORS

if __name__ == '__main__':
    CORS(APP)
    APP.on_pre_GET_project += pre_GET_project
    APP.on_pre_GET += pre_GET_resources
    APP.on_insert_project += before_insert_project
    # APP.run(debug=True)
    APP.debug = True
    http_server = WSGIServer(('', 5000), APP)
    http_server.serve_forever() 