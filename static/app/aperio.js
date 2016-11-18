define("aperio", ["jquery", "zoomer", "osd", "ant"], function($, zoomer, osd, ant){

    function importMarkups(url) {
        //first clear the annotation state
        zoomer.annotationState.clearAnnotations(); //is global for now

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

    function xmlToJSON(xml) {
        var obj = {};

        if (xml.nodeType == 1) { // element
            // do attributes
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType == 3) { // text
            obj = xml.nodeValue;
        }

        // do children
        if (xml.hasChildNodes()) {
            for(var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                
                if (typeof(obj[nodeName]) == "undefined") {
                    obj[nodeName] = xmlToJson(item);
                } else {
                    if (typeof(obj[nodeName].push) == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
            
                    obj[nodeName].push(xmlToJson(item));
                }
            }
        }

        return obj;
    }

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
                var point = zoomer.viewer.viewport.imageToViewportCoordinates(pt);
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
            overlay.attachTo(zoomer.viewer);

            //add the overlay to the annotations array
            zoomer.annotationState.annotations.push(overlay);
        });
    }

    return{
        importMarkups: importMarkups
    }
});