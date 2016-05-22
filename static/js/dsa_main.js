  window.onresize = handleResize;


    // also check out this one..http://sachinchoolur.github.io/lightslider/examples.html
    function handleResize() {

        console.log('resize');

        // this is expensive, easier to just save these long term, but oh well.

        var nav_height = $(".navbar").height();
        var status_bar_height = $('#status_bar').height();
        var select_patient_height = $("#sel_patient").height();
        var left_width = $('#sel_image_frame').width();

        console.log(nav_height, status_bar_height, select_patient_height, left_width);

        $('#sel_image_scroll').height(window.innerHeight - (nav_height + status_bar_height + select_patient_height + 70));
        $('#zoom_frame').width(window.innerWidth - left_width - 10);
        $('#image_zoomer').width(window.innerWidth - left_width - 10);
        $('#image_zoomer').height(window.innerHeight - (nav_height + status_bar_height));
        $('.openseadragon-container').height(window.innerHeight - (nav_height + status_bar_height));
    }

    window.onresize = handleResize;


 function load_expanded_thumbnail_data(name) {

        //This is a slightly different endpoint as instead of loading a column of data, I am loading 5 columns of data at a time...
        //but basic functionality is similar to above
        //all this is doing is basically reformatting the data for datatables


        recent_study_name = name;
        var html_for_expanded_dt = [];
        //This actually doesn't require me to load any data...
        //now want to load the data into the data table object
        //Now I need to load 5 slides per row, instead of 1
        if (!thumbs_expanded.hasOwnProperty(name)) {
            thumbs_expanded[name] = [];
            console.log(thumbs[name]);
            for (var i = 0; i <= thumbs[name].length - thumbs[name].length % 5; i += 5) {
                if (i == thumbs[name].length) break; //may need to make sure I don't need to push whatever is in the current row
                var row = [];
                for (var j = 0; j < 5 && ((i + j) < thumbs[name].length); j++) {

                    //Each row actually has the following info
                    var cur_html = thumbs[name][i + j].slide_name + '#' + thumbs[name][i + j].slide_url + '#' + thumbs[name][i + j].slide_name + '#' + thumbs[name][i + j].thumbnail_image;

                    row.push(cur_html);
                    //console.log(thumbs[name[i+j]]);
                }
                while (row.length < 5) {
                    row.push("");
                }

                thumbs_expanded[name].push(row);
                console.log(row);
            }
        }

        //console.log(html);

        load_slides_into_datatable(thumbs_expanded[name], 5);
    }



 function load_expanded_thumbnail_data(name) {

        //This is a slightly different endpoint as instead of loading a column of data, I am loading 5 columns of data at a time...
        //but basic functionality is similar to above
        //all this is doing is basically reformatting the data for datatables


        recent_study_name = name;
        var html_for_expanded_dt = [];
        //This actually doesn't require me to load any data...
        //now want to load the data into the data table object
        //Now I need to load 5 slides per row, instead of 1
        if (!thumbs_expanded.hasOwnProperty(name)) {
            thumbs_expanded[name] = [];
            console.log(thumbs[name]);
            for (var i = 0; i <= thumbs[name].length - thumbs[name].length % 5; i += 5) {
                if (i == thumbs[name].length) break; //may need to make sure I don't need to push whatever is in the current row
                var row = [];
                for (var j = 0; j < 5 && ((i + j) < thumbs[name].length); j++) {

                    //Each row actually has the following info
                    var cur_html = thumbs[name][i + j].slide_name + '#' + thumbs[name][i + j].slide_url + '#' + thumbs[name][i + j].slide_name + '#' + thumbs[name][i + j].thumbnail_image;

                    row.push(cur_html);
                    //console.log(thumbs[name[i+j]]);
                }
                while (row.length < 5) {
                    row.push("");
                }

                thumbs_expanded[name].push(row);
                console.log(row);
            }
        }

        //console.log(html);

        load_slides_into_datatable(thumbs_expanded[name], 5);
    }





    function load_thumbnail_data(name) {
        recent_study_name = name;
        var html_for_dt = [];

        $.getJSON(base_host + '/api/v2/slideSet/' + name).then(function(data) {
            thumbs[name] = data.slide_list;
            //now want to load the data into the data table object
            html_for_dt = []; //html for data table input
            $.each(data.slide_list, function(idx, sld_info) {

		//converted_URL for local src =..
		// add thumbnail as well
                    console.log(base_host)
                    var html = sld_info.slide_name + '#' + sld_info.slide_w_path+ '#' + sld_info.slide_name + '#' + base_host+sld_info.thumbnail_image;
                    html_for_dt.push([html]);

                })
                //   console.log(html_for_dt);
                //return false; //http://stackoverflow.com/questions/8224375/jquery-each-stop-loop-and-return-object
            load_slides_into_datatable(html_for_dt, 1); //This is a single column view
        })

    }

        //Below formats the data for either a 1 or 5 column data view
        //There are also separate call back functions for the single and 5 column viewer... but at least I consolidated
        // the function calls
        


 

    function load_image(filename, image_url) {

        if (sel_image_expanded) {
            $('#sel_image_frame').addClass('span3');
            $('#sel_image_frame').removeClass('span12');

            $('#zoom_frame').show();

            load_thumbnail_data(recent_study_name);
            sel_image_expanded = false;
        }

        image_url = base_host + image_url;
        //annotationState.clearAnnotations();
        viewer.open(image_url);


        //Once an image is selected, buttons become clickable depending on the data source
        $('#show_annotator').removeAttr('disabled');
        $("#show_metadata").removeAttr('disabled');
        $('#show_filter').removeAttr('disabled');
        current_filename = filename;
        current_slide_url = image_url;
        $('#report_bad_image_btn').removeAttr('disabled');
     	$("#status_bar").text("Current image:"+current_filename); //update status bar to show current image name




    }






    //Function for Delayed loading of thumbnails
    //See http://www.datatables.net/forums/discussion/1959/image-thumbs-in-table-column-lazy-loading/p1 for example
    function customFnRowCallback(nRow, aData, iDisplayIndex) {
        var rowdata = aData[0].split('#');
             console.log(rowdata);
        var html = '<a href=\"javascript:;\" onclick=\"load_image(\'' + rowdata[0] + '\',\'' + rowdata[1] + '\')\">' + rowdata[2] + '<br /><img src=\"' + rowdata[3] + '\"></a>';
        $('td:eq(0)', nRow).html(html);
        return nRow;
    }

    function customFnRowCallback_expanded(nRow, aData, iDisplayIndex) {
        for (var i = 0; i < 5; i++) {
            if (aData[i] == "") {
                $('td:eq(' + i + ')', nRow).html('');
                continue;
            }
            var rowdata = aData[i].split('#');
            var html = '<a href=\"javascript:;\" onclick=\"load_image(\'' + rowdata[0] + '\',\'' + rowdata[1] + '\')\">' + rowdata[2] + '<br /><img src=\"' + rowdata[3] + '\"></a>';
            $('td:eq(' + i + ')', nRow).html(html);
        }
        return nRow;
    }


   function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }


