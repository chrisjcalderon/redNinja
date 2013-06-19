define(['AppModels'

], function () {


    var model = function (first, last, email, address) {
        var self = this;

        self.firstName = ko.observable(first);
        self.lastName = ko.observable(last);
        self.address = ko.observable(address);
        self.email = ko.observable(email);
        self.isNew = ko.observable(true);

        self.fullname = ko.computed(function () {
            return self.firstName() + " " + self.lastName();
        });

    };

    return model;

});
