import logging
from eve import Eve
from eve.auth import BasicAuth
from flask_cors import CORS
from flask import jsonify
from authentication import MyTokenAuth, AuthError

APP = Eve(auth=MyTokenAuth)

@APP.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response

if __name__ == '__main__':
    CORS(APP)
    APP.run()
