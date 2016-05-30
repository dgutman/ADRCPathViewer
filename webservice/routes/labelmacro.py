"""This route allows the macro and overview image to be returned"""

from flask import request, url_for, jsonify, make_response, Blueprint, current_app as app
from bson.json_util import dumps
from utils.crossdomains import crossdomain
from openslide import OpenSlide

from cache import cache



# from utils.db import connect
# from utils.deepzoom import PILBytesIO


labelmacro = Blueprint('labelmacro', __name__)


@slides.route('/api/v2/label')
@crossdomain(origin='*')
def get_slidelabel():


@labelmacro.record
def record_params(setup_state):
    """
    Apply the main app configurations to the blueprint
    """
    app = setup_state.app
    labelmacro.config = app.config


##TODO:  Allow me to specify the thumnail size


@labelmacro.route('/labelImage/<path:path>')
@crossdomain(origin='*')
@cache.cached()
def labelImage(path):
    """
    Service while slide images using openslide
    images are encolded in XML format
    """
    slide = _get_slide(labelmacro.config['slides_dir'], path)
    resp = make_response(slide.get_dzi(dz.config['deepzoom_format']))
    resp.mimetype = 'application/xml'
    return resp


@dz.route('/macroImage/<path:path>')
@crossdomain(origin='*')
@cache.cached()
def getMacroImage(path):
    """This will return the 0/0 tile later whch in the case of an SVS image is actually the thumbnail..... """

    path = os.path.abspath(os.path.join(labelmacro.config['slides_dir'], path))
    osr = OpenSlide(path)
    format = 'jpeg'

    format = format.lower()
    if format != 'jpeg' and format != 'png':
        # Not supported by Deep Zoom
        abort(404)
    try:
        thumb = osr.get_thumbnail( (300,300))
    except ValueError:
        # Invalid level or coordinates
        abort(404)

    buf = PILBytesIO()
    thumb.save(buf, 'jpeg', quality=90)
    resp = make_response(buf.getvalue())
    resp.mimetype = 'image/%s' % format
    return resp

