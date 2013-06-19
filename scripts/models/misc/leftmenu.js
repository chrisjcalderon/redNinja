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
            var main = self.menu.add("Main", { template: 'misc/main', data: null, model: 'misc/main' });
            self.menu.add("Read View", { template: 'misc/demo3', data: null, model: 'misc/main' });

            self.menu.add("Page 1", { template: 'misc/demo1', data: null, model: '' });
            self.menu.add("Page 2", { template: 'misc/demo2', data: null, model: '' });

            main.select();
        }

        self.then = function (fnc) {
            return fnc(self.menu);
        }


    };

    return {
        get: function (params) {
            var m = new model(params);
            m.init();
            return m;
        }
    }

});
