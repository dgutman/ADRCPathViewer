define("ui/annotations", ["aperio"], function(aperio) {

    var annotations = {
        view: "window",
        head: {
            view: "toolbar",
            margin: -4,
            cols: [{
                view: "label",
                label: "Aperio Annotations"
            }, {
                view: "icon",
                icon: "times-circle",
                click: "$$('aperio_files_window').hide();"
            }]
        },
        position: "center",
        id: "aperio_files_window",
        move: true,
        body: {
            rows: [{
                view: "datatable",
                width: 1000,
                scroll: "xy",
                select: "row",
                id: "aperio_files_table",
                columns: [{
                    id: "name",
                    header: "Name",
                    width: 250
                }, {
                    id: "url",
                    header: "URL",
                    fillspace: true
                }],
                on: {
                    "onItemClick": function(id, e, trg) {
                        file = this.getItem(id.row);
                        aperio.importMarkups(file.url);
                        $$('aperio_files_window').hide();
                    }
                }
            }]
        }
    }

    return {
        view: annotations
    }
});