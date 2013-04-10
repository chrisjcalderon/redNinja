define(['AppManager', 'AppModels'], function (app, models,dialogModel ) {
    var modelName = 'submodel';
    //define(modelName);

    //The Model Itself
    var model = function () {
        var self = this;
        self.items = ko.observableArray([]);
        self.appTitle = ko.observable("This is the SubModel");



        self.addItem = function (value) {
            if(value === self) {
                var item = models.get('baseModel').firstName();
                self.items.push({ text: item });
            }
            else {
                self.items.push({ text: value });
            }
        }

        self.removeItem = function (item) {
            self.items.remove(item);
        }

        self.onInit = function() {
            
        }

        self.load = function (container) {
            ko.applyBindings(self, document.getElementById(container || "arrayDemo"));
        }

    }

    models.register(modelName, new model());

});
