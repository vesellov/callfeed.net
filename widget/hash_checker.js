// hash_checker() machine
//
// EVENTS:
//

//   `hash-exist`
//   `hash-not-exist`
//   `init`



var HashChecker = Automat.extend({

    construct: function(begin_state, options) {
        this.state = begin_state;
        this.name = "hash_checker";
        this.options = options;
        debug.log('CREATED AUTOMAT ' + this.name);
    },
    
    kill: function() {
        debug.log('DESTROY AUTOMAT ' + this.name);
    	this.options = null;
    	delete this.options;
    },

    A: function(event, args) {
        // Access method to interact with hash_checker() machine.
        switch (this.state) {
            //---AT_STARTUP---
            case 'AT_STARTUP': {
                if ( event === 'init' ) {
                    this.state = 'READY';
                    this.doAddAnchor(event, args);
                    this.doCheckHash(event, args);
                }
                break;
            }
            //---READY---
            case 'READY': {
                if ( event === 'hash-exist' ) {
                    this.doPopup(event, args);
                }
                break;
            }
        }
    },

    doAddAnchor: function(event, args) {
        // Action method.
        debug.log(this.name+".doAddAnchor('"+event+"', "+args+")");
        /*
        $('#callfeed_root').append('<div id="callfeed" class="cf__div0height"></div>');
        $('#callfeed').click(function() {
        	debug.log('hash_checker is sending "popup" event from anchor');
        	CallFeedWidget.event('popup');
        	return false;
        });
        */
    },
    
    doCheckHash: function(event, args) {
        // Action method.
        debug.log(this.name+".doCheckHash('"+event+"', "+args+")");
		if (window.location.hash.indexOf(this.options['keyword'])>=0) {
			window.location.hash = ' ';
			CallFeedWidget.controllers['hash_checker'].event('hash-exist');
		}
    },

    doPopup: function(event, args) {
        // Action method.
        debug.log(this.name+".doPopup('"+event+"', "+args+")");
		window.setTimeout(function() {
        	debug.log('hash_checker is sending "popup" event');
        	CallFeedWidget.event('popup');
		}, 10);
    },

});
