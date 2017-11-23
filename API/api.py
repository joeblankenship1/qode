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
from datetime import datetime

# APP = Eve(auth=MyTokenAuth)
APP = Eve()

@APP.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response

# Returns the project id from the request
def get_project_id_from_req(resource, request):
    j = request.args.get('where').encode('utf-8')
    d = json_util.loads(j)
    if resource == 'quote' or resource == 'code':
        return d.get('project') 
    else:
        return d.get('key.project')

# Function that extracts the project id from the item and update the project attrs '_modified_by' and '_modified'
def update_project_attrs(resource, item, mail):
    if resource == 'document' or resource == 'code':
        proj_id = item['key']['project']
    if resource == 'quote':
        proj_id = item['project']
    upd = {"_id" : proj_id, "_modified_by" : mail , "_modified": datetime.now()}
    current_app.data.driver.db['project'].update({'_id':proj_id}, {"$set": upd}, upsert=False)

# Function that checks that the user has the privileges to insert, update or delete resources in a project
def check_permissions(proj_id, mail, read_write):
    db = current_app.data.driver.db['project']
    cursor = db.find_one({'_id': ObjectId(proj_id)})
    projects_json = json_util.dumps(cursor)
    if cursor:
        # Verifys that the mail corresponds for the owner of the project or a collaborator and has the role 'Lector/Escritor'
        access = False
        for col in cursor['collaborators']:
            if col['email'] == mail:
                if read_write:
                    if col['role'] == 'Lector/Escritor':
                        access = True
                else:
                    access = True
        if cursor['key']['owner'] != mail and not access:
            error_message = 'You do not have the privileges to do this'
            abort(make_response(jsonify(message=error_message), 403))

# Return only the projects whose owner is the mail obtained from the access token in session or the mail is from a collaborator for that project 
def pre_GET_project(request, lookup):
    token = get_token_auth_header()
    mail = get_email(token)
    lookup['$or'] = [{ "key.owner": mail }, { "collaborators.email": mail }]

# Return only resources from project whose owner is the mail obtained from the access token in session
def pre_GET_resources(resource, request, lookup):
    if resource == 'document' or resource == 'quote' or resource == 'code':
        if request.args.get('where'):
            token = get_token_auth_header()
            mail = get_email(token)
            proj_id = get_project_id_from_req(resource, request)
            check_permissions(proj_id, mail, False)
                     
# Before every insert  
def before_insert(resource, documents):
    token = get_token_auth_header()
    mail = get_email(token)
    for document in documents:
        # If resource is project  
        if resource == 'project':
            # checks that the combination name owner is unique   
            name = document['key']['name'] 
            db = current_app.data.driver.db['project']
            exists = db.find_one({"key.name": name },{"key.owner": mail})
            # If already exist: abort
            if exists:
                error_message = 'The name is not unique for this user'
                abort(make_response(jsonify(message=error_message), 422))
            # Assign the mail of the owner to the project 
            else:
                document['key']['owner'] = mail
        # If resource is not project, update the attrs
        else:
            if resource == 'document' or resource == 'code':
                proj_id = document['key']['project']
            if resource == 'quote':
                proj_id = document['project']
            check_permissions(proj_id, mail, True)
            update_project_attrs(resource, document, mail)
        # For all the resources init the attrs
        document['_created_by'] = mail
        document['_modified_by'] = mail
        document['_modified'] = datetime.now()

# Before every patch, the atributes: '_modified_by' and '_modified' are updated for the resource and the project
def before_update(resource, documents, item):
    token = get_token_auth_header()
    mail = get_email(token)
    # update the resource atributes
    documents['_modified_by'] = mail
    documents['_modified'] = datetime.now()
    # update the project atributes
    if resource != 'project':
        if resource == 'document' or resource == 'code':
            proj_id = item['key']['project']
        if resource == 'quote':
            proj_id = item['project']
        check_permissions(proj_id, mail, True)
        update_project_attrs(resource, item, mail)

# Update the project atributes 
def before_delete_item(resource, item):
    token = get_token_auth_header()
    mail = get_email(token)
    if resource != 'project':
        if resource == 'document' or resource == 'code':
            proj_id = item['key']['project']
        if resource == 'quote':
            proj_id = item['project']
        check_permissions(proj_id, mail, True)
        update_project_attrs(resource, item, mail)
