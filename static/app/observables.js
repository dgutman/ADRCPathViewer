define("obs", ["ko"], function(ko){

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
	    annoGrpTranslateX: ko.observable(0.0),
	    annoGrpTranslateY: ko.observable(0.0),
	    annoGrpScale: ko.observable(1.0)
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
	    FeatureFileDB: ko.observable(null),
	    slideDataUrl: ko.observable(null),
	    curSlideSet: ko.observable(null),
	    slideGroupName: ko.observable(null)
	};

	var vm = {
	    statusObj: ko.observable(statusObj),
	    svgOverlayVM: ko.observable(svgOverlayVM),
	    slideInfoObj: ko.observable(slideInfoObj)
	};

	ko.applyBindings(vm);
	
	return {
		statusObj: statusObj,
		svgOverlayVM: svgOverlayVM,
		slideInfoObj: slideInfoObj,
		vm: vm
	}
});