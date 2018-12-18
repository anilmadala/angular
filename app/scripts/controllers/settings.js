'use strict';

angular.module('ratefastApp')
  .controller('SettingsCtrl', function ($scope, $routeParams, User, Auth, $location, $rootScope, $modal, $cookies) {
      $scope.errors = {};

      var _id = $routeParams.id;
	  
	  // Set the default value of inputType
            $scope.inputType = 'password';
            
            $scope.hideShowPassword = function(){
                    if ($scope.inputType == 'password')
                      $scope.inputType = 'text';
                    else
                      $scope.inputType = 'password';
           };

      $scope.changePassword = function (form) {
          debugger;
          $scope.submitted = true;
          if (form.$valid) {
              Auth.changePassword($scope.user.password, _id)
              .then(function (res,err) {
                   if(res.validpassword=='change'){
                      if (Auth.isLoggedIn()) {
                          alert('You have successfully changed your password!');                          
                            // redirect to state selection page
                            //window.location = '/stateselection';
                            //Redirect directly to home page of user
                            $cookies.selectedState = 'California';
                            $cookies.selectedStatecode = 'CA';
                            $rootScope.currentState = $cookies.selectedState;
                            
                            if ($rootScope.currentUser.role == 'rater1' || $rootScope.currentUser.role == 'rater2') {
                                $location.path('/submittedreport');
                            } else {
                                $location.path('/admin/dashboard');
                            }                         
                      } else {                         
                          alert('Password successfully changed!');
                          window.location = '/login';
                      }
                  }else{
                          alert('New password should not be the same as last five passwords.');
                  }
              })
              .catch(function () {
                  $scope.message = 'Incorrect password';
              });
          }
      };

      //validate link
      $scope.validatelink = function () {
          
      };

  });
