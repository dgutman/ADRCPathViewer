from flask_restful import Resource
from flask import Response
from bson.objectid import ObjectId
from utils.cache import cache
from utils.deepzoom import get_slide

class DeepZoom(Resource):
	def __init__(self, db, config, opts):
		"""initialize DeepZoom resource

		Args:
			db: mongo db connection
			config: application configurations
			opt: deep zoom configurations

		Returns:
			None
		"""
		self.db = db
		self.config = config
		self.opts = opts
		self.slides = self.db[self.config["db_collection"]]

	@cache.cached()	
	def get(self, id):
		"""Get deepzoom image

		Fetch the slide from cache is available and return XML response for the 
		deep zoom image

		Args:
			id: slide ID which is the mongo ObjectId

		Returns:
			200 response if the slide loaded and returned
			400 response if the slide failed to load
		"""
		image = self.slides.find_one({'_id': ObjectId(id)})
		path = image["slidePath"]
		slide = get_slide(path)

		if slide == None:
			Response("", status=400, mimetype='application/xml')
		else:
			return Response(slide.get_dzi(self.config['deepzoom_format']), status=200, mimetype='application/xml')
