from flask import Response
from flask_restful import Resource 
from bson.json_util import dumps

class SlideSet(Resource):
	def __init__(self, db, config):
		self.db = db
		self.config = config
		self.slides = self.db[self.config["db_collection"]]

	def get(self, id):
		images = self.slides.find({'group':id})
		
		if images.count() > 0:
			data = []
			for image in images:
				data.append(image)

			return Response(dumps(data), status=200, mimetype='application/json')
		else:
			return Response("", status=400, mimetype='application/json')