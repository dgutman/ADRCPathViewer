define(["jquery", "webix"], function($) {

    function sldtClicked(id) {
        console.log("The slide data table was clicked at" + id);
        itemData = $$("slidelist").getItem(id);
        console.log(itemData);
        $("#imgThumb").attr("src", apiBase + '/v1/thumbnail/' + id);

        //The below links only work if Logged in..
        // $("#imgMacro").attr("src", apiBase + '/v1/macroimage/' + id);
        // $("#imgLabel").attr("src", apiBase + '/v1/labelimage/' + id);
    }

    apiBase = 'http://digitalslidearchive.emory.edu';

    header = {
        borderless: true,
        cols: [{
            view: "toolbar",
            height: 66,
            css: "toolbar",
            cols: [
                { view: "template", borderless: true, template: "<img src='img/CDSA_Slide_50.png' height='40'/>", width: 200 },
                { view: "template", template: "<h1>DSA UberSlide Sorter</h1>", borderless: true },
                {},
                { view: "template", borderless: true, template: "<img src='http://cancer.digitalslidearchive.net/imgs/Winship_06-2011/Winship_NCI_shortTag/horizontal/jpg_png/Winship_NCI_shortTag_hz_280.png' height='50'/>", width: 160 },
            ]
        }]
    };
    ///I may want to add back in the menu instead of {}----  

    //Top LEvel will have three panels
    //Top is a View Bar
    //with a left panel for info and a bigger panel that allows us to switch views between a tab
    //and data table view
    slideListDataTable_Columns = [
        { id: "id", title: "ID", hidden: true},
        { id: "thumbnail", header: "Thumbnail", width: 100, template: "<img src='" + apiBase + "/v1/thumbnail/#id#' height='40' width='80'/>" },
        { id: "label", header: ["Label", { content: "serverFilter" }], width: 300, editor:"text"},
        { id: "set", header: ["Slide Set", { content: "serverSelectFilter" }], width: 200 },
        { id: "width", sort: "server", header: "Width", width: 80 },
        { id: "height", sort: "server", header: "Height", width: 80 },
        { id: "size", sort: "server", header: "Size", width: 100 },
        { id: "path", header: ["Slide Path", { content: "serverFilter" }], width: 400, fillspace: true },
        { id: "originalResolution", header: "Ori. Res.", width: 50 },
        { id: "openSlideSuccess", header: "OpenSlide Success", width: 100 },
    ]

    wbx_SlideListDataTable = {
        rows: [  { cols: [{
            view: "pager",
            template: "{common.first()} {common.prev()} {common.pages()} {common.next()} {common.last()} (Total Slides #count#)",
            container: "paging",
            size: 20,
            group: 5,
            id: "gridPager"
        }, {view:"template", template:"Template1 Template 2"}]}, 
        {
            id: "slidelist",
            view: "datatable",
            columns: slideListDataTable_Columns,
            url: apiBase + "/v1/slides",
            select: true,
            navigation: true,
            pager: "gridPager",
            datafetch: 20,
            loadahead: 20,
            editable:true,
            editaction: "dblclick",
            on:{
                onAfterEditStop:function(state, editor){
                    if (state.value != state.old){
                        $.ajax({
                            url: apiBase + "/v1/slide/" + editor.row,
                            method: "PUT",
                            contentType: "application/json",
                            dataType: "json",
                            data: JSON.stringify({"label": state.value}),
                            success: function(slide){
                                console.log(slide);
                            },
                            error: function(jqXHR){
                                console.log(jqXHR);
                            }
                        });
                    }
                }
            }
        }]
    }


    wbx_SlideDataView = {
        rows: [
            {
                view: "pager",
                id: "pagerA",
                size: 50,
                group: 5,
                template: "{common.first()} {common.prev()} {common.pages()} {common.next()} {common.last()} (Total Slides #count#)",
                datafetch: 50,
                loadahead: 50
            }, 
            {
                view: "dataview",
                select: true,

                template: "<img src='" + apiBase + "/v1/thumbnail/#id#'  ><div class='webix_strong'>#fileName#</div>Size: #width# x #height#",
                type: {
                    height: 150
                },
                url: apiBase + "/v1/slides",
                pager: "pagerA"
            }
        ]
    }




    mainDataPanel = {
        view: "tabview",
        id: "wbxLeftPanel",

        cells: [

            { header: "GridView", body: { rows: [wbx_SlideListDataTable] } },

            {
                header: "DataTableView",
                body: {
                    rows: [{ template: "Controls could go here", height: 20 }, { view: 'resizer' }, wbx_SlideDataView]
                }
            },
            { header: "About", body: { id: "about", content: "about_text", } },
        ],
        tabbar: {
            on: {
                onAfterTabClick: function(id) {
                    webix.message(id)
                }
            }
        }
    };

    metaImageViewer = { view: "template", "content": "dv_imageReview", width: 200 };

    RawSlideLayout = {
        container: "main_layout",

        id: "mylayout",
        type: "space",
        rows: [
            header, //here you place any component you like

            { view: "resizer" },
            { cols: [metaImageViewer, mainDataPanel], fillspace: true }
        ]
    }

    webix.ready(function() {
        webix.ui(RawSlideLayout);
    });
});
