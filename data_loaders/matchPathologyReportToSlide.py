import pymongo, sys, os, re
from bson.objectid import ObjectId

DB_NAME = "UberSliderSorter"
DB_COLL = "RawSlideData"
PDF_DIR = "/home/dgutman/devel/CDSA_LoadTools/rcpExport"

client = pymongo.MongoClient('localhost',27017)
db = client[DB_NAME][DB_COLL]
p = re.compile('^(\d+)_.*\.pdf$', re.IGNORECASE)
slides = {}

for root, dirs, filenames in os.walk(PDF_DIR):
	for filename in filenames:
		m = p.match(filename)

		if m != None:
			searchTerm = "EUH_" + m.groups(0)[0]
			absFilePath = os.path.join(root, filename)
	            
			slide = db.find_one({"fileName": {"$regex": searchTerm}}, {"scanProperties": False})

			if slide:
				slideId = str(slide["_id"])
				if slideId not in slides: slides[slideId] = []

				slides[slideId].append({"fileName": filename, "filePath": absFilePath})

for slideId, files in slides.iteritems():
	print slideId
	db.update_one({"_id": ObjectId(slideId)}, {"$set": {"pathologyReports": files}})
