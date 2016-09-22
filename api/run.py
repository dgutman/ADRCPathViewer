#!/usr/bin/python
from app import app
from utils.config import get_app_configurations

# Get app configurations
config = get_app_configurations()
app.run(host=config["ws_host"], port=int(config["ws_port"]), debug=True, threaded=True)
