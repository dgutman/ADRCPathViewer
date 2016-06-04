var SlideInfoView = Backbone.View.extend({
	el: "#slide_info",

	template: _.template("<div><%= slide_name %></div>"),

	initialize: function(){
		console.log("init slide info");
		console.log(this.model.defaults);
		//this.slidename.html(this.model.CSO.slide_name);
		this.render();
	},

	render: function(){
		console.log(this.model.toJSON());
		this.$el.html(this.template(this.model.toJSON()));
	}
});