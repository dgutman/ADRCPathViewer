from flask_restful import Resource
from flask import Response
from bson.objectid import ObjectId
from utils.deepzoom import get_slide, PILBytesIO

class Tile(Resource):
	def __init__(self, db, config):
		"""initialize DeepZoom resource

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

	def get(self, id, x, y):
		"""
        Get slide tile
        This endpoint has a bug. For now, please append the tile level to the slide Id
        ---
        tags:
          - Tile
        parameters:
          - in: path
            name: id
            description: MonogDB ObjectId appended to it the level -- Example 57bf3c092f9b2e1595b29730
            type: string
          - in: path
            name: x
            description: The column
            type: integer
          - in: path
            name: y
            description: The row
            type: integer
        responses:
          200:
            description: Returns the slide information
          404:
          	description: Invalid slide Id or slide not found
        """

		image = self.slides.find_one({'_id': ObjectId(id[0:24])})
		path = image["slidePath"]
		level = int(id[24:])
		slide = get_slide(path)
		
		try:
			tile = slide.get_tile(level, (x, y))
			buf = PILBytesIO()
			tile.save(buf, 'jpeg', quality=90)
			return Response(buf.getvalue(), status=200, mimetype='image/jpeg')
		except ValueError:
			Response(None, status=404)