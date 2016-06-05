var SlideInfoView = Backbone.View.extend({
	el: "#slide_info",

	initialize: function(){
		console.log(this.model.defaults);
		this.render();
	},

	render: function(){
		this.$el.html(JST["slide_info"](this.model.toJSON()));
	}
});