angular.module('ratefastApp')
    .directive('customDatepicker', function ($compile) {
        return {
            replace: true,
            showButtonPanel: true,
            template: '<input type="text" my-date ui-date="dateOptions" />',
            scope: {
                ngModel: '=',
                //dateOptions: '=',
            },
            link: function ($scope, $element, $attrs, $controller) {
                
                var $button = $element.find('button');
                var $input = $element.find('input');
                $button.on('click', function () {
                    if ($input.is(':focus')) {
                        $input.trigger('blur');
                    } else {
                        $input.trigger('focus');
                    }
                });
            },
			controller: function($scope) {
			  $scope.dateOptions = {
				startingDay: 1,
				changeMonth: true,
				changeYear: true,
				showAnim: "clip",
				clearBtn: true,
				yearRange: "-125:+0",				
				maxDate: new Date(),
				minDate: new Date(new Date().setFullYear(new Date().getFullYear() + -125))
			  };
			}			
        };
    })
	.directive('birthDatepicker', function ($compile) {
        return {
            replace: true,
            showButtonPanel: true,
            template: '<input type="text" my-date ui-date="dateOptions2" />',
            scope: {
                ngModel: '=',
                //dateOptions: '=',
            },
            link: function ($scope, $element, $attrs, $controller) {
                
                var $button = $element.find('button');
                var $input = $element.find('input');
                $button.on('click', function () {
                    if ($input.is(':focus')) {
                        $input.trigger('blur');
                    } else {
                        $input.trigger('focus');
                    }
                });
            },
			controller: function($scope) {
			  $scope.dateOptions2 = {
				startingDay: 1,
				changeMonth: true,
				changeYear: true,
				showAnim: "clip",
				clearBtn: true,
				yearRange: "-125:+0",
				defaultDate: '-18Y',
				/*maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + -10)),*/
				maxDate: new Date(),
				minDate: new Date(new Date().setFullYear(new Date().getFullYear() + -125))
			  };
			}
			/*,controller: function($scope)
			{
					// check if it was defined.  If not - set a default
				 $scope.dateOptions = angular.isDefined($scope.dateOptions) ? $scope.dateOptions : {startingDay: 1,changeMonth: true,changeYear: true,showAnim: "clip",clearBtn: true,yearRange: "-125:+0",defaultDate: '-18Y',maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + -10)),minDate: new Date(new Date().setFullYear(new Date().getFullYear() + -125))}
			}*/
        };
    })
    .directive('customDatepicker2', function ($compile) {
        return {
            replace: true,
            showButtonPanel: true,
            template: '<input type="text" my-date ui-date="dateOptions2" />',
            scope: {
                ngModel: '=',
                dateOptions: '=',
            },
            link: function ($scope, $element, $attrs, $controller) {
                
                var $button = $element.find('button');
                var $input = $element.find('input');
                $button.on('click', function () {
                    if ($input.is(':focus')) {
                        $input.trigger('blur');
                    } else {
                        $input.trigger('focus');
                    }
                });
            }
        };
    })
    .controller('myController', function ($scope) {
        $scope.dateOptions = {
            minDate: -20,
            maxDate: "+1M +10D"
        };
		
		/*$scope.dateOptions = {
        startingDay: 1,
        changeMonth: true,
        changeYear: true,
        showAnim: "clip",
        clearBtn: true,
        yearRange: "-125:+0",
        defaultDate: '-18Y',
        maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + -10)),
				minDate: new Date(new Date().setFullYear(new Date().getFullYear() + -125))
    };*/
        /* Logic goes here */
    });

/*global angular */
/*
 jQuery UI Datepicker plugin wrapper

 @note If ≤ IE8 make sure you have a polyfill for Date.toISOString()
 @param [ui-date] {object} Options to pass to $.fn.datepicker() merged onto uiDateConfig
 */

angular.module('ui.date', [])

.constant('uiDateConfig', {})

