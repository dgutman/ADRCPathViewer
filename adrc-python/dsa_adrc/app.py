from flask import Flask, request, redirect, url_for, send_from_directory,jsonify,make_response
from werkzeug.wsgi import DispatcherMiddleware


from bson.json_util import dumps
from flask_crossdomains import crossdomain
import gridfs

#http://stackoverflow.com/questions/18281433/flask-handling-a-pdf-as-its-own-page

import pymongo
client = pymongo.MongoClient('localhost',27017)
slide_db_ptr = client['ADRC_DSA_Slide_DB']
load_errors_db = client['ADRC_LoadErrors']

app = Flask('dsa_adrc')
dsa_slide_db = client['ADRC_DSA_Slide_DB']
#app.config['SLIDE_DIR'] = '/mnt/GAUSS_SCRATCH/NDPI_VAULT/ADRC'
app.config['SLIDE_DIR'] = '/GLOBAL_SCRATCH/ADRC'

from collections import OrderedDict
from flask import Flask, abort, make_response, render_template, url_for
from io import BytesIO
import openslide
from openslide import OpenSlide, OpenSlideError
from openslide.deepzoom import DeepZoomGenerator
import os
from optparse import OptionParser
from threading import Lock


SLIDE_DIR = '.'
SLIDE_CACHE_SIZE = 100
DEEPZOOM_FORMAT = 'jpeg'
DEEPZOOM_TILE_SIZE = 256
DEEPZOOM_OVERLAP = 1
DEEPZOOM_LIMIT_BOUNDS = True
DEEPZOOM_TILE_QUALITY = 75


#application = DispatcherMiddleware( { '/backend': backend })

@app.route('/')
def root():
    return app.send_static_file('index.html')

## adding decorators to allow cross origin access
@app.route('/api/v1/collections')
@crossdomain(origin='*')
def get_collections():
    coll_list = dsa_slide_db['DSA_Slide_Data'].distinct('pt_id')
    return jsonify( { 'Collections': sorted(coll_list) })

@app.route('/api/v1/collections/slides/<string:coll_name>')
@crossdomain(origin='*')
def get_slides( coll_name):
    """This will return the list of slides for a given collection aka tumor type """
    #return jsonify( {'slide_list':dsa_combined_db['KIRP'].find_one() })
    #return dumps( {'slide_list': dsa_combined_db['KIRP'].find().limit(25) })
    return dumps( {'slide_list': dsa_slide_db['DSA_Slide_Data'].find({'pt_id': coll_name }) })


##This will process and store files that were marked as bad...
@app.route('/api/v1/report_bad_image', methods=["POST"])
def report_bad_images():
    filename=request.form['filename']
    slide_url = request.form['slide_url']
    data_group = request.form['data_group']
    load_errors_db['cdsa_live'].insert({ 'filename':filename, 'slide_url':slide_url, 'data_group':data_group})
    return 'OK'



@app.route('/static/<path:path>')
def static_proxy(path):
  # send_static_file will guess the correct MIME type
  return app.send_static_file(os.path.join('.', path))

@app.route('/<path:path>')
def static_file(path):
    return app.send_static_file(path)


@app.route('/thumbnail/<path:path>')
@crossdomain(origin='*')
def getThumbnail(path):
    """This will return the 0/0 tile later whch in the case of an SVS image is actually the thumbnail..... """
    print "Looking in ",path,'for thumbnail.... which sould be expanded  I hope'

    slide = _get_slide(path)
    format = 'jpeg'
    level=0
    col=0
    row=0 
    ## I believe this is the defaults for level 0.
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

@app.route('/DZIMS/<path:path>.dzi')
@crossdomain(origin='*')
def dzi(path):
    slide = _get_slide(path)
    format = 'jpeg'
#    format = app.config['DEEPZOOM_FORMAT']
    resp = make_response(slide.get_dzi(format))
    resp.mimetype = 'application/xml'
    return resp


@app.route('/DZIMS/<path:path>_files/<int:level>/<int:col>_<int:row>.<format>')
def tile(path, level, col, row, format):
    slide = _get_slide(path)
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



class PILBytesIO(BytesIO):
    def fileno(self):
        '''Classic PIL doesn't understand io.UnsupportedOperation.'''
        raise AttributeError('Not supported')


class _SlideCache(object):
    def __init__(self, cache_size, dz_opts):
        self.cache_size = cache_size
        self.dz_opts = dz_opts
        self._lock = Lock()
        self._cache = OrderedDict()

    def get(self, path):
        with self._lock:
            if path in self._cache:
                # Move to end of LRU
                slide = self._cache.pop(path)
                self._cache[path] = slide
                return slide

        osr = OpenSlide(path)
        slide = DeepZoomGenerator(osr, **self.dz_opts)
        try:
            mpp_x = osr.properties[openslide.PROPERTY_NAME_MPP_X]
            mpp_y = osr.properties[openslide.PROPERTY_NAME_MPP_Y]
            slide.mpp = (float(mpp_x) + float(mpp_y)) / 2
        except (KeyError, ValueError):
            slide.mpp = 0

        with self._lock:
            if path not in self._cache:
                if len(self._cache) == self.cache_size:
                    self._cache.popitem(last=False)
                self._cache[path] = slide
        return slide

class _SlideFile(object):
    def __init__(self, relpath):
        self.name = os.path.basename(relpath)
        self.url_path = relpath


@app.before_first_request
def _setup():
    #app.basedir = os.path.abspath(app.config['SLIDE_DIR'])
    #app.basedir = '/mnt/GAUSS_SCRATCH/NDPI_VAULT/ADRC'
    app.basedir = app.config['SLIDE_DIR']
    config_map = {
        'DEEPZOOM_TILE_SIZE': 'tile_size',
        'DEEPZOOM_OVERLAP': 'overlap',
        'DEEPZOOM_LIMIT_BOUNDS': 'limit_bounds',
    }
    opts = {
	'tile_size': 256,
	'overlap': 1,
	'limit_bounds': 0 
	}

	#dict((v, app.config[k]) for k, v in config_map.items())

    app.config['SLIDE_CACHE_SIZE']  = 1000
    app.cache = _SlideCache(app.config['SLIDE_CACHE_SIZE'], opts)

def _get_slide(path):
    path = os.path.abspath(os.path.join(app.basedir, path))
    print path,"Is where I am looking";

    if not path.startswith(app.basedir + os.path.sep):
        # Directory traversal
        print os.path.sep,"is the separator??",app.basedir
        print "failing at the first part..."
        abort(404)
    if not os.path.exists(path):
        print "failing at the second part"

        abort(404)
    try:
        slide = app.cache.get(path)
        slide.filename = os.path.basename(path)
        return slide
    except OpenSlideError:
        abort(404)

