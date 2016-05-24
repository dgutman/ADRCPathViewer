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

@slides.route('/api/v2/slideSet')
@crossdomain(origin='*')
def get_collections():
    coll_list = sdb[slides.config["slides_collection"]].distinct('slideGroup')
    return jsonify( { 'Collections': sorted(coll_list) })

@slides.route('/api/wbx/slideSet')
@crossdomain(origin='*')
def get_wbx_collections():
    slideGroupList = sdb[slides.config["slides_collection"]].distinct('slideGroup')
    ### May want to add in some additional filters here.... i.e. don't return empty slidegroups??
    ### FOR NOW MUST REMEMBER DISTINCT RETURNS A SLIDE GROUP!!!

    sgl = []
    
    for sg,idx in enumerate(slideGroupList):
        print sg,idx
        sgl_info = {}
        sgl_info['name'] = sg
        sgl_info['id'] = idx
        sgl.append(sgl_info)
    return dumps(sgl)

@slides.route('/api/v2/slideSet/<string:id>')
@crossdomain(origin='*')
def get_slides( id):
    """This will return the list of slides for a given collection aka slideSet aka tumor type  aka patientID"""
    return dumps( {'slide_list': sdb[slides.config["slides_collection"]].find({'slideGroup':id})} ) 


@slides.route('/api/wbx/slideSet/<string:slideGroupId>')
@crossdomain(origin='*')
def wbx_get_slides( slideGroupId):
    """This will return the list of slides for a given collection aka slideSet aka tumor type  aka patientID"""
    curSlideGroup = sdb[slides.config["slides_collection"]].find({'slideGroup':slideGroupId})
    ### Need to iterate througuh the current slide group and turn it into the proper format for WEBIX
    slideList = []
    slideCount = 0;
    for cs in curSlideGroup:
        ### Need to insert an id field for wbx, I am going to use the _id field
#        cs['id'] = str(cs['_id'])  ## This is still going to make this an objectID object..
        csd = {}
        slideCount+=1;
        csd['id'] =slideCount
        csd['slide_name'] = cs['slide_name']
        csd['thumbnail_image'] = cs['thumbnail_image']
        slideList.append(cs)
    return dumps(slideList)



##This will process and store files that were marked as bad...
@slides.route('/api/v1/slides/<string:id>/report', methods=["POST"])
def report_bad_images():
    filename=request.form['filename']
    slide_url = request.form['slide_url']
    data_group = request.form['data_group']
    edb['cdsa_live'].insert({ 'filename':filename, 'slide_url':slide_url, 'data_group':data_group})
    return 'OK'
