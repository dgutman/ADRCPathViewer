//
//  Copyright (c) 2014-2015, Emory University
//  All rights reserved.
//
//  Redistribution and use in source and binary forms, with or without modification, are
//  permitted provided that the following conditions are met:
//
//  1. Redistributions of source code must retain the above copyright notice, this list of
//  conditions and the following disclaimer.
//
//  2. Redistributions in binary form must reproduce the above copyright notice, this list 
//  of conditions and the following disclaimer in the documentation and/or other materials
//  provided with the distribution.
//
//  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
//  EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
//  SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED 
//  TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
//  BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
//  CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY
//  WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
//  DAMAGE.
//
//
var annoGrpTransformFunc;
var IIPServer="";
var slideCnt = 0;
var curSlide = "";
var curDataset = "";
var curDataset = null;
var curClassifier = "none";

var clickCount = 0;
var curSlideInfo = {}  ; //This object stores state information and properties for the current slide

var viewer = null;
var imgHelper = null, osdCanvas = null, viewerHook = null;
var overlayHidden = false, selectMode = false, segDisplayOn = false;;
var olDiv = null;
var lastScaleFactor = 0;
var pyramids;
     


var boundsLeft = 0, boundsRight = 0, boundsTop = 0, boundsBottom = 0;
var panned = false;
var pannedX, pannedY;

var slideReq = null;

var osdImagePrefix = "images/openseadragon/"



//
// Initialization
// 
//   Get a list of available slides from the database
//   Populate the selection and classifier dropdowns
//   load the first slide
//   Register event handlers
//


$(function() {
//   slideReq = $_GET('slide');

//   // Create the slide zoomer, update slide count etc...
//   // We will load the tile pyramid after the slide list is loaded
//   //
  viewer = new OpenSeadragon.Viewer({ showNavigator: true, id: "image_zoomer", prefixUrl: osdImagePrefix, animationTime: 0.5});
  console.log("Viewer opened");
       viewer.addHandler('open-failed', function(evt) {
            console.log('tile source opening failed', evt);
        })

        viewer.addHandler('animation', function() {
            var bounds = viewer.viewport.getBounds();
            var message = bounds.x + ':' + bounds.y + ':' + bounds.width + ':' + bounds.height;
            $('.wsi-toolbar').text(message);
            //Need to add in something where this goes...
        });


  imgHelper = viewer.activateImagingHelper({onImageViewChanged: onImageViewChanged});
    viewerHook = viewer.addViewerInputHook({ hooks: [
                    {tracker: 'viewer', handler: 'clickHandler', hookHandler: onMouseClick}
            ]});

//dg_svg_layer = viewer.svgOverlay(); 


  //fF = 2.0  ; //FudgeFactor
  annoGrpTransformFunc = ko.computed(function() { 
          return 'translate(' + svgOverlayVM.annoGrpTranslateX() +
            ', ' + svgOverlayVM.annoGrpTranslateY() +
          ') scale(' + svgOverlayVM.annoGrpScale() + ')';
            }, this); 
  

  //
  // Image handlers
  //  
  viewer.addHandler('open', function(event) {
      console.log('Image has been opened');
    osdCanvas = $(viewer.canvas);
    statusObj.haveImage(true);

    osdCanvas.on('mouseenter.osdimaginghelper', onMouseEnter);
    osdCanvas.on('mousemove.osdimaginghelper', onMouseMove);
    osdCanvas.on('mouseleave.osdimaginghelper', onMouseLeave);

    statusObj.imgWidth(imgHelper.imgWidth);
    statusObj.imgHeight(imgHelper.imgHeight);
    statusObj.imgAspectRatio(imgHelper.imgAspectRatio);
    statusObj.scaleFactor(imgHelper.getZoomFactor());
  });



  viewer.addHandler('close', function(event) {
    osdCanvas = $(viewer.canvas);

    statusObj.haveImage(false);
    
        osdCanvas.off('mouseenter.osdimaginghelper', onMouseEnter);
        osdCanvas.off('mousemove.osdimaginghelper', onMouseMove);
        osdCanvas.off('mouseleave.osdimaginghelper', onMouseLeave);

    osdCanvas = null;
  });

  
  viewer.addHandler('animation-finish', function(event) {

    if( segDisplayOn ) {
    
      if( statusObj.scaleFactor() > 0.5 ) {
        //console.log('should be showing objects now..');

        // Zoomed in, show boundaries hide heatmap
        $('#anno').show();

        var centerX = statusObj.dataportLeft() + 
                ((statusObj.dataportRight() - statusObj.dataportLeft()) / 2);
        var centerY = statusObj.dataportTop() + 
                ((statusObj.dataportBottom() - statusObj.dataportTop()) / 2);
        
        if( centerX < boundsLeft || centerX > boundsRight ||centerY < boundsTop || centerY > boundsBottom ) {
          // Only update boundaries if we've panned far enough.             
          updateSeg();
        }
         
      } else {
          
        updateSeg();
        // Zoomed out, hide boundaries, show heatmap
        $('#anno').hide();
        // Reset bounds to allow boundaries to be drawn when
        // zooming in from a heatmap.
        boundsLeft = boundsRight = boundsTop = boundsBottom = 0;
      }
    }
  });


});

