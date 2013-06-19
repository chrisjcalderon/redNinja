define(['AppManager'
    , 'AppModels'
    , 'models/grid/templateManager'
    , 'models/grid/superfish'
// 'models/grid/megamenu'
], function (app, models, template, menu) {

    var modelName = 'gridTemplate';

    var test = new menu("theMenu");
    test.buildTest();

    var model = function () {
        var self = this;
        self.template = template;

        self.onInit = function () {
            var template = self.template;
            template.init();

            self.template.config([
                { name: 'drawer', positions: 1 },
                { name: 'showcase', positions: 4 },
                { name: 'navigation', positions: 1 },
                { name: 'maintop', positions: 4 },
                { name: 'breadcrumb', positions: 1 },
                { name: 'mainbottom', positions: 4 },
                { name: 'footer', positions: 3 },
                { name: 'copyright', positions: 1 }
            ]
            );

            self.loadTest();

            template.getSection("showcase").position(0).css("box2");
            template.getSection("showcase").position(1).css("box4 title4");
            template.getSection("showcase").position(2).css("box3");
            template.getSection("showcase").position(3).css("box4");

            template.getSection("drawer").position(0).module[0].set({ data: "<img src='/styles/grid/template/images/banner2.jpg' width=100%>", css: "", showTitle: false });

            template.section["maintop"].positions[1].module[0].setModel("grid/base", "grid/base", "Chris");
            template.section["maintop"].positions[2].module[0].setModel("grid/base", "grid/base", "Calderon");
            template.section["maintop"].positions[1].module[0].title("Demo Module");
            template.section["maintop"].positions[2].module[0].title("Demo Module");
            template.section["maintop"].positions[0].module[0].title("Clock Module");

            template.section["footer"].setLayout(3, [2, 8, 2]);
            template.section["footer"].positions[0].module[0].showTitle(false);
            template.section["footer"].positions[1].module[0].showTitle(false);
            template.section["footer"].positions[2].module[0].showTitle(false);
            template.section["footer"].positions[0].module[0].data("<div class='approved'>I'm 2</div>");
            template.section["footer"].positions[1].module[0].data("<div class='notice'><span class='text-icon info'>&nbsp;</span>This footer has a custom layout of 2,8,2</div>");
            template.section["footer"].positions[2].module[0].data("<div class='approved'>I'm 2</div>");
            template.section["footer"].positions[0].css("box1");
            template.section["footer"].positions[1].css("box2");
            template.section["footer"].positions[2].css("box1");

            template.getSection("mainbottom").position(0).css("box1");
            template.getSection("mainbottom").position(1).css("title2");
            template.getSection("mainbottom").position(2).css("box3");
            template.getSection("mainbottom").position(3).css("title3");

            template.section["showcase"].positions[0].module[0].showTitle(false);

            if (template.section["navigation"].positions[0].hasModules()) {
                template.section["navigation"].positions[0].module[0].showTitle(false);
                template.section["navigation"].positions[0].module[0].setModel(test, "grid/superfish", "");
            }

        };

        self.load = function () {

            ko.applyBindings(self);
        };

        self.loadTest = function () {

            var sections = template.instance.sections();
            for (var s = 0; s < sections.length; s++) {
                var section = sections[s];
                for (var p = 0; p < section.positions.length; p++) {
                    var position = section.positions[p];
                    position.addModule(new template.Module("Module for " + position.name, "", "", null));
                }
            }

            var mainBody = template.content;
            for (var x = 1; x < 5; x++) {
                var m = new template.Module("Sidebar-a", "", "", null);
                m.css = "title" + x;
                mainBody.sidebarA.addModule(m);
                var m = new template.Module("Sidebar-b", "", "", null);
                m.css = "box" + x;
                mainBody.sidebarB.addModule(m);
            }

            //mainBody.sidebarC.addModule(new template.Module("Module for Sidebar-C", "", "", null));
            //mainBody.sidebarC.addModule(new template.Module("Module for Sidebar-C", "", "", null));
            mainBody.component.addModule(new template.Module("THE COMPONENT", "", "/grid/article", "3", "Hi"));

            for (var p = 0; p < mainBody.contentTop.length; p++) {
                mainBody.contentTop[p].addModule(new template.Module("Module for CT-" + p, "", "", null));
                mainBody.contentBottom[p].addModule(new template.Module("Module for CB-" + p, "", "", null));
            }

            //self.loadModules();

            mainBody.component.modules()[0].init();

        };

        self.loadModules = function () {
            models.loadJson("/scripts/data/modules.php").then(function (data) {
                //alert(data.length);
                for (var x = 0; x < data.length; x++) {
                    var m = new template.Module("sidebar-a", "", "", "", data[x].title);
                    m.data(data[x].content);
                    template.content.sidebarA.addModule(m);
                    //alert(data[x].title);
                    // mainBody.sidebarB.addModule(new template.Module("Module for Sidebar-B", "", "", null));
                }
            });
        }
    };
    models.register(modelName, new model());


});
                                             //End Closure