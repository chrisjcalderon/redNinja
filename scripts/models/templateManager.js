define(['require',
        'AppModels',
        'jquery'
        , 'models/bootstrap/bootstrap'],
function (require, app, $, tbs) {
    /*
        Template Engine

    */

    var templateDefaults = {
        showTitle: true,
        moduleTitleCss: '',
        contentCss: '',
        containerCss:'',
        sectionCss:'',
        positionCss:'',
        moduleCss:''
    }; 

    var Template = function () {
        var self = this;
        self.version = "0.1";
        self.sections = ko.observableArray([]);
        self._sections = {};
        self.section = self._sections; //Alias
        Template.sectionLayout = [];

        self.defaultchrome = "standard";

        self.registerSection = function (name, positions) {
            var section = new Section(name, positions);

            section.template = self; //reference to template

            self._sections[name] = section; //KeyMap
            self.sections.push(section);
        };

        self.removeSection = function (name) {
            self.sections.remove(self._sections[name]);
            delete self._sections[name];
        };

        self.move = function (module, toSection, andPosition) {
            var section = self._sections[toSection];
            if (!section) {
                app.log.error("Section " + section + " not defined. Cannot move module");
                return;
            }

            if (andPosition > (section.positions.length - 1)) {
                app.log.error("Section " + section + " does not have position " + andPosition + " defined. Cannot move module");
                return;
            }

            module.container.remove(module); //remove itself from the containing section
            section.positions[andPosition].add(module);

        };

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
        };

        self.findModule = function (name) {

            for (var s = 0; s < self.sections.length; s++) {
                var section = self.sections()[s];
                var positions = section.positions;
                for (var p = 0; p < positions.length; p++) {
                    var position = positions[p];
                    for (var m = 0; m < position.modules.length; m++) {
                        var module = position.module[m];
                        if (module.name == name) {
                            return module;
                        }
                    }//End Modules
                }//End Positions
            }//End Sections
            return null;
        };

        self.configSections = function (sections) {
            for (var s = 0; s < sections.length; s++) {
                var section = sections[s];
                self.registerSection(section.name, section.positions);
            }
        };

        self.config = self.configSections; //alias

        self.init = function () {

            Template.sectionLayout.push([12]);
            Template.sectionLayout.push([6, 6]);
            Template.sectionLayout.push([4, 4, 4]);
            Template.sectionLayout.push([3, 3, 3, 3]);
            Template.sectionLayout.push([2, 2, 2, 2, 2, 2]);

        };

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
                }
            };
        }

    }; //End Template

    var Section = function (name, positions) {
        var self = this;
        self.name = name;
        self.sectionID = 'section-' + name;
        self.defaultchrome = "standard";
        self.positions = [];
        self._positions = ko.observable(self.positions);
        self.positionCount = positions;
        self.forcePositions = false;
        self.layouts = {};
        self.css = "";

        self._positions.subscribe(function (v) {
            //toastr.info(v);
        });

        self.addPosition = function () {
            var container = new Container(self.name, self.name + " " + self.positions.length, self.defaultchrome, self);
            self.positions.push(container);
            self.positionCount++;
            self._positions.valueHasMutated();
            return container;
        };

        self.init = function () {
            if (self.positionCount == 1) {
                self.positions.push(new Container(self.name, self.name, self.defaultchrome, self));
            } else {
                for (var x = 0; x < self.positionCount; x++) {
                    self.positions.push(new Container(self.name + "-" + x, self.name, self.defaultchrome, self));
                }
            }
            self._positions.valueHasMutated();
        };

        self.setLayout = function (positions, layout) {
            self.layouts["l" + positions] = layout;
        };

        self.getLayout = function (positions) {
            if (typeof self.layouts['l' + positions] !== 'undefined') {
                return self.layouts['l' + positions];
            } else {
                return null;
            }
        };

        self.getPositionCount = function () {
            var total = 0;
            for (var p = 0; p < self.positions.length; p++) {
                if (self.positions[p].hasModules()) {
                    total++;
                }
            }
            return total;
        };

        self.getClass = function (index) {

            //Before calculating:

            var base = "span";
            var prefix = " ";
            var pos;
            var positions = self.getPositionCount();
            var layout = self.getLayout(positions); //existing layout?

            if (layout) { //If there is a predefined layout, then use it
                pos = layout[index];
            } else {        //otherwise autoadjust
                var totalPositions = self.positions.length;
                var blocks = Template.sectionLayout[positions - 1][index];
                var offset = (totalPositions - positions) * 2;
                pos = blocks + (offset * 2);

            }

            base = base + pos;
            if (index == 0) {
                prefix += " p-alpha ";
            }
            if (index == (positions - 1)) {
                prefix += " p-omega ";
            }
            prefix += " pos" + index;
            return base + prefix; // + extra

        };

        self.hasModules = function () {

            var positions = self.positions;
            for (var p = 0; p < positions.length; p++) {
                if (positions[p].hasModules()) {
                    return true;
                }
            }
            return false;
        };
        self.init(positions);
        return self;
    };

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
        };

        self.add = self.addModule;

        self.hasModules = function () {
            return self.modules().length > 0;
        };

        self.clear = function () {
            self.modules.removeAll();
        };

        self.remove = function (module) {
            self.modules.remove(module);
        };

        return self;
    };

    var Module = function (name, template, model, params, title) {
        var self = this;

        self.moduleID = "module-" + (Module.instanceID++);
        self.name = name;
        self.template = ko.observable(template || 'template/html');
        self.data = ko.observable();
        self.container = null; //set by the Container

        if (typeof model === 'object') {
            self.model = '';
            model.context = self;
            self.data(model);
        } else {
            self.model = model;
        }

        self.params = params;
        self.visible = ko.observable(true);
        self.title = ko.observable(title || self.name);
        self.showTitle = ko.observable(templateDefaults.moduleCss);
        self.css = templateDefaults.css;
        self.ready = ko.observable(false);

        //Handles After Renders - For a Module
        self.onAfterRender = [];
        self.subscribeOnRender = function (callBack) {
            self.onAfterRender.push(callBack);
        };


        //Three Levels for handling after renders: 1) Model, 2)Direct Subscription, 3rd Global Event listen/handler
        self.afterRender = function (element) {

            if (element[0].className == 'infuser-loading') {
                return;
            }

            if ((self.model != '' || typeof self.data() === 'object') && self.data() && self.data().afterRender !== undefined) {
                app.log.info("Preparing rendering of template:" + self.template() + " for module:" + self.moduleID + " model:" + self.model);
                self.data().afterRender(element, self);
            }

            //Preference to subscribers
            for (var r = 0; r < self.onAfterRender.length; r++) {
                self.onAfterRender[r](element, self);
            }

            //Global Trigger
            app.trigger(self, new app.message("onModuleRender", self, { element: element }));


        };

        self.set = function (data) {

            self.css = data.css || self.css;
            if (data.showTitle !== undefined) self.showTitle(data.showTitle);
            if (data.visible !== undefined) self.visible(data.visible);
            if (data.title !== undefined) self.title(data.title);
            if (data.data !== undefined) {
                data.context = self;
                self.data(data.data);
            }
            return self;
        };

        self.setModel = function (model, template, params) {

            self.ready(false);
            self.template(template || self.template);

            self.params = params || self.params;

            if (typeof model === 'object') {
                if (model) {
                    model.context = self;
                }
                app.log.info("setModel for " + self.name + " -> as object");
                self.data(model);
                self.ready(true);
                return self;
            }
            app.log.info("setModel for " + self.name + " -> " + model);

            self.model = model;
            self.init();

            return self;
        };

        self.setParams = function (params) {
            self.params = params;
            app.log.info("setParams for " + self.name);
            self.init();
            return self;
        };

        self.init = function () {
            if (self.model) {
                //The data comes from a AMD module
                require(['models/' + self.model], function (model) {
                        //if the module produces an instance, then retrieve it using get and pass the params.
                        //Note: All get methods must return a promise object
                        if (typeof model.get == 'function') {
                            model.get(self.params, self).then(function (obj) {
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
                //if it does not require a model then set the data to the Module itself
                self.data(self);
                self.ready(true);
            }
        };


        //if setting a model and template @ the constructor
        if (self.model == '') {
            self.ready(true);
        } else {
            // setTimeout(self.init);
            self.init();
        }

        return self;

    };     //End Module

    Module.instanceID = 1;

    var template = new Template();

    return {
        instance: template,
        config: template.configSections,
        section: template._sections,
        init: template.init,
        Module: Module,
        getSection: template.getSection,
        defaults: templateDefaults,
        model: Template
    }

} //End Closure
); 