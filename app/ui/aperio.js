define("ui/aperio", ["pubsub", "d3", "zoomer", "svg", "aperio"], function(pubsub, d3, viewer, svg, aperio) {
 
    var imageWidth = 1;
    pubsub.subscribe("SLIDE", function(msg, slide) {
        $$("file_list").clearAll();
        $$("file_list").parse(slide.aperio);
        $$("file_list").refresh();

        if(typeof slide.tiles !== "undefined"){
            imageWidth = slide.tiles.sizeX;
            $$("aperio_xml_tree").refresh();
        }
    });

    webix.DataDriver.AperioXML = webix.extend({
        records:"/*/Annotation",
        child:function(obj){
            if(obj.$level == 1)
                return obj.Regions;
            if(obj.$level == 2)
                return obj.Region;
        }
    }, webix.DataDriver.xml);

    var aperioXmlTree = {
        view:"tree",
        type:"lineTree",
        threeState: true,
        select: true,
        url:"http://digitalslidearchive.emory.edu/v1/aperio/home/mkhali8/test.xml",
        datatype:"AperioXML",
        id: "aperio_xml_tree",
        ready:function(){
            this.openAll();
        },
        template:function(obj, common){
           var icons = common.icon(obj, common) + common.checkbox(obj, common) + common.folder(obj, common);
           var text = "";

            if(obj.$level == 1){
                text = "Annotation " + obj.Id;
                obj.LineColor = aperio.rgb2hex(obj.LineColor);
            }
            if(obj.$level == 2){
                var allheader = [];
                for(var i = 0; i<obj.RegionAttributeHeaders.AttributeHeader.length; i++)
                    allheader.push(obj.RegionAttributeHeaders.AttributeHeader[i].Name);
                text = "Regions";
            }
            if(obj.$level == 3){
                text = "Region " + obj.Id;
                obj.Coords = aperio.transformVertices(obj.Vertices.Vertex, imageWidth);
            }

            return icons + text;
        },
        on:{
            onItemCheck: function(){
                $(".boundaryClass").remove();
                $$("region_attributes").clearAll();

                var regionAttr = [];
                $.each(this.getChecked(), function(index, id){
                    var tree = $$("aperio_xml_tree");
                    item = tree.getItem(id);

                    if(item.$level == 3){  
                        var annotationId = tree.getParentId(tree.getParentId(id));
                        strokeColor = tree.getItem(annotationId).LineColor;

                        regionAttr.push(item);
                        d3.select(viewer.svgOverlay().node()).append("polygon")
                          .attr("points",item.Coords)
                          .style('fill', "blue")
                          .attr('opacity', 0.2)
                          .attr('class', 'boundaryClass')
                          .attr('stroke', strokeColor)
                          .attr('stroke-width', 0.003);
                        };
                });
              
                $$("region_attributes").parse(regionAttr); 
            },
            onItemClick: function(id){
                console.log(this.getItem(id));
            }
        }
    };

    var fileList = {
        view: "list",
        height: 200,
        id: "file_list",
        template: "#name#",
        select: true,
        on: {
            onItemClick: function(id){
                $$("aperio_xml_tree").clearAll();
                $$("aperio_xml_tree").load(this.getItem(id).url);
                $(".boundaryClass").remove();
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
        id: "region_attributes",
        columns: ROIColumns
    };

    var aperioWindow = {
        view: "window",
        id: "aperio_window",
        move: true,
        resize: true,
        //position:"center",
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
        height: 400,
        width: 700,
        body: {
            rows: [{
                    cols: [fileList, aperioXmlTree, parameterList]
                },
                layoutROIInfo
            ]
        }
    };

    return {
        view: aperioWindow
    }
});