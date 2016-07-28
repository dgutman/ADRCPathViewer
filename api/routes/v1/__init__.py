from SlideSet import SlideSet
from flask_restful import Api
from flask import Blueprint

v1 = Blueprint('v1', __name__)
api = Api(v1, prefix="/v1")
api.add_resource(SlideSet, "/slideset/<string:id>")