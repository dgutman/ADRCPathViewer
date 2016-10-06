define("ui/toolbar", ["aperio", "webix"], function(aperio){

	buttons = {
    	height: 30,
        cols: [
        	{ id: "apply_filter_btn", label: "Apply Filters", view: "button", click: ("$$('filters_window').show();")},
        	{ id: "aperio_import_btn", label: "AperioXML", view: "button", click: initAperioAnnotationsWindow}
       	]
    }

    function initAperioAnnotationsWindow(){
        //close all windows
        $$('metadata_window').hide();
        $$('pathology_reports_window').hide();  
        $$('pathology_report_pdf').hide(); 
        $$('aperio_files_window').hide();
        $$('filters_window').hide();

        if(slide.aperioAnnotations.length == 1){
            importAperioAnnotations(slide.aperioAnnotations[0].path);
        }  
        else{
            $$('aperio_files_window').show();
        }
    }

    function importAperioAnnotations(filename){
        var url = config.BASE_URL + "/aperio/" + filename;
        aperio.importMarkups(url);
    }

    return{
    	buttons: buttons
    }
});