$(function() {
  // initialize the image viewer and annotation state
        viewer = OpenSeadragon({
            id: "image_zoomer",
            prefixUrl: "images/",
        });

        viewer.addHandler('open-failed', function(evt) {
            console.log('tile source opening failed', evt);
        });

        viewer.addHandler('animation', function() {
            var bounds = viewer.viewport.getBounds();
            var message = bounds.x + ':' + bounds.y + ':' + bounds.width + ':' + bounds.height;
            $('.wsi-toolbar').text(message);
        });

        function showMouse(event) {
            // getMousePosition() returns position relative to page,
            // while we want the position relative to the viewer
            // element. so subtract the difference.
            var pixel = OpenSeadragon.getMousePosition(event).minus(OpenSeadragon.getElementPosition(viewer.element));

            document.getElementById("mousePixels").innerHTML = toString(pixel, true);

            if (!viewer.isOpen()) {
                return;
            }

            var point = viewer.viewport.pointFromPixel(pixel);
            document.getElementById("mousePoints").innerHTML = toString(point, true);
        }

        // showMouse doesn't exist, commented this out - jake
        OpenSeadragon.addEvent(viewer.element, "mousemove", showMouse);
        mousetracker = new OpenSeadragon.MouseTracker({
            element: viewer.element,
            clickTimeThreshold: 50,
            clickDistThreshold: 50,
            moveHandler: function(event) {
                console.log(event.position);
            }
        });
            $('#data_group').change(function() {
            if (!sel_image_expanded) {
                //load_thumbs($("#data_group option:selected").val());
                load_thumbnail_data($("#data_group option:selected").val());
            } else {
                load_expanded_thumbnail_data($("#data_group option:selected").val());
            }
        });
     
});



 function load_slides_into_datatable(html_for_dataTable, images_per_row) {

        //Below formats the data for either a 1 or 5 column data view
        //There are also separate call back functions for the single and 5 column viewer... but at least I consolidated
        // the function calls

        if (images_per_row == 1) {
            aoColumns = [{
                "sTitle": "Image",
                "sClass": "center",
                "sType": "html"
            }];
            callback_to_use = customFnRowCallback;
        } else if (images_per_row == 5) {
            aoColumns = [{
                "sTitle": "Image",
                "sClass": "center",
                "sType": "html"
            }, {
                "sTitle": "Image",
                "sClass": "center",
                "sType": "html"
            }, {
                "sTitle": "Image",
                "sClass": "center",
                "sType": "html"
            }, {
                "sTitle": "Image",
                "sClass": "center",
                "sType": "html"
            }, {
                "sTitle": "Image",
                "sClass": "center",
                "sType": "html"
            }]

            callback_to_use = customFnRowCallback_expanded;

        }
       // console.log(aoColumns);



        ///I am currently using data tables for the thumbnail browser on the left, this code below loads it
        $('#count_patient').text(html_for_dataTable.length);
        $('#dynamic').html('<table cellpadding="0" cellspacing="0" border="0" class="display" id="example"></table>');
        oTable = $('#example').dataTable({
            "aaData": html_for_dataTable,
            "bLengthChange": false,
            "bSort": false,
            "bSortClasses": false,
            "iDisplayLength": 6,
            "bDeferRender": true,
            "fnRowCallback": callback_to_use,
            "aoColumns": aoColumns
        });



    }
