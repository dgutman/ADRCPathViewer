#!/usr/bin/python
# initialize the flask app
# add configuration to the application
# register the blueprints with the app
#from __future__ import absolute_import

from routes.deepzoom import dz
from routes.slides import slides
from routes.static import static
from  flask import Flask
from utils.config import get_app_configurations


from cache import cache

#start the flask app
app = Flask('dsa_adrc')
app.config['CACHE_TYPE'] = 'memcached'


cache.init_app(app)


#Cache(app,config={'CACHE_TYPE': 'memcached'})

#attach configurations stored in app.cfg to the app
app.config.from_envvar('DEEPZOOM_MULTISERVER_SETTINGS', silent=True)
app.config.update(get_app_configurations())

	
	
#register the route blueprints to the app
app.register_blueprint(dz)
app.register_blueprint(slides)
app.register_blueprint(static)
