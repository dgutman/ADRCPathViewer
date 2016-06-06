var SlideModel = Backbone.Model.extend({
	urlRoot: "/slides",

	initialize: function(){
		this.setId();
	 },

	 updateName: function(newName){
	 	this.set("slide_name", newName);
	 },

	 setId: function(){
	 	this.set("id", this.attributes._id["$oid"]);
	 }
});