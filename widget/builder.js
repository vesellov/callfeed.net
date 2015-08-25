function padWithLeadingZeros(string) {
    return new Array(5 - string.length).join("0") + string;
}

function unicodeCharEscape(charCode) {
    return "\\u" + padWithLeadingZeros(charCode.toString(16));
}


function htmlEncode(value){
	//create a in-memory div, set it's inner text(which jQuery automatically encodes)
	//then grab the encoded contents back out.  The div never exists on the page.
	return $('<div/>').text(value).html();
}

function htmlDecode(value){
	return $('<div/>').html(value).text();
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

    /*
	for (var key in sett) if (sett.hasOwnProperty(key) && (typeof sett[key] === 'string' || sett[key] instanceof String)) {
	    var aa = sett[key];
	    var bb = '';
//		for (var i = 0; i < aa.length; i++) {
//            var charCode = aa.charCodeAt(i);
//            if (charCode > 127) {
//            	//bb += unicodeCharEscape(charCode);
//            	bb += aa.charAt(i);
//            } else {
//            	bb += aa.charAt(i);
//            }
//		}
	    // bb = htmlEncode(aa);
	    bb = aa;
		sett[key] = bb;
		delete aa;
		delete bb;
	}
	*/
   
    var preload = CallFeedBuildPreLoadHTML(sett);
    var embed = CallFeedBuildEmbedHTML(my_token, 'cf.min.js');
    var widget = CallFeedBuildHTML(sett);
    var styles = CallFeedBuildCSS(sett);

    debug.log('CallFeedGenerateSources', [preload, widget, styles, embed, sett]);
    
    return [preload, widget, styles, embed, sett];  
}

