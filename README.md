ADRCPathViewer
=====================
This is a development workspace for a pathology viewer for the ADRC @ Emory using the DSA CodeBase. The repo contains two parts. The web service which used Python Flask-Restful and OpenSlide to serve whole-slide images, serve static pages and endpoints to the database.

Prerequisites
=====================
The following packages are required to run the API

* OpenSlide and its dependencies (follow the instruction in this [link](https://github.com/DigitalSlideArchive/digital_slide_archive/wiki/VIPS-and-OpenSlide-Installation))
* openslide-python
* flask_restful
* flask_cache
* bson
* collections
* threading
* ConfigParser
* pymongo

Instuctions
=====================
 To start the API execute the following command (run.py is located in the application root directory)

     ./run.py

To access the API in your browser
    http://[yourdomain]/[version]/[resource]/[params]

Example
    http://yourdomain.com/v1/slidesetlist

Application configurations
===========================
You make changes to the application configurations in `app.cfg`, some of the settings you can change are:

`db_host`: localhost (default)

`db_port`: 27017 (default)

`db_name`: your mongodb collection name

`ws_host`: 0.0.0.0 (default web service address)

`ws_port`: web service port

`static_dir`: location of static pages relative to the directory where the blueprint is located or an absolute path

`slides_dir`: location of the whole-slide images

`tile_size`: 256 (default)

`overlap`: 1 (default)

`limit_bounds`: 0 (default)

`slide_cache_size`: 1000 (default)

`deepzoom_format`: jpeg (default)


## I am in the process of migrating the build step to use bower
In the static directory, once bower is installed, you can type bower install and it will grab the proper files
