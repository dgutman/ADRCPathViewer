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
      		buttons: [{"text" : "Save", "click" : console.log("Save comment")}]
   		});

    	$("#filter_dialog").dialog({ autoOpen: false,  closed: true, width: 'auto'  });
    	$("#filter_dialog").html(color_filter_html); ///Loads the color filter selection for the disabled

    	$("#debug_dialog").dialog({  autoOpen: false,  width: 'auto', closed: true, });
	},

	report: function(){
		console.log("report bad slide");
		//Define parameters to pass
		updateParams = {'updateType' : 'BadSlideInfo',
		'CSO': CSO,
		'SubmittedBy': "Gutman",
		'HostWithBadImage': 'localhost',
		'ClientBrowser' : 'TBD',
		'ClientIP' : '1.2.3.4',
		'bad' : true}

		this.model.save(updateParams, {
			success: function(model){console.log("model")}
		})
	}
});