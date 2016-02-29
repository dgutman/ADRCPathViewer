ADRCPathViewer
=====================
This is a development workspace for a pathology viewer for the ADRC @ Emory using the DSA CodeBase. The repo contains two parts. The web service which used Python Flask and OpenSlide to serve whole-slide images, serve static pages and endpoints to the database. The web applications which contains the viewer.

Instuctions
=====================
Clone the repo

    git clone https://github.com/dgutman/ADRCPathViewer.git

Create the flask environment for testing, if you with

    conda create --name ADRCFlask jupyter flask

Activate the environment

    source activate ADRCFlask

Exactly, and if you:
$ conda list -e > req.txt
then you can install the environment using
$ conda create -n new environment --file req.txt

#We are now using bower to to package management
#Make sure node.js is install
npm install -g bower



#I may also want to look into grunt to install bower dependencies-- apparently grunt-wiredep helps with this
