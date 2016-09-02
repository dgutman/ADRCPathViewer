from flask_restful import Resource
from flask import Response
from bson.json_util import dumps
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
		"""
        Get deep zoom image
        ---
        tags:
          - Deep Zoom
        parameters:
          - in: path
            name: id
            description: MonogDB ObjectId -- Example 57bf3c092f9b2e1595b29730
            type: string
        responses:
          200:
            description: Returns the slide information
          404:
          	description: Invalid slide Id or slide not found
        """

		if not ObjectId.is_valid(id):
			resp = {"status": 404, "message": "Invalid slide Id " + id}
			return Response(dumps(resp), status=404, mimetype='application/json')

		image = self.slides.find_one({'_id': ObjectId(id)})
		path = image["slidePath"]
		slide = get_slide(path)

		if slide == None:
			Response("", status=404, mimetype='application/xml')
		else:
			return Response(slide.get_dzi(self.config['deepzoom_format']), status=200, mimetype='application/xml')
