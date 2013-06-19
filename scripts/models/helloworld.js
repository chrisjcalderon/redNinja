define(['AppModels'], function (models) {

    //a basic model that returns a function constructor for HelloWorld
    var HelloWorldModel = function (params) {
        var self = this;
        self.context = null;
        self.params = params; //if you want to pass parameters to it...

        self.helloWorldText = ko.observable(params);
        self.names = ko.observableArray();

        self.remove = function (item) {
            self.names.remove(item)
        }


        self.addNew = function () {
            self.names.push({ name: "Name -- " + self.names().length });
        }

    };

    return {
        model: HelloWorldModel
    }
});
