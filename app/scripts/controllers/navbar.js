'use strict';

angular.module('ratefastApp')
  .controller('NavbarCtrl', function ($scope, $location, $cookies, $rootScope, $window, Auth, $cookieStore, $idle, $modal, $modalStack, $athenaModal) {
      debugger;
	  
      if ($rootScope.currentUser) {
          //Start watch for autologout in 10 mins in ideal state if user is logged In  
          $idle.watch();
          $scope.currentuserdata = $rootScope.currentUser;
          if ($scope.currentuserdata.level) {
              /*if ($scope.currentuserdata.level == 'level1')
                  $scope.currentuserrole = 'Staff';
              if ($scope.currentuserdata.level == 'level2')
                  $scope.currentuserrole = 'Nurse';
              if ($scope.currentuserdata.level == 'level3')
                  $scope.currentuserrole = 'NP/PA';
              if ($scope.currentuserdata.level == 'level4')
                  $scope.currentuserrole = 'Phys./MD/DO/DCM';*/
			  
			  if ($scope.currentuserdata.level == 'level1')
                  $scope.currentuserrole = '1 - Low';
              if ($scope.currentuserdata.level == 'level2')
                  $scope.currentuserrole = '2 - Medium';
              if ($scope.currentuserdata.level == 'level3')
                  $scope.currentuserrole = '3 - High';
              if ($scope.currentuserdata.level == 'level4')
                  $scope.currentuserrole = '4 - Full';
          }
          else {
              $scope.currentuserrole = $rootScope.currentUser.role;
          }
          //if (!$cookies.selectedStatecode) {
          //    $location.path('/stateselection');
          //}
      } else {
          //$location.path('/login');
      }
	  
	  try
	  {		 
    	 var webpathname=window.location.pathname.split( '/' );	  
		 $scope.hideFooterMenu=false;	
		 $scope.hideHeaderMenu=false;		 
   	  	 var pagename=webpathname[1];  		 
		 $scope.showPrivacyMenu=false;
		 
   	  	 if(pagename=="submittedreport"){
   	  		 if(!(($rootScope.currentUser.rolename=="rater1" || $rootScope.currentUser.rolename=="rater2") &&  $rootScope.currentUser.practicename=="ratefast" )){
	   	    	$location.path('/admin/dashboard');
	   	    } 
   	  	 }
		 if(pagename=="athena-sso-result"){
   	  		 $scope.hideFooterMenu=true;
   	  	 }
		if(pagename=="injury"){
   	  		 $scope.hideFooterMenu=true;
			 $scope.hideHeaderMenu=true;
			 $scope.showPrivacyMenu=true;
   	  	 }
		 else
		 {
			 $scope.hideHeaderMenu=false;
		 }			 
     }catch(e){
    	//console.log("unable to process request"); 
     }

      $scope.menu = [
            {
                'title': 'Home',
                'link': '/'
            },
            {
                'title': 'Pricing',
                'link': '/pricing'
            },
            {
                'title': 'About Us',
                'link': '/about'
            },
            {
                'title': 'Contact Us',
                'link': '/contact'
            }];

      //setting current Year in Copyright Year
      var curdate = new Date();
      $scope.footerCurYear = curdate.getFullYear();
	  	 
      $scope.logout = function () {
		  //Below two lines to ensure username and practicename are autopopulated upon logout
		   try
		   {
			   if($rootScope.currentUser.practiceDetails.isAthena)
				{
					$rootScope.athena_pname = $rootScope.currentUser.practicename;
					$rootScope.athena_uname = $rootScope.currentUser.username;
				}
		   }
		   catch(err)
		   {
			   
		   }
		   
          Auth.logout()
			  .then(function () {
				  $modalStack.dismissAll();
				  $location.path('/login');
				  $idle.unwatch();
				  angular.forEach($cookies, function (v, k) {
					  $cookieStore.remove(k);
				  });
				  $rootScope.currentUser = '';
			  });
      };

      $scope.checkrole = function (roles) {
          return Auth.IsActiveUserRole(roles);
      };

      $scope.isActive = function (route) {
          return route === $location.path();
      };

      if ($rootScope.currentUser) {
          if ($rootScope.currentUser.role == 'rater1' || $rootScope.currentUser.role == 'rater2') {
              $location.path('/submittedreport');
          }
      }

      $scope.checkStateSelected = function () {

          if ($cookies.selectedStatecode) {
              return true;
          } else {
              return false;
          }

      };

      $scope.changeState = function () {
          if (!$rootScope.reportStarted) {
              $cookies.selectedState = '';
              $cookies.selectedStatecode = '';
              window.location = '/stateselection';
          }
      };

      $scope.open = function ($event) {
          $event.preventDefault();
          $event.stopPropagation();

          $scope.opened = true;
      };

      $scope.sendFeedback = function () {
          debugger;
          var template = 'partials/sendfeedback.html';
          $scope.modalInstance = $modal.open({
              templateUrl: template,
              windowClass: 'app-modal-window',
              controller: 'sendfeedbackctrl'
          });
          $scope.modalInstance.result.then(function () {

          }, function () {

          });
      }

      $scope.dateOptions = {
          formatYear: 'yy',
          startingDay: 1,
          changeMonth: true,
          changeYear: true,
          dateFormat: "dd-MM-yy",
          showAnim: "clip"
      };

      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      $scope.format = $scope.formats[0];

      function closeModals() {
          if ($scope.warning) {
              $scope.warning.close();
              $scope.warning = null;
          }

          if ($rootScope.timedout) {
              $rootScope.timedout.close();
              $rootScope.timedout = null;
          }
      }

      // $scope.$on('$idleStart', function () {
        //$scope.$on('$userIdleWarning', function () {
        $scope.$on('$userIdle', function () {
		  try {
        	  if(typeof $rootScope.currentUser.enableAutoLogout !="undefined"){
					if(!$rootScope.currentUser.enableAutoLogout ){						
						return 0;
					}
				}
          } catch (err) {
			  //console.log(err);
		  }
            $rootScope.autoLogoutStatus = true;
            $scope.warning = $modal.open({
                templateUrl: 'warning-dialog.html',
                windowClass: 'modal-danger'
            });
      });

    //  $scope.$on('$idleEnd', function () {
        $scope.$on('$userBack', function () {
         
          closeModals();
          debugger;
          $rootScope.autoLogoutStatus = false;
      });

      //$scope.$on('$idleTimeout', function () {
      $scope.$on('$userTimeout', function () {
		  try {
        	  if(typeof $rootScope.currentUser.enableAutoLogout !="undefined"){
					if(!$rootScope.currentUser.enableAutoLogout ){						
						return 0;
					}
				}
          } catch (err) 
		  {
			  //console.log(err);
		  }
          //closeModals();
         
          debugger;
          $rootScope.autoLogoutStatus = true;
          Auth.logout(function () {
              debugger;
				
              try {
                  $modalStack.dismissAll();
                 
              } catch (err) {
                  
              }
			  try
			   {
				   if($rootScope.currentUser.practiceDetails.isAthena)
					{
						$rootScope.athena_pname = $rootScope.currentUser.practicename;
						$rootScope.athena_uname = $rootScope.currentUser.username;
					}
			   }
			   catch(err)
			   {
				   
			   }
			  
			  $location.path('/login');
              $idle.unwatch();
              $rootScope.autoLogoutStatus = false;
              angular.forEach($cookies, function (v, k) {
                  $cookieStore.remove(k);
              });
              debugger;
			  
			  var templateURL = '';
			  var isAthenaUser = $rootScope.currentUser.practiceDetails.isAthena;
			  if($rootScope.currentUser.practiceDetails.isAthena)
			  {
				  templateURL = 'timedout-dialog-athena.html';
				  $rootScope.modalInstance = $modal.open({
					templateUrl: 'timedout-dialog-athena.html',
					windowClass: 'modal-danger'
				  });
			  }
			  else
			  {
				  templateURL ='timedout-dialog.html';
				  $rootScope.modalInstance = $modal.open({
					templateUrl: 'timedout-dialog.html',
					windowClass: 'modal-danger'
					});
			  }
			  
			  $rootScope.modalInstance.result.then(function (returndata) {
				//alert(JSON.stringify(returndata));
				//console.log(JSON.stringify(returndata));
            
				 }, function (err) {
					 console.log('inside backdrop close'); 
					 if(err=='backdrop click')
					 {
						 console.log($rootScope);
					 }
					 console.log('err : ' + err);           
				 });
		 
              /*$modal.open({
                  templateUrl: templateURL,
                  windowClass: 'modal-danger'
              });*/			  
              //$rootScope.currentUser = '';
			  $rootScope.athena_pname='';
			  $rootScope.athena_uname='';
          });

      });
	  
	   //shridhar 23 nov 2015          
      //this function used to change the menu bar
      $scope.checkWebsitePages=function(){      	      	  	    	      	 
	    	  var webpathname=window.location.pathname.split( '/' );
			 
	    	  var pagename=webpathname[1];	    	  
	    	  var websitePages = ["insurance","provider", "contact", "attorneys","about","faq","sample","login","signup","jointoday","inclinometer","goniometer","docfirst","pr2","pr4","learn","testimonial","pricing","reportpricing","useractivation","injurykickstart","injurykickstartsuccess","injury"];	    	  
	    	 if(pagename){
	    		 if (websitePages.indexOf(pagename) != -1)// || (window.location.pathname.split('/').indeOf(',injury,')>-1))
	    	  		{    								
	    			 	$rootScope.navheight = { 'height': "120px" };
	    		  		return true;
	    		  	}
	    	  	else{						
	    	  			$rootScope.navheight = { 'height': "95px" };
	    	  			return false;
	    	  		}
	    	 }	    	      	      	  
	    	  else    		  	    		  
		    		{	
	    		  		$rootScope.navheight = { 'height': "120px" };
	    		  		return true;	
	    		  	}
    	  }
                 
      $scope.backtoRatefast=function(){
		if ($rootScope.currentUser.role == 'rater1' || $rootScope.currentUser.role == 'rater2') {
						$location.path('/submittedreport');
			} else {
						$location.path('/admin/dashboard');
					}		
      }
	  
	   
      /*
       * shridhar : created : 6 April 2016
       * $scope.goPracticeProfileSetting used to set menu afetr login.
       * usig this function userProfileNavigation set to /myprofile or /userprofile or inviteuser
       */
      $scope.goPracticeProfileSetting = function ( path,profiletext ) {
    	 debugger;    	
    	 $rootScope.userProfileNavigation=profiletext;
    	 $location.path(path);
    };
	
	// Athena changes (new function)
   $scope.checkPractice = function(){        
        if ($rootScope.currentUser) {
           if($rootScope.currentUser.practiceDetails.isAthena){                
               var messge="<h3><p>Do you want to import a patient from Athena or do you want to manually create a new patient in RateFast?</p></h3>"
                   $rootScope.modalInstance = $athenaModal.open({
                        templateUrl: 'partials/athena/athena-dynamicPopup3Buttons.html',
                        controller: 'athenaDynamicPopUp3ButtonsCtrl',
                       resolve: {
                           ID: function () {
                               return '';
                           },
                           confirmButtonText1: function () {
                               return "Import from Athena";
                           },
                           confirmButtonText2: function () {
                               return "Create Patient Manually";
                           },
                           cancelButtonText: function () {
                               return "Cancel";
                           },
                           dispalyMessage: function () {
                               return messge;
                           }
                       }
                   });
                   $rootScope.modalInstance.result.then(function (returndata) {
                       debugger;
                       if (returndata == 'confirm1') {
                           $location.path('/athena-importpatient');
                       }
                       if (returndata == 'confirm2') {
                           var popupText="<h3><p>You have indicated that you want to create a patient manually in RateFast, rather than importing the patient from Athena. This RateFast patient will not be linked with any patient in your athenaNet practice. Are you sure you want to do this?</p></h3>"
						   $rootScope.modalInstance = $athenaModal.open({
								templateUrl: 'partials/athena/athena-dynamicPopup.html',
								controller: 'athenaDynamicPopUpCtrl',
							   resolve: {
								   athenaPatientID: function () {
									   return '';
								   },
								   confirmButtonText: function () {
									   return "Cancel";
								   },
								   cancelButtonText: function () {
									   return "Proceed";
								   },                          
								   dispalyMessage: function () {
									   return popupText;
								   }
							   }
						   });
						   $rootScope.modalInstance.result.then(function (returndata) {
							   debugger;
							   if (returndata == 'yes') {
								   $location.path('/admin/dashboard');
							   }                      
							   if (returndata == 'no') {								   
								   $location.path('/addpatient');
							   }
						   }, function (returndata) {
													
						   });
						}
						if (returndata == 'cancel') {
							$location.path('/admin/dashboard');
						}
					}, function (returndata) {
						   debugger;
						   console.log('returndata' + returndata);
					});                            
           }else{
                $location.path('/addpatient');
           }
        }
   }

	
	
  }).controller('sendfeedbackctrl', function ($scope, $modalInstance, Mail) {
      $scope.leave = function () {
          $modalInstance.dismiss('cancel');
      };
      $scope.send = function (feedbackcomment) {
          debugger;
          $scope.isLoad = true;
          if (feedbackcomment) {
              Mail.sendfeedbackmail().query({ feedback: feedbackcomment }, function (res) {
                  debugger;
                  alert('Feedback Succesfully Sent!');
                  $modalInstance.dismiss('cancel');
                  $scope.isLoad = false;
              }, function (err) {
                  debugger;
                  $scope.isLoad = false;
                  $scope.iserror = true;
              });
          } else {
              alert('Please enter feedback!');
          }
      };
  }).controller('redirectCtrl', function ($scope) {
      $scope.redirect = function () {
          debugger;
          window.location = "https://planetpr4.com";
          return false;
      }
  }).controller('redirectVerCtrl', function ($scope) {
      $scope.redirecttoVerificationPage = function () {         
          window.location = window.location.protocol +  "//" + window.location.host + "/googlee7116de807cba6b4.html";
          return false;
      }
  }).controller('redirectYoutubeVerCtrl', function ($scope) {
      $scope.redirecttoYoutubeVerificationPage = function () {         
          window.location = window.location.protocol +  "//" + window.location.host + "/google6373496e5ed57f74.html";
          return false;
      }
  }).controller('redirectCtrlForInclinometer', function ($scope) {
      $scope.redirectToInclinometer = function () {         
          window.location = "http://blog.rate-fast.com/?p=1421";
          return false;
      }
  }).controller('redirectCtrlForGoniometer', function ($scope) {
      $scope.redirectToGoniometer = function () {         
          window.location = "http://blog.rate-fast.com/?p=2711";
          return false;
      }
  }).controller('redirectStagingVerCtrl', function ($scope) {
      $scope.redirecttoStagingVerificationPage = function () {         
          window.location = window.location.protocol +  "//" + window.location.host + "/googled616db3beafa74e8.html";
          return false;
      }
  }).controller('logoutCountdown', function ($scope, $timeout) {
		$scope.countdown = 10;
		$scope.onTimeout = function(){
			if($scope.countdown>=1)
				$scope.countdown--;
			mytimeout = $timeout($scope.onTimeout,1000);
		}
		var mytimeout = $timeout($scope.onTimeout,1000);

		$scope.stop = function(){
			$timeout.cancel(mytimeout);
		}
  });



