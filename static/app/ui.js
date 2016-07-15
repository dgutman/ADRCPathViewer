/**
 * ui module
 * 
 * dependencies:
 *  config - site wide JS configuration file
 *  webix - webix UI
 */

define("ui", ["config", "obs", "zoomer", "aperio",  "webix"], function(config, obs, zoomer, aperio){

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
    var viewer = zoomer.viewer;

    function build(){    
        //Thumbnail panel that contains list of thumbnails for a slide group
        thumbnailsPanel = {
            view: "dataview",
            id: "thumbnails_panel",
            select: true,
            pager: "thumbPager",
            template: "<div class='webix_strong'>#slide_name#</div><img src='" + config.IIP_URL + "#iip_thumbnail#' width='210'/>",
            datatype: "json",
            type: { width: 200, height: 180 },
            on: {
                "onItemClick": function(id, e, node) {
                    slide = this.getItem(id);
                    initSlide();
                },
                "onAfterLoad": function() {
                    slide = $$("thumbnails_panel").getItem($$("thumbnails_panel").getFirstId());
                    initSlide();
                }
            }
        };

        //dropdown for slide groups
        //Data is pulled from DAS webservice
        dropdown = { 
            view:"combo",  
            label: "Groups",
            id: "group_list",
            options: config.BASE_URL + "/api/wbx/slideSet",
            value: "lgg",
            on:{
                "onChange": function(){
                    group = this.getText();
                    $$("thumbnails_panel").load(config.BASE_URL + "/api/wbx/slideSet/" + group);
                },
                "onAfterRender": function() {
                    group = this.getText();
                    $$("thumbnails_panel").load(config.BASE_URL + "/api/wbx/slideSet/" + group);
                }
            }
        };

        thumbPager = {
            view:"pager",
            id: "thumbPager",
            size:10,
            group:4

        }

        //slides panel is the left panel, contains two rows 
        //containing the slide group dropdown and the thumbnails panel 
        slidesPanel = { header: "Slide Controls",
                        body:{rows: [ 
                            dropdown,  {'template': "FILTERS", height:50},thumbPager, thumbnailsPanel
                        ]},
                        width: 220
                       }; 

        //info panel is right panel
        infoPanel = {header: "Slide Info",
                     body:{
                        view: "template", 
                        content: "slide_info_obj"
                    },
                    width:250};

        //slide button that appear on the top if the slide
        buttons = {cols:[
                    { id: "apply_filter_btn", view:"button", label: "Apply Filters", height: 30},
                    { id: "report_img_butn", view:"button", label: "Report Bad Image"},
                    { id: "show_debug_btn", view:"button", label: "Show Debug Info"},
                    { id: "draw_tools_btn", view:"button", label: "Draw Tools"},
                    { id: "comment_btn", view:"button", label: "Comment", click: initCommentWindow},
                    { id: "aperio_import_btn", view:"button", label: "AperioXML", click: importAperioAnnotations}
                  ]
                 };

        //openseadragon viewer
        viewerPanel = {rows:[buttons, {view: "template", content: "image_viewer", height: "100%"}]};

        //page header
        header = {
            height: 50,
            css: "header",
            cols:[
                {view: "template",  template: "<img src='img/CDSA_Slide_50.png' height='40'/>", type: "clean"} 
            ]
        };

        //the main body, below the header, contain three columns
        body = {cols:[slidesPanel,  viewerPanel, { view: "resizer" }, infoPanel]};

        //render the layout
        webix.ui({
            type: "material",
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

    }

    function initSlide(){
        //set observable variables
        obs.slideInfoObj.name(slide.slide_name);
        obs.slideInfoObj.label(slide.slide_name);
        obs.slideInfoObj.group(slide.slideGroup);

        //activate buttons
        slide.HasAperioXML ? $$("aperio_import_btn").enable() : $$("aperio_import_btn").disable();
    
        url = config.IIP_URL + slide.iip_slide_w_path;
        viewer.open(url);
    }

    function initCommentWindow(){
        $$("comments_window").show();
    }

    function importAperioAnnotations(){
        aperio.importMarkups("http://node15.cci.emory.edu/LGG_LiveDev/XML_FILES/TCGA-06-0137-01A-01-BS1.xml");
    }

    return{
        build: build
    }
});
