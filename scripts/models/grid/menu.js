define(['AppModels', 'require'], function (app, require) {

    var MenuModel = function (params) {
        var self = this;
        self.context = null; //set by the template
        self.params = params; //i.e. menu name

        self.then = function (fnc) {
            app.loadFile('menu.html').then(function (data) {
                fnc({html:data,afterRender:self.afterRender});
                //setTimeout(function () {$("#sitemenu").superfish();}, 500);
            });
        }

        self.afterRender = function (element, context) {
            
            $("#sitemenu").superfish({            
                    delay:       200,                            
                    animation:   {opacity:'show',height:'show'},  
                    speed:       'fast'	,
                    autoArrows:  true
            });		                
        }
    }

    require(['js!menu/superfish!order'
              ,'js!menu/hoverIntent!order'
              //,'js!menu/supersubs!order'
             ], function (a, b) {

             });

    require(['link!styles/grid/menu/css/superfish.css'], function () { });

    return {
        get: function (params) {
            return new MenuModel(params);
        }
    }
});
