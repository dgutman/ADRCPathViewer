define("routes", ["crossroads", "hasher", "zoomer", "config", "jquery", "ui", "osd"], function(crossroads, hasher, zoomer, config, $, ui, osd) {

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

		crossroads.addRoute("/slideset/{setId}/slide/{slideId}/{zoom}", function(setId, slideId, zoom){
			$$("thumbnails_panel").clearAll();
            $$("thumbnails_panel").load(config.BASE_URL +"/slideset/" + setId);

			$.get(config.BASE_URL + "/slide/" + slideId, function(slide){
				slide.zoom = parseFloat(zoom);
				ui.initSlide(slide);
			});
		});

		crossroads.addRoute("/slideset/{setId}/slide/{slideId}/{zoom}/{x}/{y}", function(setId, slideId, zoom, x, y){
			$$("thumbnails_panel").clearAll();
            $$("thumbnails_panel").load(config.BASE_URL +"/slideset/" + setId);

			$.get(config.BASE_URL + "/slide/" + slideId, function(slide){
				slide.zoom = parseFloat(zoom);
				slide.pan = new osd.Point(parseFloat(x), parseFloat(y));
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


