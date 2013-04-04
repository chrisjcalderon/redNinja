define(['AppModels', 'require'], function (app, require) {

    var MenuItem = function (title, action, parent) {
        var self = this;

        self.title = title;
        self.action = action;
        self.parent = parent;
        self.menus = new Array();
        self.selected = ko.observable(false);
        self.current = null;

        self.add = function (title, action) {
            var menu = new MenuItem(title, action, self);
            self.menus.push(menu);
            return menu;
        }

        self.hasMenus = function () {
            return self.menus.length > 0;
        }

        self.select = function (menu) {
            if (self.parent) {
                self.parent.current.selected(false);
            }
            self.selected(true);
            self.parent.current = self;
        }
        return self;
    }

    var MenuModel = function (params) {
        var self = this;
        self.context = null; //set by the template
        self.params = params; //i.e. menu title
        self.parent = null;
        self.current = null;
        self.menus = new Array()
        self.menuId;
        self.rootClass = "sf-menu";
        self.skin = 'black';

        if (typeof params == "string") {
            self.menuId = params;
        }

        self.add = function (title, action) {
            var menu = new MenuItem(title, action, self);
            self.menus.push(menu);
            return menu;
        }

        self.buildTest = function () {
            for (var x = 0; x < 5; x++) {
                var menu = self.add("Menu " + x, "action-" + x, self);
                var ym = parseInt(Math.random() * 5) + 1;
                for (var y = 0; y < ym; y++) {
                    var menu2 = menu.add("sub-item " + x + "-" + y, "action-" + x + "-" + y, menu);
                    for (z = 0; z < 3; z++) {
                        menu2.add("sub-sub-item...", "action-" + x, menu2);

                    }
                }
                //add sub menus here
            }
        }
        self.render = function () {
            $("#" + self.menuId).superfish({
                delay: 200,
                animation: { opacity: 'show', height: 'show' },
                speed: 'fast',
                autoArrows: true
            });

            $("body").on("click", "#" + self.menuId + " a", function (event) {
                var menu = ko.dataFor(event.target.parentElement);
                //KO binds at the LI level, whereas we bind the click at the A level.
                //So, we move one level up from A and get the KO model
                app.trigger(self, new app.message("menuclick",menu,null), null);
               // toastr.info(menu.title);
            });


        }
        self.afterRender = function (element, context) {
            setTimeout(self.render, 100);
        }
    }

    require(['js!menu/superfish!order'
              , 'js!menu/hoverIntent!order'
             ], function (a, b) {

             });

    require(['link!styles/grid/menu/css/superfish.css',
             'link!styles/grid/menu/css/superfish-vertical.css'

    ], function () { });

    return MenuModel;

});
