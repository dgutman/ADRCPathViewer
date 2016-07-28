from flask_restful import Resource

class SlideSet(Resource):
    def __init__(self):
        pass

    def get(self, id):
        return {'endpoint': 'return list of slides for the provided slideset id ' + id}

