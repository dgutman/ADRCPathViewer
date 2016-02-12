# ADRCPathViewer
This is a development workspace for a pathology viewer for the ADRC @ Emory using the DSA CodeBase


To create the flask environment for testing:

conda create --name ADRCFlask jupyter flask
Then:
# $ source activate ADRCFlask

Exactly, and if you:
$ conda list -e > req.txt
then you can install the environment using
$ conda create -n new environment --file req.txt


#We are now using bower to to package management
#Make sure node.js is install
npm install -g bower



#I may also want to look into grunt to install bower dependencies-- apparently grunt-wiredep helps with this
