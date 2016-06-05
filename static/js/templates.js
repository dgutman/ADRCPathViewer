window.JST = {};

window.JST['slide_info'] = _.template(
	'<div style="padding:10px"><table>' + 
	'<tr><td>Slide name:</td><td> <%= slide_name %></td></tr>'+
	'<tr><td>Slide group:</td><td> <%= slideGroup %></td></tr>'+
	'<tr><td>File size:</td><td> <%= file_size %></td></tr>'+
	'<tr><td>Dimensions:</td><td> <%= width %> x <%= height %></td></tr>'+
	'<tr><td>Original resulution: </td><td><%= orig_resolution %></td></tr>'+
	'<tr><td>Patient ID:</td><td> <%= pt_id %></td></tr>' + 
	'</table><br/>'+
	'New slide name:<br/><input id="new_slide_name" value="<%= slide_name %>"/>'+
	'<button class="save">Save</button></div>'
);