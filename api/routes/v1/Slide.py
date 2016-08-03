from flask import Response, request
from flask_restful import Resource
from bson.objectid import ObjectId
from bson.json_util import dumps
from utils.config import get_app_configurations
from utils.db import connect

class Slide(Resource):
	def __init__(self):
		self.config = get_app_configurations()
		self.db = connect(self.config)
		self.slides = self.db[self.config["db_collection"]]

	def get(self, id):
		image = self.slides.find_one({'_id': ObjectId(id)})
		
		if image:
			return Response(dumps(image), status=200, mimetype='application/json')
		else:
			return Response("", status=400, mimetype='application/json')

	def put(self, id):
		image = self.slides.find_one({'_id': ObjectId(id)})

		if image:
			self.slides.update_one({"_id": ObjectId(id)}, {"$set":request.json})
			image = self.slides.find_one({'_id': ObjectId(id)})
			return Response(dumps(image), status=200, mimetype='application/json')
		else:
			return Response("", status=400, mimetype='application/json')