//   // get slide host info
//   //

  
//   // Set the update handlers for the selectors
//   $("#slide_sel").change(updateSlide);
//   $("#dataset_sel").change(updateDataset);


//   // Set filter for numeric input
//   $("#x_pos").keydown(filter);
//   $("#y_pos").keydown(filter);


// });



// // // Filter keystrokes for numeric input
// function filter(event) {

//   // Allow backspace, delete, tab, escape, enter and .  
//   if( $.inArray(event.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
//     // Allow Ctrl-A
//      (event.keyCode == 65 && event.ctrlKey === true) ||
//     // Allow Ctrl-C
//      (event.keyCode == 67 && event.ctrlKey === true) ||
//     // Allow Ctrl-X
//      (event.keyCode == 88 && event.ctrlKey === true) ||
//     // Allow home, end, left and right
//      (event.keyCode >= 35 && event.keyCode <= 39) ) {

//       return;
//   }
  
//   // Don't allow if not a number
//   if( (event.shiftKey || event.keyCode < 48 || event.keyCode > 57) &&
//     (event.keyCode < 96 || event.keyCode > 105) ) {

//       event.preventDefault();
//   }
// }

 
//
//  Get the url for the slide pyramid and set the viewer to display it
//
//
function updatePyramid() {

   curSlideInfo['curDataset'] = curDataset;
         curSlideInfo['curSlide'] = curSlide;

  updateSlideInfo() ; //Likely will refactor this; this object should get all of the associated metadata for the current slide
  slide = "";
  panned = false;
  heatmapLoaded = false;

  //Adding in some logic right here to get the number of objects segmented on this
        console.log('Loading segmented objects ...');


  // Zoomer needs '.dzi' appended to the end of the filename
  //#pyramid = "DeepZoom="+pyramids[$('#slide_sel').prop('selectedIndex')]+".dzi";
        //I alrady set the .dzi property on the python server side
  pyramid = pyramids[$('#slide_sel').prop('selectedIndex')];
  viewer.open(IIPServer + pyramid);
}


//Updates the curSlideInfo which contains slide properties and metadata about the currently selected slide
function updateSlideInfo() 
  {
  console.log("Updating slide info");
  $.ajax({
                url: "db/getslideinfo.php",
    method: 'POST',
                data: curSlideInfo,
                curSlide: curSlideInfo.curSlide,
        curDataset: curSlideInfo.curDataset,

                dataType: "json",
                success: function(data) {

                        //Need to change this to the format I am using...
      console.log('Should be updating the curslideinfo with additional properties');
      console.log(data)

      curSlideInfo = data;
      //Would love to bind some properties as well the the valObject

      slideInfoObj.slideWidth( data.width);
      slideInfoObj.slideHeight( data.height);
      slideInfoObj.TumorType(data.TumorType);
      slideInfoObj.slidename(data.slide_nouid); //This is the version with no extension but the full UID
      slideInfoObj.SegObjects(data.FeatObjs);  //This is the number of segmented nuclei on this slide
      slideInfoObj.HasAnnotations(data.HasAnnotations);
      slideInfoObj.slidename_full(data.slide_name_noext);
      slideInfoObj.FeatureFileDB(data.FeatureDB_CollName);

                }

        });



  }


