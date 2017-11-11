import logging
from eve import Eve
from eve.auth import BasicAuth
from flask_cors import CORS
from flask import jsonify
from authentication import MyTokenAuth, AuthError

#APP = Eve(auth=MyTokenAuth)
APP = Eve()
# APP.on_deleted_item_quote += deleted_quote
CORS(APP)

@APP.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response

# def deleted_quote(quote):
#     app.data.find
#     app.data.insert('internal_transactions', [transaction])

if __name__ == '__main__':
    CORS(APP)
    APP.run()
