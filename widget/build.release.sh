#!/bin/bash

echo "!!!!! build RELEASE VERSION !!!!!"
echo "var CallFeedDebug = false;" > debug.js
./build.sh


echo "minify [cf.js] to [cf.min.js]"
slimit -m cf.js > cf.min.js
echo "publish [cf.min.js]"
scp cf.min.js callfeed:srv/static/
    

echo ""
date
echo "DONE!"
echo ""
