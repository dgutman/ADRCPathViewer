#!/usr/bin/python
# initialize the flask app
# add configuration to the application
# register the blueprints with the app
#from __future__ import absolute_import

from flask import Flask, jsonify
from flask_cache import Cache 
from routes.v1 import v1
from utils.cache import cache

#start the flask app
app = Flask('dsa_adrc')
app.config['CACHE_TYPE'] = 'memcached'
cache.init_app(app)

# Attach api v1 to the app
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
app.register_blueprint(v1)