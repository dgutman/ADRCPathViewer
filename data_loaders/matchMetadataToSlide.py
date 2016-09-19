import pymongo, sys, os, re, csv
from bson.objectid import ObjectId

DB_NAME = "UberSliderSorter"
DB_COLL = "RawSlideData"
filename = "/home/mkhali8/downloads/TPS_Slide_Scanning_20160919.csv"

client = pymongo.MongoClient('localhost',27017)
db = client[DB_NAME][DB_COLL]
p = re.compile('^(\d+)_.*\.pdf$', re.IGNORECASE)

with open(filename, "r") as fh:
	records = csv.reader(fh)
	keys = records.next()
	
	for record in records:
		searchTerm = "EUH_" + record[2]
		slide = db.find_one({"fileName": {"$regex": searchTerm}, "slideSet": "WINSHIP_BIOBANK_SEPT16"})
		metadata = []

		if slide:
			for i in range(1,12):
				metadata.append({"key": keys[i], "value": record[i]})
			
			db.update_one({"_id": slide["_id"]}, {"$set": {"clinicalMetaData": metadata}})