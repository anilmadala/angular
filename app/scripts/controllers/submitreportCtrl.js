angular.module('ratefastApp')
.controller('submitreportConfirmationCtrl', function ($scope, $sce, $rootScope, $modalInstance, $cookies, report, submittedreportcount, chargeReport, $sessionStorage) {
    $scope.currentUser = $rootScope.currentUser;
    $scope.submittedReportcount = submittedreportcount;
    if ($cookies.reportstatus) {
        $scope.reportStatus = $cookies.reportstatus;
    }
    else {
        $scope.reportStatus = '';
    }
    debugger;
    if ($scope.submittedReportcount == 'null') {
        $scope.freereportsLeft = 'No Reports';
    }
    else {
        if ($scope.submittedReportcount) {
            if ($scope.submittedReportcount >= 2) {
                $scope.freereportsLeft = $scope.submittedReportcount;
                $scope.reportsCharged = true;
                $scope.reportcharge = chargeReport;
                $scope.freereportsLeft = 0;
            }
            else {
                $scope.freereportsLeft = 2 - $scope.submittedReportcount;
                $scope.reportsLeft = true;
            }
        }
        else {
            $scope.freereportsLeft = 0;
            $scope.reportsLeft = true;
        }
    }
    $scope.patientId = $sessionStorage.patientId;
    $scope.close = function () {
        debugger;
        $modalInstance.close(false);
    }

    $scope.OK = function () {
        $modalInstance.close(true);
    }
});