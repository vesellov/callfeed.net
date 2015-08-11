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
    	this.checker = null;
    	delete this.checker;
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
            //---DIALING---
            case 'DIALING': {
                if ( event === 'status-received' && ! this.isCallFinished(event, args) ) {
                    this.doPrintStatus(event, args);
                } else if ( event === 'stop' ) {
                    this.state = 'READY';
                    this.doStopCounter(event, args);
                    this.doStopJSONPChecker(event, args);
                    this.doPrintReady(event, args);
                } else if ( event === 'status-received' && this.isCallFinished(event, args) ) {
                    this.state = 'READY';
                    this.doStopCounter(event, args);
                    this.doStopJSONPChecker(event, args);
                    this.doPrintSuccess(event, args);
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
                if ( event === 'status-received' ) {
                    this.state = 'DIALING';
                } else if ( event === 'stop' ) {
                    this.state = 'READY';
                    this.doStopCounter(event, args);
                    this.doStopJSONPChecker(event, args);
                    this.doPrintReady(event, args);
                } else if ( event === 'call-success' ) {
                    this.doSaveCallbackID(event, args);
                    this.doStartJSONPChecker(event, args);
                } else if ( event === 'countdown-finished' ) {
                    this.state = 'LATE';
                    this.doStopJSONPChecker(event, args);
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
                if ( event === 'stop' ) {
                    this.state = 'READY';
                    this.doPrintReady(event, args);
                }
                break;
            }
        }
    },


    isCallFinished: function(event, args) {
        // Condition method.
        var st = args['callback_status'];
        debug.log(this.name+".isCallFinished('"+event+"', "+args+")", st);
        return (st == 'succeed' || st == 'fail_a' || st == 'fail_b' || st == 'out_of_balance');
    },
    
    doInit: function(event, args) {
        // Action method.
        debug.log(this.name+".doInit('"+event+"', "+args+")");
    	// Init countdown
        this.checker = null;
    	this.counter = null;
    	this.countdown_seconds = -1;
    	this.callback_id = '';
    },

    doJSONPConnect: function(event, args) {
        // Action method.
        debug.log(this.name+".doJSONPConnect('"+event+"', "+args+")");
        jsonp_request('http://callfeed.net/input?'+$.param({
        		'token': CallFeedToken,
        	}),
            function(data) {
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
	                debug.log("doJSONPConnect.success", data);
	            	if (mode && mode == 'paid')
	                	CallFeedWidget.dialer.event('success', data);
	            	else {
	            		CallFeedWidget.dialer.event('stop');
	            		CallFeedSession.event('not-paid');
	            	}
	            } else {
	            	debug.log("doJSONPConnect RESPONSE:", data);
	            	CallFeedWidget.dialer.event('fail', data);                
	            }
            },
            function(url) {
                debug.log("doJSONPConnect.fail", url);
                CallFeedWidget.dialer.event('fail', url);
            }
        );
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
	            	debug.log("doJSONPCall.failed:", data);
                	CallFeedWidget.dialer.event('call-failed', data);
                }
            },
            function(url) {
                debug.log("doJSONPCall.fail", url);
                CallFeedWidget.dialer.event('call-failed', url);
            }
        );
    },

    doSaveCallbackID: function(event, args) {
        // Action method.
        debug.log(this.name+".doSaveCallbackID('"+event+"', "+args+")");
        try {
        	this.callback_id = args['mtt_response']['callBackCall_id'];
        } catch (e) {
        	CallFeedWidget.dialer.event('call-failed', args);
        }
    },

    doStartJSONPChecker: function(event, args) {
        // Action method.
        debug.log(this.name+".doStartJSONPChecker('"+event+"', "+args+")");
        if (this.checker) {
            clearInterval(this.checker);       	
        }
    	this.checker = setInterval(CallFeedWidget.dialer._JSONP_check, 1000);
    },
    
    doStopJSONPChecker: function(event, args) {
        // Action method.
        debug.log(this.name+".doStopJSONPChecker('"+event+"', "+args+")");
        if (this.checker) {
        	debug.log('checker will be stopped:', this.checker);
            clearInterval(this.checker);
        }
        this.checker = null;
    	this.callback_id = ''; 
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
    	this.countdown_seconds = -1; 
    },
    
    doPrintStatus: function(event, args) {
        // Action method.
        debug.log(this.name+".doPrintStatus('"+event+"', "+args+")");
        switch (args['callback_status']) {
	        case 'started': {
	            $('#cf_dial_custom_text_value').html(CallFeedOptions.text_dial_start);
	        	break;
	        }
	        case 'succeed': {
	            $('#cf_dial_custom_text_value').html(CallFeedOptions.text_dial_finished);
	        	break;
	        }
	        case 'planned': {
	        	// ???
	        	break;
	        }
	        case 'lasting': {
	            $('#cf_dial_custom_text_value').html(CallFeedOptions.text_dial_connected);
	        	break;
	        }
	        case 'fail_a': {
	            $('#cf_dial_custom_text_value').html(CallFeedOptions.text_dial_refused);
	        	break;
	        }
	        case 'fail_b': {
	            $('#cf_dial_custom_text_value').html(CallFeedOptions.text_dial_connected);
	        	break;
	        }
	        case 'out_of_balance': {
	            $('#cf_dial_custom_text_value').html(CallFeedOptions.text_dial_connected);
	        	break;
	        }
        }
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

    _JSONP_check: function() {
        debug.log(this.name+"._JSONP_check");
        jsonp_request('http://callfeed.net/input?'+$.param({
        		'request_status': 1,
        		'token': CallFeedToken, 
        		'callback_id': this.callback_id,
        		'hostame': encodeURIComponent(CallFeedSession.hostname)
        	}),
            function(data) {
                if (data.hasOwnProperty('response') && data['response'] == 'ok' && data.hasOwnProperty('status')) {
                    debug.log("_JSONP_check.success", data['status']);
                    CallFeedWidget.dialer.event('status-received', data['status']);
                } else {
	            	debug.log("_JSONP_check FAILED:", data);
                }
            },
            function(url) {
                debug.log("_JSONP_check.fail", url);
                CallFeedWidget.dialer.event('call-failed', url);
            }
        );
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
