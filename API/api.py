import logging
from eve import Eve
from eve.auth import BasicAuth
from flask_cors import CORS
from flask import jsonify, request
from authentication import MyTokenAuth, AuthError, requires_auth, get_token_auth_header, get_email

# APP = Eve(auth=MyTokenAuth)
APP = Eve()
CORS(APP)

@APP.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response

# Return only the projects whose owner is the mail obtained from the access token in session
def pre_GET_project(request, lookup):
    token = get_token_auth_header()
    mail = get_email(token)
    lookup["key.owner"] = {"$in": [mail]}
    # lookup["colaborators.user.email"] = {"$in": [mail]}

# Assign the mail of the owner to the project
def before_insert_project(projects):
    token = get_token_auth_header()
    mail = get_email(token)
    for proj in projects:
        proj['key']['owner'] = mail

if __name__ == '__main__':
    CORS(APP)
    APP.on_pre_GET_project += pre_GET_project
    APP.on_insert_project += before_insert_project
    APP.run(debug=True)

