define("config", function() {

    //This is the base URL for the API
    var BASE_URL = "http://digitalslidearchive.emory.edu:8080/api/v1";

    //this is the URL for the site
    var HOST_URL = "http://digitalslidearchive.emory.edu/girder";

    //Annotation file base URL
    var XML_BASE_URL = "http://digitalslidearchive.emory.edu:8001"

    //Girder collection name
    var COLLECTION_ID = "57bf33482f9b2e0602411e63";

    //Default folder ID that is under the COLLECTION_NAME
    var DEFAULT_FOLDER_ID = "57da66ce2f9b2e0e105e9d8b";

    //Default folder ID that is under the COLLECTION_NAME
    var DEFAULT_PATIENT_ID = "57f7aea82f9b2e676afb538c";

    return {
        BASE_URL: BASE_URL,
        HOST_URL: HOST_URL,
        XML_BASE_URL: XML_BASE_URL,
        COLLECTION_ID: COLLECTION_ID,
        DEFAULT_FOLDER_ID: DEFAULT_FOLDER_ID,
        DEFAULT_PATIENT_ID: DEFAULT_PATIENT_ID
    }
});