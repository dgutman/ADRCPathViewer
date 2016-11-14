define("aperio", ["jquery", "zoomer", "osd", "ant"], function($, zoomer, osd, ant) {

    function transformVertices(vertices, imageWidth) {
        coordinates = new Array();
        scaleFactor = 1 / imageWidth;
        $.each(vertices, function(index, vertex) {
            vertex = vertex["@attributes"];
            x = parseFloat(vertex.X) * scaleFactor;
            y = parseFloat(vertex.Y) * scaleFactor;
            coordinates.push(x + "," + y);
        });

        return coordinates.join(" ")
    }

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
            for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;

                if (typeof(obj[nodeName]) == "undefined") {
                    obj[nodeName] = xmlToJSON(item);
                } else {
                    if (typeof(obj[nodeName].push) == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }

                    obj[nodeName].push(xmlToJSON(item));
                }
            }
        }

        return obj;
    }

    function getAnnotations(file, callback, context) {
        var annotations = {
            name: file.name,
            url: file.url,
            attributes: {},
            regions: []
        };

        $.get(file.url, function(xml) {
            var json = xmlToJSON(xml);
            annotations.attributes = json.Annotations.Annotation["@attributes"];
            var params = json.Annotations.Annotation.Attributes.Attribute["@attributes"]

            $.each(json.Annotations.Annotation.Regions.Region, function(index, region) {
                vertices = [];

                osdCoords = transformVertices(region.Vertices.Vertex, context.tiles.sizeX);

                /*$.each(region.Vertices.Vertex, function(index, vertex) {
                    vertices.push({
                        X: parseFloat(vertex["@attributes"].X),
                        Y: parseFloat(vertex["@attributes"].Y)
                    })
                });*/

                annotations.regions.push({
                    attributes: region["@attributes"],
                    coords: osdCoords
                });
            });

            callback(annotations, context);
        });
    }

    return {
        getAnnotations: getAnnotations
    }
});