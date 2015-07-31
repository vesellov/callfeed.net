// widget_dialer() machine
//
// EVENTS:
//

//   `call-failed`
//   `call-success`
//   `countdown-finished`
//   `fail`
//   `init`
//   `start`
//   `stop`
//   `success`



var WidgetDialer = Automat.extend({

    construct: function(begin_state, parent) {
        this.state = begin_state;
        this.name = "widget_dialer";
        this.parent = parent;
        debug.log('CREATED AUTOMAT ' + this.name);
    },
    
    kill: function(){
        debug.log('DESTROY AUTOMAT ' + this.name);
    	this.parent = null;
    	delete this.parent;
    	this.counter = null;
    	delete this.counter;
    	this.countdown_seconds = null;
    	delete this.countdown_seconds;
    },

    state_changed: function (old_state, new_state, event, args) {
    },


    A: function(event, args) {
        // Access method to interact with widget_dialer() machine.
        switch (this.state) {
            //---CONNECTING---
            case 'CONNECTING': {
                if ( event === 'fail' ) {
                    this.state = 'FAIL';
                    this.doPrintErrorMessage(event, args);
                } else if ( event === 'success' ) {
                    this.state = 'CALLING?';
                    this.doStartCounter(event, args);
                    this.doJSONPCall(event, args);
                    this.doPrintMTTCalling(event, args);
                } else if ( event === 'stop' ) {
                    this.state = 'READY';
                    this.doPrintReady(event, args);
                }
                break;
            }
            //---SUCCESS!---
            case 'SUCCESS!': {
                if ( event === 'stop' ) {
                    this.state = 'READY';
                    this.doPrintReady(event, args);
                }
                break;
            }
            //---AT_STARTUP---
            case 'AT_STARTUP': {
                if ( event === 'init' ) {
                    this.state = 'READY';
                    this.doInit(event, args);
                    this.doPrintReady(event, args);
                }
                break;
            }
            //---READY---
            case 'READY': {
                if ( event === 'start' ) {
                    this.state = 'CONNECTING';
                    this.doPrintConnecting(event, args);
                    this.doJSONPConnect(event, args);
                }
                break;
            }
            //---CALLING?---
            case 'CALLING?': {
                if ( event === 'call-success' ) {
                    //this.state = 'SUCCESS!';
                    //this.doStopCounter(event, args);
                    //this.doPrintSuccess(event, args);
                } else if ( event === 'stop' ) {
                    this.state = 'READY';
                    this.doStopCounter(event, args);
                    this.doPrintReady(event, args);
                } else if ( event === 'countdown-finished' ) {
                    this.state = 'LATE';
                    this.doPrintTimeExceed(event, args);
                } else if ( event === 'call-failed' ) {
                    this.state = 'FAIL';
                    this.doStopCounter(event, args);
                    this.doPrintErrorMessage(event, args);
                }
                break;
            }
            //---FAIL---
            case 'FAIL': {
                if ( event === 'stop' ) {
                    this.state = 'READY';
                    this.doPrintReady(event, args);
                }
                break;
            }
            //---LATE---
            case 'LATE': {
                if ( event === 'call-success' ) {
                    //this.state = 'SUCCESS!';
                    //this.doStopCounter(event, args);
                    //this.doPrintSuccess(event, args);
                } else if ( event === 'stop' ) {
                    this.state = 'READY';
                    this.doPrintReady(event, args);
                }
                break;
            }
        }
    },

    
    doInit: function(event, args) {
        // Action method.
        debug.log(this.name+".doInit('"+event+"', "+args+")");
    	// Init countdown
    	this.counter = null;
    	this.countdown_seconds = -1;
    },

    doJSONPCall: function(event, args) {
        // Action method.
        debug.log(this.name+".doJSONPCall('"+event+"', "+args+")", $("#cf_main_call_input").val());
        jsonp_request('http://callfeed.net/input?'+$.param({
        		'token': CallFeedToken, 
        		'phone': $("#cf_main_call_input").val(),
        		'referrer': encodeURIComponent(CallFeedSession.referrer),
        		'hostame': encodeURIComponent(CallFeedSession.hostname)
        	}),
            function(data) {
                debug.log("doJSONPCall.success", data);
                if (data.hasOwnProperty('response') && data['response'] == 'ok') {
                    CallFeedWidget.dialer.event('call-success', data);
                } else {
	            	debug.log("RESPONSE:", data['response'], data['message']);
                	CallFeedWidget.dialer.event('call-failed', data);
                }
            },
            function(url) {
                debug.log("doJSONPCall.fail", url);
                CallFeedWidget.dialer.event('call-failed', url);
            }
        );
    },

    doJSONPConnect: function(event, args) {
        // Action method.
        debug.log(this.name+".doJSONPConnect('"+event+"', "+args+")");
        jsonp_request('http://callfeed.net/input?'+$.param({
        		'token': CallFeedToken,
        	}),
            function(data) {
                debug.log("doJSONPConnect.success", data);
	            var response = "";
	            var mode = null;
	            try {
	            	response = data['response'];
	            	mode = data['mode'];
	            } catch (e) {
	            	debug.log("doJSONPConnect.success EXCEPTION", e);
	            	CallFeedWidget.dialer.event('fail', e);
	            	return;
	            }
	            if (response == 'ok') {
	            	if (mode && mode == 'paid')
	                	CallFeedWidget.dialer.event('success', data);
	            	else {
	            		CallFeedWidget.dialer.event('stop');
	            		CallFeedSession.event('not-paid');
	            	}
	            } else {
	            	debug.log("RESPONSE:", response, data['message']);
	            	CallFeedWidget.dialer.event('fail', data);                
	            }
            },
            function(url) {
                debug.log("doJSONPConnect.fail", url);
                CallFeedWidget.dialer.event('fail', url);
            }
        );
    },

    doStartCounter: function(event, args) {
        // Action method.
        debug.log(this.name+".doStartCounter('"+event+"', "+args+")");
        if (this.counter) {
            clearInterval(this.counter);       	
        }
        this.countdown_seconds = CallFeedOptions.countdown_from;
    	this.counter = setInterval(
    		function() {
    			//debug.log('countdown: ', CallFeedWidget.dialer.countdown_seconds);
    			CallFeedWidget.dialer.countdown_seconds -= 1;
    			if (CallFeedWidget.dialer.countdown_seconds == -1) {
    		        if (CallFeedWidget.dialer.counter) {
    		            clearInterval(CallFeedWidget.dialer.counter);
    		        }
		            CallFeedWidget.dialer.event('countdown-finished');
    				return;
    			}
    			CallFeedWidget.dialer._update_countdown_element();
    		},
		1000);
    },

    doStopCounter: function(event, args) {
        // Action method.
        debug.log(this.name+".doStopCounter('"+event+"', "+args+")");
        if (this.counter) {
        	debug.log('counter will be stopped:', this.counter);
            clearInterval(this.counter);
        }
        this.counter = null;
    	this.countdown_seconds = -1; //CallFeedOptions.countdown_from;
    	// this._update_countdown_element();
    },

    doPrintReady: function(event, args) {
        // Action method.
        debug.log(this.name+".doPrintReady('"+event+"', "+args+")");
        $('#cf_dial_custom_text_value').html(CallFeedOptions.text_dial_ready);
    },

    doPrintConnecting: function(event, args) {
        // Action method.
        debug.log(this.name+".doPrintConnecting('"+event+"', "+args+")");
        $('#cf_dial_custom_text_value').html(CallFeedOptions.text_dial_start);
    },
    
    doPrintMTTCalling: function(event, args) {
        // Action method.
        debug.log(this.name+".doPrintMTTCalling('"+event+"', "+args+")");
        $('#cf_dial_custom_text_value').html(CallFeedOptions.text_dial_calling);
    },

    doPrintSuccess: function(event, args) {
        // Action method.
        debug.log(this.name+".doPrintSuccess('"+event+"', "+args+")");
        $('#cf_dial_custom_text_value').html(CallFeedOptions.text_dial_success);
    },
    
    doPrintTimeExceed: function(event, args) {
        // Action method.
        debug.log(this.name+".doPrintTimeExceed('"+event+"', "+args+")");
        $('#cf_dial_custom_text_value').html(CallFeedOptions.text_dial_late);
    },

    doPrintErrorMessage: function(event, args) {
        // Action method.
        debug.log(this.name+".doPrintErrorMessage('"+event+"', "+args+")");
        $('#cf_dial_custom_text_value').html(CallFeedOptions.text_dial_failed);
    },

    _update_countdown_element: function() {
		var zeros = String(this.countdown_seconds);
	    while (zeros.length < 2)
	    	zeros = "0" + zeros;
		$('#cf_dial_countdown_text').html('00:'+zeros);
		var color = '#B9E0A5';
		if (this.countdown_seconds < 10) {
			color = '#FFE599';
		}
		if (this.countdown_seconds < 5) {
			color = '#F3B1CA';
		}
		$('#cf_dial_countdown_text').css({'color': color});
		debug.log('_update_countdown_element', zeros, color);
    }
    
});
