define(['AppModels', 'models/misc/contact'
], function (models, contact) {


    var model = function (params) {
        var self = this;
        self.context = null;
        self.params = params;

        self.helloWorldText = ko.observable(params);
        self.contacts = ko.observableArray();
        //Edit Field

        self.current = ko.observable(new contact());

        self.remove = function (item) {
            if (self.current() === item) {
                self.current(new contact());
            }
            self.contacts.remove(item);
            toastr.success("Removed..");
        }


        self.add = function () {
            self.current().isNew(false);
            self.contacts.push(self.current());
            toastr.success("Added...");
            self.newItem();
        }

        self.edit = function (item) {
            self.current(item);
        }

        self.newItem = function () {
            self.current(new contact());
        }

        self.addContact = function (first, last, email, address) {
            var c = new contact(first, last, email, address);
            c.isNew(false);
            self.contacts.push(c);
        }

    }

    /*note, there are other ways on which a model can be returned, one is:
    return {
    get: function (params) {
    return new HelloWorld(params);
    }
    }
    in this case, you must define a "then" function in your model and callback a function that is passed as the first parameter and pass yourself
    a basic example is... (note, you can also pass a promise)
    self.then = function (fnc) {
    return fnc(self);
    }
    */

    //in this case, the same model will be always returned!!  if you need new instances every time, then use the approach above :)

    var contactModel = new model();
    for (var x = 0; x < 10; x++) {
        contactModel.addContact("First " + x, "Last", "firstlast" + x + "@redninja.com", "none");
    }

    return contactModel;

});
