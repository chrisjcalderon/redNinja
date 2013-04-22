define(['AppModels',
    'signals',
    'routing/crossroads.min',
    'routing/hasher.min'

    ], function (models, signal, crossroads, hasher) {


        var Router = function () {
            var self = this;

            self.routes = {};

            self.component = null; //module

            self.init = function () {
                crossroads.bypassed.add(self.invalidRoute);
                crossroads.routed.add(self.debugRouted);

                hasher.initialized.add(self.parseHash);
                hasher.changed.add(self.parseHash);
                hasher.init();
            }

            self.onInvalidRoute  = function(handler) {
                crossroads.bypassed.add(handler);
            }

            self.parseHash = function (newHash, oldHash) {
                crossroads.parse(newHash);
            }

            self.invalidRoute = function (request, data) {
                console.log("Invalid Request -> " + request);
            }

            self.debugRouted = function (request, data) {
                console.log("Debug Request -> " + request + " => " + data.route + ' - ' + data.params + ' - ' + data.isFirst);
            }

            self.addRoute = function (name, path, handler, rules, switching) {

                var route = crossroads.addRoute(path);

                if (rules) {
                    route.rules = rules;
                }

                route.matched.add(handler);

                if (switching) {
                    route.switched.add(switching);
                }


                //Keep a record of the route by name;
                self.routes[name] = route;

            }

            self.isValid = function (name, test) {
                var route = self.routes[name];

                if (route) {
                    var result = route.match(test);
                    console.log("Test Route " + name + " for " + test + " = " + result);
                    return result;
                }
                else {
                    return false;
                }
            } //

            self.routeFor = function (name, params) {
                var route = self.routes[name];

                if (route) {
                    return route.interpolate(params);
                }
                else {
                    return "";
                }
            } //

            self.set = function (route) {
                hasher.setHash(route);
            }
            self.go = self.set;

        }

        return Router;

    });
