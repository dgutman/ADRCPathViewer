from flask_cache import Cache 
from threading import Lock
from collections import OrderedDict
from openslide import OpenSlide
import openslide
from openslide.deepzoom import DeepZoomGenerator
from utils.config import get_app_configurations

class SlideCache(object):
    def __init__(self, cache_size, dz_opts):
        self.cache_size = cache_size
        self.dz_opts = dz_opts
        self._lock = Lock()
        self._cache = OrderedDict()

    def get(self, path):
        with self._lock:
            if path in self._cache:
                # Move to end of LRU
                slide = self._cache.pop(path)
                self._cache[path] = slide
                return slide

        osr = OpenSlide(path)
        slide = DeepZoomGenerator(osr, **self.dz_opts)
        try:
            mpp_x = osr.properties[openslide.PROPERTY_NAME_MPP_X]
            mpp_y = osr.properties[openslide.PROPERTY_NAME_MPP_Y]
            slide.mpp = (float(mpp_x) + float(mpp_y)) / 2
        except (KeyError, ValueError):
            slide.mpp = 0

        with self._lock:
            if path not in self._cache:
                if len(self._cache) == self.cache_size:
                    self._cache.popitem(last=False)
                self._cache[path] = slide
        return slide

cache = Cache(config={'CACHE_TYPE':'memcached'})
config = get_app_configurations()

opts = {
	'tile_size': int(config['tile_size']),
	'overlap': int(config['overlap']),
	'limit_bounds': int(config['limit_bounds'])
}

slide_cache = SlideCache(config['slide_cache_size'], opts)