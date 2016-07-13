define("viewer", ["osd", "osdhelper", "osdhook", "ko", "jquery", "obs"], function(osd, helper, hook, ko, $, obs){

	var viewer;
	
	function init(){
		//console.log(obs);
			
		viewer = osd({
			id: 'image_viewer',
			prefixUrl: "bower_components/openseadragon/built-openseadragon/openseadragon/images/",
			navigatorPosition: "BOTTOM_LEFT",
			showNavigator: true,
			tileSources: "http://node15.cci.emory.edu/cgi-bin/iipsrv.fcgi?DeepZoom=/PYRAMIDS/PYRAMIDS/CDSA/GBM_Frozen/intgen.org_GBM.tissue_images.3.0.0/TCGA-06-0137-01A-01-BS1.svs.dzi.tif.dzi"
		});

		imgHelper = viewer.activateImagingHelper({ onImageViewChanged: onImageViewChanged });
		viewer.addHandler('open', onImageOpen);
		viewer.addHandler('close', onImageClose);
		viewer.addHandler('open-failed', function(evt) {console.log('tile source opening failed', evt)});
	    viewer.addHandler('animation', function() {console.log(viewer.viewport.getBounds())});
	   
		return viewer;
	}

	function onImageViewChanged(event) {
		var boundsRect = viewer.viewport.getBounds(true);
	    obs.statusObj.viewportX(boundsRect.x);
	    obs.statusObj.viewportY(boundsRect.y);
	    obs.statusObj.viewportW(boundsRect.width);
	    obs.statusObj.viewportH(boundsRect.height);
	    obs.statusObj.dataportLeft(imgHelper.physicalToDataX(imgHelper.logicalToPhysicalX(boundsRect.x)));
	    obs.statusObj.dataportTop(imgHelper.physicalToDataY(imgHelper.logicalToPhysicalY(boundsRect.y)) * imgHelper.imgAspectRatio);
	    obs.statusObj.dataportRight(imgHelper.physicalToDataX(imgHelper.logicalToPhysicalX(boundsRect.x + boundsRect.width)));
	    obs.statusObj.dataportBottom(imgHelper.physicalToDataY(imgHelper.logicalToPhysicalY(boundsRect.y + boundsRect.height)) * imgHelper.imgAspectRatio);
	    obs.statusObj.scaleFactor(imgHelper.getZoomFactor());

	    var p = imgHelper.logicalToPhysicalPoint(new osd.Point(0, 0));

	    obs.svgOverlayVM.annoGrpTranslateX(p.x);
	    obs.svgOverlayVM.annoGrpTranslateY(p.y);
	    obs.svgOverlayVM.annoGrpScale(obs.statusObj.scaleFactor());
	}

	function onImageOpen(event){
		osdCanvas = $(viewer.canvas);
	    obs.statusObj.haveImage(true);

	    osdCanvas.on('mouseenter.osdimaginghelper', osd.onMouseEnter);
	    osdCanvas.on('mousemove.osdimaginghelper', osd.onMouseMove);
	    osdCanvas.on('mouseleave.osdimaginghelper', osd.onMouseLeave);

	    obs.statusObj.imgWidth(imgHelper.imgWidth);
	    obs.statusObj.imgHeight(imgHelper.imgHeight);
	    obs.statusObj.imgAspectRatio(imgHelper.imgAspectRatio);
	    obs.statusObj.scaleFactor(imgHelper.getZoomFactor());
	    obs.slideInfoObj.slideWidth(imgHelper.imgWidth);
	    obs.slideInfoObj.slideHeight(imgHelper.imgHeight);
	}

	function onImageClose(event){
		osdCanvas = $(viewer.canvas);
	    obs.statusObj.haveImage(false);
	    osdCanvas.off('mouseenter.osdimaginghelper', osd.onMouseEnter);
	    osdCanvas.off('mousemove.osdimaginghelper', osd.onMouseMove);
	    osdCanvas.off('mouseleave.osdimaginghelper', osd.onMouseLeave);
	    osdCanvas = null;
	}

	return{
		init: init
	}
});

