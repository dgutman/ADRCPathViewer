"""This route allows the macro and overview image to be returned"""

from flask import request, url_for, jsonify, make_response, Blueprint, current_app as app
from bson.json_util import dumps
from utils.crossdomains import crossdomain
from openslide import OpenSlide
import os

from cache import cache

from utils.deepzoom import PILBytesIO

# from utils.db import connect
# from utils.deepzoom import PILBytesIO

labelmacro = Blueprint('labelmacro', __name__)

@labelmacro.record
def record_params(setup_state):
    """
    Apply the main app configurations to the blueprint
    """
    app = setup_state.app
    labelmacro.config = app.config


##TODO:  Allow me to specify the thumnail size


@labelmacro.route('/macroImage/<path:path>')
@crossdomain(origin='*')
@cache.cached()
def getMacroImage(path):
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




@labelmacro.route('/labelImage/<path:path>')
@crossdomain(origin='*')
@cache.cached()
def getLabelImage(path):
    """This will return the 0/0 tile later whch in the case of an SVS image is actually the thumbnail..... """
    path = os.path.abspath(os.path.join(labelmacro.config['slides_dir'], path))
    osr = OpenSlide(path)
    format = 'jpeg'

    print osr.associated_images.keys()
    print "Found keys"
    ### NEED TO CREATE A SMALLER DEFAULT IMAGE SIZE
    ThumbWidth = (250,250)

    if u'label' in osr.associated_images.keys():
        curLabelImage= osr.associated_images['label']
      
        curLabelImage.thumbnail( ThumbWidth )  ##inpalce operation
 
        buf = PILBytesIO()
        curLabelImage.save(buf, format, quality=90)
        resp = make_response(buf.getvalue())
        resp.mimetype = 'image/%s' % format
        return resp
    elif 'macro' in osr.associated_images.keys():
        curLabelImage= osr.associated_images['macro']
        buf = PILBytesIO()

        curLabelImage.thumbnail( ThumbWidth )  ##inpalce operation

        curLabelImage.save(buf, format, quality=90)
        resp = make_response(buf.getvalue())
        resp.mimetype = 'image/%s' % format
        return resp
    else:
        abort(404)
