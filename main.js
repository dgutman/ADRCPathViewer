require = {
    urlArgs: "bust=" + (+new Date),
	paths: {
        "hasher": "bower_components/hasher/dist/js/hasher.min",
        "signals": "bower_components/js-signals/dist/signals.min",
        "crossroads": "bower_components/crossroads/dist/crossroads.min",
        "osd": "bower_components/openseadragon/built-openseadragon/openseadragon/openseadragon",
        "switch": "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-switch/3.3.2/js/bootstrap-switch.min",
        "mousetrap": "https://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.4.6/mousetrap.min",
        "signals": "bower_components/js-signals/dist/signals.min",
        "ko": "bower_components/knockout/dist/knockout",
        "webix": "bower_components/webix/codebase/webix",
        "jquery": "bower_components/jquery/dist/jquery",
        "osdhelper": "lib/openseadragon-imaginghelper.min",
        "osdhook": "lib/openseadragon-viewerinputhook.min",
        "scalebar": "lib/openseadragon-scalebar",
        "ant": "lib/dsa-annotation",
        "antctrl": "lib/dsa-annotation-control",
        "config": "app/config",
        "zoomer": "app/zoomer",
        "slide": "app/slide",
        "aperio": "app/aperio",
        "obs": "app/observables",
        "routes": "app/routes",
        "app": "app/app"
    },

    packages: [
        {
            name: "ui",
            location: "app/ui"
        }
    ],

    shim: {
    	"osdhelper": ["osd"],
    	"osdhook": ["osd"],
        "scalebar": ["osd"],
        "ant": ["osd", "jquery"],
        "antctrl": ["jquery", "switch", "mousetrap"],
        "crossroads": ["signals"],
        "switch": ["jquery"],
        "app": ["ui", "webix", "routes"],
        "routes": ["crossroads", "hasher", "zoomer", "config", "osd"]
    }
};