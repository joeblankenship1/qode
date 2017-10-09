DOMAIN = {
    'user': {
        'schema': {
            'username': {
                'type': 'string',
                 'unique': True,
                 'required': True
            },
            'password': {
                'type': 'string',
                'required': True
            },
            'role': {
                'type': 'string',
                'allowed': ["reader", "coder"],
                'required': True
            }
        },
        'id_field': 'username',
        'additional_lookup': {
            'url': 'regex("[\w]+")',
            'field': 'username',
        }
    },
    'project': {
        'schema': {
            'name':{
                'type': 'string',
                'unique': True,
                'required': True
            },
            'description':{
                'type': 'string',
                'maxlength': 300
            },
            'owner': {
                'type': 'objectid',
                'data_relation': {
                    'resource': 'user'
                },
                'required': True
            },
        },
        'additional_lookup': {
            'url': 'regex("[\w]+")',
            'field': 'name',
        },
        # 'id_field': 'name',
    },
    'document': {
        'schema': {
            'name':{
                'type': 'string',
                'unique': True,
                'required': True
            },
            'path':{
                'type': 'string',
                'required': True
            },
            'atributes':{
                'type': 'dict',
                'allow_unknown': True,
                'default':{}
            },
            'text':{
                'type': 'string',
                'required': True
            },
            'project': {
                'type': 'objectid',
                'data_relation': {
                    'resource': 'project'
                },
                'required': True
            },
            'memo':{
                'type': 'string'
            },
            'quotes': {
                'type': 'list',
                'schema': {
                    'type': 'objectid',
                    'data_relation': {
                        'resource': 'quote',
                        'embeddable': True
                    }
                }
            }
        }
    },
    'code': {
        'schema': {
            'name':{
                'type': 'string',
                'required': True
            },
            'color':{
                'type': 'string'
            },
            'project': {
                'type': 'objectid',
                'data_relation': {
                    'resource': 'project'
                },
                'required': True
            },
            'memo':{
                'type': 'string'
            }
        }
    },
    'quote': {
        'schema': {
            'text':{
                'type': 'string',
                'required': True
            },
            'memo':{
                'type': 'string'
            },
            'position':{
                'type': 'dict',
                'schema': {
                    'start': {'type':'integer'},
                    'end': {'type':'integer'}
                },
                'required': True
            },
            'codes': {
                'type': 'list',
                'schema': {
                    'type': 'objectid',
                    'data_relation': {
                        'resource': 'code'
                    }
                },
                'embeddable': True
            }
        }
    }
}

RESOURCE_METHODS = ['GET','POST']
ITEM_METHODS = ['GET','PATCH','DELETE']