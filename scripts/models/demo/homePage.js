define([], function () {
    var HomePage = {
        appTitle:  ko.observable("Application Title"),
        header: {
            template:ko.observable('demo\\header'),
            data : ko.observable()
        },
        footer: {
            template:ko.observable('demo\\footer'),            
            data    : ko.observable()
        },
        user: {
            fullName : ko.observable("")
        },
        left: {
            template:ko.observable('demo\\left-section'),
            items: ko.observable(),
            data : ko.observable()
        }
        
   }     

   return HomePage;

});
