define(['AppModels'], function (models) {


    var model = function (params) {
        var self = this;
        self.context = null;
        self.params = params; 

        self.helloWorldText = ko.observable(params);
        self.names = ko.observableArray();

        self.remove = function (item) {
            self.names.remove(item)
        }


        self.addNew = function () {
            self.names.push({ name: "Name -- " + self.names().length });
        }

    }

    /*note, there are other ways on which a model can be returned, one is:
        return {
        get: function (params) {
            return new HelloWorld(params);
        }
    }
    in this case, you must define a "then" function in your model and callback a function that is passed as the first parameter and pass yourself
    a basic example is... (note, you can also pass a promise)
      self.then = function (fnc) {
            return fnc(self);
        }
    */

    //in this case, the same model will be always returned!!  if you need new instances every time, then use the approach above :)
    return new model();

});
