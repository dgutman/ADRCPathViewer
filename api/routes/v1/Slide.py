from flask import Response, request
from flask_restful import Resource
from bson.objectid import ObjectId
from bson.json_util import dumps

class Slide(Resource):
	def __init__(self, db, config):
		"""initialize Slide resource

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
        Get slide information
        ---
        tags:
          - Slide
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

		image = self.slides.find_one({'_id': ObjectId(id)}, {"scanProperties": False})
		
		if image:
			return Response(dumps(image), status=200, mimetype='application/json')
		else:
			return Response("", status=404, mimetype='application/json')

	def put(self, id):
		"""
        Update slide information
        ---
        tags:
          - Slide
        parameters:
          - in: path
            name: id
            description: MonogDB ObjectId -- Example 57bf3c092f9b2e1595b29730
            type: string
          - in: body
            name: json
            description: JSON object containing parameters to update
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

		image = self.slides.find_one({'_id': ObjectId(id)}, {"scanProperties": False})
		
		if image:
			self.slides.update_one({"_id": ObjectId(id)}, {"$set":request.get_json(force=True)})
			image = self.slides.find_one({'_id': ObjectId(id)}, {"scanProperties": False})
			image["id"] = str(image["_id"])
			return Response(dumps(image), status=200, mimetype='application/json')
		else:
			return Response("", status=404, mimetype='application/json')
