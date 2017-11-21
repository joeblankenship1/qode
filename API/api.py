import logging
from eve import Eve
from eve.auth import BasicAuth
from flask_cors import CORS
from flask import jsonify, request, make_response
from authentication import MyTokenAuth, AuthError, requires_auth, get_token_auth_header, get_email
from settings import DOMAIN

from flask import Blueprint, Response, current_app, request
from bson import json_util
from bson.objectid import ObjectId
from flask import abort

# APP = Eve(auth=MyTokenAuth)
APP = Eve()
CORS(APP)

@APP.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response

# Return only the projects whose owner is the mail obtained from the access token in session or the mail is from a collaborator for that project 
def pre_GET_project(request, lookup):
    token = get_token_auth_header()
    mail = get_email(token)
    lookup['$or'] = [{ "key.owner": mail }, { "collaborators.email": mail }]

# Return only resources from project whose owner is the mail obtained from the access token in session
def pre_GET_resources(resource, request, lookup):
    if resource == 'document' or resource == 'quote' or resource == 'code':
        token = get_token_auth_header()
        mail = get_email(token)
        if request.args.get('where'):
            j = request.args.get('where').encode('utf-8')
            d = json_util.loads(j)
            if resource == 'quote' or resource == 'code':
                proj_id = d.get('project') 
            else:
                proj_id = d.get('key.project')  # proj_id -> is the project id from the request
            db = current_app.data.driver.db['project']
            cursor = db.find_one({'_id': ObjectId(proj_id)})
            projects_json = json_util.dumps(cursor)
            if cursor:
                # verifys that the mail corresponds for the owner of the project or a collaborator 
                esCol = False
                for col in cursor['collaborators']:
                    if col['email'] == mail:
                        esCol = True
                if cursor['key']['owner'] != mail and not esCol:
                    error_message = 'You do not have permissions to access this content'
                    abort(make_response(jsonify(message=error_message), 403))
                     
# Before every insert  
def before_insert(resource, documents):
    token = get_token_auth_header()
    mail = get_email(token)
    for document in documents:
        # If resource is project: Assign the mail of the owner to the project and check that the combination name owner is unique     
        if resource == 'project':
            name = document['key']['name'] 
            db = current_app.data.driver.db['project']
            exists = db.find_one({"key.name": name },{"key.owner": mail})
            if exists:
                error_message = 'The name is not unique for this user'
                abort(make_response(jsonify(message=error_message), 422))
            else:
                document['key']['owner'] = mail
        # For all the resources 
        document['_created_by'] = mail
        document['_modified_by'] = mail

def before_update(resource, documents, original):
    token = get_token_auth_header()
    mail = get_email(token)
    documents['_modified_by'] = mail
