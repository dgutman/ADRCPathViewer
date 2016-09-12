define("config", function(){

	//This is the base URL for the API
	var BASE_URL = "http://digitalslidearchive.emory.edu/v1";

	//SLIDE_SETS will tell the app which slidesets to make available for the user
	//Options 1: All slidesets:
	//  SLIDE_SETS = BASE_URL +  "/slidesetlist" which gets all slidesets
	//Options 2: specific slidesets
	//  SLIDE_SET = ["WINSHIP_BIOBANK"]
	var SLIDE_SETS = BASE_URL +  "/slidesetlist";

	//define the set of buttons for controlling the slide
	//Available buttons objects are:
	//  { id: "apply_filter_btn", value: "Apply Filters"},
    //  { id: "report_img_btn", value: "Report Bad Image"},
    //  { id: "show_debug_btn", value: "Show Debug Info"},
    //  { id: "draw_tools_btn", value: "Draw Tools"},
    //  { id: "comment_btn", value: "Comment"},
    //  { id: "aperio_import_btn", value: "AperioXML"}
	var BUTTONS = [
				{ id: "apply_filter_btn", value: "Apply Filters", width: 120},
                { id: "report_img_btn", value: "Report Bad Image"},
                { id: "show_debug_btn", value: "Show Debug Info"},
                { id: "draw_tools_btn", value: "Draw Tools"},
                { id: "comment_btn", value: "Comment"},
                { id: "aperio_import_btn", value: "AperioXML"}
    ];

	return {
		BASE_URL: BASE_URL,
		SLIDE_SETS: SLIDE_SETS,
		BUTTONS: BUTTONS
	}
});

