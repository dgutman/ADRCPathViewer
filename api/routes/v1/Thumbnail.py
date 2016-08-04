from openslide import OpenSlide
from flask_restful import Resource
from utils.config import get_app_configurations
from utils.db import connect
from utils.deepzoom import PILBytesIO

class Thumbnail(Resource):
	def __init__(self):
		self.config = get_app_configurations()
		self.db = connect(self.config)
		self.slides = self.db[self.config["db_collection"]]

	def get(self, path):
		image = self.slides.find_one({'_id': ObjectId(id)})
		path = os.path.join(image["group"], image["filename"])
		path = os.path.abspath(os.path.join(self.config['slides_dir'], path))
		osr = OpenSlide(path)
		format = 'jpeg'

		format = format.lower()
		if format != 'jpeg' and format != 'png':
			abort(404)
		try:
			thumb = osr.get_thumbnail( (300,300))
		except ValueError:
			abort(404)

		buf = PILBytesIO()
		thumb.save(buf, 'jpeg', quality=90)
		resp = make_response(buf.getvalue())
		resp.mimetype = 'image/%s' % format
		return resp
