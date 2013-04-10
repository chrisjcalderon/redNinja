define([], function () {
    var SubMenu = [
         { title: "Security Settings",  type:"sm1",items:null },
         { title: "Chat and PMs",  type:"sm2" ,items:null},
         { title: "Search Options",  type:"sm3" ,items:null},
         { title: "Moderators",  type:"sm4" ,items:null},
         { title: "Upload Options",  type:"sm5" ,items:null},
         { title: "Download Options",  type:"sm6" ,items:null},
         { title: "Emails",  type:"sm7" ,items:null},
         { title: "More",  type:"sm8",
            items:[
                { title: "Option 1",  type:"sm7" },
                { title: "Option 2",  type:"sm3" },
                { title: "Option 3",  type:"sm6" },
                { title: "Option 4",  type:"sm7" },
            ]
         },
         { title: "Christian",  type:"sm7" ,items:null}

    ];


    return SubMenu;

});

