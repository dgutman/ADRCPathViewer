define(["webix"], function() {


    //Top LEvel will have three panels
    //Top is a View Bar
    //with a left panel for info and a bigger panel that allows us to switch views between a tab
    //and data table view
    slideListDataTable_Columns = [
        { id: "thumbnail", header: "Thumbnail", width: 100, template: "<img src='/v1/thumbnail/#id#' height=30 width=80/>" },
        { id: "fileName", header: ["File Name", { content: "serverFilter" }], width: 300 },
        { id: "slideSet", header: ["Slide Set", { content: "serverSelectFilter" }], width: 200 },
        { id: "width", sort: "server", header: "Width", width: 80 },
        { id: "height", sort: "server", header: "Height", width: 80 },
        { id: "fileSize", sort: "server", header: "Size", width: 100 },
        { id: "slidePath", header: ["Slide Path", { content: "serverFilter" }], width: 400, fillspace: true },
        { id: "orig_resolution", header: "Ori. Res.", width: 50 },
        { id: "openSlideSuccess", header: "OpenSlide Success", width: 100 },
    ]

    wbx_SlideListDataTable = {

        id: "slidelist",
        view: "datatable",
        columns: slideListDataTable_Columns,
        url: "/v1/slides",
        select: true,
        navigation: true,
        pager: {
            template: "{common.first()} {common.prev()} {common.pages()} {common.next()} {common.last()} (Total Slides #count#)",
            container: "paging",
            size: 20,
            group: 5
        },
        datafetch: 20,
        loadahead: 20
    }

    mainDataPanel = {
        view: "tabview",
        id: "wbxLeftPanel",
        cells: [{
                header: "DataTableView",
                body: {

                    rows: [{ template: "Controls could go here" }, { view: 'resizer' }, { template: "DataView Goes Here" }]
                }
            },
            { header: "About", body: { id: "about", content: "about_text", } },
            { header: "GridView", body: { rows: [wbx_SlideListDataTable] } }
        ],
        tabbar: {
            on: {
                onAfterTabClick: function(id) {
                    webix.message(id)
                }
            }
        }
    };

    dgHeader = { "template": "dgHeader", height: 150 };

    RawSlideLayout = {
        container: "main_layout",
        id: "mylayout",
        type: "space",
        rows: [
            dgHeader, //here you place any component you like
            mainDataPanel
        ]

    }


    webix.ready(function() {
        webix.ui(RawSlideLayout);
    });
});
