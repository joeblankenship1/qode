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
        }
    },
    'document': {
        'schema': {
            'key': {
                'type': 'dict',
                'schema': {
                    'name': {'type':'string'},
                    'project': {
                        'type': 'objectid',
                        'data_relation': {
                        'resource': 'project'
                        }   
                    }
                },
                'required': True,
                'unique': True
            },
            'path':{
                'type': 'string'
            },
            'atributes':{
                'type': 'dict',
                'allow_unknown': True,
                'default':{}
            },
            'opened': {
              'type': 'boolean',
              'default': True
            },
            'text':{
                'type': 'string',
                'required': True
            },
            'memos':{
                'type': 'list',
                'schema': {
                    'type': 'string'
                }
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
            'documentDisplay': {
                'type': 'list',
                'schema': {
                    'type': 'dict',
                    'schema': {
                        'page': {'type': 'integer'},
                        'startLine': {'type': 'integer'},
                        'endLine': {'type': 'integer'}
                    }
                }
            },
            'color': {
                'type': 'string'
            },
            'codes': {
                'type': 'list',
                'schema': {
                    'type': 'objectid',
                    'data_relation': {
                        'resource': 'code',
                        'embeddable': True
                    }
                }
            },
            'project': {
                'type': 'objectid',
                'data_relation': {
                    'resource': 'project'
                },
                'required': True
            }
        }
    }
}

RESOURCE_METHODS = ['GET','POST']
ITEM_METHODS = ['GET','PATCH','DELETE']
