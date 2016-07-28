from flask_restful import Resource

class DeepZoom(Resource):
    def __init__(self):
        pass

    def get(self, path):
        return {'endpoint': 'return deep zoom image ' + path}
