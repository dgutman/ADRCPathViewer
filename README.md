ADRCPathViewer
=====================
This is a development workspace for a pathology viewer for the ADRC @ Emory using the DSA CodeBase. The repo contains two parts. The web service which used Python Flask and OpenSlide to serve whole-slide images, serve static pages and endpoints to the database. The web applications which contains the viewer.

Instuctions
=====================
Clone the repo

    git clone https://github.com/dgutman/ADRCPathViewer.git

Create the flask environment for testing using [Anaconda](https://www.continuum.io/downloads) if you wish

    conda create --name ADRCFlask jupyter flask

Activate the environment

    source activate ADRCFlask

Browse to `ADRC_ROOT/adrc-python/web-service`

    cd ADRC_ROOT/adrc-python/web-service

Run the web service

    python main.py

Application configurations
===========================
You make changes to the application configurations in `app.cfg`, some of the settings you can change are:

`db_host`: localhost (default)

`db_port`: 27017 (default)

`db_name`: your mongodb collection name

`ws_host`: 0.0.0.0 (default web service address)

`ws_port`: web service port

`static_dir`: location of static pages relative to the directory where the blueprint is located

`slides_dir`: location of the whole-slide images

`tile_size`: 256 (default)

`overlap`: 1 (default)

`limit_bounds`: 0 (default)

`slide_cache_size`: 1000 (default)

`deepzoom_format`: jpeg (default)

Exactly, and if you:
$ conda list -e > req.txt
then you can install the environment using
$ conda create -n new environment --file req.txt

#We are now using bower to to package management
#Make sure node.js is install
npm install -g bower



#I may also want to look into grunt to install bower dependencies-- apparently grunt-wiredep helps with this
