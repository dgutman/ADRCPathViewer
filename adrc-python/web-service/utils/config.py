import ConfigParser

def get_app_configurations():
	defaults = {
			'db_host': 'localhost',
			'db_port': 27017,
			'slides_dir': '/mnt/GAUSS_SCRATCH/NDPI_VAULT/ADRC',
			'tile_size': 256,
			'overlap': 1,
			'limit_bounds': 0,
			'slide_cache_size': 1000,
			'deepzoom_format': 'jpeg',
			'ws_host': '0.0.0.0',
			'ws_port': 5051
		}

	config = ConfigParser.SafeConfigParser(defaults)
	config.read("app.cfg")
	configurations = {}

	for section in config.sections():
		tmp = config_section_map(section, config)
		configurations.update(tmp)

	return configurations

def config_section_map(section, config):
	dict1 = {}
	options = config.options(section)

	for option in options:
		try:
			dict1[option] = config.get(section, option)
			if dict1[option] == -1:
				DebugPrint("skip: %s" % option)
		except:
			print("exception on %s!" % option)
			dict1[option] = None
	return dict1
