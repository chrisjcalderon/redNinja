define(['AppManager', 'AppModels',
        'models/demo/dialog',
        'models/demo/clientmodel',
        'models/demo/contactsmodel'
        ], function (app, models, dialogModel, Client, Contact) {

            var modelName = 'baseModel';
            var model = function () {
                var self = this;
                self.appTitle = "THIS IS THE HEADER";

                self.firstName = ko.observable("type something here...").extend({ throttle: 500 });
                self.initialized = ko.observable(false); //sub models loaded
                self.counter = 0;
                self.dialog = dialogModel;
                self.modules = ko.observableArray([]);
                self.clients = ko.observableArray([]);
                self.vmmodels = ko.observableArray([]);

                self.addClient = function () {
                    var c = new Client();
                    var l = self.clients().length;
                    c.name("hi Name " + l);
                    c.address("Address " + l);
                    self.clients.push(c);

                };

                self.init = function () {
                    self.initialized(true);
                    $("#dynamicmodule1").load("/submodel.html", function () {

                    });
                    $("#dynamicmodule2").load("/contact.html"); //no callback needed

                };

                self.getModel = function () {
                    models.loadModel("/demo/dialog").then(function (dialog) {
                        toastr.info(dialog.title());
                    });
                };

                //KO View Model Handling
                self.removeVM = function (vm, element) {
                    $(element).fadeOut("slow", function () {
                        self.vmmodels.remove(vm);
                    }, 1000);
                };

                self.addVm = function (id, template, data) {
                    id = "dynKo" + id;
                    data.unloadMe = function (event) {
                        $(data.containerElement).prev("div").fadeOut("slow", function () {
                            self.vmmodels.remove(vm);
                        });
                    };
                    var vm = { name: id, id: id, template: template, data: data };
                    self.vmmodels.push(vm);
                };

                self.onVmRender = function (element, model) {
                    setTimeout(function () {
                        model.containerElement = element;
                        $(element).prev("div").effect("highlight", { color: "#2d7ba6" }, 1000);
                    });
                };
                //End KnockOut View Model Handling

                //Adds API and KI VMs
                self.clickButton = function () {
                    var id = "dyn" + (self.counter++);
                    $("#dynContainer").append("<div id='" + id + "' style='float:left'></div>");

                    //Using API
                    models.loadViewModel(id, "/demo/test", "demo/contactsmodel").then(function (obj) {
                        setTimeout(function () {
                            $("#" + obj._viewModel.container + " > div").effect("highlight", { color: "#2d7ba6" }, 1000);
                        }, 50);
                    });
                    //Using KO
                    self.addVm(self.counter++, "/demo/test", new Contact());
                };


                //Sends an message Open Contact
                self.openContact = function () {
                    if (!models.isDefined('contact')) {
                        toastr.error("Module not yet loaded...click load modules");
                        return;
                    }
                    models.sendMsg(self, models.message("OpenContactDialog"), function (result) {
                        //Deferred handling...
                        toastr.info("ACTION COMPLETED..." + result.startDate());
                    });
                };

                //Loads two COMPLETE submodels... nice
                self.loadModel = function () {
                    if (!self.initialized()) {
                        self.init();
                    }
                }

            };

            //The Model App... separated from the model...
            var modelApp = function () {
                var self = this;
                self.instance = null;

                self.handleMessage = function (sender, msg) {
                    switch (msg.msg) {
                        case "AddItem":
                            var value = msg.params.value;
                            var sub = models.get('submodel'); //Get the Model Controller, not the instance
                            if (sub) {
                                sub.addItem(value); //App AddItem
                            } else {
                                toastr.info("NOPE... sub model not ready...");
                            }
                            break;
                        default:
                            self.instance.modules.push(msg.params.name);
                            toastr.info("MSG: " + msg.msg + "/" + msg.params.name);
                    }
                };

                self.load = function () {
                    self.instance = new model();
                    models.on("OnNewModelLoad").receive(self.handleMessage);
                    models.on("AddItem").receive(self.handleMessage);
                    ko.applyBindings(self.instance);
                };
                self.onInit = function () {
                    models.log.info("OnInit for " + modelName);
                }


            };

            var oApp = new modelApp();
            models.register(modelName, oApp);
            return oApp;

        });
