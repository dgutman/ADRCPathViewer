define("ui/toolbar", ["webix"], function(){

	buttons = {
    	height: 30,
        cols: [
        	{ id: "apply_filter_btn", label: "Apply Filters", view: "button", click: ("$$('filters_window').show();")},
       	]
    };

    return{
    	buttons: buttons
    }
});