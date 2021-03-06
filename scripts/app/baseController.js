// QuickVMVM JavaScript library v0.0
// (c) Christian J Calderon - http://url.com/
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

if (typeof window.appController === 'undefined') {
    (function () {
        var DEBUG = true;
        var logger = function () {
            var self = this;
            if (DEBUG) {
                self.info = function (msg) {
                    console.log("INFO: " + msg);
                };
                self.error = function (msg) {
                    console.log("ERROR: " + msg);
                };
            } else {
                self.info = function () {
                };
                self.error = function () {
                };
            }
        };

        //Configuration Object
        //a) Used to configure the URL's for CURL to load resources
        //b) Attempts to load the base configuration
        //c) Configure default style sheets to be loaded (and/or needed by auto loaded plugins)

        var Configuration = function () {
            var self = this;
            self.packages = {};

            self.defaultStyles = ['link!theme/jquery-ui.css',
                'link!styles/toastr.min.css',
                'link!styles/base.css'
            ];

            self.resolveInitialPath = function () {
                var nodes = document.getElementsByTagName('script');
                for (var n = 0; n < nodes.length; n++) {
                    var script = nodes[n];
                    var name = script.getAttribute("src") || '';
                    if (name.toUpperCase().indexOf("BASECONTROLLER") >= 0) {
                        var root = script.getAttribute("my-root") || '';
                        var styles = script.getAttribute("my-styles") || '';
                        if (styles != '') {
                            //push additional styles styles.split(":")   
                            //self.defaultStyles.push('link!' + style[s]);
                        }
                        return root;
                    }
                }
                return "";
            };

            self.basePath = location.href.split("#")[0];
            self.basePath = self.basePath.substring(0, self.basePath.lastIndexOf('/'));
            self.base = self.resolveInitialPath();
            self.scripts = self.base + "scripts";
            self.lib = self.scripts + "/lib";
            self.app = "../app";
            self.models = "../models";
            self.content = "../../media/content";
            self.templates = self.basePath + "/views";
            self.styles = self.base + "../../styles";
            self.themes = self.styles + "/themes";
            self.theme = 'base';
            self.head = document.getElementsByTagName('script')[0].parentNode;
            self.initialized = true;

            self.init = function () {

                if (self.initialized) {
                    return;
                }
            } ;
        }; //End Controller

        //App Controller
        var applicationController = function () {
            var self = this;
            self.version = "0.1";
            self.log = new logger();
            self.initialized = false;
            self.status = 'registering';
            self.onExecuteLoad = {};
            self.loadQueue = {};
            self.processedQueue = {};
            self.modelController = new modelController(self); //pass the logger
            self.models = self.modelController; //alias


            self.errorHandler = function (e) {
                alert("ERROR " + e);
            };

            self.config = new Configuration();

            self.scripts = function () {
                return document.getElementsByTagName('script');
            };

            self.each = function (ary, func) {
                if (ary) {
                    var i;
                    for (i = 0; i < ary.length; i += 1) {
                        if (ary[i] && func(ary[i], i, ary)) {
                            break;
                        }
                    }
                }
            };

            self.getLoader = function () {
                //Shim
                return {
                    config: function () {
                        return {
                            baseUrl: self.config.lib,
                            //preloads: ["curl/debug"],
                            paths: {
                                styles: self.config.styles,
                                theme: self.config.themes + "/" + self.config.theme,
                                app: self.config.app,
                                lib: self.config.lib,
                                models: self.config.models,
                                content: self.config.content
                            },
                            packages: self.config.packages
                        }
                    } //end paths config
                    , base: {
                        libs: ['jquery', 'js!jquery-ui.js', 'knockout', 'toastr.min'],
                        complete: function ($, b, ko, toastr) {
                            window['ko'] = ko;
                            window['toastr'] = toastr;
                            $.support.cors = true;
                        }
                    }//end base
                    , knockout: {
                        libs: ['js!koExternalTemplateEngine_all.min.js!order', 'js!ko-ui-bindings.js!order', 'js!knockout-sortable.js'],
                        complete: function () {
                            infuser.defaults.templateSuffix = ".html";
                            infuser.defaults.templateUrl = self.config.templates;
                            infuser.defaults.ajax.cache = true;
                            infuser.defaults.loadingTemplate.content = '<div class="infuser-loading">&nbsp;</div>';
                        }
                    }, //end knockout extras
                    main: {
                        libs: ['jquery', 'js!xdate.js', 'js!app-utils.js'],
                        complete: function ($) { //when the page is ready then load the modules
                            $(document).ready(function () {
                                self.runModules();
                            });
                        }
                    }
                };
            };

            self.loadModulesFromScriptTags = function () {

                self.each(self.scripts(), function (scriptNode) {

                    var script = $(scriptNode);

                    if (script.attr("my-completed") != 'true') {
                        script.attr("my-completed", "true");

                        var root = script.attr('my-root');

                        if (typeof root != 'undefined' && root !== null) {
                            self.config.init();
                        }

                        var module = script.attr('my-module');
                        var onLoad = script.attr('my-onload');
                        var base = script.attr('my-root');
                        var container = script.attr('my-container');
                        var package = script.attr('my-package');

                        self.log.info("Processing : " + script.attr("src") + " / module{" + (module || 'na') + "}");

                        if (package) {
                            self.definePackage(package);
                        }

                        if (module) { //If a module is defined
                            var parts = module.split("|");
                            if (!self.processedQueue[parts[0]]) {
                                self.models.containers[parts[0]] = container || '';
                                self.loadQueue[parts[0]] = { onload: parts[1], container: container };
                            }

                        }
                        if (onLoad) {
                            if (!self.onExecuteLoad[module]) {
                                self.log.info("Registering OnLoad: " + onLoad);
                                self.onExecuteLoad[module] = { module: module, onload: onLoad, processed: false };
                            }
                        }

                    } //End Processing
                }); //End looping
            }; //End function

            self.init = function () {
                if (self.status == 'registering') {
                    self.status = 'loading';
                    self.loadCurl();
                    self.load();
                    self.status = 'loaded';
                    self.initialized = true;
                } else if (self.status == 'loaded') {
                    self.runModules();
                }
            };

            self.loadCurl = function () {
                if (typeof curl === "undefined") {
                    var node = document.createElement('script');
                    node.type = 'text/javascript';
                    node.charset = 'utf-8';
                    node.async = true;
                    node.src = self.config.lib + "/curl.js";
                    self.config.head.appendChild(node);
                }
            };

            self.load = function () {
                if (typeof curl === "undefined") {
                    setTimeout(self.load, 100);
                } else {
                    define('AppManager', [], function () {
                        return window["appController"];
                    });
                    define('AppModels', [], function () {
                        return window["appController"].modelController.interface;
                    });
                    self.run();
                }
            };


            self.definePackage = function (name) {
                //all packages go under /app/package-name
                self.config.packages[name] = { path: "../app/" + name,
                    main: 'main',
                    lib: 'lib'
                };
            };

            self.run = function () {

                //Easier to manage - get loader returns the configuration
                //for curl
                var loader = self.getLoader();

                curl(loader.config(), loader.base.libs).then(loader.base.complete)
                    .next(loader.knockout.libs).then(loader.knockout.complete)
                    .next(self.config.defaultStyles)
                    .next(loader.main.libs).then(loader.main.complete);
            };

            self.runModules = function () {

                self.loadModulesFromScriptTags(); //catches up with new scripts
                var cLoadQueue = [];              //queues up the scripts
                //var fnc = self.loadQueue[m];
                for (var m in self.loadQueue) {
                    self.processedQueue[m] = true;
                    self.log.info("Preparing modules: module{" + (m) + "}");
                    cLoadQueue.push('app/' + m);
                }
                var modulesToLoad = cLoadQueue.join("-");
                self.log.info("Loading modules: " + modulesToLoad);

                //loads the modules
                curl(cLoadQueue)
                    .then(
                    success = function (oj) {
                        self.log.info("Modules loaded: " + modulesToLoad);
                        self.log.info("Waiting for " + modulesToLoad + " to run...");
                        setTimeout(function () {
                            self.modelController.run();
                            self.log.info("Modules " + modulesToLoad + " ran successfully");
                        }, 1);
                    },
                    function failure(ex) {
                        self.errorHandler(ex);
                    }
                );
                self.loadQueue = {}
            }
        };

        //Model/Module Controller
        var modelController = function (app) {
            var self = this;

            //Link to app
            self.controller = app;
            self.log = app.log;
            self.errorHandler = app.errorHandler;

            self.models = [];           //Models  loaded. Can be accessed by model name
            self.modelListerners = [];  //Message listeners
            self.containers = [];       //Module/Model containers. This keeps a cross reference of containers to models - if specicifed
            //in the script as my-contaner

            self.viewModels = []; //[containter-template-model}

            self.loadModel = function (model) {
                var result = null;
                var def = new $.Deferred();
                var prom = def.promise();
                curl(['models/' + model])
                    .then(
                    function (obj) {
                        self.log.info("Loading Model: " + model);
                        result = (typeof obj === 'function') ? obj() : obj;
                        def.resolve(result);
                    }, self.errorHandler
                );
                return prom;
            };

            self.loadViewModel = function (container, template, model) {
                var result = null;
                var def = new $.Deferred();
                var prom = def.promise();
                curl(['models/' + model])
                    .then(
                    function (obj) {
                        result = (typeof obj === 'function') ? obj() : obj;
                        //Section to store a ref to the VM and allow for the model to
                        //remove itself if needed
                        var vmKey = model + "_" + template + "_" + container;
                        self.viewModels[vmKey] = {
                            data: result,
                            model: model,
                            template: template,
                            container: container,
                            id: vmKey
                        };

                        result._viewModelRef = vmKey;
                        result._viewModel = self.viewModels[vmKey];

                        result._destroy = function () {
                            self.destroyVm(vmKey);
                        };

                        self.log.info("Loading VM: " + model + " on container " + container + " using template " + template);
                        ko.applyBindingsToNode(
                            document.getElementById(container),            // Container
                            {template: { name: template, data: result} },  // Template & Model
                            result                                       // Model..
                        );
                        def.resolve(result);
                    }
                );
                return prom;
            };

            self.destroyVm = function (vm) {
                var view = self.viewModels[vm];
                if (view) {
                    $("#" + view.container).empty(); //remove();
                    self.log.info("Removed VM " + vm);
                }
            };

            self.loadFile = function (file) {
                var result = null;
                var def = new $.Deferred();
                var prom = def.promise();
                curl(['text!content/' + file])
                    .then(
                    function (content) {
                        self.log.info("Loading File : " + file);
                        def.resolve(content);
                    }, self.errorHandler
                );
                return prom;
            };

            self.loadJson = function (url) {
                var def = new $.Deferred();
                var prom = def.promise();

                self.log.info("Loading Json @: " + url);
                $.ajax({
                    url: url,
                    dataType: 'json', //jsonp
                    success: function (result) {
                        def.resolve(result);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        toastr.error("ERROR loading " + url + " /" + textStatus + ":" + jqXHR.responseText);
                    }
                });

                return prom;
            };


            self.createMessage = function (type, obj, params) {
                return { msg: type, params: params, obj: obj };
            };

            self.registerListener = function (msg) {
                var def = new $.Deferred();
                var promise = def.promise();

                promise.receive = promise.progress; //alias so can do on(msg).receive()
                promise.call = promise.progress; //alias so can do on(msg).receive()
                self.log.info("Register listener for event " + msg);
                self.modelListerners.push({ msg: msg,
                    deferred: def,
                    promise: promise
                });

                return promise;
            };

            self.unsubscribe = function (promise) {
                for (var l = 0; l < self.modelListerners.length; l++) {
                    var listener = self.modelListerners[l];
                    if (listener.promise === promise) {
                        //delete listener;
                        self.modelListerners[l] == undefined;
                        delete self.modelListerners[l];
                        return;
                    }
                }
            };

            self.sendMessage = function (sender, msg, callback) {
                for (var l = 0; l < self.modelListerners.length; l++) {
                    var listener = self.modelListerners[l];
                    if (listener && listener.msg == msg.msg) {
                        listener.deferred.notify(sender, msg, callback, listener.deferred);
                        self.log.info("Send Message : " + msg.msg);
                    }
                }
            };

            self.run = function () {
                //first initialize: NOTE, for better performance, the inits and loads should
                //be defered! / non blocking
                var model;
                for (var m in this.models) {
                    model = self.models[m];
                    self.init(m);
                }
                //then load
                for (var m in this.models) {
                    model = self.models[m];
                    self.load(m);
                }
            };

            self.register = function (name, obj) {
                if (!self.models[name]) {
                    self.models[name] = obj;
                    obj._moduleName = name;
                    obj.isLoaded = false;
                    obj.isInitialized = false;
                }
            };

            self.get = function (name) {
                return self.models[name];
            };

            self.getModel = function (name) {
                return self.models[name] ?
                    self.models[name].instance || self.models[name] : self.models[name];
            };

            self.load = function (name) {
                if (!self.models[name].isLoaded) {
                    self.models[name].isLoaded = true;
                    if (self.models[name].load) {
                        self.log.info("call " + name + ".load(" + self.containers[name] + ")");
                        self.get(name).load(self.containers[name]);
                        self.sendMessage(self.models[name], self.createMessage("OnNewModelLoad", self.models[name], { name: name }));
                    }
                }
            };

            self.isDefined = function (name) {
                return typeof self.models[name] !== "undefined";
            };

            self.init = function (name) {
                var model = self.models[name];
                if (!model.isInitialized) {
                    model.isInitialized = true;
                    if (model.onInit) {
                        self.log.info("call " + name + ".init()");
                        model.onInit();
                    }
                }
            };

            self.destroy = function (name) {
                if (self.isDefined(name)) {
                    var model = this.models[name];
                    if (model.onDestroy) {
                        model.onDestroy();
                    }
                    delete self.models[name];
                }
            };

            //Revealing Pattern - sort of. Used for the defines
            self.interface = {
                addPackage: self.controller.definePackage,
                listen: self.registerListener,
                sendMsg: self.sendMessage,
                trigger: self.sendMessage,
                get: self.getModel,
                controllerFor: self.get,
                message: self.createMessage,
                has: self.isDefined,
                loadModel: self.loadModel,
                loadViewModel: self.loadViewModel,
                loadFile: self.loadFile,
                loadJson: self.loadJson,
                register: self.register,
                log: self.log,
                version: self.controller.version,
                on: self.registerListener,
                unsubscribe: self.unsubscribe,
                isDefined: self.isDefined,
                loadingHtml: function (html) {
                    infuser.defaults.loadingTemplate = html;
                }
            };

        }; //End Model Controller

        window.appController = new applicationController();
        window.myApp = window.appController;

    })();//End Closure

}

window.appController.init();   
