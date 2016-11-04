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
    resp = {"status": 401, "message": "Could not verify your access level for that URL"}
    return Response(dumps(resp), status=404, mimetype='application/json')

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        username = request.args.get("username", None)
        password = request.args.get("password", None)
       
        if not check_auth(username, password):
            return authenticate()
        return f(*args, **kwargs)
    return decorated