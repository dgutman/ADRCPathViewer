define("ui/aperio", ["pubsub", "d3", "zoomer", "svg"], function(pubsub, d3, viewer, svg) {

    pubsub.subscribe("SLIDE", function(msg, slide) {
        $$("file_list").clearAll();
        $$("file_list").parse(slide.aperio);
        $$("file_list").refresh();     
    });

    var fileList = {
        view: "list",
        height: 200,
        id: "file_list",
        template: "#_Name#",
        select: true,
        on: {
            onItemClick: function(id){
                $(".boundaryClass").remove();
                $$("annotation_list").clearAll();
                $$("annotation_list").parse(this.getItem(id));
                $$("annotation_list").refresh();
            }
        }
    };

     var annotationList = {
        view: "list",
        height: 200,
        width: "auto",
        id: "annotation_list",
        template: "Annotation #_Id#",
        select: true,
        on: {
            onItemClick: function(id){
                $(".boundaryClass").remove();
                $$("region_list").clearAll();
                $$("region_list").parse(this.getItem(id)._Regions);
                $$("region_list").refresh();
            }
        }
    };

    var regionList = {
        view: "list",
        height: 200,
        width: "auto",
        id: "region_list",
        template: "Region #_Id#",
        select: true,
        on: {
            onItemClick: function(id){
                $(".boundaryClass").remove();
                d3.select(viewer.svgOverlay().node()).append("polygon")
                  .attr("points", this.getItem(id)._Coords)
                  .style('fill', "blue")
                  .attr('opacity', 0.2)
                  .attr('class', 'boundaryClass')
                  .attr('stroke', 'blue')
                  .attr('stroke-width', 0.001);

                $$("region_attributes").clearAll();
                $$("region_attributes").parse(this.getItem(id));
                $$("region_attributes").refresh();
            }
        }
    };


    var parameterList = {
        view: "datatable",
        width: "auto",
        id: "region_keyvalue",
        columns: [{
            'id': "Parameter"
        }, {
            'id': "Value"
        }],
        autoConfig: true

    };


    var ROIColumns = [{
        id: "_Id"
    }, {
        id: "_Name"
    }, {
        id: "_ReadOnly", header: "Read Only"
    }, {
        id: "_NameReadOnly"
    }, {
        id: "_LineColorReadOnly"
    }, {
        id: "_Incremental"
    }, {
        id: "_Type"
    }, {
        id: "_LineColor"
    }, {
        id: "_Visible"
    }, {
        id: "_Selected"
    }, {
        id: "_MarkupImagePath"
    }, {
        id: "_MacroName"
    }];

    var layoutROIInfo = {
        view: "datatable",
        width: "auto",
        id: "region_attributes",
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
                label: "Aperio Annotations"
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
        body: {
            rows: [{
                    cols: [fileList, annotationList, regionList, parameterList]
                },
                layoutROIInfo
            ]
        }
    };

    return {
        view: aperioWindow
    }
});