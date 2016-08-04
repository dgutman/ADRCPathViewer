import os, openslide
from flask_restful import Resource
from flask import make_response, Response
from bson.objectid import ObjectId
from openslide import OpenSlide
from openslide.deepzoom import DeepZoomGenerator
from utils.cache import cache
from utils.deepzoom import get_slide

class DeepZoom(Resource):
	def __init__(self, db, config, opts):
		self.db = db
		self.config = config
		self.opts = opts
		self.slides = self.db[self.config["db_collection"]]

	@cache.cached()	
	def get(self, id):
		image = self.slides.find_one({'_id': ObjectId(id)})
		path = os.path.join(self.config["slides_dir"], image["group"], image["filename"])
		slide = get_slide(self.config['slides_dir'], path)

		if slide == None:
			Response("", status=400, mimetype='application/xml')
		else:
			return Response(slide.get_dzi(self.config['deepzoom_format']), status=200, mimetype='application/xml')