    define(['AppManager', 'AppModels'
    , 'text!content/file2.txt' //Retrieves a content file ...
    , 'models/demo/homepage'        //A Model... in this case, for the page?
], function (app, models, someContent, page) {


    var modelName = 'demo';
    var model = function () {
        var self = this;
        self.page = page;

        self.page.header.data({ appTitle: ko.observable('The Page Title')});
        self.page.footer.data({ credits: 'By Christian Calderon - CJCA'});

        self.right = "RIGH SECTION";
        self.someStuff = someContent;

        //Model Functions
        self.clickMe = function () {
            toastr.info("HI!");
        };

        self.changeLeft = function () {
            //Sets the data needed by the new template
            //It could be another model as well...  just request it as such:
            //models.getModel("leftNavModelName");... and bind it then
            self.page.left.data({
                    title: "LEFT TITLE!",
                    other: 'Other Content...',
                    back: function () {
                        self.page.left.template('demo\\left-section');
                    }
                }
            );
            //Change it!
            self.page.left.template("demo\\left-section-2")
        };

        //Model Initialization

        self.load = function () {
            ko.applyBindings(self);
        };
        self.onInit = function () {
        }
    };

    //Registers the model with the app... if ya want da'
    models.register(modelName, new model());

});

