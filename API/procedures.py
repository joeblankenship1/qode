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


# def import_codes(from_id, to_id, mail):
#     codes_repeated = {}
#     codes_insert = []
#     db = current_app.data.driver.db['code']
#     cursor = db.find({'key.project': ObjectId(from_id)})
#     if cursor:
#         for code in cursor:
#             code_name = code['key']['name']
#             i = 1
#             cursor_aux = db.find(
#                 {'key': {'name': code['key']['name'], 'project': ObjectId(to_id)}})
#             while cursor_aux.count() > 0:
#                 code['key']['name'] = code_name + "(" + str(i) + ")"
#                 cursor_aux = db.find(
#                     {'key': {'name': code['key']['name'], 'project': ObjectId(to_id)}})
#                 i += 1
#             cursor_aux.close()
#             code['key']['project'] = ObjectId(to_id)
#             code.pop('_id')
#             code['_created_by'] = mail
#             code['_modified_by'] = mail
#             code['_created'] = datetime.utcnow()
#             code['_modified'] = datetime.utcnow()
#             codes_insert.append(code)
#         cursor.close()
#     if len(codes_insert) > 0:
#         result = db.insert(codes_insert)
#         db = current_app.data.driver.db['project']
#         cursor = db.find({'_id': ObjectId(to_id)}, snapshot=True)
#         if cursor:
#             for project in cursor:
#                 if 'code_system' in project:
#                     for objId in result:
#                         project['code_system'].append(
#                             {'code_id': str(objId), 'children': []})
#                     db.save(project)
#             cursor.close()
#     return {'codes': JSONEncoder().encode(codes_insert)}

def import_codes(from_id, to_id, mail):
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

def solve_name_repetition(code,proj_id):
    code_name = code['key']['name']
    i = 1
    db = current_app.data.driver.db['code']
    cursor_aux = db.find(
        {'key': {'name': code['key']['name'], 'project': ObjectId(proj_id)}})
    while cursor_aux.count() > 0:
        code['key']['name'] = code_name + "(" + str(i) + ")"
        cursor_aux = db.find(
            {'key': {'name': code['key']['name'], 'project': ObjectId(proj_id)}})
        i += 1
    cursor_aux.close()
    return code['key']['name']

def create_new_code_system(nodes,proj_id,mail):
    db = current_app.data.driver.db['code']
    new_nodes = []
    result = None
    for node in nodes:
        children = []
        cursor = db.find({'_id': ObjectId(node['code_id'])}, snapshot=True)
        if cursor:
            for code in cursor:
                code['key']['name'] = solve_name_repetition(code,proj_id)
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
    return new_nodes

def delete_node_code_system(nodes,nodeId):
  result = False
  i= 0
  while result == False and i < len(nodes):
    if nodes[i]['code_id'].strip() == str(nodeId).strip():
      if len(nodes[i]['children']) > 0:
        delete_children(nodes[i]['children'])
      del nodes[i]
      result = True
    else:
      result = delete_node_code_system(nodes[i]['children'],nodeId)
    i += 1
  return result


def delete_children(nodes):
  db = current_app.data.driver.db['code']
  for node in nodes:
    cursor = db.find({'_id': ObjectId(node['code_id'])}, snapshot=True)
    if cursor:
      for code in cursor:
        if len(node['children']) > 0:
          delete_children(node['children'])
        delete_quotes_of_code(code)
        current_app.data.driver.db['code'].remove({'_id':code['_id']})
      cursor.close()

def delete_quotes_of_code(code):
  db = current_app.data.driver.db['quote']
  cursor = db.find({'project': ObjectId(code['key']['project'])})
  if cursor:
      for quote in cursor:
          borrar = quote['memo'] == '' and len(quote['codes']) == 1 and quote['codes'][0] == code['_id']
          if borrar:
              current_app.data.driver.db['quote'].remove(({'_id':quote['_id']}))
              doc_cursor = current_app.data.driver.db['document'].find({'quotes': quote['_id'] })
              for doc in doc_cursor:
                  doc['quotes'].remove(quote['_id'])
                  current_app.data.driver.db['document'].save(doc)
              doc_cursor.close()
          else:
              i = 0
              deleted = False
              while deleted == False and i < len(quote['codes']):
                  if quote['codes'][i] == code['_id']:
                      del quote['codes'][i]
                      deleted = True
                  i += 1
              db.save(quote)
      cursor.close()
