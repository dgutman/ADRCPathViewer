/*
Access modules and their variables from JavaScript console

In the JS console import the module. For example, to 
import the viewer module you will do:
Note: viewer is the module name. Modules names are all defined
in main.js. So refer to main.js to find out the module name as they
are abbreviated

> zoomer = require("zoomer");
> viewer = zoomer.viewer;
> annotationStte = zoomer.annotationState;

To access knockout observables
> obs = require("obs")

Now obs is an object having the following properties
{
	statusObj: statusObj,
	svgOverlayVM: svgOverlayVM,
	slideInfoObj: slideInfoObj,
	vm: vm
}

If for some reason a module not returning the variable you 
are looking for, then go to the module and add the variable 
you want to return to the return object
 */

define(["ui", "routes", "jquery", "webix"], function(ui, routes, $) {
	webix.ready(function(){
		ui.build();
		routes.init();
	});
});


