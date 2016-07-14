require.config({
	paths: {
        "osd": "bower_components/openseadragon/built-openseadragon/openseadragon/openseadragon",
        "switch": "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-switch/3.3.2/js/bootstrap-switch.min",
        "mousetrap": "https://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.4.6/mousetrap.min",
        "ko": "bower_components/knockout/dist/knockout",
        "webix": "bower_components/webix/codebase/webix",
        "jquery": "bower_components/jquery/dist/jquery",
        "osdhelper": "lib/openseadragon-imaginghelper.min",
        "osdhook": "lib/openseadragon-viewerinputhook.min",
        "scalebar": "lib/openseadragon-scalebar",
        "ant": "lib/dsa-annotation",
        "antctrl": "lib/dsa-annotation-control",
        "config": "app/config",
        "ui": "app/ui",
        "viewer": "app/viewer",
        "aperio": "app/aperio",
        "obs": "app/observables"
    },
    shim: {
    	"osdhelper": ["osd"],
    	"osdhook": ["osd"],
        "scalebar": ["osd"],
        "ant": ["osd"],
        "antctrl": ["jquery"],
        "viewer": ["ant"],
        "antctrl": ["switch", "mousetrap"],
        "aperio": ["viewer"]
    }

});

requirejs(['app/app.js']);

