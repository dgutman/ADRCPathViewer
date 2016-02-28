from flask import Blueprint
from utils.crossdomains import crossdomain
from utils.config import get_app_configurations

config = get_app_configurations()
adrc = Blueprint('ADRC_Routes', __name__, static_folder=config['static_dir'])

@adrc.route('/')
def index():
  return adrc.send_static_file('index.html')

@adrc.route('/<path:path>')
def send_static_page(path):
  return adrc.send_static_file(path)
