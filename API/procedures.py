import numpy as np
from flask import current_app
from bson.objectid import ObjectId

def codes_matrix(proj_id,cooc):
    codes = {}
    docs = []
    code_labels = []
    tot_ocurrences= []
    i = 0
    db = current_app.data.driver.db['code']
    cursor = db.find({'key.project': ObjectId(proj_id)})
    if cursor:
        for code in cursor:
            codes[str(code['_id'])] = {'position':i, 'name':code['key']['name']}
            code_labels.append({ 'name':code['key']['name'], 'color': code['color']})
            i+=1
    if len(codes) == 0:
        error_message = 'No existen códigos en el proyecto'
        return {message: error_message}
    db = current_app.data.driver.db['document']
    cursor = db.find({'key.project': ObjectId(proj_id)})
    if cursor:
        for doc in cursor:
            ocurrences = [0]*len(codes)
            for quote in doc['quotes']:
                quote_cursor = current_app.data.driver.db['quote'].find_one(({'_id':quote}))
                if quote_cursor:
                    for q_code in quote_cursor['codes']:
                        pos = codes[str(q_code)]['position']
                        ocurrences[pos] += 1
            docs.append({'name':doc['key']['name'], 'ocurrences': ocurrences})
            if (cooc):
                tot_ocurrences.append(ocurrences)
    if len(docs) == 0:
        error_message = 'No existen documentos en el proyecto'
        return {message: error_message}
    if (cooc):
        np_occ = np.array(tot_ocurrences)
        cooc_matrix = np.dot(np_occ.transpose(),np_occ)
        return {"codes":code_labels , "coocmatrix":cooc_matrix.tolist()}
    return {"codes":code_labels , "docs":docs}