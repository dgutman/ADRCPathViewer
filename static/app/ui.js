/**
 * ui module
 * 
 * dependencies:
 *  config - site wide JS configuration file
 *  obs
 *  webix - webix UI
 */

define("ui", ["config", "obs", "zoomer", "aperio", "jquery", "webix"], function(config, obs, zoomer, aperio, $){

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

    function build(){    
        //Thumbnail panel that contains list of thumbnails for a slide group
        thumbnailsPanel = {
            view: "dataview",
            id: "thumbnails_panel",
            select: true,
            pager: "thumbPager",
            datafetch: 10,
            loadahead: 10,
            template: "<div class='webix_strong'>#fileName#</div><img src='"+ config.BASE_URL +"/thumbnail/#id#'/>",
            datatype: "json",
            type: { height: 170, width: 200},
            on: {
                "onItemClick": function(id, e, node) {
                    currentItemId = id;
                    slide = this.getItem(id);
                    $$("macro_image").refresh();
                    $$("label_image").refresh();
                    initSlide();
                }
            }
        };

        //dropdown for slide groups
        //Data is pulled from DAS webservice
        dropdown = { 
            view:"combo",  
            placeholder:"Select Slide Set",
            id: "slideset_list",
            options: config.BASE_URL +"/slidesetlist",
            value: "",
            on:{
                "onChange": function(){
                    currentSlideSet = this.getText();
                    $$("thumbnail_search").setValue("");
                    $$("thumbnails_panel").clearAll();
                    $$("thumbnails_panel").load(config.BASE_URL +"/slideset/" + currentSlideSet);
                    $$("thumbnails_panel").setPage(0);
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
                            dropdown, filter, thumbPager, thumbnailsPanel
                        ]},
                        width: 220
                       }; 

        //info panel is right panel
        infoPanel = {
                    header: "Slide Info", borderless:true,
                    body:{
                        rows:[
                            {view: "template", content: "slide_info_obj", borderless:true},
                            {id: "macro_image", view: "template", borderless:true, template: 
                                function(){
                                    str = "<b>Macro image:</b><br/>";
                                    if(slide != null){
                                        $.ajax({
                                            url: config.BASE_URL + "/macroimage/" + slide.id,
                                            async: false,
                                            type: "GET",
                                            success: function(){
                                                str += "<img src='" + config.BASE_URL + "/macroimage/" + slide.id + "'/>";
                                            },
                                            error: function(jqXHR){
                                                resp = JSON.parse(jqXHR.responseText);
                                                str += resp.message;
                                            }
                                        });
                                    }
                                    else{
                                        str += "Macro image not loaded!";
                                    }

                                    return str;
                                }
                            },
                            {id: "label_image", view: "template", borderless:true, template: 
                                function(){
                                    str = "<b>Label image:</b><br/>";
                                    if(slide != null){
                                        $.ajax({
                                            url: config.BASE_URL + "/labelimage/" + slide.id,
                                            async: false,
                                            type: "GET",
                                            success: function(){
                                                str += "<img src='" + config.BASE_URL + "/labelimage/" + slide.id + "'/>";
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
            view: "segmented", 
            value: "nothing", 
            options:[
                { id: "apply_filter_btn", value: "Apply Filters"},
                { id: "report_img_butn", value: "Report Bad Image"},
                { id: "show_debug_btn", value: "Show Debug Info"},
                { id: "draw_tools_btn", value: "Draw Tools"},
                { id: "comment_btn", value: "Comment"},
                { id: "aperio_import_btn", value: "AperioXML"}
            ],
            on:{
                onAfterTabClick: function(id){
                    switch(id){
                        case "apply_filter_btn":
                            initFiltersWindow();
                            break;
                        case "report_img_butn":
                            reportImage();
                            break;
                        case "comment_btn":
                            initCommentWindow();
                            break;
                        case "aperio_import_btn":
                            importAperioAnnotations();
                            break;
                    }
                }    
            }
        };

        //openseadragon viewer
        viewerPanel = {rows:[buttons, {view: "template", content: "image_viewer"}]};

        var menu = {
            view:"menu",
            width: 300,
            data: [
                { id:"1",value:"TCGA Resources", submenu:[
                    {value:"TCGA Analytical Tools", href: "https://tcga-data.nci.nih.gov/docs/publications/tcga/", target:"_blank"},
                ]},
                { id:"2",value:"Slide List", href: "slidelist.html", target:"_blank"},
                { id:"3",value:"Help", submenu:[
                    {value:"About the CDSA"},
                    {value:"Repository Stats"}
                ]}
            ],
            type:{height:55},
            css: "menu"
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
            head: "Slide Filters",
            position: "center",
            id: "filters_window",
            body:{
                view: "form", 
                width: 400,
                elements:[
                    contrastSlider, brightnessSlider, saturationSlider, hueSlider, invertSlider, blurSlider, grayscaleSlider,
                    { margin:5, cols:[
                        { view:"button", value:"Reset All", click: resetSliders},
                        { view:"button", value:"Close", click: ("$$('filters_window').hide();")}
                    ]}
                ]
            }
        });
    }

    function initSlide(){
        //set observable variables
        obs.slideInfoObj.name(slide.fileName);
        obs.slideInfoObj.label(slide.fileName);
        obs.slideInfoObj.slideSet(slide.slideSet);
        obs.slideInfoObj.originalResolution(slide.orig_resolution);
        obs.slideInfoObj.fileSize(slide.fileSize);

        //activate buttons
        //slide.HasAperioXML ? $$("aperio_import_btn").enable() : $$("aperio_import_btn").disable();
        
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
    }

    function filterSlides(keyword){
        $$("thumbnails_panel").clearAll();
        $$("thumbnails_panel").load(config.BASE_URL +"/slideset/" + currentSlideSet + "?filter[fileName]=" + keyword);
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

    function importAperioAnnotations(){
        aperio.importMarkups("http://node15.cci.emory.edu/LGG_LiveDev/XML_FILES/TCGA-06-0137-01A-01-BS1.xml");
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

    return{
        build: build
    }
});
