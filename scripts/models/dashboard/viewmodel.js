define(['require', 'jquery', 'AppModels'], function (require, $, app) {

    //puglins...

    //very basic url hash router
    var RouteManager = function () {
        var self = this;
        self.routes = {};
        self.current = '';
        self.selectedView = null

        self.add = function (vm) {
            self.routes[vm.route] = vm;
        }

        self.getRouteMap = function () {
            var routeMap = [];
            for (var v in self.routes) {
                var vm = self.routes[v];
                routeMap.push({
                    title: vm.route,
                    model: vm,
                    views: vm.views
                });
            }
            return routeMap;
        }

        self.getVM = function (route, view) {
            return self.routes[route].views[view];
        }

        self.canMove = function (vm) {
            for (var r in self.routes) {
                var vm = self.routes[r];
                for (var v in vm.views) {

                }
            }
        }

        $(window).hashchange(function () {
            var hash = document.location.hash;
            if (hash != self.current) {
                var routes = hash.replace('#', '').split("/");
                var vm = self.routes[routes[0]] || null;
                var view;
                if (vm) {
                    if (routes.length > 1) {
                        view = vm.getView(routes[1]);
                    } else {
                        view = vm.views[0];
                    }
                    //has been initialized... somehow :)
                    if (view && view.container) {
                        view.load(view.container, view.containerData);
                    } else {
                        self.current = "";
                        document.location.hash = "";
                    }
                } //VM Foud
            }
        }); //
    } //End Router

    var Container = function (name, container, data, chrome, subChrome) {
        var self = this;
        self.name = name;
        self.container = container || ko.observable(); ;
        self.data = data || ko.observable(); ;
        self._beforeRender = []; //listeners
        self._afterRender = []; //listeners
        self.mainChrome = chrome;
        self.subChrome = subChrome;

        self.extend = function (obj) {
            //Self is the manager, this should be the instance (container);
            for (var prop in obj) {
                self[prop] = obj[prop];
            }
            return self;
        }

        self.render = function (view) {
            var manager = view.manager;

            self.onBeforeRender(view);

            if (manager.selectedView) {
                var data = ko.utils.unwrapObservable(manager.selectedView.data)
                if (data && manager.selectedView !== self && data.onUnload) {
                    var canUnload = data.onUnload();
                    if (!canUnload) {
                        toastr.warning("Sorry, the view said no...");
                        return;
                    }
                }
                manager.selectedView.active(false);
            }

            //Make current active
            routes.selectedView = view;
            manager.selectedView = view;
            view.active(true);

            //The container "data" always points to the view, afterwards
            //it can use the $data.data for referencing model data
            view.containerData(view);

            //if there are any tabs then the view is a section view   
            if (view.tabs.length > 0) { //is a section view
                view.container(self.subChrome);
            } else {
                //if is a SubApplication then render the straight view. otherwise a page-section
                if (view.isSubApp) {
                    view.container(view.template);
                } else {
                    view.container(self.mainChrome);
                }
            }

            //Avoids re-eval
            routes.current = "#" + manager.route + "/" + view.title;
            window.location.href = routes.current;
            window.title = manager.route + " / " + view.title;

            self.onAfterRender(view);
        }

        self.onBeforeRender = function (view) {
            var lm = self._beforeRender.length;
            for (var l = 0; l < lm; l++) {
                self._beforeRender[l].notify(view, "beforeRender");
            }
        }
        self.beforeRender = function () {
            var def = new $.Deferred();
            var promise = def.promise();
            promise.call = promise.progress; //alias so can do on(msg).receive()
            self._beforeRender.push(def);
            return promise;
        }

        self.onAfterRender = function (view) {
            var lm = self._afterRender.length;
            for (var l = 0; l < lm; l++) {
                self._afterRender[l].notify(view, "afterRender");
            }
        }
        self.afterRender = function () {
            var def = new $.Deferred();
            var promise = def.promise();
            promise.call = promise.progress; //alias so can do on(msg).receive()
            self._afterRender.push(def);
            return promise;
        }

    }

    var ContainerManager = function () {
        var self = this;

        self.defaultChrome = 'dashboard/page-section';
        self.defaultSubChrome = 'dashboard/page-section-tabs';

        self.containers = {};

        //Used in case a view is bound to an undefined container...
        self.fallback = "undef";

        self.register = function (name, container, data, chrome, subChrome) {
            var container = new Container(name, container, data,
                                          chrome || self.defaultChrome,
                                          subChrome || self.defaultSubChrome);
            self.containers[name] = container;
            return container;
        }

        //default catch all behavior
        self.register(self.fallback);

        self.containers[self.fallback].container.subscribe(function (value) {
            toastr.error("Container not registered for template:" + value + ". You must assign a valid container name to your views", "<h2>Container Manager</h2>");
        });


        self.get = function (name, ref) {
            return self.containers[name] || self.containers[self.fallback];
        }

        self.isRegistered = function (name) {
            return typeof self[name] !== 'undefined';
        }

        self.create = function (name, elementRoot) {
        }

    }

    //Uses and extends the ViewsManager and ViewModel
    var TabModel = function () {
        var self = this;
        TabModel.instance++;

        self.vm = new ViewsManager("tabs-" + TabModel.instance, "");
        self.tabs = self.vm.views;
        //self.tabs.manager = self.vm;

        //to support nested I would need to change this:
        //--->>>getTemplate()
        
        self.activateTab = function () {
            var tab = this;
            if (tab.model) {
                require(['models/' + tab.model], function (model) {
                    tab.data = model;
                    self.tabs.manager.activeTab(tab);
                });
            } else {
                tab.data = tab;
                self.tabs.manager.activeTab(tab);
            }
        }
        self.select = function () {
            this.activate();
        }

        self.add = function (title, active, template, model, params, tabs) {
            var view = self.vm.addView({
                title: title,
                active: active,
                template: template,
                model: model || '',
                params: params || {},
                tabs: tabs
            });
            view.extend(
                    {   activate: self.activateTab,
                        select: self.select,
                        isTab: true
                    });
            //if(tabs)tabs.manager = view;
            return self;
        }
    }   //TabModel

    TabModel.instance = 0;

    //NOTE:  ADD CUSTOM PARAMETERS FOR MODEL 
    // {param:value,param:value } THEN pass to Init :) this allows for configuration
    // of a standard model which behaves according to paramters (i.e datatables container, data, etc)

    //Model/Controller for Views
    var ViewModel = function (title, type, template, isApp, tabs, active, model, containerName, params, manager) {
        var self = this;
        self.version = '0.1';       //version
        self.manager = manager;     //link to ViewsManager
        self.title = title;         //title of the view (menu,tab,etc)
        self.type = type            //type... can be used for css
        self.template = template;   //the template name in the templates directory
        self.isSubApp = isApp;      //is a SubApp? (changes chrome)
        self.tabs = tabs;           //Any tabs? applies only when not a sub app... but can be used if app supports it
        self.model = model;          //Model data, if any
        self.containerName = containerName || manager.containerName; //Container name
        self.params = params;

        self.data = ko.observable(); //the view data

        //If tabs provided, then cross ref with the view
        if (self.tabs.length > 0) {
            self.tabs.manager = self
        };

        self.activeTab = ko.observable(null);           //Observes which tab is active
        self.active = ko.observable(active || false);   //Observes if view is active      

        self.container = null;      //Container placeholder 
        self.containerData = null;  //Container data placeholder 
        self.modelData = null;

        self.extend = function (obj) {
            //Extends the View Model with custom properties, maybe needed
            //by other models or renderers
            //i.e. app-modules
            for (var prop in obj) {
                self[prop] = obj[prop];
            }

            return self; //for chaining support
            //Can add promisse based suff
            //self.OnLoad().progress(function() {}; );
            //the onload will do a _listeners = []; _listeners.push(promisse);
        }

        self.getTemplate = function () {
            //this will force a dependency if the activeTab observable changes.
            //if it does, then the new tab template is loaded
            var tab = self.activeTab();            
            
            app.log.info("activeTab/getTemplate: " + (tab?tab.title:"using self " + self.title));

            if (tab == null) {                
                //self.data(tab.data);
                self.modelData = self.data;
                return self.template;
            } else {
                //set the data and calls init, if available
                self.data(tab.data);
                self.modelData = tab.data;
                return tab.template || '/dashboard/empty-view';
            }
        }

        self.load = function () {

            //Sanity Check -- is this a TAB?
            if (self.isTab) {
                self.activate();
                self.manager.load();
                return;
            }

            var _container = containers.get(self.containerName);
            self.container = _container.container;
            self.containerData = _container.data;

            //Checks if the view requires a model, if so retrieve it first before
            //processing the rest. This will ensure that the model is ready
            //prior rendering the view
            if (self.model) {
                require(['models/' + self.model], function (model) {
                    self.data = model;
                    _container.render(self);
                });
            } else { //Does not require a model
                _container.render(self);
            }

        }

        self.afterRender = function (e) {
            if ($(e).text() != "Loading..." && $(e).length > 0) {

                //If the model is a tab...
                if (self.modelData && typeof self.modelData.init === 'function') {
                    self.modelData.init();
                } else if (self.data && typeof self.data.init === 'function') {
                    //otherwise if from a hmmm section
                    self.data.init();
                }
            }
        } //End After Render

        //Resolve Tabs - don't leave local variables in scope
        var a = [];
        for (var t = 0; t < self.tabs.length; t++) {
            self.tabs[t].manager = self; //re-routes the manager
            if (self.tabs[t].active()) {
                self.tabs[t].activate();
            }
        }

    };

    //Proxy for Views, 
    //Provides overloads for adding views and also interfaces with the router
    var ViewsManager = function (route, container) {
        var self = this;
        self.route = route || '';
        self.views = [];
        self.selectedView = null;
        self.containerName = container || 'main'; //defaults a main container..

        self.extend = function (obj) {
            for (var prop in obj) {
                self[prop] = obj[prop];
            }
            return self;
        }


        self.getView = function (name) {
            for (v in self.views) {
                if (self.views[v].title == name) {
                    return self.views[v];
                }
            }
            return null;
        }

        self.addToModel = function (view) {
            if (self.selectedView && view.active()) {
                self.selectedView.active(false);
            }
            if (view.active()) {
                self.selectedView = view
            }
            self.views.push(view);
        }

        self.createView = function (o) {
            //VALIDATION: 
            // IF a TABS are provided, then TEMPLATE must be empty: The templates are per tab.
            return new ViewModel(
                    o.title,
                    o.type,
                    o.template,
                    o.isapp || false,
                    o.tabs || [],
                    o.active || false,
                    o.model || '',
                    o.container || '',
                    o.params || {},
                    self);
        }

        self.addView = function (title, type, template, tabs, active, model, container, params) {
            var view;
            if (typeof arguments[0] == 'object') {
                view = self.createView(arguments[0]);
            } else {
                view = new ViewModel(title, type, template, false, tabs || [], active, model, container, params, self);
            }
            self.addToModel(view);
            return view;
        }

        self.addSubApp = function (title, type, template, active, model, container, params) {
            var view;
            if (typeof arguments[0] == 'object') {
                var o = arguments[0];
                o.isapp = true;
                view = self.createView(o);
            } else {
                view = new ViewModel(title, type, template, true, [], active, model, container, params, self);
            }
            self.addToModel(view);
            return view;
        }

        self.add = function (title, type, template, isApp, tabs, active, model, container, params) {
            if (isApp) {
                return self.addSubApp(title, type, template, active, model, container, params);
            } else {
                return self.addView(title, type, template, tabs, active, model, container, params);
            }
        }

        routes.add(self); //Registers

    };

    //Instances
    var routes = new RouteManager();
    var containers = new ContainerManager();

    var ViewManager = {
        viewsManager: ViewsManager,
        view: ViewModel,
        viewTabs: TabModel,
        routes: routes.getRouteMap,
        getView: routes.getVM,
        containers: containers,
        currentView: function () { return routes.selectedView; }
    }

    define("ViewManager", function () { return ViewManager; });

    return ViewManager;


});
