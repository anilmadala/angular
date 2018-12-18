'use strict';

angular.module('ratefastApp')
.controller('unsignedReportsCtrl', function ($http, $scope, $cookies, $rootScope, $routeParams, $location, $locale, $modal, $timeout, $filter, unsignedReports, Auth, Injuries) {

    var practicename = $rootScope.currentUser.practicename;
    $scope.noUnsignedReports = false;
    $scope.itemsByPage = 5;

    $scope.getUnsignedReportsList = function () {
        $scope.isLoad = true;
        var query = {
            practicename: practicename,
            selectedstatecode: $cookies.selectedStatecode
        };

        unsignedReports.getUnsignedReports().query(query).$promise.then(function (response) {
            debugger;
            $scope.isLoad = false;
            if (response[0].unsignedreports.length > 0) {
                $scope.unsignedReportslist = response[0];
                $scope.rowCollection = $scope.unsignedReportslist.unsignedreports;
                $scope.displayedCollection = [].concat($scope.rowCollection);
                $scope.noUnsignedReports = true;
            }
        });

        Injuries.getuserlist().query({ practiceaccnt: practicename }, function (users) {
            debugger
            $scope.usersList = users;
            debugger
        });

    } 

    $scope.reportConfirmation = function (reportid,patientid) {
        
        $scope.patientid = patientid;
        $scope.reportcategory = 'existing';
        var modalInstance = $modal.open({
            templateUrl: 'partials/reportconfirmation.html',
            controller: 'reportPreviewctrl',
            resolve: {
                patientid: function () {
                    return $scope.patientid;
                },
                reportCat: function () {
                    return $scope.reportcategory;
                }
            }
        });
    }


})

