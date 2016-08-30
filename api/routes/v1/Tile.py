from flask_restful import Resource
from flask import Response
from bson.objectid import ObjectId
from utils.deepzoom import get_slide, PILBytesIO

class Tile(Resource):
	def __init__(self, db, config):
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
		self.slides = self.db[self.config["db_collection"]]

	def get(self, id, col, row):
		"""Get deepzoom image

		Fetch the slide from cache is available and return XML response for the 
		deep zoom image

		Args:
			id: slide ID which is the mongo ObjectId

		Returns:
			200 response if the slide loaded and returned
			400 response if the slide failed to load
		"""

		image = self.slides.find_one({'_id': ObjectId(id[0:24])})
		path = image["slidePath"]
		level = int(id[24:])
		slide = get_slide(path)
		
		try:
			tile = slide.get_tile(level, (col, row))
			buf = PILBytesIO()
			tile.save(buf, 'jpeg', quality=90)
			return Response(buf.getvalue(), status=200, mimetype='image/jpeg')
		except ValueError:
			Response(None, status=404)