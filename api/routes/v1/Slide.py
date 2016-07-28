from flask_restful import Resource

class Slide(Resource):
    def __init__(self):
        pass

    def put(self, id):
        return {'endpoint': 'update slide info (bad image, label, etc.)'}

