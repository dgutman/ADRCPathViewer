import pymongo, sys, os, re
from bson.objectid import ObjectId

DB_NAME = "UberSliderSorter"
DB_COLL = "RawSlideData"

client = pymongo.MongoClient('localhost',27017)
db = client[DB_NAME][DB_COLL]

slides = db.find({}, {"scanProperties": False})

for slide in slides:
	slideId = slide["_id"]
	facets = {"aperioAnnotations": False, "pathologyReports": False}

	if "aperioAnnotations" in slide:
		facets["aperioAnnotations"] = True
	if "pathologyReports" in slide:
		facets["pathologyReports"] = True

	db.update_one({"_id": slideId}, {"$set": {"facets": facets}})
