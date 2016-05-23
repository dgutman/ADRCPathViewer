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

    // var xhr = $.ajax({
    //     type: "GET",
    //     url: "config.json",
    //     async: false
    // });
    // config = JSON.parse(xhr.responseText);
    // xhr = $.ajax({
    //     type: "GET",
    //     url: config.study_name_url,
    //     async: false
    // });
window.onresize = handleResize;

    //New Cleaner way to get the data from Mongo ..
    //This pulls the data groups /tumor types and populates the main dropdown box

    //This code would allow me to instead of loading the default data group and/or select statement
    //would allow me to pass a URL parameter to go to a specific gtumor group
    if (getParameterByName('data_grp') == "") {
        load_thumbnail_data(study_name[0]);
    } else {
        $('#data_group').val(getParameterByName('data_grp'));
        load_thumbnail_data(getParameterByName('data_grp'));
    }
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
