from flask_restful import Resource

class SlideSet(Resource):
    def __init__(self):
        pass

    def get(self, id):
        return {'What to do': 'return list of slides for this id'}

