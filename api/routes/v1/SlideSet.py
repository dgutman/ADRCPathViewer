from flask import Response
from flask_restful import Resource 
import json
from utils.config import get_app_configurations
from utils.db import connect

class SlideSet(Resource):
	def __init__(self):
		self.config = get_app_configurations()
		self.db = connect(self.config)
		self.slides = self.db[self.config["db_collection"]]

	def get(self, id):
		groups = self.slides.distinct('group')
		data = []

		for index, group in enumerate(groups):
			data.append({"id": index, "value": group})

		if len(data) > 0:
			return Response(json.dumps(data), status=200, mimetype='application/json')
		else:
			return Response("", status=204, mimetype='application/json')