define("ui/aperio", ["pubsub", "d3", "zoomer", "svg"], function(pubsub, d3, zoomer, svg) {

    pubsub.subscribe("SLIDE", function(msg, slide) {
        console.log(slide.aperio);
        $$("aperio_file_list").clearAll();
        $$("aperio_file_list").parse(slide.aperio);
        $$("aperio_file_list").refresh();
    });

    var layoutAnnotationFileList = {
        view: "list",
        height: 200,
        id: "aperio_file_list",
        template: "#name#",
        select: true,
        on: {
            onItemClick: function(id){
                $(".boundaryClass").remove();
                $$("region_list").clearAll();
                $$("region_list").parse(this.getItem(id).regions);
                $$("region_list").refresh();

                $$("file_attributes").clearAll();
                $$("file_attributes").parse(this.getItem(id).attributes);
                $$("file_attributes").refresh();
            }
        }
    };

    var layoutAnnotationList = {
        view: "list",
        height: 200,
        width: "auto",
        id: "region_list",
        template: "Region #attributes.Id#",
        select: true,
        on: {
            onItemClick: function(id){
                $(".boundaryClass").remove();
                d3.select(zoomer.viewer.svgOverlay().node()).append("polygon")
                  .attr("points", this.getItem(id).coords)
                  .style('fill', "blue")
                  .attr('opacity', 0.2)
                  .attr('class', 'boundaryClass')
                  .attr('stroke', 'blue')
                  .attr('stroke-width', 0.001);
            }
        }
    };


    var layoutParameterList = {
        view: "datatable",
        width: "auto",
        columns: [{
            'id': "Parameter"
        }, {
            'id': "Value"
        }],
        autoConfig: true

    };


    var ROIColumns = [{
        id: "Id"
    }, {
        id: "Name"
    }, {
        id: "ReadOnly", header: "Read Only"
    }, {
        id: "NameReadOnly"
    }, {
        id: "LineColorReadOnly"
    }, {
        id: "Incremental"
    }, {
        id: "Type"
    }, {
        id: "LineColor"
    }, {
        id: "Visible"
    }, {
        id: "Selected"
    }, {
        id: "MarkupImagePath"
    }, {
        id: "MacroName"
    }];

    var layoutROIInfo = {
        view: "datatable",
        width: "auto",
        id: "file_attributes",
        columns: ROIColumns
    };

    var aperioWindow = {
        view: "window",
        id: "aperio_window",
        move: true,
        resize: true,
        position:"center",
        modal: true,
        head: {
            view: "toolbar",
            margin: -4,
            cols: [{
                view: "label",
                label: "This window can be closed"
            }, {
                view: "icon",
                icon: "question-circle",
                click: "webix.message('About pressed')"
            }, {
                view: "icon",
                icon: "times-circle",
                click: "$$('aperio_window').hide();"
            }]
        },
        height: 500,
        width: "auto",
        moveable: true,
        body: {
            view: "layout",
            rows: [{
                    cols: [layoutAnnotationFileList, layoutAnnotationList, layoutParameterList]
                },
                layoutROIInfo
            ]
        }
    };

    return {
        view: aperioWindow
    }
});