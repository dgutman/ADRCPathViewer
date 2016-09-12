/*
Access modules and their variables from JavaScript console

In the JS console import the module. For example, to 
import the viewer module you will do:
Note: viewer is the module name. Modules names are all defined
in main.js. So refer to main.js to find out the module name as they
are abbreviated

> zoomer = require("zoomer");
> viewer = zoomer.viewer;
> annotationStte = zoomer.annotationState;

To access knockout observables
> obs = require("obs")

Now obs is an object having the following properties
{
	statusObj: statusObj,
	svgOverlayVM: svgOverlayVM,
	slideInfoObj: slideInfoObj,
	vm: vm
}

If for some reason a module not returning the variable you 
are looking for, then go to the module and add the variable 
you want to return to the return object
 */

define("routes", ["crossroads", "hasher", "zoomer", "config", "jquery"], function(crossroads, hasher, zoomer, config, $) {

	function init(){	
		crossroads.addRoute("/slideset/{id}", function(id){
			$$("thumbnails_panel").clearAll();
            $$("thumbnails_panel").load(config.BASE_URL +"/slideset/" + id);
		});

		crossroads.addRoute("/slideset/{setId}/slide/{slideId}", function(setId, slideId){
			$$("thumbnails_panel").clearAll();
            $$("thumbnails_panel").load(config.BASE_URL +"/slideset/" + setId);

			$.get(config.BASE_URL + "/slide/" + slideId, function(slide){
				tileSource = {
		            width: slide.width,
		            height: slide.height,
		            tileWidth: 256,
		            tileHeight: 256,
		            getTileUrl: function(level, x, y){
		                return config.BASE_URL +"/tile/"+ slideId + "/" + level + "/" + x + "/" + y;
	            	} 
	            };

				zoomer.viewer.open(tileSource);
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