//
//  Updates the dataset selector
//
// function updateDatasetList() {

//   var datasetSel = $("#dataset_sel");
//   console.log('Updating datasets');
  

//   // Get a list of datasets
//   $.ajax({
//     url: "db/getdatasets.php",
//     data: "",
//     dataType: "json",
//     success: function(data) {
      
//       //Need to change this to the format I am using...
//       console.log("Data sets haev been retrieved from the server...");
//       console.log(data);
//       console.log(curDataset);


//       for( var item in data ) {
//         datasetSel.append(new Option(data[item][0], data[item][0]));
//       }

//       if( curDataset === null ) {
//         curDataset = data[0][0];    // Use first dataset initially
//         console.log("Setting current data sets....");
//         console.log(curDataset);
//       } else {
//         datasetSel.val(curDataset);
//       }
                  
//       // Need to update the slide list since we set the default slide
//       //Should be updating the slide list now
//       console.log('Just finished laoding the main data set, now loading the slides');
//       updateSlideList();
      
//     }
//   });
// }





//
//  Updates the list of available slides for the current dataset
//
// function updateSlideList() {
//   var slideSel = $("#slide_sel");
//   var slideCntTxt = $("#count_patient");
//     console.log("Loading Slide Sets now");
//   console.log(curDataset);
//   console.log("Should have just pushed the dataset...");

// //      slideCntTxt.text(slideCnt);

// //      slideSel.empty();


//   //  $.getJSON("db/getslides.php").then(function(data) {
//   // console.log(data);
//   // console.log("WAS RETURNED??");
//  //            $.each(data.slide_list, function(idx, value) {
//   //  console.log(idx,value);
      
//  //                slideSel.append('<option value="' + value.slide_name + '" id="' + value + '">' + value.slide_name + '</option>');
//  //            })
//  //        });


//   // Get the list of slides for the current dataset
//   $.ajax({
//     type: "POST",
//     url: "db/getslides.php",
//     data: { dataset: curDataset },
//     dataType: "json",
//     success: function(data) {

//       var index = 0;

//       pyramids = data['paths'];
//       if( slideReq === null ) {
//         curSlide = String(data['slides'][0]);   // Start with the first slide in the list
//       } else {
//         curSlide = slideReq;
//       }
 
//       slideCnt = Object.keys(data['slides']).length;;
//       slideCntTxt.text(slideCnt);

//       slideSel.empty();
//       // Add the slides we have segmentation boundaries for to the dropdown
//       // selector
//       for( var item in data['slides'] ) {
        
//         if( slideReq != null && slideReq == data['slides'][item] ) {
//           index = item;
//         }
//         slideSel.append(new Option(data['slides'][item], data['slides'][item]));
//       }

//       if( index != 0 ) {
//         $('#slide_sel').prop('selectedIndex', index);
//       }

//       // Get the slide pyrimaid and display 
//       updatePyramid();
//     }
//   });
// }



