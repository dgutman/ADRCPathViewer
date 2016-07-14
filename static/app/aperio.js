define("aperio", ["jquery", "viewer", "osd", "ant"], function($, viewer, osd, ant){

    function import(url) {
        //first clear the annotation state
        viewer.annotationState.clearAnnotations(); //is global for now

        $.get(url).done(function(response) {
            cur_aperio_xml = response;
        
            //for every annotation create a layers and add markups
            $('Annotation', response).each(function() {
                color = this.getAttribute("LineColor").toString(16);
                color = rgb2hex(color);
            
                //we treat every region as a layer in DSA
                $('Region', this).each(function() {
                    getRegionMarkups(this, color);
                });
            }); 
        });  //end of get xml
    } //end of aperiocontroller function

    /**
     * Convert RGB to HEX color codes
     */
    function rgb2hex(rgb) {
        rgb = "0".repeat(9 - rgb.length) + rgb;
        var r = parseInt(rgb.substring(0, 3));
        var g = parseInt(rgb.substring(3, 3));
        var b = parseInt(rgb.substring(7, 3));

        var h = b | (g << 8) | (r << 16);
        return '#' + "0".repeat(6 - h.toString(16).length) + h.toString(16);
    }

    function getRegionMarkups(vertices, color) {
        var markups = {};

            //each set of vertices represents a markup
        $('Vertices', vertices).each(function() {
            var points = [];

            //push the vertix points to points array
            $('Vertex', this).each(function() {
                //create openseadragon Point object with the (X, Y) coordinated from Aperio vertix
                //Aperio uses image coordinates
                var pt = new osd.Point(Number(this.getAttribute("X")), Number(this.getAttribute("Y")));

                //convert the Aperio image coordinates to openseadragon viewport coordinates
                var point = viewer.viewport.imageToViewportCoordinates(pt);
                points.push(point);
            });

            //create overlay
            var overlayObj = {
                type: 'freehand',
                points: points,
                color: color,
                alpha: 1
            };

            overlay = ant.AnnotationOverlay.fromValueObject(overlayObj);

            //attach the overlay to the viewer
            overlay.attachTo(viewer);

            //add the overlay to the annotations array
            viewer.annotationState.annotations.push(overlay);
        });
    }

    return{
        import: import
    }
});