#!/bin/bash

#to kill all worders: ps -aux | grep wsgi | grep -v grep | awk '{print $2}' | xargs sudo kill -9

source /home/dgutman/osdTester/bin/activate
export PYTHONPATH=/home/dgutman/osdTester:$PYTHONPATH

exec gunicorn -b 0.0.0.0:5080 \
	--workers=65 \
	--log-level debug \
	--name dsa \
	--chdir /home/mkhali8/dev/ADRCPathViewer/api wsgi

