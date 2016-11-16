define("aperio", ["jquery", "xj"], function($, xj) {

    function transformVertices(vertices, imageWidth) {
        coordinates = new Array();
        scaleFactor = 1 / imageWidth;
        $.each(vertices, function(index, vertex) {
            x = parseFloat(vertex._X) * scaleFactor;
            y = parseFloat(vertex._Y) * scaleFactor;
            coordinates.push(x + "," + y);
        });

        return coordinates.join(" ")
    }

    function xmlToJSON(xml, imageWidth) {
        var annotations = new Array();

        var x2js = new xj({
            arrayAccessFormPaths : [
                   "Annotations.Annotation",
                   "Annotations.Annotation.Regions.Region",
                   "Annotations.Annotation.Attributes.Attribute"
                ]
            });

        var obj = x2js.xml2json( xml );
            
        $.each(obj.Annotations.Annotation, function(index, annotation) {
                var tmp = {
                    _Attributes: annotation.Attributes.Attribute,
                    _Id: annotation._Id,
                    _Name: annotation._Name,
                    _ReadOnly: annotation._ReadOnly,
                    _NameReadOnly: annotation._NameReadOnly,
                    _LineColorReadOnly: annotation._LineColorReadOnly,
                    _Incremental: annotation._Incremental,
                    _Type: annotation._Type,
                    _LineColor: annotation._LineColor,
                    _Visible: annotation._Visible,
                    _Selected: annotation._Selected,
                    _MarkupImagePath: annotation._MarkupImagePath,
                    _MacroName: annotation._MacroName,
                    _Regions: new Array()
                };

                $.each(annotation.Regions.Region, function(index, region) {
                    region._Coords = transformVertices(region.Vertices.Vertex, imageWidth);
                    delete region.Attributes;
                    delete region.Vertices;
                    tmp._Regions.push(region);
                });

                annotations.push(tmp);
        });

        return annotations;
    }

    function getAnnotations(file, callback, context) {
        $.get(file.url, function(xml) {
            annotations = xmlToJSON(xml, context.tiles.sizeX);
            annotations._Name = file.name;
            annotations._Url = file.url;
            callback(annotations, context);
        });
    }

    return {
        getAnnotations: getAnnotations
    }
});