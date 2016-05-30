var config;
var sel_image_expanded = false;
var study_name = [];
var thumbs_xml;
var thumbs = {};
var thumbs_expanded = {};
var recent_study_name;
var viewer;

var pid;
var patient_data = {};
var temp;
var oTable;
var current_filename;
var current_slide_url;
var mousetracker;
var osd;
var PRECISION = 3;

$(document).ready(function() {
    handleResize();
    window.onresize = handleResize;


    load_slideGroups(); //load Slide Groups on initial load... may want to add a clalback function for loading slides?
            
    webix.ui({
                view:"dataview", 
                id:"dataview1",
                container:"wbx_thumb_target",
                select:true,
                width: 280,
                height: 600,
		pager:{
		id:"pager",
	        size:10,
	        group:4,
		container:"thumb_pager",
		    },
                template:"<div class='webix_strong'>#slide_name#</div> <img src='" + base_host+ "#thumbnail_image#'> ",
                datatype: "json",
                type:{ 
                    height: 200,     //  dimensions of each dataview item
                    width: 250 
                },
                on: {
                  "onItemClick": function(id, e, node){
                    console.log(this.getItem(id).iip_slide_w_path);
                    viewer.open( iip_host+this.getItem(id).iip_slide_w_path);
                    $("#status_bar").html(this.getItem(id).slide_name);
                    // /alert(base_host + "/DZIMS/" + this.getItem(id).slide_w_path );
                    //viewer.open()
                  },
                  "onAfterLoad": function(){
                    first_slide = $$("dataview1").getItem($$("dataview1").getFirstId());
                    viewer.open( iip_host + first_slide.iip_slide_w_path);
                    $("#status_bar").html(first_slide.slide_name);
                  }
                }
    });


    //Load the config.json and based on whatever features are enabled, such as drawing, path reports, clinical data viewers
    // we load the proper js file and inject the necessary HTML to do this
    // need to debate if we stub in divs and/or targets for all potential features, or just create a generic place called
    //  addl_features and insert everything into there....

    
    //New Cleaner way to get the data from Mongo ..
    //This pulls the data groups /tumor types and populates the main dropdown box

    //This code would allow me to instead of loading the default data group and/or select statement
    //would allow me to pass a URL parameter to go to a specific gtumor group
    // if (getParameterByName('data_grp') == "") {
    //     load_thumbnail_data(study_name[0]);
    // } else {
    //     $('#data_group').val(getParameterByName('data_grp'));
    //     load_thumbnail_data(getParameterByName('data_grp'));
    // }





    //create the filter dialog  as a model
    $("#filter_dialog").dialog({
        autoOpen: false,
        width: 'auto'
    });
    //Filter dialog only opens on click....
    $('#show_filter').click(function() {
        $('#filter_dialog').dialog('open');
        return false;
    });

    $("#debug_dialog").dialog({
        autoOpen: false,
        width: 'auto'
    });
    $("#show_debug").click(function() {
        $("#debug_dialog").dialog('open');
        return false;
    });

    $("#filter_dialog").html(color_filter_html); ///Loads the color filter selection for the disabled

});
