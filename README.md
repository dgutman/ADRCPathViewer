ADRCPathViewer
=====================
This is a development workspace for a pathology viewer for the ADRC @ Emory using the DSA CodeBase. The repo contains two parts. The web service which used Python Flask and OpenSlide to serve whole-slide images, serve static pages and endpoints to the database. The web applications which contains the viewer.

Prerequisites
=====================
virtualenv: to create a virtual python enviroment for the ADRC project

    pip install virtualenv

openslide: to serve whole-slide images. Follow the instructions [here](https://github.com/DigitalSlideArchive/digital_slide_archive/wiki/VIPS-and-OpenSlide-Installation) to install openslide

Instuctions
=====================
Make a parent directory for our ADRC project. Move into the directory after you create it:

    mkdir ADRC_ROOT

    cd ADRC_ROOT

Clone the ADRC repo

    git clone https://github.com/dgutman/ADRCPathViewer.git

Create the flask environment for testing using python virtualenv

    virtualenv adrc_env

Activate the environment

    source adrc_env/bin/activate

Within the environment install Flask, bson, Pillow, gunicorn, openslide-python, pymongo and wheel

    pip install bson Pillow gunicorn openslide-python pymongo wheel

Browse to `ADRC_ROOT/app/webservice`

    cd ADRC_ROOT/app/webservice

Run the web service using gunicorn on port 8001, in the foreground

    gunicorn --bind 0.0.0.0:8001 wsgi

Or you can run gunicorn in the background

    gunicorn --bind 0.0.0.0:8001 wsgi &

Configure Nginx
==========================
If you want you can setup Nginx to proxy requests to the ADRC web service.

Create a new server block configuration file in Nginx `sites-available` directory

    sudo vi /etc/nginx/sites-available/adrc

Tell Nginx to listen on port 8000 and to route the traffic to the web service running on port 8001. To do so copy the following into adrc server block file

    server {
        listen 0.0.0.0:8000;

        location / {
                proxy_pass http://0.0.0.0:8001;
        }
    }

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
