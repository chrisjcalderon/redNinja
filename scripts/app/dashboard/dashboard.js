define(['AppManager'
    , 'AppModels'
    , 'models/dashboard/top-tabs'
    , 'models/dashboard/sub-menu'
    , 'models/dashboard/dashboard-items'
    , 'models/dashboard/app-modules'
    , 'models/dashboard/todos'
    , 'models/dashboard/side-menu'
    , 'models/dashboard/viewmodel'
   , 'models/datatable'
   , 'models/calendar'
], function (app, models, topTabs, subMenu, dashboard, appModules, myTodos, sideMenuItems, views) {

    var modelName = 'dashboard';
    var model = function () {
        var self = this;

        self.showError = ko.observable(false);
        self.localTime = ko.observable(new XDate().toTimeString());

        //Application Models
        self.topTabs = topTabs;
        self.subMenus = ko.observableArray(subMenu);
        self.dashboard = dashboard;
        self.appModules = appModules;
        self.myTodos = ko.observable(myTodos);
        self.sideMenuItems = sideMenuItems;
        self.views = views;
        self.contentTemplate = ko.observable();
        self.contentData = ko.observable();

        self.contentTemplate2 = ko.observable();
        self.contentData2 = ko.observable();


        //Search
        self.searchText = ko.observable();
        self.searchFor = ko.observable();

        self.doSearch = function () {
            self.searchFor(self.searchText());
            toastr.info("Searching... " + self.searchText());
            self.searchText("");

            self.contentData({ 'title': 'Search Results', template: 'dashboard/search-results' });
            self.contentTemplate('dashboard/page-section');
        }

        //User
        self.logOut = function () {
            window.location = "login.html";

        }

        self.selectView = function (vm) {
            vm.load(self.contentTemplate, self.contentData);
        }

        self.selectView2 = function (vm) {
            vm.load(self.contentTemplate2, self.contentData2);
        }

        //Dashboard
        self.selectDashboard = function (vm) {
            toastr.info("Clicked Dashboard: " + vm.title);
            vm.load(self.contentTemplate, self.contentData);
        }

        //Menu
        self.selectSubMenu = function (menu) {
            toastr.info("Clicked: " + menu.title);
        }

        self.showModule = function () {
            $(".initialState").removeClass();
        }

        //Page Module
        self.load = function () {
            //toastr.info(self.views.routes().length);
            ko.applyBindings(self);
            var vm = views.getView("top", 0);
            self.selectView(vm);
        }

        self.inspect = function (a, b) {
            return "???????";
        }
        self.onContainerEvent = function (view, what) {
            toastr.info(what + "->" + view.title);
        }
        self.onInit = function () {
            self.views.containers.register("main", self.contentTemplate, self.contentData);
            self.views.containers.register("main-2", self.contentTemplate2, self.contentData2);
            define("RootContext", self);
            self.views.containers.get("main").beforeRender().call(self.onContainerEvent);
            self.views.containers.get("main").afterRender().call(self.onContainerEvent);

        }
    }

    //Registers the model with the app... if ya want da'
    models.register(modelName, new model());

});

