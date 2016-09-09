define("config", function(){

	var BASE_URL = "http://digitalslidearchive.emory.edu/v1";

	//SLIDE_SETS = ALL will fetch all slidesets using the slidesetlist endpoint
	//You can override this options by specifing specific slide sets here
	//Example SLIDE_SETS = ["WINSHIP_BIOBANK"] which will only show WINSHIP_BIOBANK slideset
	var SLIDE_SETS = "ALL";

	return {
		BASE_URL: BASE_URL,
		SLIDE_SETS: SLIDE_SETS
	}

});

