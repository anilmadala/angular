'use strict';

angular.module('ratefastApp')
  .controller('DashboardCtrl', function ($scope, $rootScope, $location, Auth) {
      $scope.currentUser = false;
      $scope.showgrid = false;
      $scope.user = {};
      $scope.errors = {};
      $scope.myData = [];
      $scope.user = $rootScope.currentUser;
      $scope.myData = $scope.user.practice;

      $scope.gridOptions = {
          data: 'myData',
          columnDefs: [
             { field: 'name', displayName: 'Name' },
             { field: 'role', displayName: 'Role' },
             { field: 'status', displayName: 'Status' },
          ]
      };

      $scope.logout = function () {

          Auth.logout()
          .then(function () {
              $location.path('/login');
          });
      };

      $scope.showprofile = function () {
          $scope.showgrid = true;
      };
  });