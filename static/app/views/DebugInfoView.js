backbone_base_url  = "";


var DebugInfoView = Backbone.View.extend({
	el: "#backbone_debugger",

	initialize: function(){
		//this.model.on("change", this.render, this);
		this.render();
	},

	render: function(){
		var that = this;

		$.get(backbone_base_url + "/app/templates/DebugInfoViewTemplate.html", function(data){
			template = _.template(data);
			that.$el.html(template(that.model.toJSON()));
		}, "html");

		return this;
	},

	
});