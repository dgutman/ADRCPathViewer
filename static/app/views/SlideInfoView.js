backbone_base_url  = "";


var SlideInfoView = Backbone.View.extend({
	el: "#SlideInfoView",

	events: {
		"click .save": "updateSlideName"
	},

	initialize: function(){
		this.model.on("change", this.render, this);
		this.render();
	},

	render: function(){
		var that = this;

		$.get(backbone_base_url + "/app/templates/SlideViewInfoTemplate.html", function(data){
			template = _.template(data);
			that.$el.html(template(that.model.toJSON()));
		}, "html");

		return this;
	},

	updateSlideName: function(){
		this.model.updateName($("#new_slide_name").val());
		this.model.save({slide_name: $("#new_slide_name").val()}, {
			success: function(model){console.log("model")}
		});
	}
});