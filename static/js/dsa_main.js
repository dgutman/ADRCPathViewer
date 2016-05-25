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


  //For now creating a globally scoped variable called
  wbx_slideSet_Info = []

  function load_slideGroups() {
      /* This loads the list of slideGroups for the currently selected projects... this doesn't need any parameters*/
      $.getJSON(base_host + '/api/wbx/slideSet').done(function(data) {
          //First copy the list of slideGroups to a global array to keep track of..
          wbx_slideSet_Info = data;
          //Next... clear the current selector
          $('#slideGroup_sel').empty();

          $.each(data, function(idx, row) {
            $('#slideGroup_sel').append('<option value="' + row.id + '" id=' + row.id + '">' + row.id +'</option>');
          });

          wbx_load_thumbnail_data(data[0].id);
      });
	//Once this has finished loaded, it should load the first value/slide into the viewer so it's not blank
	


		//if I change this to last.. it loads the last option
		$("#slideGroup_sel").val($("#slideGroup_sel option:first").val());
		group_to_load = $("#slideGroup_sel").val()
		$('#slideGroup_sel').change();  //This will force the onchange event fo fire
		console.log('on change event should have been fired...');
	//wbx_load_thumbnail_data(group_to_load);

  }


  function wbx_load_thumbnail_data(slideGroupName) {

    slideDataUrl = "http://adrcdev.digitalslidearchive.emory.edu/api/wbx/slideSet/"+slideGroupName;
    $$("dataview1").clearAll();
    $$("dataview1").load( slideDataUrl);
  }

//NEED TO ADD AN EVENT LISTENER FOR SLIDEGROUP_SEL FOR ONCHANGE..



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
                  var html = sld_info.slide_name + '#' + sld_info.slide_w_path + '#' + sld_info.slide_name + '#' + base_host + sld_info.thumbnail_image;
                  html_for_dt.push([html]);

              })
              //   console.log(html_for_dt);
              //return false; //http://stackoverflow.com/questions/8224375/jquery-each-stop-loop-and-return-object
          load_slides_into_datatable(html_for_dt, 1); //This is a single column view
      })

  }



  function load_image(filename, image_url) {

      image_url = base_host + image_url;
      //annotationState.clearAnnotations();
      viewer.open(image_url);
      //Once an image is selected, buttons become clickable depending on the data source
      current_filename = filename;
      current_slide_url = image_url;
      $("#status_bar").text("Current image:" + current_filename); //update status bar to show current image name
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
              // console.log(event.position);
          }
      });
      $('#data_group').change(function() {
          load_thumbnail_data($("#data_group option:selected").val());
      });



       $('#slideGroup_sel').change(function() {
          wbx_load_thumbnail_data($("#slideGroup_sel option:selected").val());
      });





  });


