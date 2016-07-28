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


### Write about a js file with certain info
cfg_file = "../static/js/local_config.js"  ### this is relative to app.py


def update_configjs( cfg_file ):
    jscfg = open(cfg_file,"w")
    jscfg.write('var base_url=' + config['local_url']+';\n' )
    jscfg.write('var iip_url=' + config['iip_url']+';\n' )


print config

update_configjs(cfg_file)
