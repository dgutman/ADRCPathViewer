## To runt he server: gunicorn -b 0.0.0.0:5080 --workers=65 --log-level --name dsa debug wsgi
## recommended number of workers = 2 * CPU cores + 1
## Source https://www.digitalocean.com/community/tutorials/how-to-deploy-python-wsgi-apps-using-gunicorn-http-server-behind-nginx

from app import app as application
from utils.config import get_app_configurations

config = get_app_configurations()

if __name__ == "__main__":
	application.run(host=config['ws_host'], port=config['ws_port'], debug=True)
