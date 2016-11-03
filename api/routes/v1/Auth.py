from openslide import OpenSlide
from flask_restful import Resource
from bson.objectid import ObjectId
from flask import Response, request, session
from PIL import Image
import os, gridfs, cStringIO
from utils.deepzoom import PILBytesIO
from bson.json_util import dumps
from utils.auth import requires_auth

class Auth(Resource):
	def __init__(self, config):
		"""initialize Thumbnail resource

		Args:
			db: mongo db connection
			config: application configurations
			opt: deep zoom configurations

		Returns:
			None
		"""	

		self.config = config

	def post(self):
		"""
        Get slide label image
        ---
        tags:
          - Label Image
        parameters:
          - in: path
            name: id
            description: MonogDB ObjectId -- Example 57bf3c092f9b2e1595b29730
            type: string
        responses:
          200:
            description: Returns the slide label image
          404:
          	description: Invalid slide Id or label image not found
        """

		user = request.get_json(force=True)

		if session.get("auth"):
			resp = {"status": 200, "message": "success"}
			return Response(dumps(resp), status=200, mimetype='application/json')
		else:
			with open(self.config["credentials"], "r") as fh:
				u, p = fh.readline().rstrip().split(",")

				if user["username"] == u and user["password"] == p:
					session["auth"] = True
					resp = {"status": 200, "message": "success"}
					return Response(dumps(resp), status=200, mimetype='application/json')

		resp = {"status": 400, "message": "failure"}
		return Response(dumps(resp), status=400, mimetype='application/json')