define(['AppModels'], function (models) {


    var model = function (params, context) {
        var self = this;
        self.menuId = "#" + params;
        self.context = context; //set by the template
        self.menuElement = null;

        //If the module returns a get, then the model provides a then
        self.then = function (modelFnc) {
            modelFnc(self);
            //self.context.moduleID => is the element ID in html
        }

        self.init = function () {
            //Use jquery to track clicks... the li elements. for extra info
            //you can use html attributes such as data-action='blah'
            $("body").on("click", self.menuId + " ul.nav li", function (e) {
                var menu = $(this);
                if (menu.hasClass("dropdown")) {
                } else {
                    $(self.menuId + " ul.nav li").removeClass("active");
                    menu.addClass("active");
                    models.trigger(self, new models.message("MenuClick", menu, { action: menu.attr("data-action") || menu.text() }));
                }
            });

            $("body").on("click", self.menuId + " a.brand", function (e) {
                var menu = $(this);
                models.trigger(self, new models.message("MenuClick", menu, { action: 'home' }));
            });


        }

        self.afterRender = function (element, me) {
            $(self.menuId).fadeOut(0).fadeIn(500);
        }

    };

    return {
        //The template will pass the params and the context (Module)
        get: function (params, context) {
            var instance = new model(params, context);
            instance.init();
            return instance;
        }
    }

});
