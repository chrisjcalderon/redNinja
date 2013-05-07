define(['AppModels'], function (models) {


    var model = function (params, context) {
        var self = this;
        self.context = context;

        self.hello = ko.observable(params);

        self.myContext = ko.observable("")


        self.then = function (modelFnc) {
            modelFnc(self);
        }
        self.afterRender = function (element, me) {


            if (self.context) {
                var result = self.context.moduleID;

                result = result + "/" + self.context.container.section.sectionID;

                self.myContext(result);
            }

        }

    }

    return {
        //The template will pass the params and the context (Module)
        get: function (params, context) {
            var instance = new model(params, context);
            return instance;
        }
    }

});
