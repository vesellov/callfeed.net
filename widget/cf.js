



//
//[ba-debug.js]
//

/*!
 * JavaScript Debug - v0.4 - 6/22/2010
 * http://benalman.com/projects/javascript-debug-console-log/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 * 
 * With lots of help from Paul Irish!
 * http://paulirish.com/
 */

// Script: JavaScript Debug: A simple wrapper for console.log
//
// *Version: 0.4, Last Updated: 6/22/2010*
// 
// Tested with Internet Explorer 6-8, Firefox 3-3.6, Safari 3-4, Chrome 3-5, Opera 9.6-10.5
// 
// Home       - http://benalman.com/projects/javascript-debug-console-log/
// GitHub     - http://github.com/cowboy/javascript-debug/
// Source     - http://github.com/cowboy/javascript-debug/raw/master/ba-debug.js
// (Minified) - http://github.com/cowboy/javascript-debug/raw/master/ba-debug.min.js (1.1kb)
// 
// About: License
// 
// Copyright (c) 2010 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
// 
// About: Support and Testing
// 
// Information about what browsers this code has been tested in.
// 
// Browsers Tested - Internet Explorer 6-8, Firefox 3-3.6, Safari 3-4, Chrome
// 3-5, Opera 9.6-10.5
// 
// About: Examples
// 
// These working examples, complete with fully commented code, illustrate a few
// ways in which this plugin can be used.
// 
// Examples - http://benalman.com/code/projects/javascript-debug/examples/debug/
// 
// About: Revision History
// 
// 0.4 - (6/22/2010) Added missing passthrough methods: exception,
//       groupCollapsed, table
// 0.3 - (6/8/2009) Initial release
// 
// Topic: Pass-through console methods
// 
// assert, clear, count, dir, dirxml, exception, group, groupCollapsed,
// groupEnd, profile, profileEnd, table, time, timeEnd, trace
// 
// These console methods are passed through (but only if both the console and
// the method exists), so use them without fear of reprisal. Note that these
// methods will not be passed through if the logging level is set to 0 via
// <debug.setLevel>.

window.debug = (function(){
  var window = this,
    
    // Some convenient shortcuts.
    aps = Array.prototype.slice,
    con = window.console,
    
    // Public object to be returned.
    that = {},
    
    callback_func,
    callback_force,
    
    // Default logging level, show everything.
    log_level = 9,
    
    // Logging methods, in "priority order". Not all console implementations
    // will utilize these, but they will be used in the callback passed to
    // setCallback.
    log_methods = [ 'error', 'warn', 'info', 'debug', 'log' ],
    
    // Pass these methods through to the console if they exist, otherwise just
    // fail gracefully. These methods are provided for convenience.
    pass_methods = 'assert clear count dir dirxml exception group groupCollapsed groupEnd profile profileEnd table time timeEnd trace'.split(' '),
    idx = pass_methods.length,
    
    // Logs are stored here so that they can be recalled as necessary.
    logs = [];
  
  while ( --idx >= 0 ) {
    (function( method ){
      
      // Generate pass-through methods. These methods will be called, if they
      // exist, as long as the logging level is non-zero.
      that[ method ] = function() {
        log_level !== 0 && con && con[ method ]
          && con[ method ].apply( con, arguments );
      }
      
    })( pass_methods[idx] );
  }
  
  idx = log_methods.length;
  while ( --idx >= 0 ) {
    (function( idx, level ){
      
      // Method: debug.log
      // 
      // Call the console.log method if available. Adds an entry into the logs
      // array for a callback specified via <debug.setCallback>.
      // 
      // Usage:
      // 
      //  debug.log( object [, object, ...] );                               - -
      // 
      // Arguments:
      // 
      //  object - (Object) Any valid JavaScript object.
      
      // Method: debug.debug
      // 
      // Call the console.debug method if available, otherwise call console.log.
      // Adds an entry into the logs array for a callback specified via
      // <debug.setCallback>.
      // 
      // Usage:
      // 
      //  debug.debug( object [, object, ...] );                             - -
      // 
      // Arguments:
      // 
      //  object - (Object) Any valid JavaScript object.
      
      // Method: debug.info
      // 
      // Call the console.info method if available, otherwise call console.log.
      // Adds an entry into the logs array for a callback specified via
      // <debug.setCallback>.
      // 
      // Usage:
      // 
      //  debug.info( object [, object, ...] );                              - -
      // 
      // Arguments:
      // 
      //  object - (Object) Any valid JavaScript object.
      
      // Method: debug.warn
      // 
      // Call the console.warn method if available, otherwise call console.log.
      // Adds an entry into the logs array for a callback specified via
      // <debug.setCallback>.
      // 
      // Usage:
      // 
      //  debug.warn( object [, object, ...] );                              - -
      // 
      // Arguments:
      // 
      //  object - (Object) Any valid JavaScript object.
      
      // Method: debug.error
      // 
      // Call the console.error method if available, otherwise call console.log.
      // Adds an entry into the logs array for a callback specified via
      // <debug.setCallback>.
      // 
      // Usage:
      // 
      //  debug.error( object [, object, ...] );                             - -
      // 
      // Arguments:
      // 
      //  object - (Object) Any valid JavaScript object.
      
      that[ level ] = function() {
        var args = aps.call( arguments );
        var log_arr = [ level ].concat( args );
        
        logs.push( log_arr );
        exec_callback( log_arr );
        
        if ( !con || !is_level( idx ) ) { return; }
        
        con.firebug ? con[ level ].apply( window, args )
          : con[ level ] ? con[ level ]( args )
          : con.log( args );
      };
      
    })( idx, log_methods[idx] );
  }
  
  // Execute the callback function if set.
  function exec_callback( args ) {
    if ( callback_func && (callback_force || !con || !con.log) ) {
      callback_func.apply( window, args );
    }
  };
  
  // Method: debug.setLevel
  // 
  // Set a minimum or maximum logging level for the console. Doesn't affect
  // the <debug.setCallback> callback function, but if set to 0 to disable
  // logging, <Pass-through console methods> will be disabled as well.
  // 
  // Usage:
  // 
  //  debug.setLevel( [ level ] )                                            - -
  // 
  // Arguments:
  // 
  //  level - (Number) If 0, disables logging. If negative, shows N lowest
  //    priority levels of log messages. If positive, shows N highest priority
  //    levels of log messages.
  //
  // Priority levels:
  // 
  //   log (1) < debug (2) < info (3) < warn (4) < error (5)
  
  that.setLevel = function( level ) {
    log_level = typeof level === 'number' ? level : 9;
  };
  
  // Determine if the level is visible given the current log_level.
  function is_level( level ) {
    return log_level > 0
      ? log_level > level
      : log_methods.length + log_level <= level;
  };
  
  // Method: debug.setCallback
  // 
  // Set a callback to be used if logging isn't possible due to console.log
  // not existing. If unlogged logs exist when callback is set, they will all
  // be logged immediately unless a limit is specified.
  // 
  // Usage:
  // 
  //  debug.setCallback( callback [, force ] [, limit ] )
  // 
  // Arguments:
  // 
  //  callback - (Function) The aforementioned callback function. The first
  //    argument is the logging level, and all subsequent arguments are those
  //    passed to the initial debug logging method.
  //  force - (Boolean) If false, log to console.log if available, otherwise
  //    callback. If true, log to both console.log and callback.
  //  limit - (Number) If specified, number of lines to limit initial scrollback
  //    to.
  
  that.setCallback = function() {
    var args = aps.call( arguments ),
      max = logs.length,
      i = max;
    
    callback_func = args.shift() || null;
    callback_force = typeof args[0] === 'boolean' ? args.shift() : false;
    
    i -= typeof args[0] === 'number' ? args.shift() : max;
    
    while ( i < max ) {
      exec_callback( logs[i++] );
    }
  };
  
  return that;
})();




//
//[domready.js]
//

/*!
 * Adaptation of the $(document).ready() function from jQuery
 * library for use in simple JavaScript scenarios.
 *
 * --------------------------------------------------------------------- 
 * jQuery JavaScript Library v1.4.3
 * http://jquery.com/ 
 *
 * Copyright (c) 2010 John Resig, http://jquery.com/
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ----------------------------------------------------------------------
 */

var domReady = (function() {

    var w3c = !!document.addEventListener,
        loaded = false,
        toplevel = false,
        fns = [];
    
    if (w3c) {
        document.addEventListener("DOMContentLoaded", contentLoaded, true);
        window.addEventListener("load", ready, false);
    }
    else {
        document.attachEvent("onreadystatechange", contentLoaded);
        window.attachEvent("onload", ready);
        
        try {
            toplevel = window.frameElement === null;
        } catch(e) {}
        if ( document.documentElement.doScroll && toplevel ) {
            scrollCheck();
        }
    }

    function contentLoaded() {
        (w3c)?
            document.removeEventListener("DOMContentLoaded", contentLoaded, true) :
            document.readyState === "complete" && 
            document.detachEvent("onreadystatechange", contentLoaded);
        ready();
    }
    
    // If IE is used, use the trick by Diego Perini
    // http://javascript.nwbox.com/IEContentLoaded/
    function scrollCheck() {
        if (loaded) {
            return;
        }
        
        try {
            document.documentElement.doScroll("left");
        }
        catch(e) {
            window.setTimeout(arguments.callee, 15);
            return;
        }
        ready();
    }
    
    function ready() {
        if (loaded) {
            return;
        }
        loaded = true;
        
        var len = fns.length,
            i = 0;
            
        for( ; i < len; i++) {
            fns[i].call(document);
        }
    }
    
    return function(fn) {
        // if the DOM is already ready,
        // execute the function
        return (loaded)? 
            fn.call(document):      
            fns.push(fn);
    }
})();


//
//[jsonpclient.js]
//



var CallbackRegistry = {}; 

function jsonp_request(url, onSuccess, onError) {
  var scriptOk = false; 
  var callbackName = 'f'+String(Math.random()).slice(2);
  var script = document.createElement('script');
  
  debug.log('jsonp_request', url, callbackName, CallbackRegistry);

  url += ~url.indexOf('?') ? '&' : '?';
  url += 'callback=CallbackRegistry.'+callbackName;

  CallbackRegistry[callbackName] = function(data) {       
    scriptOk = true; 
    delete CallbackRegistry[callbackName]; 
    onSuccess(data); 
    document.body.removeChild(script);
  };
  
  function checkCallback() {      
    if (scriptOk) return; 
    delete CallbackRegistry[callbackName]; 
    onError(url);  
    document.body.removeChild(script);
  }

  script.onreadystatechange = function() {    
    if (this.readyState == 'complete' || this.readyState == 'loaded'){   
      this.onreadystatechange = null;   
      setTimeout(checkCallback, 0); 
    }
  }

  script.onload = script.onerror = checkCallback;
  script.src = url;
  document.body.appendChild(script);
  
}

//jsonp_request("/files/tutorial/ajax/jsonp/user?id=123", ok, fail); 



//
//[debug.js]
//

var CallFeedDebug = true;



//
//[globals.js]
//

var CallFeedSession = null;
var CallFeedWidget = null;
var CallFeedOptions = null;


