from flask_restful import Resource 
from utils.config import get_app_configurations

class SlideSet(Resource):
	def __init__(self):
		self.config = get_app_configurations()

	def get(self, id):
		return {'endpoint': 'return list of slides for the provided slideset id ' + id}

