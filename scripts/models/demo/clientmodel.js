define([], function () {
    var ClientModel = function () {
        var self = this;
        self.name = ko.observable("");
        self.address = ko.observable("");
        self.ID = ko.observable(0);
        self.isNew = ko.computed(function () {
            return self.ID() == 0;
        });
    };

    return function () {
        return new ClientModel();
    }

});