//
//  Update annotation and viewport information when the view changes 
//  due to panning or zooming.
//
//
function onImageViewChanged(event) {

  var boundsRect = viewer.viewport.getBounds(true);

  // Update viewport information. dataportXXX is the view port coordinates
  // using pixel locations. ie. if dataPortLeft is  0 the left edge of the 
  // image is aligned with the left edge of the viewport.
  //
  statusObj.viewportX(boundsRect.x);
  statusObj.viewportY(boundsRect.y);
  statusObj.viewportW(boundsRect.width);
  statusObj.viewportH(boundsRect.height);
  statusObj.dataportLeft(imgHelper.physicalToDataX(imgHelper.logicalToPhysicalX(boundsRect.x)));
  statusObj.dataportTop(imgHelper.physicalToDataY(imgHelper.logicalToPhysicalY(boundsRect.y)) * imgHelper.imgAspectRatio);
  statusObj.dataportRight(imgHelper.physicalToDataX(imgHelper.logicalToPhysicalX(boundsRect.x + boundsRect.width)));
  statusObj.dataportBottom(imgHelper.physicalToDataY(imgHelper.logicalToPhysicalY(boundsRect.y + boundsRect.height))* imgHelper.imgAspectRatio);
  statusObj.scaleFactor(imgHelper.getZoomFactor());

  var p = imgHelper.logicalToPhysicalPoint(new OpenSeadragon.Point(0, 0));
  
  svgOverlayVM.annoGrpTranslateX(p.x);
  svgOverlayVM.annoGrpTranslateY(p.y);
  svgOverlayVM.annoGrpScale(statusObj.scaleFactor()); 
  
  var annoGrp = document.getElementById('annoGrp');
  annoGrp.setAttribute("transform", annoGrpTransformFunc());  
}









  // also check out this one..http://sachinchoolur.github.io/lightslider/examples.html
  function handleResize() {

      console.log('resize');
      // this is expensive, easier to just save these long term, but oh well.
      var nav_height = $(".navbar").height();
      var status_bar_height = $('#status_bar').height();
      var select_patient_height = $("#sel_patient").height();
      var left_width = $('#sel_image_frame').width();

   //   console.log(nav_height, status_bar_height, select_patient_height, left_width);
      $('#sel_image_scroll').height(window.innerHeight - (nav_height + status_bar_height + select_patient_height + 70));
      $('#zoom_frame').width(window.innerWidth - left_width - 10);
      $('#image_zoomer').width(window.innerWidth - left_width - 10);
      $('#image_zoomer').height(window.innerHeight - (nav_height + status_bar_height));
      $('.openseadragon-container').height(window.innerHeight - (nav_height + status_bar_height));
  }

  window.onresize = handleResize;
  //For now creating a globally scoped variable called
  wbx_slideSet_Info = [];

  function load_slideGroups() {
      /* This loads the list of slideGroups for the currently selected projects... this doesn't need any parameters*/
      $.getJSON(base_url + '/api/wbx/slideSet').done(function(data) {
          //First copy the list of slideGroups to a global array to keep track of..
          wbx_slideSet_Info = data;
          //Next... clear the current selector
          $('#slideGroup_sel').empty();

          $.each(data, function(idx, row) {
            $('#slideGroup_sel').append('<option value="' + row.id + '" id=' + row.id + '">' + row.id +'</option>');
          });
          load_thumbnail_data(data[0].id);
      });
	//Once this has finished loaded, it should load the first value/slide into the viewer so it's not blank
	
  	//if I change this to last.. it loads the last option
	//	$("#slideGroup_sel").val($("#slideGroup_sel option:first").val()).trigger("change");
	//	group_to_load = $("#slideGroup_sel").val()
	//	$('#slideGroup_sel').change();  //This will force the onchange event fo fire
	//	console.log('on change event should have been fired...');
	group_to_load = $("#slideGroup_sel option:first").val()

	$slideSelector.val(group_to_load).trigger("change");

	console.log(group_to_load);
  }


  function load_thumbnail_data(slideGroupName) {

    slideDataUrl = base_url + "/api/wbx/slideSet/"+slideGroupName;

    CSO.slideDataUrl = slideDataUrl;
    CSO.curSlideSet = slideGroupName;




    $$("dataview1").clearAll();
    $$("dataview1").load( slideDataUrl);
  }

