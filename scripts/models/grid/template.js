define(['AppModels'
      , 'models/grid/templateManager'
], function (app, template) {


    var Template = function () {
        var self = this;
        self.context = null; //set by the template
        self.text = ko.observable();

        self.then = function (fnc) {
            return fnc(self);
        }

        //Your Methods
        self.clickMe = function () {

            self.context.title(self.text());

        }

        self.afterRender = function (element, context) {

        }

    };

    return {
        get: function (params) {
            return new Template();
        }
    }
});
