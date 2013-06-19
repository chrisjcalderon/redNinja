define(['AppModels'], function (models) {


    var model = function (params, context) {
        var self = this;
        self.params = params;
        self.context = context; //set by the template

        self.templates = ["bootstrap/ninja1", 'bootstrap/ninja2'];
        self.current = 0;
        self.modelValue = ko.observable();

        //If the module returns a get, then the model provides a then
        self.then = function (modelFnc) {
            modelFnc(self);
            self.context.template(self.templates[self.current]);
        }

        self.change = function () {
            self.current++;
            if (self.current > 1) {
                self.current = 0;
            }

            self.context.template(self.templates[self.current]);

        }
    };

    return {
        //The template will pass the params and the context (Module)
        get: function (params, context) {
            return new model(params, context);
        }
    }

});
