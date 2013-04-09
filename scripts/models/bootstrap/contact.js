define(['AppModels'], function (models) {


    var contactModel = function (first, last, email, address) {
        var self = this;

        self.firstName = ko.observable(first);
        self.lastName = ko.observable(last);
        self.address = ko.observable(address);
        self.email = ko.observable(email);
        self.isNew = ko.observable(true);

        if (first) {
            self.isNew(false);
        }

        self.fullname = ko.computed(function () {
            return self.firstName() + " " + self.lastName();
        });

        self.clone = function () {
            return new contactModel(self.firstName(), self.lastName(), self.email(), self.address());
        }
    }

    return contactModel;

});
