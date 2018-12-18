angular.module('ratefastApp').
controller('SignupCtrl', ['$scope', function($scope) {
  $scope.password;
  $scope.password_confirmation;
}]).
directive('MatchExact', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (viewValue === scope[attrs.MatchExact]) {
          ctrl.$setValidity('MatchExact', true);
          return viewValue;
        } else {
          ctrl.$setValidity('MatchExact', false);
          return undefined;
        }
      });
    }
  };
});