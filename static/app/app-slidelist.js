define(["webix"], function() {


    //Top LEvel will have three panels
    //Top is a View Bar
    //with a left panel for info and a bigger panel that allows us to switch views between a tab
    //and data table view
    RawSlideLayout = {
        container: "main_layout",
        id: "mylayout",
        type: "space",
        rows: [
            {},
            { template: "row 1" }, //here you place any component you like
            { template: "row 2" },
           
        
        
            cols: [
                wbx_SlideListDataTable,
                {},
                { template: "col3" }
            ],
        ]
    
}



wbx_SlideListDataTable = {

    id: "slidelist",
    view: "datatable",
    columns: [
        { id: "thumbnail", header: "Thumbnail", width: 100, template: "<img src='/thumbnail#slidePath#' height=30 width=80/>" },
        { id: "fileName", header: ["File Name", { content: "serverFilter" }], width: 300 },
        { id: "slideSet", header: ["Slide Set", { content: "serverSelectFilter" }], width: 200 },
        { id: "width", sort: "server", header: "Width", width: 80 },
        { id: "height", sort: "server", header: "Height", width: 80 },
        { id: "fileSize", sort: "server", header: "Size", width: 100 },
        { id: "slidePath", header: ["Slide Path", { content: "serverFilter" }], width: 400, fillspace: true },
        { id: "orig_resolution", header: "Ori. Res.", width: 50 },
        { id: "openSlideSuccess", header: "OpenSlide Success", width: 100 },
    ],
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

webix.ready(function() {
    webix.ui(RawSlideLayoutss);
});
});