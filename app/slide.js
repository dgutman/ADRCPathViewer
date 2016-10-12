define("slide", ["pubsub", "config", "zoomer", "jquery", "aperio", "webix"], function(pubsub, config, zoomer, $, aperio){

	var slide = {
		annotations: [],
		aBtn: null,
		mTable: null,
		aTable: null,
		iTable: null,

		init: function(item){
			$.extend(this, item);
			zoomer.viewer.open(this.getTileSource());
			
			this.aBtn = $$("aperio_import_btn");
			this.aTable = $$("aperio_files_table");
			this.mTable = $$("clinical_metadata_table");
			this.iTable = $$("image_metadata_table");

			this.getAnnotationFiles();
			this.keyvalue();
			this.initDataViews();

			pubsub.publish("SLIDE", this);
			console.log(this);
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
	        };

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

		getAnnotationFiles: function(){
			var tmp = new Array();
			var loc = this.meta.location.replace("/SLIDES", "");

			$.each(this.getFiles(), function(key, file){
				if(file.mimeType == "application/xml"){
					file.url = config.XML_BASE_URL + loc + "/" + file.name;
					tmp.push(file);
				}
			});

			this.annotations = tmp;
			return this.annotations;
		},

		keyvalue: function(){
			var metadata = {image: [], clinical: []};
		
			metadata.image.push({key: "Name", value: this.name});
			metadata.image.push({key: "Size", value: this.size});

			$.each(this.meta, function(key, value){
				metadata.image.push({key: key, value: value});
			});

			this.metadata = metadata;
		},

    	initDataViews: function(){
    		this.annotations.length > 0 ? this.aBtn.enable() : this.aBtn.disable();
			this.aTable.clearAll();
            this.aTable.define("data", this.annotations);

    		this.iTable.clearAll();
            this.iTable.define("data", this.metadata.image);
    	}

	}

	return slide;
});