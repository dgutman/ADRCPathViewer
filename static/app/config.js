define("config", function(){

	var IIP = false;
	var BASE_URL = "http://cdsa2.digitalslidearchive.net";
	

	var IIP_URL = "http://cancer.digitalslidearchive.net";

	if(IIP){
		BASE_URL = "http://cancer.digitalslidearchive.net";
	}

	return {
		BASE_URL: BASE_URL
	}

});

