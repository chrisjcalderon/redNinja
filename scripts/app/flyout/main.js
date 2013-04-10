define(['AppManager',
        'AppModels',
        'models/bootstrap/templateManager'
], function (app, models, template) {


    var modelName = 'demo';

    var model = function () {
        var self = this;
        self.template = template;

        self.links = ko.observableArray();
        self.selectedLinks = ko.observableArray([{ title: 'All', href: '', selected: ko.observable(false)}]);
        self.maxLinks = 6;
        self.jsonStuff = ko.observable();
        self.loading = ko.observable(false);

        self.load = function () {
            // self.loadServicesFor("check_status_of");
            ko.applyBindings(self);

        }

        self.onInit = function () {

        }

        self.apply = function () {
            toastr.success("Saved");
            //self.jsonStuff($.param(self.selectedLinks()));
        }

        self.addSelected = function () {

            for (var i = self.links().length - 1; i >= 0; i--) {
                var link = self.links()[i];
                if (link.selected()) {

                    self.selectedLinks.push(link);
                    self.links.remove(link);

                }
            }
        }

        self.selectAction = function (model, event) {
            var action = $(event.target).attr("action");
            self.links([]);
            self.selectedLinks([{ title: 'All', href: '', selected: ko.observable(false)}]);
            self.loadServicesFor(action);
        }

        self.select = function (link) {
            link.selected(!link.selected());
        }

        self.isTableFull = function (parent) {
            return parent().length < self.maxLinks;
        }


        self.afterMove = function (item) {

        }

        self.loadServicesFor = function (what) {
            var url = "http://localhost:4503/city/en/svcs/iwantto." + what + ".html .iwantto-search-results";
            var container = $("<div/>");
            var links = [];
            self.loading(true);
            self.links([]);
            container.load(url, function (responseText, textStatus, XMLHttpRequest) {
                $(container).find("li a").each(
                        function (index, element) {
                            var link = $(element);
                            links.push({ title: link.text(), href: link.attr("href"), selected: ko.observable(false) });
                        }
                );
                self.loading(false);
                self.links(links);
                self.links.valueHasMutated();
            });

        }
    }

    models.register(modelName, new model());

});

