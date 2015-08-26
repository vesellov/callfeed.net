import sys
sys.stdout.write('function CallFeedBuildHTML(settings) {\n')
sys.stdout.write('    var o = "";\n')
for line in open(sys.argv[1]).read().splitlines():
    l = line.rstrip()
    if not l:
        continue
    l = l.replace('<', '&lt;')
    l = l.replace('>', '&gt;')
    l = l.replace('"', '&quot;')
    l = '    o+="%s\\n";\n' % l # (unicode(l, 'utf-8').encode('unicode-escape'))
    sys.stdout.write(l)
sys.stdout.write('    for (var key in settings) if (settings.hasOwnProperty(key))\n')
sys.stdout.write('        if ((key.indexOf("flag_")==0)||(key.indexOf("text_")==0)||(key.indexOf("param_")==0)||(key.indexOf("color_")==0))\n') 
sys.stdout.write('            o = o.replace(new RegExp("%\\\\("+key+"\\\\)s", "g"), unescape(settings[key]));\n')
sys.stdout.write('    return o;\n')
sys.stdout.write('}\n')
