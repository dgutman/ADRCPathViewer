from flask_restful import Api
from flask import Blueprint
from SlideSet import SlideSet
from DeepZoom import DeepZoom
from Thumbnail import Thumbnail
from Slide import Slide

v1 = Blueprint('v1', __name__)
api = Api(v1, prefix="/v1")
api.add_resource(SlideSet, "/slideset/<string:id>")
api.add_resource(DeepZoom, "/deepzoom/<path:path>.dzi")
api.add_resource(Thumbnail, "/thumbnail/<path:path>")
api.add_resource(Slide, "/slide/<string:id>")