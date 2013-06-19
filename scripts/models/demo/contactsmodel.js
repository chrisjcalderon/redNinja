define(['AppModels'], function (models) {
    var ContactModel = function () {
        var self = this;
        
        self.name = "Chris";
        self.firstName = ko.observable("Hello World - " + ContactModel.instance++);

        self.what = function () {
            models.log.info("HEY YOU!! - " + self.firstName());
        };

        self.unloadMe = function () {
            if (self._viewModel) {
                $("#" + self._viewModel.container).fadeOut("slow", self._destroy);
            }
        };
        //models.listen(self, "OpenContactDialog", self.what)
    };

    ContactModel.instance = 0;

    // Replaces the 'shorthand' function from the first example 
    // This is returned as a module to the require call
    //exports.action = 
    return function () {
        return new ContactModel();
    }

});
