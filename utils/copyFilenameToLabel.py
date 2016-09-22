import pymongo, sys, os, re
from bson.objectid import ObjectId

DB_NAME = "UberSliderSorter"
DB_COLL = "RawSlideData"

client = pymongo.MongoClient('localhost',27017)
db = client[DB_NAME][DB_COLL]

slides = db.find()

for slide in slides:
	label = ""
	if "fileName" in slide:
		label = slide["fileName"]
		
	db.update_one({"_id": ObjectId(slide["_id"])}, {"$set": {"slideLabel": label}})
