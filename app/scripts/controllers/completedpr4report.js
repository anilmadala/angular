angular.module('ratefastApp').controller('completedpr4reportCtrl', function ($scope, $cookies,$http, $routeParams, $rootScope, getpr4ClosedReports, getreportAllactivity, downloadReportSafari, $filter) {
    $scope.submited = true;
    $scope.isLoad = true;
    getpr4ClosedReports.save({pageController: "page", pagenum: 1,
     state: $cookies.selectedStatecode,
     stateController: "state",
     statusController: "status" }).$promise.then(function (reports) {
        $scope.isLoad = false;
        $scope.rowCollection = reports.getsubmittedpr4Reportdata;
        $scope.displayedCollection = [].concat($scope.rowCollection);
        if ($scope.displayedCollection.length > 0) {
          $scope.showfirsttable = true;
        } else {
          $scope.showfirsttable = false;
        }
      });

});
