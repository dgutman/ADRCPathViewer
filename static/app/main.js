var sync = Backbone.sync;

Backbone.sync = function(method, model, options){
	options.beforeSend = function(){
		this.url = "http://...." + this.url;
	}

	return sync.call(this, method, model, options);
};