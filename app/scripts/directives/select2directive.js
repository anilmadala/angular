angular.module('ratefastApp')
.directive('tagList', function($timeout) {
  return {
    require: 'ngModel',
    restrict: 'A',
    link: function(scope, element, attrs, controller) {
      scope.$watch(attrs.ngModel, function(value) {
        if (value !== undefined) {
          element.select2('val', value);
        }
      });

      element.bind('change', function() {
        var value = element.select2('val');
        controller.$setViewValue(value);
      });

      $timeout(function() {
        element.select2({
          tags: []
        });
      });
    }
  };
});