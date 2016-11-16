require = {
    urlArgs: "bust=" + (+new Date),
    paths: {
        "d3": "bower_components/d3/d3.min",
        "svg": "bower_components/svg-overlay/openseadragon-svg-overlay",
        "pubsub": "bower_components/PubSubJS/src/pubsub",
        "hasher": "bower_components/hasher/dist/js/hasher.min",
        "signals": "bower_components/js-signals/dist/signals.min",
        "crossroads": "bower_components/crossroads/dist/crossroads.min",
        "osd": "bower_components/openseadragon/built-openseadragon/openseadragon/openseadragon",
        "signals": "bower_components/js-signals/dist/signals.min",
        "ko": "bower_components/knockout/dist/knockout",
        "webix": "bower_components/webix/codebase/webix",
        "jquery": "bower_components/jquery/dist/jquery",
        "osdhelper": "lib/openseadragon-imaginghelper.min",
        "osdhook": "lib/openseadragon-viewerinputhook.min",
        "scalebar": "lib/openseadragon-scalebar",
        "xj": "lib/xml2json.min",
        "config": "app/config",
        "zoomer": "app/zoomer",
        "slide": "app/slide",
        "aperio": "app/aperio",
        "obs": "app/observables",
        "routes": "app/routes",
        "app": "app/app"
    },

    packages: [{
        name: "ui",
        location: "app/ui"
    }],

    shim: {
        "osdhelper": ["osd"],
        "osdhook": ["osd"],
        "scalebar": ["osd"],
        "svg": ["osd"]
    }
};