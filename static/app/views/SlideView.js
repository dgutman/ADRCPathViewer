var SlideView = Backbone.View.extend({
	el: "#dsa_layout",

	events:{
		"click #show_filter": function(){$('#filter_dialog').dialog('open')},
		"click #show_debug": function(){$('#debug_dialog').dialog('open')},
		"click #show_comment_dialog": function(){$('#comment_dialog').dialog('open')},
		"click #report_bad_image_btn": "report",
		"click #show_aperioxml": "show_aperio_annotations",
		"click .save": "updateSlideName"
	},

	initialize: function(){
		$("#comment_dialog").dialog({autoOpen: false, closed: true,
      		buttons: [{"text" : "Save", "click" : console.log("Save comment")}]
   		});

    	$("#filter_dialog").dialog({ autoOpen: false,  closed: true, width: 'auto'  });
    	$("#filter_dialog").html(color_filter_html); ///Loads the color filter selection for the disabled

    	$("#debug_dialog").dialog({  autoOpen: false,  width: 'auto', closed: true, });

    	$("#show_aperioxml").attr('disabled', !this.model.attributes.HasAperioXML );

    	this.model.on("change", this.render, this);
		this.render();
	},

	render: function(){
		var that = this;

		$.get("/app/templates/SlideViewInfoTemplate.html", function(data){
			template = _.template(data);
			that.$el.find("#SlideInfoView").html(template(that.model.toJSON()));
		}, "html");

		$.get("/app/templates/DebugInfoViewTemplate.html", function(data){
			template = _.template(data);
			that.$el.find("#backbone_debugger").html(template(that.model.toJSON()));
		}, "html");

		return this;
	},

	report: function(){
		var updateParams = {
			'updateType' : 'BadSlideInfo',
			'CSO': CSO,
			'SubmittedBy': "Gutman",
			'HostWithBadImage': 'localhost',
			'ClientBrowser' : 'TBD',
			'ClientIP' : '1.2.3.4',
			'bad' : true
		};

		this.model.save(updateParams, {
			success: function(model){console.log("model")}
		})
	},

	show_aperio_annotations: function(){
		xml_url = base_host + '/' + this.model.attributes.AperioXMLUrl;
		aperioController( xml_url);
	},

	updateSlideName: function(){
		this.model.updateName($("#new_slide_name").val());
		this.model.save({slide_name: $("#new_slide_name").val()}, {
			success: function(model){console.log("model")}
		});
	}
});