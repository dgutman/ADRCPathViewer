from flask_restful import Resource
from utils.config import get_app_configurations
from utils.cache import cache

class DeepZoom(Resource):
    def __init__(self):
        self.config = get_app_configurations()

    @cache.cached()	
    def get(self, path):
        return {'endpoint': 'return deep zoom image ' + path}
