var SlideView = Backbone.View.extend({
	el: "#SlideView",

	events:{
		"click #show_filter": function(){$('#filter_dialog').dialog('open')},
		"click #show_debug": function(){$('#debug_dialog').dialog('open')},
		"click #show_comment_dialog": function(){$('#comment_dialog').dialog('open')},
		"click #report_bad_image_btn": "report"
	},

	initialize: function(){
		this.filter = $("#show_filter");
	  	this.report = $("#report_bad_image_btn");
	  	this.debug = $("#show_debug");
	  	this.annotateor = $("#show_annotator");
	  	this.comment = $("#show_comment_dialog");
	},

	report: function(){
		console.log("report bad slide");
		this.model.save({"bad": true}, {
			success: function(model){console.log("model")}
		})
	}
});