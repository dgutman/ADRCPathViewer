from flask import Response, request
from flask_restful import Resource
from bson.objectid import ObjectId
from bson.json_util import dumps
import os
from flask import send_file

class PathologyReport(Resource):
	def __init__(self):
		pass

	def get(self, filename):
		"""
        Get pathology report
        ---
        tags:
          - Pathology Report
        produces:
          - application/pdf
        parameters:
          - in: path
            name: filename
            description: Full path to pathology report PDF file
            type: string
        responses:
          200:
            description: Returns the pathology report PDF file
          404:
          	description: Invalid path
        """

		filename = "/" + filename
		if os.path.exists(filename):
				return send_file(filename)
		else:
			return Response("", status=404)