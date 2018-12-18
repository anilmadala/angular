angular.module('ratefastApp')
.directive('noSpecialChar', function() { //This directive is used to restrict special characters, other than underscore and space, in injured body system
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function(scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function(inputValue) {
          if (inputValue == null)
            return ''
          //cleanInputValue = inputValue.replace(/[^\-\w\s]/gi, '');
		  var cleanInputValue = inputValue.replace(/[^\a-z\A-Z\s]/gi, '');
		  //cleanInputValue = inputValue.replace(/[^\_\w]/gi, '');		  
          if (cleanInputValue != inputValue) {
            modelCtrl.$setViewValue(cleanInputValue);
            modelCtrl.$render();
          }
          return cleanInputValue;
        });
      }
    }
  })
  .directive('onlyNumNoSpecialCharExceptHyphen', function() { //This directive is to allow alphabets, digits, space and hyphen characters
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function(scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function(inputValue) {
          if (inputValue == null)
            return ''
          //cleanInputValue = inputValue.replace(/[^\-\w\s]/gi, '');
		  //cleanInputValue = inputValue.replace(/[^-\a-z\A-Z\s]/gi, '');
		  var cleanInputValue = inputValue.replace(/[^\-\w\s]/gi, '');		  
          if (cleanInputValue != inputValue) {
            modelCtrl.$setViewValue(cleanInputValue);
            modelCtrl.$render();
          }
          return cleanInputValue;
        });
      }
    }
  })
  .directive('onlyNumAndHyphen', function() { //This directive is to allow digits and hyphen. No alphabets or other special characters
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function(scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function(inputValue) {
          if (inputValue == null)
            return ''         
		  var cleanInputValue = inputValue.replace(/[^\-\d\s]/gi, '');		  
          if (cleanInputValue != inputValue) {
            modelCtrl.$setViewValue(cleanInputValue);
            modelCtrl.$render();
          }
          return cleanInputValue;
        });
      }
    }
  })
