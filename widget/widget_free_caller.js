// widget_free_caller() machine
//
// EVENTS:
//

//   `init`
//   `send-button-clicked`
//   `send-failed`
//   `send-success`
//   `stop`



var WidgetFreeCaller = Automat.extend({

    construct: function(begin_state, parent) {
        this.state = begin_state;
        this.name = "widget_free_caller";
        this.parent = parent;
        debug.log('CREATED AUTOMAT ' + this.name);
    },
    
    kill: function(){
        debug.log('DESTROY AUTOMAT ' + this.name);
    	this.parent = null;
    	delete this.parent;
    },

    state_changed: function (old_state, new_state, event, args) {
    },
    	
    A: function(event, args) {
        // Access method to interact with widget_free_caller() machine.
        switch (this.state) {
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
                if ( event === 'send-button-clicked' ) {
                    this.state = 'SENDING?';
                    this.doPrintSending(event, args);
                    this.doJSONPSend(event, args);
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
            //---SENDING?---
            case 'SENDING?': {
                if ( event === 'send-failed' ) {
                    this.state = 'FAIL';
                    this.doPrintError(event, args);
                } else if ( event === 'send-success' ) {
                    this.state = 'SUCCESS!';
                    this.doPrintSuccess(event, args);
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
        }
    },


    doInit: function(event, args) {
        // Action method.
        debug.log(this.name+".doInit('"+event+"', "+args+")");
        this._bind_events();
    	CallFeedWidget.visualizer._prepare_day_time('cf_free_day_select');
    	CallFeedWidget.visualizer._update_from_to_time('cf_free_day_select', 'cf_free_time_select');
    },

    doJSONPSend: function(event, args) {
        // Action method.
        debug.log(this.name+".doJSONPSend('"+event+"', "+args+")");
        jsonp_request('http://callfeed.net/input?'+$.param({
	    		'token': CallFeedToken, 
	    		'free_phone': $("#cf_free_call_input").val(),
        		'free_day': $("#cf_free_day_select").val(),
        		'free_time': $("#cf_free_time_select").val(),
        		'referrer': encodeURIComponent(CallFeedSession.referrer),
        		'hostame': encodeURIComponent(CallFeedSession.hostname)
	    	}),
	        function(data) {
	            if (data.hasOwnProperty('response') && data['response'] == 'ok') {
		            debug.log("doJSONPSend.success", data);
	                CallFeedWidget.freecaller.event('send-success', data);
	            } else {
		            debug.log("doJSONPSend.failed", data);
	            	CallFeedWidget.freecaller.event('send-failed', data);
	            }
	        },
	        function(url) {
	            debug.log("doJSONPSend.error", url);
	            CallFeedWidget.freecaller.event('send-failed', url);
	        }
	    );
    },

    doPrintReady: function(event, args) {
        // Action method.
        debug.log(this.name+".doPrintReady('"+event+"', "+args+")");
        this._enable_fields();
    },
    
    doPrintSending: function(event, args) {
        // Action method.
        debug.log(this.name+".doPrintSending('"+event+"', "+args+")");
        this._disable_fields();
    },

    doPrintSuccess: function(event, args) {
        // Action method.
        debug.log(this.name+".doPrintSuccess('"+event+"', "+args+")");
        $('#cf_free_sent_custom_text_value').html(CallFeedOptions.text_free_sent);
        this.parent.event('free-call-sent');
        this._enable_fields();
    },

    doPrintError: function(event, args) {
        // Action method.
        debug.log(this.name+".doPrintError('"+event+"', "+args+")");
        $('#cf_free_sent_custom_text_value').html(CallFeedOptions.text_free_failed);
        this.parent.event('free-call-failed');
        this._enable_fields();
    },

    _bind_events: function() {
        $('#cf_free_call_button').click(function() {
        	if (!isValidPhoneNumber($('#cf_free_call_input').val())) {
            	$("#cf_free_call_panel").addClass('cf__notvalid');
            	$("#cf_free_call_input").addClass('cf__notvalid');
            } else {
            	$("#cf_free_call_panel").removeClass('cf__notvalid'); 
            	$("#cf_free_call_input").removeClass('cf__notvalid');
	    		CallFeedWidget.freecaller.event('send-button-clicked');
            }
        });
    	$('#cf_free_call_input').focus(function() {
        	$("#cf_free_call_panel").removeClass('cf__notvalid'); 
        	$("#cf_free_call_input").removeClass('cf__notvalid');
    	});
    	$('#cf_free_call_input').hover(function() {
        	$("#cf_free_call_panel").removeClass('cf__notvalid'); 
        	$("#cf_free_call_input").removeClass('cf__notvalid');
    	});    	
    	$('#cf_free_day_select').change(function() {
    		CallFeedWidget.freecaller._update_from_to_time();
    	});
    },
    
    _enable_fields: function(){
        $('#cf_free_day_select, #cf_free_time_select').attr('disabled',false);
        $('#cf_free_call_input').prop('disabled',false);
    },
    
    _disable_fields: function(){
    	$('#cf_free_day_select, #cf_free_time_select').attr('disabled',true);
        $('#cf_free_call_input').prop('disabled',true);
    }
    
});
