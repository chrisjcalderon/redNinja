define(['AppModels'], function (models) {

    var tableModel = function () {
        var self = this;
        self.params = {
            "sDom": 'R<"H"lfr>t<"F"ip>',
            "bJQueryUI": true,
            "bDestroy": true
        };

        self.load = function (refresh) {
            var name = "tblDemo";
            oTable = $('#' + name).dataTable(self.params);
        }

        self.getRows = function () {
            var items = ko.observableArray([]);
            //$('#' + name).hide("fade",0,0);
            toastr.info("GET ROWS!");
            models.loadJson("/scripts/data/dataservice.php").then(function (data) {
                items(data.slice(0, 150));
                items.valueHasMutated();
                setTimeout(self.load);
            });

            return items;
        }

    }

    var dt = new tableModel();
    return {
        init: function () {
            //setTimeout(function () {
                dt.load();
           // });
        },
        items: dt.getRows(),
        onUnload: function () {
            return confirm("Leave me?? :(");
        }

    }
});
