var config;

var study_name = [];
var viewer;

var current_filename;
var current_slide_url;
var mousetracker;

var PRECISION = 3;

var CSO = {};  //This is what we bind everything to.. sets up the facets  CURRENT SLIDE OBJECT

$(document).ready(function() {
    handleResize();
    window.onresize = handleResize;

    load_slideGroups(); //load Slide Groups on initial load... may want to add a clalback function for loading slides?
            //just removed width nd height properties... this should now be handld
            
    webix.ui(
        {
            view:"dataview", 
            id:"dataview1",
            container:"wbx_thumb_target",
            select:true,
            
            height: 600,
    		pager:{
    		id:"pager",
    	    size:10,
    	    group:4,
    		container:"thumb_pager",
        },
        template:"<div class='webix_strong'>#slide_name#</div> <img src='" + base_host+ "#thumbnail_image#'> ",
        datatype: "json",
        type:{ height: 200, width: 250 },
        on: {
            "onItemClick": function(id, e, node){

                    viewer.open( iip_host+this.getItem(id).iip_slide_w_path);
                    $("#status_bar").html(this.getItem(id).slide_name);
                    CSO = this.getItem(id);  //NOW WE NEED TO BIND CSO
                    // show_slidelabel( CSO );  //this will go away soon1!!
                    
                    //let us update the button view for this slide
                    new SlideView({model: new SlideModel(CSO)});

                    //let us update the info view for this slide
                    new SlideInfoView({model: new SlideModel(CSO)});
                    new DebugInfoView({model: new SlideModel(CSO)});
            },
            "onAfterLoad": function(){
                    first_slide = $$("dataview1").getItem($$("dataview1").getFirstId());
                    viewer.open( iip_host + first_slide.iip_slide_w_path);
                    $("#status_bar").html(first_slide.slide_name);
                    CSO = first_slide;

                    //let us update the button view for this slide
                    new SlideView({model: new SlideModel(CSO)});

                    //let us update the info view for this slide
                    new SlideInfoView({model: new SlideModel(CSO)});


                    new DebugInfoView({model: new SlideModel(CSO)});
                    // show_slidelabel( CSO );
            }
        }
    });

    $("#slideGroup_sel").select2() //Initialize the select2 plugin filter
});
