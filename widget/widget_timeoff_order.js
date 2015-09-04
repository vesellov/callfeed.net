// widget_timeoff_order() machine
//
// EVENTS:
//

//   `init`
//   `order-button-clicked`
//   `send-failed`
//   `send-success`
//   `stop`



var WidgetTimeoffOrder = Automat.extend({

    construct: function(begin_state, parent) {
        this.state = begin_state;
        this.name = "widget_timeoff_order";
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
        // Access method to interact with widget_timeoff_order() machine.
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
                if ( event === 'order-button-clicked' ) {
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
    	CallFeedWidget.visualizer._prepare_day_time('cf_timeoff_day_select');
    	CallFeedWidget.visualizer._update_from_to_time('cf_timeoff_day_select', 'cf_timeoff_time_select');
    },

    doJSONPSend: function(event, args) {
        // Action method.
        debug.log(this.name+".doJSONPSend('"+event+"', "+args+")", CallFeedToken);
        jsonp_request('http://callfeed.net/input?'+$.param({
        		'token': CallFeedToken, 
        		'timeoff_phone': $("#cf_timeoff_call_input").val(),
        		'timeoff_day': $("#cf_timeoff_day_select").val(),
        		'timeoff_time': $("#cf_timeoff_time_select").val(),
        		'referrer': (CallFeedSession.referrer),
        		'hostname': (CallFeedSession.hostname)
        	}),
            function(data) {
                if (data.hasOwnProperty('response') && data['response'] == 'ok') {
                    debug.log("doJSONPSend.success", data);
                    CallFeedWidget.timeofforder.event('send-success', data);
                } else {
                    debug.log("doJSONPSend.failed", data);
                	CallFeedWidget.timeofforder.event('send-failed', data);
                }
            },
            function(url) {
                debug.log("doJSONPSend.failed", url);
                CallFeedWidget.timeofforder.event('send-failed', url);
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
        $('#cf_timeoff_sent_custom_text_value').html(CallFeedOptions.text_timeoff_done);
        this.parent.event('timeoff-order-sent');
        this._enable_fields();
    },
    
    doPrintError: function(event, args) {
        // Action method.
        debug.log(this.name+".doPrintError('"+event+"', "+args+")");
        $('#cf_timeoff_sent_custom_text_value').html(CallFeedOptions.text_timeoff_failed);
        this.parent.event('timeoff-order-failed');
        this._enable_fields();
    },

    _enable_fields: function(){
        $('#cf_timeoff_day_select, #cf_timeoff_time_select').attr('disabled',false);
        $('#cf_timeoff_call_input').prop('disabled',false);
    },
    
    _disable_fields: function(){
    	$('#cf_timeoff_day_select, #cf_timeoff_time_select').attr('disabled',true);
        $('#cf_timeoff_call_input').prop('disabled',true);
    },

    _bind_events: function() {
        $('#cf_timeoff_call_button').click(function() {
        	if (!isValidPhoneNumber($('#cf_timeoff_call_input').val())) {
            	$("#cf_timeoff_call_panel").addClass('cf__notvalid');
            	$("#cf_timeoff_call_input").addClass('cf__notvalid');
            } else {
            	$("#cf_timeoff_call_panel").removeClass('cf__notvalid'); 
            	$("#cf_timeoff_call_input").removeClass('cf__notvalid');
	    		CallFeedWidget.timeofforder.event('order-button-clicked');
            }
        });
    	$('#cf_timeoff_call_input').focus(function() {
        	$("#cf_timeoff_call_panel").removeClass('cf__notvalid'); 
        	$("#cf_timeoff_call_input").removeClass('cf__notvalid');
    	});
    	$('#cf_timeoff_call_input').hover(function() {
        	$("#cf_timeoff_call_panel").removeClass('cf__notvalid'); 
        	$("#cf_timeoff_call_input").removeClass('cf__notvalid');
    	});
    	$('#cf_timeoff_day_select').change(function() {
    		CallFeedWidget.visualizer._update_from_to_time('cf_timeoff_day_select', 'cf_timeoff_time_select');
    	});
    }
   
    
});
