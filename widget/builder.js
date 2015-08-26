
function from_unicode_escape(x) {
	var r = /\\u([\d\w]{4})/gi;
	x = x.replace(r, function (match, grp) {
	    return String.fromCharCode(parseInt(grp, 16)); } );
	x = unescape(x);
	return x;
}

	
function CallFeedGenerateSources(my_token, settings){
	var sett = settings; 
	var defaults = CallFeedDefaultSettings(my_token);
	
    if (!sett)
    	sett = defaults;
    else {
    	for (var key in defaults) 
	        if (defaults.hasOwnProperty(key) && !sett.hasOwnProperty(key))
	        	sett[key] = defaults[key];
    	for (var controller_key in defaults.controllers)
	        if (defaults.controllers.hasOwnProperty(controller_key) && !sett.controllers.hasOwnProperty(controller_key))
	        	sett.controllers[key] = defaults.controllers[key];
    }
    
	for (var key in sett) if (sett.hasOwnProperty(key) && (typeof sett[key] === 'string' || sett[key] instanceof String)) {
	    try {
	    	sett[key] = from_unicode_escape(sett[key]);
	    } catch (e) { }
	}
   
    var preload = CallFeedBuildPreLoadHTML(sett);
    var embed = CallFeedBuildEmbedHTML(my_token, 'cf.min.js');
    var widget = CallFeedBuildHTML(sett);
    var styles = CallFeedBuildCSS(sett);

    debug.log('CallFeedGenerateSources', [preload, widget, styles, embed, sett]);
    
    return [preload, widget, styles, embed, sett];  
}