.directive('uiDate', ['uiDateConfig', 'uiDateConverter', '$filter', '$timeout', function (uiDateConfig, $timeout, $filter, uiDateConverter) {
    'use strict';
    var options, futuredateoptions;
    options = {
        showButtonPanel: true,
        closeText: 'X',
        changeMonth: true,
        changeYear: true,
        yearRange: '1910:-0',
        maxDate: new Date
    };
    futuredateoptions = {
        showButtonPanel: true,
        closeText: 'X',
        changeMonth: true,
        changeYear: true,
        yearRange: '1910:-0'
    };
    angular.extend(options, futuredateoptions, uiDateConfig);
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, controller) {
            var getOptions = function () {
                return angular.extend({}, uiDateConfig, scope.$eval(attrs.uiDate));
            };
            var initDateWidget = function () {
                var showing = false;
                var opts = getOptions();

                // If we have a controller (i.e. ngModelController) then wire it up
                if (controller) {

                    // Set the view value in a $apply block when users selects
                    // (calling directive user's function too if provided)
                    var _onSelect = opts.onSelect || angular.noop;
                    opts.onSelect = function (value, picker) {
                        scope.$apply(function () {
                            showing = true;
                            controller.$setViewValue(element.datepicker('getDate'));
                            _onSelect(value, picker);
                            element.blur();
                        });
                    };

                    var _beforeShow = opts.beforeShow || angular.noop;
                    opts.beforeShow = function (input, picker) {
                        showing = true;
                        _beforeShow(input, picker);
                    };

                    var _onClose = opts.onClose || angular.noop;
                    opts.onClose = function (value, picker) {
                        showing = false;
                        _onClose(value, picker);
                    };
                    element.off('blur.datepicker').on('blur.datepicker', function () {
                        if (!showing) {
                            scope.$apply(function () {
                                element.datepicker('setDate', element.datepicker('getDate'));
                                controller.$setViewValue(element.datepicker('getDate'));
                            });
                        }
                    });

                    // Update the date picker when the model changes
                    
                    controller.$render = function () {
                        var date = controller.$modelValue;
                        if (angular.isDefined(date) && date !== null && !angular.isDate(date)) {
                            
                            if (angular.isString(controller.$modelValue)) {
                                try {
                                    date = uiDateConverter.stringToDate(attrs.uiDateFormat, controller.$modelValue);
                                } catch (e) {
                                    date = $filter('date')(controller.$modelValue, "MM/dd/yyyy");
                                }
                            } else {
                                throw new Error('ng-Model value must be a Date, or a String object with a date formatter - currently it is a ' + typeof date + ' - use ui-date-format to convert it from a string');
                            }

                        }
                        element.datepicker('setDate', date);
                    };
                }
                // Check if the element already has a datepicker.
                if (element.data('datepicker')) {
                    // Updates the datepicker options
                    element.datepicker('option', opts);
                    element.datepicker('refresh');
                } else {
                    // Creates the new datepicker widget
                    element.datepicker(opts);

                    //Cleanup on destroy, prevent memory leaking
                    element.on('$destroy', function () {
                        element.datepicker('destroy');
                    });
                }

                if (controller) {
                    // Force a render to override whatever is in the input text box
                    controller.$render();
                }
            };
            // Watch for changes to the directives options
            scope.$watch(getOptions, initDateWidget, true);
        }
    };
}
]).factory('uiDateConverter', ['uiDateFormatConfig', function (uiDateFormatConfig) {

    function dateToString(dateFormat, value) {
        dateFormat = dateFormat || uiDateFormatConfig;
        if (value) {
            if (dateFormat) {
                return jQuery.datepicker.formatDate(dateFormat, value);
            }

            if (value.toISOString) {
                return value.toISOString();
            }
        }
        return null;
    }

    function stringToDate(dateFormat, value) {
        debugger;
        dateFormat = dateFormat || uiDateFormatConfig;
        if (angular.isString(value)) {
            if (dateFormat) {
                return jQuery.datepicker.parseDate(dateFormat, value);
            }

            var isoDate = new Date(value);
            return isNaN(isoDate.getTime()) ? null : isoDate;
        }
        return null;
    }

    return {
        stringToDate: stringToDate,
        dateToString: dateToString
    };

}])

.constant('uiDateFormatConfig', '')

.directive('uiDateFormat', ['uiDateFormatConfig', function (uiDateFormatConfig) {
    var directive = {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            var dateFormat = attrs.uiDateFormat || uiDateFormatConfig;
            if (dateFormat) {
                // Use the datepicker with the attribute value as the dateFormat string to convert to and from a string
                modelCtrl.$formatters.push(function (value) {
                    if (angular.isString(value)) {
                        return jQuery.datepicker.parseDate(dateFormat, value);
                    }
                    return null;
                });
                modelCtrl.$parsers.push(function (value) {
                    if (value) {
                        return jQuery.datepicker.formatDate(dateFormat, value);
                    }
                    return null;
                });
            } else {
                // Default to ISO formatting
                modelCtrl.$formatters.push(function (value) {
                    if (angular.isString(value)) {
                        return new Date(value);
                    }
                    return null;
                });
                modelCtrl.$parsers.push(function (value) {
                    if (value) {
                        return value.toISOString();
                    }
                    return null;
                });
            }
        }
    };
    return directive;
}])

.filter('datenewFormat', function ($filter) {
    return function (input) {
        if (input == null) { return ""; }

        var _date = $filter('date')(new Date(input), 'MM/dd/yyyy');

        return _date;

    };
})
.filter('dateFilter', function ($filter) {
    return function (input) {
        if (input == null) { return ""; }

        var _date = $filter('date')(new Date(input), 'dd-MMM-yyyy');

        return _date;

    };
});