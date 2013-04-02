define(['AppModels'], function (models) {

    var PageModel = function () {
        var self = this;

        self.get = function (params) {
            var def = new $.Deferred();
            var prom = def.promise();

            models.loadJson("/scripts/data/page.php").then(function (page) {
                def.resolve(page);
            });

            return prom;

        }

    }

    var model = new PageModel();
    return {
        get: model.get
        }
    
});
