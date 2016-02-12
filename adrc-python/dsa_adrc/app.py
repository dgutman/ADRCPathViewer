from flask import Flask, request, redirect, url_for, send_from_directory,jsonify,make_response
from werkzeug.wsgi import DispatcherMiddleware


from bson.json_util import dumps
from flask_crossdomains import crossdomain
import gridfs

#http://stackoverflow.com/questions/18281433/flask-handling-a-pdf-as-its-own-page

import pymongo
client = pymongo.MongoClient('localhost',27017)
slide_db_ptr = client['ADRC_Slide_DB']
load_errors_db = client['ADRC_LoadErrors']

app = Flask('dsa_adrc')


#application = DispatcherMiddleware( { '/backend': backend })

@app.route('/')
def root():
    return app.send_static_file('index.html')

## adding decorators to allow cross origin access
@app.route('/api/v1/collections')
@crossdomain(origin='*')
def get_collections():
    coll_list = slide_db_ptr.collection_names(False)
    return jsonify( { 'Collections': sorted(coll_list) })

@app.route('/api/v1/collections/slides/<string:coll_name>')
@crossdomain(origin='*')
def get_slides( coll_name):
    """This will return the list of slides for a given collection aka tumor type """
    #return jsonify( {'slide_list':dsa_combined_db['KIRP'].find_one() })
    #return dumps( {'slide_list': dsa_combined_db['KIRP'].find().limit(25) })
    return dumps( {'slide_list': dsa_combined_db[coll_name.upper()].find() })


##This will process and store files that were marked as bad...
@app.route('/api/v1/report_bad_image', methods=["POST"])
def report_bad_images():
    filename=request.form['filename']
    slide_url = request.form['slide_url']
    data_group = request.form['data_group']
    load_errors_db['cdsa_live'].insert({ 'filename':filename, 'slide_url':slide_url, 'data_group':data_group})
    return 'OK'

@app.route('/api/v1/path_reports')
def get_pdf_reports():
    patientId = 'TCGA-OR-A5J1'
    matched_files = client['TCGA']['tcgaTarExtractFileList'].find_one( {'patientId': patientId})    
    ### Eventually I should parse out the logic and see if there's more than one
    #gridfs_fileId = matched_files['fileId']
    
    pdf_fp = pdfGridFs.get( matched_files['fileId'])
#    def get_pdf(id=None):
#    if id is not None:
#    binary_pdf = get_binary_pdf_data_from_database(id=id)
    binary_pdf = pdf_fp
    response = make_response(binary_pdf.read())
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = \
        'inline; filename=%s.pdf' % 'samplegutman.pdf'
    return response


@app.route('/api/v1/path_reports/<string:patientId>')
def get_patient_pdf_report(patientId):
    matched_files = client['TCGA']['tcgaTarExtractFileList'].find_one( {'patientId': patientId})    
    ### Eventually I should parse out the logic and see if there's more than one
    #gridfs_fileId = matched_files['fileId']
    
    pdf_filename = matched_files['filename']
    pdf_fp = pdfGridFs.get( matched_files['fileId'])
#    def get_pdf(id=None):
#    if id is not None:
#    binary_pdf = get_binary_pdf_data_from_database(id=id)
    binary_pdf = pdf_fp
    response = make_response(binary_pdf.read())
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = \
        'inline; filename=%s.pdf' % pdf_filename
    return response


@app.route('/api/v1/clin_datasources/<string:tumor_type>')
def get_clin_data_sources(tumor_type):
    #matched_files = client['TCGA']['tcgaTarExtractFileList'].find_one( {'patientId': patientId})    
    ### Eventually I should parse out the logic and see if there's more than one
    #gridfs_fileId = matched_files['fileId']
    
    avail_coll_for_tt = [ x for x in biotab_db.collection_names(False) if tumor_type in x]
    #print avail_coll_for_tt
    filtered_data_sources = [ x for x in avail_coll_for_tt if 'analyte' not in x] 
    ### As a secondary check, I am going to see if the bcr_patient_barcode is in the file
    filtered_data_sources = []
    for ac in avail_coll_for_tt:
        pt_key_status = biotab_db[ac].find_one( {'bcr_patient_barcode': {'$exists': True}}  ) 
        if pt_key_status:
           filtered_data_sources.append(ac)
    
  
    return jsonify ( {'Clin_Data_Sources': avail_coll_for_tt,  'Filtered_Source_List': filtered_data_sources })



@app.route('/api/v1/clin_datasources/<string:csv_datasrc>/<string:pid>')
def get_pt_data_for_data_sources(csv_datasrc,pid):
    """Given a data source file and a patient id returns the erlevant data as key value pairs"""
    cur_pt_data = {}
    #cur_pt_data[csv_datasrc] = {}
    ### There are sample barcodes and patient barcodes... may need to separate these in the database

    dbp =  biotab_db[csv_datasrc].find_one({'bcr_patient_barcode': pid})
    #dbp =  biotab_db[csv_datasrc].find_one({'bcr_sample_barcode': pid})
    if dbp:
        dbp_keyval_pairs = []
        for k,v in dbp.iteritems():
            dbp_keyval_pairs.append([k,v])
    else:
        dbp_keyval_pairs = [] 

    #cur_pt_data[csv_datasrc] = dbp_keyval_pairs;

    #return jsonify ( {'data':  cur_pt_data })
    return dumps( {'data': dbp_keyval_pairs } )



@app.route('/static/<path:path>')
def static_proxy(path):
  # send_static_file will guess the correct MIME type
  return app.send_static_file(os.path.join('.', path))



@app.route('/<path:path>')
def static_file(path):
    return app.send_static_file(path)
