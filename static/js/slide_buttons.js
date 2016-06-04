var SlideViewerModel = Backbone.Model.extend({	 
	initialize: function(defaults){
		this.defaults = defaults;
	 }
});

var SlideView = Backbone.View.extend({
	el: "#slide_buttons",

	events: {
		"click #show_filter": "showFilter",
	    "click #report_bad_image_btn": "reportSlide",
	    "click #show_debug": "showDebug",
	    "click #show_annotator": "showAnnotator",
	    "click #show_comment_dialog": "showComment"
	},

	initialize: function(){
		this.filter = $("#show_filter");
	  	this.report = $("#report_bad_image_btn");
	  	this.debug = $("#show_debug");
	  	this.annotateor = $("#show_annotator");
	  	this.comment = $("#show_comment_dialog");

	  	//if we pass config variable we can enable/disable buttons based on it
	  	//this.filter.attr("disabled", !options.options.report);
	  },

	  showFilter: function(){
	    $('#filter_dialog').dialog('open');
	    return false;
	  },

	  reportSlide: function(){
	    return false;
	  },

	  showDebug: function(){
	    //$('#debug_dialog').dialog('open');
	    return false;
	  },

	  showAnnotator: function(){
	    //$('#filter_dialog').dialog('open');
	    return false;
	  },

	  showComment: function(){
	    //$('#comment_dialog').dialog('open');
	    return false;
	}
});