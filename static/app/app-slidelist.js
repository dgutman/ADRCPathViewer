define(["jquery","webix"], function($) {


    function sldtClicked(id)
        {
            console.log("The slide data table was clicked at"+id);
            itemData = $$("slidelist").getItem(id);
            console.log(itemData);
            $("#imgThumb").attr("src", apiBase+'/v1/thumbnail/' + id);
            $("#imgMacro").attr("src", apiBase+'/v1/macroimage/' + id);
            $("#imgLabel").attr("src", apiBase+'/v1/labelimage/' + id);
        }

    apiBase = 'http://digitalslidearchive.emory.edu:5080';

        header = {borderless: true, cols: [{
            view:"toolbar", height:66, css: "toolbar",
                cols:[
                    {view: "template", borderless:true, template: "<img src='img/CDSA_Slide_50.png' height='40'/>", width: 200},
                    {view: "template", template: "<h1>DSA UberSlide Sorter</h1>", borderless:true},
                    {},
                    {view: "template", borderless:true, template: "<img src='http://cancer.digitalslidearchive.net/imgs/Winship_06-2011/Winship_NCI_shortTag/horizontal/jpg_png/Winship_NCI_shortTag_hz_280.png' height='50'/>", width: 160},
                ]
            }]
        };
        ///I may want to add back in the menu instead of {}----  

    //Top LEvel will have three panels
    //Top is a View Bar
    //with a left panel for info and a bigger panel that allows us to switch views between a tab
    //and data table view
    slideListDataTable_Columns = [
        { id: "thumbnail", header: "Thumbnail", width: 100, template: "<img src='" + apiBase +"/v1/thumbnail/#id#' height=30 width=80/>" },
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
        url: apiBase+ "/v1/slides",
        select: true,
        navigation: true,
        pager: {
            template: "{common.first()} {common.prev()} {common.pages()} {common.next()} {common.last()} (Total Slides #count#)",
            container: "paging",
            size: 20,
            group: 5
        },
        datafetch: 20,
        loadahead: 20,
        on: { "onItemClick": sldtClicked },        
    }


    wbx_SlideDataView = {
    view:"dataview",
    select: true,

    template:"<img src='"+apiBase+"/v1/thumbnail/#id#' ><div class='webix_strong'>#fileName#</div> Size: #width# x #height#",
    type:{
        height:150
    },
    url: apiBase+ "/v1/slides",
     pager: {
            template: "{common.first()} {common.prev()} {common.pages()} {common.next()} {common.last()} (Total Slides #count#)",
            
            size: 20,
            group: 5
        },
        datafetch: 20,
        loadahead: 20,
    }




    mainDataPanel = {
        view: "tabview",
        id: "wbxLeftPanel",
        cells: [

            { header: "GridView", body: { rows: [wbx_SlideListDataTable] } },

            {
                header: "DataTableView",
                body: {

                    rows: [{ template: "Controls could go here" }, { view: 'resizer' },  wbx_SlideDataView]
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

    metaImageViewer = { view: "template", "content": "dv_imageReview", height: 200 };

    RawSlideLayout = {
        container: "main_layout",
        id: "mylayout",
        type: "space",
        rows: [
            header, //here you place any component you like
            metaImageViewer,
            { view: "resizer"},
            mainDataPanel
        ]
    }

    webix.ready(function() {
        webix.ui(RawSlideLayout);
    });
});
