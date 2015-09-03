#!/bin/bash

echo "!!!!! build RELEASE VERSION !!!!!"
echo "var CallFeedDebug = true;" > debug.js
./build.sh


echo "minify [cf.js] to [cf.min.js]"
slimit -m cf.js > cf.min.js
echo "publish [cf.min.js]"
scp cf.min.js callfeed:srv/static/
    

echo "erase [cf.js]"
rm -rf cf.js


echo ""
date
echo "DONE!"
echo ""
