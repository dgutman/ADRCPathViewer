from flask_restful import Api
from flask_swagger import swagger
from flask_restful.utils import cors
from flask import Blueprint, current_app, jsonify
from SlideSetList import SlideSetList
from SlideSet import SlideSet
from DeepZoom import DeepZoom
from Thumbnail import Thumbnail
from MacroImage import MacroImage
from LabelImage import LabelImage
from Slide import Slide
from Slides import Slides
from Tile import Tile
from Aperio import Aperio
from PathologyReport import PathologyReport
from Static import Static
from utils.db import connect
from utils.config import get_app_configurations

# Get app configurations
config = get_app_configurations()

# Prepare OpenSlide/DeepZoom options
opts = {
	'tile_size': int(config['tile_size']),
	'overlap': int(config['overlap']),
	'limit_bounds': int(config['limit_bounds'])
}

# Prepare arguments to pass to the resources
params = {'db': connect(config), 'config': config}
dz_params = {'db': connect(config), 'config': config, 'opts': opts}

# Create a blueprint for API v1
# It is prefixed with /v1
# Add CORS decorator for all endpoints
v1 = Blueprint('v1', __name__)
api = Api(v1, prefix="/v1")

@v1.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin','*')
    response.headers.add('Access-Control-Allow-Headers', "Authorization, Content-Type")
    response.headers.add('Access-Control-Expose-Headers', "Authorization")
    response.headers.add('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.add('Access-Control-Allow-Credentials', "true")
    response.headers.add('Access-Control-Max-Age', 60 * 60 * 24 * 20)
    return response

@v1.route("/v1/docs")
def spec():
    swag = swagger(current_app)
    swag['info']['version'] = "1.0"
    swag['info']['title'] = "Digital Slide Archive"
    swag['info']['base_path'] = "http://digitalslidearchive.emory.edu:5081"
    return jsonify(swag)

# Attach all endpoints to the v1 API
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
		"/thumbnail/<string:id>", 
		endpoint="thumbnail", 
		resource_class_kwargs=params)

api.add_resource(
		Slide, 
		"/slide/<string:id>", 
		endpoint="slide", 
		resource_class_kwargs=params)

api.add_resource(
		MacroImage, 
		"/macroimage/<string:id>", 
		endpoint="macroimage", 
		resource_class_kwargs=params)

api.add_resource(
		LabelImage, 
		"/labelimage/<string:id>", 
		endpoint="labelimage", 
		resource_class_kwargs=params)

api.add_resource(
		Tile,
		"/tile/<string:id>/<int:level>/<int:x>/<int:y>", 
		resource_class_kwargs=params)

api.add_resource(
		Slides, 
		"/slides", 
		endpoint="slides", 
		resource_class_kwargs=params)

api.add_resource(
		Aperio, 
		"/aperio/<path:filename>", 
		endpoint="aperio")

api.add_resource(
		PathologyReport, 
		"/pathology/<path:filename>", 
		endpoint="pathology")

api.add_resource(
		Static,
		"/<path:path>",
		resource_class_kwargs={'config': config})
