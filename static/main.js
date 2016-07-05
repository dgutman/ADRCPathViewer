

require.config({
	paths: {
        "osd": "bower_components/openseadragon/built-openseadragon/openseadragon/openseadragon",
        "webix": "bower_components/webix/codebase/webix",
        "jquery": "bower_components/jquery/dist/jquery",
        "osdhelper": "lib/openseadragon-imaginghelper.min",
        "osdhook": "lib/openseadragon-viewerinputhook.min",
        "config": "app/config",
        "ui": "app/ui",
        "viewer": "app/viewer",
        "aperio": "app/aperio"
    },
    shim: {
    	"osdhelper": ["osd"],
    	"osdhook": ["osd"]
    }

});

requirejs(['app/app.js']);

