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

        self.headerTitle = ko.observable("This is the header from the main app...");

        self.onInit = function () {
            var template = self.template;
            template.init();

            template.config([
                        { name: 'top', positions: 1 },
                        { name: 'maintop', positions: 2 },
                        { name: 'footer', positions: 1 }
                        ]
            );

            template.section["maintop"].setLayout(2, [2, 10]);

            template.getSection("top").positions[0].addModule(new template.Module("", "misc/header", "", null)).data(self).showTitle(false);
            template.getSection("top").positions[0].addModule(new template.Module("", "grid/superfish", "", null)).data(test).showTitle(false);

            template.getSection("maintop").positions[0].addModule(new template.Module("", "grid/superfish", "misc/leftmenu", null, "Sidebar"))._container.css("title1");
            template.getSection("maintop").positions[1].addModule(new template.Module("", "misc/main", "misc/main", null)).showTitle(false);

            template.getSection("footer").positions[0].addModule(new template.Module("", "", "", null)).showTitle(false);

            models.on("menuclick").receive(function (sender, e) {
                //the menu broadcasts click events if a handler is not set... the e is a message where e.obj is the menu itself (sender is the 
                //menu model)
                toastr.info("Got the menu click... " + e.obj.title);
                self.headerTitle("Header says you last clicked " + e.obj.title);
            });
        }

        self.load = function () {

            ko.applyBindings(self);
        }


    }
    models.register(modelName, new model());


});                                             