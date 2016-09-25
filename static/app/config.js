define("config", function(){

	//This is the base URL for the API
	var BASE_URL = "http://digitalslidearchive.emory.edu:5081/v1";

	//this is the URL for the site
	var HOST_URL = "http://digitalslidearchive.emory.edu:5081";

	//SLIDE_SETS will tell the app which slidesets to make available for the user
	//Options 1: All slidesets:
	//  SLIDE_SETS = BASE_URL +  "/slidesetlist" which gets all slidesets
	//Options 2: specific slidesets
	//  SLIDE_SET = ["WINSHIP_BIOBANK"]
	var SLIDE_SETS = BASE_URL +  "/slidesetlist";
	var DEFAULT_SLIDE_SET = "WINSHIP_BIOBANK_SEPT16";

	//define the set of buttons for controlling the slide
	//Available buttons objects are:
	//  { id: "apply_filter_btn", value: "Apply Filters"},
    //  { id: "report_img_btn", value: "Report Bad Image"},
    //  { id: "show_debug_btn", value: "Show Debug Info"},
    //  { id: "draw_tools_btn", value: "Draw Tools"},
    //  { id: "comment_btn", value: "Comment"},
    //  { id: "aperio_import_btn", value: "AperioXML"}
	var BUTTONS = [
				{ id: "apply_filter_btn", label: "Apply Filters", view: "button"},
                { id: "report_img_btn", label: "Report Bad Image", view: "button"},
                { id: "show_debug_btn", label: "Show Debug Info", view: "button"},
                { id: "draw_tools_btn", label: "Draw Tools", view: "button"},
                { id: "comment_btn", label: "Comment", view: "button"},
                { id: "aperio_import_btn", label: "AperioXML", view: "button"}
    ];

	return {
		BASE_URL: BASE_URL,
		HOST_URL: HOST_URL,
		SLIDE_SETS: SLIDE_SETS,
		DEFAULT_SLIDE_SET: DEFAULT_SLIDE_SET,
		BUTTONS: BUTTONS
	}
});

