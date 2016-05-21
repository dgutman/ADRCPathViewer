from flask import request, url_for, jsonify, make_response, Blueprint, current_app as app
from bson.json_util import dumps
from utils.crossdomains import crossdomain
from utils.deepzoom import _get_slide, _SlideCache
import pymongo, os, gridfs
from utils.db import connect

slides = Blueprint('slides', __name__)
sdb = None
edb = None

@slides.record
def record_params(setup_state):
    app = setup_state.app
    slides.config = app.config

@slides.before_app_first_request
def _setup():
    global sdb
    global edb
    sdb, edb = connect(slides.config)

@slides.route('/api/v1/slides')
@crossdomain(origin='*')
def get_collections():
    coll_list = sdb[slides.config["slides_collection"]].distinct('pt_id')
    return jsonify( { 'Collections': sorted(coll_list) })

@slides.route('/api/v1/slides/<string:id>')
@crossdomain(origin='*')
def get_slides( id):
    """This will return the list of slides for a given collection aka tumor type """
    return dumps( {'slide_list': sdb[slides.config["slides_collection"]].find({'pt_id':id})} ) 

##This will process and store files that were marked as bad...
@slides.route('/api/v1/slides/<string:id>/report', methods=["POST"])
def report_bad_images():
    filename=request.form['filename']
    slide_url = request.form['slide_url']
    data_group = request.form['data_group']
    edb['cdsa_live'].insert({ 'filename':filename, 'slide_url':slide_url, 'data_group':data_group})
    return 'OK'
