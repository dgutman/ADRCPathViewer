define("ui/main", ["ui/header", "ui/filters", "ui/slidenav", "ui/toolbar", "ui/metadata", "ui/annotations", "ui/aperio", "webix"], function(header, filters, slidenav, toolbar, metadata, annotations, aperio) {

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
        webix.ui(aperio.view);

        webix.ui({
            view: "window",
            head: {
                view: "toolbar",
                margin: -4,
                cols: [{
                    view: "label",
                    label: "Share Link"
                }, {
                    view: "icon",
                    icon: "times-circle",
                    click: "$$('share_link_window').hide();"
                }]
            },
            position: "center",
            id: "share_link_window",
            body: {
                view: "form",
                width: 400,
                elements: [{
                    id: "link_to_share",
                    view: "textarea",
                    labelAlign: "top",
                    height: 50
                }]
            }
        });

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