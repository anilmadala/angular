'use strict';

angular.module('ratefastApp')
  .controller('OauthCtrl', function ($scope, $http, $validator, $route, $modal, $q, $cookies, Auth, $filter, $rootScope, currentLoggedinUserdata, $sce, $location) {
        
		if($rootScope.currentUser.enableOauth==true && $rootScope.currentUser.rolename=="superadmin"){
			$scope.submitted = false;
			$scope.alertHeader = 'Oh snap! You got an error!';
			$scope.alertBody = 'Please check your data. You could enable oauth only once. Please delete previous before proceeding. ';
      $scope.clientsList=[];
      $scope.client={};
    
			
			$scope.getClient = function (form) {
			$http({
            method: 'GET',
            url: '/api/clients'
        }).then(function successCallback(response) {
             $scope.clientsList=response.data;
        }, function errorCallback(response) {
            
        });
		}
    $scope.createClient = function (form) {
        $scope.submitted = true;
       
        if (form.$valid) {				
            $http({
                method: 'POST',
                url: '/api/clients',
                data:$scope.client
            }).then(function successCallback(response) {
                   
									 $scope.alertBody = response.data.message; 
									 if(response.data.code==205){
										 	$scope.alertHeader = 'Oh snap! You got an error!';
											$( "#serverresponse" ).show('slow').delay(7000).fadeOut();
									}
									if(response.data.code==200){
										 	$scope.alertHeader = 'Success! You made it!';
											$( "#serverresponseSuccess" ).show('slow').delay(7000).fadeOut();
									}
										$scope.getClient();
									
                }, function errorCallback(response) {
                   		$scope.getClient();
									 $scope.alertHeader = 'Oh snap! You got an error!';
									 $scope.alertBody = 'Please check your data. You could enable oauth only once. Please delete previous before proceeding.'; 
										$( "#serverresponse" ).show('slow').delay(7000).fadeOut();
                   
            });
        } 
    }
    $scope.restForm = function (form) {
		try{
			$scope.submitted = false;
			$scope.client = {};
			
		 }catch(err){
			//console.log(err);
		}
    }
		$scope.deleteClient = function (client) {
			try{
				var txt;
				var r = confirm("Client will be completely deleted from database,Are you sure?");
				if (r == true) {
						$http({
                method: 'POST',
                url: '/api/clients/delete',
                data:client
            }).then(function successCallback(response) {
											$scope.getClient();
											$scope.alertHeader = 'Success! You made it!';
											$scope.alertBody = 'Client has been deleted successfully'; 
											$( "#serverresponseSuccess" ).show('slow').delay(7000).fadeOut();
                }, function errorCallback(response) {
												$scope.getClient();
										$scope.alertHeader = 'Oh snap! You got an error!';
										$scope.alertBody = response.data.message; 
										$( "#serverresponse" ).show('slow').delay(7000).fadeOut();
                   
            });
				} else {
						txt = "You pressed Cancel!";
				}
			 }catch(err){
				//console.log(err);
			}
		}
		
		//get Latest Client list
		
			$scope.getClient();
		}
		else{
			$location.path('/admin/dashboard');			
		}
		
      
		
});