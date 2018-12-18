/**
 * New node file
 */
'use strict';

angular.module('ratefastApp')
  .controller('injurykickstartsuccess', function ($scope, $location, $anchorScroll, $http, $modal, $rootScope, vcRecaptchaService, $window) {
     
	  var urlArray = window.location.pathname.split('/');
		debugger;
	  	$http.post("/api/injurykickstart/verifyurl/" + urlArray[urlArray.length-1]).then(function (response) {              //    
			debugger;
			$scope.verifiedURL = 'YES';
			
			$scope.faxnumber = response.data.faxnumber!=''?response.data.faxnumber:"(206) 338-3005";
			$scope.kickstart_page = response.data.kickstart_page;
			
		},function(response){
			$scope.verifiedURL = 'NO';
		});	
 
  });