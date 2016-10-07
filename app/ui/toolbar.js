define("ui/toolbar", ["slide", "webix"], function(slide){

	buttons = {
    	height: 30,
        cols: [
        	{ id: "apply_filter_btn", label: "Apply Filters", view: "button", click: ("$$('filters_window').show();")},
        	{ id: "aperio_import_btn", label: "AperioXML", view: "button", click: slide.showAnnotations}
       	]
    }

    return{
    	buttons: buttons
    }
});