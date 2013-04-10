define(['models/dashboard/viewmodel'], function (vm) {

    function showHide (module) {
        module.visible(!module.visible());
    }

    //(title, type, template, isApp,tabs)
    var _views = new vm.viewsManager('app-modules',"none");

    _views.addView({title:"Side Menu", template:'dashboard/left-menu'}).extend({ isModule: true, visible: ko.observable(true), showHide: showHide });
    _views.addView({title:"Todo List", template:'dashboard/todo-list'}).extend({ isModule: true, visible: ko.observable(true), showHide: showHide });
    _views.addView({title:"Photo Gallery", template:'dashboard/photo-gallery'}).extend({ isModule: true, visible: ko.observable(true), showHide: showHide });
    _views.addView({title:"Quick Info", template:'dashboard/quick-info'}).extend({ isModule: false, visible: ko.observable(true), showHide: showHide });
    //_views.addView({title:"Router!", template:'routes'}).extend({ isModule: true, visible: ko.observable(true), showHide: showHide });
                    
    return _views;
});