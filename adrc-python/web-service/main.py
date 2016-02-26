from routes.deepzoom import dz
from routes.slides import slides
from  flask import Flask
from utils.config import get_app_configurations

app = Flask('dsa_adrc')
app.config.from_envvar('DEEPZOOM_MULTISERVER_SETTINGS', silent=True)
app.config.update(get_app_configurations())

app.register_blueprint(dz)
app.register_blueprint(slides)

app.run(
		host=app.config['ws_host'], 
		port=int(app.config['ws_port']), 
		debug=True)
