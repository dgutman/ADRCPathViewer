from flask import request, url_for, jsonify, make_response, Blueprint, current_app as app
from bson.json_util import dumps
from utils.crossdomains import crossdomain
from utils.deepzoom import _get_slide, _SlideCache
import pymongo, os, gridfs
from utils.db import connect

ADRC_Routes = Blueprint('ADRC_Routes', __name__, static_folder='../dsa_adrc/static/')

@ADRC_Routes.route('/')
def static_proxy():
  # send_static_file will guess the correct MIME type
  print "tring a static route??"
  #print os.path.join('../dsa_adrc/static/', path)
  return ADRC_Routes.send_static_file('index.html')




