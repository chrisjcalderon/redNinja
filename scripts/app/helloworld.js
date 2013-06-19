define(['AppManager',
        'AppModels',
        'models/helloworld'
], function (app, models, myHelloWorldModel) {


    var modelName = 'helloWorld';

    var model = function () {
        var self = this;
        self.myModel = new myHelloWorldModel.model("Hey buddy...");

        self.load = function () {
            toastr.info("and now loaded... I'm ready!");
            ko.applyBindings(self.myModel);

        };
        self.onInit = function () {
            models.on("OnNewModelLoad").receive(function () {
                toastr.info("hey the controller sent me a msg... I could do some stuff here too");
            });
            toastr.info("Hi, I was initialized...");
        }
    };

    //Registers the model with the app if you want init and load to be called
    //and possible participate in the message model between other modules/models
    models.register(modelName, new model());

});

