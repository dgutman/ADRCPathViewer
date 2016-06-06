var sync = Backbone.sync;

Backbone.sync = function(method, model, options){
	options.crossDomain = true;
	options.beforeSend = function(){
	//	this.url = "http://adrcdev.digitalslidearchive.emory.edu" + this.url;
	}

	return sync.call(this, method, model, options);
};