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

            template.section["maintop"].setLayout(2, [3, 9]);
            
            //assigns a template. Since there is no specific model for it, then assings this model as the data/model
            //In the case of the header, it just binds the headerTitle
            template.getSection("top").positions[0].addModule(new template.Module("", "misc/header", "", null)).data(self).showTitle(false);
            template.getSection("top").positions[0].addModule(new template.Module("", "grid/superfish", "", null)).data(test).showTitle(false);
           
            template.getSection("maintop").positions[0].addModule(new template.Module("", "misc/side-bar", "", null,"Options"));
            template.getSection("maintop").positions[1].addModule(new template.Module("", "misc/main", "misc/main", null)).showTitle(false);
            template.getSection("footer").positions[0].addModule(new template.Module("", "", "", null)).showTitle(false);

        }

        self.load = function () {

            ko.applyBindings(self);
        }

        self.addModules = function () {

            var sections = template.instance.sections();
            for (var s = 0; s < sections.length; s++) {
                var section = sections[s];
                for (var p = 0; p < section.positions.length; p++) {
                    var position = section.positions[p];
                    position.addModule(new template.Module("Module for " + position.name, "", "", null));
                }
            }

        }


    }
    models.register(modelName, new model());


});                                             