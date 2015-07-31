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
   
    var preload = CallFeedBuildPreLoadHTML(sett);
    var embed = CallFeedBuildEmbedHTML(my_token, 'cf.devel.js');
    var widget = CallFeedBuildHTML(sett);
    var styles = CallFeedBuildCSS(sett);

    debug.log('CallFeedGenerateSources', [preload, widget, styles, embed, sett]);
    
    return [preload, widget, styles, embed, sett];  
}

