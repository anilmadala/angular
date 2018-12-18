'use strict';

angular.module('ratefastApp')
    .controller('popupButtonCtrl', function ($scope, $sce, $modal, $rootScope) {
        debugger;
        $scope.component;
        $scope.popuplabel = $scope.label;
        debugger;
        $scope.fbpopupbutton = function () {
            debugger;
            $rootScope.modalInstance = $modal.open({
                template: '<div class="modal-header"><button type="button" class="close" aria-hidden="true" ng-click="close()">&times;</button><h3>RateFast</h3></div><div class="modal-body"><div class="login-sign"><h3>' + $sce.trustAsHtml($scope.textareatext) + '</h3></div></div><div class="modal-footer"><button class="btn btn-primary" ng-click="close()">Ok</button></div>',
                controller: 'popupButtonCtrlclose'
            });

        }
    })
    .controller('popupButtonCtrlclose', function ($scope, $sce, $modalInstance) {
        $scope.close = function () {
            debugger
            $modalInstance.close();
        }
    }).controller('popupbuttonClosefunctionCtrl', function ($scope, $sce, $modalInstance, $route, $cookies, step) {
        $scope.close = function () {
            debugger
            $modalInstance.close();
            $route.reload();
            $cookies.step = step;
        }
    }).controller('popupButtonXrayCtrlclose', function ($scope, $sce, $modalInstance, text) {
        if (text) {
            $scope.text = text;
        }
        $scope.close = function () {
            debugger
            $modalInstance.close();
        }
    });
