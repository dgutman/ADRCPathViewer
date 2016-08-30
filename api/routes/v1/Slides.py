from flask import Response, request
from flask_restful import Resource
from bson.objectid import ObjectId
from bson.json_util import dumps
import re

class Slides(Resource):
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

	def get(self):
		"""Get slide

		Fetch the slide properties from mongo db

		Args:
			id: slide ID which is the mongo ObjectId

		Returns:
			200 response if the slide loaded and returned
			400 response if the slide failed to load
		"""
		
		start = request.args.get('start', 0)
		count = request.args.get('count', 20)
		filters = {}
		sorts = []
		tmp = []

		for key in request.args:
			val = request.args.get(key)
			m = re.match(r"(.*)\[(.*)\]", key)
			if m:
				op = m.group(1)
				field = m.group(2)

				if op == "filter" and val != '':
					filters[field] = { "$regex": str(".*" + val + ".*"), "$options": "i" }
				if op == "sort" and val != '':
					sorts.append((field, 1 if val == "asc" else -1))
	  
		if len(sorts) > 0:
			images = self.slides.find(filters, {'scanProperties': False}).skip(int(start)).limit(int(count)).sort(sorts)
			for image in images:
				image["id"] = str(image["_id"])
				tmp.append(image)

			data = dumps({"data": tmp, "pos": int(start), "total_count": self.slides.find(filters).count()})
			return Response(data, status=200, mimetype='application/json')
		else:
			images = self.slides.find(filters, {'scanProperties': False}).skip(int(start)).limit(int(count))
			for image in images:
				image["id"] = str(image["_id"])
				tmp.append(image)

			data = dumps({"data": tmp, "pos": int(start), "total_count": self.slides.find(filters).count()})
			return Response(data, status=200, mimetype='application/json')
