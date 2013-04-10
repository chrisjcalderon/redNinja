define(['AppModels',
        'models/bootstrap/contact'], function (models, contact) {

            var dialogID = "#contactModal";

            var contactDialog = function (formID) {

                var self = this;

                self.contact = ko.observable(new contact());

                self.isNew = ko.computed(function () {
                    return self.contact().isNew();
                });

                self.open = function () {
                    $(dialogID).modal('show')
                }

                self.close = function () {
                    $(dialogID).modal('hide')

                }

                self.cancel = function () {
                    self.close();
                    models.trigger(self, new models.message("ContactDialogEvent", self.contact(), { action: 'cancel' }));
                }


                self.save = function () {
                    self.close();
                    models.trigger(self, new models.message("ContactDialogEvent", self.contact(), { action: 'save', contact: self.contact() }));
                }

                self.createNew = function () {
                    self.contact(new contact());
                    self.open();
                }

                self.edit = function (obj) {
                    if (obj) {
                        self.contact(obj);
                        self.open();
                        return;
                    }
                    var data = new contact("Christian", "Calderon", "email@domain.com");
                    data.isNew(false);
                    self.contact(data)
                    self.open();

                }

            } //End model

            return contactDialog;

        });