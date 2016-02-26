from flask import request, url_for, jsonify, make_response, Blueprint, current_app as app
from bson.json_util import dumps
from utils.crossdomains import crossdomain
from utils.deepzoom import _get_slide, _SlideCache
import pymongo, os, gridfs
from utils.db import connect

ADRC_Routes = Blueprint('ADRC_Routes', __name__)



@ADRC_Routes.route('/static/<path:path>')
def static_proxy(path):
  # send_static_file will guess the correct MIME type
  print "tring a static route??"
  return app.send_static_file(os.path.join('../../dsa_adrc/static/', path))

@ADRC_Routes.route('/<path:path>')
def static_file(path):
    print "Should be looking for inde.html???"
    return app.send_static_file('../../dsa_adrc/static/'+index.html)


