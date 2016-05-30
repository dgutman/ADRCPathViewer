sample_xml = "/xmls/ADRC60-110/ADRC60-110_1A_aBeta.xml"

function aperioController(xml_file) {
    //first clear the annotation state
    annotationState.clearAnnotations(); //is global for now

    cur_aperio_xml = {}
    $.get(xml_file).done(function(response) {

            layers = []
            var layerIndex = 0;
            //for every annotation create a layers and add markups
            $('Annotation', response.data).each(function() {
                color = this.getAttribute("LineColor").toString(16);
                color = rgb2hex(color);

                //we treat every region as a layer in DSA
                $('Region', this).each(function() {
                    curRegionmarkups = getRegionMarkups(this, color);
                    layers.push(curRegionmarkups);
                    layerIndex++;

                });



            });
 
        }  //end of get xml
    } //end of aperiocontroller function


    //Define a controller for Aperio


    /**
     * Parse markups for a given region
     * @param {obj} vertices 
     * @param {string} color
     */



/**
 * Convert RGB to HEX color codes
 */
rgb2hex = function(rgb) {
    rgb = "0".repeat(9 - rgb.length) + rgb;
    var r = parseInt(rgb.substring(0, 3));
    var g = parseInt(rgb.substring(3, 3));
    var b = parseInt(rgb.substring(7, 3));

    var h = b | (g << 8) | (r << 16);
    return '#' + "0".repeat(6 - h.toString(16).length) + h.toString(16);
}





getRegionMarkups = function(vertices, color) {
    var markups = {};

        //each set of vertices represents a markup
    $('Vertices', vertices).each(function() {
        var points = [];

        //push the vertix points to points array
        $('Vertex', this).each(function() {
            //create openseadragon Point object with the (X, Y) coordinated from Aperio vertix
            //Aperio uses image coordinates
            var pt = new OpenSeadragon.Point(Number(this.getAttribute("X")), Number(this.getAttribute("Y")));

            //convert the Aperio image coordinates to openseadragon viewport coordinates
            var point = $window.DSAViewer.getViewer().viewport.imageToViewportCoordinates(pt);
            points.push(point);
        });


        //create overlay
        var overlayObj = {
            type: 'freehand',
            index: $scope.index,
            label: String($scope.index),
            points: points,
            color: color,
            alpha: 1
        };

        overlay = AnnotationOverlay.fromValueObject(overlayObj);

        //attach the overlay to the viewer
        overlay.attachTo(viewer);

        //add the overlay to the annotations array
        annotationState.annotations.push(overlay);


    })
}