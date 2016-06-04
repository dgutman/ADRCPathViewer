var SlideInfoView = Backbone.View.extend({
	el: "#slide_info",

	template: _.template(
		"<div>Slide name: <%= slide_name %></div>"+
		"<div>Slide group: <%= slideGroup %></div>"+
		"<div>File size: <%= file_size %></div>"+
		"<div>Dimensions: <%= width %> x <%= height %></div>"+
		"<div>Original resulution: <%= orig_resolution %></div>"+
		"<div>Patient ID: <%= pt_id %></div>"),

	initialize: function(){
		console.log(this.model.defaults);
		this.render();
	},

	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
	}
});