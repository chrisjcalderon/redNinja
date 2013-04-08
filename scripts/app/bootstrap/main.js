define([
    'AppManager', 'AppModels', 'models/bootstrap/templateManager'
], function (app, models, template) {

    var modelName = 'gridTemplate';

    var model = function () {
        var self = this;
        self.template = template;

        self.onInit = function () {
            var template = self.template;
            template.init();

            template.config([
                        { name: 'drawer', positions: 1 },
                        //{ name: 'showcase', positions: 4 },
                        { name: 'navigation', positions: 1 },
                        { name: 'maintop', positions: 4 },
                        { name: 'breadcrumb', positions: 1 },
                        { name: 'mainbottom', positions: 2 },
                        { name: 'footer', positions: 3 },
                        { name: 'copyright', positions: 1 }
                        ]
            );

            self.loadTest();
            template.section["mainbottom"].setLayout(2, [3, 9]);
            template.getSection("mainbottom").positions[1].module[0].setModel( { formID: 'form' }, "bootstrap/form").showTitle(false);
            template.getSection("navigation").positions[0].module[0].template( "bootstrap/navbar").showTitle(false);
          
            template.getSection("mainbottom").positions[0].addModule(new template.Module("Name of Title", "", "", null));
            template.getSection("mainbottom").positions[0].addModule(new template.Module("Name of Title", "", "", null));
        }

        self.load = function () {

            ko.applyBindings(self);
        }

        self.loadTest = function () {

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


});   //  End Closure