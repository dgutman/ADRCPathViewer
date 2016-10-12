define("ui/toolbar", ["pubsub", "aperio"], function(pubsub, aperio) {

    slide = null;
    pubsub.subscribe("SLIDE", function(msg, data) {
        slide = data;
    });

    buttons = {
        height: 30,
        cols: [{
            id: "apply_filter_btn",
            label: "Apply Filters",
            view: "button",
            click: ("$$('filters_window').show();")
        }, {
            id: "metadata_btn",
            label: "Metadata",
            view: "button",
            click: ("$$('metadata_window').show();")
        }, {
            id: "aperio_import_btn",
            label: "AperioXML",
            view: "button",
            click: loadAnnotations
        }]
    }

    function loadAnnotations() {
        if (slide.annotations.length == 1)
            aperio.importMarkups(slide.annotations[0].url);
        else
            $$('aperio_files_window').show();
    }

    return {
        buttons: buttons
    }
});