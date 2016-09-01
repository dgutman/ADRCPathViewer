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
        Get slide information.
        ---
        tags:
          - slide
        parameters:
          - in: path
            name: id
            description: Slide ID
            type: string
        responses:
          200:
            description: Returns the slide information
            $ref: '#/definitions/Slide'
        """

		image = self.slides.find_one({'_id': ObjectId(id)}, {"scanProperties": False})
		
		if image:
			return Response(dumps(image), status=200, mimetype='application/json')
		else:
			return Response("", status=400, mimetype='application/json')

	def put(self, id):
		"""Update slide

		Update slide properties in mongodb. Properties are passed as json
		object in a PUT request

		Args:
			id: slide ID which is the mongo ObjectId

		Returns:
			200 response if the slide loaded and returned
			400 response if the slide failed to load
		"""
		image = self.slides.find_one({'_id': ObjectId(id)}, {"scanProperties": False})

		if image:
			self.slides.update_one({"_id": ObjectId(id)}, {"$set":request.get_json(force=True)})
			image = self.slides.find_one({'_id': ObjectId(id)}, {"scanProperties": False})
			image["id"] = str(image["_id"])
			return Response(dumps(image), status=200, mimetype='application/json')
		else:
			return Response("", status=400, mimetype='application/json')
