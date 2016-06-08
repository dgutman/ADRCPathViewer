#!/usr/bin/python
# Serve api routes to get feedback for bad slides

from flask import Blueprint, request
from utils.crossdomains import crossdomain
from utils.config import get_app_configurations as gac

from utils.db import connect

print "loadging slide feedback"


#get app configurations
config = gac()
slidefeedback = Blueprint('slidefeedback', __name__, static_folder = config['static_dir'])
sdb = None
edb = None


@slidefeedback.record
def record_params(setup_state):
    app = setup_state.app
    slidefeedback.config = app.config

@slidefeedback.before_app_first_request
def _setup():
    global edb
    edb = connect(slidefeedback.config)


##This will process and store files that were marked as bad...
@slidefeedback.route('/api/wbx/updateSlideInfo/<string:id>', methods=["POST","GET","PUT", "OPTIONS"])
@crossdomain(origin='*')
def report_bad_images(id):

    if request.form:
        print request.form
        print request.form.keys()
    if request:
        print request
    
    #print "You should be processing a bad image?",id
    #updateType = request.form['updateType']
    #print request.form
    #print request.method
    ###print request.form
    #filename=request.form['filename']
    #slide_url = request.form['slide_url']
    #data_group = request.form['data_group']
    #@print slide_url 
    #edb['bad_slides'].insert({ 'filename':filename, 'slide_url':slide_url, 'data_group':data_group})
    return 'OK'

