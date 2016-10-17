define("routes", ["crossroads", "hasher", "config", "jquery", "ui", "osd", "slide"], function(crossroads, hasher, config, $, ui, osd, slide) {

    function init() {
        crossroads.addRoute("/item/{id}", function(id) {
            $.get(config.BASE_URL + "/item/" + id, function(item) {
                console.log("SLIDE: ", item);
                slide.init(item);
            });
        });

        crossroads.addRoute("/item/{id}/{zoom}", function(id, zoom) {
            $.get(config.BASE_URL + "/item/" + id, function(item) {
                slide.init(item, parseInt(zoom));
            });
        });

        crossroads.addRoute("/item/{id}/{zoom}/{x}/{y}", function(id, zoom, x, y) {
            $.get(config.BASE_URL + "/item/" + id, function(item) {
                var coords = new osd.Point(parseFloat(x), parseFloat(y));
                slide.init(item, parseInt(zoom), coords);
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

    return {
        init: init
    }
});