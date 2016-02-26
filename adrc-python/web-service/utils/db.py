import pymongo

def connect(config):
	client = pymongo.MongoClient(config['db_host'], int(config['db_port']))
	db = client[config['slidedb']]
	err = client['ADRC_LoadErrors']
	return db, err
