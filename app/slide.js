define("slide", ["config", "zoomer", "jquery"], function(config, zoomer, $){

	var slide = {
		id: null,
		
		init: function(id){
			this.id = id;
			zoomer.viewer.open(this.getTileSource());
			
			return this;
		},

		getTileSource: function(){
			var slideId = this.id;
			var tiles = null;
        	
        	$.ajax({
	            url: config.BASE_URL + "/item/" + this.id + "/tiles",
	            method: "GET",
	            async: false,
	            success: function(data){
	                tiles = data;
	            }
	        });

	        //udpate the tile source and initialize the viewer
	        tileSource = {
	            width: tiles.sizeX,
	            height: tiles.sizeY,
	            tileWidth: tiles.tileWidth,
	            tileHeight: tiles.tileHeight,
	            minLevel: 0,
	            maxLevel: tiles.levels - 1,
	            getTileUrl: function(level, x, y){
	                return config.BASE_URL + "/item/" + slideId + "/tiles/zxy/" + level + "/" + x + "/" + y;
	            }
	        }

	        return tileSource;
		}
	}

	return slide
});