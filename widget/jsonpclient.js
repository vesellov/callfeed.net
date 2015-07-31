

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
