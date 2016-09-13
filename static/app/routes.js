define("routes", ["crossroads", "hasher", "zoomer", "config", "jquery", "ui"], function(crossroads, hasher, zoomer, config, $, ui) {

	function init(){	
		crossroads.addRoute("/slideset/{id}", function(id){
			$$("thumbnails_panel").clearAll();
            $$("thumbnails_panel").load(config.BASE_URL +"/slideset/" + id);
		});

		crossroads.addRoute("/slideset/{setId}/slide/{slideId}", function(setId, slideId){
			//ui.initSlide(slideId)
			$$("thumbnails_panel").clearAll();
            $$("thumbnails_panel").load(config.BASE_URL +"/slideset/" + setId);

			$.get(config.BASE_URL + "/slide/" + slideId, function(slide){
				ui.initSlide(slide);
				/*tileSource = {
		            width: slide.width,
		            height: slide.height,
		            tileWidth: 256,
		            tileHeight: 256,
		            getTileUrl: function(level, x, y){
		                return config.BASE_URL +"/tile/"+ slideId + "/" + level + "/" + x + "/" + y;
	            	} 
	            };

				zoomer.viewer.open(tileSource);*/
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


