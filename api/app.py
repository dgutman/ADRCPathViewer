#!/usr/bin/python
# initialize the flask app
# add configuration to the application
# register the blueprints with the app
#from __future__ import absolute_import

from flask import Flask
from flask_cache import Cache 
from routes.v1 import v1
from utils.cache import cache

#start the flask app
app = Flask('dsa_adrc')
app.config['CACHE_TYPE'] = 'memcached'
cache.init_app(app)

# Attach api v1 to the app
app.register_blueprint(v1)