(function(window,document){





//
//[jquery.cookie.js]
//

/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */

function init_jquery_cookie(jqo) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return jqo.isFunction(converter) ? converter(value) : value;
	}

	var config = jqo.cookie = function (key, value, options) {

		// Write

		if (arguments.length > 1 && !jqo.isFunction(value)) {
			options = jqo.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setMilliseconds(t.getMilliseconds() + days * 1000); //864e+5
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {},
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling $.cookie().
			cookies = document.cookie ? document.cookie.split('; ') : [],
			i = 0,
			l = cookies.length;

		for (; i < l; i++) {
			var parts = cookies[i].split('='),
				name = decode(parts.shift()),
				cookie = parts.join('=');

			if (key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	jqo.removeCookie = function (key, options) {
		// Must not alter options, thus extending a fresh object...
		jqo.cookie(key, '', jqo.extend({}, options, { expires: -1 }));
		return !jqo.cookie(key);
	};

}

//init_jquery_cookie(jQuery);



//
//[simpleStorage.js]
//

/* jshint browser: true */
/* global define: false */

// AMD shim
(function(root, factory) {

    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.simpleStorage = factory();
    }

}(this, function() {

    'use strict';

    var
        VERSION = '0.1.3',

        /* This is the object, that holds the cached values */
        _storage = false,

        /* How much space does the storage take */
        _storage_size = 0,

        _storage_available = false,

        _ttl_timeout = null;

    // This method might throw as it touches localStorage and doing so
    // can be prohibited in some environments
    function _init() {

        // If localStorage does not exist, the following throws
        // This is intentional
        window.localStorage.setItem('__simpleStorageInitTest', 'tmpval');
        window.localStorage.removeItem('__simpleStorageInitTest');

        // Load data from storage
        _load_storage();

        // remove dead keys
        _handleTTL();

        // start listening for changes
        _setupUpdateObserver();

        // handle cached navigation
        if ('addEventListener' in window) {
            window.addEventListener('pageshow', function(event) {
                if (event.persisted) {
                    _reloadData();
                }
            }, false);
        }

        _storage_available = true;
    }

    /**
     * Sets up a storage change observer
     */
    function _setupUpdateObserver() {
        if ('addEventListener' in window) {
            window.addEventListener('storage', _reloadData, false);
        } else {
            document.attachEvent('onstorage', _reloadData);
        }
    }

    /**
     * Reload data from storage when needed
     */
    function _reloadData() {
        try {
            _load_storage();
        } catch (E) {
            _storage_available = false;
            return;
        }
        _handleTTL();
    }

    function _load_storage() {
        var source = localStorage.getItem('simpleStorage');

        try {
            _storage = JSON.parse(source) || {};
        } catch (E) {
            _storage = {};
        }

        _storage_size = _get_storage_size();
    }

    function _save() {
        try {
            localStorage.setItem('simpleStorage', JSON.stringify(_storage));
            _storage_size = _get_storage_size();
        } catch (E) {
            return E;
        }
        return true;
    }

    function _get_storage_size() {
        var source = localStorage.getItem('simpleStorage');
        return source ? String(source).length : 0;
    }

    function _handleTTL() {
        var curtime, i, len, expire, keys, nextExpire = Infinity,
            expiredKeysCount = 0;

        clearTimeout(_ttl_timeout);

        if (!_storage || !_storage.__simpleStorage_meta || !_storage.__simpleStorage_meta.TTL) {
            return;
        }

        curtime = +new Date();
        keys = _storage.__simpleStorage_meta.TTL.keys || [];
        expire = _storage.__simpleStorage_meta.TTL.expire || {};

        for (i = 0, len = keys.length; i < len; i++) {
            if (expire[keys[i]] <= curtime) {
                expiredKeysCount++;
                delete _storage[keys[i]];
                delete expire[keys[i]];
            } else {
                if (expire[keys[i]] < nextExpire) {
                    nextExpire = expire[keys[i]];
                }
                break;
            }
        }

        // set next check
        if (nextExpire != Infinity) {
            _ttl_timeout = setTimeout(_handleTTL, Math.min(nextExpire - curtime, 0x7FFFFFFF));
        }

        // remove expired from TTL list and save changes
        if (expiredKeysCount) {
            keys.splice(0, expiredKeysCount);

            _cleanMetaObject();
            _save();
        }
    }

    function _setTTL(key, ttl) {
        var curtime = +new Date(),
            i, len, added = false;

        ttl = Number(ttl) || 0;

        // Set TTL value for the key
        if (ttl !== 0) {
            // If key exists, set TTL
            if (_storage.hasOwnProperty(key)) {

                if (!_storage.__simpleStorage_meta) {
                    _storage.__simpleStorage_meta = {};
                }

                if (!_storage.__simpleStorage_meta.TTL) {
                    _storage.__simpleStorage_meta.TTL = {
                        expire: {},
                        keys: []
                    };
                }

                _storage.__simpleStorage_meta.TTL.expire[key] = curtime + ttl;

                // find the expiring key in the array and remove it and all before it (because of sort)
                if (_storage.__simpleStorage_meta.TTL.expire.hasOwnProperty(key)) {
                    for (i = 0, len = _storage.__simpleStorage_meta.TTL.keys.length; i < len; i++) {
                        if (_storage.__simpleStorage_meta.TTL.keys[i] == key) {
                            _storage.__simpleStorage_meta.TTL.keys.splice(i);
                        }
                    }
                }

                // add key to keys array preserving sort (soonest first)
                for (i = 0, len = _storage.__simpleStorage_meta.TTL.keys.length; i < len; i++) {
                    if (_storage.__simpleStorage_meta.TTL.expire[_storage.__simpleStorage_meta.TTL.keys[i]] > (curtime + ttl)) {
                        _storage.__simpleStorage_meta.TTL.keys.splice(i, 0, key);
                        added = true;
                        break;
                    }
                }

                // if not added in previous loop, add here
                if (!added) {
                    _storage.__simpleStorage_meta.TTL.keys.push(key);
                }
            } else {
                return false;
            }
        } else {
            // Remove TTL if set
            if (_storage && _storage.__simpleStorage_meta && _storage.__simpleStorage_meta.TTL) {

                if (_storage.__simpleStorage_meta.TTL.expire.hasOwnProperty(key)) {
                    delete _storage.__simpleStorage_meta.TTL.expire[key];
                    for (i = 0, len = _storage.__simpleStorage_meta.TTL.keys.length; i < len; i++) {
                        if (_storage.__simpleStorage_meta.TTL.keys[i] == key) {
                            _storage.__simpleStorage_meta.TTL.keys.splice(i, 1);
                            break;
                        }
                    }
                }

                _cleanMetaObject();
            }
        }

        // schedule next TTL check
        clearTimeout(_ttl_timeout);
        if (_storage && _storage.__simpleStorage_meta && _storage.__simpleStorage_meta.TTL && _storage.__simpleStorage_meta.TTL.keys.length) {
            _ttl_timeout = setTimeout(_handleTTL, Math.min(Math.max(_storage.__simpleStorage_meta.TTL.expire[_storage.__simpleStorage_meta.TTL.keys[0]] - curtime, 0), 0x7FFFFFFF));
        }

        return true;
    }

    function _cleanMetaObject() {
        var updated = false,
            hasProperties = false,
            i;

        if (!_storage || !_storage.__simpleStorage_meta) {
            return updated;
        }

        // If nothing to TTL, remove the object
        if (_storage.__simpleStorage_meta.TTL && !_storage.__simpleStorage_meta.TTL.keys.length) {
            delete _storage.__simpleStorage_meta.TTL;
            updated = true;
        }

        // If meta object is empty, remove it
        for (i in _storage.__simpleStorage_meta) {
            if (_storage.__simpleStorage_meta.hasOwnProperty(i)) {
                hasProperties = true;
                break;
            }
        }

        if (!hasProperties) {
            delete _storage.__simpleStorage_meta;
            updated = true;
        }

        return updated;
    }

    ////////////////////////// PUBLIC INTERFACE /////////////////////////

    try {
        _init();
    } catch (E) {}

    return {

        version: VERSION,

        canUse: function() {
            return !!_storage_available;
        },

        set: function(key, value, options) {
            if (key == '__simpleStorage_meta') {
                return false;
            }

            if (!_storage) {
                return false;
            }

            // undefined values are deleted automatically
            if (typeof value == 'undefined') {
                return this.deleteKey(key);
            }

            options = options || {};

            // Check if the value is JSON compatible (and remove reference to existing objects/arrays)
            try {
                value = JSON.parse(JSON.stringify(value));
            } catch (E) {
                return E;
            }

            _storage[key] = value;

            _setTTL(key, options.TTL || 0);

            return _save();
        },

        get: function(key) {
            if (!_storage) {
                return false;
            }

            if (_storage.hasOwnProperty(key) && key != '__simpleStorage_meta') {
                // TTL value for an existing key is either a positive number or an Infinity
                if (this.getTTL(key)) {
                    return _storage[key];
                }
            }
        },

        deleteKey: function(key) {

            if (!_storage) {
                return false;
            }

            if (key in _storage) {
                delete _storage[key];

                _setTTL(key, 0);

                return _save();
            }

            return false;
        },

        setTTL: function(key, ttl) {
            if (!_storage) {
                return false;
            }

            _setTTL(key, ttl);

            return _save();
        },

        getTTL: function(key) {
            var ttl;

            if (!_storage) {
                return false;
            }

            if (_storage.hasOwnProperty(key)) {
                if (_storage.__simpleStorage_meta &&
                    _storage.__simpleStorage_meta.TTL &&
                    _storage.__simpleStorage_meta.TTL.expire &&
                    _storage.__simpleStorage_meta.TTL.expire.hasOwnProperty(key)) {

                    ttl = Math.max(_storage.__simpleStorage_meta.TTL.expire[key] - (+new Date()) || 0, 0);

                    return ttl || false;
                } else {
                    return Infinity;
                }
            }

            return false;
        },

        flush: function() {
            if (!_storage) {
                return false;
            }

            _storage = {};
            try {
                localStorage.removeItem('simpleStorage');
                return true;
            } catch (E) {
                return E;
            }
        },

        index: function() {
            if (!_storage) {
                return false;
            }

            var index = [],
                i;
            for (i in _storage) {
                if (_storage.hasOwnProperty(i) && i != '__simpleStorage_meta') {
                    index.push(i);
                }
            }
            return index;
        },

        storageSize: function() {
            return _storage_size;
        }
    };

}));


//
//[defaults.js]
//

function CallFeedDefaultSettings(my_token) {
  return {
	// MAIN
    // not configurable by client at all
	position: 'fixed',
	cookie_ttl_seconds: 1*60*60, // 1 hour
	countdown_from: 15,
	controllers: {
	    delayed_popup: {
	        delay: 7000
	    },
	    hash_checker: {
	    	keyword: 'callfeed'
	    }
	},
	
	// FONTS
	// can be configurable automatically by client from admin panel
	// probably he can just set family and size and all values here will be generated
	// this is a custom font
	//param_font1: 'CallFeedFont1',
	//font_family1: 'CallFeedFont1',
	//font_url1: 'http://callfeed.net/static/fonts/MuseoSansCyrl-300.otf',
	// this is standart web font
	param_font1: 'Arial',
	font_family1: '',
	font_url1: '',
	param_font_size_inputs: '14px',
	
	// PARAMS
	// this values can be adjusted from admin panel, default values are preferred
	// probably, client may need to choose one of several predefined templates  
	// this values can be calculated depend on that template for good looking of the widget
	// say, if user set too big or too small font - the total size of the widget should fit
	param_root_position_left: 'initial', //callfeed_root   this is the global position of the button and widget
	param_root_position_right: '20px', //callfeed_root     here is a full css value - with "px" 
	param_root_position_bottom: '10px', //callfeed_root    because we need to set left or right offset
	param_total_max_width:290, // callfeed_root
	param_total_max_height: 458, // callfeed_root, this is full height with button(38px) and triangle(10px)
	param_button_width: 230, // cf_main_button
	param_button_height: 38, // cf_main_button
	param_manager_panel_height: 50, // cf_manager_panel
	param_main_height: 340, // cf_main_content
	param_dial_height: 270, // cf_dial_content
	param_free_height: 280, // ccf_free_content
	param_free_sent_height: 170, // cf_free_sent_content
	param_timeoff_height: 280, // cf_timeoff_content
	param_timeoff_sent_height: 170, // cf_timeoff_sent_content
	param_message_height: 400, // cf_message_content
	param_message_sent_height: 170, // cf_message_sent_content
	param_order_height: 320, // cf_order_content
	param_order_sent_height: 210, // cf_order_sent_content
	param_z_index_global: 9999, // callfeed_root
    param_content_border_radius: 15, // cf_content
    param_main_button_border_radius: 19, // cf_main_button
	
	// TEXT VALUES
	// client should be able to set any text value directly from admin panel
	text_button: 'обратный звонок',
	text_main: '<span style="color: #FAD468;">Здравствуйте!</span><br/>Получить 25% скидку на любой товар на нашем сайте очень легко!<br/>Просто закажите обратный звонок прямо сейчас.',
	text_dial_ready: 'Подготовка соединения...',
	text_dial_start: 'Ожидайте звонка!<br/>Производится соединение с оператором.',
	text_dial_calling: 'Ожидайте звонка!<br/>Производится соединение с оператором.',
	text_dial_success: 'Соединение установлено!<br/>Возьмите трубку.',
	text_dial_late: 'Оператор не успел поднять трубку.',
	text_dial_failed: 'Извините, сервис в данной момент не доступен.<br/>Просим прощение за доставленные неудобства.',
	text_dial_finished: 'Соединение завершено.',
	text_order_start: 'Выберите удобное время звонка',
	text_order_done: 'Спасибо!<br/>Мы обязательно перезвоним Вам в указанное время.',
	text_order_failed: 'Извините, сервис в данной момент не доступен.<br/>Просим прощение за доставленные неудобства.',
	text_message_start: 'Постараемся ответить на Ваш вопрос как можно скорее',
	text_message_sent: 'Спасибо за ваше сообщение!<br/>Мы обязательно свяжемся с вами в ближайшее время.',
	text_message_failed: 'Извините, сервис в данной момент не доступен.<br/>Просим прощение за доставленные неудобства.',
	text_send_message_done: 'Спасибо за Ваше сообщение!<br/>Мы обязательно свяжемся с Вами в ближайшее время.',
	text_timeoff_start: '<span style="color: #FAD468;">Здравствуйте!</span><br/>К сожалению наш рабочий день уже закончился. Пожалуйста оставьте Ваш номер телефона и выберите удобное время звонка.',
	text_timeoff_start_morning: '<span style="color: #FAD468;">Доброе утро!</span><br/>Наш рабочий день еще не начался. Пожалуйста оставьте Ваш номер телефона и выберите удобное время звонка.',
	text_timeoff_start_weekend: '<span style="color: #FAD468;">Привет!</span><br/>Сегодня у нас выходной. Пожалуйста оставьте Ваш номер телефона и выберите удобное время звонка.',
	text_timeoff_done: 'Спасибо!<br/>Мы обязательно перезвоним Вам в указанное время.',
	text_timeoff_failed: 'Извините, сервис в данной момент не доступен.<br/>Просим прощение за доставленные неудобства.',
	text_free_start: '<span style="color: #FAD468;">Здравствуйте!</span><br/>Оставьте Ваш номер телефона и выберите удобное время звонка. Мы перезвоним и проконсультируем по всем вопросам.',
	text_free_sent: 'Спасибо!<br/>Мы обязательно перезвоним Вам в указанное время.',
	text_free_failed: 'Извините, сервис в данной момент не доступен.<br/>Просим прощение за доставленные неудобства.',
	text_link_order: 'Выбрать удобное время звонка',
	text_link_send_message: 'Написать сообщение',
	text_link_go_back: 'Назад',
	text_link_message_go_back: 'Заказать звонок',
	
	// COLORS
	// client should be able to set several colors and be able to customize the widget
	// probably he can set some background picture here, border colors, etc.
	color_background_global: '#4e5a5d', // '#A66857', 
	color_background_inputs: '#ccc', 
	color_font_global: '#fff', 
	color_font_link: '#BCBCAC', 
	color_font_secondary_global: '#CCDCDC',
	color_opacity_global: '.9',
	color_opacity_main_button: '.9',
	color_opacity_call_panel: '1',
	color_opacity_inputs: '1',
	color_opacity_call_button: '1',
	color_background_image_global: '',
	
    // FLAGS
    flag_name_field: false,
    flag_name_field_obligatory: false,
    flag_email_field: false,
    flag_email_field_obligatory: true,
    flag_phone_field: true,
    flag_phone_field_obligatory: true,
    flag_button_visible: true,	
    flag_button_text_animated: false,	
    flag_is_operator_shown_in_widget: true,
    flag_disable_on_mobiles: false
    
  };
}



//
//[build_css.js]
//

function CallFeedBuildCSS(settings) {
    var o = "";
    o+="&lt;style type=&quot;text/css&quot;&gt;\n";
    o+="#callfeed_root {\n";
    o+="    position: fixed!important;\n";
    o+="    left: %(param_root_position_left)s!important;\n";
    o+="    right: %(param_root_position_right)s!important;\n";
    o+="    bottom: %(param_root_position_bottom)s!important;\n";
    o+="    width: %(param_total_max_width)spx!important;\n";
    o+="    /*height: %(param_total_max_height)spx!important;*/\n";
    o+="    /*-webkit-touch-callout: none;\n";
    o+="    -webkit-user-select: none;\n";
    o+="    -khtml-user-select: none;\n";
    o+="    -moz-user-select: none;\n";
    o+="    -ms-user-select: none;\n";
    o+="    user-select: none; */\n";
    o+="    overflow: hidden!important;\n";
    o+="}\n";
    o+="#cf_widget {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 0px!important;\n";
    o+="    bottom: %(param_button_height)spx!important;\n";
    o+="    width: %(param_total_max_width)spx!important;\n";
    o+="    height: 100%!important;\n";
    o+="    overflow: hidden!important;\n";
    o+="    /* background-image: none!important; */\n";
    o+="    display: none;\n";
    o+="}\n";
    o+="#cf_widget_triangle_img {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 134px!important;\n";
    o+="    bottom: -1px!important;\n";
    o+="    width: 0px!important;\n";
    o+="    height: 0px!important;\n";
    o+="    border-left: 10px solid rgba(0, 0, 0, 0)!important;\n";
    o+="    border-right: 10px solid rgba(0, 0, 0, 0)!important;\n";
    o+="    border-top: 11px solid %(color_background_global)s!important;\n";
    o+="    opacity: %(color_opacity_global)s!important;\n";
    o+="}\n";
    o+=".cf_content {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 0px!important;\n";
    o+="    bottom: 10px!important;\n";
    o+="    width: %(param_total_max_width)spx!important;\n";
    o+="    /* background-image: none!important; */\n";
    o+="    /* background: none!important; */\n";
    o+="    border-radius: %(param_content_border_radius)spx!important;\n";
    o+="    overflow: hidden!important;\n";
    o+="}\n";
    o+=".cf_background {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 0px!important;\n";
    o+="    top: 0px!important;\n";
    o+="    width: 100%!important;\n";
    o+="    height: 100%!important;\n";
    o+="    /* background-image: none!important; */\n";
    o+="    border-radius: %(param_content_border_radius)spx!important;\n";
    o+="    background-color: %(color_background_global)s!important;\n";
    o+="    opacity: %(color_opacity_global)s!important;\n";
    o+="    -webkit-background-size: cover;\n";
    o+="    -moz-background-size: cover;\n";
    o+="    -o-background-size: cover;\n";
    o+="    background-size: cover;\n";
    o+="}\n";
    o+="#cf_main_button {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 30px!important;\n";
    o+="    bottom: 0px!important;\n";
    o+="    width: %(param_button_width)spx!important;\n";
    o+="    height: %(param_button_height)spx!important;\n";
    o+="    cursor: pointer!important;\n";
    o+="    font-size: 17px!important;\n";
    o+="    color: %(color_font_global)s!important;\n";
    o+="    /* background-image: none!important; */\n";
    o+="    background-color: %(color_background_global)s!important;\n";
    o+="    opacity: %(color_opacity_main_button)s!important;\n";
    o+="    border-radius: %(param_main_button_border_radius)spx!important;\n";
    o+="    -webkit-touch-callout: none;\n";
    o+="    -webkit-user-select: none;\n";
    o+="    -khtml-user-select: none;\n";
    o+="    -moz-user-select: none;\n";
    o+="    -ms-user-select: none;\n";
    o+="    user-select: none;\n";
    o+="}\n";
    o+="#cf_main_button:hover {\n";
    o+="	opacity: 1!important;\n";
    o+="}\n";
    o+="#cf_main_button_content {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 0px!important;\n";
    o+="    top: 0px!important;\n";
    o+="    width: %(param_button_width)spx!important;\n";
    o+="    word-wrap: break-word!important;\n";
    o+="    text-align: center!important;\n";
    o+="    height: %(param_button_height)spx!important;\n";
    o+="    line-height: 38px!important;\n";
    o+="    vertical-align: middle;\n";
    o+="}\n";
    o+="#cf_main_button_label {\n";
    o+="    font-family: Arial!important;\n";
    o+="}\n";
    o+="#cf_copyright_link {\n";
    o+="    position: absolute!important;\n";
    o+="    bottom: 12px!important;\n";
    o+="    right: 12px!important;\n";
    o+="}\n";
    o+="#cf_copyright_link_content {\n";
    o+="    color: %(color_font_link)s!important;\n";
    o+="/*  color: %(color_font_global)s!important;\n";
    o+="    opacity: .7!important; */\n";
    o+="    font-size: 10px!important;\n";
    o+="    font-family: %(param_font1)s!important;\n";
    o+="    font-weight: 400!important;\n";
    o+="    text-decoration: none!important;\n";
    o+="}\n";
    o+=".cf_manager_panel {\n";
    o+="    position: absolute!important;\n";
    o+="    top: 24px!important;\n";
    o+="    left: 20px!important;\n";
    o+="    right: 20px!important;\n";
    o+="    height: %(param_manager_panel_height)spx!important;\n";
    o+="}\n";
    o+=".cf_manager_face {\n";
    o+="    position: absolute!important;\n";
    o+="    top: 0px!important;\n";
    o+="    left: 0px!important;\n";
    o+="    width: 50px!important;\n";
    o+="    height: %(param_manager_panel_height)spx!important;\n";
    o+="    border-radius: 50px!important;\n";
    o+="}\n";
    o+=".cf_manager_name {\n";
    o+="    position: absolute!important;\n";
    o+="    top: 5px!important;\n";
    o+="    left: 65px!important;\n";
    o+="    right: 0px!important;\n";
    o+="    height: 25px!important;\n";
    o+="    color: %(color_font_global)s!important;\n";
    o+="    font-size: 14px!important;\n";
    o+="}\n";
    o+=".cf_manager_role {\n";
    o+="    position: absolute!important;\n";
    o+="    top: 30px!important;\n";
    o+="    left: 65px!important;\n";
    o+="    right: 0px!important;\n";
    o+="    height: 20px!important;\n";
    o+="    color: %(color_font_scondary_global)s!important;\n";
    o+="    font-size: 12px!important;\n";
    o+="}\n";
    o+=".cf_close_button {\n";
    o+="    position: absolute!important;\n";
    o+="    right: 10px!important;\n";
    o+="    top: 10px!important;\n";
    o+="    width: 12px!important;\n";
    o+="    height: 12px!important;\n";
    o+="    cursor: pointer!important;\n";
    o+="}\n";
    o+=".cf_close_button_img {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 0px!important;\n";
    o+="    top: 0px!important;\n";
    o+="    width: 12px!important;\n";
    o+="    height: 12px!important;\n";
    o+="}\n";
    o+=".cf_send_message_link {\n";
    o+="    position: absolute!important;\n";
    o+="    text-align: center!important;\n";
    o+="    left: 0px!important;\n";
    o+="    right: 0px!important;\n";
    o+="    bottom: 26px!important;\n";
    o+="    height: 16px!important;\n";
    o+="    color: %(color_font_link)s!important;\n";
    o+="    /* color: %(color_font_global)s!important;\n";
    o+="    opacity: .7!important; */\n";
    o+="    white-space: nowrap!important;\n";
    o+="    font-size: 13px!important;\n";
    o+="}\n";
    o+=".cf_time_select_link {\n";
    o+="    position: absolute!important;\n";
    o+="    text-align: center!important;\n";
    o+="    left: 0px!important;\n";
    o+="    right: 0px!important;\n";
    o+="    bottom: 52px!important;\n";
    o+="    height: 16px!important;\n";
    o+="    color: %(color_font_link)s!important;\n";
    o+="    /* color: %(color_font_global)s!important;\n";
    o+="    opacity: .7!important; */\n";
    o+="    white-space: nowrap!important;\n";
    o+="    font-size: 13px!important;\n";
    o+="}\n";
    o+=".cf_call_panel {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 20px!important;\n";
    o+="    right: 20px!important;\n";
    o+="    height: 38px!important;\n";
    o+="    /* background-image: none!important; */\n";
    o+="    background-color: %(color_background_inputs)s!important;\n";
    o+="    opacity: %(color_opacity_call_panel)s!important;\n";
    o+="    border-radius: 19px!important;\n";
    o+="    border: 1px solid %(color_background_inputs)s;\n";
    o+="    box-sizing: border-box!important;\n";
    o+="}\n";
    o+=".cf_call_input {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 18px!important;\n";
    o+="    top: 0px!important;\n";
    o+="    width: 190px!important;\n";
    o+="    height: 36px!important;\n";
    o+="    font-size: 16px!important;\n";
    o+="    border: 0px!important;\n";
    o+="}\n";
    o+=".cf_call_button {\n";
    o+="    position: absolute!important;\n";
    o+="    width: 36px!important;\n";
    o+="    height: 36px!important;\n";
    o+="    cursor: pointer!important;\n";
    o+="    opacity: %(color_opacity_call_button)s!important;\n";
    o+="}\n";
    o+=".cf_call_button_bg_img {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 0px!important;\n";
    o+="    top: 0px!important;\n";
    o+="    width: 36px!important;\n";
    o+="    height: 36px!important;\n";
    o+="    opacity: %(color_opacity_call_button)s!important;\n";
    o+="}\n";
    o+=".cf_call_button_phone_img {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 8px!important;\n";
    o+="    top: 8px!important;\n";
    o+="    width: 20px!important;\n";
    o+="    height: 20px!important;\n";
    o+="    opacity: %(color_opacity_call_button)s!important;\n";
    o+="}\n";
    o+=".cf_day_select {\n";
    o+="    position: absolute!important;\n";
    o+="    top: 0px!important;\n";
    o+="    left: 0px!important;\n";
    o+="    width: 130px!important;\n";
    o+="    height: 38px!important;\n";
    o+="    font-size: %(param_font_size_inputs)s!important;\n";
    o+="    color: #000!important;\n";
    o+="    border-radius: 19px!important;\n";
    o+="    cursor: pointer!important;\n";
    o+="    padding-left: 10px!important;\n";
    o+="}\n";
    o+=".cf_time_select {\n";
    o+="    position: absolute!important;\n";
    o+="    top: 0px!important;\n";
    o+="    right: 0px!important;\n";
    o+="    width: 80px!important;\n";
    o+="    height: 38px!important;\n";
    o+="    font-size: %(param_font_size_inputs)s!important;\n";
    o+="    color: #000!important;\n";
    o+="    border-radius: 19px!important;\n";
    o+="    cursor: pointer!important;\n";
    o+="    padding-left: 14px!important;\n";
    o+="}\n";
    o+=".cf_daytime_at_text {\n";
    o+="    position: absolute!important;\n";
    o+="    top: 10px!important;\n";
    o+="    left: 145px!important;\n";
    o+="    width: 16px!important;\n";
    o+="    height: 16px!important;\n";
    o+="    line-height: 16px!important;\n";
    o+="    color: %(color_font_global)s!important;\n";
    o+="    font-size: 16px!important;\n";
    o+="}\n";
    o+=".cf_custom_text {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 20px!important;\n";
    o+="    right: 20px!important;\n";
    o+="    overflow: hidden!important;\n";
    o+="    /* cursor: default!important; */\n";
    o+="}\n";
    o+=".cf_custom_text_value {\n";
    o+="    font-family: %(param_font1)s!important;\n";
    o+="    font-weight: 400!important;\n";
    o+="    white-space: normal!important;\n";
    o+="    word-wrap:  break-word!important;\n";
    o+="}\n";
    o+="#cf_main_content {\n";
    o+="    display: none;\n";
    o+="    height: %(param_main_height)spx;\n";
    o+="}\n";
    o+="#cf_main_call_panel {\n";
    o+="    bottom: 87px!important;\n";
    o+="}\n";
    o+="#cf_main_custom_text {\n";
    o+="    top: 90px!important;\n";
    o+="    /* bottom: 130px!important; */\n";
    o+="}\n";
    o+="#cf_main_custom_text_value {\n";
    o+="    font-size: 16px!important;\n";
    o+="    color: %(color_font_global)s!important;\n";
    o+="    text-align: left!important;\n";
    o+="    line-height: 20px!important;\n";
    o+="}\n";
    o+="#cf_main_call_button {\n";
    o+="    position: absolute!important;\n";
    o+="    right: 21px!important;\n";
    o+="    bottom: 88px!important;\n";
    o+="}\n";
    o+="#cf_dial_content {\n";
    o+="    display: none;\n";
    o+="    height: %(param_dial_height)spx;\n";
    o+="    background-color: %(color_background_global)s!important;\n";
    o+="    opacity: %(color_opacity_global)s!important;\n";
    o+="}\n";
    o+="#cf_dial_custom_text {\n";
    o+="    top: 90px!important;\n";
    o+="    /* bottom: 110px!important; */\n";
    o+="}\n";
    o+="#cf_dial_custom_text_value {\n";
    o+="    font-size: 16px!important;\n";
    o+="    color: %(color_font_global)s!important;\n";
    o+="    text-align: left!important;\n";
    o+="    line-height: 20px!important;\n";
    o+="}\n";
    o+="#cf_dial_countdown_panel {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 20px!important;\n";
    o+="    right: 20px!important;\n";
    o+="    bottom: 52px!important;\n";
    o+="    height: 50px!important;\n";
    o+="    text-align: center!important;\n";
    o+="}\n";
    o+="#cf_dial_countdown_text {\n";
    o+="    font-family: &quot;Courier Обычный&quot;,&quot;Courier&quot;!important;\n";
    o+="    font-weight: 600!important;\n";
    o+="    font-size: 50px!important;\n";
    o+="    line-height: 50px!important;\n";
    o+="}\n";
    o+="#cf_free_content {\n";
    o+="    display: none;\n";
    o+="    height: %(param_free_height)spx;\n";
    o+="    background-color: %(color_background_global)s!important;\n";
    o+="    opacity: %(color_opacity_global)s!important;\n";
    o+="}\n";
    o+="#cf_free_call_button {\n";
    o+="    position: absolute!important;\n";
    o+="    right: 21px!important;\n";
    o+="    bottom: 51px!important;\n";
    o+="}\n";
    o+="#cf_free_call_panel {\n";
    o+="    bottom: 50px!important;\n";
    o+="}\n";
    o+="#cf_free_daytime_panel {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 20px!important;\n";
    o+="    right: 20px!important;\n";
    o+="    bottom: 100px!important;\n";
    o+="    height: 38px!important;\n";
    o+="}\n";
    o+="#cf_free_custom_text {\n";
    o+="    top: 90px!important;\n";
    o+="    /* bottom: 148px!important; */\n";
    o+="}\n";
    o+="#cf_free_custom_text_value {\n";
    o+="    font-size: 16px!important;\n";
    o+="    color: %(color_font_global)s!important;\n";
    o+="    text-align: left!important;\n";
    o+="    line-height: 16px!important;\n";
    o+="}\n";
    o+="#cf_free_sent_custom_text {\n";
    o+="    top: 24px!important;\n";
    o+="    /* bottom: 52px!important; */\n";
    o+="}\n";
    o+="#cf_free_sent_custom_text_value {\n";
    o+="    font-size: 16px!important;\n";
    o+="    color: %(color_font_global)s!important;\n";
    o+="    text-align: left!important;\n";
    o+="    line-height: 16px!important;\n";
    o+="}\n";
    o+="#cf_free_sent_content {\n";
    o+="    display: none;\n";
    o+="    height: %(param_free_sent_height)spx;\n";
    o+="    background-color: %(color_background_global)s!important;\n";
    o+="    opacity: %(color_opacity_global)s!important;\n";
    o+="}\n";
    o+="#cf_timeoff_content {\n";
    o+="    display: none;\n";
    o+="    height: %(param_timeoff_height)spx;\n";
    o+="}\n";
    o+="#cf_timeoff_call_button {\n";
    o+="    position: absolute!important;\n";
    o+="    right: 21px!important;\n";
    o+="    bottom: 61px!important;\n";
    o+="}\n";
    o+="#cf_timeoff_custom_text {\n";
    o+="    top: 24px!important;\n";
    o+="    /* height: 140px!important; */\n";
    o+="    /* right: 40px!important; */\n";
    o+="}\n";
    o+="#cf_timeoff_custom_text_value {\n";
    o+="    font-size: 16px!important;\n";
    o+="    color: %(color_font_global)s!important;\n";
    o+="    text-align: left!important;\n";
    o+="    line-height: 16px!important;\n";
    o+="}\n";
    o+="#cf_timeoff_call_panel {\n";
    o+="    bottom: 60px!important;\n";
    o+="}\n";
    o+="#cf_timeoff_daytime_panel {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 20px!important;\n";
    o+="    right: 20px!important;\n";
    o+="    bottom: 110px!important;\n";
    o+="    height: 38px!important;\n";
    o+="}\n";
    o+="#cf_timeoff_sent_custom_text {\n";
    o+="    top: 24px!important;\n";
    o+="    /* bottom: 52px!important; */\n";
    o+="}\n";
    o+="#cf_timeoff_sent_custom_text_value {\n";
    o+="    font-size: 16px!important;\n";
    o+="    color: %(color_font_global)s!important;\n";
    o+="    text-align: left!important;\n";
    o+="    line-height: 16px!important;\n";
    o+="}\n";
    o+="#cf_timeoff_sent_content {\n";
    o+="    display: none;\n";
    o+="    height: %(param_timeoff_sent_height)spx;\n";
    o+="    background-color: %(color_background_global)s!important;\n";
    o+="    opacity: %(color_opacity_global)s!important;\n";
    o+="}\n";
    o+="#cf_message_content {\n";
    o+="    display: none;\n";
    o+="    height: %(param_message_height)spx;\n";
    o+="}\n";
    o+="#cf_message_custom_text {\n";
    o+="    top: 24px!important;\n";
    o+="    right: 40px!important;\n";
    o+="    /* height: 60px!important; */\n";
    o+="}\n";
    o+="#cf_message_custom_text_value {\n";
    o+="    font-size: 16px!important;\n";
    o+="    color: %(color_font_global)s!important;\n";
    o+="    text-align: left!important;\n";
    o+="    line-height: 16px!important;\n";
    o+="}\n";
    o+="#cf_message_message_textarea {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 20px!important;\n";
    o+="    width: 250px!important;\n";
    o+="    bottom: 260px;\n";
    o+="    height: 74px!important;\n";
    o+="    color: #000!important;\n";
    o+="    resize: none!important;\n";
    o+="    /* background-image: none!important; */\n";
    o+="    background-color: %(color_background_inputs)s!important;\n";
    o+="    opacity: %(color_opacity_inputs)s!important;\n";
    o+="    border-radius: 12px!important;\n";
    o+="    padding: 14px!important;\n";
    o+="}\n";
    o+="#cf_message_name_input {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 20px!important;\n";
    o+="    width: 236px!important;\n";
    o+="    height: 36px!important;\n";
    o+="    bottom: 210px;\n";
    o+="    color: #000!important;\n";
    o+="    border-radius: 12px!important;\n";
    o+="    padding-left: 14px!important;\n";
    o+="}\n";
    o+="#cf_message_email_input {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 20px!important;\n";
    o+="    width: 236px!important;\n";
    o+="    height: 38px!important;\n";
    o+="    bottom: 160px;\n";
    o+="    color: #000!important;\n";
    o+="    border-radius: 12px!important;\n";
    o+="    padding-left: 14px!important;\n";
    o+="}\n";
    o+="#cf_message_phone_input {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 20px!important;\n";
    o+="    width: 236px!important;\n";
    o+="    height: 38px!important;\n";
    o+="    bottom: 110px;\n";
    o+="    color: #000!important;\n";
    o+="    border-radius: 12px!important;\n";
    o+="    padding-left: 14px!important;\n";
    o+="}\n";
    o+="#cf_message_send_button {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 20px!important;\n";
    o+="    right: 20px!important;\n";
    o+="    height: 38px!important;\n";
    o+="    bottom: 60px!important;\n";
    o+="    text-align: center!important;\n";
    o+="    cursor: pointer!important;\n";
    o+="    color: %(color_font_global)s!important;\n";
    o+="    line-height: 38px!important;\n";
    o+="    /* background-image: none!important; */\n";
    o+="    background-color: #3BB767!important;\n";
    o+="    opacity: %(color_opacity_call_button)s!important;\n";
    o+="    border-radius: 19px!important;\n";
    o+="}\n";
    o+=".cf_message_go_back_link {\n";
    o+="    position: absolute!important;\n";
    o+="    text-align: center!important;\n";
    o+="    left: 0px!important;\n";
    o+="    right: 0px!important;\n";
    o+="    bottom: 26px!important;\n";
    o+="    height: 16px!important;\n";
    o+="    color: %(color_font_link)s!important;\n";
    o+="    /* color: %(color_font_global)s!important;\n";
    o+="    opacity: .7!important; */\n";
    o+="    white-space: nowrap!important;\n";
    o+="    font-size: 13px!important;\n";
    o+="}\n";
    o+="#cf_message_sent_content {\n";
    o+="    display: none;\n";
    o+="    height: %(param_message_sent_height)spx;\n";
    o+="    background-color: %(color_background_global)s!important;\n";
    o+="    opacity: %(color_opacity_global)s!important;\n";
    o+="}\n";
    o+="#cf_message_sent_custom_text {\n";
    o+="    top: 24px!important;\n";
    o+="    /* bottom: 52px!important; */\n";
    o+="}\n";
    o+="#cf_message_sent_custom_text_value {\n";
    o+="    font-size: 16px!important;\n";
    o+="    color: %(color_font_global)s!important;\n";
    o+="    text-align: left!important;\n";
    o+="    line-height: 16px!important;\n";
    o+="}\n";
    o+="#cf_order_content {\n";
    o+="    display: none;\n";
    o+="    height: %(param_order_height)spx;\n";
    o+="}\n";
    o+="#cf_order_call_button {\n";
    o+="    position: absolute!important;\n";
    o+="    right: 21px!important;\n";
    o+="    bottom: 88px!important;\n";
    o+="}\n";
    o+="#cf_order_call_panel {\n";
    o+="    bottom: 87px!important;\n";
    o+="}\n";
    o+="#cf_order_daytime_panel {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 20px!important;\n";
    o+="    right: 20px!important;\n";
    o+="    bottom: 137px!important;\n";
    o+="    height: 38px!important;\n";
    o+="}\n";
    o+="#cf_order_custom_text {\n";
    o+="    top: 90px!important;\n";
    o+="    /* bottom: 185px!important; */\n";
    o+="}\n";
    o+="#cf_order_custom_text_value {\n";
    o+="    font-size: 16px!important;\n";
    o+="    color: %(color_font_global)s!important;\n";
    o+="    text-align: left!important;\n";
    o+="    line-height: 16px!important;\n";
    o+="}\n";
    o+=".cf_order_go_back_link {\n";
    o+="    position: absolute!important;\n";
    o+="    left: 0px!important;\n";
    o+="    right: 0px!important;\n";
    o+="    text-align: center!important;\n";
    o+="    bottom: 52px!important;\n";
    o+="    height: 16px!important;\n";
    o+="    color: %(color_font_link)s!important;\n";
    o+="    /* color: %(color_font_global)s!important;\n";
    o+="    opacity: .7!important; */\n";
    o+="    white-space: nowrap!important;\n";
    o+="    font-size: 13px!important;\n";
    o+="}\n";
    o+="#cf_order_sent_content {\n";
    o+="    display: none;\n";
    o+="    height: %(param_order_sent_height)spx;\n";
    o+="    background-color: %(color_background_global)s!important;\n";
    o+="    opacity: %(color_opacity_global)s!important;\n";
    o+="}\n";
    o+="#cf_order_sent_custom_text {\n";
    o+="    top: 90px!important;\n";
    o+="    /* bottom: 52px!important; */\n";
    o+="}\n";
    o+="#cf_order_sent_custom_text_value {\n";
    o+="    font-size: 16px!important;\n";
    o+="    color: %(color_font_global)s!important;\n";
    o+="    text-align: left!important;\n";
    o+="    line-height: 16px!important;\n";
    o+="}\n";
    o+=".cf__divimg { }\n";
    o+=".cf__divtext { }\n";
    o+=".cf__divpanel { }\n";
    o+=".cf__div0height {\n";
    o+="	height: 0px!important;\n";
    o+="}\n";
    o+=".cf__divhidden {\n";
    o+="	display: none!important;\n";
    o+="}\n";
    o+=".cf__divinput { }\n";
    o+=".cf__divlink {\n";
    o+="    cursor: pointer!important;\n";
    o+="}\n";
    o+=".cf__img { }\n";
    o+=".cf__u { text-decoration: underline!important; }\n";
    o+=".cf__span {\n";
    o+="    font-family: %(param_font1)s!important;\n";
    o+="    font-weight: 400!important;\n";
    o+="    font-style: normal!important;\n";
    o+="}\n";
    o+=".cf__p {\n";
    o+="    font-family: %(param_font1)s!important;\n";
    o+="    font-weight: 400!important;\n";
    o+="    font-style: normal!important;\n";
    o+="}\n";
    o+=".cf__disabled {\n";
    o+="    background-color: #aaa!important;\n";
    o+="    opacity: %(color_opacity_inputs)s!important;\n";
    o+="    color: #ccc!important;\n";
    o+="}\n";
    o+=".cf__valid {\n";
    o+="	border-color: %(color_background_inputs)s!important;\n";
    o+="    background-color: %(color_background_inputs)s!important;\n";
    o+="    opacity: %(color_opacity_inputs)s!important;\n";
    o+="}\n";
    o+=".cf__notvalid {\n";
    o+="    border: 1px solid #f00!important;\n";
    o+="    background-color: %(color_background_inputs)s!important;\n";
    o+="    /* background-color: #ecc!important; */\n";
    o+="    opacity: %(color_opacity_inputs)s!important;\n";
    o+="}\n";
    o+=".cf__input {\n";
    o+="    margin:0!important;\n";
    o+="    border: 1px solid %(color_background_inputs)s;\n";
    o+="    padding:0!important;\n";
    o+="    outline:0!important;\n";
    o+="    /* background-image: none!important; */\n";
    o+="    background: %(color_background_inputs)s;\n";
    o+="    background-color: %(color_background_inputs)s;\n";
    o+="    /* background: none!important; */\n";
    o+="    opacity: %(color_opacity_inputs)s!important;\n";
    o+="    -webkit-box-shadow: none!important;\n";
    o+="    -moz-box-shadow: none!important;\n";
    o+="    box-shadow:none!important;\n";
    o+="    display:inline-block;\n";
    o+="    vertical-align:middle!important;\n";
    o+="    white-space:normal!important;\n";
    o+="    color: #000!important;\n";
    o+="    line-height: 34px!important;\n";
    o+="    font-family: %(param_font1)s!important;\n";
    o+="    font-size: %(param_font_size_inputs)s!important;\n";
    o+="    -webkit-box-sizing:content-box!important;\n";
    o+="    -moz-box-sizing:content-box!important;\n";
    o+="    box-sizing:content-box!important;\n";
    o+="    -webkit-appearance: none!important;\n";
    o+="    -moz-appearance: none!important;\n";
    o+="    appearance: none!important;\n";
    o+="}\n";
    o+=".cf__input:focus, .cf__input:hover {\n";
    o+="	/* border: 0!important; */\n";
    o+="    border: 1px solid %(color_background_inputs)s;\n";
    o+="    outline:0!important;\n";
    o+="    -webkit-box-shadow: none!important;\n";
    o+="    -moz-box-shadow: none!important;\n";
    o+="    box-shadow:none!important;\n";
    o+="    background-color: %(color_background_inputs)s!important;\n";
    o+="    opacity: %(color_opacity_inputs)s!important;\n";
    o+="}\n";
    o+=".cf_call_panel input:-webkit-autofill {\n";
    o+="    -webkit-box-shadow: 0 0 0 1000px #ccc inset !important;\n";
    o+="    /* border: 0!important; */\n";
    o+="    /* border: 1px solid %(color_background_inputs)s; */\n";
    o+="}\n";
    o+=".cf_content input:-webkit-autofill {\n";
    o+="    -webkit-box-shadow: 0 0 0 1000px #ccc inset !important;\n";
    o+="    /* border: 0!important; */\n";
    o+="    border: 1px solid %(color_background_inputs)s;\n";
    o+="}\n";
    o+=".cf_call_panel input {\n";
    o+="    border: 0!important;\n";
    o+="    background: %(color_background_inputs)s;\n";
    o+="}\n";
    o+=".cf__select {\n";
    o+="    margin:0!important;\n";
    o+="    border: 0!important;\n";
    o+="    padding:0;\n";
    o+="    outline:0!important;\n";
    o+="    /* background-image: none!important; */\n";
    o+="    background: #F2F2F2 url(&quot;http://callfeed.net/static/img/widget/up_down_arrow.png&quot;) no-repeat right center ;\n";
    o+="    background-color: %(color_background_inputs)s!important;\n";
    o+="    opacity: %(color_opacity_inputs)s!important;\n";
    o+="    -webkit-box-shadow: none!important;\n";
    o+="    -moz-box-shadow: none!important;\n";
    o+="    box-shadow:none!important;\n";
    o+="    display:inline-block;\n";
    o+="    vertical-align:middle!important;\n";
    o+="    white-space:normal!important;\n";
    o+="    font-family:%(param_font1)s!important;\n";
    o+="    font-size: %(param_font_size_inputs)s!important;\n";
    o+="    -webkit-box-sizing:border-box!important;\n";
    o+="    -moz-box-sizing:border-box!important;\n";
    o+="    box-sizing:border-box!important;\n";
    o+="    cursor: pointer!important;\n";
    o+="    -webkit-appearance: none!important;\n";
    o+="    -moz-appearance: none!important;\n";
    o+="    appearance: none!important;\n";
    o+="}\n";
    o+=".cf__select:focus, .cf__select:hover {\n";
    o+="    outline:0!important;\n";
    o+="    -webkit-box-shadow: none!important;\n";
    o+="    -moz-box-shadow: none!important;\n";
    o+="    box-shadow:none!important;\n";
    o+="    border-color:transparent!important;\n";
    o+="}\n";
    o+=".cf__select [disabled] {\n";
    o+="    background-color: %(color_background_inputs)s!important;\n";
    o+="    opacity: %(color_opacity_inputs)s!important;\n";
    o+="    color: #ccc!important;\n";
    o+="}\n";
    o+=".cf__select [multiple] {\n";
    o+="    vertical-align:middle!important;\n";
    o+="}\n";
    o+=".cf__textarea {\n";
    o+="    margin:0!important;\n";
    o+="    padding:0;\n";
    o+="    border: 0!important;\n";
    o+="    outline:0!important;\n";
    o+="    overflow: auto!important;\n";
    o+="    line-height: 1!important;\n";
    o+="    font-family: %(param_font1)s!important;\n";
    o+="    font-size: %(param_font_size_inputs)s!important;\n";
    o+="    -webkit-box-shadow: none!important;\n";
    o+="    -moz-box-shadow: none!important;\n";
    o+="    box-shadow: none!important;\n";
    o+="    -moz-box-sizing:border-box!important;\n";
    o+="    -webkit-box-sizing:border-box!important;\n";
    o+="    box-sizing:border-box!important;\n";
    o+="    -webkit-appearance: none!important;\n";
    o+="    -moz-appearance: none!important;\n";
    o+="    appearance: none!important;\n";
    o+="}\n";
    o+="&lt;/style&gt;\n";
    for (var key in settings) if (settings.hasOwnProperty(key))
        if ((key.indexOf("flag_")==0)||(key.indexOf("text_")==0)||(key.indexOf("param_")==0)||(key.indexOf("color_")==0))
            o = o.replace(new RegExp("%\\("+key+"\\)s", "g"), settings[key]);
    return o;
}



//
//[build_html.js]
//

function CallFeedBuildHTML(settings) {
    var o = "";
    o+="&lt;div id=&quot;callfeed_root&quot; style=&quot;z-index:%(param_z_index_global)s;&quot;&gt;\n";
    o+="  &lt;div id=&quot;cf_main_button&quot;&gt;\n";
    o+="    &lt;div id=&quot;cf_main_button_content&quot;&gt;\n";
    o+="      &lt;span id=&quot;cf_main_button_label&quot; class=&quot;cf__span&quot;&gt;%(text_button)s&lt;/span&gt;\n";
    o+="    &lt;/div&gt;\n";
    o+="  &lt;/div&gt;\n";
    o+="  &lt;div id=&quot;cf_widget&quot;&gt;\n";
    o+="    &lt;div id=&quot;cf_widget_triangle_img&quot;&gt;&lt;/div&gt;\n";
    o+="    &lt;div id=&quot;cf_main_content&quot; class=&quot;cf_content cf__divpanel&quot;&gt;\n";
    o+="     &lt;div id=&quot;cf_main_background&quot; class=&quot;cf_background cf__divpanel&quot;&gt;\n";
    o+="      &lt;div class=&quot;cf_close_button cf__divimg&quot;&gt;\n";
    o+="        &lt;img class=&quot;cf_close_button_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u42.png&quot;&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_manager_panel cf__divpanel&quot;&gt;\n";
    o+="        &lt;img class=&quot;cf_manager_face cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/transparent.gif&quot;&gt;\n";
    o+="        &lt;div class=&quot;cf_manager_name cf__divtext&quot;&gt;\n";
    o+="          &lt;span class=&quot;cf_manager_name_value cf__span&quot;&gt;&lt;/span&gt;\n";
    o+="        &lt;/div&gt;\n";
    o+="        &lt;div class=&quot;cf_manager_role cf__divtext&quot;&gt;\n";
    o+="          &lt;span class=&quot;cf_manager_role_value cf__span&quot;&gt;&lt;/span&gt;\n";
    o+="        &lt;/div&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_time_select_link cf__divlink&quot;&gt;\n";
    o+="        &lt;span class=&quot;cf__span cf__u&quot;&gt;%(text_link_order)s&lt;/span&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_send_message_link cf__divlink&quot;&gt;\n";
    o+="        &lt;span class=&quot;cf__span cf__u&quot;&gt;%(text_link_send_message)s&lt;/span&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_main_call_panel&quot; class=&quot;cf_call_panel cf__divpanel cf__valid&quot;&gt;\n";
    o+="        &lt;input id=&quot;cf_main_call_input&quot; class=&quot;cf_call_input cf__input&quot; placeholder=&quot;Ваш номер телефона&quot; type=&quot;text&quot; pattern=&quot;[0-9]*&quot; /&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_main_custom_text&quot; class=&quot;cf_custom_text cf__divtext&quot;&gt;\n";
    o+="        &lt;p id=&quot;cf_main_custom_text_value&quot; class=&quot;cf__p&quot;&gt;%(text_main)s&lt;/p&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="     &lt;/div&gt;\n";
    o+="     &lt;div id=&quot;cf_main_call_button&quot; class=&quot;cf_call_button cf__divimg&quot;&gt;\n";
    o+="       &lt;img id=&quot;cf_main_call_button_bg_img&quot; class=&quot;cf_call_button_bg_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u38.png&quot;&gt;\n";
    o+="       &lt;img id=&quot;cf_main_call_button_phone_img&quot; class=&quot;cf_call_button_phone_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u40.png&quot;&gt;\n";
    o+="     &lt;/div&gt;\n";
    o+="    &lt;/div&gt;\n";
    o+="    &lt;div id=&quot;cf_dial_content&quot; class=&quot;cf_content cf__divpanel&quot;&gt;\n";
    o+="      &lt;div class=&quot;cf_close_button cf__divimg&quot;&gt;\n";
    o+="        &lt;img class=&quot;cf_close_button_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u42.png&quot;&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_manager_panel cf__divpanel&quot;&gt;\n";
    o+="        &lt;img class=&quot;cf_manager_face cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/transparent.gif&quot;&gt;\n";
    o+="        &lt;div class=&quot;cf_manager_name cf__divtext&quot;&gt;\n";
    o+="          &lt;span class=&quot;cf_manager_name_value cf__span&quot;&gt;&lt;/span&gt;\n";
    o+="        &lt;/div&gt;\n";
    o+="        &lt;div class=&quot;cf_manager_role cf__divtext&quot;&gt;\n";
    o+="          &lt;span class=&quot;cf_manager_role_value cf__span&quot;&gt;&lt;/span&gt;\n";
    o+="        &lt;/div&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_send_message_link cf__divlink&quot;&gt;\n";
    o+="        &lt;span class=&quot;cf__span cf__u&quot;&gt;%(text_link_send_message)s&lt;/span&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_dial_custom_text&quot; class=&quot;cf_custom_text cf__divtext&quot;&gt;\n";
    o+="        &lt;p id=&quot;cf_dial_custom_text_value&quot; class=&quot;cf__p&quot;&gt;%(text_dial_ready)s&lt;/p&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_dial_countdown_panel&quot; class=&quot;cf__divpanel&quot;&gt;\n";
    o+="        &lt;span id=&quot;cf_dial_countdown_text&quot; class=&quot;cf__span&quot;&gt;&lt;/span&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="    &lt;/div&gt;\n";
    o+="    &lt;div id=&quot;cf_free_content&quot; class=&quot;cf_content cf__divpanel&quot;&gt;\n";
    o+="     &lt;div id=&quot;cf_free_background&quot; class=&quot;cf_background cf__divpanel&quot;&gt;\n";
    o+="      &lt;div class=&quot;cf_close_button cf__divimg&quot;&gt;\n";
    o+="        &lt;img class=&quot;cf_close_button_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u42.png&quot;&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_manager_panel cf__divpanel&quot;&gt;\n";
    o+="        &lt;img class=&quot;cf_manager_face cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/transparent.gif&quot;&gt;\n";
    o+="        &lt;div class=&quot;cf_manager_name cf__divtext&quot;&gt;\n";
    o+="          &lt;span class=&quot;cf_manager_name_value cf__span&quot;&gt;&lt;/span&gt;\n";
    o+="        &lt;/div&gt;\n";
    o+="        &lt;div class=&quot;cf_manager_role cf__divtext&quot;&gt;\n";
    o+="          &lt;span class=&quot;cf_manager_role_value cf__span&quot;&gt;&lt;/span&gt;\n";
    o+="        &lt;/div&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_free_custom_text&quot; class=&quot;cf_custom_text cf__divtext&quot;&gt;\n";
    o+="        &lt;p id=&quot;cf_free_custom_text_value&quot; class=&quot;cf__p&quot;&gt;%(text_order_start)s&lt;/p&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_free_call_panel&quot; class=&quot;cf_call_panel cf__divpanel&quot;&gt;\n";
    o+="        &lt;input id=&quot;cf_free_call_input&quot; class=&quot;cf_call_input cf__input cf__valid&quot; value=&quot;&quot; placeholder=&quot;Ваш номер телефона&quot; maxlength=&quot;12&quot; type=&quot;tel&quot; /&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_free_daytime_panel&quot; class=&quot;cf__divpanel&quot;&gt;\n";
    o+="        &lt;select id=&quot;cf_free_day_select&quot; class=&quot;cf_day_select cf__select&quot;&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='Сегодня'&gt;Сегодня&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='Завтра'&gt;Завтра&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='Послезавтра'&gt;Послезавтра&lt;/option&gt;\n";
    o+="        &lt;/select&gt;\n";
    o+="        &lt;p class=&quot;cf_daytime_at_text cf__p&quot;&gt;в&lt;/p&gt;\n";
    o+="        &lt;select id=&quot;cf_free_time_select&quot; class=&quot;cf_time_select cf__select&quot;&gt;\n";
    o+="        &lt;/select&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_send_message_link cf__divlink&quot;&gt;\n";
    o+="        &lt;span class=&quot;cf__span cf__u&quot;&gt;%(text_link_send_message)s&lt;/span&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="     &lt;/div&gt;\n";
    o+="     &lt;div id=&quot;cf_free_call_button&quot; class=&quot;cf_call_button cf__divimg&quot;&gt;\n";
    o+="       &lt;img id=&quot;cf_free_call_button_bg_img&quot; class=&quot;cf_call_button_bg_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u38.png&quot;&gt;\n";
    o+="       &lt;img id=&quot;cf_free_call_button_phone_img&quot; class=&quot;cf_call_button_phone_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u40.png&quot;&gt;\n";
    o+="     &lt;/div&gt;\n";
    o+="    &lt;/div&gt;\n";
    o+="    &lt;div id=&quot;cf_free_sent_content&quot; class=&quot;cf_content cf__divpanel&quot;&gt;\n";
    o+="      &lt;div class=&quot;cf_close_button cf__divimg&quot;&gt;\n";
    o+="        &lt;img class=&quot;cf_close_button_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u42.png&quot;&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_free_sent_custom_text&quot; class=&quot;cf_custom_text cf__divtext&quot;&gt;\n";
    o+="        &lt;p id=&quot;cf_free_sent_custom_text_value&quot; class=&quot;cf_custom_text_value cf__p&quot;&gt;%(text_timeoff_done)s&lt;/p&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_send_message_link cf__divlink&quot;&gt;\n";
    o+="        &lt;span class=&quot;cf__span cf__u&quot;&gt;%(text_link_send_message)s&lt;/span&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="    &lt;/div&gt;\n";
    o+="    &lt;div id=&quot;cf_timeoff_content&quot; class=&quot;cf_content cf__divpanel&quot;&gt;\n";
    o+="     &lt;div id=&quot;cf_timeoff_background&quot; class=&quot;cf_background cf__divpanel&quot;&gt;\n";
    o+="      &lt;div class=&quot;cf_close_button cf__divimg&quot;&gt;\n";
    o+="        &lt;img class=&quot;cf_close_button_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u42.png&quot;&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_timeoff_custom_text&quot; class=&quot;cf_custom_text cf__divtext&quot;&gt;\n";
    o+="        &lt;p id=&quot;cf_timeoff_custom_text_value&quot; class=&quot;cf__p&quot;&gt;%(text_timeoff_start)s&lt;/p&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_timeoff_daytime_panel&quot; class=&quot;cf__divpanel&quot;&gt;\n";
    o+="        &lt;select id=&quot;cf_timeoff_day_select&quot; class=&quot;cf_day_select cf__select&quot;&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='Сегодня'&gt;Сегодня&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='Завтра'&gt;Завтра&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='Послезавтра'&gt;Послезавтра&lt;/option&gt;\n";
    o+="        &lt;/select&gt;\n";
    o+="        &lt;p class=&quot;cf_daytime_at_text cf__p&quot;&gt;в&lt;/p&gt;\n";
    o+="        &lt;select id=&quot;cf_timeoff_time_select&quot; class=&quot;cf_time_select cf__select&quot;&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='10:00'&gt;10:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='11:00'&gt;11:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='12:00'&gt;12:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='13:00'&gt;13:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='14:00'&gt;14:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='15:00'&gt;15:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='16:00'&gt;16:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='17:00'&gt;17:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='18:00'&gt;18:00&lt;/option&gt;\n";
    o+="        &lt;/select&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_timeoff_call_panel&quot; class=&quot;cf_call_panel cf__divpanel&quot;&gt;\n";
    o+="        &lt;input id=&quot;cf_timeoff_call_input&quot; class=&quot;cf_call_input cf__input cf__valid&quot; value=&quot;&quot; placeholder=&quot;Ваш номер телефона&quot; maxlength=&quot;12&quot; type=&quot;tel&quot; /&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_send_message_link cf__divlink&quot;&gt;\n";
    o+="        &lt;span class=&quot;cf__span cf__u&quot;&gt;%(text_link_send_message)s&lt;/span&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="     &lt;/div&gt;\n";
    o+="     &lt;div id=&quot;cf_timeoff_call_button&quot; class=&quot;cf_call_button cf__divimg&quot;&gt;\n";
    o+="       &lt;img id=&quot;cf_timeoff_call_button_bg_img&quot; class=&quot;cf_call_button_bg_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u38.png&quot;&gt;\n";
    o+="       &lt;img id=&quot;cf_timeoff_call_button_phone_img&quot; class=&quot;cf_call_button_phone_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u40.png&quot;&gt;\n";
    o+="     &lt;/div&gt;\n";
    o+="    &lt;/div&gt;\n";
    o+="    &lt;div id=&quot;cf_timeoff_sent_content&quot; class=&quot;cf_content cf__divpanel&quot;&gt;\n";
    o+="      &lt;div class=&quot;cf_close_button cf__divimg&quot;&gt;\n";
    o+="        &lt;img class=&quot;cf_close_button_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u42.png&quot;&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_timeoff_sent_custom_text&quot; class=&quot;cf_custom_text cf__divtext&quot;&gt;\n";
    o+="        &lt;p id=&quot;cf_timeoff_sent_custom_text_value&quot; class=&quot;cf_custom_text_value cf__p&quot;&gt;%(text_timeoff_done)s&lt;/p&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_send_message_link cf__divlink&quot;&gt;\n";
    o+="        &lt;span class=&quot;cf__span cf__u&quot;&gt;%(text_link_send_message)s&lt;/span&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="    &lt;/div&gt;\n";
    o+="    &lt;div id=&quot;cf_message_content&quot; class=&quot;cf_content cf__divpanel&quot;&gt;\n";
    o+="     &lt;div id=&quot;cf_message_background&quot; class=&quot;cf_background cf__divpanel&quot;&gt;\n";
    o+="      &lt;div class=&quot;cf_close_button cf__divimg&quot;&gt;\n";
    o+="        &lt;img class=&quot;cf_close_button_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u42.png&quot;&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_message_custom_text&quot; class=&quot;cf_custom_text cf__divtext&quot;&gt;\n";
    o+="        &lt;p id=&quot;cf_message_custom_text_value&quot; class=&quot;cf__p&quot;&gt;%(text_message_start)s&lt;/p&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;textarea id=&quot;cf_message_message_textarea&quot; class=&quot;cf__textarea&quot; placeholder=&quot;Напишите ваш вопрос&quot; &gt;&lt;/textarea&gt;\n";
    o+="      &lt;input id=&quot;cf_message_name_input&quot; class=&quot;cf__input cf__valid&quot; value=&quot;&quot; placeholder=&quot;Ваше имя&quot; type=&quot;text&quot; /&gt;\n";
    o+="      &lt;input id=&quot;cf_message_email_input&quot; class=&quot;cf__input cf__valid&quot; value=&quot;&quot; placeholder=&quot;E-mail&quot; type=&quot;email&quot; /&gt;\n";
    o+="      &lt;input id=&quot;cf_message_phone_input&quot; class=&quot;cf__input cf__valid&quot; value=&quot;&quot; placeholder=&quot;Телефон&quot; type=&quot;tel&quot; /&gt;\n";
    o+="      &lt;div class=&quot;cf_message_go_back_link cf__divlink&quot;&gt;\n";
    o+="        &lt;span class=&quot;cf__span cf__u&quot;&gt;%(text_link_message_go_back)s&lt;/span&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="     &lt;/div&gt;\n";
    o+="     &lt;div id=&quot;cf_message_send_button&quot; class=&quot;cf_button&quot;&gt;\n";
    o+="       &lt;span class=&quot;cf__span&quot;&gt;Отправить&lt;/span&gt;\n";
    o+="     &lt;/div&gt;\n";
    o+="    &lt;/div&gt;\n";
    o+="    &lt;div id=&quot;cf_message_sent_content&quot; class=&quot;cf_content cf__divpanel&quot;&gt;\n";
    o+="      &lt;div class=&quot;cf_close_button cf__divimg&quot;&gt;\n";
    o+="        &lt;img class=&quot;cf_close_button_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u42.png&quot;&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_message_sent_custom_text&quot; class=&quot;cf_custom_text cf__divtext&quot;&gt;\n";
    o+="        &lt;p id=&quot;cf_message_sent_custom_text_value&quot; class=&quot;cf__p&quot;&gt;%(text_message_sent)s&lt;/p&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_message_go_back_link cf__divlink&quot;&gt;\n";
    o+="        &lt;span class=&quot;cf__span cf__u&quot;&gt;%(text_link_message_go_back)s&lt;/span&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="    &lt;/div&gt;\n";
    o+="    &lt;div id=&quot;cf_order_content&quot; class=&quot;cf_content cf__divpanel&quot;&gt;\n";
    o+="     &lt;div id=&quot;cf_order_background&quot; class=&quot;cf_background cf__divpanel&quot;&gt;\n";
    o+="      &lt;div class=&quot;cf_close_button cf__divimg&quot;&gt;\n";
    o+="        &lt;img class=&quot;cf_close_button_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u42.png&quot;&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_manager_panel cf__divpanel&quot;&gt;\n";
    o+="        &lt;img class=&quot;cf_manager_face cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/transparent.gif&quot;&gt;\n";
    o+="        &lt;div class=&quot;cf_manager_name cf__divtext&quot;&gt;\n";
    o+="          &lt;span class=&quot;cf_manager_name_value cf__span&quot;&gt;&lt;/span&gt;\n";
    o+="        &lt;/div&gt;\n";
    o+="        &lt;div class=&quot;cf_manager_role cf__divtext&quot;&gt;\n";
    o+="          &lt;span class=&quot;cf_manager_role_value cf__span&quot;&gt;&lt;/span&gt;\n";
    o+="        &lt;/div&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_order_custom_text&quot; class=&quot;cf_custom_text cf__divtext&quot;&gt;\n";
    o+="        &lt;p id=&quot;cf_order_custom_text_value&quot; class=&quot;cf_custom_text_value cf__p&quot;&gt;%(text_order_start)s&lt;/p&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_order_call_panel&quot; class=&quot;cf_call_panel cf__divpanel&quot;&gt;\n";
    o+="        &lt;input id=&quot;cf_order_call_input&quot; class=&quot;cf_call_input cf__input cf__valid&quot; value=&quot;&quot; placeholder=&quot;Ваш номер телефона&quot; maxlength=&quot;12&quot; type=&quot;tel&quot; /&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_order_daytime_panel&quot; class=&quot;cf__divpanel&quot;&gt;\n";
    o+="        &lt;select id=&quot;cf_order_day_select&quot; class=&quot;cf_day_select cf__select&quot;&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='Сегодня'&gt;Сегодня&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='Завтра'&gt;Завтра&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='Послезавтра'&gt;Послезавтра&lt;/option&gt;\n";
    o+="        &lt;/select&gt;\n";
    o+="        &lt;p class=&quot;cf_daytime_at_text cf__p&quot;&gt;в&lt;/p&gt;\n";
    o+="        &lt;select id=&quot;cf_order_time_select&quot; class=&quot;cf_time_select cf__select&quot;&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='10:00'&gt;10:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='11:00'&gt;11:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='12:00'&gt;12:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='13:00'&gt;13:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='14:00'&gt;14:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='15:00'&gt;15:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='16:00'&gt;16:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='17:00'&gt;17:00&lt;/option&gt;\n";
    o+="          &lt;option class=&quot;cf__option&quot; value='18:00'&gt;18:00&lt;/option&gt;\n";
    o+="        &lt;/select&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_send_message_link cf__divlink&quot;&gt;\n";
    o+="        &lt;span class=&quot;cf__span cf__u&quot;&gt;%(text_link_send_message)s&lt;/span&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_order_go_back_link cf__divlink&quot;&gt;\n";
    o+="        &lt;span class=&quot;cf__span cf__u&quot;&gt;%(text_link_go_back)s&lt;/span&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="     &lt;/div&gt;\n";
    o+="     &lt;div id=&quot;cf_order_call_button&quot; class=&quot;cf_call_button cf__divimg&quot;&gt;\n";
    o+="       &lt;img id=&quot;cf_order_call_button_bg_img&quot; class=&quot;cf_call_button_bg_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u38.png&quot;&gt;\n";
    o+="       &lt;img id=&quot;cf_order_call_button_phone_img&quot; class=&quot;cf_call_button_phone_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u40.png&quot;&gt;\n";
    o+="     &lt;/div&gt;\n";
    o+="    &lt;/div&gt;\n";
    o+="    &lt;div id=&quot;cf_order_sent_content&quot; class=&quot;cf_content cf__divpanel&quot;&gt;\n";
    o+="      &lt;div class=&quot;cf_close_button cf__divimg&quot;&gt;\n";
    o+="        &lt;img class=&quot;cf_close_button_img cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/u42.png&quot;&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_manager_panel cf__divpanel&quot;&gt;\n";
    o+="        &lt;img class=&quot;cf_manager_face cf__img&quot; style=&quot;outline: medium none;&quot; tabindex=&quot;0&quot; src=&quot;http://callfeed.net/static/img/widget/transparent.gif&quot;&gt;\n";
    o+="        &lt;div class=&quot;cf_manager_name cf__divtext&quot;&gt;\n";
    o+="          &lt;span class=&quot;cf_manager_name_value cf__span&quot;&gt;&lt;/span&gt;\n";
    o+="        &lt;/div&gt;\n";
    o+="        &lt;div class=&quot;cf_manager_role cf__divtext&quot;&gt;\n";
    o+="          &lt;span class=&quot;cf_manager_role_value cf__span&quot;&gt;&lt;/span&gt;\n";
    o+="        &lt;/div&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div id=&quot;cf_order_sent_custom_text&quot; class=&quot;cf_custom_text cf__divtext&quot;&gt;\n";
    o+="        &lt;p id=&quot;cf_order_sent_custom_text_value&quot; class=&quot;cf_custom_text_value cf__p&quot;&gt;%(text_order_done)s&lt;/p&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="      &lt;div class=&quot;cf_send_message_link cf__divlink&quot;&gt;\n";
    o+="        &lt;span class=&quot;cf__span cf__u&quot;&gt;%(text_link_send_message)s&lt;/span&gt;\n";
    o+="      &lt;/div&gt;\n";
    o+="    &lt;/div&gt;\n";
    o+="    &lt;div id=&quot;cf_copyright_link&quot; class=&quot;cf__divlink&quot;&gt;\n";
    o+="      &lt;a id=&quot;cf_copyright_link_content&quot; class=&quot;cf__link&quot; href=&quot;http://callfeed.net&quot; target=_blank&gt;callfeed.net&lt;/a&gt;\n";
    o+="    &lt;/div&gt;\n";
    o+="  &lt;/div&gt;\n";
    o+="&lt;/div&gt;\n";
    for (var key in settings) if (settings.hasOwnProperty(key))
        if ((key.indexOf("flag_")==0)||(key.indexOf("text_")==0)||(key.indexOf("param_")==0)||(key.indexOf("color_")==0))
            o = o.replace(new RegExp("%\\("+key+"\\)s", "g"), settings[key]);
    return o;
}



//
//[build_embed.js]
//

function CallFeedBuildEmbedHTML(token, jsfile) {
    if (jsfile==undefined)
        jsfile = 'cf.min.js';
    var o = "";
    o+='&lt;script type=&quot;text/javascript&quot;&gt;';
    o+='var CallFeedToken=&quot;'+token+'&quot;;';
    o+='&lt;/script&gt;\n';
    o+='&lt;script type=&quot;text/javascript&quot; ';
    o+='charset=&quot;UTF-8&quot; ';
    o+='src=&quot;http://callfeed.net/static/'+jsfile+'&quot;';
    o+='&gt;';
    o+='&lt;/script&gt;\n';
    return o;
}


//
//[build_preload.js]
//

function CallFeedBuildPreLoadHTML(settings) {
    var o = "";
    o+="&lt;style type=&quot;text/css&quot;&gt;\n";
    if (settings.font_url1) {
	    o+='@font-face {\n'; 
	    o+='font-family: "'+settings.font_family1+'";\n'; 
	    o+='src:  url("'+settings.font_url1+'");\n'; 
	    o+='font-weight: normal;\n';
	    o+='font-style: normal;\n';
	    o+='}\n';
    }
    /*
    o+='@font-face {\n'; 
    o+='font-family: "CallFeedFont2";\n'; 
    o+='src:  url("'+settings.font_url2+'");\n'; 
    o+='font-weight: normal;\n';
    o+='font-style: normal;\n';
    o+='}\n';
    o+='@font-face {\n'; 
    o+='font-family: "CallFeedFont3";\n'; 
    o+='src:  url("'+settings.font_url3+'");\n'; 
    o+='font-weight: normal;\n';
    o+='font-style: normal;\n';
    o+='}\n';
    */
    o+="&lt;/style&gt;\n";
    o+='&lt;div class="callfeed_preload" style="opacity: 0;"&gt;\n';
    if (settings.font_family1) {
    	o+='&lt;span style="font-family: '+settings.font_family1+';"&gt;&lt;/span&gt;\n';
    }
    //if (settings.color_background_image_global) {
    //	o+='&lt;img width="0" height="0" src="'+settings.color_background_image_global+'" class="cf__divhidden" &gt;\n';
    //}
    //o+='&lt;span style="font-family: '+settings.font_family2+';"&gt;&lt;/span&gt;\n';
    //o+='&lt;span style="font-family: '+settings.font_family3+';"&gt;&lt;/span&gt;\n';
    o+='&lt;/div&gt;\n';
    return o;
}


//
//[builder.js]
//

function CallFeedGenerateSources(my_token, settings){
	var sett = settings; 
	var defaults = CallFeedDefaultSettings(my_token);
	
    if (!sett)
    	sett = defaults;
    else {
    	for (var key in defaults) 
	        if (defaults.hasOwnProperty(key) && !sett.hasOwnProperty(key))
	        	sett[key] = defaults[key];
    	for (var controller_key in defaults.controllers)
	        if (defaults.controllers.hasOwnProperty(controller_key) && !sett.controllers.hasOwnProperty(controller_key))
	        	sett.controllers[key] = defaults.controllers[key];
    }
   
    var preload = CallFeedBuildPreLoadHTML(sett);
    var embed = CallFeedBuildEmbedHTML(my_token, 'cf.devel.js');
    var widget = CallFeedBuildHTML(sett);
    var styles = CallFeedBuildCSS(sett);

    debug.log('CallFeedGenerateSources', [preload, widget, styles, embed, sett]);
    
    return [preload, widget, styles, embed, sett];  
}




//
//[utils.js]
//


if (typeof String.prototype.trimLeft !== 'function') {
	String.prototype.trimLeft = function(charlist) {
	  if (charlist === undefined)
	    charlist = "\s";
	 
	  return this.replace(new RegExp("^[" + charlist + "]+"), "");
	};
}

if (typeof String.prototype.trimRight !== 'function') {
	String.prototype.trimRight = function(charlist) {
		  if (charlist === undefined)
		    charlist = "\s";
		 
		  return this.replace(new RegExp("[" + charlist + "]+$"), "");
	};
}

if (typeof String.prototype.trim !== 'function') {
	String.prototype.trim = function(charlist) {
		  return this.trimLeft(charlist).trimRight(charlist);
	};
}

if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

function isValidEmailAddress(emailAddress) {
	if (!emailAddress) return false;
    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    return pattern.test(emailAddress);
}


function isValidPhoneNumber(phoneNumber) {
	if (!phoneNumber) return false;
    var pattern = new RegExp(/^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/);
    return pattern.test(phoneNumber);
}


function isTouchDevice() {
	var msGesture = window.navigator && window.navigator.msPointerEnabled && window.MSGesture;
	var ret = (( "ontouchstart" in window ) || msGesture || window.DocumentTouch && document instanceof DocumentTouch);
	debug.log('isTouchDevice() result:', window, document, msGesture, ret);
	return ret;
}


function weekdays() {
	return ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
}


function weekday2index() {
	return {
		'Понедельник': 1,
		'Вторник': 2,
		'Среда': 3,
		'Четверг': 4,
		'Пятница': 5,
		'Суббота': 6,
		'Воскресенье': 7
	};
}


function conver_weekday_to_number(weekday_or_day_label) {
	var result = weekday2index()[weekday_or_day_label];
	if (result)
		return result;
	var date = new Date;
	var day = date.getDay();
	if (day == 0)
		day = 7;
	if (weekday_or_day_label == 'Сегодня') {
		result = day;
	} else if (weekday_or_day_label == 'Завтра') {
		result = day + 1;
	} else if (weekday_or_day_label == 'Послезавтра') {
		result = day + 2;
	}
	if (result > 7)
		result -= 7;
	return result;
}


function convert_weekday_to_delta_days(weekday_or_day_label) {
	var date = new Date;
	var day = date.getDay();
	if (day == 0)
		day = 7;
	var newday = weekday2index()[weekday_or_day_label];
	var result = 0;
	if (newday) {
		result = newday - day;
		if (result < 0)
			result += 7;
	} else {
		if (weekday_or_day_label == 'Сегодня') {
			result = 0;
		} else if (weekday_or_day_label == 'Завтра') {
			result = 1;
		} else if (weekday_or_day_label == 'Послезавтра') {
			result = 2;
		}
	}
	return result;
}





//
//[automat.js]
//

//debug.log('import automat.js');

function Class() {
}

Class.prototype.construct = function() {};

Class.extend = function(def) {
    var classDef = function() {
        if (arguments[0] !== Class) {
            this.construct.apply(this, arguments);
        }
    };

    var proto = new this(Class);
    var superClass = this.prototype;

    for (var n in def) {
        var item = def[n];                      
        if (item instanceof Function)
            item.$ = superClass;
        proto[n] = item;
    }

    classDef.prototype = proto;

    classDef.extend = this.extend;      
    return classDef;
};


var Automat = Class.extend({

    state: null,
    
    debug: true,
    
    log_events: true,

    name: null,

    construct: function(begin_state) {
        this.state = begin_state;
        this.name = "undefined";
        this.init();
        if (this.debug)
        	debug.log('CREATED AUTOMAT ' + this.name);
    },

    A: function (event, args) {
    },
    
    init: function () {
    },
    
    state_changed: function (old_state, new_state, event, args) {
    },

    event: function (evt, args) {
        if (this.debug && this.log_events)
	        debug.log(this.name + '(' + this.state + ') fired with \'' + evt + '\'');
        var old = this.state;
        this.A(evt, args);
        if (old != this.state)
            if (this.debug)
                debug.log(this.name + ' : ' + old + ' -> ' + this.state);
        	this.state_changed(old, this.state, evt, args);
    }
    
});




//
//[widget_session.js]
//

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
    	$('body').append($(sources[0].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')));
    	$('body').append($(sources[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')));
    	$('body').append($(sources[2].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')));
        debug.log('INIT!', CallFeedOptions)
    },
    
    doInitDefaults: function(event, args) {
        // Action method.
    	sources = CallFeedGenerateSources(CallFeedToken, null);
    	CallFeedOptions = sources[4];
        debug.log(this.name+".doInitDefaults('"+event+"', "+args+")", CallFeedOptions);
    	$('body').append($(sources[0].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')));
    	$('body').append($(sources[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')));
    	$('body').append($(sources[2].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')));
        debug.log('INIT DEFAULTS!', CallFeedOptions)
    },    

    doConnect: function(event, args) {
        // Action method.
        debug.log(this.name+".doConnect('"+event+"', "+args+"): ", encodeURIComponent(this.hostname));
        jsonp_request('http://callfeed.net/input?'+$.param({
    		'request_options': '1',
    		'token': CallFeedToken,
    		'hostname': encodeURIComponent(this.hostname)
    	}),
	        function(data) {
	            debug.log("doConnect.success", data);
	            var response = "error";
	            var message = "";
	            var options = null;
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
	            	options = data['options'];
	            	mode = data['mode'];
	            	options['managers'] = data['managers'];
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
	        		if (options['flag_disable_on_mobiles'] && isTouchDevice()) {
		            	CallFeedSession.event('off');
	            		return;
	        		}
	            	if (mode == 'off') {
		            	debug.log('This widget IS NOT ACTIVE at the moment');
		            	CallFeedSession.event('off');
	            	} else {
		            	CallFeedOptions = options;
		            	CallFeedOptions.mode = mode;
		            	debug.log('SETTINGS DOWNLOADED!', CallFeedOptions);
		            	CallFeedSession.event('connected');
	            	}
	            } else {
	            	debug.log('FAILED', response, options);
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
    }
    
    
});



//
//[widget_controller.js]
//

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



//
//[widget_visualizer.js]
//

// widget_visualizer() machine
//
// EVENTS:
//

//   `hide`
//   `init`
//   `on-resize`
//   `on-scroll`
//   `show`

var WidgetVisualizer = Automat.extend({

    construct: function(begin_state, parent) {
    	this.debug = true;
    	this.log_events = false;
        this.state = begin_state;
        this.name = "widget_visualizer";
        this.parent = parent;
        this.is_touch = this._is_touch_device();
        debug.log('CREATED AUTOMAT ' + this.name, "TOUCH DEVICE:", this.is_touch);
    },

    kill: function() {
        debug.log('DESTROY AUTOMAT ' + this.name);
    	this.parent = null;
    	delete this.parent;
    },
    
    state_changed: function (old_state, new_state, event, args) {
    },

    A: function(event, args) {
        // Access method to interact with widget_visualizer() machine.
        switch (this.state) {
            //---AT_STARTUP---
            case 'AT_STARTUP': {
                if ( event === 'init' && this.isStaticWindow(event, args) ) {
                    this.state = 'STATIC_WINDOW';
                    this.doInit(event, args);
                    this.doSetUpStaticWindow(event, args);
                }
                break;
            }
            //---STATIC_WINDOW---
            case 'STATIC_WINDOW': {
                if ( event === 'show' ) {
                    this.doShow(event, args);
                } else if ( event === 'hide' ) {
                    this.doHide(event, args);
                }
                break;
            }
        }
    },


    isStaticWindow: function(event, args) {
        // Condition method.
        debug.log(this.name+".isStaticWindow('"+event+"', "+args+")");
        return (CallFeedOptions.position == "fixed"); 
    },

    doInit: function(event, args) {
        // Action method.
        debug.log(this.name+".doInit('"+event+"', "+args+")");
        this._apply_main_button();
        this._apply_background();
        this._apply_managers();
        this._apply_text_color();
        this._bind_events();
        this._size_off_pages();
    	// Setup logo animation
    	//this._bind_mouse_over_logo();
    	//this._start_loop_animate_logo();
    },
    
    doSetUpStaticWindow: function(event, args) {
        // Action method.
        debug.log(this.name+".doSetUpStaticWindow('"+event+"', "+args+")");
    },

    doShow: function(event, args) {
        // Action method.
        debug.log(this.name+".doShow('"+event+"', "+args+")");
        this._widget_show();
    },

    doHide: function(event, args) {
        // Action method.
        debug.log(this.name+".doHide('"+event+"', "+args+")");
        this._widget_hide();
    },

    // EVENTS BINDING //////////////////////////////////////////////////////// 
    
	_bind_events: function() {
    	// Disable "Enter" pressed on input field 
    	$('.cf_call_input').on('keypress', function (e) {
            var event = e || window.event;
            var charCode = event.which || event.keyCode;
            if ( charCode == '13' ) {
                event.preventDefault();
              	return false;
            }
            return true;
    	});
    	// Catch moment when user want to enter phone number and put "+7"
    	$('.cf_call_input,#cf_message_phone_input').focus(function() {
    		if ($(this).val() == "")
    			$(this).val("+7");
    	});
    	// Make "valid" input for phone number
    	$(".cf_call_input, #cf_message_phone_input").keydown(function (e) {
            // Allow: +, backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [43, 46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                 // Allow: Ctrl+A, Command+A
                (e.keyCode == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) || 
                 // Allow: home, end, left, right, down, up
                (e.keyCode >= 35 && e.keyCode <= 40)) {
                     // let it happen, don't do anything
                     return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
	},    
    
    // SHOW & HIDE ////////////////////////////////////////////////////////////
    
    _widget_show: function() {
    	// this._start_loop_animate_logo();
    	this._size_on_pages();
        return $("#cf_widget").show();
    },
    
    _widget_hide: function() {
    	// this._stop_loop_animate_logo();
        ret = $("#cf_widget").hide();
    	this._size_off_pages();
        return ret;
    },
    
    _size_on_pages: function() {
    	$('#callfeed_root').css('height', CallFeedOptions.param_total_max_height+'px');
    	$('#cf_main_content').removeClass('cf__div0height');
    	$('#cf_dial_content').removeClass('cf__div0height');
    	$('#cf_free_content').removeClass('cf__div0height');
    	$('#cf_free_sent_content').removeClass('cf__div0height');
    	$('#cf_timeoff_content').removeClass('cf__div0height');
    	$('#cf_timeoff_sent_content').removeClass('cf__div0height');
    	$('#cf_message_content').removeClass('cf__div0height');
    	$('#cf_message_sent_content').removeClass('cf__div0height');
    	$('#cf_order_content').removeClass('cf__div0height');
    	$('#cf_order_sent_content').removeClass('cf__div0height');
    },
    
    _size_off_pages: function() {
    	$('#callfeed_root').css('height', CallFeedOptions.param_button_height+'px');
    	$('#cf_main_content').addClass('cf__div0height');
    	$('#cf_dial_content').addClass('cf__div0height');
    	$('#cf_free_content').addClass('cf__div0height');
    	$('#cf_free_sent_content').addClass('cf__div0height');
    	$('#cf_timeoff_content').addClass('cf__div0height');
    	$('#cf_timeoff_sent_content').addClass('cf__div0height');
    	$('#cf_message_content').addClass('cf__div0height');
    	$('#cf_message_sent_content').addClass('cf__div0height');
    	$('#cf_order_content').addClass('cf__div0height');
    	$('#cf_order_sent_content').addClass('cf__div0height');
    },
    
    // DETECT MOBILE PLATFORMS /////////////////////////////////////////////////
    
    _is_touch_device: function() {
    	var msGesture = window.navigator && window.navigator.msPointerEnabled && window.MSGesture;
    	return (( "ontouchstart" in window ) || msGesture || window.DocumentTouch && document instanceof DocumentTouch);    	
    },
    
	// LOAD PARAMS ///////////////////////////////////////////////////

    _apply_main_button: function() {
    	if (!CallFeedOptions.flag_button_visible) {
    		//CallFeedOptions.
    		$('#cf_main_button').hide();
    		$('#cf_widget_triangle_img').hide();
    		$('#cf_widget').css('bottom': '0px');
    	}
    },
    
    _apply_text_color: function() {
    	if (CallFeedOptions.color_font_global.toLowerCase() != '#fff' && 
    	    CallFeedOptions.color_font_global.toLowerCase() != '#ffffff') {
    		$('.cf_close_button_img').attr('src', 'http://callfeed.net/static/img/widget/u42_black.png');
    	}
    },
    
    _apply_background: function() {
    	if (CallFeedOptions.color_background_image_global) {
    		debug.log('Add Background image:', CallFeedOptions.color_background_image_global);
    		$('.cf_background').css('background', 'url('+CallFeedOptions.color_background_image_global+') no-repeat left bottom');
    		$('.cf_background').css('background-size', 'cover');
    	}
    },
    
    _apply_managers: function() {
    	// Update picture and name - set to the first manager
    	var skip = true;
    	if (CallFeedOptions['managers'] && (CallFeedOptions['managers'].length > 0) && (CallFeedOptions['managers'][0]['photo_url']))
    		skip = false;
    	if (!skip && !CallFeedOptions.flag_is_operator_shown_in_widget)
    		skip = true;
		if (skip) {
    		debug.log('_apply_managers SKIP', $('#cf_main_content').height(), CallFeedOptions.param_manager_panel_height, CallFeedOptions['managers']);
    		$('.cf_manager_panel').hide();
    		$('#cf_main_content').css({'height':(parseInt($('#cf_main_content').height()-CallFeedOptions.param_manager_panel_height))+'px'});
    		$('#cf_dial_content').css({'height':(parseInt($('#cf_dial_content').height()-CallFeedOptions.param_manager_panel_height))+'px'});
    		$('#cf_free_content').css({'height':(parseInt($('#cf_free_content').height()-CallFeedOptions.param_manager_panel_height))+'px'});
    		$('#cf_order_content').css({'height':(parseInt($('#cf_order_content').height()-CallFeedOptions.param_manager_panel_height))+'px'});
    		$('#cf_order_sent_content').css({'height':(parseInt($('#cf_order_sent_content').height()-CallFeedOptions.param_manager_panel_height))+'px'});
    		$('#cf_main_custom_text').css({'margin-top':'-'+parseInt(CallFeedOptions.param_manager_panel_height)+'px'});
    		$('#cf_dial_custom_text').css({'margin-top':'-'+parseInt(CallFeedOptions.param_manager_panel_height)+'px'});
    		$('#cf_order_custom_text').css({'margin-top':'-'+parseInt(CallFeedOptions.param_manager_panel_height)+'px'});
    		$('#cf_order_sent_custom_text').css({'margin-top':'-'+parseInt(CallFeedOptions.param_manager_panel_height)+'px'});
    		$('#cf_free_custom_text').css({'margin-top':'-'+parseInt(CallFeedOptions.param_manager_panel_height)+'px'});
    	} else {
    		var man = CallFeedOptions['managers'][0];
    		debug.log('_apply_managers', man, CallFeedOptions.flag_is_operator_shown_in_widget);
    		$('.cf_manager_face').attr('src', man['photo_url']);
			$('.cf_manager_name_value').html(man['name']);
			$('.cf_manager_role_value').html(man['role']);
    	}
    },
    
    _prepare_day_time: function(day_tag_id) {
    	var date = new Date;
    	var hour = date.getHours();
    	var day = date.getDay();
    	if (day == 0) day = 7;
    	var sched = CallFeedOptions.schedule;
    	var sched_days = [];
    	var sched_ok = false;
    	var work_days = [1,2,3,4,5,6,7];
    	var good_days = [];
    	//debug.log('_prepare_day_time', sched, good_days, work_days, sched_days);
    	try {
	    	for (var sched_day = 1; sched_day <= 7; sched_day++) {
	    		if (sched[sched_day] != '-') {
	    			sched_ok = true;
	    			var from_to = sched[sched_day].split('-');
	    			var to = parseInt(from_to[1].split(':')[0])+1;
	    			if (sched_day == day) {
				    	if (hour >= to) {
		    				work_days[sched_day-1] = 0;
				    	}
	    				sched_days.push('Сегодня');
	    			} else if (sched_day == day+1) {
	    				sched_days.push('Завтра');
	    			} else if (sched_day == day+2) {
	    				sched_days.push('Послезавтра');
	    			} else {
	    				sched_days.push(weekdays()[sched_day-1]);
	    			}
	    		} else {
    				sched_days.push('');
    				work_days[sched_day-1] = 0;
	    		}
	    	}
    		for (var i=0; i<= work_days.length; i++) {
    			var gd = work_days[(i+day-1) % 7];
    			if (gd>0 && good_days.indexOf(gd) < 0)
    				good_days.push(gd);
    		} 
    	} catch (e) {
    		debug.log(e);
    	}
    	//debug.log('_prepare_day_time', sched, good_days, work_days, sched_days);
    	if (sched_ok) {
    		$('#'+day_tag_id+' option[value="Сегодня"]').remove();
    		$('#'+day_tag_id+' option[value="Завтра"]').remove();
    		$('#'+day_tag_id+' option[value="Послезавтра"]').remove();
    		$('#'+day_tag_id+' option[value="Понедельник"]').remove();
    		$('#'+day_tag_id+' option[value="Вторник"]').remove();
    		$('#'+day_tag_id+' option[value="Среда"]').remove();
    		$('#'+day_tag_id+' option[value="Четверг"]').remove();
    		$('#'+day_tag_id+' option[value="Пятница"]').remove();
    		$('#'+day_tag_id+' option[value="Суббота"]').remove();
    		$('#'+day_tag_id+' option[value="Воскресенье"]').remove();
    		for (var good_day=0; good_day<good_days.length; good_day++) {
    			var work_day = good_days[good_day];
    			var work_day_label = sched_days[work_day-1];
	    		$('#'+day_tag_id).append('<option class="cf__option" value="'+work_day_label+'">'+work_day_label+'</option>');
	    		//debug.log(good_day, work_day, work_day_label);
    		}
    	}
    },
        
    _update_from_to_time: function(day_tag_id, time_tag_id) {
    	var date = new Date;
    	var day = date.getDay();
    	if (day == 0) day = 7;
    	var hour = date.getHours();
    	var selected_day = null;
		if ($("#"+day_tag_id).val() == 'Сегодня') {
			selected_day = day;
		} else if ($("#"+day_tag_id).val() == 'Завтра') {
			selected_day = day + 1;
		} else if ($("#"+day_tag_id).val() == 'Послезавтра') {
			selected_day = day + 2;
		} else {
			selected_day = weekday2index()[$("#"+day_tag_id).val()];
		}
		if (selected_day > 7)
			selected_day -= 7;
		//debug.log('_update_from_to_time', CallFeedOptions.schedule, selected_day, day);
		try {
			var from_to = CallFeedOptions.schedule[selected_day].split('-');
			var from = parseInt(from_to[0].split(':')[0]);
			var to = parseInt(from_to[1].split(':')[0])+1;
			if (selected_day == day && hour > from) 
				from = hour+1;
			for (var h=0; h<=23; h++) {
				var zeros = String(h);
			    while (zeros.length < 2)
			    	zeros = "0" + zeros;
	    		$('#'+time_tag_id+' option[value="'+zeros+':00"]').remove();
			}
			for (var h=from; h<=to; h++) {
				var zeros = String(h);
			    while (zeros.length < 2)
			    	zeros = "0" + zeros;
	    		$('#'+time_tag_id).append('<option class="cf__option" value="'+zeros+':00">'+zeros+':00</option>');
			}
		} catch (e) {
			debug.log(e);
		}
    }    
    
});



//
//[widget_dialer.js]
//

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



//
//[widget_call_order.js]
//

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



//
//[widget_timeoff_order.js]
//

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
        		'referrer': encodeURIComponent(CallFeedSession.referrer),
        		'hostame': encodeURIComponent(CallFeedSession.hostname)
        	}),
            function(data) {
                debug.log("doJSONPSend.success", data);
                if (data.hasOwnProperty('response') && data['response'] == 'ok') {
                    CallFeedWidget.timeofforder.event('send-success', data);
                } else {
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



//
//[widget_messanger.js]
//

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
	            debug.log("doJSONPSend.success", data);
	            if (data.hasOwnProperty('response') && data['response'] == 'ok') {
	                CallFeedWidget.messanger.event('send-success', data);
	            } else {
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



//
//[widget_free_caller.js]
//

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
	            debug.log("doJSONPSend.success", data);
	            if (data.hasOwnProperty('response') && data['response'] == 'ok') {
	                CallFeedWidget.freecaller.event('send-success', data);
	            } else {
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



//
//[delayed_popup.js]
//

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



//
//[hash_checker.js]
//

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



//
//[main.js]
//



domReady(function(){

	var need_jq = false;
	
	if (typeof jQuery == 'undefined') {
		debug.log('no jQuery found');
		need_jq = true;
	} else {
		debug.log('found jQuery:', jQuery.fn.jquery);
		try {
			versions = jQuery.fn.jquery.split('.');
			if (parseInt(versions[1]) < 7) {
				debug.log('jQuery version too old, need at least 1.7');
				need_jq = true;
			}
		} catch(e) {
			debug.log('exception', e);
			need_jq = true;
		}
	}

	if (need_jq) {
	    var jq = document.createElement("script");
	    jq.type = "text/javascript";
	    jq.async = true;
	    jq.onload = function(){
	    	console.log('jQuery loaded:', jQuery.fn.jquery);
	    	init_callfeed(jQuery);
		};
	    jq.src = "http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js";
	    document.getElementsByTagName("head")[0].appendChild(jq);
	} else {
	    init_callfeed(jQuery);
	}
	
	function init_callfeed(jq) {
		
		window.$ = jq;
		debug.log('init_callfeed', $, $.fn.jquery, window);
		
		init_jquery_cookie(jq);

		if ((typeof CallFeedToken != 'undefined') && (CallFeedToken != null)) {
			debug.log('START UP NOW! token:', CallFeedToken);
			CallFeedSession = new WidgetSession("AT_STARTUP");
			CallFeedSession.event("init");
		} else {
			debug.log('ERROR! CallFeedToken not defined');
		}
		
	}
	
});
	



})(this,this.document);


