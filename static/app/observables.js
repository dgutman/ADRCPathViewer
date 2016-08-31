define("obs", ["ko", "jquery", "config"], function(ko, $, config){

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
	    name: ko.observable(null),
	    label: ko.observable(null),
	    width: ko.observable(0),
	    height: ko.observable(0),
	    slideSet: ko.observable(null),
	    fileSize: ko.observable(null),
	    originalResolution: ko.observable(null),
	    hasAnnotations: ko.observable(null),
	    tumorType: ko.observable(null),
	    segObjects: ko.observable(0),
	    slidename_full: ko.observable(null),
	    featureFileDB: ko.observable(null),
	    slideDataUrl: ko.observable(null),

	    updateLabel: function(){
	    	data = {label: this.label()};
	    	url = config.BASE_URL + "/slide/" + this.name() + "/label";
	    	$.post(url, data, function(response){
	    		console.log(response);
	    	})
	    }
	};

	var vm = {
	    statusObj: ko.observable(statusObj),
	    svgOverlayVM: ko.observable(svgOverlayVM),
	    slideInfoObj: ko.observable(slideInfoObj),
	};

	ko.applyBindings(vm);
	
	return {
		statusObj: statusObj,
		svgOverlayVM: svgOverlayVM,
		slideInfoObj: slideInfoObj,
		vm: vm
	}
});