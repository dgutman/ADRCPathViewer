

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




// // // Filter keystrokes for numeric input
// function filter(event) {

//   // Allow backspace, delete, tab, escape, enter and .  
//   if( $.inArray(event.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
//     // Allow Ctrl-A
//      (event.keyCode == 65 && event.ctrlKey === true) ||
//     // Allow Ctrl-C
//      (event.keyCode == 67 && event.ctrlKey === true) ||
//     // Allow Ctrl-X
//      (event.keyCode == 88 && event.ctrlKey === true) ||
//     // Allow home, end, left and right
//      (event.keyCode >= 35 && event.keyCode <= 39) ) {

//       return;
//   }

//   // Don't allow if not a number
//   if( (event.shiftKey || event.keyCode < 48 || event.keyCode > 57) &&
//     (event.keyCode < 96 || event.keyCode > 105) ) {

//       event.preventDefault();
//   }
// }
