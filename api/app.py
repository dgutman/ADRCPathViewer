#!/usr/bin/python
# initialize the flask app
# add configuration to the application
# register the blueprints with the app
#from __future__ import absolute_import


from flask import Flask
from utils.config import get_app_configurations
from routes.v1 import v1
   
#start the flask app
app = Flask('dsa_adrc')

#attach configurations stored in app.cfg to the app
#app.config.from_envvar('DEEPZOOM_MULTISERVER_SETTINGS', silent=True)
#app.config.update(get_app_configurations())

#register the route blueprints to the app
app.register_blueprint(v1)
