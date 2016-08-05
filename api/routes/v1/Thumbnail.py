from openslide import OpenSlide
from flask_restful import Resource
from utils.deepzoom import PILBytesIO
from bson.objectid import ObjectId
from flask import Response
import os

class Thumbnail(Resource):
	def __init__(self, db, config):
		"""initialize Thumbnail resource

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

	def get(self, id):
		"""Get slide thumbnail

		Args:
			id: slide ID which is the mongo ObjectId

		Returns:
			200 response if the thumbnail cerated and returned
			400 response if the thumbnail failed to load
		"""
		image = self.slides.find_one({'_id': ObjectId(id)})
		path = os.path.join(self.config['slides_dir'], image["group"], image["filename"])
		osr = OpenSlide(path)

		try:
			thumb = osr.get_thumbnail( (10,10))
		except ValueError:
			return Response("", status=404, mimetype='application/json')

		buf = PILBytesIO()
		thumb.save(buf, 'jpeg', quality=90)
		return Response(buf.getvalue(), status=200, mimetype='image/jpeg')