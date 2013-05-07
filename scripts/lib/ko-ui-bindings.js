//Start Closure
//var viewModelOne = { ... };
//ko.applyBindingsToNode(containerElement, { template: { name: 'itemTemplate', foreach: items }, viewModelOne);

(function () {
    String.empty = "";
    String.hasValue = function (value) {
        return value != null && value != String.empty;
    };
    //Bindings

    //custom binding to initialize a jQuery UI dialog
    ko.bindingHandlers.jqDialog = {
        init: function (element, valueAccessor) {
            var options = ko.utils.unwrapObservable(valueAccessor()) || {};
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).dialog("destroy");
            });
        },
        update: function (element, valueAccessor) {
            var options = ko.utils.unwrapObservable(valueAccessor()) || {};

            if (options) {
                $(element).dialog(options);
            }
        }
    };

    //custom binding handler that opens/closes the dialog
    ko.bindingHandlers.openDialog = {
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            if (value) {
                $(element).dialog("open");
            } else {
                $(element).dialog("close");
            }
        }
    }

    //custom binding to initialize a jQuery UI button
    ko.bindingHandlers.jqButton = {
        init: function (element, valueAccessor) {
            var options = ko.utils.unwrapObservable(valueAccessor()) || {};

            //handle disposal
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).button("destroy");
            });

            $(element).button(options);
        },
        update: function (element, valueAccessor) {
            var options = ko.utils.unwrapObservable(valueAccessor()) || {};
            if (options) {
                $(element).button(options);
            }
        }
    };

    //custom binding to initialize a jQuery UI button
    ko.bindingHandlers.jqHideShow = {
        update: function (element, valueAccessor, allBindingsAccessor) {
            var options = ko.utils.unwrapObservable(valueAccessor()) || {};
            var allBindings = allBindingsAccessor();
            var action = ko.utils.unwrapObservable(options.action);

            if (action) {
                $(element).show("blind");
            } else {
                $(element).hide("blind");
            }
        }
    };


    ko.bindingHandlers.jqDatepicker = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            //initialize datepicker with some optional options
            var options = allBindingsAccessor().datepickerOptions || {};
            $(element).datepicker(options);

            //handle the field changing
            ko.utils.registerEventHandler(element, "change", function () {
                var observable = valueAccessor();
                observable($(element).datepicker("getDate"));
            });

            //handle disposal (if KO removes by the template binding)
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).datepicker("destroy");
            });

        },
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());

            //handle date data coming via json from Microsoft
            if (String(value).indexOf('/Date(') == 0) {
                value = new Date(parseInt(value.replace(/\/Date\((.*?)\)\//gi, "$1")));
            }

            current = $(element).datepicker("getDate");

            if (value - current !== 0) {
                $(element).datepicker("setDate", value);
            }
        }
    };

    ko.bindingHandlers.jqWidget = {
        update: function (element, valueAccessor, allBindingsAccessor) {
            var widgetBindings = _getJQWidgetBindings(element, valueAccessor, allBindingsAccessor);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element)[widgetBindings.widgetName]("destroy");
            });

            $(element)[widgetBindings.widgetName](widgetBindings.widgetOptions);
        }

    };

    function _getJQWidgetBindings(element, valueAccessor, allBindingsAccessor) {
        var value = valueAccessor(),
            myBinding = ko.utils.unwrapObservable(value),
            allBindings = allBindingsAccessor();

        if (typeof (myBinding) === 'string') {
            myBinding = { 'name': myBinding };
        }

        var widgetName = myBinding.name,
            widgetOptions = myBinding.options;

        // Sanity check: can't directly check that it's truly a _widget_, but
        // can at least verify that it's a defined function on jQuery:
        if (typeof $.fn[widgetName] !== 'function') {
            throw new Error("widget binding doesn't recognize '" + widgetName + "' as jQuery UI widget");
        }

        // Sanity check: don't confuse KO's 'options' binding with jqueryui binding's 'options' property
        if (allBindings.options && !widgetOptions && element.tagName !== 'SELECT') {
            throw new Error("widget binding options should be specified like this:\ndata-bind='widget: {name:\"" + widgetName + "\", options:{...} }'");
        }

        return {
            widgetName: widgetName,
            widgetOptions: widgetOptions
        };
    }


    ko.bindingHandlers.jqButtonset = {
        'init': function (element, valueAccessor, allBindingsAccessor) {
            var updateHandler = function () {
                var valueToWrite;
                if (element.type == "checkbox") {
                    valueToWrite = element.checked;
                } else if ((element.type == "radio") && (element.checked)) {
                    valueToWrite = element.value;
                } else {
                    return; // "checked" binding only responds to checkboxes and selected radio buttons
                }

                var modelValue = valueAccessor();
                if ((element.type == "checkbox") && (ko.utils.unwrapObservable(modelValue) instanceof Array)) {
                    // For checkboxes bound to an array, we add/remove the checkbox value to that array
                    // This works for both observable and non-observable arrays
                    var existingEntryIndex = ko.utils.arrayIndexOf(ko.utils.unwrapObservable(modelValue), element.value);
                    if (element.checked && (existingEntryIndex < 0)) modelValue.push(element.value);
                    else if ((!element.checked) && (existingEntryIndex >= 0)) modelValue.splice(existingEntryIndex, 1);
                } else if (ko.isWriteableObservable(modelValue)) {
                    if (modelValue() !== valueToWrite) { // Suppress repeated events when there's nothing new to notify (some browsers raise them)
                        modelValue(valueToWrite);
                    }
                } else {
                    var allBindings = allBindingsAccessor();
                    if (allBindings['_ko_property_writers'] && allBindings['_ko_property_writers']['checked']) {
                        allBindings['_ko_property_writers']['checked'](valueToWrite);
                    }
                }
            };
            ko.utils.registerEventHandler(element, "click", updateHandler);

            // IE 6 won't allow radio buttons to be selected unless they have a name
            if ((element.type == "radio") && !element.name) ko.bindingHandlers['uniqueName']['init'](element, function () {
                return true
            });
        },

        'update': function (element, valueAccessor) {
            /////////////// addded code to ko checked binding /////////////////
            var buttonSet = function (element) {

                // now update the css classes
                // Normally when knockout updates button, there
                // isn't an event to transfer new status
                // to buttonset label
                var buttonId = $(element).attr('id');
                if (buttonId) {
                    var buttonSetDiv = $(element).parent('.ui-buttonset');
                    var elementLabel = $(buttonSetDiv).find('label[for="' + buttonId + '"]');
                    if (elementLabel.length === 0) {
                        // was just a single button, so look for label
                        elementLabel = $(element).parent('*').find('label[for="' + buttonId + '"]');
                    }
                    // check to see if element is already configured
                    if (element.checked && !$(elementLabel).hasClass('ui-state-active')) {
                        $(elementLabel).addClass('ui-state-active');
                    }
                    if (!element.checked && $(elementLabel).hasClass('ui-state-active')) {
                        $(elementLabel).removeClass('ui-state-active');
                    }
                }
            };
            /////////////// end add /////////////////////////// 
            var value = ko.utils.unwrapObservable(valueAccessor());

            if (element.type == "checkbox") {
                if (value instanceof Array) {
                    // When bound to an array, the checkbox being checked represents its value being present in that array
                    element.checked = ko.utils.arrayIndexOf(value, element.value) >= 0;
                } else {
                    // When bound to anything other value (not an array), the checkbox being checked represents the value being trueish
                    element.checked = value;
                }
                /////////////// addded code to ko checked binding /////////////////
                buttonSet(element);
                /////////////// end add ///////////////////////////
                // Workaround for IE 6 bug - it fails to apply checked state to dynamically-created checkboxes if you merely say "element.checked = true"
                if (value && ko.utils.isIe6) element.mergeAttributes(document.createElement("<input type='checkbox' checked='checked' />"), false);
            } else if (element.type == "radio") {
                element.checked = (element.value == value);
                /////////////// addded code to ko checked binding /////////////////
                buttonSet(element);
                /////////////// end add ///////////////////////////
                // Workaround for IE 6/7 bug - it fails to apply checked state to dynamically-created radio buttons if you merely say "element.checked = true"
                if ((element.value == value) && (ko.utils.isIe6 || ko.utils.isIe7)) element.mergeAttributes(document.createElement("<input type='radio' checked='checked' />"), false);
            }
        }
    };

    /*
    <div class="btn-group">
    <button data-value="0" data-bind="checkedButtons: radioValue" class="btn btn-small">radio 0</button>
    <button data-value="1" data-bind="checkedButtons: radioValue" class="btn btn-small">radio 1</button>
    </div>
    <div class="btn-group">
    <button data-value="true" data-toggle="checkbox" data-bind="checkedButtons: checkboxValue" class="btn btn-small">true/false</button>
    </div>
    <div class="btn-group">
    <button data-value="a" data-toggle="checkbox" data-bind="checkedButtons: checkboxArray" class="btn btn-small">select a</button>
    <button data-value="b" data-toggle="checkbox" data-bind="checkedButtons: checkboxArray" class="btn btn-small">select b</button>
    </div>
    this.radioValue = ko.observable(0);
    this.checkboxArray = ko.observableArray([]);
    this.checkboxValue = ko.observable(true)
    */

    ko.bindingHandlers.jqCheckedButtons = {
        'init': function (element, valueAccessor, allBindingsAccessor) {
            var type = element.getAttribute('data-toggle') || 'radio';
            var updateHandler = function () {
                var valueToWrite;
                var isActive = !! ~element.className.indexOf('active');
                var dataValue = element.getAttribute('data-value');
                if (type == "checkbox") {
                    valueToWrite = !isActive;
                } else if (type == "radio" && !isActive) {
                    valueToWrite = dataValue;
                } else {
                    return; // "checkedButtons" binding only responds to checkbox and radio data-toggle attribute
                }

                var modelValue = valueAccessor();
                if ((type == "checkbox") && (ko.utils.unwrapObservable(modelValue) instanceof Array)) {
                    // For checkboxes bound to an array, we add/remove the checkbox value to that array
                    // This works for both observable and non-observable arrays
                    var existingEntryIndex = ko.utils.arrayIndexOf(ko.utils.unwrapObservable(modelValue), dataValue);
                    if (!isActive && (existingEntryIndex < 0))
                        modelValue.push(dataValue);
                    else if (isActive && (existingEntryIndex >= 0))
                        modelValue.splice(existingEntryIndex, 1);
                } else {
                    if (modelValue() !== valueToWrite) {
                        modelValue(valueToWrite);
                    }
                }
            };

            ko.utils.registerEventHandler(element, "click", updateHandler);
        },
        'update': function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            var type = element.getAttribute('data-toggle') || 'radio';

            if (type == "checkbox") {
                if (value instanceof Array) {
                    // When bound to an array, the checkbox being checked represents its value being present in that array
                    if (ko.utils.arrayIndexOf(value, element.getAttribute('data-value')) >= 0) {
                        ko.utils.toggleDomNodeCssClass(element, 'active', true);
                    }
                    else {
                        ko.utils.toggleDomNodeCssClass(element, 'active', false);
                    }

                } else {
                    // When bound to anything other value (not an array), the checkbox being checked represents the value being trueish
                    ko.utils.toggleDomNodeCssClass(element, 'active', value);
                }
            } else if (type == "radio") {
                ko.utils.toggleDomNodeCssClass(element, 'active', element.getAttribute('data-value') == value);
            }
        }
    };


    ko.bindingHandlers.jqTabs = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            ko.renderTemplate(tabsTemplate, bindingContext.createChildContext(valueAccessor()), { templateEngine: stringTemplateEngine }, element, "replaceChildren");

            var tabs = ko.utils.unwrapObservable(valueAccessor())
            config = ko.utils.unwrapObservable(allBindingsAccessor().tabsOptions) || {};

            if (config.enable && ko.isObservable(config.enable)) {
                config.enable.subscribe(function (enable) {
                    if (enable) {
                        $(element).tabs({ disabled: [] });
                    } else {
                        var index = 0;
                        var indexes = ko.utils.arrayMap(tabs, function () { return index++ });
                        $(element).tabs({ disabled: indexes });
                    }
                });

                config.enable = null;
            }

            if (config.selectedTab && ko.isObservable(config.selectedTab)) {
                var updating = false;
                var getIndex = function (tab) {
                    var index = ko.utils.arrayIndexOf(tabs, ko.utils.arrayFirst(tabs, function (item) {
                        return ko.utils.unwrapObservable(item.model) === tab;
                    }));
                    return index === -1 ? false : index;
                };

                var onSelectedChangeCallback = function (value) {
                    if (updating) return;

                    updating = true;
                    var newIndex = getIndex(value);
                    $(element).tabs("option", "active", newIndex);
                    updating = false;
                };

                config.active = getIndex(config.selectedTab());
                if (config.active === false) {
                    config.collapsible = true;
                }

                config.selectedTab.subscribe(onSelectedChangeCallback);

                config.select = function (event, ui) {
                    if (updating) return;

                    var selectedModel = ko.utils.unwrapObservable(tabs[ui.index].model);

                    if (config.onTabChanging !== undefined) {
                        var args = { cancel: false, currentModel: config.selectedTab(), selectedModel: selectedModel };
                        config.onTabChanging.call(viewModel, args);

                        if (args.cancel) return false;
                    }

                    updating = true;
                    config.selectedTab(selectedModel);
                    updating = false;
                };
            }

            var onHistory = function () {
                if (notNavigating) return;
                if (String.hasValue(window.location.hash)) {
                    navigating = true;
                    $(element).tabs("select", window.location.hash);
                    navigating = false;
                }
            };

            if (history && history.pushState) {
                var setState = function (state) {
                    history.pushState(state, null, state);
                };

                window.onpopstate = onHistory;
            }
            else if ($.address) {
                var setState = function (state) {
                    window.location.hash = state;
                };

                $.address.change(onHistory);
            }

            if (setState != null) {
                var orgSelect = config.select;
                var notNavigating = false;
                var navigating = false;
                config.select = function (event, ui) {
                    notNavigating = true;
                    result = true;

                    if (orgSelect)
                        result = orgSelect(event, ui);

                    if (!navigating) {
                        setState(ui.tab.hash);
                    }
                    notNavigating = false;
                    return result;
                };
            }

            $(element).tabs(config);

            return { controlsDescendantBindings: true };
        },
        update: function (element, valueAccessor, allBindingsAccessor) {
            var tabs = ko.utils.unwrapObservable(valueAccessor());

            ko.utils.arrayForEach(tabs, function (tab) {
                if (tab.enable.subscribed) return;
                tab.enable.subscribed = true; //Hack to avoid multiple subscriptions
                tab.enable.subscribe(function (enable) {
                    var index = ko.utils.arrayIndexOf(tabs, ko.utils.arrayFirst(tabs, function (item) {
                        return item == tab;
                    }));

                    if (enable) {
                        $(element).tabs("enable", index);
                    } else {
                        $(element).tabs("disable", index);
                    }

                });
            });

            if ($(element).tabs("length") == tabs.length) return;

            config = $(element).tabs("option");
            $(element).tabs("destroy").tabs(config);
        }

    };

    ko.TabViewModel = function (id, title, model, template) {
        this.id = ko.observable(id);
        this.title = ko.observable(title);
        this.model = ko.observable(model);
        this.template = template;
        this.enable = ko.observable(true);
    };

    //string template source engine
    var stringTemplateSource = function (template) {
        this.template = template;
    };

    stringTemplateSource.prototype.text = function () {
        return this.template;
    };

    var stringTemplateEngine = new ko.nativeTemplateEngine();
    stringTemplateEngine.makeTemplateSource = function (template) {
        return new stringTemplateSource(template);
    };

    var tabsTemplate = '<ul data-bind="foreach: $data">\
        <li>\
            <a data-bind="text: title, attr: { href: \'#tab-\' + id() }"></a>\
        </li>\
    </ul>\
    <!-- ko foreach: $data -->\
    <div data-bind="attr: { id: \'tab-\' + id() }">\
        <h2 data-bind="text: title"></h2>\
        <div data-bind="template: { name: template, data: model }"></div>\
    </div>\
    <!-- /ko -->';

    ko.bindingHandlers.label = {
        counter: 0,
        init: function (element, valueAccessor) {
            var options = ko.utils.unwrapObservable(valueAccessor()) || {};
            var wrapped = $(element);
            var id = wrapped.attr("id");
            if (!String.hasValue(id)) {
                id = "label-" + ko.bindingHandlers.label.counter++;
                wrapped.attr("id", id);
            }
            var label = $("<label/>");
            label.attr("for", id);
            if (options.title) {
                label.attr("title", options.title);
            }
            label.insertAfter(wrapped);

            ko.applyBindingsToNode(label[0], { text: options.caption });
        }
    };

    ko.bindingHandlers.valueWithInit = {
        init: function (element, valueAccessor, allBindingsAccessor, data) {
            var property = valueAccessor(),
                value = element.value;

            //create the observable, if it doesn't exist 
            if (!ko.isWriteableObservable(data[property])) {
                data[property] = ko.observable();
            }

            data[property](value);

            ko.applyBindingsToNode(element, { value: data[property] });
        }
    };

    //https://github.com/ivaynberg/select2/wiki/Knockout.js-Integration
    ko.bindingHandlers.select2 = {
        init: function(element, valueAccessor, allBindingsAccessor) {
            var obj = valueAccessor(),
                allBindings = allBindingsAccessor(),
                lookupKey = allBindings.lookupKey;
            $(element).select2(obj);
            if (lookupKey) {
                var value = ko.utils.unwrapObservable(allBindings.value);
                $(element).select2('data', ko.utils.arrayFirst(obj.data.results, function(item) {
                    return item[lookupKey] === value;
                }));
            }

            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                $(element).select2('destroy');
            });
        },
        update: function(element) {
            $(element).trigger('change');
        }
};

    //End Closure
} ());
