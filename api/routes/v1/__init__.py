from flask_restful import Api
from flask_restful.utils import cors
from flask import Blueprint
from SlideSetList import SlideSetList
from SlideSet import SlideSet
from DeepZoom import DeepZoom
from Thumbnail import Thumbnail
from Slide import Slide
from utils.db import connect
from utils.config import get_app_configurations

# Create a blueprint for API v1
# It is prefixed with /v1
# Add CORS decorator for all endpoints
# Attach all endpoints to the v1 API
v1 = Blueprint('v1', __name__)
config = get_app_configurations()

opts = {
	'tile_size': int(config['tile_size']),
	'overlap': int(config['overlap']),
	'limit_bounds': int(config['limit_bounds'])
}

params = {'db': connect(config), 'config': config}
dz_params = {'db': connect(config), 'config': config, 'opts': opts}

api = Api(v1, prefix="/v1")
api.decorators=[cors.crossdomain(origin='*')]

api.add_resource(
		SlideSetList, 
		"/slidesetlist", 
		endpoint="slidesetlist", 
		resource_class_kwargs=params)

api.add_resource(
		SlideSet, 
		"/slideset/<string:id>", 
		endpoint="slideset", 
		resource_class_kwargs=params)

api.add_resource(
		DeepZoom, 
		"/deepzoom/<string:id>", 
		endpoint="deepzoom", 
		resource_class_kwargs=dz_params)

api.add_resource(
		Thumbnail, 
		"/thumbnail/<path:path>", 
		endpoint="thumbnail", 
		resource_class_kwargs=params)

api.add_resource(
		Slide, 
		"/slide/<string:id>", 
		endpoint="slide", 
		resource_class_kwargs=params)