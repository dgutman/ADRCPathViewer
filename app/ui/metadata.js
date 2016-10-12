define("ui/metadata", function() {

    var meta = {
        view: "window",
        head: {
            view: "toolbar",
            margin: -4,
            cols: [{
                view: "label",
                label: "Slide Metadata"
            }, {
                view: "icon",
                icon: "times-circle",
                click: "$$('metadata_window').hide();"
            }]
        },
        position: "center",
        id: "metadata_window",
        move: true,
        body: {
            rows: [{
                cells: [{
                    view: "datatable",
                    width: 800,
                    height: 450,
                    scroll: "xy",
                    select: "row",
                    id: "image_metadata_table",
                    columns: [{
                        id: "key",
                        header: "Key",
                        width: 250
                    }, {
                        id: "value",
                        header: "Value",
                        fillspace: true
                    }]
                }, {
                    view: "datatable",
                    width: 800,
                    height: 450,
                    scroll: "xy",
                    select: "row",
                    id: "clinical_metadata_table",
                    columns: [{
                        id: "key",
                        header: "Key",
                        width: 250
                    }, {
                        id: "value",
                        header: "Value",
                        fillspace: true
                    }]
                }, {
                    id: "aboutView2",
                    width: 800,
                    height: 450,
                    template: "<i>Placeholder 2</i>",
                    padding: 5
                }]
            }, {
                view: "tabbar",
                type: "bottom",
                multiview: true,
                options: [{
                    value: 'Image',
                    id: 'image_metadata_table'
                }, {
                    value: 'Clinical',
                    id: 'clinical_metadata_table'
                }, {
                    value: '??',
                    id: "aboutView2"
                }]
            }]
        }
    }

    return {
        view: meta
    }
});