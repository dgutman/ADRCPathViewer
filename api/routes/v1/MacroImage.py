from openslide import OpenSlide, OpenSlideError
from flask_restful import Resource
from bson.objectid import ObjectId
from flask import Response, session
from PIL import Image
import os, gridfs, cStringIO
from utils.deepzoom import PILBytesIO
from utils.auth import requires_auth
from bson.json_util import dumps

class MacroImage(Resource):
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
		"""
        Get slide macro image
        ---
        tags:
          - Macro Image
        parameters:
          - in: path
            name: id
            description: MonogDB ObjectId -- Example 57bf3c092f9b2e1595b29730
            type: string
        responses:
          200:
            description: Returns the slide macro image
          404:
          	description: Invalid slide Id or macro image not found
        """

		if session.get("auth"):
			image = self.slides.find_one({'_id': ObjectId(id)})
			path = image["path"]
			dim = (int(self.config["macro_width"]), int(self.config["macro_height"]))
			osr = OpenSlide(path)
			
			if "macro" in osr.associated_images.keys():
				im = osr.associated_images["macro"]
				im.thumbnail(dim)
				buf = PILBytesIO()
				im.save(buf, "jpeg", quality=90)
				return Response(buf.getvalue(), status=200, mimetype='image/jpeg')
			else:
				resp = {"status": 404, "message": "Macro image not found this resource"}
				return Response(dumps(resp), status=404, mimetype='application/json')
		else:
			resp = {"status": 403, "message": "Could not verify your access level for this resource. You have to login with proper credentials"}
			return Response(dumps(resp), status=403, mimetype='application/json')