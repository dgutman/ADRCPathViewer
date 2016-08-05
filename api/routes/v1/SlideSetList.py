from flask import Response
from flask_restful import Resource 
from bson.json_util import dumps

class SlideSetList(Resource):
	def __init__(self, db, config):
		"""initialize SlideSetList resource

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

	def get(self):
		"""Get slide set list

		Fetch the list fo all distinct slide sets/groups

		Args:
			None

		Returns:
			200 response if the list is found and returned
			400 response if the list failed to load
		"""
		groups = self.slides.distinct('group')
		data = []

		for index, group in enumerate(groups):
			data.append({"id": index, "value": group})

		if len(data) > 0:
			return Response(dumps(data), status=200, mimetype='application/json')
		else:
			return Response("", status=204, mimetype='application/json')