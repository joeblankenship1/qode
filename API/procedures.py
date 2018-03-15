import numpy as np
import json
from flask import current_app
from bson.objectid import ObjectId
from datetime import datetime


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        elif isinstance(o, datetime):
            return o.strftime("%a, %d %b %Y %H:%M:%S GMT")
        return json.JSONEncoder.default(self, o)


def codes_matrix(proj_id, cooc):
    codes = {}
    docs = []
    code_labels = []
    tot_ocurrences = []
    i = 0
    db = current_app.data.driver.db['code']
    cursor = db.find({'key.project': ObjectId(proj_id)})
    if cursor:
        for code in cursor:
            codes[str(code['_id'])] = {
                'position': i, 'name': code['key']['name']}
            code_labels.append(
                {'name': code['key']['name'], 'color': code['color']})
            i += 1
        cursor.close()
    if len(codes) == 0:
        error_message = 'No existen códigos en el proyecto'
        return {'message': error_message}
    db = current_app.data.driver.db['document']
    cursor = db.find({'key.project': ObjectId(proj_id)})
    if cursor:
        for doc in cursor:
            ocurrences = [0] * len(codes)
            for quote in doc['quotes']:
                quote_cursor = current_app.data.driver.db['quote'].find_one(
                    ({'_id': quote}))
                if quote_cursor:
                    for q_code in quote_cursor['codes']:
                        pos = codes[str(q_code)]['position']
                        ocurrences[pos] += 1
            docs.append({'name': doc['key']['name'], 'ocurrences': ocurrences})
            if (cooc):
                tot_ocurrences.append(ocurrences)
        cursor.close()
    if len(docs) == 0:
        error_message = 'No existen documentos en el proyecto'
        return {'message': error_message}
    if (cooc):
        np_occ = np.array(tot_ocurrences)
        cooc_matrix = np.dot(np_occ.transpose(), np_occ)
        np.fill_diagonal(cooc_matrix, 0)
        return {"codes": code_labels, "coocmatrix": cooc_matrix.tolist()}
    return {"codes": code_labels, "docs": docs}


def import_codes(from_id, to_id, mail):
    codes_repeated = {}
    codes_insert = []
    db = current_app.data.driver.db['code']
    cursor = db.find({'key.project': ObjectId(from_id)})
    if cursor:
        for code in cursor:
            code_name = code['key']['name']
            i = 1
            cursor_aux = db.find(
                {'key': {'name': code['key']['name'], 'project': ObjectId(to_id)}})
            while cursor_aux.count() > 0:
                code['key']['name'] = code_name + "(" + str(i) + ")"
                cursor_aux = db.find(
                    {'key': {'name': code['key']['name'], 'project': ObjectId(to_id)}})
                i += 1
            cursor_aux.close()
            code['key']['project'] = ObjectId(to_id)
            code.pop('_id')
            code['_created_by'] = mail
            code['_modified_by'] = mail
            code['_created'] = datetime.utcnow()
            code['_modified'] = datetime.utcnow()
            codes_insert.append(code)
        cursor.close()
    if len(codes_insert) > 0:
        result = db.insert(codes_insert)
        db = current_app.data.driver.db['project']
        cursor = db.find({'_id': ObjectId(to_id)}, snapshot=True)
        if cursor:
            for project in cursor:
                if 'code_system' in project:
                    for objId in result:
                        project['code_system'].append(
                            {'code_id': str(objId), 'children': []})
                    db.save(project)
            cursor.close()
    return {'codes': JSONEncoder().encode(codes_insert)}

def import_codes2(from_id, to_id, mail):
    db = current_app.data.driver.db['project']
    cursor = db.find({'_id': ObjectId(from_id)}, snapshot=True)
    new_nodes = []
    if cursor:
        for project in cursor:
            if 'code_system' in project:
                new_nodes = create_new_code_system(project['code_system'],to_id,mail)
        cursor.close()
        cursor = db.find({'_id': ObjectId(to_id)}, snapshot=True)
        if cursor:
            for project in cursor:
                if 'code_system' in project:
                    project['code_system'] = project['code_system'] + new_nodes
                else:
                    project['code_system'] = new_nodes
                new_nodes = project['code_system']
                db.save(project)
            cursor.close()
    return {'code_system': JSONEncoder().encode(new_nodes)}
    

def solve_name_repeatition(code,proj_id):
    code_name = code['key']['name']
    result = ''
    i = 1
    db = current_app.data.driver.db['code']
    cursor_aux = db.find(
        {'key': {'name': code['key']['name'], 'project': ObjectId(proj_id)}})
    while cursor_aux.count() > 0:
        result = code_name + "(" + str(i) + ")"
        cursor_aux = db.find(
            {'key': {'name': code['key']['name'], 'project': ObjectId(proj_id)}})
        i += 1
    cursor_aux.close()
    return result

def create_new_code_system(nodes,proj_id,mail):
    db = current_app.data.driver.db['code']
    new_nodes = []
    for node in nodes:
        children = []
        cursor = db.find({'_id': ObjectId(node['code_id'])}, snapshot=True)
        if cursor:
            for code in cursor:
                code['key']['name'] = solve_name_repeatition(code,proj_id)
                code['key']['project'] = ObjectId(proj_id)
                code.pop('_id')
                code['_created_by'] = mail
                code['_modified_by'] = mail
                code['_created'] = datetime.utcnow()
                code['_modified'] = datetime.utcnow()
                result = db.insert(code)
            cursor.close()
            if len(node['children']) > 0:
                children = create_new_code_system(node['children'],proj_id,mail)
            if result:
                new_nodes.append({'code_id': str(result), 'children': children})
    print(new_nodes)
    return new_nodes