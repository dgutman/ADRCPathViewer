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

//Defining urls for data grab functions
//    base_host = "http://adrcdev.digitalslidearchive.emory.edu"
//    iip_host = "http://digitalslidearchive.emory.edu"
datagroup_apiurl = base_url + '/api/wbx/slideSet';
//Change this image to be dyanmic loaded from a config.json file
 //container: "wbx_thumb_target",
   wbxDataViewer = {
        view: "dataview",
        id: "dataview1",
        
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

                console.log("YOU CLICKED A BUTTON");
                //$("#status_bar").html(this.getItem(id).slide_name);
                ////$("#footer").dialog('setTitle', this.getItem(id).slide_name);
                CSO = this.getItem(id); //NOW WE NEED TO BIND CSO
                console.log(CSO);
                viewer.open(dzi_url);

            },
            "onAfterLoad": function() {
                first_slide = $$("dataview1").getItem($$("dataview1").getFirstId());
                
                console.log(first_slide);

                viewer.open(iip_url + first_slide.iip_slide_w_path);
                //$("#status_bar").html(first_slide.slide_name);
                //$("#footer").dialog('setTitle', first_slide.slide_name);
                CSO = first_slide;
               
            }
        }
    };   



$(document).ready(function() {
    handleResize();
    window.onresize = handleResize;

   

    load_slideGroups(); //load Slide Groups on initial load... may want to add a clalback function for loading slides?
    //just removed width and height properties... this should now be handled elsewhere

    annotationState = new AnnotationState();
   
    leftPanel = {  
                        rows: [ { 'type': "header", 'template': "Slide Control"},
                        {'template': "FILTERME", height:150},
                        { view: "template",  content: "sel_groupName",width:250 },
                        wbxDataViewer, 
                        ],

                 width: 220, height:1000}
                        
infoPanel = { view: "template",  content: "SlideInfoView",width:250 }

               webix.ui({
                    container: "main_layout",
                    cols:[  
                        leftPanel, 
                        infoPanel,
                        { view: "resizer" },
                        { view: "template", content: "osd_main_container", height: "100%"},
                    ]
            });


    //Creating Multiple Templates using this new logic...
    webix.type(webix.ui.dataview, {
        name: "typeA",
        template: "<div class=''>#rank#.</div>" +
            "<div class='title'>#title#</div>" +
            "<div class='year'>#year# year</div>"
    });


webix.ui({
    view:"window",
    id:"my_win",
    head:"My Window",
    body:{
        template:"Some text"
    }
})

    webix.ui({
                view:"window",
                id:"win3",
                height:250,
                width:350,
                left:450, top:50,
                head:{
                    view:"toolbar", cols:[
                        {view:"label", label: "This window can be closed" },
                        { view:"button", label: 'Close Me', width: 100, align: 'right', click:"$$('win3').close();"}
                        ]
                }
                ,
                body:{
                    template:"Some text"
                }
            }).show();




   ko.applyBindings(vm);
});

//Need to set a template for using IIP vs Python as the host... TO DO

// Apply binsing for knockout.js - Let it keep track of the image info
// and mouse positions
//
 //onresize event for the left panel
    //resize the webix dataview
    // $('body').layout('panel', 'west').panel({
    //    onResize: function() {
   //         var newWidth = $('body').layout('panel', 'west').width();
      //      $$("dataview1").define("width", newWidth);
        //    $$("dataview1").resize();
   