.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {

            modelCtrl.$parsers.push(function (inputValue) {
                // this next if is necessary for when using ng-required on your input. 
                // In such cases, when a letter is typed first, this parser will be called
                // again, and the 2nd time, the value will be undefined

                if (inputValue == undefined) return ''
                //transforming the model value to only numbers
                var transformedInput = inputValue.replace(/[^0-9 +\-]/g, '');
                if (scope.rangeto) {
                    var maxrange = scope.rangeto.replace(/[^0-9 +\-]/g, '');
                    // If minimum range is not defined then set it to 0
                    if (!scope.rangefrom) {
                        scope.rangefrom = '0';
                    }
                    var minrange = scope.rangefrom.replace(/[^0-9 +\-]/g, '');
                    //Check the condition for min & max length allowed
                    if (parseInt(transformedInput) > parseInt(maxrange) || parseInt(transformedInput) < parseInt(minrange)) {

                        transformedInput = transformedInput.substr(0, transformedInput.length - 1);
                        if (scope.alertmessage) {
                            //alert(scope.alertmessage + ' ' + scope.rangefrom + " to " + scope.rangeto);
                            alert(scope.alertmessage);
                        }
                    }
                }
                if (transformedInput != inputValue) {

                    //Setting the new value to the model
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }

                return transformedInput;
            });
        }
    };
})
.directive('numbersOnlycustom', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {

            modelCtrl.$parsers.push(function (inputValue) {
                // this next if is necessary for when using ng-required on your input. 
                // In such cases, when a letter is typed first, this parser will be called
                // again, and the 2nd time, the value will be undefined


                if (inputValue == undefined) return ''
                //transforming the model value to only numbers
                var transformedInput = inputValue.replace(/[^0-9 +\-\.]/g, '');
				//var transformedInput = inputValue.replace(/^[0-9]*(\.[0-9]{1,2})?$);
                if (scope.rangeto) {
                    var maxrange = scope.rangeto.replace(/[^0-9 +\-\.]/g, '');
                    // If minimum range is not defined then set it to 0
                    if (!scope.rangefrom) {
                        scope.rangefrom = '0';
                    }
                    var minrange = scope.rangefrom.replace(/[^0-9 +\-]/g, '');
                    //Check the condition for min & max length allowed
                    if (parseInt(transformedInput) > parseInt(maxrange) || parseInt(transformedInput) < parseInt(minrange)) {

                        transformedInput = transformedInput.substr(0, transformedInput.length - 1);
                        if (scope.alertmessage) {
                            //alert(scope.alertmessage + ' ' + scope.rangefrom + " to " + scope.rangeto);
                            alert(scope.alertmessage);
                        }
                    }
                }

                debugger;

                if (transformedInput.match(/^\d*(.\d{0,1})?$/) == null) {
                    transformedInput = transformedInput.slice(0, -1);
                }
                if (transformedInput != inputValue) {
                    //Setting the new value to the model
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
})
.directive('numbersonlyTwodecimalplaces', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {

            modelCtrl.$parsers.push(function (inputValue) {
                // this next if is necessary for when using ng-required on your input. 
                // In such cases, when a letter is typed first, this parser will be called
                // again, and the 2nd time, the value will be undefined


                if (inputValue == undefined) return ''
                //transforming the model value to only numbers
                var transformedInput = inputValue.replace(/[^0-9 +\-\.\0-9]*/g, '');				
				//var transformedInput = inputValue.replace(/^[0-9]*(\.[0-9]{1,2})?$);
				//var transformedInput = inputValue.replace(/^[\d.\d]+/g, '');
                if (scope.rangeto) {
                    var maxrange = scope.rangeto.replace(/[^0-9 +\-\.]/g, '');
                    // If minimum range is not defined then set it to 0
                    if (!scope.rangefrom) {
                        scope.rangefrom = '0';
                    }
                    var minrange = scope.rangefrom.replace(/[^0-9 +\-]/g, '');
                    //Check the condition for min & max length allowed
                    if (parseInt(transformedInput) > parseInt(maxrange) || parseInt(transformedInput) < parseInt(minrange)) {

                        transformedInput = transformedInput.substr(0, transformedInput.length - 1);
                        if (scope.alertmessage) {
                            //alert(scope.alertmessage + ' ' + scope.rangefrom + " to " + scope.rangeto);
                            alert(scope.alertmessage);
                        }
                    }
                }

                debugger;

                if (transformedInput.match(/^\d*(.\d{0,1})?$/) == null) {
                    transformedInput = transformedInput.slice(0, -1);
                }
                if (transformedInput != inputValue) {
                    //Setting the new value to the model
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
})
.directive('numbersOnlynochars', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {

            modelCtrl.$parsers.push(function (inputValue) {
                // this next if is necessary for when using ng-required on your input. 
                // In such cases, when a letter is typed first, this parser will be called
                // again, and the 2nd time, the value will be undefined

                if (inputValue == undefined) return ''
                //transforming the model value to only numbers
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if (scope.rangeto) {
                    var maxrange = scope.rangeto.replace(/[^0-9]/g, '');
                    // If minimum range is not defined then set it to 0
                    if (!scope.rangefrom) {
                        scope.rangefrom = '0';
                    }
                    var minrange = scope.rangefrom.replace(/[^0-9]/g, '');
                    //Check the condition for min & max length allowed
                    if (parseInt(transformedInput) > parseInt(maxrange) || parseInt(transformedInput) < parseInt(minrange)) {

                        transformedInput = transformedInput.substr(0, transformedInput.length - 1);
                        if (scope.alertmessage) {
                            //alert(scope.alertmessage + ' ' + scope.rangefrom + " to " + scope.rangeto);
                            alert(scope.alertmessage);
                        }
                    }
                }
                if (transformedInput != inputValue) {
                    //Setting the new value to the model
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                transformedInput = Math.abs(transformedInput);
                return transformedInput;
            });
        }
    };
})
.directive('validateBlur', function ($window) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            var inputValue = element.val();
            var transformedInput = inputValue.replace(/[^0-9 +\-\.]/g, '');
            debugger;
            element.bind('blur', function (e) {               
                var inputValue = element.val();
                var transformedInput = inputValue.replace(/[^0-9 +\-\.]/g, '');
                if (scope.rangeto) {
                    var maxrange = scope.rangeto.replace(/[^0-9 +\-\.]/g, '');
                    if (!scope.rangefrom) {
                        scope.rangefrom = '0';
                    }
                    var minrange = scope.rangefrom.replace(/[^0-9 +\-\.]/g, '');
                    if (parseInt(transformedInput) > parseInt(maxrange) || parseInt(transformedInput) < parseInt(minrange)) {
                        transformedInput = '';//transformedInput.substr(0, transformedInput.length - 1);

                        if (scope.alertmessage) {
                            //alert(scope.alertmessage + ' ' + scope.rangefrom + " to " + scope.rangeto);
                            alert(scope.alertmessage);
                        }
                    }
                }
                if (transformedInput != inputValue) {

                    //Setting the new value to the model
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    }
})
.directive('validateBlurnochars', function ($window) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            var inputValue = element.val();
            var transformedInput = inputValue.replace(/[^0-9]/g, '');               
            element.bind('blur', function (e) {                    
                var inputValue = element.val();
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if (scope.rangeto) {
                    var maxrange = scope.rangeto.replace(/[^0-9]/g, '');
                    if (!scope.rangefrom) {
                        scope.rangefrom = '0';
                    }
                    var minrange = scope.rangefrom.replace(/[^0-9]/g, '');
                    if (parseInt(transformedInput) > parseInt(maxrange) || parseInt(transformedInput) < parseInt(minrange)) {
                        transformedInput = '';//transformedInput.substr(0, transformedInput.length - 1);

                        if (scope.alertmessage) {
                            //alert(scope.alertmessage + ' ' + scope.rangefrom + " to " + scope.rangeto);
                            alert(scope.alertmessage);
                        }
                    }
                }
                if (transformedInput != inputValue) {

                    //Setting the new value to the model
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    }
})
.directive('validateBlurcustom', function ($window) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            var inputValue = element.val();
            var transformedInput = inputValue.replace(/[^0-9 +\-\.]/g, '');
            debugger;
            element.bind('blur', function (e) {
                debugger
                var inputValue = element.val();
                var transformedInput = inputValue.replace(/[^0-9 +\-\.]/g, '');
                if (transformedInput != '') {
                    if (scope.rangeto) {
                        var maxrange = scope.rangeto.replace(/[^0-9 +\-]/g, '');
                        if (!scope.rangefrom) {
                            scope.rangefrom = '0';
                        }
                        var minrange = scope.rangefrom.replace(/[^0-9 +\-]/g, '');
                        if (parseInt(transformedInput) > parseInt(maxrange) || parseInt(transformedInput) < parseInt(minrange)) {
                            transformedInput = transformedInput.substr(0, transformedInput.length - 1);
                            if (scope.alertmessage) {
                                //alert(scope.alertmessage + ' ' + scope.rangefrom + " to " + scope.rangeto);
                                alert(scope.alertmessage);
                            }
                        }
                    }
                }
                if (transformedInput != inputValue) {

                    //Setting the new value to the model
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    }
})
.directive('myDate', ['$timeout', '$filter', function ($timeout, $filter) {
    return {
        require: 'ngModel',
        link: function ($scope, $element, $attrs, $ctrl) {

            var dateFormat = 'MM/dd/yyyy';
            $ctrl.$parsers.push(function (viewValue) {

                //convert string input into moment data model
                var pDate = Date.parse(viewValue);
                if (isNaN(pDate) === false) {
                    return new Date(pDate);
                }
                return undefined;

            });
            $ctrl.$formatters.push(function (modelValue) {
                var pDate = Date.parse(modelValue);
                if (isNaN(pDate) === false) {
                    return $filter('date')(new Date(pDate), dateFormat);
                }
                return undefined;
            });
        }
    };
}])
.directive('numbercharOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                // this next if is necessary for when using ng-required on your input. 
                // In such cases, when a letter is typed first, this parser will be called
                // again, and the 2nd time, the value will be undefined
                if (inputValue == undefined) return ''
                var transformedInput = inputValue.replace(/[^a-zA-Z0-9._-]/g, '');
                if (transformedInput != inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }

                return transformedInput;
            });
        }
    };
})
.directive('charOnly', function () {

    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                // this next if is necessary for when using ng-required on your input. 
                // In such cases, when a letter is typed first, this parser will be called
                // again, and the 2nd time, the value will be undefined
                if (inputValue == undefined) return ''
                var transformedInput = inputValue.replace(/[^a-zA-Z]/g, '');
                if (transformedInput != inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }

                return transformedInput;
            });
        }
    };
})
.directive('firstcharOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                // this next if is necessary for when using ng-required on your input. 
                // In such cases, when a letter is typed first, this parser will be called
                // again, and the 2nd time, the value will be undefined
                if (inputValue == undefined) return ''
                if (inputValue.length == '1') {
                    var transformedInput = inputValue.replace(/[^a-zA-Z]/g, '');
                    if (transformedInput != inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }

                    return transformedInput;
                }
            });
        }
    };
});