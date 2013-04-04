define(['require',
        'AppModels',
        'jquery',
        'models/grid/page'],
function (require, app, $, page) {
    /*
   
    This Template Engine attempts to reproduce...
    * It's based on a 12 columns Grid System
    * Tries to use the Module & Component approach from Joomla...
    Note: In reallity, a module is a component as well...
        
    */

    var templateDefaults = {
        showTitle: true,
        titleClass: '',
        boxClass: '',
        css: function () { return this.boxClass + ' ' + this.titleClass; }

    };

    var Template = function () {
        var self = this;
        self.version = "0.1";
        self.sections = ko.observableArray([]);
        self._sections = {};
        self.contentSection = new ContentSection();
        self.sectionLayout = new Array();

        //shortcut to component sections
        self.component = self.contentSection.component;
        self.sidebarA = self.contentSection.sidebarA;
        self.sidebarB = self.contentSection.sidebarB;
        self.sidebarC = self.contentSection.sidebarC;

        self.defaultchrome = "standard";

        self.registerSection = function (name, positions) {
            var section = new Section(name, positions)
            self._sections[name] = section; //KeyMap
            self.sections.push(section);
        }

        self.removeSection = function (name) {
            self.sections.remove(self._sections[name]);
            delete self._sections[name];
        }

        self.hasModules = function (name) {
            var section = self._sections[name];
            if (!section) {
                app.log.info("Position " + name + " not registered");
                return false;
            }

            var positions = section.positions;
            for (var p = 0; p < positions.length; p++) {
                if (positions[p].hasModules()) {
                    return true;
                }
            }
            return false;
        }

        self.configSections = function (sections) {
            for (var s = 0; s < sections.length; s++) {
                var section = sections[s];
                self.registerSection(section.name, section.positions);
            }
        }

        self.setComponent = function (component) {
            self.component.add(component);
        }

        self.config = function (id) {

            page.get(id).then(function (data) {
                toastr.info("getConfig: " + id);
            });

        }

        self.init = function () {

            //6 Columns
            self.sectionLayout.push([12]);
            self.sectionLayout.push([6, 6]);
            self.sectionLayout.push([4, 4, 4]);
            self.sectionLayout.push([3, 3, 3, 3]);
            self.sectionLayout.push([4, 2, 2, 2]);
            self.sectionLayout.push([2, 2, 2, 2, 2, 2]);

            //self.registerSection("drawer", 1);
            //self.registerSection("top", 6);
            //self.registerSection("header", 1); //6
            //self.registerSection("navigation", 1); //6
            //self.registerSection("showcase", 4);
            //self.registerSection("feature", 6)
            //self.registerSection("utility", 6);
            //self.registerSection("maintop", 4);   //
            //self.registerSection("breadcrumb", 1);
            //self.registerSection("mainbottom", 4);
            //self.registerSection("extension", 6);
            //self.registerSection("bottom", 6);
            //self.registerSection("footer", 3);
            //self.registerSection("copyright", 1);
            //self.registerSection("debug", 1);


        }

        self.getSection = function (name) {
            return {
                name: name,
                positions: self._sections[name].positions,
                _positions: self._sections[name]._positions,
                position: function (index) {
                    if (index == undefined) {
                        return self._sections[name][0];
                    } else {
                        return self._sections[name].positions[index];
                    }
                },
                getClass: function (index) {
                    //Creates dependency so the appropriate rt-grid is rendered.
                    self._sections[name]._positions();
                    return self.getClass(name, index);
                }
            };
        }

        self.getSectionPositionCount = function (name) {
            var section = self._sections[name];
            var total = 0;
            for (var p = 0; p < section.positions.length; p++) {
                if (section.positions[p].hasModules()) {
                    total++;
                }
            }
            return total;
        }

        self.getClass = function (name, index) {

            //Before calculating:

            var base = "rt-grid-";
            var prefix = " ";
            var pos;
            var positions = self.getSectionPositionCount(name); //retrieves positions if they have modules
            var layout = self._sections[name].getLayout(positions); //existing layout?

            if (layout) { //If there is a predefined layout, then use it
                pos = layout[index];
            } else {        //otherwise autoadjust                
                var totalPositions = self._sections[name].positions.length;
                var blocks = self.sectionLayout[positions - 1][index];
                var offset = (totalPositions - positions) * 2;
                pos = blocks + (offset * 2);

            }

            base = base + pos;
            //var extra = self._sections[name][index].css();
            if (index == 0) {
                prefix = " rt-alpha ";
            }
            if (index == (positions - 1)) {
                prefix += " rt-omega ";
            }

            return base + prefix; // + extra

        }

    } //End Template

    var Section = function (name, positions) {
        var self = this;
        self.name = name;
        self.defaultchrome = "standard";
        self.positions = new Array()
        self._positions = ko.observable(self.positions);
        self.positionCount = positions;
        self.forcePositions = false;
        self.layouts = {};
        self.css = "";

        self._positions.subscribe(function (v) {
            //toastr.info(v);
        });

        self.addPosition = function () {
            var container = new Container(self.name, self.name + " " + self.positions.length, self.defaultchrome, self)
            self.positions.push(container);
            self.positionCount++;
            self._positions.valueHasMutated();
            return container;
        }
        self.init = function () {
            if (self.positionCount == 1) {
                self.positions.push(new Container(self.name, self.name, self.defaultchrome, self));
            } else {
                for (var x = 0; x < self.positionCount; x++) {
                    self.positions.push(new Container(self.name + "-" + x, self.name, self.defaultchrome, self));
                }
            }
            self._positions.valueHasMutated();
        }

        self.setLayout = function (positions, layout) {
            //layout array with rt blocks: (each counts for 2)
            self.layouts["l" + positions] = layout;
        }

        self.getLayout = function (positions) {
            if (typeof self.layouts['l' + positions] !== undefined) {
                return self.layouts['l' + positions];
            } else {
                return null;
            }
        }

        self.init(positions);
        return self;
    }

    var ContentSection = function () {
        var self = this;
        self.group = self.name = "main";
        self.sidebarA = new Container("sidebar-a", "sidebar-a", "standard", self);
        self.sidebarB = new Container("sidebar-b", "sidebar-b", "standard", self);
        self.sidebarC = new Container("sidebar-c", "sidebar-c", "standard", self);
        self.component = new Container("component", "component", "component", self);
        self.contentTop = [new Container("content-top-a", "content-top", "standard", self),
                            new Container("content-top-a", "content-top", "standard", self),
                            new Container("content-top-a", "content-top", "standard", self),
                           ];
        self.contentBottom = [new Container("content-bottom-a", "content-bottom", "standard", self),
                               new Container("content-bottom-a", "content-bottom", "standard", self),
                               new Container("content-bottom-a", "content-bottom", "standard", self),
                           ];

        self.componentModule = function () {
            return self.component.modules()[0];
        }


        //schema for each section...
        self.topSchema = {
            "l0": [[0], [0, 0], [0, 0, 0]], //0
            "l1": [[1], [0, 0], [1, 0, 0]], //1
            "l2": [[2], [1, 1], [1, 1, 0]], //2
            "l3": [[3], [2, 1], [1, 1, 1]], //3
            "l4": [[4], [2, 2], [2, 1, 1]], //4
            "l5": [[5], [3, 2], [2, 2, 1]], //5
            "l6": [[6], [3, 3], [2, 2, 2]], //6
            "l7": [[7], [4, 3], [2, 3, 2]], //7
            "l8": [[8], [4, 4], [2, 4, 2]], //8
            "l9": [[9], [5, 4], [3, 3, 3]], //9
            "l10": [[10], [5, 5], [3, 4, 3]], //10
            "l11": [[11], [6, 5], [3, 5, 3]], //11
            "l12": [[12], [6, 6], [4, 4, 4]]  //12
        };
        self.bottomSchema = self.topSchema; //[[12], [6, 6], [2, 2, 2]];

        self.schemas = ko.observable(["sa", "mb", "sb", "sc"]);
        self.schema = { // Note- Respect Schema?
            "l1": [["mb"], [12]],
            "l2": [["sa", "mb"], [4, 8]],
            "l3": [["sa", "mb", "sb"], [3, 6, 3]],
            "l4": [["sa", "mb", "sb", "sc"], [2, 6, 2, 2]]
        };

        //self.blocks = 2;
        self.layout = ko.observable(); //Layout Template
        self.layout.subscribe(function (template) {
            //toastr.warning(template)
        });
        //self.layout("grid/main-body");
        self.layout("grid/main");

        //Constructs an array of mainbody sections to render, based on sidebar's available and 
        //schema composition
        self.sections = function () {
            var total = 1;
            var sections = new Array();

            if ( !self.hasAnyModule() ) {
                return new Array();
            }
        
            if (self.sidebarA.hasModules()) { sections.push({ data: { data: self.sidebarA, class: "rt-sidebar-a" }, template: 'grid/sidebar' }); total++; }
            if (self.sidebarB.hasModules()) { sections.push({ data: { data: self.sidebarB, class: "rt-sidebar-b" }, template: 'grid/sidebar' }); total++; }
            if (self.sidebarC.hasModules()) { sections.push({ data: { data: self.sidebarC, class: "rt-sidebar-c" }, template: 'grid/sidebar' }); total++; }

            var layout = self.schema["l" + total];
            var areas = layout[0];
            var sizes = layout[1];

            //place mainbody where it should based on schema.
            for (var m = 0; m < areas.length; m++) {
                if (areas[m] == 'mb') {
                    sections.splice(m, 0, { data: { mainbody: self, gridCss: '' }, template: "grid/mainbody", class: "" });
                    break;
                }
            }

            for (var a = 0; a < total; a++) {
                var model = sections[a];
                model.data.blocks = sizes[a];
                model.data.gridCss = "rt-grid-" + model.data.blocks;
            }

            return sections;
        }

        self.hasContentTop = function () {
            return self.contentTop[0].hasModules() ||
                   self.contentTop[1].hasModules() ||
                   self.contentTop[2].hasModules();
        }

        self.hasContentBottom = function () {
            return self.contentBottom[0].hasModules() ||
                   self.contentBottom[1].hasModules() ||
                   self.contentBottom[2].hasModules();
        }

        self.hasAnyModule = function () {
            return self.sidebarA.hasModules() ||
                   self.sidebarB.hasModules() ||
                   self.sidebarC.hasModules() ||
                   self.hasContentTop() ||
                   self.hasContentBottom() ||
                   self.component.hasModules();
        }

        self.getClass = function (container, index, position) {
            //Content Top/Bottom Only
            var base = "rt-grid-";
            var prefix = " ";
            var pos = 0;
            var positions = 0; //total positions with modules
            var schema = (position.type == 'top') ? self.topSchema : self.bottomSchema;

            //Position Count
            var totalPositions = container.length;
            for (var x = 0; x < container.length; x++) {
                if (container[x].hasModules()) {
                    positions++;
                }
            }

            //position.blocks = contains the # of blocks that the mainbody is taking...
            var blocks = schema["l" + position.blocks][positions - 1][index];
            var offset = (totalPositions - positions) * 2;
            if (blocks + (offset * 2) < position.blocks) {
                pos = blocks + (offset * 2);
            } else {
                pos = blocks
            }

            base += pos;
            if (index === 0) {
                prefix = " rt-alpha ";
            }
            if (index == (positions - 1)) {
                prefix += " rt-omega ";
            }
            return base + prefix;
        }

    }

    var Container = function (name, group, chrome, section) {
        var self = this;
        self.name = name;
        self.group = group;
        self.chrome = chrome;
        self.modules = ko.observableArray([]);
        self.module = self.modules();
        self.css = ko.observable("");
        self.section = section;

        //Observables in case templates iterate through container modules and so dependencies are created

        self.addModule = function (module) {
            module.container = self;
            self.modules.push(module);
            return module;
        }

        self.add = self.addModule;

        self.hasModules = function () {
            return self.modules().length > 0;
        }

        self.clear = function () {
            self.modules.removeAll();
        }
        return self;
    }

    var Module = function (name, template, model, params, title) { //For instance, list of links, list of articles, etc
        var self = this;

        self.name      = name;
        self.template  = ko.observable(template || 'grid/html');
        self.model     = model;
        self.params    = params;
        self.data      = ko.observable();
        self.visible   = ko.observable(true);
        self.title     = ko.observable(title || self.name);
        self.showTitle = ko.observable(templateDefaults.showTitle);
        self.css       = templateDefaults.css;
        self.ready     = ko.observable(false)

        self.ready.subscribe(function (value) {
            //toastr.info('ready ' + self.name);
        });

        //Handles After Renders
        self.afterRender = function (element) {

            if (element[0].className == 'infuser-loading') {                
                return;
            }

            if ((self.model != '' || typeof self.data() === 'object') && self.data() && self.data().afterRender !== undefined) {
                app.log.info("Preparing rendering of template:" + self.template + " for module:" + self.name + " model:" + self.model);
                self.data().afterRender(element, self);
            }
        }

        self.set = function (data) {

            self.css = data.css || self.css;
            if (data.showTitle !== undefined) self.showTitle(data.showTitle);
            if (data.visible   !== undefined) self.visible(data.visible);
            if (data.title     !== undefined) self.title(data.title);
            if (data.data      !== undefined) self.data(data.data);
            return self;
        }

        self.setModel = function (model, template, params) {
            self.template(template || self.template);
            self.params   = params || self.params;
            if (typeof model === 'object') {
                model.context = self;
                app.log.info("setModel for " + self.name + " -> as object");
                self.data(model);
                return;
            }
            app.log.info("setModel for " + self.name + " -> " + model);
            self.model = model;
            self.init();
            return self;
        }

        self.setParams = function (params) {
            self.params = params;
            app.log.info("setParams for " + self.name);
            self.init();
            return self;
        }

        self.init = function () {
            if (self.model) {
                //The data comes from a AMD module                
                require(['models/' + self.model], function (model) {
                    //if the module produces an instance, then retrieve it using get and pass the params.
                    //Note: All get methods must return a promise object        
                    if (typeof model.get == 'function') {
                        model.get(self.params).then(function (obj) {
                            obj.context = self;
                            self.data(obj);
                            self.ready(true);
                        });
                    } else {
                        //Otherwise the data is the model itself (likely a singleton or raw data)
                        model.context = self;
                        self.data(model);
                        self.ready(true);
                    }
                }, //End 
                function (error) {
                    app.log.error("Error loading model " + self.model + ":" + error.description);
                    toastr.error("Error loading " + self.model);
                }
                ); //End Require
            } else {
                //if it does not require a model then set the data to the Module itsef
                self.data(self);
                self.ready(true);
            }
        }


        //if setting a model and template @ the constructor
        if (self.model == '') {
            self.ready(true);
        } else {
            // setTimeout(self.init);
            self.init();
        }

        return self;

    }     //End Module

    var template = new Template();
    //Revealing pattern
    return {
        instance: template,
        config: template.configSections,
        section: template._sections,
        content: template.contentSection,
        component: template.component,
        init: template.init,
        Module: Module,
        getSection: template.getSection,
        defaults: templateDefaults
    }

} //End Closure
); 