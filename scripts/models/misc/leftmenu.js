define(['AppModels'
        , 'models/grid/superfish'
], function (models, menu) {


    var model = function (params) {
        var self = this;
        self.context = null;
        self.params = params;

        self.menu = new menu("leftmenu");

        self.init = function () {
            self.menu.rootClass = "sf-menu sf-vertical";
            self.menu.add("Home", "Home");
            self.menu.add("Home1", "Home");
            self.menu.add("Home2", "Home");
            self.menu.add("Home3", "Home");
        }

        self.then = function (fnc) {
            return fnc(self.menu);
        }


    }

    return {
        get: function (params) {
            var m = new model(params);
            m.init();
            return m;
        }
    }

});
