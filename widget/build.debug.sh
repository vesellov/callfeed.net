#!/bin/bash

echo "build DEBUG version"
echo "var CallFeedDebug = true;" > debug.js
./build.sh


echo "minify [cf.js] to [cf.devel.js]"
cat cf.js > cf.devel.js
# slimit -m cf.js > cf.devel.js


echo "publish [cf.devel.js]"
#rsync -rptgoE --force -z --compress-level=9 -h --progress -vv --stats -c bitdust-development.zip rsync://veselin@bitdust.io/download
rsync -e ssh -rptgoE --force -z --compress-level=9 -h --progress -v --stats -c cf.devel.js callfeed:srv/static/
# scp cf.devel.js callfeed:srv/static/


echo "erase [cf.js]"
rm -rf cf.js


echo ""
date
echo "DONE!"
echo ""
