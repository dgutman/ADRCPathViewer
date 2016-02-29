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

Make changes to the application configurations in `app.cfg`, some of the settings you can change are:

`db_host`: localhost (default)
`db_port`: 27017 (default)
db_name: DSA_ADRC

#app/web service host and port
ws_host: 0.0.0.0
ws_port: 5050

#flask settings
#this path is relative to the directory where the blueprint is located
static_dir: ../../dsa_adrc/static

slides_dir: /mnt/GAUSS_SCRATCH/NDPI_VAULT/ADRC
tile_size: 256
overlap: 1
limit_bounds: 0
slide_cache_size: 1000
deepzoom_format: jpeg


Run the web service

    python main.py

Exactly, and if you:
$ conda list -e > req.txt
then you can install the environment using
$ conda create -n new environment --file req.txt

#We are now using bower to to package management
#Make sure node.js is install
npm install -g bower



#I may also want to look into grunt to install bower dependencies-- apparently grunt-wiredep helps with this
