require.config({
	paths: {
        "osd": "bower_components/openseadragon/built-openseadragon/openseadragon/openseadragon",
        "ko": "bower_components/knockout/dist/knockout",
        "webix": "bower_components/webix/codebase/webix",
        "jquery": "bower_components/jquery/dist/jquery",
        "osdhelper": "lib/openseadragon-imaginghelper.min",
        "osdhook": "lib/openseadragon-viewerinputhook.min",
        "scalebar": "lib/openseadragon-scalebar",
        "config": "app/config",
        "ui": "app/ui",
        "viewer": "app/viewer",
        "aperio": "app/aperio",
        "obs": "app/observables"
    },
    shim: {
    	"osdhelper": ["osd"],
    	"osdhook": ["osd"],
        "scalebar": ["osd"]
    }

});

requirejs(['app/app.js']);
