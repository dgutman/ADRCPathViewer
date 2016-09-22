import os,openslide
import sys
from openslide.lowlevel import OpenSlideError
import glob
from os.path import join as oj


def LoadFeatureFileData( groupName, base_file_path, loadStatsCollection, debug=False):
    """This loads the feature files into a database... does not load the data IN Them however...
    i.e. it just indexes the *.seg.txt files """
    files_processed = newly_loaded = total_files = 0
    
    feature_file_list = glob.glob( oj(base_file_path,groupName,'TCGA-*.seg*.txt'))
    print "Analyzing ",groupName
    if debug:
        print "Processing %s which has %d files" % ( groupName, len(feature_file_list))
        
    for ff in feature_file_list:
        LinePrinter( "Processed %d files out of %d total files, and %d just now" % ( files_processed,total_files,newly_loaded ))
        FFI = {}  ###Feature File Info
        FFI['filename'] = ff
        fileLoaded = loadStatsCollection.find_one( {'filename':ff})
        if not fileLoaded:
            FFI['LoadedToMongo'] = False
            FFI['slideGroup'] = groupName
            FFI['full_feature_filename'] = os.path.basename(ff)
            FFI['slide_name_detail'] = os.path.basename(ff).split('.seg.')[0]
            FFI['slide_name'] = os.path.basename(ff).split('.')[0]
            FFI['MongoCollName'] = None

            FFI['tot_features'] = file_len(ff)  ## TYhis is an expensive operation so just do it in here
            loadStatsCollection.insert_one(FFI)
            newly_loaded +=1
        files_processed +=1
        
class LinePrinter():
        """
        Print things to stdout on one line dynamically
        """
        def __init__(self,data):
                sys.stdout.write("\r\x1b[K"+data.__str__())
                sys.stdout.flush()

                
def file_len(fname):
    with open(fname) as f:
        for i, l in enumerate(f):
            pass
    return i + 1



def flatten_fileset( source_file_name, target_base_path, base_folder):
    """This will copy all of the files within a given base folder (like GBM/*) into a single top level folder using
    hard links"""
    flattened_target_dir = os.path.join(target_base_path, base_folder)

    ## First make sure flatte
    if not os.path.isdir(flattened_target_dir):
        os.makedirs(flattened_target_dir)
        
    src_base_filename = os.path.basename(source_file_name)
    flattened_trgt = os.path.join(target_base_path,base_folder,src_base_filename)
    
    if os.path.isfile(flattened_trgt):
        #print "ALREADY COPIED!"
        pass
    else:
        ### Need to make a hard link
        #print "Copying %s to %s" % ( source_file_name, flattened_trgt)
        os.link(source_file_name, flattened_trgt)
    
def find_rawslide_lists( slide_root_path ):
        """project_name is passed along with the potentially more than one root image path for ndpi files"""
        slide_files = []
        slide_root_path  = slide_root_path.rstrip('/')
        print slide_root_path
        for dpath, dnames, fnames in os.walk( slide_root_path, followlinks=True):
                
                for file in fnames:
                    if '.ndpi' in file or '.svs' in file:
                                slide_files.append(dpath +'/'+file)
        print len(slide_files),"SVS or NDPI files were located"
        return slide_files
    
    
def openslide_test_file(full_file_path,file_type='svs'):
        """This will use the openslide bindings to get the width, height and filesize for an \
        image or return an Error otherwise"""
        width=height=filesize=orig_resolution=slide_title=md5 = None
        ##TODO: Look into adding a file type which by looking at the extension?
        
        extension = os.path.splitext(full_file_path)[1]
        if extension not in ['.ndpi','.svs']:
            #Should just return gracefully?""
            print extension
            return( False, None, None, None, None, None, None, None)
            
        try:
                im = openslide.open_slide(full_file_path)
                (width, height) = im.dimensions
                base_file_name = os.path.basename(full_file_path)
                filesize = os.path.getsize(full_file_path)
                if(file_type== 'svs'):
                    try:
                        orig_resolution = im.properties['aperio.AppMag']
                    except:
                        orig_resolution = 'UnkSVSReadError'

                elif(file_type == 'ndpi'):
                        orig_resolution = 40

                #md5 = md5Checksum(full_file_path)
                md5 = None
                slide_name = os.path.basename(full_file_path)
                sld_properties = im.properties
                return(True,width,height,filesize,orig_resolution,slide_name,md5,sld_properties)
        except OpenSlideError, e:
                print "Openslide returned an error",full_file_path
                print >>sys.stderr, "Verify failed with:", repr(e.args)
                print "Openslide returned an error",full_file_path


class LinePrinter():
    """
    Print things to stdout on one line dynamically
    """
    def __init__(self,data):
        sys.stdout.write("\r\x1b[K"+data.__str__())
        sys.stdout.flush()

        

def clean_openslide_keys ( properties_dict ):
    """Openslide returns dictionaries that have . in the keys which mongo does not like,\
    I need to change this to _"""
    cleaned_dict = {}
    for k,v in properties_dict.iteritems():
        new_key = k.replace('.','_')
        cleaned_dict[new_key] = v
        
    return cleaned_dict
               