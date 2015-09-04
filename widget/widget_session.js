// widget_session() machine
//
// EVENTS:
//

//   `connected`
//   `cookie-exist`
//   `cookie-not-exist`
//   `init`
//   `off`
//   `fail`



var WidgetSession = Automat.extend({

    construct: function(begin_state) {
        this.state = begin_state;
        this.name = "widget_session";
        debug.log('CREATED AUTOMAT ' + this.name);
    },

    kill: function(){
        debug.log('DESTROY AUTOMAT ' + this.name);
    },
    
    state_changed: function (old_state, new_state, event, args) {
    },

    A: function(event, args) {
        // Access method to interact with widget_session() machine.
        switch (this.state) {
            //---COOKIE?---
            case 'COOKIE?': {
                if ( event === 'off' ) {
                    this.state = 'CLOSED';
                    this.doCookieDelete(event, args);
                    this.doDestroyMe(event, args);
                } else if ( event === 'cookie-exist-free' ) {
                    this.state = 'FREE';
                    this.doInit(event, args);
                    this.doStartFreeVersion(event, args);
                } else if ( event === 'cookie-not-exist' ) {
                    this.state = 'CONNECTING?';
                    this.doConnect(event, args);
                } else if ( event === 'cookie-exist-paid' ) {
                    this.state = 'PAID';
                    this.doInit(event, args);
                    this.doStartPaidVersion(event, args);
                }
                break;
            }
            //---CONNECTING?---
            case 'CONNECTING?': {
                if ( event === 'fail' || event === 'off' ) {
                    this.state = 'CLOSED';
                    this.doCookieDelete(event, args);
                    this.doDestroyMe(event, args);
                } else if ( event === 'connected' && this.isServicePaid(event, args) ) {
                    this.state = 'PAID';
                    this.doCookieSave(event, args);
                    this.doInit(event, args);
                    this.doStartPaidVersion(event, args);
                } else if ( event === 'connected' && ! this.isServicePaid(event, args) ) {
                    this.state = 'FREE';
                    this.doCookieSave(event, args);
                    this.doInit(event, args);
                    this.doStartFreeVersion(event, args);
                }
                break;
            }
            //---PAID---
            case 'PAID': {
                if ( event === 'not-paid' ) {
                    this.state = 'FREE';
                    this.doSetNotPaid(event, args);
                    this.doCookieSave(event, args);
                    this.doKillPaidVersion(event, args);
                    this.doStartFreeVersion(event, args);
                    this.doShowWidget(event, args);
                }
                break;
            }
            //---FREE---
            case 'FREE': {
                break;
            }
            //---AT_STARTUP---
            case 'AT_STARTUP': {
                if ( event === 'init' ) {
                    this.state = 'COOKIE?';
                    this.doSessionInit(event, args);
                    this.doReadCookie(event, args);
                }
                break;
            }
            //---CLOSED---
            case 'CLOSED': {
                break;
            }
        }
    },


    isServicePaid: function(event, args) {
        // Condition method.
        debug.log(this.name+".isServicePaid('"+event+"', "+args+")", CallFeedOptions);
        try {
        	return CallFeedOptions.mode == 'paid';
        } catch (e) {
        	return false;
        }
    },
    
    doSessionInit: function(event, args) {
        // Action method.
        debug.log(this.name+".doSessionInit('"+event+"', "+args+")", "REFERRER:", document.referrer);
        this.referrer = document.referrer;
        this.hostname = window.location.hostname;
    },

    doReadCookie: function(event, args) {
        // Action method.
		$.cookie.json = true;
    	var cook_activated = $.cookie('callfeed_activated_'+CallFeedToken);
        debug.log(this.name+".doReadCookie('"+event+"', "+args+")", cook_activated);
        if (CallFeedDebug) {
            debug.log('SKIP COOKIE IN DEBUG VERSION');
	        // $.cookie('callfeed_activated_'+CallFeedToken, false, { expires: 1, path: '/' });
    		CallFeedOptions = null;
    		this.event('cookie-not-exist');
    		return;
        }
		if (cook_activated == undefined) {
	        // $.cookie('callfeed_activated_'+CallFeedToken, false, { expires: 1, path: '/' });
    		CallFeedOptions = null;
    		this.event('cookie-not-exist');
    		return;
		}
    	var opts = simpleStorage.get('callfeed_'+CallFeedToken);
    	if (!opts || opts.length == 0) {
    		CallFeedOptions = null;
    		this.event('cookie-not-exist');
    		return;
		}
    	try{
        	if (!(opts.position && opts.mode && opts.controllers)) {
        		CallFeedOptions = null;
        		this.event('cookie-not-exist');
        		return;
        	}
    		CallFeedOptions = opts;
    		if (CallFeedOptions.flag_disable_on_mobiles && isTouchDevice()) {
        		CallFeedOptions = null;
        		this.event('off');
        		return;
    		}
        	if (CallFeedOptions.mode == 'paid') {
        		this.event('cookie-exist-paid');
        		return;
        	} else {
        		this.event('cookie-exist-free');
        		return;
        	}
    	} catch (e) {
    		CallFeedOptions = null;
    		this.event('off');
    		return;
    	}
    },

    doCookieSave: function(event, args) {
        // Action method.
        debug.log(this.name+".doCookieSave('"+event+"', "+args+")");
        debug.log('SAVE SETTINGS!', CallFeedOptions)
        simpleStorage.set('callfeed_'+CallFeedToken, CallFeedOptions);
    },

    doCookieDelete: function(event, args) {
        // Action method.
        debug.log(this.name+".doCookieDelete('"+event+"', "+args+")");
        debug.log('DELETE SETTINGS!')
        simpleStorage.flush();
    },
    
    doInit: function(event, args) {
        // Action method.
    	sources = CallFeedGenerateSources(CallFeedToken, CallFeedOptions);
    	CallFeedOptions = sources[4];
        debug.log(this.name+".doInit('"+event+"', "+args+")", CallFeedOptions);
    	$('body').append($(this._prepare_html_source(sources[0])));
    	$('body').append($(this._prepare_html_source(sources[1])));
    	$('body').append($(this._prepare_html_source(sources[2])));
        debug.log('INIT!', CallFeedOptions)
    },
    
    doInitDefaults: function(event, args) {
        // Action method.
    	sources = CallFeedGenerateSources(CallFeedToken, null);
    	CallFeedOptions = sources[4];
        debug.log(this.name+".doInitDefaults('"+event+"', "+args+")", CallFeedOptions);
    	$('body').append($(this._prepare_html_source(sources[0])));
    	$('body').append($(this._prepare_html_source(sources[1])));
    	$('body').append($(this._prepare_html_source(sources[2])));
        debug.log('INIT DEFAULTS!', CallFeedOptions)
    },    

    doConnect: function(event, args) {
        // Action method.
        debug.log(this.name+".doConnect('"+event+"', "+args+"): ", this.hostname, encodeURIComponent(this.hostname));
        jsonp_request('http://callfeed.net/input?'+$.param({
    		'request_options': '1',
    		'token': CallFeedToken,
    		'hostname': encodeURIComponent(this.hostname)
    	}),
	        function(data) {
	            var response = "error";
	            var message = "";
	            var options = null;
	            var sett = null;
	            var mode = null;
	            try {
	            	response = data['response'];
	            	message = data['message'];
	            } catch (e) {
	            	debug.log("doConnect.success EXCEPTION", e);
	            	CallFeedSession.event('fail');
	            	return;
	            }
	            if (response != 'ok') {
	            	debug.log("doConnect.success response is not OK: ", message);
	            	CallFeedSession.event('fail');
	            	return;
	            }
	            try {
	            	mode = data['mode'];

	            	sett = data['options'];
	            	for (var key in sett) if (sett.hasOwnProperty(key) && (typeof sett[key] === 'string' || sett[key] instanceof String)) {
            	    	sett[key] = from_unicode_escape(sett[key]);
	            	}
	            	options = sett;
	            	
	            	sett = data['managers']
	            	for (var key in sett) if (sett.hasOwnProperty(key)) {
            	    	sett[key]['role'] = from_unicode_escape(sett[key]['role']);
            	    	sett[key]['name'] = from_unicode_escape(sett[key]['name']);
	            	}
	            	options['managers'] = sett;
	            	
	            	options['schedule'] = data['schedule'];
	            	if (options['color_font_global'] &&
	            		options.color_font_global.toLowerCase() != '#fff' &&
	            		options.color_font_global.toLowerCase() != '#ffffff')
	            		options.color_font_link = '#666';
	            } catch(e) {
	            	debug.log("doConnect.success EXCEPTION while parsing response", e);
	            	CallFeedSession.event('fail');
	            	return;
	            }	 
	            if (response == 'ok' && options && mode && options['managers']) {
		            debug.log("doConnect.success", data);
	        		if (options['flag_disable_on_mobiles'] && isTouchDevice()) {
		            	CallFeedSession.event('off');
	            		return;
	        		}
	            	if (mode == 'off') {
		            	debug.log('This widget IS NOT ACTIVE at the moment !!!!!!');
		            	CallFeedSession.event('off');
	            	} else {
		            	CallFeedOptions = options;
		            	CallFeedOptions.mode = mode;
		            	debug.log('SETTINGS DOWNLOADED!', CallFeedOptions);
		            	CallFeedSession.event('connected');
	            	}
	            } else {
	            	debug.log('doConnect FAILED', data);
	            	CallFeedSession.event('fail');
	            }
	        },
	        function(url) {
	            debug.log("doConnect.fail", url);
	            CallFeedSession.event('fail');
	        }
    	);
    },
    
    doStartPaidVersion: function(event, args) {
        // Action method.
        debug.log(this.name+".doStartPaidVersion('"+event+"', "+args+")");
        CallFeedWidget = new WidgetController("AT_STARTUP", this); 
        CallFeedWidget.event("init");
    },

    doStartFreeVersion: function(event, args) {
        // Action method.
        debug.log(this.name+".doStartFreeVersion('"+event+"', "+args+")");
        CallFeedWidget = new WidgetController("AT_STARTUP", this); 
        CallFeedWidget.event("init");
    },

    doKillPaidVersion: function(event, args) {
        // Action method.
        debug.log(this.name+".doKillPaidVersion('"+event+"', "+args+")");
        CallFeedWidget.kill();
        CallFeedWidget = null;
        delete CallFeedWidget;
    },
    
    doShowWidget: function(event, args) {
        // Action method.
        debug.log(this.name+".doShowWidget('"+event+"', "+args+")");
        CallFeedWidget.event('show');
    },
    
    doSetNotPaid: function(event, args) {
        // Action method.
        debug.log(this.name+".doSetNotPaid('"+event+"', "+args+")");
        CallFeedOptions.mode = 'free';
    },

    doDestroyMe: function(event, args) {
        // Action method.
        debug.log(this.name+".doDestroyMe('"+event+"', "+args+")");
        CallFeedSession.kill();
        CallFeedSession = null;
        CallFeedOptions = null;
    },
    
    _prepare_html_source: function(html_src) {
    	var html_src_new = html_src;
    	// debug.log(html_src_new);
    	html_src_new = html_src_new.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
    	
    	/*
    	debug.log(html_src_new);
    	if (document.characterSet.toLowerCase() == 'windows-1251') {
	    	debug.log('_prepare_html_source: detected windows-1251 charset !!!!');
		    var aa = html_src_new, bb = '', c = 0;
		    for (var i = 0; i < aa.length; i++) {
		        c = aa.charCodeAt(i);
		        if (c > 127) {
		        	//bb += '\\u'+aa.charAt(i).toString(16).toUpperCase();
		        	bb += aa[i].normalize('NFC');
		        } else {
		            bb += aa.charAt(i);
		        }

	        	/*
		        c = aa.charCodeAt(i);
		        if (c > 127) {
		            if (c > 1024) {
		                if (c == 1025) {
		                    c = 1016;
		                } else if (c == 1105) {
		                    c = 1032;
		                }
			        	debug.log(c, aa[i], String.fromCharCode(c - 848));
		                bb += String.fromCharCode(c - 848);
		            }
		        } else {
		            bb += aa.charAt(i);
		        }
		        */
    	/*
		    }
		    html_src_new = bb;
    	}
    	*/
    	// debug.log(html_src_new);
    	return html_src_new;
    }
    
});
