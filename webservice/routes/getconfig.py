#!/usr/bin/python
# Serve up a route listing the configuration for the current DSA instance
# This will basically serve up stuff from app.cfg and avoid us haiving to create
# a separate config.json file... i.e. all config go in a single file


from flask import Blueprint
from utils.crossdomains import crossdomain
from utils.config import get_app_configurations as gac
from bson.json_util import dumps

#get app configurations
config = gac()
print config,"is the current config I received"

getconfig = Blueprint('getconfig', __name__)

@getconfig.route('/api/wbx/getConfig')
def serve_config():
	"""
	The default request will serve index.html page
	"""
	return dumps(config)


