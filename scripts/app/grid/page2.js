define(['AppManager'
    , 'AppModels'
    , 'models/grid/templateManager'
    , 'models/grid/menu'
    , 'models/grid/superfish'
], function (app, models, template, ignore, menu) {

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
                { name: 'navigation', positions: 1 },
                { name: 'maintop', positions: 4 },
                { name: 'breadcrumb', positions: 1 },
                { name: 'footer', positions: 3 },
                { name: 'copyright', positions: 1 }
            ]
            );
            self.loadTest();


            if (template.content.sidebarA.hasModules()) {
                template.content.sidebarA.module[0].css = "box1";
                template.content.sidebarA.module[1].css = "title2";
            }
            if (template.content.sidebarB.hasModules()) {
                template.content.sidebarB.module[0].css = "box1";
                template.content.sidebarB.module[1].css = "box2";
            }


            if (template.section["navigation"].positions[0].hasModules()) {
                template.section["navigation"].positions[0].module[0].showTitle(false);
                template.section["navigation"].positions[0].module[0].setModel(test, "grid/superfish", "");
            }

        };

        self.debug = function () {


            $("body").on("mouseenter", "[class^=rt-grid]", function (event) {
                var module = ko.dataFor(event.target);
                if (module) {
                    var info = "";
                    info = "Title: " + module.name + "</br>";
                    //info += "css: " + module.css || '' + "</br>";
                    toastr.info(info, "<h4>" + module.name + "</h4>");
                }
            });

        };
        self.load = function () {
            ko.applyBindings(self);
        };

        self.loadTest = function () {

            var sections = template.instance.sections();
            template.instance.removeSection("drawer");
            for (var s = 0; s < sections.length; s++) {
                var section = sections[s];
                for (var p = 0; p < section.positions.length; p++) {
                    var position = section.positions[p];
                    position.addModule(new template.Module("Module for " + position.name, "", "", null));
                }
            }

            var mainBody = template.content;
            mainBody.sidebarA.addModule(new template.Module("Module for Sidebar-A", "", "", null));
            mainBody.sidebarA.addModule(new template.Module("Module for Sidebar-A", "", "", null));

            mainBody.component.addModule(new template.Module("THE COMPONENT", "", "/grid/article", "2", "Hi"));

            for (var p = 0; p < mainBody.contentTop.length - 1; p++) {
                mainBody.contentTop[p].addModule(new template.Module("Module for CT-" + p, "", "", null));
                mainBody.contentBottom[p].addModule(new template.Module("Module for CB-" + p, "", "", null));
            }

            mainBody.component.modules()[0].init();

        }
    };
    models.register(modelName, new model());


});                                   //End Closure