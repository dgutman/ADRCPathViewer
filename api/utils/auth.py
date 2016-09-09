from functools import wraps
from flask import request, Response
from bson.json_util import dumps
from utils.config import get_app_configurations

def check_auth(username, password):
    """This function is called to check if a username /
    password combination is valid.
    """

    config = get_app_configurations()

    with open(config["credentials"], "r") as fh:
        u, p = fh.readline().rstrip().split(",")

    return username == u and password == p

def authenticate():
    """Sends a 401 response that enables basic auth"""
    resp = {"status": 403, "message": "Could not verify your access level for this resource. You have to login with proper credentials"}
    return Response(dumps(resp), 403,
    {'WWW-Authenticate': 'Basic realm="Login Required"'})

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return authenticate()
        return f(*args, **kwargs)
    return decorated