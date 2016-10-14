define("requests", ["jquery", "config"], function($, config){

	function getCollectionId(){
		url = config.BASE_URL + "/resource/lookup?path=/collection/" + config.COLLECTION_NAME;
		r = $.ajax({
        	url: url,
            method: "GET"
    	});

    	return r;
	}

	return {
		getCollectionId: getCollectionId
	}

});