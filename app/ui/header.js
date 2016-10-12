define("ui/header", function() {

    var menu = {
        view: "menu",
        width: 400,
        data: [{
            id: "1",
            value: "TCGA Resources",
            submenu: [{
                value: "TCGA Analytical Tools",
                href: "https://tcga-data.nci.nih.gov/docs/publications/tcga/",
                target: "_blank"
            }, ]
        }, {
            id: "2",
            value: "Help",
            submenu: [{
                value: "About the CDSA"
            }, {
                value: "Repository Stats"
            }]
        }, {
            id: "3",
            value: "Share Link"
        }],
        type: {
            height: 55
        },
        css: "menu",
        on: {
            onItemClick: function(id) {
                if (id == 3)
                    $$("share_link_window").show();
            }
        }
    };

    header = {
        borderless: true,
        cols: [{
            view: "toolbar",
            height: 66,
            css: "toolbar",
            cols: [{
                    view: "template",
                    borderless: true,
                    template: "<img src='img/CDSA_Slide_50.png' height='40'/>",
                    width: 200
                }, {},
                menu, {
                    view: "template",
                    borderless: true,
                    template: "<img src='http://cancer.digitalslidearchive.net/imgs/Winship_06-2011/Winship_NCI_shortTag/horizontal/jpg_png/Winship_NCI_shortTag_hz_280.png' height='50'/>",
                    width: 160
                },
            ]
        }]
    };

    return {
        view: header
    }
});