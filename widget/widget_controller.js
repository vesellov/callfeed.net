// widget_controller() machine
//
// EVENTS:
//

//   `all-done`
//   `back-clicked`
//   `button`
//   `call-button-clicked`
//   `call-later-clicked`
//   `call-now-clicked`
//   `close`
//   `free-call-failed`
//   `free-call-sent`
//   `init`
//   `message-failed`
//   `message-sent`
//   `order-failed`
//   `order-sent`
//   `popup`
//   `send-message-clicked`
//   `timeoff-order-failed`
//   `timeoff-order-sent`


var WidgetController = Automat.extend({

    construct: function(begin_state, parent) {
        this.state = begin_state;
        this.name = "widget_controller";
        this.parent = parent;
        this.controllers = {};
    	this.visualizer = null;
    	this.dialer = null;
    	this.callorder = null;
    	this.timeofforder = null;
    	this.messanger = null;
    	this.freecaller = null;
        debug.log('CREATED AUTOMAT ' + this.name);
    },
    
    kill: function(){
        debug.log('DESTROY AUTOMAT ' + this.name);
    	this.parent = null;
    	delete this.parent;
    	for (var controller in this.controllers) {
    		this.controllers[controller].kill();
    		this.controllers[controller] = null;
    		delete this.controllers[controller];
    	}
    	this.controllers = null;
    	delete this.controllers;
    	this.dialer.kill();
    	this.dialer = null;
    	delete this.dialer;
    	this.callorder.kill();
    	this.callorder = null;
    	delete this.callorder;
    	this.timeofforder.kill();
    	this.timeofforder = null;
    	delete this.timeofforder;
    	this.messanger.kill();
    	this.messanger = null;
    	delete this.messanger;
    	this.freecaller.kill();
    	this.freecaller = null;
    	delete this.freecaller;
    	this.visualizer.kill();
    	this.visualizer = null;
    	delete this.visualizer;
    },

    state_changed: function (old_state, new_state, event, args) {
    },


    A: function(event, args) {
        // Access method to interact with widget_controller() machine.
        switch (this.state) {
            //---HIDDEN---
            case 'HIDDEN': {
                if ( ( event === 'button' || event === 'popup' ) && ! this.isPaid(event, args) && ! this.isDialing(event, args) ) {
                    this.state = 'FREE_PAGE';
                    this.doStopFreeCaller(event, args);
                    this.doShowFreePage(event, args);
                    this.doHideFreeSentPage(event, args);
                    this.doShowWidget(event, args);
                    this.doSetCookie(event, args);
                } else if ( ( event === 'button' || event === 'popup' ) && ! this.isDialing(event, args) && this.isTimeON(event, args) && this.isPaid(event, args) ) {
                    this.state = 'MAIN_PAGE';
                    this.doShowMainPage(event, args);
                    this.doShowWidget(event, args);
                    this.doSetCookie(event, args);
                } else if ( ( event === 'button' || event === 'popup' ) && this.isDialing(event, args) ) {
                    this.state = 'DIAL_PAGE';
                    this.doShowDialPage(event, args);
                    this.doShowWidget(event, args);
                    this.doSetCookie(event, args);
                } else if ( ( event === 'button' || event === 'popup' ) && ! this.isTimeON(event, args) && this.isPaid(event, args) && ! this.isDialing(event, args) ) {
                    this.state = 'TIMEOFF_PAGE';
                    this.doStopTimeOFFOrder(event, args);
                    this.doShowTimeOFFPage(event, args);
                    this.doHideTimeOFFSentPage(event, args);
                    this.doShowWidget(event, args);
                    this.doSetCookie(event, args);
                }
                break;
            }
            //---ORDER_PAGE---
            case 'ORDER_PAGE': {
                if ( event === 'order-sent' || event === 'order-failed' ) {
                    this.doShowOrderSentPage(event, args);
                    this.doHideOrderPage(event, args);
                } else if ( event === 'back-clicked' ) {
                    this.state = 'MAIN_PAGE';
                    this.doShowMainPage(event, args);
                    this.doHideOrderPage(event, args);
                    this.doHideOrderSentPage(event, args);
                } else if ( event === 'close' || event === 'button' ) {
                    this.state = 'HIDDEN';
                    this.doHideWidget(event, args);
                    this.doHideOrderPage(event, args);
                    this.doHideOrderSentPage(event, args);
                } else if ( event === 'send-message-clicked' ) {
                    this.state = 'MESSAGE_PAGE';
                    this.doStopMessanger(event, args);
                    this.doShowMessagePage(event, args);
                    this.doHideMessageSentPage(event, args);
                    this.doHideOrderPage(event, args);
                    this.doHideOrderSentPage(event, args);
                }
                break;
            }
            //---MESSAGE_PAGE---
            case 'MESSAGE_PAGE': {
                if ( event === 'message-sent' || event === 'message-failed' ) {
                    this.doShowMessageSentPage(event, args);
                    this.doHideMessagePage(event, args);
                } else if ( event === 'call-now-clicked' && ! this.isPaid(event, args) ) {
                    this.state = 'FREE_PAGE';
                    this.doStopFreeCaller(event, args);
                    this.doShowFreePage(event, args);
                    this.doHideFreeSentPage(event, args);
                    this.doHideMessagePage(event, args);
                    this.doHideMessageSentPage(event, args);
                } else if ( event === 'call-now-clicked' && ! this.isTimeON(event, args) && this.isPaid(event, args) ) {
                    this.state = 'TIMEOFF_PAGE';
                    this.doStopTimeOFFOrder(event, args);
                    this.doShowTimeOFFPage(event, args);
                    this.doHideMessagePage(event, args);
                    this.doHideMessageSentPage(event, args);
                } else if ( event === 'close' || event === 'button' ) {
                    this.state = 'HIDDEN';
                    this.doHideWidget(event, args);
                    this.doHideMessagePage(event, args);
                    this.doHideMessageSentPage(event, args);
                } else if ( event === 'call-now-clicked' && this.isTimeON(event, args) && this.isPaid(event, args) ) {
                    this.state = 'MAIN_PAGE';
                    this.doShowMainPage(event, args);
                    this.doHideMessagePage(event, args);
                    this.doHideMessageSentPage(event, args);
                }
                break;
            }
            //---AT_STARTUP---
            case 'AT_STARTUP': {
                if ( event === 'init' ) {
                    this.state = 'LOADING';
                    this.doInit(event, args);
                }
                break;
            }
            //---LOADING---
            case 'LOADING': {
                if ( event === 'all-done' ) {
                    this.state = 'HIDDEN';
                }
                break;
            }
            //---MAIN_PAGE---
            case 'MAIN_PAGE': {
                if ( event === 'call-later-clicked' ) {
                    this.state = 'ORDER_PAGE';
                    this.doStopCallOrder(event, args);
                    this.doShowOrderPage(event, args);
                    this.doHideOrderSentPage(event, args);
                    this.doHideMainPage(event, args);
                } else if ( event === 'send-message-clicked' ) {
                    this.state = 'MESSAGE_PAGE';
                    this.doStopMessanger(event, args);
                    this.doShowMessagePage(event, args);
                    this.doHideMessageSentPage(event, args);
                    this.doHideMainPage(event, args);
                } else if ( event === 'close' || event === 'button' ) {
                    this.state = 'HIDDEN';
                    this.doHideWidget(event, args);
                    this.doHideMainPage(event, args);
                } else if ( event === 'call-button-clicked' ) {
                    this.state = 'DIAL_PAGE';
                    this.doStopDialer(event, args);
                    this.doStartDialer(event, args);
                    this.doShowDialPage(event, args);
                    this.doHideMainPage(event, args);
                }
                break;
            }
            //---DIAL_PAGE---
            case 'DIAL_PAGE': {
                if ( event === 'close' || event === 'button' ) {
                    this.state = 'HIDDEN';
                    this.doHideWidget(event, args);
                    this.doHideDialPage(event, args);
                } else if ( event === 'send-message-clicked' ) {
                    this.state = 'MESSAGE_PAGE';
                    this.doStopMessanger(event, args);
                    this.doShowMessagePage(event, args);
                    this.doHideMessageSentPage(event, args);
                    this.doHideDialPage(event, args);
                }
                break;
            }
            //---TIMEOFF_PAGE---
            case 'TIMEOFF_PAGE': {
                if ( event === 'timeoff-order-sent' || event === 'timeoff-order-failed' ) {
                    this.doShowTimeOFFSentPage(event, args);
                    this.doHideTimeOFFPage(event, args);
                } else if ( event === 'send-message-clicked' ) {
                    this.state = 'MESSAGE_PAGE';
                    this.doStopMessanger(event, args);
                    this.doShowMessagePage(event, args);
                    this.doHideMessageSentPage(event, args);
                    this.doHideTimeOFFPage(event, args);
                    this.doHideTimeOFFSentPage(event, args);
                } else if ( event === 'close' || event === 'button' ) {
                    this.state = 'HIDDEN';
                    this.doHideWidget(event, args);
                    this.doHideTimeOFFPage(event, args);
                    this.doHideTimeOFFSentPage(event, args);
                }
                break;
            }
            //---FREE_PAGE---
            case 'FREE_PAGE': {
                if ( event === 'free-call-sent' || event === 'free-call-failed' ) {
                    this.doShowFreeSentPage(event, args);
                    this.doHideFreePage(event, args);
                } else if ( event === 'close' || event === 'button' ) {
                    this.state = 'HIDDEN';
                    this.doHideWidget(event, args);
                    this.doHideFreePage(event, args);
                    this.doHideFreeSentPage(event, args);
                } else if ( event === 'send-message-clicked' ) {
                    this.state = 'MESSAGE_PAGE';
                    this.doStopMessanger(event, args);
                    this.doShowMessagePage(event, args);
                    this.doHideMessageSentPage(event, args);
                    this.doHideFreePage(event, args);
                    this.doHideFreeSentPage(event, args);
                }
                break;
            }
        }
    },


    isTimeON: function(event, args) {
        // Condition method.
    	// return false;
    	var date = new Date;
    	var hour = date.getHours();
    	var day = date.getDay();
    	if (day == 0) day = 7;
        debug.log(this.name+".isTimeON('"+event+"', "+args+")", day, CallFeedOptions.schedule[day]);
    	var timeon = true;
    	try {
    		var from_to = CallFeedOptions.schedule[day];
    		if (from_to != '-') {
    			from_to = from_to.split('-');
    			var from = parseInt(from_to[0].split(':')[0]);
    			var to = parseInt(from_to[1].split(':')[0])+1;
    			if (hour < from || hour >= to)
    				timeon = false;
    		} else 
    			timeon = false;
    	} catch (e) {
    		debug.log(e);
    	}
        return timeon;
    },

    isPaid: function(event, args) {
        // Condition method.
        debug.log(this.name+".isPaid('"+event+"', "+args+")", CallFeedOptions.mode);
        try {
        	return CallFeedOptions.mode == 'paid';
        } catch (e) {
        	return false;
        }        
    },

    isDialing: function(event, args) {
        // Condition method.
        // debug.log(this.name+".isDialing('"+event+"', "+args+")");
        // return false;
        return self.dialer && self.dialer.state != 'READY';
    },

    doInit: function(event, args) {
        // Action method.
        debug.log(this.name+".doInit('"+event+"', "+args+")");
    	// Init WidgetVisualizer automat
    	this.visualizer = new WidgetVisualizer('AT_STARTUP', this);
    	this.visualizer.event('init');
    	// Init WidgetDialer automat
    	this.dialer = new WidgetDialer('AT_STARTUP', this);
    	this.dialer.event('init');
    	// Init WidgetCallOrder automat
    	this.callorder = new WidgetCallOrder('AT_STARTUP', this);
    	this.callorder.event('init');
    	// Init WidgetTimeoffOrder automat
    	this.timeofforder = new WidgetTimeoffOrder('AT_STARTUP', this);
    	this.timeofforder.event('init');
    	// Init WidgetMessanger automat
    	this.messanger = new WidgetMessanger('AT_STARTUP', this);
    	this.messanger.event('init');
    	// Init WidgetFreeCaller automat
    	this.freecaller = new WidgetFreeCaller('AT_STARTUP', this);
    	this.freecaller.event('init');
    	// Init controllers
    	for (var controller in CallFeedOptions.controllers) {
            switch (controller) {
	            case 'delayed_popup': {
					this.controllers[controller] = new DelayedPopup(
						'AT_STARTUP', CallFeedOptions.controllers[controller]);
	                break;
	            }
	            case 'hash_checker': {
					this.controllers[controller] = new HashChecker(
						'AT_STARTUP', CallFeedOptions.controllers[controller]);
            		break;
	            }
            }
    	}
    	// Bind events
    	this._bind_events();
    	// READY!
    	this.event('all-done');
    	// Start controllers
		window.setTimeout(function() {
			debug.log('start controllers', CallFeedWidget.controllers);
	    	for (var controller in CallFeedWidget.controllers) {
	    		CallFeedWidget.controllers[controller].event('init');
	    	} 
	    }, 10);
    },

    doShowWidget: function(event, args) {
        // Action method.
        debug.log(this.name+".doShowWidget('"+event+"', "+args+")");
        this.visualizer.event('show');
    },

    doHideWidget: function(event, args) {
        // Action method.
        debug.log(this.name+".doHideWidget('"+event+"', "+args+")");
        this.visualizer.event('hide');
    },

    doShowMainPage: function(event, args) {
        // Action method.
        debug.log(this.name+".doShowMainPage('"+event+"', "+args+")");
        $("#cf_main_content").show();
    },

    doHideMainPage: function(event, args) {
        // Action method.
        debug.log(this.name+".doHideMainPage('"+event+"', "+args+")");
        $("#cf_main_content").hide();
    },

    doShowDialPage: function(event, args) {
        // Action method.
        debug.log(this.name+".doShowDialPage('"+event+"', "+args+")");
        $("#cf_dial_content").show();
    },

    doHideDialPage: function(event, args) {
        // Action method.
        debug.log(this.name+".doHideDialPage('"+event+"', "+args+")");
        $("#cf_dial_content").hide();
    },

    doShowFreePage: function(event, args) {
        // Action method.
        debug.log(this.name+".doShowFreePage('"+event+"', "+args+")");
        $("#cf_free_content").show();
    },
    
    doHideFreePage: function(event, args) {
        // Action method.
        debug.log(this.name+".doHideFreePage('"+event+"', "+args+")");
        $("#cf_free_content").hide();
    },

    doShowFreeSentPage: function(event, args) {
        // Action method.
        debug.log(this.name+".doShowFreeSentPage('"+event+"', "+args+")");
        $("#cf_free_sent_content").show();
    },

    doHideFreeSentPage: function(event, args) {
        // Action method.
        debug.log(this.name+".doHideFreeSentPage('"+event+"', "+args+")");
        $("#cf_free_sent_content").hide();
    },

    doShowTimeOFFPage: function(event, args) {
        // Action method.
        debug.log(this.name+".doShowTimeOFFPage('"+event+"', "+args+")");
        $("#cf_timeoff_content").show();
    },

    doHideTimeOFFPage: function(event, args) {
        // Action method.
        debug.log(this.name+".doHideTimeOFFPage('"+event+"', "+args+")");
        $("#cf_timeoff_content").hide();
    },
    
    doShowTimeOFFSentPage: function(event, args) {
        // Action method.
        debug.log(this.name+".doShowTimeOFFSentPage('"+event+"', "+args+")");
        $("#cf_timeoff_sent_content").show();
    },
    
    doHideTimeOFFSentPage: function(event, args) {
        // Action method.
        debug.log(this.name+".doHideTimeOFFSentPage('"+event+"', "+args+")");
        $("#cf_timeoff_sent_content").hide();
    },

    doShowMessagePage: function(event, args) {
        // Action method.
        debug.log(this.name+".doShowMessagePage('"+event+"', "+args+")");
        $("#cf_message_content").show();
    },
    
    doHideMessagePage: function(event, args) {
        // Action method.
        debug.log(this.name+".doHideMessagePage('"+event+"', "+args+")");
        $("#cf_message_content").hide();
    },

    doShowMessageSentPage: function(event, args) {
        // Action method.
        debug.log(this.name+".doShowMessageSentPage('"+event+"', "+args+")");
        $("#cf_message_sent_content").show();
    },    

    doHideMessageSentPage: function(event, args) {
        // Action method.
        debug.log(this.name+".doHideMessageSentPage('"+event+"', "+args+")");
        $("#cf_message_sent_content").hide();
    },
    
    doShowOrderPage: function(event, args) {
        // Action method.
        debug.log(this.name+".doShowOrderPage('"+event+"', "+args+")");
        $("#cf_order_content").show();
    },
    
    doHideOrderPage: function(event, args) {
        // Action method.
        debug.log(this.name+".doHideOrderPage('"+event+"', "+args+")");
        $("#cf_order_content").hide();
    },

    doShowOrderSentPage: function(event, args) {
        // Action method.
        debug.log(this.name+".doShowOrderSentPage('"+event+"', "+args+")");
        $("#cf_order_sent_content").show();
    },
    
    doHideOrderSentPage: function(event, args) {
        // Action method.
        debug.log(this.name+".doHideOrderSentPage('"+event+"', "+args+")");
        $("#cf_order_sent_content").hide();
    },    

    doStartDialer: function(event, args) {
        // Action method.
        debug.log(this.name+".doStartDialer('"+event+"', "+args+")");
        this.dialer.event('start', args);
    },
    
    doStopDialer: function(event, args) {
        // Action method.
        debug.log(this.name+".doStartDialer('"+event+"', "+args+")");
        this.dialer.event('stop', args);
    },

    doStopCallOrder: function(event, args) {
        // Action method.
        debug.log(this.name+".doStopCallOrder('"+event+"', "+args+")");
        this.callorder.event('stop', args);
    },

    doStopTimeOFFOrder: function(event, args) {
        // Action method.
        debug.log(this.name+".doStopTimeOFFOrder('"+event+"', "+args+")");
        this.timeofforder.event('stop', args);
    },
    
    doStopMessanger: function(event, args) {
        // Action method.
        debug.log(this.name+".doStopMessanger('"+event+"', "+args+")");
        this.messanger.event('stop', args);
    },

    doStopFreeCaller: function(event, args) {
        // Action method.
        debug.log(this.name+".doStopFreeCaller('"+event+"', "+args+")");
        this.freecaller.event('stop', args);
    },

    doSetCookie: function(event, args) {
        // Action method.
        debug.log(this.name+".doSetCookie('"+event+"', "+args+")");
    	$.cookie.json = true;
        $.cookie('callfeed_activated_'+CallFeedToken, 
        	true, {	expires: CallFeedOptions.cookie_ttl_seconds, path: '/' });
    },
    
    // VALIDATIONS //////////////////////////////////////////////////////// 
    
    _validate_phone: function(value, callback) {
    	if (isValidPhoneNumber(value))
    		callback();
    },
    
    _validate_email: function(value, callback) {
    	if (isValidEmailAddress(value))
    		callback();
    },
    
    // EVENTS BINDING //////////////////////////////////////////////////////// 

    _bind_events: function() {
    	// Bind event on the widget button
    	$('#cf_main_button, .callfeed_button, .callfeed_button_link').click(function() {
    		CallFeedWidget.event('button');
    	});    	
    	$('a').each(function(){
    		if (this.href.indexOf('#callfeed') >= 0) {
        		debug.log('_bind_events found an anchor', this, this.href);
    			$(this).click(function(){
    	    		CallFeedWidget.event('button');
    			});
    		}
    	});
    	$('.cf_close_button').click(function() {
    		CallFeedWidget.event('close');
    	});
    	$('.cf_time_select_link').click(function() {
    		CallFeedWidget.event('call-later-clicked');
    	});
    	$('.cf_send_message_link').click(function() {
    		CallFeedWidget.event('send-message-clicked');
    	});
    	$('.cf_order_go_back_link').click(function() {
    		CallFeedWidget.event('back-clicked');
    	});
    	$('.cf_message_go_back_link').click(function() {
    		CallFeedWidget.event('call-now-clicked');
    	});
        $('#cf_main_call_button').click(function() {
        	if (!isValidPhoneNumber($('#cf_main_call_input').val())) {
            	$("#cf_main_call_panel").addClass('cf__notvalid');
            	//$("#cf_main_call_input").addClass('cf__notvalid');
            } else {
            	$("#cf_main_call_panel").removeClass('cf__notvalid'); 
            	//$("#cf_main_call_input").removeClass('cf__notvalid');
	    		CallFeedWidget.event('call-button-clicked');
            }
        });
    	$('#cf_main_call_input').focus(function() {
        	$("#cf_main_call_panel").removeClass('cf__notvalid'); 
        	//$("#cf_main_call_input").removeClass('cf__notvalid');
    	});
    	$('#cf_main_call_input').hover(function() {
        	$("#cf_main_call_panel").removeClass('cf__notvalid'); 
        	//$("#cf_main_call_input").removeClass('cf__notvalid');
    	});    	
    }
    
    
    
});
