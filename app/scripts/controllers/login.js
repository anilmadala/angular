'use strict';

angular.module('ratefastApp')
  .controller('forgotPracticeCtrl', function ($scope, $modalInstance) {
      $scope.ok = function () {
          $modalInstance.close();
      };
  })
  .controller('forgotCredentialCtrl', function ($scope, $modalInstance, Auth, QuestionsList, forgotuser, $http, forgotpass) {
      
      $scope.user = new Object();
      $scope.isEmailpresent = false;
      $scope.forgotuser = forgotuser;
      $scope.forgotpass = forgotpass;
      $scope.user.username = "";
      $scope.user.password = "";
      $scope.showAlert = false;
      $scope.message = "Invalid Credentials..."
      //QuestionsList.query().$promise.then(function(questions) {
      //    $scope.questions = questions;
      //});

      $scope.ok = function (forgotcredentialForm) {
          $scope.showAlert = false;
          $scope.submitted = true;
          
          if(forgotcredentialForm.$valid){
              Auth.checkcredentails($scope.user)
              .then(function() {
                  alert("Please check your mail.")
                  $modalInstance.close();
              })
              .catch(function(err) {
                  $scope.showAlert = true;
                    $scope.message = "Invalid Credentials.";
              });
          }   
      };

      $scope.getsecurityQuestion = function (email) {
          
          if (email) {
              $http.get('/api/getquestionByEmail/' + email).
                success(function (question) {
                    
                    if (question._id) {
                        $scope.isEmailpresent = false;
                        $scope.user.userSecurityquestionInfo = question;
                        $scope.user.securityquestion = question._id;
                        $scope.user.securityquestiontext = question.question;
                    }
                    else {
                        $scope.isEmailpresent = true;
                        $scope.user.userSecurityquestionInfo = '';
                        $scope.user.securityquestion = '';
                        $scope.user.securityquestiontext = '';
                    }
                }).
                error(function (err) {

                });
          } else {
              $scope.user.userSecurityquestionInfo = '';
              $scope.user.securityquestion = '';
              $scope.user.securityquestiontext = '';
          }
      }

      $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
      };

  })
  .controller('activatePracticeCtrl', function ($scope, Session, $routeParams) {
    
      $scope.checkaccoutstatus = function () {
          
          var id = $routeParams.activateid;
          Session.GetAccountStatus().get({activateid: $routeParams.activateid},
            function(result) {
                $scope.showActivationErr = true;
                $scope.msg = "You have successfully activated your account."
                $scope.headingMsg = "Welcome to RateFast!"
          
            }, function(err) {
          
                $scope.showActivationErr = false;
                $scope.msg = "That link was broken, or your account is already active. Need help?"
                $scope.headingMsg = "Whoops!"
                //page was redirecting to login page
                //$location.path('/activation/' + id );  
            }).$promise;
      };      
  })
  .controller('LoginCtrl', function ($scope, Auth, Session, $location, $routeParams, $modal, $cookies, $idle, $rootScope, $localStorage) {
      	  	  
	  
	  //Function to autopopulate username and practicename fields upon logout
	  $scope.populateFields = function()
	  {
		  if($rootScope.athena_pname && $rootScope.athena_uname)
		  {			
				$scope.user.pname = $rootScope.athena_pname;
				$scope.user.username = $rootScope.athena_uname ;			
		  }
	  }
	  
	  if($rootScope.currentUser){
    	  if ($rootScope.currentUser.role == 'rater1' || $rootScope.currentUser.role == 'rater2') {
              $location.path('/submittedreport');
          } else {
              $location.path('/admin/dashboard');
          }
      }	  
      $scope.user = {};
      $scope.errors = {};
      var forgotuser = true;
      var forgotpass;
      // forgot modals
      $scope.open = function (modalname) {
          if (modalname == 'forgotPractice') {
              var url = 'partials/forgotPractice.html';
              var controller = 'forgotPracticeCtrl';
          } 
          else {
              var url = 'partials/forgotCredential.html';
              var controller = 'forgotCredentialCtrl';
              
              if (modalname == 'forgotPassword') {
                  forgotuser = false;
                  forgotpass = true;
              } else {
                  forgotuser = true;
                  forgotpass = false;
              };
          }

          var modalInstance = $modal.open({
              templateUrl: url,
              controller: controller,
              resolve: {
                  forgotuser: function () {
                      return forgotuser;
                  },
                  forgotpass: function () {
                      return forgotpass;
                  }
              }
          });
      };

      // check login credentials
      $scope.login = function(form) {      
          $scope.submitted = true; 
          // practicename  = $scope.user.pname;
          if (form.$valid) {
              
              Auth.login({
                  username: $scope.user.username,
                  password: $scope.user.password,
                  practicename : $scope.user.pname
              })
              .then(function (userinfo) {
                  // todo : redirect to admin dashboard
                  
                  $idle.watch();
				  $rootScope.currentUser=userinfo;
				 
                  if (userinfo.isresetPwdexpired) {
                      
					  $location.path('confirmpassword/' + userinfo.id);
                  } else {
							var todaysDate= new Date(); // todays date
							var getPWDchangeDate=new Date(userinfo.passwordchangedate);              		               		
							var diffdays=Math.round((todaysDate-getPWDchangeDate)/(1000*60*60*24));
							if(diffdays > 90){
								$location.path('confirmpassword/' + userinfo.id);
							}else{
								$cookies.selectedState = 'California';
								$cookies.selectedStatecode = 'CA';
								$rootScope.currentState = $cookies.selectedState;													
								
								try
								{									
									//if (typeof $rootScope.currentUser.level!='undefined') {
									if($rootScope.currentUser.rolename!='siteadmin' && $rootScope.currentUser.rolename!='superadmin' && $rootScope.currentUser.rolename!='rater1' && $rootScope.currentUser.rolename!='rater2')	
									{
										$idle.setIdleTime($rootScope.currentUser.practiceDetails.session_timeout[$rootScope.currentUser.rolename+'_'+$rootScope.currentUser.level]);
										$idle.setTimeoutTime($rootScope.currentUser.practiceDetails.logout_warning_seconds);
										$idle.watch();
									} 	
									else 
									{										
										$idle.setIdleTime($rootScope.currentUser.practiceDetails.session_timeout[$rootScope.currentUser.rolename]);
										$idle.setTimeoutTime($rootScope.currentUser.practiceDetails.logout_warning_seconds);
										$idle.watch();
									}								
								}
								catch(err)
								{
									//console.log(err);
								}								
								
								if ($rootScope.currentUser.role == 'rater1' || $rootScope.currentUser.role == 'rater2') {
									$location.path('/submittedreport');
								} else {
									$location.path('/admin/dashboard');
							}
						}
                  }
              })
              .catch(function (err) {
                  
                  err = err.data;
                  $scope.errors.other = err.message;

                  if (err.loginattempts == 3) {
                      var template = 'partials/loginattemp3.html';
                      $rootScope.modalInstance = $modal.open({
                          templateUrl: template,
                          controller: 'ModalInstanceLogin'
                      });
                  }

          
              });
          }
      };     
  }).controller('ModalInstanceLogin', function ($scope, Auth, Session, $location, $routeParams, $modal, $cookies, $idle, $rootScope, $modalInstance) {
      $scope.user = {};
      $scope.errors = {};
      var forgotuser = true;
      var forgotpass;
      $scope.yes = function (modalname) {
          $modalInstance.dismiss('cancel');
          if (modalname == 'forgotPractice') {
              var url = 'partials/forgotPractice.html';
              var controller = 'forgotPracticeCtrl';
          }
          else {
              var url = 'partials/forgotCredential.html';
              var controller = 'forgotCredentialCtrl';
              
              if (modalname == 'forgotPassword') {
                  forgotuser = false;
                  forgotpass = true;
              } else {
                  forgotuser = true;
                  forgotpass = false;
              };
          }

          var modalInstance = $modal.open({
              templateUrl: url,
              controller: controller,
              resolve: {
                  forgotuser: function () {
                      return forgotuser;
                  },
                  forgotpass: function () {
                      return forgotpass;
                  }
              }
          });


      };
      $scope.no = function (modalname) {
          $modalInstance.dismiss('cancel');
      };

  });

