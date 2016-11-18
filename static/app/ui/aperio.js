define("ui/aperio", [], function(){

	var layoutAnnotationFileList = {
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

	var layoutAnnotationList = {
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


	var layoutParameterList ={
			view: "datatable",
			width: "auto",
			columns: [ {'id':"Parameter"}, {'id': "Value"}],
			autoConfig: true

			};


	var ROIColumns = [ {id:"Id"},{id:"Name"},{id:"ReadOnly"},{id:"NameReadOnly"},{id:"LineColorReadOnly"},
               {id:"Incremental"}, {id:"Type"}, {id:"LineColor"}, {id:"Visible"},{id:"Selected"},
               {id:"MarkupImagePath"},{id:"MacroName"}];

	var layoutROIInfo ={
			view: "datatable",
			width: "auto",
			columns: ROIColumns,
			autoConfig: true
			};

	var aperioWindow = {
	    view:"window",
	    id:"aperio_window",
	    move: true,
	    resize: true,
	    head: {view:"toolbar", margin:-4, cols:[
	            {view:"label", label: "This window can be closed" },
	            { view:"icon", icon:"question-circle",
	              click:"webix.message('About pressed')"},
	            { view:"icon", icon:"times-circle",
	              click:"$$('aperio_window').hide();"}
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
	};

	return{
		view: aperioWindow
	}
});