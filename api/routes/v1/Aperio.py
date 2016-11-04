from flask import Response, request
from flask_restful import Resource
from bson.objectid import ObjectId
from bson.json_util import dumps
import os

class Aperio(Resource):
	def __init__(self):
		pass

	def get(self, filename):
  		"""
        Get Aperio XML annotation
        ---
        tags:
          - Aperio
        produces:
          - application/xml
        parameters:
          - in: path
            name: filename
            description: Full path to Aperio XML file
            type: string
        responses:
          200:
            description: Returns the Aperio XML annotation
          404:
          	description: Invalid path
        """

		filename = "/" + filename
		if os.path.exists(filename):
			with open(filename, 'r') as fh:
				content = fh.read()
				return Response(content, status=200, mimetype='text/xml')
		else:
			return Response("", status=404)
