var config;
var study_name = [];
var viewer;

var current_filename;
var current_slide_url;
var mousetracker;

var PRECISION = 3;
var annotationState;
var cur_aperio_xml = {};
var CSO = {}; //This is what we bind everything to.. sets up the facets  CURRENT SLIDE OBJECT
var slideView = null;


var $slideSelector; //this is the slide /select2 selector

$(document).ready(function() {
    handleResize();
    window.onresize = handleResize;

    $slideSelector = $("#slideGroup_sel").select2() //Initialize the select2 plugin filter

    load_slideGroups(); //load Slide Groups on initial load... may want to add a clalback function for loading slides?
    //just removed width and height properties... this should now be handled elsewhere

    annotationState = new AnnotationState();
    //onresize event for the left panel
    //resize the webix dataview
    $('body').layout('panel', 'west').panel({
        onResize: function() {
            var newWidth = $('body').layout('panel', 'west').width();
            $$("dataview1").define("width", newWidth);
            $$("dataview1").resize();
        }
    });


    //Creating Multiple Templates using this new logic...
    webix.type(webix.ui.dataview, {
        name: "typeA",
        template: "<div class=''>#rank#.</div>" +
            "<div class='title'>#title#</div>" +
            "<div class='year'>#year# year</div>"
    });

    webix.ui({
        view: "dataview",
        id: "dataview1",
        container: "wbx_thumb_target",
        select: true,
        height: 600,
        pager: {
            id: "pager",
            size: 10,
            group: 4,
            container: "thumb_pager",
        },
        template: "<div class='webix_strong'>#slide_name#</div> <img src='" + iip_url + "#iip_thumbnail#'> ",
        datatype: "json",
        type: { height: 200, width: 250 },
        on: {
            "onItemClick": function(id, e, node) {

                use_iip = false;
               use_iip ? dzi_url = iip_url + this.getItem(id).iip_slide_w_path : dzi_url = base_url + this.getItem(id).slide_w_path;


                viewer.open(dzi_url);
                //$("#status_bar").html(this.getItem(id).slide_name);
                $("#footer").dialog('setTitle', this.getItem(id).slide_name);
                CSO = this.getItem(id); //NOW WE NEED TO BIND CSO
                
            },
            "onAfterLoad": function() {
                first_slide = $$("dataview1").getItem($$("dataview1").getFirstId());
                viewer.open(iip_url + first_slide.iip_slide_w_path);
                //$("#status_bar").html(first_slide.slide_name);
                $("#footer").dialog('setTitle', first_slide.slide_name);
                CSO = first_slide;

               
            }
        }
    });


});


//Need to set a template for using IIP vs Python as the host... TO DO
