define("viewer", ["osd", "osdhelper", "osdhook"], function(osd, helper, hook){


var viewer;  //This probably needs to not be public in this function TODO


//TO DO-- ADD ALL OF THESE FUNCTIONS TO MAYBE A VIEWERHANDLER MODULE???

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
    statusObj.dataportBottom(imgHelper.physicalToDataY(imgHelper.logicalToPhysicalY(boundsRect.y + boundsRect.height)) * imgHelper.imgAspectRatio);
    statusObj.scaleFactor(imgHelper.getZoomFactor());

    var p = imgHelper.logicalToPhysicalPoint(new OpenSeadragon.Point(0, 0));

    svgOverlayVM.annoGrpTranslateX(p.x);
    svgOverlayVM.annoGrpTranslateY(p.y);
    svgOverlayVM.annoGrpScale(statusObj.scaleFactor());

    var annoGrp = document.getElementById('annoGrp');
   // annoGrp.setAttribute("transform", annoGrpTransformFunc());
}



// //
// // ===============	Mouse event handlers for viewer =================
// //

//
//	Mouse enter event handler for viewer
//
//
function onMouseEnter(event) {
	statusObj.haveMouse(true);
}


//
// Mouse move event handler for viewer
//
//
function onMouseMove(event) {
	var offset = osdCanvas.offset();

	statusObj.mouseRelX(event.pageX - offset.left);
	statusObj.mouseRelY(event.pageY - offset.top);		
	statusObj.mouseImgX(imgHelper.physicalToDataX(statusObj.mouseRelX()));
	statusObj.mouseImgY(imgHelper.physicalToDataY(statusObj.mouseRelY()));
}


//
//	Mouse leave event handler for viewer
//
//
function onMouseLeave(event) {
	statusObj.haveMouse(false);
}



function onMouseClick(event) {

    clickCount++;
    if( clickCount === 1 ) {
        // If no click within 250ms, treat it as a single click
        singleClickTimer = setTimeout(function() {
                    // Single click
                    clickCount = 0;
                }, 250);
    } else if( clickCount >= 2 ) {
        // Double click
        clearTimeout(singleClickTimer);
        clickCount = 0;
        nucleiSelect();
    }
}







	function init(){
		 viewer = osd({
			id: 'image_viewer',
			prefixUrl: "bower_components/openseadragon/built-openseadragon/openseadragon/images/",
			navigatorPosition: "BOTTOM_LEFT",
			showNavigator: true,
			tileSources: "http://node15.cci.emory.edu/cgi-bin/iipsrv.fcgi?DeepZoom=/PYRAMIDS/PYRAMIDS/CDSA/GBM_Frozen/intgen.org_GBM.tissue_images.3.0.0/TCGA-06-0137-01A-01-BS1.svs.dzi.tif.dzi"
		});

		viewer.addHandler('open-failed', function(evt) {
       		console.log('tile source opening failed', evt);
	    });

	    viewer.addHandler('animation', function() {
	        var bounds = viewer.viewport.getBounds();
	        var message = bounds.x + ':' + bounds.y + ':' + bounds.width + ':' + bounds.height;
	    });

	    imgHelper = viewer.activateImagingHelper({onImageViewChanged: onImageViewChanged});
    viewerHook = viewer.addViewerInputHook({ hooks: [
                    {tracker: 'viewer', handler: 'clickHandler', hookHandler: onMouseClick}
            ]});

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


		return viewer;
	}




	return{
		init: init
	}
});

