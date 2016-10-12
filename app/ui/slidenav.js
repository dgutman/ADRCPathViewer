define("ui/slidenav", ["config", "zoomer", "slide", "jquery","aperio", "webix"], function(config, zoomer, slide, $, aperio){

    viewer = zoomer.viewer;

    var thumbnailsPanel = {
        view: "dataview",
        id: "thumbnails_panel",
        select: true,
        pager: "thumbPager",
        datafetch: 10,
        loadahead: 10,
        template: "<div class='webix_strong'>#name#</div><img src='"+ config.BASE_URL +"/item/#_id#/tiles/thumbnail'/>",
        datatype: "json",
        type: {height: 170, width: 200},
        ready: function(){
            item = this.getItem(this.getFirstId());
            slide.init(item);
        },
        on: {
            "onItemClick": function(id, e, node) {
                item = this.getItem(id);
                slide.init(item);
            }
        }
    };

    //dropdown for slide groups
    //Data is pulled from DAS webservice
    dropdown = { 
        view:"combo",
        placeholder:"Select Slide Set",
        id: "slideset_list",
        options:{
            body:{
                template:"#name#",
                url: config.BASE_URL + "/folder?parentType=collection&parentId=" + config.COLLECTION_ID
            }
        },
        on:{
            "onChange": function(id){
                var item = this.getPopup().getBody().getItem(id);
                var samples = $$("samples_list").getPopup().getList();
                var url = config.BASE_URL + "/folder?parentType=folder&parentId=" + item._id;
                samples.clearAll();
                samples.load(url);
            },
            "onAfterRender": function(){
                var samples = $$("samples_list").getPopup().getList();
                var url = config.BASE_URL + "/folder?parentType=folder&parentId=" + config.DEFAULT_FOLDER_ID;
                samples.clearAll();
                samples.load(url);
            }
        }
    };

    samples_dropdown = { 
        view:"combo",
        placeholder:"Select Sample",
        id: "samples_list",
        options:{
            body:{
                template:"#name#",
                url: config.BASE_URL + "/folder?parentType=folder&parentId=57ca039af8c2ef024e986371"
            }
        },
        on:{
            "onChange": function(id){
                var item = this.getPopup().getBody().getItem(id);
                var thumbs = $$("thumbnails_panel");
                var url = config.BASE_URL + "/item?folderId=" + item._id;
                thumbs.clearAll();
                thumbs.load(url);
            },
            "onAfterRender": function(){
                var thumbs = $$("thumbnails_panel");
                var url = config.BASE_URL + "/item?folderId=" + config.DEFAULT_PATIENT_ID;
                thumbs.clearAll();
                thumbs.load(url);
            }
        }
    };

    thumbPager = {
        view:"pager",
        id: "thumbPager",
        animate:true,
        size:10,
        group:4
    };

    //slides panel is the left panel, contains two rows 
    //containing the slide group dropdown and the thumbnails panel 
    slidesPanel = { 
        header: "Slide Controls",
        body:{
            rows: [ 
                dropdown, samples_dropdown, thumbPager, thumbnailsPanel
            ]
        },
        width: 220
    };

    return{
        view: slidesPanel
    }
}); 