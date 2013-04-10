define(['RootContext'], function (root) {
    var Client = function () {
        var self = this;
        self._modelName = 'Client - V1.0';
        self.firstName = "Christian Calderon";
        self.context = root;
    }
    return new Client();
});

