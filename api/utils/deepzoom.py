from io import BytesIO
from openslide import OpenSlideError
from cache import slide_cache
import os

class PILBytesIO(BytesIO):
    def fileno(self):
        '''Classic PIL doesn't understand io.UnsupportedOperation.'''
        raise AttributeError('Not supported')

def get_slide(slides_dir, path):
    path = os.path.abspath(os.path.join(slides_dir, path))

    if not path.startswith(slides_dir + os.path.sep):
        return None
    if not os.path.exists(path):
        return None

    try:
        slide = slide_cache.get(path)
        if slide != None:
            slide.filename = os.path.basename(path)
            return slide
        else:
            return None
    except OpenSlideError:
        return None