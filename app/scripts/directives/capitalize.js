angular.module('ratefastApp')
.directive('capitalizeFirst', function (uppercaseFilter) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            
            var capitalize = function (inputValue) {
                if (inputValue) {
                    var input = inputValue.toLowerCase();
                    var capitalized = input.substring(0, 1).toUpperCase() + input.substring(1);
                    if (capitalized !== inputValue) {
                        modelCtrl.$setViewValue(capitalized);
                        modelCtrl.$render();
                    }
                    return capitalized;
                }
            }
            modelCtrl.$parsers.push(capitalize);
            capitalize(scope[attrs.ngModel]);
        }
    };
}).directive('capitalizefull', function (uppercaseFilter) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            
            var capitalize = function (inputValue) {
                if (inputValue) {
                    var input = inputValue.toLowerCase();
					var inputArr= input.split(' ');
					var capitalized ='';
					for(var i=0; i<inputArr.length;i++)
					{
						capitalized = capitalized + inputArr[i].substring(0, 1).toUpperCase() + inputArr[i].substring(1) + ' ';						
					}
					capitalized = ltrim(trim(capitalized));
					if (capitalized !== inputValue) {
						modelCtrl.$setViewValue(capitalized);
						modelCtrl.$render();
					}
                    
                    return capitalized;
                }
            }
            modelCtrl.$parsers.push(capitalize);
            capitalize(scope[attrs.ngModel]);
        }
    };
}).directive('buttonPopup', function () {
    
    return {
        restrict: 'A',
        controller: 'popupButtonCtrl',
        templateUrl: "/partials/popupbuttonctrl.html"
    };
}).directive('addAnother', function () {
    
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/priorinjuryaddanother.html",
        controller: 'PriorInjuryAddAnotherCtrl'
    };
}).directive('addanotherPriorinjuryshoulder', function () {
    
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/priorinjuryshoulderaddanother.html",
        controller: 'PriorInjuryShoulderAddAnotherCtrl'
    };
}).directive('addanotherPriorinjuryknee', function () {
    
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/priorinjurykneeaddanother.html",
        controller: 'PriorInjuryKneeAddAnotherCtrl'
    };
}).directive('addanotherSurjery', function () {
    
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/surgeryinjuryaddanother.html",
        controller: 'SurgeryInjuryAddAnotherCtrl'
    };
}).directive('addanotherSurjeryshoulder', function () {
    
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/surgeryinjuryshoulderaddanother.html",
        controller: 'SurgeryInjuryShoulderAddAnotherCtrl'
    };
}).directive('addanotherSurjeryknee', function () {
    
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/surgeryinjurykneeaddanother.html",
        controller: 'SurgeryInjuryKneeAddAnotherCtrl'
    };
}).directive('addanotherTreatmentnsaids', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/addanothertreatment.html",
        controller: 'addanotherTreatmentNsaidCtrl'
    };
}).directive('addanotherTreatmentchild', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/addanothertreatment.html",
        controller: 'addanotherTreatmentChildCtrl'
    };
}).directive('diagnosticComponent', function () {
    return {
        require: 'ngModel',
        templateUrl: "/partials/addanotherdiagnostic.html",
        controller: 'DiagnosticCtrl'
    };
}).directive('addanotherBiologicalsibling', function () {
    
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/Addanotherbiologicalsibling.html",
        //controller: 'AddanotherbiologicalsiblingCtrl'
        controller: 'AddanotherbiologicalsiblingCtrl'
    }
}).directive('addanotherXraydignostictestresult', function () {
    
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/addanotherxraydignostictestresult.html",
        //controller: 'AddanotherbiologicalsiblingCtrl'
        controller: 'addanotherxraydignostictestresultCtrl'
    }
}).directive('addanotherMrictdignostictestresult', function () {
    
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/addanothermrictdignostictestresult.html",
        //controller: 'AddanotherbiologicalsiblingCtrl'
        controller: 'addanothermrictdignostictestresultCtrl'
    }
}).directive('addanotherdiagnosticLabel', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/addanotherdiagnosticlabel.html",
        controller: 'addanotherDiagnosticlabelCtrl'
    }
}).directive('painassessmentLoop', function () {
    return {
        require: 'ngModel',
        templateUrl: "/partials/painassessmentloop.html",
        controller: 'painassessmentloopCtrl'
    }
}).directive('labelHidden', function () {
    return {
        require: 'ngModel',
        templateUrl: "/partials/labelhidden.html",
        controller: 'labelhiddenCtrl'
    }
}).directive('billingCalculator', function () {
    
    return {
        require: 'ngModel',
        templateUrl: "/partials/billingcalculator.html",
        controller: 'billingcalculatorCtrl'
    }
}).filter('addClass', function () {
        return function (text, opt) {
            var i;
            
            $.each(opt.scope.items, function (index, item) {
                
                if (item.id === opt.item.id) {
                    i = index;
                    return false;
                }
            });
            var elem = angular.element("select > option[value='" + i + "']");
            var classTail = opt.className;
            
            if (opt.eligible) {
                $(elem).removeClass().addClass(classTail);
            } else {
                elem.removeClass(classTail);
            }
            return text;
        }
}).filter('map', function () {
    return function (input, propName) {
        var FinalArray;
        var inputArray = new Array;
        if (input) {
            var inputArray = input.map(function (item) {
                if (item == 'NSAIDs' || item == 'Tylenol') {
                    return item;
                } else if (item.toLowerCase() == 'ache') {

                    return 'aching';
                } else {
                    return item.toLowerCase();
                }
            });
            if (inputArray.length > 0) {
                if (inputArray.length > 1) {
                    var insertPosition = inputArray.length - 1;
                    var array = inputArray;
                    var firstArray = array.splice(0, insertPosition);
                    FinalArray = firstArray.join(', ') + ' and ' + array.join(', ');
                    
                }
                else {
                    FinalArray = inputArray.join();
                }
            }
        }
        return FinalArray;
    };
}).filter('mapdefault', function () {
    return function (input, propName) {
        var inputArray = new Array;
        var inputArray = input.map(function (item) {
            return item;
        });
        if (inputArray.length > 0) {
            if (inputArray.length > 1) {
                var insertPosition = inputArray.length - 1;
                var array = inputArray;
                var firstArray = array.splice(0, insertPosition);
                var FinalArray = firstArray.join(', ') + ' and ' + array.join(', ');
                
            }
            else {
                var FinalArray = inputArray.join();
            }
        }
        return FinalArray;
    };
}).filter('onlyCommaSeparated', function () {
    return function (input, propName) {
        var inputArray = new Array;
        var inputArray = input.map(function (item) {
            return item;
        });
        if (inputArray.length > 0) {
            var FinalArray = inputArray.join(', ');
        }
        return FinalArray;
    };
}).filter('appendPeriod', function ($filter) {
    return function (input) {
        var Htmlstring = '';
        if (input) {
            parser = new DOMParser();
            doc = parser.parseFromString(input, "text/html");

            for (var i = 0; i < doc.getElementsByTagName('p').length; i++) {
                Htmlstring += doc.getElementsByTagName('p')[i].innerHTML + ' ';
            }
            Htmlstring = Htmlstring.trim();
            // check string end with '.' 
            if (Htmlstring.lastIndexOf('.') != Htmlstring.length - 1 && Htmlstring.lastIndexOf('!') != Htmlstring.length - 1 && Htmlstring.lastIndexOf('?') != Htmlstring.length - 1 && Htmlstring.lastIndexOf('"') != Htmlstring.length - 1 && Htmlstring.lastIndexOf("'") != Htmlstring.length - 1) {
                Htmlstring = Htmlstring + '.';
            }
            Htmlstring = $filter('capitalize')(Htmlstring);
        }
        return Htmlstring;
    }
}).filter('capitalizefull', function() {
    return function(input) {
		if (input) {
			var input = input.toLowerCase();
			var inputArr= input.split(' ');
			var capitalized ='';
			for(var i=0; i<inputArr.length;i++)
			{
				capitalized = capitalized + inputArr[i].substring(0, 1).toUpperCase() + inputArr[i].substring(1) + ' ';						
			}
			capitalized = capitalized.trim();
			/*if (capitalized !== inputValue) {
				modelCtrl.$setViewValue(capitalized);
				modelCtrl.$render();
			}*/						
		}
		return capitalized;
      //return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
}).directive('idle', function ($idle, $timeout, $interval) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            var timeout;
            var timestamp = localStorage.lastEventTime;

            // Watch for the events set in ng-idle's options
            // If any of them fire (considering 500ms debounce), update localStorage.lastEventTime with a current timestamp
            elem.on($idle._options().events, function () {
                if (timeout) { $timeout.cancel(timeout); }
                timeout = $timeout(function () {
                    localStorage.setItem('lastEventTime', new Date().getTime());
                }, 500);
            });
			
			//Destroy event added by Unais
			/*scope.$on('$destroy', function()
			{
				elem.off($idle._options().events, function () {
					
				});
			});*/

            // Every 5s, poll localStorage.lastEventTime to see if its value is greater than the timestamp set for the last known event
            // If it is, reset the ng-idle timer and update the last known event timestamp to the value found in localStorage
            $interval(function () {
                if (localStorage.lastEventTime > timestamp) {
                    $idle.watch();
                    timestamp = localStorage.lastEventTime;
                }
            }, 5000);
        }
    }
}).filter('unique', function () {

    return function (items, filterOn) {

        if (filterOn === false) {
            return items;
        }

        if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
            var hashCheck = {}, newItems = [];

            var extractValueToCompare = function (item) {
                if (angular.isObject(item) && angular.isString(filterOn)) {
                    return item[filterOn];
                } else {
                    return item;
                }
            };

            angular.forEach(items, function (item) {
                var valueToCheck, isDuplicate = false;

                for (var i = 0; i < newItems.length; i++) {
                    if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    newItems.push(item);
                }

            });
            items = newItems;
        }
        return items;
    };
}).filter('mapGroinGenitaliaForSkin', function () {
    return function (input, propName) {
        var inputArray = new Array;
        var inputArray = input.map(function (item) {
            return item;
        });
        if (inputArray.length > 0) {
            if (inputArray.length > 1) {
                var insertPosition = inputArray.length - 1;
                var array = inputArray;
                var firstArray = array.splice(0, insertPosition);
                var FinalArray = firstArray.join(', ') + ' and ' + array.join(', ');

            }
            else {
                var FinalArray = inputArray.join();
            }
        }
        FinalArray = FinalArray.replace('Right', 'Right side');
        FinalArray = FinalArray.replace('Left', 'Left side');
        return FinalArray;
    };
}).directive('lowercase', function (uppercaseFilter) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            
            var lower = function (inputValue) {
                if (inputValue) {
                    var input = inputValue.toLowerCase();
                    if (input !== inputValue) {
                        modelCtrl.$setViewValue(input);
                        modelCtrl.$render();
                    }
                    return input;
                }
            }
            modelCtrl.$parsers.push(lower);
            lower(scope[attrs.ngModel]);
        }
    };
})
.directive('dynamicZipcode', function () {
    return {
        restrict: 'E',
        template: '<div> <input type="tel" pattern="[0-9]*" class="form-control" min-length="5" ng-model="ngModel" numbers-only="numbers-only" ng-change="setzipcode()" ng-blur="setzipcodeafterchange()" /> </div>',
        scope: {
            ngModel: '=',
        },
        controller: function ($scope, $element) {
            
            $scope.setzipcode = function () {
                if ($scope.ngModel.length > 5) {
                    
                    $scope.ngModel = $scope.ngModel.replace('-', '');
                    $scope.ngModel = $scope.ngModel.slice(0, 5) + '-' + $scope.ngModel.substring(5, 9);
                }
                if ($scope.ngModel.substr($scope.ngModel.length - 1) == '-') {
                    $scope.ngModel = $scope.ngModel.replace('-', '');
                }
            }
            $scope.setzipcodeafterchange = function () {
                
                if ($scope.ngModel.length > 5) {
                    if ($scope.ngModel.split('-')[1].length != 4) {
                        alert('Invalid Zipcode!');
                        $scope.ngModel = '';
                    }
                }
                if ($scope.ngModel.length < 5 && $scope.ngModel.length != 0) {
                    alert('Invalid Zipcode!');
                    $scope.ngModel = '';
                }

            }
        }       
       
    };
});
