define(['AppModels'
      , 'models/grid/templateManager'
], function (app, template) {


    var HelloWorld = function (yourName) {
        var self = this;
        self.context = null; //set by the template

        //if get is a non deferred then implement a simple return
        self.then = function (fnc) {
            return fnc(self);
        }

        //Your properties
        self.yourName = ko.observable(yourName);
        //Your Methods
        self.clickMe = function () {
            toastr.info("<h3>Hello " + self.yourName() + " from " + self.context.name + "<h3>Check the new title :)");
            self.context.title(self.yourName());
            self.context.container.css("title3");
           
            template.component.modules()[0].setParams(prompt("Article", 2));

            //ideally
            //template.component.module...
        }

        self.afterRender = function (element, context) {
           // toastr.warning("Sweet");
        }

    }

    //**** RULES OF ENGAGEMENT HAHA 
    //If get is a function, then it must return a deferred object
    //If is not a function, then it will be set as the view model
    //if no get is available, then whatever you return will be the view model
    //params: is alwways passed to a GET and only a GET
    return {
        get: function (params) {
            return new HelloWorld(params);
        }
    }
});
