// widget_messanger() machine
//
// EVENTS:
//

//   `init`
//   `send-button-clicked`
//   `send-failed`
//   `send-success`
//   `stop`



var WidgetMessanger = Automat.extend({

    construct: function(begin_state, parent) {
        this.state = begin_state;
        this.name = "widget_messanger";
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
        // Access method to interact with widget_messanger() machine.
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
        this._apply_params();
        this._bind_events();
    },

    doJSONPSend: function(event, args) {
        // Action method.
        debug.log(this.name+".doJSONPSend('"+event+"', "+args+")");
        jsonp_request('http://callfeed.net/input?'+$.param({
	    		'token': CallFeedToken, 
	    		'message_phone': $("#cf_message_phone_input").val(),
	    		'message_email': $("#cf_message_email_input").val(),
	    		'message_text': $("#cf_message_message_textarea").val(),
        		'referrer': encodeURIComponent(CallFeedSession.referrer),
        		'hostame': encodeURIComponent(CallFeedSession.hostname)
	    	}),
	        function(data) {
	            if (data.hasOwnProperty('response') && data['response'] == 'ok') {
		            debug.log("doJSONPSend.success", data);
	                CallFeedWidget.messanger.event('send-success', data);
	            } else {
		            debug.log("doJSONPSend.failed", data);
	            	CallFeedWidget.messanger.event('send-failed', data);
	            }
	        },
	        function(url) {
	            debug.log("doJSONPSend.error", url);
	            CallFeedWidget.messanger.event('send-failed', url);
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
        $('#cf_message_sent_custom_text_value').html(CallFeedOptions.text_message_sent);
        this.parent.event('message-sent');
        this._enable_fields();
    },

    doPrintError: function(event, args) {
        // Action method.
        debug.log(this.name+".doPrintError('"+event+"', "+args+")");
        $('#cf_message_sent_custom_text_value').html(CallFeedOptions.text_message_failed);
        this.parent.event('message-failed');
        this._enable_fields();
    },

    _enable_fields: function(){
        $('#cf_message_message_textarea').removeAttr('disabled').removeClass('cf__disabled');
        $('#cf_message_phone_input, #cf_message_email_input').prop('disabled',false).removeClass('cf__disabled');
    },
    
    _disable_fields: function(){
    	$('#cf_message_message_textarea').attr('disabled','disabled').addClass('cf__disabled');
        $('#cf_message_phone_input, #cf_message_email_input').prop('disabled',true).addClass('cf__disabled');
        
    },

    _apply_params: function() {
		// Set parameters from settings
    	if (CallFeedOptions.flag_name_field_obligatory)
    		$('#cf_message_name_input').attr('placeholder', $('#cf_message_name_input').attr('placeholder')+'*');
    	if (CallFeedOptions.flag_email_field_obligatory)
    		$('#cf_message_email_input').attr('placeholder', $('#cf_message_email_input').attr('placeholder')+'*');
    	if (CallFeedOptions.flag_phone_field_obligatory)
    		$('#cf_message_phone_input').attr('placeholder', $('#cf_message_phone_input').attr('placeholder')+'*');
    	// Update widget height
    	var height_decrease = 0;
    	if (!CallFeedOptions.flag_name_field) {
    		height_decrease += 50;
    		$('#cf_message_name_input').hide();
    		$('#cf_message_message_textarea').css({'bottom':(parseInt($('#cf_message_message_textarea').css('bottom'))-50)+'px'});
		}
    	if (!CallFeedOptions.flag_email_field) {
    		height_decrease += 50;
    		$('#cf_message_email_input').hide();
    		$('#cf_message_message_textarea').css({'bottom':(parseInt($('#cf_message_message_textarea').css('bottom'))-50)+'px'});
    		$('#cf_message_name_input').css({'bottom':(parseInt($('#cf_message_name_input').css('bottom'))-50)+'px'});
		}
    	if (!CallFeedOptions.flag_phone_field) {
    		height_decrease += 50;
    		$('#cf_message_phone_input').hide();
    		$('#cf_message_message_textarea').css({'bottom':(parseInt($('#cf_message_message_textarea').css('bottom'))-50)+'px'});
    		$('#cf_message_name_input').css({'bottom':(parseInt($('#cf_message_name_input').css('bottom'))-50)+'px'});
    		$('#cf_message_email_input').css({'bottom':(parseInt($('#cf_message_email_input').css('bottom'))-50)+'px'});
		}
    	CallFeedOptions.param_message_height -= height_decrease;
    	if (height_decrease > 0) {
    		$('#cf_message_content').css({'height': CallFeedOptions.param_message_height+'px'});
    	}
    },

    _bind_events: function() {
        // Validate data when user press on "Send" button 
        $('#cf_message_send_button').click(function() {
        	var name_valid = false;
        	var email_valid = false;
        	var phone_valid = false;
        	if (CallFeedOptions.flag_name_field_obligatory && CallFeedOptions.flag_name_field) 
        		name_valid = $('#cf_message_name_input').val() != '';
        	else
        		name_valid = true;
        	if (CallFeedOptions.flag_email_field_obligatory && CallFeedOptions.flag_email_field) 
        		email_valid = isValidEmailAddress($('#cf_message_email_input').val());
        	else
        		email_valid = true;
        	if (CallFeedOptions.flag_phone_field_obligatory && CallFeedOptions.flag_phone_field)
				phone_valid = isValidPhoneNumber($('#cf_message_phone_input').val());
        	else
        		phone_valid = true;
        	if (name_valid && email_valid && phone_valid)
        		CallFeedWidget.messanger.event('send-button-clicked');
        	else {
        		debug.log(name_valid, email_valid, phone_valid);
            	if (CallFeedOptions.flag_name_field_obligatory && !name_valid)
                	$("#cf_message_name_input").addClass('cf__notvalid');
            	if (CallFeedOptions.flag_email_field_obligatory && !email_valid)
                	$("#cf_message_email_input").addClass('cf__notvalid');
            	if (CallFeedOptions.flag_phone_field_obligatory && !phone_valid)
                	$("#cf_message_phone_input").addClass('cf__notvalid');
        	}
        });
    	// Make "valid" input for user name 
        $('#cf_message_name_input').keyup(function(){
            var name = $("#cf_message_name_input").val();
            if (name)
            	$("#cf_message_name_input").removeClass('cf__notvalid').addClass('cf__valid');
        });
    	// Make "valid" input for email address
        $('#cf_message_email_input').keyup(function(){
            var email = $("#cf_message_email_input").val();
            if (!email)
            	$("#cf_message_email_input").removeClass('cf__notvalid').addClass('cf__valid');
            else if(isValidEmailAddress(email))
            	$("#cf_message_email_input").removeClass('cf__notvalid').addClass('cf__valid');
            else
            	$("#cf_message_email_input").removeClass('cf__valid').addClass('cf__notvalid');
        });
    	// Make "valid" input for phone number
        $('#cf_message_phone_input').keyup(function(){
        	var phone = $('#cf_message_phone_input').val();
            if (!phone)
            	$("#cf_message_phone_input").removeClass('cf__notvalid').addClass('cf__valid');
            else if(isValidPhoneNumber(phone))
            	$("#cf_message_phone_input").removeClass('cf__notvalid').addClass('cf__valid');
            else
            	$("#cf_message_phone_input").removeClass('cf__valid').addClass('cf__notvalid');
        });
    }

});
