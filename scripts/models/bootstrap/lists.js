define(['AppModels',
        'models/bootstrap/contact'], function (models, contact) {


            var contactList = function () {

                var self = this;
                self.maxSelected = 10;

                self.available = ko.observableArray();

                self.selected = ko.observableArray([{ fullname: 'drop here', selected: ko.observable(false), isDefault: true}]);

                self.addSelected = function () {
                    for (var i = self.available().length - 1; i >= 0; i--) {
                        var contact = self.available()[i];
                        if (contact.selected()) {
                            self.selected.push(contact);
                            self.available.remove(contact);
                        }
                    }
                }

                self.select = function (contact) {
                    contact.selected(!contact.selected());
                }

                self.allowDrop = function (parent) {
                    return parent().length < self.maxSelected;
                }

                self.beforMove = function (arg) {
                    if (arg.item.isDefault) {
                        arg.cancelDrop = true;
                    }
                }
                self.afterMove = function (item) {

                }

            } //End model

            return contactList;

        });