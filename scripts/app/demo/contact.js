define(['AppManager', 'AppModels', 'text!content/file1.txt'], function (app, models, content) {
    var modelName = 'contact';
    var model = function () {
        var self = this;

        self.appTitle = ko.observable("Contact Model");
        self.fromParent = ko.observable("");
        self.startDate = ko.observable(new Date());
        self.openDialog = ko.observable(false);
        self.contact = ko.observable({ name: "Christian Calderon" });
        self.dialogContent = ko.observable(content);

        self.callBackOnMsg = null;

        self.openDialogHandler = function (sender, msg, callback) {
            self.openDialog(true);
            self.callBackOnMsg = callback;
        }

        self.changeContent = function () {
            models.loadFile("file2.txt").then(function (content) {
                self.dialogContent(content);
            });

        }
        self.closeDialog = function () {
            if (self.openDialog()) {
                self.openDialog(false);
                if (self.callBackOnMsg) self.callBackOnMsg(self);
                models.loadFile("file1.txt").then(function (content) {
                    self.dialogContent(content);
                });
            }

        }

        self.onInit = function () {
            var subcription = models.on("OpenContactDialog").call(self.openDialogHandler);
            //models.unsubscribe(subcription);
            models.get('baseModel').firstName.subscribe(function (value) {
                self.fromParent(value);
                models.sendMsg(self, models.message("AddItem", self, { value: value }));
            });
        }

        self.load = function (container) {
            ko.applyBindings(self, document.getElementById(container || "contactModule"));
        }
    }

    myApp.models.register(modelName, new model());

});
