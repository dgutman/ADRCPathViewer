define("config", function(){

	//This is the base URL for the API
	var BASE_URL = "http://candygram.neurology.emory.edu:8080/api/v1";

	//this is the URL for the site
	var HOST_URL = "http://digitalslidearchive.emory.edu/girder";

	//Girder collection name
	var COLLECTION_NAME = "57bf445df8c2ef5eae32d35e";

	//Default folder ID that is under the COLLECTION_NAME
	var DEFAULT_FOLDER_ID = "57c9d356f8c2ef024e9810dc";

	//Default folder ID that is under the COLLECTION_NAME
	var DEFAULT_PATIENT_ID = "57cedc1df8c2ef024e98f932";

	return {
		BASE_URL: BASE_URL,
		HOST_URL: HOST_URL,
		COLLECTION_NAME: COLLECTION_NAME,
		DEFAULT_FOLDER_ID: DEFAULT_FOLDER_ID,
		DEFAULT_PATIENT_ID: DEFAULT_PATIENT_ID
	}
});

