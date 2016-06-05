var SlideInfoView = Backbone.View.extend({
	el: "#slide_info",

	events: {
		"blur #new_slide_name": "updateslidename"
	},

	initialize: function(){
		this.model.on("change", this.render, this);
		this.render();
	},

	render: function(){
		this.$el.html(JST["slide_info"](this.model.toJSON()));
		return this;
	},

	updateslidename: function(){
		this.model.set("slide_name", $("#new_slide_name").val());
	}
});