define(['models/dashboard/viewmodel'], function (vm) {

    //(title, type, template, isApp,tabs)
    var _views = new vm.viewsManager('side-menu',"main");

    _views.addView("View pending orders list", "d1", '/dashboard/photo-gallery');
    _views.addView("Shipping and handling fees", "d2", '/dashboard/forms-template');
    _views.addView("Setup registration", "d3", '/dashboard/photo-gallery');
    _views.addView("Manage filters", "d4", '/dashboard/quick-info');
    _views.addView("Dashboard links", "d5", '/dashboard/table-template-2');
    _views.addView("Product Categories", "d6", '/dashboard/footer');
    _views.addView("SEO Settings", "d6", '/dashboard/footer');    
    _views.addView({title:'Side Menu',template:'/dashboard/footer',container:'main'});
                    
    //title, type, template, tabs, active, model, container, params

    return _views;
});
