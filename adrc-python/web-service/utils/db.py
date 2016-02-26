import pymongo

def connect(config):
	client = pymongo.MongoClient(config['db_host'], int(config['db_port']))
	db = client['ADRC_Slide_DB']
	err = client['ADRC_LoadErrors']
	return db, err
