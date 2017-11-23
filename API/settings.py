DOMAIN = {
    'project': {
        'extra_response_fields': ['key','_modified_by','_modified' ],
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
            'collaborators': {
                'type': 'list',
                'schema': {
                    'type':'dict',
                    'schema': {
                        'email': {'type':'string'},
                        'role': {'type':'string'},
                    }
                }
            },
            '_created_by': {
                'type': 'string'
            },
            '_modified': {
                'type': 'string'
            },
            '_modified_by': {
                'type': 'string'
            },
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
                'default': [],
                'schema': {
                    'type': 'objectid',
                    'data_relation': {
                        'resource': 'quote',
                        'embeddable': True
                    }
                }
            },
            '_created_by': {
                'type': 'string'
            },
            '_modified': {
                'type': 'string'
            },
            '_modified_by': {
                'type': 'string'
            },
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
            },
            '_created_by': {
                'type': 'string'
            },
            '_modified': {
                'type': 'string'
            },
            '_modified_by': {
                'type': 'string'
            },
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
            },
            '_created_by': {
                'type': 'string'
            },
            '_modified': {
                'type': 'string'
            },
            '_modified_by': {
                'type': 'string'
            },
        }
    }
}

RESOURCE_METHODS = ['GET','POST','DELETE']
ITEM_METHODS = ['GET','PATCH','DELETE']
