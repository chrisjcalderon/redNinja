define([
    'AppManager',
    'AppModels',
    'require',
    'models/templateManager',
    'models/router',
    'js!bootstrap/bootstrap.js'
], function (app, models, require, templates, router) {

    var modelName = 'SPAAppDemo';

    var model = function () {
        var self = this;

        self.template = templates.instance;
        self.router = new router();
        self.isAuthenticated = ko.observable(false);

        self.container = null;
        self.page = ko.observable("spa/default");


        models.on("MenuClick").receive(function (sender, event) {
            toastr.info("Click menu " + event.params.action);
        });

        models.on("Login").receive(function (sender, event) {
            //container.setModel(self, "ads/main", "");
            //template.getSection("main").positions[1].addModule(new templates.Module("rightnav", "ads/rightnav", "", "", "")).showTitle(false);
            self.isAuthenticated(true);

        });

        self.move = function (model) {
            self.template.move(model.context, "main", 1);
        }
        self.onInit = function () {
            var template = self.template;

            template.init();
            template.config([
                        { name: 'header', positions: 1 },
                        { name: 'navigation', positions: 1 },
                        { name: 'main', positions: 2 },
                        { name: 'main-top', positions: 2 },
                        { name: 'main-bottom', positions: 2 },
                        { name: 'utiliy', positions: 1} //hidden stuff...
                        ]
            );

            template.section["main"].setLayout(3, [3, 6, 3]);
            template.section["main"].setLayout(2, [8, 4]);

            template.getSection("navigation").positions[0].addModule(new templates.Module("menubar", "spa/menubar", "spa/menubar", "menubar", "")).showTitle(false);


            self.container = template.getSection("main").positions[0].addModule(new templates.Module("main", "", "", "", ""));
            self.container.showTitle(false);

            template.getSection("main-top").positions[0].addModule(new templates.Module("myname", "spa/moveModule", "spa/moveModule", " top here ", "Top")).showTitle(true);
            template.getSection("main-bottom").positions[0].addModule(new templates.Module("myname", "spa/moveModule", "spa/moveModule", " bottom here ", "Top")).showTitle(true);


            self.defineRouter();

        }

        self.defineRouter = function () {

            define("AppRouter", self.router);


            self.router.addRoute("generic", '{section}/:view:/:id:', function (section, view, id) {

                var viewName = "";

                //models.trigger(self, new models.message("RouteChange", self, { route: section }));

                //normalize view.
                //folder->section
                viewName = "spa/" + section;
                if (view) {
                    viewName = viewName + "/" + view;
                } else if (section !== 'home') {
                    viewName = viewName + "/home";
                }

                self.container.setModel(self, viewName, id)

                //the rules for the section. it can only be one of those below
            }, { section: ['home', 'dashboard', 'users', 'register', 'login', 'logout'] });


            self.router.onInvalidRoute(function (request, data) {
                self.container.setModel(self, "template/notfound404");
            })

            //Init and go home
            self.router.init();
            self.router.go("home");

        }

        self.load = function () {
            ko.applyBindings(self);
        }

        self.afterRender = function (element) {
            if (element[0].className == 'infuser-loading') {
                return;
            }
            //In case you need to do something here...

        }

        self.onContainerRender = function (element, module) {

            if (module.template() == 'template/notfound404') {
                //$("#" + module.moduleID).fadeOut(100).show("shake", 1500);
                return;
            }
        }


    } //End Model

    models.register(modelName, new model());


});      //End Closure