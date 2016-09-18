import pymongo, sys, os
from bson.objectid import ObjectId

DB_NAME = "UberSliderSorter"
DB_COLL = "RawSlideData"
XML_DIR = "/TCGA_MIRROR/TCGA_METADATA/Aperio_XML_Files"

client = pymongo.MongoClient('localhost',27017)
db = client[DB_NAME][DB_COLL]

slides = {}

for root, dirs, files in os.walk(XML_DIR):
	for subroot, sudirs, filenames in os.walk(root):
		for filename in filenames:
			searchTerm = filename[0:23]
			absFilePath = os.path.join(subroot, filename)
            
			slide = db.find_one({"fileName": {"$regex": searchTerm}}, {"scanProperties": False})

			if slide:
				slideId = str(slide["_id"])
				if slideId not in slides: slides[slideId] = []

				slides[slideId].append({"fileName": filename, "filePath": absFilePath})

for slideId, files in slides.iteritems():
	print slideId
	db.update_one({"_id": ObjectId(slideId)}, {"$set": {"aperioAnnotations": files}})
