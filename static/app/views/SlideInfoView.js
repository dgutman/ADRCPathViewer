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
		this.$el.html(JST["slide_info"](this.model.toJSON()));
		return this;
	},

	updateSlideName: function(){
		this.model.updateName($("#new_slide_name").val());
		this.model.save({slide_name: $("#new_slide_name").val()}, {
			success: function(model){console.log("model")}
		});
	}
});