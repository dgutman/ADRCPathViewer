#!/usr/bin/python
# initialize the flask app
# add configuration to the application
# register the blueprints with the app
#from __future__ import absolute_import

from routes.deepzoom import dz
from routes.slides import slides
from routes.static import static
from routes.labelmacro import labelmacro
from  flask import Flask
from utils.config import get_app_configurations
from routes.slidefeedback import slidefeedback
from routes.getconfig import getconfig

from cache import cache

#start the flask app
app = Flask('dsa_adrc')
app.config['CACHE_TYPE'] = 'memcached'

cache.init_app(app)

#attach configurations stored in app.cfg to the app
app.config.from_envvar('DEEPZOOM_MULTISERVER_SETTINGS', silent=True)
app.config.update(get_app_configurations())

	
#register the route blueprints to the app
app.register_blueprint(dz)
app.register_blueprint(slides)
app.register_blueprint(static)
app.register_blueprint(labelmacro)
app.register_blueprint(slidefeedback) ### May want to make this  a config option..
app.register_blueprint(getconfig)
