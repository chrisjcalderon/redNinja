define(['AppModels'], function (models) {

    var ArticleModel = function (params) {
        var self = this;
        self.context = null; //set by the template

        self.then = function (fnc) {
            models.loadJson("/scripts/data/article.php?id=" + params).then(function (data) {
                fnc(data.introtext);
                //self.context.data(data);
            });
        }
    };

    return {
        get: function (params) {
            return new ArticleModel(params);
        }
    }
});
