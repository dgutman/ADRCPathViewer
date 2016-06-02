var config;

var study_name = [];
var viewer;

var current_filename;
var current_slide_url;
var mousetracker;

var PRECISION = 3;
var selected_slide_name;


var CSO = {};  //This is what we bind everything to.. sets up the facets  CURRENT SLIDE OBJECT


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
                    selected_slide_name = this.getItem(id).slide_name;
                  },
                  "onAfterLoad": function(){
                    first_slide = $$("dataview1").getItem($$("dataview1").getFirstId());
                    viewer.open( iip_host + first_slide.iip_slide_w_path);
                    console.log(iip_host + first_slide.iip_slide_w_path);   
                    $("#status_bar").html(first_slide.slide_name);
                    selected_slide_name = first_slide.slide_name;
                  }
                }
    });


    //Load the config.json and based on whatever features are enabled, such as drawing, path reports, clinical data viewers
    // we load the proper js file and inject the necessary HTML to do this
    // need to debate if we stub in divs and/or targets for all potential features, or just create a generic place called
    //  addl_features and insert everything into there....


  
    /*
    * dialog box for addign slide comment
    * If save button is clicked, a POST request is created and submitted to the webservice
    * The URL of the POST request contains the slide name for which the comment is saved.
    */
    $("#comment_dialog").dialog({
      modal: true,
      autoOpen: false,
       closed: true,
      title: "Slide comment",
      buttons: [
        {   "text" : "Save", "click" : 
                function() {
                    var slide_comment = $("#slide_comment").val(); 
                    if(slide_comment.length){
                        $.ajax({
                            type: "POST",
                            url: base_host + "/api/v1/slides/" + selected_slide_name + "/comment",
                            data: {"comment": slide_comment},
                            dataType: "json"
                        });
                    }
                    $(this).dialog("close"); 
                } 
        },
        {   "text" : "Cancel", "click" : function(){ $(this).dialog("close"); } }
      ]
   });

    
    //These can be generated vi direct markup of the DIV's...
    //create the filter dialog  as a model
    $("#filter_dialog").dialog({ autoOpen: false,  closed: true, width: 'auto'  });
    
    //Filter dialog only opens on click....
    $('#show_filter').click(function() {   $('#filter_dialog').dialog('open');  return false;  });

    $("#debug_dialog").dialog({  autoOpen: false,  width: 'auto', closed: true, });


    $("#show_debug").click(function() {    $("#debug_dialog").dialog('open');  return false;  });
    $("#show_comment_dialog").click(function() {
        $("#comment_dialog").dialog('open');
        return false;
    });

  $('#report_bad_image_btn').click(function() {
            var url = '/api/v1/report_bad_image';
            $.ajax({
                type: "POST",
                url: url,
                data: {
                    slideData: CSO
                },
                async: false
            });
        });
    $("#filter_dialog").html(color_filter_html); ///Loads the color filter selection for the disabled


    //Initializing select2 filters here

///$("#dsa_layout").layout('collapse','east');
    $("#slideGroup_sel").select2() //Initialize the select2 plugin filter

});
