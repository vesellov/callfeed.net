

domReady(function(){

	var need_jq = false;
	
	if (typeof jQuery == 'undefined') {
		debug.log('no jQuery found');
		need_jq = true;
	} else {
		debug.log('found jQuery:', jQuery.fn.jquery);
		try {
			versions = jQuery.fn.jquery.split('.');
			if (parseInt(versions[1]) < 7) {
				debug.log('jQuery version too old, need at least 1.7');
				need_jq = true;
			}
		} catch(e) {
			debug.log('exception', e);
			need_jq = true;
		}
	}

	if (need_jq) {
	    var jq = document.createElement("script");
	    jq.type = "text/javascript";
	    jq.async = true;
	    jq.onload = function(){
	    	console.log('jQuery loaded:', jQuery.fn.jquery);
	    	init_callfeed(jQuery);
		};
	    jq.src = "http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js";
	    document.getElementsByTagName("head")[0].appendChild(jq);
	} else {
	    init_callfeed(jQuery);
	}
	
	function init_callfeed(jq) {
		
		if (CallFeedSession) {
			debug.log('INIT_CALLFEED FAILED!!!!, CallFeedSession already defined:', CallFeedSession);
			return;
		}
		
		window.$ = jq;
		debug.log('INIT_CALLFEED', $, $.fn.jquery, window);
		
		init_jquery_cookie(jq);

		if ((typeof CallFeedToken != 'undefined') && (CallFeedToken != null)) {
			debug.log('START UP NOW! token:', CallFeedToken);
			CallFeedSession = new WidgetSession("AT_STARTUP");
			CallFeedSession.event("init");
		} else {
			debug.log('ERROR! CallFeedToken not defined');
		}
		
	}
	
});
	
