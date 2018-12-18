//GT:RISHU 6th June 2014 for popup

'use strict';

angular.module('ratefastApp')
    .controller('backbuttonpopupCtrl', function ($scope, $http, $routeParams, $modalInstance, $rootScope) {
        $scope.patientid = $routeParams.patientid;
        $scope.leavewithoutsave = function () {
            $modalInstance.dismiss('cancel');
            window.location = '/patient/createinjury/' + $scope.patientid;
        };

        $scope.saveData = function () {
            $rootScope.saveexistForm = true;
            setTimeout(function () {
                $modalInstance.dismiss('cancel');
                var el = document.getElementById('saveuserForm');
                var patientid = $routeParams.patientid;
                angular.element(el).triggerHandler('click');
            }, 0);
        };
    })
    .controller('backbuttonpopupFormBuilderCtrl', function ($scope, $http, $routeParams, $modalInstance) {
        $scope.leavewithoutsave = function () {
            var patientid = $routeParams.patientid;
            $modalInstance.dismiss('cancel');
            window.location = '/patient/createinjury/' + patientid;
        };

        $scope.saveData = function () {
            setTimeout(function () {
                $modalInstance.dismiss('cancel');
                var el = document.getElementById('saveform');
                angular.element(el).triggerHandler('click');
            }, 0);
        };
    }).controller('ethnicityCtrl', function ($scope, $rootScope) {
        debugger;
    });