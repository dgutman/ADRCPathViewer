
layoutAnnotationFileList = 
{
  view:"list",
    height:200,
    id: "wbxAnnotationFileList",
  template:"#title#",
  select:true,
  data:[
    { id:1, title:"File 1"},
    { id:2, title:"File 2"},
    { id:3, title:"File 3"}
  ]
};


// {view: 'template',template:"AnnotationFileList Goes here"  }

layoutAnnotationList = 
{
  view:"list",
    height:200,
    width: "auto",
    id: "wbxAnnotationFileList",
  template:"#title#",
  select:true,
  data:[
    { id:1, title:"Annotation 1"},
    { id:2, title:"Annotation 2"},
    { id:3, title:"Annotation 3"}
  ]
};


layoutParameterList =
{
view: "datatable",
width: "auto",
columns: [ {'id':"Parameter"}, {'id': "Value"}],
autoConfig: true

}

     // aperio_win_grid2.addRow(1, ["Id:", this.getAttribute("Id")], 1);
     //            aperio_win_grid2.addRow(2, ["Name:", this.getAttribute("Name")], 2);
     //            aperio_win_grid2.addRow(3, ["ReadOnly:", this.getAttribute("ReadOnly")], 3);
     //            aperio_win_grid2.addRow(4, ["NameReadOnly:", this.getAttribute("NameReadOnly")], 4);
     //            aperio_win_grid2.addRow(5, ["LineColorReadOnly:", this.getAttribute("LineColorReadOnly")], 5);
     //            aperio_win_grid2.addRow(6, ["Incremental:", this.getAttribute("Incremental")], 6);
     //            aperio_win_grid2.addRow(7, ["Type:", this.getAttribute("Type")], 7);
     //            aperio_win_grid2.addRow(8, ["LineColor:", this.getAttribute("LineColor")], 8);
     //            aperio_win_grid2.addRow(9, ["Visible:", this.getAttribute("Visible")], 9);
     //            aperio_win_grid2.addRow(10, ["Selected:", this.getAttribute("Selected")], 10);
     //            aperio_win_grid2.addRow(11, ["MarkupImagePath:", this.getAttribute("MarkupImagePath")], 11);
     //            aperio_win_grid2.addRow(12, ["MacroName:", this.getAttribute("MacroName")], 12);
     //            // aperio_win_grid2.addRow(2,["LineColor:",this.getAttribute("LineColor")],2);
     //            linecolor = this.getAttribute("LineColor").toString(16);
     //            linecolor = (linecolor.length < 6) ? "0" + linecolor : linecolor;
          

ROIColumns = [ {id:"Id"},{id:"Name"},{id:"ReadOnly"},{id:"NameReadOnly"},{id:"LineColorReadOnly"},
               {id:"Incremental"}, {id:"Type"}, {id:"LineColor"}, {id:"Visible"},{id:"Selected"},
               {id:"MarkupImagePath"},{id:"MacroName"}]

layoutROIInfo =
{
view: "datatable",
width: "auto",
columns: ROIColumns,
autoConfig: true


}



function aperioLineColortoHex(int) {
  int = parseInt(int);
    var part1 = int & 255;
    var part2 = ((int >> 8) & 255);
    var part3 = ((int >> 16) & 255);
   // var part4 = ((int >> 24) & 255);
   // return part4 + "." + part3 + "." + part2 + "." + part1;
  return part1.toString(16) + part2.toString(16)+ part3.toString(16);
  }




webix.ready(function()
{

//Create a window...

console.log("Window shold pop up??");
webix.ui({
    view:"window",
    id:"winAperioMarkups",
    move: true,
    resize: true,
    head: {view:"toolbar", margin:-4, cols:[
            {view:"label", label: "This window can be closed" },
            { view:"icon", icon:"question-circle",
              click:"webix.message('About pressed')"},
            { view:"icon", icon:"times-circle",
              click:"$$('winAperioMarkups').hide();"}
            ]
        },
    height: 300,
    width: "auto",
    moveable: true,
    body:{
        view: "layout", 
        rows: [
         { cols: [ layoutAnnotationFileList,layoutAnnotationList,layoutParameterList ]},
        layoutROIInfo
         ]
    }
}).show();


var layout = webix.ui({
     container:"main_layout",
               id:"layout",
               height:550,
               width:"auto",
    rows:[
        {template:"row 1"},
        {template:"row 2"},
        {
            cols:[
                {template:"col 1"},
                {template:"col 2"}
            ]
        }
    ]
});


aperio_xmlFile = getAperioXML_document(XMLExampleFile);


//I am going to turn the aperioXML File into a JSON Object that's WEBIX friendly
function parseAperioXMLFile( XMLDocument )
  {




  }

// XMLResponse = aperioxml_annotation;
//         $('Annotation', XMLResponse).each(function() {
        
//
//<Annotation Id="1" Name="tumor" ReadOnly="0" NameReadOnly="0" LineColorReadOnly="0" Incremental="0" Type="4" LineColor="65280" Visible="1" Selected="0" MarkupImagePath="" MacroName="">

})



function xmlToJson(xml) {
  
  // Create the return object
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
};




