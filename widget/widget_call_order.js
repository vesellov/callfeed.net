// widget_call_order() machine
//
// EVENTS:
//

//   `init`
//   `order-button-clicked`
//   `send-success`
//   `stop`



var WidgetCallOrder = Automat.extend({

    construct: function(begin_state, parent) {
        this.state = begin_state;
        this.name = "widget_call_order";
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
        // Access method to interact with widget_call_order() machine.
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
                if ( event === 'send-success' ) {
                    this.state = 'SUCCESS!';
                    this.doPrintSuccess(event, args);
                } else if ( event === 'send-failed' ) {
                    this.state = 'FAIL';
                    this.doPrintError(event, args);
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
    	CallFeedWidget.visualizer._prepare_day_time('cf_order_day_select');
    	CallFeedWidget.visualizer._update_from_to_time('cf_order_day_select', 'cf_order_time_select');
    },

    doJSONPSend: function(event, args) {
        // Action method.
        debug.log(this.name+".doJSONPSend('"+event+"', "+args+")");
        jsonp_request('http://callfeed.net/input?'+$.param({
        		'token': CallFeedToken, 
        		'order_phone': $("#cf_order_call_input").val(),
        		'order_day': $("#cf_order_day_select").val(), 
        		'order_delta_day': convert_weekday_to_delta_days($("#cf_order_day_select").val()), 
        		'order_time': $("#cf_order_time_select").val(),
        		'referrer': encodeURIComponent(CallFeedSession.referrer),
        		'hostame': encodeURIComponent(CallFeedSession.hostname)
        	}),
            function(data) {
                debug.log("doJSONPSend.success", data);
                if (data.hasOwnProperty('response') && data['response'] == 'ok') {
                    CallFeedWidget.callorder.event('send-success', data);
                } else {
                	CallFeedWidget.callorder.event('send-failed', data);
                }
            },
            function(url) {
                debug.log("doJSONPSend.failed", url);
                CallFeedWidget.callorder.event('send-failed', url);
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
        $('#cf_order_sent_custom_text_value').html(CallFeedOptions.text_order_done);
        this.parent.event('order-sent');
        this._enable_fields();
    },
    
    doPrintError: function(event, args) {
        // Action method.
        debug.log(this.name+".doPrintError('"+event+"', "+args+")");
        $('#cf_order_sent_custom_text_value').html(CallFeedOptions.text_order_failed);
        this.parent.event('order-failed');
        this._enable_fields();
    },

    _enable_fields: function(){
        $('#cf_order_day_select, #cf_order_time_select').attr('disabled',false);
        $('#cf_order_call_input').prop('disabled',false);
        //$('#cf_order_day_select, #cf_order_time_select').css({'color': '#000!important'});
        //$('#cf_order_call_input').css({'color': '#000!important'});
    },
    
    _disable_fields: function(){
    	$('#cf_order_day_select, #cf_order_time_select').attr('disabled',true);
        $('#cf_order_call_input').prop('disabled',true);
        //$('#cf_order_day_select, #cf_order_time_select').css({'color': '#aaa!important'});
    	//$('#cf_order_call_input').css({'color': '#aaa!important'});
    },
    
    _bind_events: function () {
        $('#cf_order_call_button').click(function() {
        	if (!isValidPhoneNumber($('#cf_order_call_input').val())) {
            	$("#cf_order_call_panel").addClass('cf__notvalid');
            	$("#cf_order_call_input").addClass('cf__notvalid');
            } else {
            	$("#cf_order_call_panel").removeClass('cf__notvalid'); 
            	$("#cf_order_call_input").removeClass('cf__notvalid');
	    		CallFeedWidget.callorder.event('order-button-clicked');
            }
        });
    	$('#cf_order_call_input').focus(function() {
        	$("#cf_order_call_panel").removeClass('cf__notvalid'); 
        	$("#cf_order_call_input").removeClass('cf__notvalid');
    	});
    	$('#cf_order_call_input').hover(function() {
        	$("#cf_order_call_panel").removeClass('cf__notvalid'); 
        	$("#cf_order_call_input").removeClass('cf__notvalid');
    	});
    	$('#cf_order_day_select').change(function() {
    		CallFeedWidget.visualizer._update_from_to_time('cf_order_day_select', 'cf_order_time_select');
    	});
    }
    
});
