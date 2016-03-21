/* This module injects HTML code to set up SVG color filtering */


/* 
Image Magic Commands from Noel to try and recreate

http://www.smashingmagazine.com/2015/05/why-the-svg-filter-is-awesome/


http://html5-demos.appspot.com/static/css/filters/index.html

convert $INPUTFILE -dither None -fx '0.2*r+0.2*g+0.6*b' -auto-level -negate -sharpen 11x9 -brightness-contrast 0x10 ${OUTPUTROOT}$INPUTROOT.BLUE_ENHANCED.png

convert $INPUTFILE -dither None -fx '0.7*r+0.2*g+0.1*b' -auto-level -negate -sharpen 11x9 -brightness-contrast 0x10 ${OUTPUTROOT}$INPUTROOT.RED_ENHANCED.png
*/ 

var flt = {}

    function changeFilter(filter, val, spanItem) {
        flt[filter] = val;
        $(spanItem).html(val);
        updateFilters();
    }

    function updateFilters() {
        //http://www.html5rocks.com/en/tutorials/filters/understanding-css/
        console.log(flt);

        if (flt.blur > 1) {
            //var css = 'contrast(' + flt.contrast + '%) brightness(' + flt.brightness + '%) url(#f3) hue-rotate(' + flt.hue_rotate + 'deg) saturate(' + flt.saturate + '%)';
            var css = 'contrast(' + flt.contrast + '%) brightness(' + flt.brightness + '%) url(#f3) hue-rotate(' + flt.hue_rotate + 'deg) saturate(' + flt.saturate + '%)' + ' blur(' + flt.blur + 'px)' + ' invert(' + flt.invert + '%)';

        } else {
            var css = 'contrast(' + flt.contrast + '%) brightness(' + flt.brightness + '%) url(#f3) hue-rotate(' + flt.hue_rotate + 'deg) saturate(' + flt.saturate + '%)' + ' invert(' + flt.invert + '%)';
        }

        $('.magic').css('-webkit-filter', css);
        $('.openseadragon-canvas').css('-webkit-filter', css);
    }


color_filter_html = `<div id="filter_dialog" title="Apply Filters">
        Filter set will appear here
        <div style="width:200px">contrast (<a href=# onclick="$('#set_contrast').val(100);
                        $('#set_contrast').change();
                        return false">reset</a>)</div>
        <input id=set_contrast type=range min=0 max=300 value=100 onchange="changeFilter('contrast', this.value, $(this).next())">
        <span>100</span>%
        <script>
        flt.contrast = 100;
        </script>
        <br>
        <div style="width:200px">brightness (<a href=# onclick="$('#set_brightness').val(100);
                        $('#set_brightness').change();
                        return false">reset</a>)</div>
        <input id=set_brightness type=range min=-100 max=100 value=0 onchange="changeFilter('brightness', this.value, $(this).next())">
        <span>100</span>%
        <script>
        flt.brightness = 100;
        </script>
        <br>
        <div style="width:200px">saturate (<a href=# onclick="$('#set_saturate').val(100);
                        $('#set_saturate').change();
                        return false">reset</a>)</div>
        <input id=set_saturate type=range min=0 max=700 value=100 onchange="changeFilter('saturate', this.value, $(this).next())">
        <span>100</span>%
        <script>
        flt.saturate = 100;
        </script>
        <br>
        <div style="width:200px">hue-rotate (<a href=# onclick="$('#set_hue_rotate').val(0);
                        $('#set_hue_rotate').change();
                        return false">reset</a>)</div>
        <input id=set_hue_rotate type=range min=0 max=360 value=0 onchange="changeFilter('hue_rotate', this.value, $(this).next())">
        <span>0</span>deg
        <script>
        flt.hue_rotate = 0;
        </script>
        <br>
        <div style="width:200px">invert (<a href=# onclick="$('#set_invert').val(0);
                        $('#set_invert').change();
                        return false">reset</a>)</div>
        <input id=set_invert type=range min=0 max=100 value=0 onchange="changeFilter('invert', this.value, $(this).next())">
        <span>0</span>%
        <script>
        flt.invert = 0;
        </script>
        <br>
        <div style="width:200px">blur (<a href=# onclick="$('#set_blur').val(0);
                        $('#set_blur').change();
                        return false">reset</a>)</div>
        <input id=set_blur type=range min=0 max=10 value=0 onchange="changeFilter('blur', this.value, $(this).next())">
        <span>0</span>px
        <script>
        flt.blur = 0;
        </script>
        <br>

        <div style="width:200px">Sharpen (<a href=# onclick="$('#set_sharpen').val(0);
                        $('#set_sharpen').change();
                        return false">reset</a>)</div>
        <input id=set_sharpen type=range min=0 max=10 value=0 onchange="changeFilter('sharpen', this.value, $(this).next())">
        <span>0</span>px
        <script>
        flt.sharpen = 0;
        </script>
        <br>



    </div>`



