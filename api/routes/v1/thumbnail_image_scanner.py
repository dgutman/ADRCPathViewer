import openslide,os,sys,glob
### Open up a single sample image file
search_path = '/GLOBAL_SCRATCH/NeuroPathology'

samp_file = '/GLOBAL_SCRATCH/NeuroPathology/2015-12-29/1001006.svs'
osi = openslide.OpenSlide(samp_file)  ## Opens OSI Image


print osi.level_count
curLabelImage= osi.associated_images['label']


easy_file='labelsample.png'

curLabelImage.save(outfile, "png")