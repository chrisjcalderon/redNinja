define(['models/dashboard/viewmodel'], function (vm) {

    //(title, type, template, isApp,tabs)
    var _views = new vm.viewsManager('dashboard',"main");

    var _subTab = new vm.viewTabs();
    _subTab.add("Users", true, "/dashboard/footer").add("Groups", false, "/dashboard/data-table","/dashboard/datatable").add("Access Levels", false, "/dashboard/my-favorites");

    //title, active, template, model, params, tabs
    var _tabs = new vm.viewTabs();
    _tabs.add("Templates", true, "");//,"",{},_subTab);
    _tabs.add("Styles", false, "");
    _tabs.add("Media", false, "/dashboard/my-favorites");
    _tabs.add("Layouts", false, "/dashboard/test-model", '/dashboard/test-model');
    _tabs.add("SubTabs", false, "","",{},_subTab.tabs);

    var _tabs2 = new vm.viewTabs();
    _tabs2.add("Users", false, "");
    _tabs2.add("Groups", true, "");
    _tabs2.add("Access Levels", false, "");



    var _tabs3 = new vm.viewTabs();
    for (var x = 0; x < 10; x++) {
        _tabs3.add("Tab " + x, (x == 0), "");
    }

    _tabs3.tabs[0].title = "Chris";
    _tabs3.tabs[1].title = "Calderon";
    _tabs3.tabs[2].title = "Bella";
    _tabs3.tabs[2].template = "/dashboard/photo-gallery";
    _tabs3.tabs[1].template = "/dashboard/forms-template";

    _tabs3.tabs[2].template = "/dashboard/calendar";
    _tabs3.tabs[2].model    = "/dashboard/calendar";


    _views.addView("User Management Tools", "d1", '/dashboard/photo-gallery');
    _views.addSubApp("Setup upload folders", "d2", '/dashboard/forms-template');
    _views.addView("Manage photo galleries", "d3", '/dashboard/photo-gallery');
    _views.addView("Change site templates", "d4", '/dashboard/quick-info');
    _views.addSubApp("SEO Tools and Settings", "d5", '/dashboard/table-template-2');
    _views.addView("Email Settings and Templates", "d6", 'footer');

    _views.addView("Homepage and Static Pages", "d7", '', _tabs.tabs);
    _views.addView("Website Security Settings", "d8", '', _tabs2.tabs);
    
    _views.addView({title:"Printable PageTemplate", type:"d9", template:'/dashboard/data-table',model:'/dashboard/datatable'});
    _views.addView({title:"Table", type:"d9", template:'/dashboard/data-table',model:'/dashboard/datatable'});

    _views.addView("Date and Time Setup", "d10", '/dashboard/calendar',[],false,'/dashboard/calendar');
    _views.addView("Favorires Settings", "d11", '/dashboard/my-favorites');
    _views.addView("Statistics and Graphs", "d12", '/dashboard/photo-gallery');
    _views.addView({title:"Bella", type:"d11", tabs: _tabs3.tabs}).extend({custom:10});

    return _views;
});
