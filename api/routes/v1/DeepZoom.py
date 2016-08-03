from flask_restful import Resource
from flask import make_response
from utils.config import get_app_configurations
from utils.cache import cache
from utils.deepzoom import _get_slide, _SlideCache

class DeepZoom(Resource):
    def __init__(self):
        self.config = get_app_configurations()

    @cache.cached()	
    def get(self, id):
    	image = self.slides.find_one({'_id': ObjectId(id)})
    	path = image["group"] + "/" + image["filename"]
		slide = _get_slide(self.config['slides_dir'], path)
		resp = make_response(slide.get_dzi(self.config['deepzoom_format']))
		resp.mimetype = 'application/xml'
		return resp