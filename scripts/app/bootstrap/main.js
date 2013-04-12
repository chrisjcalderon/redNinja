define([
    'AppManager', 'AppModels', 'models/bootstrap/templateManager'
    , 'models/bootstrap/contact', 'models/bootstrap/contactDialog'
    , 'models/bootstrap/lists'
], function (app, models, template, contact, contactDialog, listModel) {

    var modelName = 'gridTemplate';

    var model = function () {
        var self = this;
        self.template = template;
        self.contactDialog = new contactDialog();
        self.contacts = ko.observableArray();
        self.listModel = new listModel();

        //for the remove contact... this could be yet in another module :)
        self.remove = function (contact) {
            self.contacts.remove(contact);
        }

        //the other modal...
        self.saveChanges = function () {
            toastr.info("Changes saved...");

        }
        self.clicktoggle = function (model, event) {
            var action = $(event.target).attr("action");
            toastr.info("Clicked " + action);
        }

        //captures the dialog events...
        models.on("ContactDialogEvent").receive(function (sender, event) {
            if (event.obj.isNew() && event.params.action == 'save') {
                var contact = event.obj.clone();
                contact.isNew(false);
                self.contacts.push(contact);
            }
            toastr.info(event.params.action + " new(" + event.obj.isNew() + ")  / " + event.obj.firstName());

        });


        self.onInit = function () {
            var template = self.template;
            template.init();

            template.config([
                        { name: 'drawer', positions: 1 },
                        { name: 'navigation', positions: 1 },
                        { name: 'maintop', positions: 3 },
                        { name: 'breadcrumb', positions: 1 },
                        { name: 'mainbottom', positions: 2 },
                        { name: 'footer', positions: 3 },
                        { name: 'copyright', positions: 1 },
                        { name: 'dialogs', positions: 1} //hidden stuff
                        ]
            );

            self.loadTest(self.template.instance);
            template.section["drawer"].setLayout(2, [2, 10]);
            template.getSection("drawer").positions[0].module[0].showTitle(false).data("<h3>Twitter Bootstrap Demo</h3>");
            //template.getSection("maintop").positions[0].module[0].showTitle(false).data("<img class='redNinja img-polaroid' src='/images/NinjaRed.jpg'>");

            template.getSection("maintop").positions[0].module[0].showTitle(false).setModel('bootstrap/ninja');

            template.section["mainbottom"].setLayout(2, [3, 9]);
            template.getSection("mainbottom").positions[1].module[0].template("bootstrap/main").data(self).showTitle(false);
            template.getSection("navigation").positions[0].module[0].template("bootstrap/navbar").showTitle(false);

            template.getSection("mainbottom").positions[0].addModule(new template.Module("", "bootstrap/leftnav", "", null)).showTitle(false);

            self.listModel.available = self.contacts;
            template.getSection("mainbottom").positions[1].addModule(new template.Module("", "bootstrap/lists", self.listModel, null)).showTitle(false);

            template.getSection("mainbottom").positions[0].module[0].title("Dialog");
            template.getSection("mainbottom").positions[0].module[0].template("bootstrap/dialog").showTitle(true).data(self);

            template.getSection("dialogs").positions[0].module[0].template("bootstrap/contactDialog").showTitle(false).data(self.contactDialog);

            for (var x = 0; x < 5; x++) {
                self.contacts.push(new contact("Contact " + x, "LastName"));
            }

            /* want to use as subtemplates? - easy! 
            var template2 = new template.model();
            template2.init();
            template2.configSections([
            { name: 'main', positions: 4 }
            ]);
            self.loadTest(template2);
            template.getSection("drawer").positions[0].module[0].template("bootstrap/grid-full").data(template2);
            */
        }

        self.load = function () {

            ko.applyBindings(self);
        }

        self.loadTest = function (tp) {

            var sections = tp.sections();
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


});                                    //  End Closure