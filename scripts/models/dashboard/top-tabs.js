define(['models/dashboard/viewmodel'], function (vm) {

    //(title, type, template, isApp,tabs)
    var _views = new vm.viewsManager('top',"main");
    var _tabs = new vm.viewTabs();

    _tabs.add("Templates", true, "");
    _tabs.add("Styles", false, "/dashboard/footer");
    _tabs.add("Media", false, "/dashboard/my-favorites");
    _tabs.add("Layouts", false, "/dashboard/test-model",'/dashboard/test-model');

    var _tabs2 = new vm.viewTabs();
    _tabs2.add("Users", false, "");
    _tabs2.add("Groups", false, "/dashboard/footer");
    _tabs2.add("Access Levels", false, "");
    _tabs2.add("Calendar", true, "/dashboard/calendar","/dashboard/calendar");

    _views.addSubApp("Main Controls", "", '/dashboard/table-template',true);
    _views.addSubApp("Server Settings", "", '/dashboard/forms-template');
    _views.addSubApp("Product Management", "", '/dashboard/table-template-2');

    _views.addView("User Accounts", "", '/dashboard/quick-info');
    _views.addView("SEO",           "", '/dashboard/table-template-2');
    _views.addView("Static Pages",  "", '',_tabs.tabs);
    _views.addView("Sub Tabs",   "", '',  _tabs2.tabs);

    return _views;
});
