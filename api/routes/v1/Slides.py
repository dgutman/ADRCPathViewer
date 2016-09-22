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
		"""
        Get all slide information
        This endpoint enforces pagination on the results
        ---
        tags:
          - Slides
        parameters:
          - in: query
            name: start
            description: start position for the set of slides to return
            type: integer
          - in: query
            name: count
            description: number of slides to return relative to the starting position
            type: integer
          - in: query
            name: sort[width]
            description: sort the results by image width [desc,asc]
            type: string
          - in: query
            name: sort[height]
            description: sort the results by image height [desc,asc]
            type: string
          - in: query
            name: sort[fileSize]
            description: sort the results by image size [desc,asc]
            type: string
          - in: query
            name: filter[fileName]
            description: filter results by filename
            type: string
          - in: query
            name: filter[slideSet]
            description: filter results by slide set
            type: string
          - in: query
            name: filter[slidePath]
            description: filter results by slide path
            type: string
        responses:
          200:
            description: Returns the set of slides
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
