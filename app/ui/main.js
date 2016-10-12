define("ui/main", ["ui/header", "ui/filters", "ui/slidenav", "ui/toolbar", "ui/metadata", "ui/annotations", "webix"], function(header, filters, slidenav, toolbar, metadata, annotations) {

    function init() {
        filters.init();

        viewerPanel = {
            rows: [toolbar.buttons, {
                view: "template",
                content: "image_viewer"
            }]
        };

        webix.ui(metadata.view);
        webix.ui(annotations.view);

        webix.ui({
            container: "main_layout",
            rows: [
                header.view, {
                    cols: [
                        slidenav.view, {
                            view: "resizer"
                        },
                        viewerPanel
                    ]
                }
            ]
        });
    }

    return {
        init: init
    }
});