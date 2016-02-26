from flask import request, url_for, jsonify, make_response, Blueprint, current_app as app
from bson.json_util import dumps
from utils.crossdomains import crossdomain
from utils.deepzoom import _get_slide, _SlideCache
import pymongo, os, gridfs
from utils.db import connect

dz = Blueprint('deepzoom', __name__)

@dz.record
def record_params(setup_state):
    app = setup_state.app
    dz.config = app.config

@dz.before_app_first_request
def _setup():
    opts = {
       'tile_size': int(dz.config['tile_size']),
       'overlap': int(dz.config['overlap']),
       'limit_bounds': int(dz.config['limit_bounds'])
    }

    app.cache = _SlideCache(dz.config['slide_cache_size'], opts)

@dz.route('/DZIMS/<path:path>.dzi')
@crossdomain(origin='*')
def dzi(path):
    slide = _get_slide(dz.config['slides_dir'], path)
    resp = make_response(slide.get_dzi(dz.config['deepzoom_format']))
    resp.mimetype = 'application/xml'
    return resp

@dz.route('/DZIMS/<path:path>_files/<int:level>/<int:col>_<int:row>.<format>')
def tile(path, level, col, row, format):
    slide = _get_slide(dz.config['slides_dir'], path)
    format = format.lower()
    if format != 'jpeg' and format != 'png':
        # Not supported by Deep Zoom
        abort(404)
    try:
        tile = slide.get_tile(level, (col, row))
    except ValueError:
        # Invalid level or coordinates
        abort(404)
    buf = PILBytesIO()
 

#   tile.save(buf, format, quality=app.config['DEEPZOOM_TILE_QUALITY'])
    tile.save(buf, 'jpeg', quality=90)
    resp = make_response(buf.getvalue())
    resp.mimetype = 'image/%s' % format
    return resp
