from flask_restful import Resource
from utils.config import get_app_configurations

class Slide(Resource):
    def __init__(self):
        self.config = get_app_configurations()

    def put(self, id):
        return {'endpoint': 'update slide info (bad image, label, etc.)'}

