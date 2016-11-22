define("aperio", ["jquery", "xj"], function($, xj) {

    function transformVertices(vertices, imageWidth) {
        coordinates = new Array();
        scaleFactor = 1 / imageWidth;
        $.each(vertices, function(index, vertex) {
            x = parseFloat(vertex.X) * scaleFactor;
            y = parseFloat(vertex.Y) * scaleFactor;
            coordinates.push(x + "," + y);
        });

        return coordinates.join(" ")
    }

    function rgb2hex (rgb) {
        rgb = "0".repeat(9 - rgb.length) + rgb;
        var r = parseInt(rgb.substring(0,3));
        var g = parseInt(rgb.substring(3,3));
        var b = parseInt(rgb.substring(7,3));
    
        var h = b | (g << 8) | (r << 16);
        return '#' + "0".repeat(6 - h.toString(16).length) + h.toString(16);
    }

    return {
        transformVertices: transformVertices,
        rgb2hex: rgb2hex
    }
});