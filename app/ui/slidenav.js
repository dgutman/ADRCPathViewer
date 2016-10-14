define("ui/slidenav", ["config", "zoomer", "slide", "jquery", "aperio", "requests", "webix"], function(config, zoomer, slide, $, aperio, requests) {

    viewer = zoomer.viewer;

    var thumbnailsPanel = {
        view: "dataview",
        id: "thumbnails_panel",
        select: true,
        pager: "thumbPager",
        datafetch: 10,
        loadahead: 10,
        template: "<div class='webix_strong'>#name#</div><img src='" + config.BASE_URL + "/item/#_id#/tiles/thumbnail'/>",
        datatype: "json",
        type: {
            height: 170,
            width: 200
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
        view: "combo",
        placeholder: "Select Slide Set",
        id: "slideset_list",
        options: {
            body: {
                template: "#name#"
            }
        },
        on: {
            "onChange": function(id) {
                $$("thumbnail_search").setValue("");
                var item = this.getPopup().getBody().getItem(id);
                
                $.get(config.BASE_URL + "/folder?parentType=folder&parentId=" + item._id, function(data){
                    var sFoldersMenu = $$("samples_list").getPopup().getList();
                    sFoldersMenu.clearAll();
                    sFoldersMenu.parse(data);
                    $$("samples_list").setValue(data[0].id);
                });
            },
            "onAfterRender": function() {
                $.get(config.BASE_URL + "/resource/lookup?path=/collection/" + config.COLLECTION_NAME)
                 .then(function(collection){
                    return $.get(config.BASE_URL + "/folder?parentType=collection&parentId=" + collection._id);
                }).then(function(folders){
                    var foldersMenu = $$("slideset_list").getPopup().getList();
                    foldersMenu.clearAll();
                    foldersMenu.parse(folders);
                    $$("slideset_list").setValue(folders[0].id);
                    return $.get(config.BASE_URL + "/folder?parentType=folder&parentId=" + folders[0]._id);
                }).done(function(data){
                    var sFoldersMenu = $$("samples_list").getPopup().getList();
                    sFoldersMenu.clearAll();
                    sFoldersMenu.parse(data);
                    $$("samples_list").setValue(data[0].id);
                }).fail(function(data){
                    console.log(data);
                });
            }
        }
    };

    samples_dropdown = {
        view: "combo",
        placeholder: "Select Sample",
        id: "samples_list",
        options: {
            body: {
                template: "#name#"
            }
        },
        on: {
            "onChange": function(id) {
                $$("thumbnail_search").setValue("");
                if(id){
                    var item = this.getPopup().getBody().getItem(id);
                    var thumbs = $$("thumbnails_panel");
                    var url = config.BASE_URL + "/item?folderId=" + item._id;
                    thumbs.clearAll();
                    thumbs.load(url);
                }
            }
        }
    };

    thumbPager = {
        view: "pager",
        id: "thumbPager",
        animate: true,
        size: 10,
        group: 4
    };

     filter = {
        view: "search",
        id: "thumbnail_search",
        placeholder: "Search",
        on: {"onChange": searchItems}
    };

    //slides panel is the left panel, contains two rows 
    //containing the slide group dropdown and the thumbnails panel 
    slidesPanel = {
        header: "Slide Controls",
        body: {
            rows: [
                dropdown, samples_dropdown, filter, thumbPager, thumbnailsPanel
            ]
        },
        width: 220
    };

    function searchItems(keyword = null){
        url = config.BASE_URL + "/item?text=" + keyword;
        folderId = $$("samples_list").getValue();

        if(folderId){
            item = $$("samples_list").getPopup().getList().getItem(folderId);
            url = config.BASE_URL + "/item?folderId=" + item._id + "&text=" + keyword;
        }
        console.log(url);
        var thumbs = $$("thumbnails_panel");
        thumbs.clearAll();
        thumbs.load(url);
    }

    return {
        view: slidesPanel
    }
});