//NEED TO ADD AN EVENT LISTENER FOR SLIDEGROUP_SEL FOR ONCHANGE..

 
  // $(function() {
  //     // initialize the image viewer and annotation state
  //     viewer = OpenSeadragon({
  //         id: "image_zoomer",
  //         prefixUrl: "images/openseadragon/",
  //     });

  //     viewer.addHandler('open-failed', function(evt) {
  //         console.log('tile source opening failed', evt);
  //     });

  //     viewer.addHandler('animation', function() {
  //         var bounds = viewer.viewport.getBounds();
  //         var message = bounds.x + ':' + bounds.y + ':' + bounds.width + ':' + bounds.height;
  //         $('.wsi-toolbar').text(message);
  //     });

  //     function showMouse(event) {
  //         // getMousePosition() returns position relative to page,
  //         // while we want the position relative to the viewer
  //         // element. so subtract the difference.
  //         var pixel = OpenSeadragon.getMousePosition(event).minus(OpenSeadragon.getElementPosition(viewer.element));

  //         document.getElementById("mousePixels").innerHTML = toString(pixel, true);

  //         if (!viewer.isOpen()) {
  //             return;
  //         }

  //         var point = viewer.viewport.pointFromPixel(pixel);
  //         document.getElementById("mousePoints").innerHTML = toString(point, true);
  //     }

  //     // showMouse doesn't exist, commented this out - jake
  //     OpenSeadragon.addEvent(viewer.element, "mousemove", showMouse);
  //     mousetracker = new OpenSeadragon.MouseTracker({
  //         element: viewer.element,
  //         clickTimeThreshold: 50,
  //         clickDistThreshold: 50,
  //         moveHandler: function(event) {
  //             // console.log(event.position);
  //         }
  //     });
  //      $('#slideGroup_sel').change(function() {
  //         load_thumbnail_data($("#slideGroup_sel option:selected").val());
  //     });
  // });


   function show_slidelabel( imageObject)
    {
      //call this when I load an image... load the thumbnail url if this is allowed
      slideLabel_image_url = base_host + imageObject.slideLabel_image;
      console.log(slideLabel_image_url);
      $("#curImgSlideLabel").attr('src',slideLabel_image_url);
    }



  function getParameterByName(name) {
      name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
      return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }




//
// Image data we want knockout.js to keep track of
//
var statusObj = {
  haveImage: ko.observable(false),
  haveMouse: ko.observable(false),
  imgAspectRatio: ko.observable(0),
  imgWidth: ko.observable(0),
  imgHeight: ko.observable(0),
  mouseRelX: ko.observable(0),
  mouseRelY: ko.observable(0),
  mouseImgX: ko.observable(0),
  mouseImgY: ko.observable(0),
  scaleFactor: ko.observable(0),
  viewportX: ko.observable(0),
  viewportY: ko.observable(0),
  viewportW: ko.observable(0),
  viewportH: ko.observable(0),
  dataportLeft: ko.observable(0),
  dataportTop: ko.observable(0),
  dataportRight: ko.observable(0),
  dataportBottom: ko.observable(0),
  samplesToFix: ko.observable(0)
};


var svgOverlayVM = {
  annoGrpTranslateX:  ko.observable(0.0),
  annoGrpTranslateY:  ko.observable(0.0),
  annoGrpScale:     ko.observable(1.0),
  annoGrpTransform: annoGrpTransformFunc
};

var slideInfoObj = {

    slidename: ko.observable(null),
    slideWidth: ko.observable(0),
    slideHeight: ko.observable(0),
    slideGroup: ko.observable(null),
    HasAnnotations: ko.observable(null),
    TumorType: ko.observable(null),
    SegObjects: ko.observable(0),
    slidename_full: ko.observable(null),
    FeatureFileDB: ko.observable(null)
    }

var vm = {
  statusObj:  ko.observable(statusObj),
  svgOverlayVM: ko.observable(svgOverlayVM),
  slideInfoObj: ko.observable(slideInfoObj)
};

// Apply binsing for knockout.js - Let it keep track of the image info
// and mouse positions
//
ko.applyBindings(vm);

