from openslide import OpenSlide, OpenSlideError
from flask_restful import Resource
from bson.objectid import ObjectId
from flask import Response, request
from PIL import Image
import os, gridfs, cStringIO
from bson.json_util import dumps

class Thumbnail(Resource):
	def __init__(self, db, config):
		"""initialize Thumbnail resource

		Args:
			db: mongo db connection
			config: application configurations
			opt: deep zoom configurations

		Returns:
			None
		"""
		self.db = db
		self.config = config
		self.slides = self.db[self.config["db_collection"]] 
		self.gfs = gridfs.GridFS(db)		

	def get(self, id):
		"""Get slide thumbnail

		Args:
			id: slide ID which is the mongo ObjectId

		Returns:
			200 response if the thumbnail cerated and returned
			400 response if the thumbnail failed to load
		"""

		thumbSize = request.args.get('size', "small")
		image = self.slides.find_one({'_id': ObjectId(id)})
		path = image["slidePath"]
		filename = os.path.splitext(os.path.basename(path))[0] + "." + thumbSize + ".jpg"

		if not self.gfs.exists(filename=filename):
			width = image["scanProperties"]["openslide_level[0]_width"]
			height = image["scanProperties"]["openslide_level[0]_height"]
			thumbHeight = float(self.config["thumb_" + thumbSize + "_height"])
			thumbWidth = int(round(thumbHeight/float(height) * int(width)))

			try:
				osr = OpenSlide(path)
				thumb = osr.get_thumbnail((thumbWidth,thumbHeight))
			except OpenSlideError, e:
				resp = {"status": 404, "message": "OpenSlideError: Thumbnail failed to load"}
				return Response(dumps(resp), status=404, mimetype='application/json')
			except ValueError:
				resp = {"status": 404, "message": "Thumbnail failed to load"}
				return Response(dumps(resp), status=404, mimetype='application/json')
			except:
				resp = {"status": 404, "message": "Thumbnail failed to load"}
				return Response(dumps(resp), status=404, mimetype='application/json')

			buf = cStringIO.StringIO()
			thumb.save(buf, 'jpeg', quality=90)
			self.gfs.put(buf.getvalue(), contentType="image/jpeg", filename=filename)
			return Response(buf.getvalue(), status=200, mimetype='image/jpeg')
		else:
			im = Image.open(self.gfs.get_last_version(filename))
			buf = cStringIO.StringIO() 
			im.save(buf, 'jpeg', quality=90)
			return Response(buf.getvalue(), status=200, mimetype='image/jpeg')