angular.module('ratefastApp')
  .controller('dynamicPopUpCtrl', function ($scope, $http, $routeParams, rdSelectedBodyPartNum,confirmButtonText,cancelButtonText,dispalyMessage, $modalInstance) {
	  $scope.id = rdSelectedBodyPartNum;

	  $scope.confirmButtonText=confirmButtonText;
	  $scope.cancelButtonText=cancelButtonText;
	  $scope.dispalyMessage=dispalyMessage;
      $scope.proceed = function () {
          $modalInstance.close('confirm');
      };

      $scope.cancel = function () {
          $modalInstance.close('cancel');
      };

    });
angular.module('ratefastApp').controller('customModalController', function ($scope, $http, $routeParams, dispalyMessage, $modalInstance) {
	  $scope.dispalyMessage=dispalyMessage;
      $scope.proceed = function () {
          $modalInstance.close('confirm');
      };

      $scope.cancel = function () {
          $modalInstance.close('cancel');
      };

    })




