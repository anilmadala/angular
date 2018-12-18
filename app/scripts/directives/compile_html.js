angular.module('ratefastApp')
.directive('dynamic', function ($compile) {
    return {
        restrict: 'A',
        replace: true,
        link: function (scope, ele, attrs) {
            ele.bind('blur', function () {
                scope.$apply(attrs.uiBlur);
            });
            scope.$watch(attrs.dynamic, function (html) {
                ele.html(html);
                var data1 = ele.html(html);
                var data2 = $compile(ele.contents())(scope);
                $compile(ele.contents())(scope);
            });
        }
    };
}).directive('ethnicitySelect', function(){
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/ethnicity.html",
        controller: "ethnicityCtrl"
    };
});

