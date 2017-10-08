from gevent.wsgi import WSGIServer
from api import APP

http_server = WSGIServer(('', 5000), APP)
http_server.serve_forever()
# APP.run()