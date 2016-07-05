



define(["viewer", "ui", "webix"], function(viewer, ui) {
  
   	webix.ready(function(){
		var zoomer = viewer.init();
   		ui.build(zoomer);

	});
	

	
});


