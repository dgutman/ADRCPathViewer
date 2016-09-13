define("routes", ["crossroads", "hasher", "zoomer", "config", "jquery", "ui"], function(crossroads, hasher, zoomer, config, $, ui) {

	function init(){	
		crossroads.addRoute("/slideset/{id}", function(id){
			$$("thumbnails_panel").clearAll();
            $$("thumbnails_panel").load(config.BASE_URL +"/slideset/" + id);
		});

		crossroads.addRoute("/slideset/{setId}/slide/{slideId}", function(setId, slideId){
			$$("thumbnails_panel").clearAll();
            $$("thumbnails_panel").load(config.BASE_URL +"/slideset/" + setId);

			$.get(config.BASE_URL + "/slide/" + slideId, function(slide){
				ui.initSlide(slide);
			});
		});

		crossroads.bypassed.add(function() {
	    	console.log('ROUTE BYPASS');
		});

		hasher.initialized.add(function(h) {
			crossroads.parse(h);
		});
		
		hasher.changed.add(function(h) {
			crossroads.parse(h);
		});

		hasher.init();
	}

	return{
		init: init
	}
});


