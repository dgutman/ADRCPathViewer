import pymongo

def connect(config):
	client = pymongo.MongoClient('localhost',27017)
	db = client['ADRC_Slide_DB']
	err = client['ADRC_LoadErrors']
	return db, err
