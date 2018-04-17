from gevent.wsgi import WSGIServer
from api import APP, pre_GET_resources, pre_GET_project, before_update, before_insert, before_delete_item
from flask_cors import CORS

if __name__ == '__main__':
    CORS(APP)
    APP.debug = True
    http_server = WSGIServer(('', 5000), APP)
    http_server.serve_forever() 
