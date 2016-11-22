define("slide", ["pubsub", "config", "zoomer", "jquery", "webix"], function(pubsub, config, viewer, $) {

    var slide = {
        aBtn: null,
        mTable: null,
        aTable: null,
        iTable: null,
        lBox: null,
        files: null,

        init: function(item, zoom, coords) {
            $.extend(this, item);
            var itemId = this._id;
            this.aperio = [];

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

        initViewer: function(tiles) {
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

            pubsub.publish("SLIDE", this);
            viewer.open(tileSource);

            return this;
        },

        getFiles: function() {
            var obj = this;

            s1 = {
              "url": "http://digitalslidearchive.emory.edu/v1/aperio/TCGA_MIRROR/TCGA_METADATA/Aperio_XML_Files/bcrTCGA/diagnostic_block_HE_section_image/TCGA-12-0620-01Z-00-DX2.xml",
              "name": "TCGA-12-0620-01Z-00-DX2.xml"
            };
            s2 = {
              "url": "http://digitalslidearchive.emory.edu/v1/aperio/TCGA_MIRROR/TCGA_METADATA/Aperio_XML_Files/bcrTCGA/diagnostic_block_HE_section_image/TCGA-12-0620-01Z-00-DX2.xml",
              "name": "TCGA-12-0620-01Z-00-DX2.xml"
            };
            s3 = {
              "url": "http://digitalslidearchive.emory.edu/v1/aperio/TCGA_MIRROR/TCGA_METADATA/Aperio_XML_Files/bcrTCGA/diagnostic_block_HE_section_image/TCGA-12-0620-01Z-00-DX2.xml",
              "name": "TCGA-12-0620-01Z-00-DX2.xml"
            };

            this.aperio.push(s1);
            this.aperio.push(s2);
            this.aperio.push(s3);

            $.get(config.BASE_URL + "/item/" + this._id + "/files", function(files) {
                this.files = files;
                $.each(files, function(key, file) {
                    if (file.mimeType == "application/xml") {
                    }
                });
            });
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
            //this.annotations.length > 0 ? this.aBtn.enable() : this.aBtn.disable();
            this.aTable.clearAll();
            this.aTable.define("data", this.annotations);

            this.iTable.clearAll();
            this.iTable.define("data", this.metadata.image);
        }

    }

    return slide;
});