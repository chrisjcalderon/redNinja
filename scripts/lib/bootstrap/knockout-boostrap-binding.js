/*
               jqueryui: { 
                 ui: "autocomplete", 
                 options: { 
                   source: productCompletions(),
                   minLength: 0 } 
               }' />
*/

define([], function () {



    ko.bindingHandlers['bootstrap'] = {
        update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var bootstrapBindings = _getbootstrapBindings(element, valueAccessor, allBindingsAccessor, viewModel);
        
            $(element)[bootstrapBindings.componentName](bootstrapBindings.componentOptions);
        }
    };
    
    function _getbootstrapBindings(element, valueAccessor, allBindingsAccessor, viewModel) {
 
        var value = valueAccessor(),
            myBinding = ko.utils.unwrapObservable(value),
            allBindings = allBindingsAccessor();
        
        if (typeof(myBinding) === 'string') {
            myBinding = {'ui': myBinding};
        }
        
        var componentName = myBinding.component,
            componentOptions = myBinding.options; // ok if undefined
        
        if (typeof $.fn[componentName] !== 'function') 
        {
            throw new Error("Bootstrap binding doesn't recognize '" + componentName 
                + "' as jQuery UI component");
        }
        
       
        if (allBindings.options && !componentOptions && element.tagName !== 'SELECT') {
            throw new Error("bootstrap binding options should be specified like this:\n"
                + "  data-bind='bootstrap: {component:32f00c915f33483b915ab82fa06f475f1c9946a3quot;" + 
                     componentName + "32f00c915f33483b915ab82fa06f475f1c9946a3quot;, options:{...} }'");
        }
        
        return {
            componentName: componentName,
            componentOptions: componentOptions
        };
    }

});