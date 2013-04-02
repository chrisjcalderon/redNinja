define(['require','exports','jquery'] , function (require, exports,$) {
    //'dialog', 
    //exports.action = 
    return {        
        title: ko.observable('Default Title'),
        open : ko.observable(false),
        close: function() { this.open(false); }
    }
});
