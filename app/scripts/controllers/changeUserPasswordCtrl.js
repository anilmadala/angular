'use strict';

angular.module('ratefastApp')
  .controller('changeUserPasswordCtrl', function ($scope,$rootScope,$location,updateUserPassword,changeUserPasswordShareID) {	  
	 
	  var userDATA=changeUserPasswordShareID.get();
	  var userID="";
	  userID=userDATA.updateUserID;
	  
	  var redirectUrl='/userprofile';
	  
	  //this value set into navbar.html & navbar.js
	  
	  if($rootScope.userProfileNavigation=='myprofile'){
		  redirectUrl='/myprofile';
	  }
	  
	  if(typeof userID=='undefined')
	  {
		  $location.path(redirectUrl);
	  }
	  else if(userID.length==0)
	  {
		  $location.path(redirectUrl);      	
	  }
	  
	  
	  // Set the default value of inputType
		$scope.inputType = 'password';
		
		$scope.hideShowPassword = function(){
				if ($scope.inputType == 'password')
				  $scope.inputType = 'text';
				else
				  $scope.inputType = 'password';
	   };
	  
      $scope.submitPassword = function(form) {      	  
    	 if ($scope.newpassword != $scope.confirmpassword) {
              return false;
          }
    	  if (form.$valid) {
		      	var passworddata={};
		      	passworddata.oldpassword=$scope.oldpassword;
		      	passworddata.newpassword=$scope.newpassword;
		      	passworddata.id=userID;
		      	
		      	updateUserPassword.update(passworddata).$promise.then(function (res, err) {		      	                   
                    //console.log(err);
		      		/*if (res.validpassword) {
                    	 alert('You have successfully changed your password!');
                    	 //$scope.clear();
						 $scope.backUserProfile();
						 
                     }else{
                    	  alert('The old password is incorrect! Please type your current password into the "Old Password" field.'); 
                     }*/
                     switch(res.validpassword){
                    	case 'change':
                    		alert('You have successfully changed your password!');
                    		$scope.backUserProfile();
                    		break;
                    	case 'repeat':
                    		alert('New password should not be the same as last five passwords.');
                    		break;
                    	case 'wait':
                    		alert('You cannot change your password within 30 minutes of last password change.');
                    		break;	
                    	default:
                    		alert('Incorrect old password. Please type your current password into the "Old Password" field.');
                    }
                 });  
		      	   
    	  }
    	  
      }
      
      $scope.clear=function(){
    	  $scope.oldpassword='';
          $scope.newpassword='';
          $scope.confirmpassword='';
      }
      
      $scope.setConfirmPassword = function () {
          
          if ($scope.pwdform.password.$error.required) {
              return true;
          }
          if ($scope.pwdform.password.$error.pattern) {
             return true;
          }
          if ($scope.pwdform.password.$error.minlength) {
              return true;
          }
          return false;
      }
      
      $scope.backUserProfile=function(){
      	$location.path(redirectUrl);      	
      }
  });

