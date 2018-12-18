angular.module('ratefastApp').controller('popupSingleButtonCtrl', function ($scope,$routeParams, $rootScope, $modalInstance,message) {
  $scope.message = message;
  $scope.ok = function () {

      $modalInstance.dismiss('ok');
  };

});


