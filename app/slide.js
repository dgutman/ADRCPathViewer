define("slide", ["pubsub", "config", "zoomer", "jquery", "aperio", "webix"], function(pubsub, config, zoomer, $, aperio) {

    var slide = {
        annotations: [],
        aBtn: null,
        mTable: null,
        aTable: null,
        iTable: null,
        lBox: null,
        files: null,

        init: function(item, zoom, coords) {
            $.extend(this, item);
            var itemId = this._id;

            this.zoom = zoom;
            this.pan = coords;
            this.aBtn = $$("aperio_import_btn");
            this.aTable = $$("aperio_files_table");
            this.mTable = $$("clinical_metadata_table");
            this.iTable = $$("image_metadata_table");
            this.lBox = $$("link_to_share");

            $.ajax({
                context: this,
                url: config.BASE_URL + "/item/" + itemId + "/tiles", 
                success: this.initViewer
            });

            this.getFiles();
            this.keyvalue();
            this.initDataViews();

            pubsub.publish("SLIDE", this);
            return this;
        },

        initViewer: function(tiles){
            console.log("TILES: ", tiles);
            itemId = this._id;
            this.tiles = tiles;
            zoom = this.zoom;
            pan = this.pan;
            sharedUrl = config.HOST_URL + "/#item/" + this._id;

            tileSource = {
                width: tiles.sizeX,
                height: tiles.sizeY,
                tileWidth: tiles.tileWidth,
                tileHeight: tiles.tileHeight,
                minLevel: 0,
                maxLevel: tiles.levels - 1,
                getTileUrl: function(level, x, y) {
                    return config.BASE_URL + "/item/" + itemId + "/tiles/zxy/" + level + "/" + x + "/" + y;
                }
            };

            zoomer.viewer.open(tileSource);
            
            //set viewer zoom level if the slide has this property
            zoomer.viewer.addHandler("open", function() {
                console.log(zoom);
                if(typeof zoom != "undefined"){    
                    zoomer.viewer.viewport.zoomBy(zoom);
                }
                if(typeof pan != "undefined"){     
                    console.log("PAN TO:", pan); 
                    zoomer.viewer.viewport.panTo(pan);
                }
            });

            viewer.addHandler('zoom', function(event) {
                tmpUrl = sharedUrl + "/" + zoomer.viewer.viewport.getZoom();
                currentZoom = zoomer.viewer.viewport.getZoom();
                currentCenter = zoomer.viewer.viewport.getCenter()
                tmpUrl += "/" + currentCenter.x + "/" + currentCenter.y;
                $$("link_to_share").setValue(tmpUrl);
            });

            viewer.addHandler('pan', function(event) {
                currentCenter = zoomer.viewer.viewport.getCenter()
                currentZoom = zoomer.viewer.viewport.getZoom();
                tmpUrl = sharedUrl + "/" + currentZoom + "/" + currentCenter.x + "/" + currentCenter.y;
                $$("link_to_share").setValue(tmpUrl);
            });
        },

        getFiles: function() {
            var obj = this;

            $.get(config.BASE_URL + "/item/" + this._id + "/files")
             .then(function(files){
                this.files = files;
                console.log("FILES: ", this.files);

                $.each(files, function(key, file) {
                    if (file.mimeType == "application/xml") {
                        obj.annotations.push(file);
                    }
                });
             });

             console.log("ANNOTATIONS: ", this.annotations);
        },

        keyvalue: function() {
            var metadata = {
                image: [],
                clinical: []
            };

            metadata.image.push({
                key: "Name",
                value: this.name
            });
            metadata.image.push({
                key: "Size",
                value: this.size
            });

            $.each(this.meta, function(key, value) {
                metadata.image.push({
                    key: key,
                    value: value
                });
            });

            this.metadata = metadata;
        },

        initDataViews: function() {
            this.annotations.length > 0 ? this.aBtn.enable() : this.aBtn.disable();
            this.aTable.clearAll();
            this.aTable.define("data", this.annotations);

            this.iTable.clearAll();
            this.iTable.define("data", this.metadata.image);
        }

    }

    return slide;
});