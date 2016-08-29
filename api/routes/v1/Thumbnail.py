from openslide import OpenSlide
from flask_restful import Resource
from bson.objectid import ObjectId
from flask import Response
from PIL import Image
import os, gridfs, cStringIO

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
		self.gfs = gridfs.GridFS(db)		

	def get(self, id):
		"""Get slide thumbnail

		Args:
			id: slide ID which is the mongo ObjectId

		Returns:
			200 response if the thumbnail cerated and returned
			400 response if the thumbnail failed to load
		"""

		image = self.slides.find_one({'_id': ObjectId(id)})
		path = image["slidePath"]
		filename = os.path.splitext(os.path.basename(path))[0] + ".jpg"

		if not self.gfs.exists(filename=filename):
			osr = OpenSlide(path)

			try:
				thumb = osr.get_thumbnail( (300,300))
			except ValueError:
				return Response(None, status=404)

			buf = cStringIO.StringIO()
			thumb.save(buf, 'jpeg', quality=90)
			self.gfs.put(buf.getvalue(), contentType="image/jpeg", filename=filename)
			return Response(buf.getvalue(), status=200, mimetype='image/jpeg')
		else:
			im = Image.open(self.gfs.get_last_version(filename))
			buf = cStringIO.StringIO() 
			im.save(buf, 'jpeg', quality=90)
			return Response(buf.getvalue(), status=200, mimetype='image/jpeg')