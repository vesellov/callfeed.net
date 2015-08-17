#!/bin/bash

/home/callfeed/srv/bin/python /home/callfeed/srv/callfeed/manage.py run_huey --periodic --logfile /home/callfeed/srv/callfeed/huey.log
