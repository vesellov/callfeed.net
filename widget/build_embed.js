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