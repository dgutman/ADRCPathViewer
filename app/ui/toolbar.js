define("ui/toolbar", ["pubsub", "webix"], function(pubsub){

    slide = null;
    pubsub.subscribe("SLIDE", function(msg, data){
        slide = data;
    });

	buttons = {
    	height: 30,
        cols: [
        	{ id: "apply_filter_btn", label: "Apply Filters", view: "button", click: ("$$('filters_window').show();")},
        	{ id: "aperio_import_btn", label: "AperioXML", view: "button", click: loadAnnotations}
       	]
    }

    function loadAnnotations(){
        slide.showAnnotations();
    }

    return {
    	buttons: buttons
    }
});