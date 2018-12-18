angular.module('ratefastApp')
.directive('togglebill', function () {
    return function (scope, elem, attrs) {
        elem.slideUp();
        scope.$on('event:togglebill', function () {
            elem.slideToggle();
        });
    };
})
.directive('togglereview', function () {
    return function (scope, elem, attrs) {
        elem.slideUp();
        scope.$on('event:togglereview', function () {
            elem.slideToggle();
        });
    };
})
.directive('toggleattorney', function () {
    return function (scope, elem, attrs) {
        elem.slideUp();
        scope.$on('event:toggleattorney', function () {
            elem.slideToggle();
        });
    };
})
.directive('toggledattorney', function () {
    return function (scope, elem, attrs) {
        elem.slideUp();
        scope.$on('event:toggledattorney', function () {
            elem.slideToggle();
        });
    };
})
.directive('togglerncase', function () {
    return function (scope, elem, attrs) {
        elem.slideUp();
        scope.$on('event:togglerncase', function () {
            elem.slideToggle();
        });
    };
});