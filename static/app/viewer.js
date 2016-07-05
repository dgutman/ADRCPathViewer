define("viewer", ["osd", "osdhelper", "osdhook"], function(osd, helper, hook){

	function init(){
		var viewer = osd({
			id: 'image_viewer',
			prefixUrl: "bower_components/openseadragon/built-openseadragon/openseadragon/images/",
			navigatorPosition: "BOTTOM_RIGHT",
			showNavigator: true,
			tileSources: "http://node15.cci.emory.edu/cgi-bin/iipsrv.fcgi?DeepZoom=/PYRAMIDS/PYRAMIDS/CDSA/GBM_Frozen/intgen.org_GBM.tissue_images.3.0.0/TCGA-06-0137-01A-01-BS1.svs.dzi.tif.dzi"
		});

		viewer.addHandler('open-failed', function(evt) {
       		console.log('tile source opening failed', evt);
	    });

	    viewer.addHandler('animation', function() {
	        var bounds = viewer.viewport.getBounds();
	        var message = bounds.x + ':' + bounds.y + ':' + bounds.width + ':' + bounds.height;
	    });

		return viewer;
	}




	return{
		init: init
	}
});

