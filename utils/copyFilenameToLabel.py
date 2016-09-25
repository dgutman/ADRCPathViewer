import pymongo, sys, os, re
from bson.objectid import ObjectId

DB_NAME = "masterSlideList"
DB_COLL = "RawSlideData"

client = pymongo.MongoClient('localhost',27017)
db = client[DB_NAME][DB_COLL]

slides = db.find()

for slide in slides:
	label = ""
	if "name" in slide:
		label = slide["name"]
		
	db.update_one({"_id": ObjectId(slide["_id"])}, {"$set": {"label": label}})
