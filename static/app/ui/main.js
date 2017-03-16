define("ui/main", ["config", "obs", "zoomer", "aperio", "jquery", "cookie", "ui/aperio", "webix"], function(config, obs, zoomer, aperio, $, cookie, aperioWindow){

    /**
     * build()
     *
     * Create Webix UI components and create the final layout
     * which is binded into the main_layout div in index.html 
     * 
     * @param  {OpenSeaDragon} zoomer
     * @return {} None
     */
    
    var slide = null;
    var currentSlideSet = null;
    var viewer = zoomer.viewer;
    var currentItemId = null;
    var currentZoom = 1;
    var currentCenter = null;

    function build(){    
        //Thumbnail panel that contains list of thumbnails for a slide group
        thumbnailsPanel = {
            view: "dataview",
            id: "thumbnails_panel",
            select: true,
            pager: "thumbPager",
            datafetch: 10,
            loadahead: 10,
            template: "<div class='webix_strong'>#label#</div><img src='"+ config.BASE_URL +"/thumbnail/#id#'/>",
            datatype: "json",
            type: {height: 170, width: 200},
            ready: function(){
                slide = this.getItem(this.getFirstId());
                initSlide(slide);
            },
            on: {
                "onItemClick": function(id, e, node) {
                    currentItemId = id;
                    slide = this.getItem(id);
                    initSlide(slide);
                }
            }
        };

        //dropdown for slide groups
        //Data is pulled from DAS webservice
        dropdown = { 
            view:"combo",  
            placeholder:"Select Slide Set",
            id: "slideset_list",
            options: config.SLIDE_SETS,
            on:{
                "onChange": function(){
                    currentSlideSet = this.getText();
                    $$("thumbnail_search").setValue("");
                    $$("thumbnails_panel").clearAll();
                    $$("thumbnails_panel").load(config.BASE_URL +"/slideset/" + currentSlideSet);
                    $$("thumbnails_panel").setPage(0);
                },
                "onAfterRender": function(){
                    currentSlideSet = config.DEFAULT_SLIDE_SET;
                    $$("thumbnails_panel").clearAll();
                    $$("thumbnails_panel").load(config.BASE_URL +"/slideset/" + currentSlideSet);
                }
            }
        };

        //filter slides
        filter = {
            view: "search",
            id: "thumbnail_search",
            placeholder: "Search",
            on: {"onChange": filterSlides}
        };

        facets = {
            cols:[
                {id: "annotation_filter_chk", view: "checkbox", label: "Annotated", click: filterSlides},
                {id: "pathology_filter_chk", view: "checkbox", label: "Pathology", click: filterSlides}
            ]
        }

        thumbPager = {
            view:"pager",
            id: "thumbPager",
            animate:true,
            size:10,
            group:4
        }

        //slides panel is the left panel, contains two rows 
        //containing the slide group dropdown and the thumbnails panel 
        slidesPanel = { header: "Slide Controls",
                        body:{rows: [ 
                            dropdown, filter, facets, thumbPager, thumbnailsPanel
                        ]},
                        width: 220
                       }; 

        //info panel is right panel
        infoPanel = {
                    header: "Slide Info", borderless:true,
                    collapsed: true,
                    body:{
                        rows:[
                            {view: "template", content: "slide_info_obj", borderless: true},
                            {id: "macro_image", view: "template", borderless: true, template: 
                                function(){
                                    var credentials = "username=" + $.cookie("dsa_username") + "&password=" + $.cookie("dsa_password");
                                    str = "<b>Macro image:</b><br/>";
                                    if(slide != null){
                                        $.ajax({
                                            url: config.BASE_URL + "/macroimage/" + slide.id + "?" + credentials,
                                            async: false,
                                            type: "GET",
                                            success: function(){
                                                str += "<img src='" + config.BASE_URL + "/macroimage/" + slide.id + "?" + credentials +"'/>";
                                            },
                                            error: function(jqXHR){
                                                try{
                                                    resp = JSON.parse(jqXHR.responseText);
                                                    str += resp.message;
                                                }
                                                catch(err){
                                                    str += "Failed to load macro image";
                                                }
                                            }
                                        });
                                    }
                                    else{
                                        str += "Macro image not loaded!";
                                    }

                                    return str;
                                },
                                
                            },
                            {id: "label_image", view: "template", borderless: true, template: 
                                function(){
                                    var credentials = "username=" + $.cookie("dsa_username") + "&password=" + $.cookie("dsa_password");
                                    str = "<b>Label image:</b><br/>";
                                    if(slide != null){
                                        $.ajax({
                                            url: config.BASE_URL + "/labelimage/" + slide.id + "?" + credentials,
                                            async: false,
                                            type: "GET",
                                            success: function(){
                                                str += "<img src='" + config.BASE_URL + "/labelimage/" + slide.id + "?" + credentials +"'/>";
                                            },
                                            error: function(jqXHR){
                                                resp = JSON.parse(jqXHR.responseText);
                                                str += resp.message;
                                            }
                                        });
                                    }
                                    else{
                                        str += "Label image not loaded!";
                                    }

                                    return str;
                                }
                            },
                            {view: "template", template: "",  borderless:true}
                        ]
                    },
                    width:250};

        //slide button that appear on the top if the slide
        buttons = {
            height: 30,
            cols: [
                { id: "apply_filter_btn", label: "Apply Filters", view: "button", click: ("$$('filters_window').show();")},
                { id: "report_img_btn", label: "Report Bad Image", view: "button", click: reportImage, disabled: true},
                { id: "show_debug_btn", label: "Show Debug Info", view: "button", disabled: true},
                { id: "draw_tools_btn", label: "Draw Tools", view: "button", disabled: true},
                { id: "comment_btn", label: "Comment", view: "button", click: ("$$('comments_window').show();"), disabled: true},
                { id: "aperio_import_btn", label: "AperioXML", view: "button", click: initAperioAnnotationsWindow},
                { id: "pathology_reports_btn", label: "Pathology", view: "button", click: initPathologyReportsWindow},
                { id: "clinical_metadata_btn", label: "Metadata", view: "button", click: initMetaDataWindow}
            ]
        };

        //openseadragon viewer
        viewerPanel = {rows:[buttons, {view: "template", content: "image_viewer"}]};

        var menu = {
            view:"menu",
            width: 400,
            data: [
                { id:"1",value:"TCGA Resources", submenu:[
                    {value:"TCGA Analytical Tools", href: "https://tcga-data.nci.nih.gov/docs/publications/tcga/", target:"_blank"},
                ]},
                { id:"2",value:"Slide List", href: "slidelist.html", target:"_blank"},
                { id:"3",value:"Help", submenu:[
                    {value:"About the CDSA"},
                    {value:"Repository Stats"}
                ]},
                { id:"4", value:"Share Link"},
                { id:"login_btn", value:"Login"}
            ],
            type:{height:55},
            css: "menu",
            on:{ 
                onItemClick:function(id){
                    if(id == "login_btn")
                        $$("login_window").show();
                    if(id == 4)
                        $$("share_link_window").show();
                }
            }
        };

        header = {borderless: true, cols: [{
            view:"toolbar", height:66, css: "toolbar",
                cols:[
                    {view: "template", borderless:true, template: "<img src='img/CDSA_Slide_50.png' height='40'/>", width: 200},
                    {},
                    menu,
                    {view: "template", borderless:true, template: "<img src='http://cancer.digitalslidearchive.net/imgs/Winship_06-2011/Winship_NCI_shortTag/horizontal/jpg_png/Winship_NCI_shortTag_hz_280.png' height='50'/>", width: 160},
                ]
            }]
        };
    
        //the main body, below the header, contain three columns
        body = {cols:[slidesPanel,  { view: "resizer" }, viewerPanel, { view: "resizer" }, infoPanel]};

        //render the layout
        webix.ui({
            container: "main_layout",
            rows:[header, body]
        });

        webix.ui(aperioWindow.view);

        //Window for inserting and viewing slide comments
        webix.ui({
            view:"window",
            head: "Slide Comments",
            position: "center",
            id: "comments_window",
            body:{
                view: "form", 
                width: 400,
                elements:[
                    { view:"textarea", label:"Comment", labelAlign:"top", height: 50},
                    { margin:5, cols:[
                        { view:"button", value:"Save"},
                        { view:"button", value:"Cancel", click: ("$$('comments_window').hide();")}
                    ]}
                ]
            }
        });

        //Window for inserting and viewing slide comments
        webix.ui({
            view:"window",
            head:{
                view: "toolbar", 
                margin:-4, 
                cols:[
                    {view:"label", label: "Share Link" },
                    { view:"icon", icon:"times-circle", click:"$$('share_link_window').hide();"}
                ]
            },
            position: "center",
            id: "share_link_window",
            body:{
                view: "form", 
                width: 400,
                elements:[
                    { id: "link_to_share", view:"textarea", labelAlign:"top", height: 50}
                ]
            }
        });

        AperioXMLSelector = {view: "datatable", 
                width:1000,
                scroll: "xy",
                select:"row",
                id: "aperio_files_table",
                columns:[
                    { id: "XMLstatus", header: "Status", width: 50},
                    { id: "name", header: "Name", width: 250},
                    { id: "XMLlabel", header: "Label", template:function(obj){return obj['path'].split('/').slice(4);}, fillspace:true},
                    { id: "path", header: "Path", width: 40 },

                ],
                on:{
                    "onItemClick":function(id, e, trg){ 
                        file = this.getItem(id.row);
                        webix.message(file.path);
                        importAperioAnnotations(file.path);
                       // $$('aperio_files_window').hide();   
                       $$('aperio_files_window').setPosition(100, 100);      
                    } 
                }
            }


        //Window for inserting and viewing slide comments
        webix.ui({
            view:"window",
            id: "wbxMainUI",
            head:{
                view: "toolbar", 
                margin:-4, 
                cols:[
                    {view:"label", label: "Aperio Annotations" },
                    { view:"icon", icon:"times-circle", click:"$$('aperio_files_window').hide();"}
                ]
            },
            position: "center",
            id: "aperio_files_window",
            move: true,
            body:{
                cols:[  AperioXMLSelector,{view:"template",template:'LeftView', width:200},]
            }
        });

        //Window for inserting and viewing slide comments
        webix.ui({
            view:"window",
            head:{
                view: "toolbar", 
                margin:-4, 
                cols:[
                    {view:"label", label: "Pathology Reports" },
                    { view:"icon", icon:"times-circle", click:"$$('pathology_reports_window').hide();"}
                ]
            },
            position: "center",
            id: "pathology_reports_window",
            move: true,
            body:{
                rows:[{view: "datatable", 
                width:1000,
                scroll: "xy",
                select:"row",
                id: "pathology_reports_table",
                columns:[
                    { id: "name", header: "Name", width: 250},
                    { id: "path", header: "Path", fillspace:true},

                ],
                on:{
                    "onItemClick":function(id, e, trg){ 
                        file = this.getItem(id.row);
                        var content = "<embed src='"+config.BASE_URL+"/pathology/" + file.path +"' width='100%' height='100%' pluginspage='http://www.adobe.com/products/acrobat/readstep2.html'>"
                        $$("pdfviewer").define("template", content);
                        $$('pathology_report_pdf').show();   
                        $$('pathology_reports_window').hide();    
                    } 
                }
            }]
            }
        });

        webix.ui({
            view:"window",
            head:{
                view: "toolbar", 
                margin:-4, 
                cols:[
                    {view:"label", label: "Pathology Report" },
                    { view:"icon", icon:"times-circle", click:"$$('pathology_report_pdf').hide();"}
                ]
            },
            id: "pathology_report_pdf",
            move: true,
            position: "top",
            resize: true,
            width: 700,
            height: 800,
            body:{ 
                id: "pdfviewer", 
                view:"template", 
                template:"<embed src='https://www.therapath.com/pdfs/SampleReport.pdf' pluginspage='http://www.adobe.com/products/acrobat/readstep2.html'>"
            }
        });

        //Window for inserting and viewing slide comments
        webix.ui({
            view:"window",
            head: "Login",
            position: "center",
            id: "login_window",
            modal:true,
            body:{
                view: "form", 
                width: 400,
                elements:[
                    { id: "username", view:"text", label:"Username"},
                    { id: "password", view:"text", type:"password", label:"Password"},
                    { margin:5, cols:[
                        { view:"button", value:"Login" , type:"form", click: authenticate},
                        { view:"button", value:"Cancel", click: ("$$('login_window').hide();")}
                    ]},
                    { id: "login_message", view:"label", value: ""},
                ]
            }
        });

        //Window for inserting and viewing slide comments
        webix.ui({
            view:"window",
            head:{
                view: "toolbar", 
                margin:-4, 
                cols:[
                    {view:"label", label: "Slide Metadata" },
                    { view:"icon", icon:"times-circle", click:"$$('metadata_window').hide();"}
                ]
            },
            position: "center",
            id: "metadata_window",
            move: true,
            body:{
                rows:[
                    {
                        cells:[
                            {   view: "datatable", 
                                width:800,
                                height:450,
                                scroll: "xy",
                                select:"row",
                                id: "clinical_metadata_table",
                                columns:[
                                    { id: "key", header: "Key", width: 250},
                                    { id: "value", header: "Value", fillspace:true}
                                ]
                            },
                            {id:"aboutView1", width:800, height:450, template:"<i>Placeholder 1</i>",padding:5},
                            {id:"aboutView2", width:800, height:450, template:"<i>Placeholder 2</i>",padding:5}
                        ]
                    },
                    {   view:"tabbar",  
                        type: "bottom", 
                        multiview:true, 
                        options: [
                            { value: 'Clinical', id: 'clinical_metadata_table'},
                            { value: '??', id: "aboutView1"},
                            { value: '??', id: "aboutView2"}
                        ]
                    }
                ]
            }
        });

        //Window for slide filters
        var contrastSlider = { 
            view:"slider", 
            type: "alt",
            label:"Contrast", 
            value: 100, 
            max: 100,
            id:"contrast_slider",
            title:webix.template("Selected: #value#"),
            on: {"onSliderDrag": applyImageFilters, "onChange": applyImageFilters}
        };

        var brightnessSlider = { 
            view:"slider", 
            type: "alt",
            label:"Brightness", 
            value: 100,
            max: 100,
            id: "brightness_slider",
            title:webix.template("Selected: #value#"),
            on: {"onSliderDrag": applyImageFilters, "onChange": applyImageFilters}
        };

        var saturationSlider = { 
            view:"slider", 
            type: "alt",
            label:"Saturation", 
            value: 100,
            max: 100,
            id: "saturation_slider",
            title:webix.template("Selected: #value#"),
            on: {"onSliderDrag": applyImageFilters, "onChange": applyImageFilters}
        };

        var hueSlider = { 
            view:"slider", 
            type: "alt",
            label:"Hue Rotate", 
            value: 0,
            max: 360,
            id: "hue_rotate_slider",
            title:webix.template("Selected: #value#"),
            on: {"onSliderDrag": applyImageFilters, "onChange": applyImageFilters}
        };

        var invertSlider = { 
            view:"slider", 
            type: "alt",
            label:"Invert", 
            value: 0,
            max: 100,
            id: "invert_slider",
            title:webix.template("Selected: #value#"),
            on: {"onSliderDrag": applyImageFilters, "onChange": applyImageFilters}
        };

        var blurSlider = { 
            view:"slider", 
            type: "alt",
            label:"Blur", 
            value: 0,
            max: 10,
            id:"blur_slider",
            title:webix.template("Selected: #value#"),
            on: {"onSliderDrag": applyImageFilters, "onChange": applyImageFilters}
        };

        var grayscaleSlider = { 
            view:"slider", 
            type: "alt",
            label:"Grayscale", 
            value: 0,
            max: 100,
            id:"grayscale_slider",
            title:webix.template("Selected: #value#"),
            on: {"onSliderDrag": applyImageFilters, "onChange": applyImageFilters}
        };

        webix.ui({
            view:"window",
            move:true,
            head:{
                view: "toolbar", 
                margin:-4, 
                cols:[
                    {view:"label", label: "Slide Filters" },
                    { view:"icon", icon:"times-circle", click:"$$('filters_window').hide();"}
                ]
            },
            position: "center",
            id: "filters_window",
            body:{
                view: "form", 
                width: 400,
                elements:[
                    contrastSlider, brightnessSlider, saturationSlider, hueSlider, invertSlider, blurSlider, grayscaleSlider,
                    { margin:5, cols:[
                        { view:"button", value:"Reset All", click: resetSliders}
                    ]}
                ]
            }
        });
    }

    function initSlide(newSlide){
        //set the new slide
        slide = newSlide;
        sharedUrl = config.HOST_URL + "/#slide/" + slide.id;
        console.log(slide);

        //close all windows
        $$('metadata_window').hide();
        $$('pathology_reports_window').hide();  
        $$('pathology_report_pdf').hide(); 
        $$('aperio_files_window').hide();
        $$('filters_window').hide();

        //udpate the tile source and initialize the viewer
        tileSource = {
            width: slide.width,
            height: slide.height,
            tileWidth: 256,
            tileHeight: 256,
            getTileUrl: function(level, x, y){
                return config.BASE_URL +"/tile/"+ slide.id + "/" + level + "/" + x + "/" + y;
            }
        }

        viewer.open(tileSource);

        //set viewer zoom level if the slide has this property
        viewer.addHandler("open", function() {
            if(typeof slide.zoom != "undefined"){    
                viewer.viewport.zoomBy(slide.zoom);
            }
            if(typeof slide.pan != "undefined"){      
                viewer.viewport.panTo(slide.pan);
            }
        });

        viewer.addHandler('zoom', function(event) {
            tmpUrl = sharedUrl + "/" + viewer.viewport.getZoom();
            currentZoom = viewer.viewport.getZoom();
            
            if(currentCenter != null)
                 tmpUrl += "/" + currentCenter.x + "/" + currentCenter.y;

            $$("link_to_share").setValue(tmpUrl);
        });

        viewer.addHandler('pan', function(event) {
            center = viewer.viewport.getCenter();
            tmpUrl = sharedUrl + "/" + currentZoom + "/" + center.x + "/" + center.y;
            currentCenter = center;

            $$("link_to_share").setValue(tmpUrl);
        });

        //update the maco and label images
        $$("macro_image").refresh();
        $$("label_image").refresh();
        
        //set observable variables
        obs.slideInfoObj.name(slide.name);
        obs.slideInfoObj.label(slide.label);
        obs.slideInfoObj.slideSet(slide.set);
        obs.slideInfoObj.originalResolution(slide.originalResolution);
        obs.slideInfoObj.fileSize(slide.size);
        
        //activate buttons
        if(slide.aperioAnnotations){
            $$("aperio_import_btn").enable();
            $$("aperio_files_table").clearAll();
            $$("aperio_files_table").define("data", slide.aperioAnnotations);
        }
        else{
            $$("aperio_import_btn").disable();
        }

        //activate buttons
        if(slide.pathologyReports){
            $$("pathology_reports_btn").enable();
            $$("pathology_reports_table").clearAll();
            $$("pathology_reports_table").define("data", slide.pathologyReports);
        }
        else{
            $$("pathology_reports_btn").disable();
        }

        //activate buttons\
        if(slide.clinicalMetaData){
            $$("clinical_metadata_btn").enable();
            $$("clinical_metadata_table").clearAll();
            $$("clinical_metadata_table").define("data", slide.clinicalMetaData);
        }
        else{
            $$("clinical_metadata_btn").disable();
        }

        //update the share link
        $$("link_to_share").setValue(sharedUrl);
    }

    function filterSlides(keyword = null){
        params = new Array();
        keyword = $$("thumbnail_search").getValue();
        aperioAnnotation = $$("annotation_filter_chk").getValue();
        pathologyReport = $$("pathology_filter_chk").getValue();

        if(keyword != "")
           params.push("filter[label]=" + keyword);
        if(aperioAnnotation == 1)
            params.push("facets[aperioAnnotations]=" + true);
        if(pathologyReport == 1)
            params.push("facets[pathologyReports]=" + true);

        url = config.BASE_URL +"/slideset/" + currentSlideSet + "?" + params.join("&");
        
        $$("thumbnails_panel").clearAll();
        $$("thumbnails_panel").load(url);
        $$("thumbnails_panel").setPage(0);
    }

    function resetSliders(){
        $$("contrast_slider").setValue(100);
        $$("brightness_slider").setValue(100);
        $$("saturation_slider").setValue(100);
        $$("hue_rotate_slider").setValue(0);
        $$("invert_slider").setValue(0);
        $$("blur_slider").setValue(0);
        $$("grayscale_slider").setValue(0);

        applyImageFilters();
    }

    function applyImageFilters(){
        var css = 'contrast(' + $$("contrast_slider").getValue() + '%) ' +
                  'brightness(' + $$("brightness_slider").getValue() + '%) ' +
                  'hue-rotate(' + $$("hue_rotate_slider").getValue() + ') ' +
                  'saturate(' + $$("saturation_slider").getValue() + '%) ' +
                  'invert(' + $$("invert_slider").getValue() + '%) ' +
                  'grayscale(' + $$("grayscale_slider").getValue() + '%) ' +
                  'blur(' + $$("blur_slider").getValue() + 'px)';

        $('.magic').css('-webkit-filter', css);
        $('.openseadragon-canvas').css('-webkit-filter', css);
    }

    function initFiltersWindow(){
        $$("filters_window").show();
    }

    function initCommentWindow(){
        $$("comments_window").show();
    }

    function importAperioAnnotations(filename){
        url = config.BASE_URL + "/aperio" + filename;
        aperio.importMarkups(url);
    }

    function reportImage(){
        data = JSON.stringify({"bad": true});
        url = config.BASE_URL + "/slide/" + slide.id;
        $.ajax({
            url: url,
            type: "PUT",
            contentType: "application/json",
            dataType: "json",
            data: data,
            success: function(response) {
                slide = response;
                $$("thumbnails_panel").remove(currentItemId);
            }
        });
    }

    function initPathologyReportsWindow(){
        //close all windows
        $$('metadata_window').hide();
        $$('pathology_reports_window').hide();  
        $$('pathology_report_pdf').hide(); 
        $$('aperio_files_window').hide();
        $$('filters_window').hide();

        if(slide.pathologyReports.length == 1){
            var content = "<embed src='"+config.BASE_URL+"/pathology" + slide.pathologyReports[0].path +"' width='100%' height='100%' pluginspage='http://www.adobe.com/products/acrobat/readstep2.html'>"
            $$("pdfviewer").define("template", content);
            $$('pathology_report_pdf').show(); 
        }  
        else{
            $$('pathology_reports_window').show();
        }
    }

    function initAperioAnnotationsWindow(){
        //close all windows
        $$('metadata_window').hide();
        $$('pathology_reports_window').hide();  
        $$('pathology_report_pdf').hide(); 
        $$('aperio_files_window').hide();
        $$('filters_window').hide();

        $$('aperio_window').show();
        /*if(slide.aperioAnnotations.length == 1){
            importAperioAnnotations(slide.aperioAnnotations[0].path);
        }  
        else{
            $$('aperio_files_window').show();
        }  */  
    }

    function initMetaDataWindow(){
        //close all windows
        $$('pathology_reports_window').hide();  
        $$('pathology_report_pdf').hide(); 
        $$('aperio_files_window').hide();
        $$('filters_window').hide();
        $$('metadata_window').show();   
    }

    function authenticate(){
        data = JSON.stringify({"username": $$("username").getValue(), "password": $$("password").getValue()});
        url = config.BASE_URL + "/auth";

        $.ajax({
            url: url,
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: data,
            success: function(response) {
                console.log(response);
                $.cookie("dsa_username", $$("username").getValue(), {expires: 30});
                $.cookie("dsa_password", $$("password").getValue(), {expires: 30});
                $$('login_window').hide();
            },
            error: function(response) {
                console.log(response);
                $$('login_message').setValue("Login failed. Please try again.");
            }
        });
    }

    function getCredentials() {
        var name = "dsa_username=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    return{
        build: build,
        initSlide: initSlide
    }
});
