 function new_query_db(pid,csv_datasrc) {
        //Check and see if I alrady have the data or not for this database
    	if (!patient_data.hasOwnProperty(pid))  {  patient_data[pid] = {}; }  
    		//http://digitalslidearchive.emory.edu:5001/api/v1/clin_datasources/nationwidechildrens.org_biospecimen_slide_acc/TCGA-OR-A5J3-01A
        if( !patient_data[pid][csv_datasrc] ) { console.log('need data')  }
        $.getJSON( '/api/v1/clin_datasources/'+csv_datasrc+'/'+pid ).complete( function(data) {  
                                       console.log(data.responseJSON);
                                       patient_data[pid][csv_datasrc] = data.responseJSON;


        //This needs major refactor
        $('#query_db_table_div').html('<table cellpadding="0" cellspacing="0" border="0" class="display" id="query_db_table"></table>');
        $('#query_db_table').dataTable({
            "aaData": patient_data[pid][csv_datasrc]['data'],
            "bLengthChange": false,
            "bSort": false,
            "bSortClasses": false,
            "iDisplayLength": 10,
            "bDeferRender": true,
            "aoColumns": [{
                "sTitle": "Key",
                "sClass": "left",
                "sType": "html"
            }, {
                "sTitle": "Value",
                "sClass": "left",
                "sType": "html"
            }]
        });

    
  });

    }

   function load_path_report(pid) {
        /* Given the patient ID, this will call the API and see if theres a pathology report */

        console.log('Should load path report for' + pid);
        $("#path_report_dialog").empty();
        $("#path_report_dialog").html(`<embed src="http://cancer.digitalslidearchive.emory.edu/api/v1/path_reports/${pid}" width="600" height="575" >`);

    }

$.getJSON('/api/v1/clin_datasources/' + recent_study_name).complete(function(data) {
        	if (!patient_data.hasOwnProperty(pid))  {  patient_data[pid] = {}; }  
            // console.log(data.responseJSON) 
            $("#query_db_entry").empty(); //Clear the current select options
            data_sources = data.responseJSON["Filtered_Source_List"]; //For now I am only exposing a subclass of CSV files as theere are lots of not relevant ones
            console.log(data_sources);
            $.each(data_sources, function(idx, val) {
                //Now append these to an option list
                $("#query_db_entry").append(`<option id="${idx}" value="${idx}">${val}</option">`);
                patient_data[pid][val] = {};  
                //At this Point I have not retrieved info on this entry 

            })
        })


        //I also need to query the database and grab some basic data..
        //            $('#query_db').removeAttr('disabled');

