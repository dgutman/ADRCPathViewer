define("slide", ["config", "zoomer", "jquery", "aperio", "webix"], function(config, zoomer, $, aperio){

	var slide = {

		init: function(item){
			$.extend(this, item);
			zoomer.viewer.open(this.getTileSource());
			return this;
		},

		getTileSource: function(){
			var slideId = this._id;
			var tiles = this.getTiles();
        	
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
		},

		getTiles: function(){
			var tiles = null;
        	
        	$.ajax({
	            url: config.BASE_URL + "/item/" + this._id + "/tiles",
	            method: "GET",
	            async: false,
	            success: function(data){
	                tiles = data;
	            }
	        });

	        return tiles;
		},

		getFiles: function(){
			var files = null;
			var url = config.BASE_URL + "/item/" + this._id + "/files";

			webix.ajax().sync().get(url, function(text, data, xmlHttpRequest){
				files = JSON.parse(text);
			});

			return files;
		},

		getAnnotationFile: function(){
			var filename = null;

			$.each(this.getFiles(), function(key, file){
				if(file.mimeType == "application/xml")
					filename = file.name;
			});

			return filename;
		}
	}

	return slide;
});