from flask_restful import Resource
from utils.config import get_app_configurations

class Thumbnail(Resource):
    def __init__(self):
        self.config = get_app_configurations()

    def get(self, path):
        return {'endpoint': 'return deep zoom image ' + path}
