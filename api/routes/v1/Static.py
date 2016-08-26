from flask import send_from_directory
from flask_restful import Resource

class Static(Resource):
	def __init__(self, config):
		"""initialize Slide resource

		Args:
			config: application configurations

		Returns:
			None
		"""
		self.config = config

	def get(self, path):
		"""Get path

		Fetch a static HTML/JS/CSS files

		Args:
			path: path to static ID

		Returns:
			static file
		"""
		return send_from_directory(self.config["static_dir"], path)
