define(['AppManager', 'AppModels'
    
   
], function (app, models) {


    var modelName = 'login';
    var model = function () {
        var self = this;
        self.showError = ko.observable(false);
        self.userId = ko.observable("");
        self.userPwd = ko.observable("");

        self.login = function () {
            window.location = "dashboard.html";
        }
        self.forgot = function () {
            toastr.error("forgot");
            self.showError(true);
        }


        self.showModule = function () {
            $(".initialState").removeClass();
        }

        self.load = function () {
            ko.applyBindings(self);
            self.showModule();

        }
        self.onInit = function () {

        }
    }

    //Registers the model with the app... if ya want da'
    models.register(modelName, new model());

});

