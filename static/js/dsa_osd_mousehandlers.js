

// //
// // =============== Mouse event handlers for viewer =================
// //

//
//  Mouse enter event handler for viewer
//
//
function onMouseEnter(event) {
  statusObj.haveMouse(true);
}


//
// Mouse move event handler for viewer
//
//
function onMouseMove(event) {
  var offset = osdCanvas.offset();

  statusObj.mouseRelX(event.pageX - offset.left);
  statusObj.mouseRelY(event.pageY - offset.top);    
  statusObj.mouseImgX(imgHelper.physicalToDataX(statusObj.mouseRelX()));
  statusObj.mouseImgY(imgHelper.physicalToDataY(statusObj.mouseRelY()));
}

//
//  Mouse leave event handler for viewer
//
//
function onMouseLeave(event) {
  statusObj.haveMouse(false);
}

function onMouseClick(event) {

    clickCount++;
    if( clickCount === 1 ) {
        // If no click within 250ms, treat it as a single click
        singleClickTimer = setTimeout(function() {
                    // Single click
                    clickCount = 0;
                }, 250);
    } else if( clickCount >= 2 ) {
        // Double click
        clearTimeout(singleClickTimer);
        clickCount = 0;
        //nucleiSelect(); ///this is a double click handper...
    }
}
