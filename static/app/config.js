define("config", function(){

	var BASE_URL = "http://digitalslidearchive.emory.edu/v1";

	//SLIDE_SETS will tell the app which slidesets to make available for the user
	//Options 1: All slidesets:
	//  SLIDE_SETS = BASE_URL +  "/slidesetlist" which gets all slidesets
	//Options 2: specific slidesets
	//  SLIDE_SET = ["WINSHIP_BIOBANK"]
	var SLIDE_SETS = BASE_URL +  "/slidesetlist";

	return {
		BASE_URL: BASE_URL,
		SLIDE_SETS: SLIDE_SETS
	}
});

