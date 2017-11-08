DOMAIN = {
    'project': {
        'cache_control': '',
        'cache_expires': 0,
        'extra_response_fields': ['key'],
        'schema': {
            'key': {
                'type': 'dict',
                'schema': {
                    'name': {'type': 'string'},
                    'owner': {'type': 'string'}
                },
                'required': True,
                'unique': True
            },
            'description':{
                'type': 'string',
                'maxlength': 300
            },
            'colaborators': {
                'type': 'list',
                'schema': {
                    'type':'dict',
                    'schema': {
                        'email': {'type':'string'},
                        'role': {'type':'string'},
                    }
                }
            }
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
            'color':{
                'type': 'string'
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

RESOURCE_METHODS = ['GET','POST','DELETE']
ITEM_METHODS = ['GET','PATCH','DELETE']
