#!/bin/bash

echo "erase cf.js"
echo "" > cf.js


echo "include [debug.js]"
echo -e "\\n\\n\\n//\\n//[debug.js]\\n//\\n" >> cf.js
cat debug.js >> cf.js


echo "include [ba-debug.js]"
echo -e "\\n\\n\\n//\\n//[ba-debug.js]\\n//\\n" >> cf.js
cat ba-debug.js >> cf.js


echo "include [domready.js]"
echo -e "\\n\\n\\n//\\n//[domready.js]\\n//\\n" >> cf.js
cat domready.js >> cf.js


echo "include [jsonpclient.js]"
echo -e "\\n\\n\\n//\\n//[jsonpclient.js]\\n//\\n" >> cf.js
cat jsonpclient.js >> cf.js


echo "include [globals.js]"
echo -e "\\n\\n\\n//\\n//[globals.js]\\n//\\n" >> cf.js
cat globals.js >> cf.js


echo "open namespace"
echo -e "\\n\\n\\n(function(window,document){\\n\\n" >> cf.js


echo "include [jquery.cookie.js]"
echo -e "\\n\\n\\n//\\n//[jquery.cookie.js]\\n//\\n" >> cf.js
cat jquery.cookie.js >> cf.js


echo "include [simpleStorage.js]"
echo -e "\\n\\n\\n//\\n//[simpleStorage.js]\\n//\\n" >> cf.js
cat simpleStorage.js >> cf.js


echo "include [defaults.js]"
echo -e "\\n\\n\\n//\\n//[defaults.js]\\n//\\n" >> cf.js
cat defaults.js >> cf.js


echo "building build_css.js"
python build_css_source.py callfeed.css > build_css.js

echo "include [build_css.js]"
echo -e "\\n\\n\\n//\\n//[build_css.js]\\n//\\n" >> cf.js
cat build_css.js >> cf.js


echo "building build_html.js"
python build_html_source.py callfeed.html > build_html.js

echo "include [build_html.js]"
echo -e "\\n\\n\\n//\\n//[build_html.js]\\n//\\n" >> cf.js
cat build_html.js >> cf.js


echo "include [build_embed.js]"
echo -e "\\n\\n\\n//\\n//[build_embed.js]\\n//\\n" >> cf.js
cat build_embed.js >> cf.js


echo "include [build_preload.js]"
echo -e "\\n\\n\\n//\\n//[build_preload.js]\\n//\\n" >> cf.js
cat build_preload.js >> cf.js


echo "include [builder.js]"
echo -e "\\n\\n\\n//\\n//[builder.js]\\n//\\n" >> cf.js
cat builder.js >> cf.js


echo "include [utils.js]"
echo -e "\\n\\n\\n//\\n//[utils.js]\\n//\\n" >> cf.js
cat utils.js >> cf.js


echo "include [automat.js]"
echo -e "\\n\\n\\n//\\n//[automat.js]\\n//\\n" >> cf.js
cat automat.js >> cf.js


echo "include [widget_session.js]"
echo -e "\\n\\n\\n//\\n//[widget_session.js]\\n//\\n" >> cf.js
cat widget_session.js >> cf.js


echo "include [widget_controller.js]"
echo -e "\\n\\n\\n//\\n//[widget_controller.js]\\n//\\n" >> cf.js
cat widget_controller.js >> cf.js


echo "include [widget_visualizer.js]"
echo -e "\\n\\n\\n//\\n//[widget_visualizer.js]\\n//\\n" >> cf.js
cat widget_visualizer.js >> cf.js


echo "include [widget_dialer.js]"
echo -e "\\n\\n\\n//\\n//[widget_dialer.js]\\n//\\n" >> cf.js
cat widget_dialer.js >> cf.js


echo "include [widget_call_order.js]"
echo -e "\\n\\n\\n//\\n//[widget_call_order.js]\\n//\\n" >> cf.js
cat widget_call_order.js >> cf.js


echo "include [widget_timeoff_order.js]"
echo -e "\\n\\n\\n//\\n//[widget_timeoff_order.js]\\n//\\n" >> cf.js
cat widget_timeoff_order.js >> cf.js


echo "include [widget_messanger.js]"
echo -e "\\n\\n\\n//\\n//[widget_messanger.js]\\n//\\n" >> cf.js
cat widget_messanger.js >> cf.js


echo "include [widget_free_caller.js]"
echo -e "\\n\\n\\n//\\n//[widget_free_caller.js]\\n//\\n" >> cf.js
cat widget_free_caller.js >> cf.js


echo "include [delayed_popup.js]"
echo -e "\\n\\n\\n//\\n//[delayed_popup.js]\\n//\\n" >> cf.js
cat delayed_popup.js >> cf.js


echo "include [hash_checker.js]"
echo -e "\\n\\n\\n//\\n//[hash_checker.js]\\n//\\n" >> cf.js
cat hash_checker.js >> cf.js


echo "include [main.js]"
echo -e "\\n\\n\\n//\\n//[main.js]\\n//\\n" >> cf.js
cat main.js >> cf.js


echo "close namespace"
echo -e "\\n\\n\\n})(this,this.document);\\n\\n" >> cf.js
# echo -e "\\n\\n\\n})(window,document);\\n\\n" >> cf.js


echo "build DONE"
echo ""
