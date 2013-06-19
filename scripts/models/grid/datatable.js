define(['AppModels','models/datatable'], function (models,dt) {

    var tableModel = function () {
        var self = this;
        self.items = ko.observableArray([]);
        self.sync = false;
        self.params = {
            "sDom": 'R<"H"lfr>t<"F"ip>',
            "bJQueryUI": true,
            "bDestroy": true
        };

        self.load = function (refresh) {
            var name = "tblDemo";
            oTable = $('#' + name).dataTable(self.params);
        }
        self.afterRender = function (element, context) {
            self.context.title("I'm a grid module");
        }

        self.then = function (fnc) {
            models.loadJson("/scripts/data/dataservice.php").then(function (data) {
                self.items(data.slice(0, 10));
                self.items.valueHasMutated();
                self.load();
            });
            fnc(self);
        }

    };

    return {
        get: function () {
            return new tableModel();
        }
    }
});
