"""Python Flask API Auth0 integration example
"""

from functools import wraps
import json
from os import environ as env
from six.moves.urllib.request import urlopen

#from dotenv import load_dotenv, find_dotenv
from flask import Flask, request, jsonify, _app_ctx_stack
from flask_cors import cross_origin
from jose import jwt

from eve import Eve
from eve.auth import TokenAuth
from flask_cors import CORS

import http.client

# ENV_FILE = find_dotenv()
# if ENV_FILE:
#     load_dotenv(ENV_FILE)
AUTH0_DOMAIN = 'nurruty.auth0.com' #env.get("AUTH0_DOMAIN")
API_AUDIENCE = 'http://localhost:5000/' #env.get("API_ID")
ALGORITHMS = ["RS256"]
RULE_CLAIM = 'https://myapp.example.com/email'

# def get_email(tok):
#     conn = http.client.HTTPSConnection('nurruty.auth0.com')
#     headers = { 'Authorization': "Bearer " + tok}
#     conn.request("GET", "/userinfo", headers=headers)
#     res = conn.getresponse()
#     data = res.read()
#     return json.loads(data.decode("utf-8"))['name']

def get_email(tok):
    unverified_claims = jwt.get_unverified_claims(tok)
    mail = unverified_claims[RULE_CLAIM].split()
    return mail[0] 

def get_token_auth_header():
    """Obtains the access token from the Authorization Header
    """
    auth = request.headers.get("Authorization", None)
    if not auth:
        raise AuthError({"code": "authorization_header_missing",
                        "description":
                            "Authorization header is expected"}, 401)
    parts = auth.split()

    if parts[0].lower() != "bearer":
        raise AuthError({"code": "invalid_header",
                        "description":
                            "Authorization header must start with"
                            " Bearer"}, 401)
    elif len(parts) == 1:
        raise AuthError({"code": "invalid_header",
                        "description": "Token not found"}, 401)
    elif len(parts) > 2:
        raise AuthError({"code": "invalid_header",
                        "description":
                            "Authorization header must be"
                            " Bearer token"}, 401)
    token = parts[1]
    return token


def requires_scope(required_scope):
    """Determines if the required scope is present in the access token
    Args:
        required_scope (str): The scope required to access the resource
    """
    token = get_token_auth_header()
    unverified_claims = jwt.get_unverified_claims(token)
    token_scopes = unverified_claims["scope"].split()
    for token_scope in token_scopes:
        if token_scope == required_scope:
            return True
    return False


def requires_auth(f):
    """Determines if the access token is valid
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_auth_header()
        jsonurl = urlopen("https://"+AUTH0_DOMAIN+"/.well-known/jwks.json")
        rawjson = jsonurl.read()
        jwks = json.loads(rawjson.decode("utf-8"))
        try:
            unverified_header = jwt.get_unverified_header(token)
        except jwt.JWTError:
            raise AuthError({"code": "invalid_header",
                            "description":
                                "Invalid header. "
                                "Use an RS256 signed JWT Access Token"}, 401)
        if unverified_header["alg"] == "HS256":
            raise AuthError({"code": "invalid_header",
                            "description":
                                "Invalid header. "
                                "Use an RS256 signed JWT Access Token"}, 401)
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
        if rsa_key:
            try:
                payload = jwt.decode(
                    token,
                    rsa_key,
                    algorithms=ALGORITHMS,
                    audience=API_AUDIENCE,
                    issuer="https://"+AUTH0_DOMAIN+"/"
                )
            except jwt.ExpiredSignatureError: 
                raise AuthError({"code": "token_expired",
                                "description": "token is expired"}, 401)
            except jwt.JWTClaimsError: 
                raise AuthError({"code": "invalid_claims",
                                "description":
                                    "incorrect claims,"
                                    " please check the audience and issuer"}, 401)
            except Exception: 
                raise AuthError({"code": "invalid_header",
                                "description":
                                    "Unable to parse authentication"
                                    " token."}, 400)
            print("PAYLOAD!!!!!!")
            print(payload)
            _app_ctx_stack.top.current_user = payload
            return f(*args, **kwargs)
        raise AuthError({"code": "invalid_header",
                        "description": "Unable to find appropriate key"}, 400)
    return decorated

class MyTokenAuth(TokenAuth):
    @cross_origin(headers=['Content-Type', 'Authorization'])
    @requires_auth
    def check_auth(self, token, allowed_roles, resource, method):
        return "All good. You only get this message if you're authenticated"

# Format error response and append status code.
class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code


