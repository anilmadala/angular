﻿angular.module('ratefastApp')
.directive('numbersOnlydec', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {

            

            if (!modelCtrl) {
                return;
            }

            modelCtrl.$parsers.push(function (val) {
                if (angular.isUndefined(val)) {
                    var val = '';
                }
                var clean = val.replace(/[^0-9\.]/g, '');
                var decimalCheck = clean.split('.');                
                if (!angular.isUndefined(decimalCheck[1])) {
                    decimalCheck[1] = decimalCheck[1].slice(0, 2);
                    clean = decimalCheck[0] + '.' + decimalCheck[1];
                }

                if (val !== clean) {
                    modelCtrl.$setViewValue(clean);
                    modelCtrl.$render();
                }
                return clean;
            });

            element.bind('keypress', function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});