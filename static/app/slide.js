define("slide", ["pubsub", "config", "jquery", "zoomer"], function(pubsub, config, $, viewer) {

    var slide = {
        init: function(item) {
            $.extend(this, item);
            this.viewer();
            this.keyvalue();
            this.initDataViews();
            this.superPixels();
            pubsub.publish("SLIDE", this);
            return this;
        },

        viewer: function() {
            //udpate the tile source and initialize the viewer
            tileSource = {
                width: slide.width,
                height: slide.height,
                tileWidth: 256,
                tileHeight: 256,
                getTileUrl: function(level, x, y){
                    return config.BASE_URL +"/tile/"+ slide.id + "/" + level + "/" + x + "/" + y;
                }
            }

            viewer.open(tileSource);
        },

        superPixels: function() {
            $.ajax({
                context: this,
                url: config.BASE_URL + "/file/" + this.meta.svgJsonId + "/download",
                success: function(data) {
                    data = JSON.parse(data);
                    this.spx = spx.transform(data, this.meta.imageWidth);
                    console.log("Loaded", data.length, "super pixels for", this.name);
                }
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
            $$("image_metadata_table").clearAll();
            $$("image_metadata_table").define("data", this.metadata.image);
        }
    }

    return slide;
});