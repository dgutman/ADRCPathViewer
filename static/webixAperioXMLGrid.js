
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
        {view: 'template',template:"LeftLower" }
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


// webix.message({
//     type:"error", 
//     text:"Form Data is Invalid",
//     expire:2000
//     //expire:-1   for canceling expire period
// })



//https://isic-archive.com/girder#collection/55943cff9fc3c13155bcad61/folder/573f11119fc3c132505c0ee7

})


