from openslide import OpenSlide
from flask_restful import Resource
from bson.objectid import ObjectId
from flask import Response, request
from PIL import Image
import os, gridfs, cStringIO
from utils.deepzoom import PILBytesIO
from bson.json_util import dumps
from utils.auth import requires_auth

class LabelImage(Resource):
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

	@requires_auth
	def get(self, id):
		"""
        Get slide label image
        ---
        tags:
          - Label Image
        parameters:
          - in: path
            name: id
            description: MonogDB ObjectId -- Example 57bf3c092f9b2e1595b29730
            type: string
        responses:
          200:
            description: Returns the slide label image
          404:
          	description: Invalid slide Id or label image not found
        """

		image = self.slides.find_one({'_id': ObjectId(id)})
		path = image["path"]
		osr = OpenSlide(path)
		dim = (int(self.config["macro_width"]), int(self.config["macro_height"]))

		if "label" in osr.associated_images.keys():
			im = osr.associated_images["label"]
			im.thumbnail(dim)
			buf = PILBytesIO()
			im.save(buf, "jpeg", quality=90)
			return Response(buf.getvalue(), status=200, mimetype='image/jpeg')
		else:
			resp = {"status": 404, "message": "Label image not found this resource"}
			return Response(dumps(resp), status=404, mimetype='application/json')