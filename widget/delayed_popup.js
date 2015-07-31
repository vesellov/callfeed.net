// delayed_popup
// EVENTS:
//   `init`
//   `timer`



var DelayedPopup = Automat.extend({

    construct: function(begin_state, options) {
        this.state = begin_state;
        this.name = "delayed_popup";
        this.options = options;
        debug.log('CREATED AUTOMAT ' + this.name);
    },
    
    kill: function() {
        debug.log('DESTROY AUTOMAT ' + this.name);
    	this.options = null;
    	delete this.options;
    },
    
    A: function(event, args) {
        // Access method to interact with delayed_popup() machine.
        switch (this.state) {
            //---AT_STARTUP---
            case 'AT_STARTUP': {
                if ( event === 'init' && this.isAlreadyFired(event, args) ) {
                    this.state = 'OFF';
                } else if ( event === 'init' && ! this.isAlreadyFired(event, args) ) {
                    this.state = 'WAIT';
                    this.doStartTimer(event, args);
                }
                break;
            }
            //---WAIT---
            case 'WAIT': {
                if ( event === 'timer' ) {
                    this.state = 'POPUP';
                    this.doPopup(event, args);
                }
                break;
            }
            //---POPUP---
            case 'POPUP': {
                break;
            }
            //---OFF---
            case 'OFF': {
                break;
            }
        }
    },
    
    isAlreadyFired: function(event, args) {
        // Condition method.
    	$.cookie.json = true;
    	var cook_activated = $.cookie('callfeed_activated_'+CallFeedToken);
        debug.log(this.name+".isAlreadyFired('"+event+"', "+args+")", cook_activated);
        return cook_activated == true;
    },    
    
    doPopup: function(event, args) {
        // Action method.
        debug.log(this.name+".doPopup('"+event+"', "+args+")");
        CallFeedWidget.event('popup');
    },

    doStartTimer: function(event, args) {
        // Action method.
        debug.log(this.name+".doStartTimer('"+event+"', "+args+")");
        if (this.options['delay'] > 0) {
	        window.setTimeout(function(){
	        	try {
	        		CallFeedWidget.controllers['delayed_popup'].event('timer');
	        	} catch (e) {
	                debug.log('doStartTimer.setTimeout ERROR', e);
	        	}
	        }, this.options['delay']);
        }
    },

});
