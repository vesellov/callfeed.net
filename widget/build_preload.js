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