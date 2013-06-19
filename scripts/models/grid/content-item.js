define(['AppModels'], function (app) {


    var ItemModel = function () {
        var self = this;
        self.getContent = function () {
            var def = new $.Deferred();
            var prom = def.promise();
            app.loadFile('article.txt').then(function (data) {
                def.resolve(data);
            });
            return prom;
        }

    };

    var model = new ItemModel();
    return {
        init: function () {
        },
        get: model.getContent

    }


});
