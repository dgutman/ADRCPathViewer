define("ui/main", ["ui/header", "ui/filters", "ui/slidenav","slide", "webix"], function(header, filters, slidenav, slide){

	function init(){
		filters.init();

		viewerPanel = {rows:[slidenav.buttons, {view: "template", content: "image_viewer"}]};

		webix.ui({
	    	container: "main_layout",
			rows:[
				header.view,
				{
					cols:[
						slidenav.view,
						{view: "resizer"},
						viewerPanel
					]
				}
			]
		});
	}

	return{
		init: init
	}
});