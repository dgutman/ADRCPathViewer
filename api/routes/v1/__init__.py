from flask_restful import Api
from flask_restful.utils import cors
from flask import Blueprint
from SlideSet import SlideSet
from DeepZoom import DeepZoom
from Thumbnail import Thumbnail
from Slide import Slide

# Create a blueprint for API v1
# It is prefixed with /v1
# Add CORS decorator for all endpoints
# Attach all endpoints to the v1 API
v1 = Blueprint('v1', __name__)
api = Api(v1, prefix="/v1")
api.decorators=[cors.crossdomain(origin='*')]
api.add_resource(SlideSet, "/slideset/<string:id>", endpoint="slideset")
api.add_resource(DeepZoom, "/deepzoom/<path:path>.dzi", endpoint="deepzoom")
api.add_resource(Thumbnail, "/thumbnail/<path:path>", endpoint="thumbnail")
api.add_resource(Slide, "/slide/<string:id>", endpoint="slide")