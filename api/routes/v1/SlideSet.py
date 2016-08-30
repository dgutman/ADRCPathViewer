from flask import Response, request
from flask_restful import Resource 
from bson.json_util import dumps
import re

class SlideSet(Resource):
	def __init__(self, db, config):
		"""initialize SlideSet resource

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
		"""Get slide set for a specific collection or group

		Args:
			id: collection/group ID for which a slide belongs to

		Returns:
			200 response if the slide set loaded and returned
			400 response if the slide set failed to load
		"""
		#images = self.slides.find({'slideSet':id}, {'scanProperties': False})
		
		#if images.count() > 0:
		#	data = []
		#	for image in images:
		#		image["id"] = str(image["_id"])
		#		data.append(image)

		#	return Response(dumps(data), status=200, mimetype='application/json')
		#else:
		#	return Response("", status=400, mimetype='application/json')

		start = request.args.get('start', 0)
		count = request.args.get('count', 20)
		filters = {"slideSet": id}
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
