var SlideView = Backbone.View.extend({
	el: "#SlideView",

	events:{
		"click #show_filter": function(){$('#filter_dialog').dialog('open')},
		"click #show_debug": function(){$('#debug_dialog').dialog('open')},
		"click #show_comment_dialog": function(){$('#comment_dialog').dialog('open')},
		"click #report_bad_image_btn": "report"
	},

	initialize: function(){
		$("#comment_dialog").dialog({autoOpen: false, closed: true,
      		buttons: [{"text" : "Save", "click" : function() {}}]
   		});

    	$("#filter_dialog").dialog({ autoOpen: false,  closed: true, width: 'auto'  });
    	$("#filter_dialog").html(color_filter_html); ///Loads the color filter selection for the disabled

    	$("#debug_dialog").dialog({  autoOpen: false,  width: 'auto', closed: true, });
	},

	report: function(){
		console.log("report bad slide");
		this.model.save({"bad": true}, {
			success: function(model){console.log("model")}
		})
	}
});