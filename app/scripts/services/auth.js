'use strict';

angular.module('ratefastApp')
  .factory('Auth', function Auth($location, $rootScope, Session, User, $cookieStore, $cookies, saveForm, socket, $modalStack, $idle, $modal) {
      // Get currentUser from cookie
      $rootScope.currentUser = $cookieStore.get('user') || null;
      $cookieStore.remove('user');

      if (!$rootScope.openedReport) {
          $rootScope.openedReport = [];
      }

      $rootScope.currentState = $cookies.selectedState || null;
      $cookies.selectedState = null;

      $rootScope.InjuryId = $cookies.InjuryId || null;
      $rootScope.reportid = $cookies.reportId || null;

      $cookies.InjuryId = null;
      $cookies.reportId = null;

      var login = function (user, callback) {
          var cb = callback || angular.noop;
          debugger;
          return Session.Sessionlogin().save({
              username: user.username,
              password: user.password,
              practicename: user.practicename
          }, function (user) {
              debugger;
              $rootScope.currentUser = user;

              socket.authroize(user);
              socket.samelogin(user, function () {
                  logout(function () {
                      debugger;
                      
                      $modal.open({
                          templateUrl: 'forceLogout-dialog.html',
                          windowClass: 'modal-danger'
                      });
                  });

                  return cb();
              });

              //return cb();
          }, function (err) {
              return cb(err);
          }).$promise;
      };


      var deleteAllSess = function (callback) {
          var cb = callback || angular.noop;

          return Session.Sessionlogin().delete(function () {
              debugger;
             
              socket.disconnect();
              $rootScope.currentUser = null;
              $rootScope.currentState = '';
              $cookies.selectedState = '';
              try {
                
                  $modalStack.dismissAll();

              } catch (err) {
                  
              }
            
              if ($rootScope.autoLogoutStatus) {
                  $modal.open({
                      templateUrl: 'timedout-dialog.html',
                      windowClass: 'modal-danger'
                  });

              } else {
                  $modal.open({
                      templateUrl: 'forceLogout-dialog.html',
                      windowClass: 'modal-danger'
                  });
              }
              //$rootScope.autoLogoutStatus = false;
              $idle.unwatch();
              angular.forEach($cookies, function (v, k) {
                  $cookieStore.remove(k);
              });
              $rootScope.currentUser = '';
              $location.path('/login');
              //socket.samelogin({ id: null });
              return cb();

          },
            function (err) {
                return cb(err);
            }).$promise;
      };

      var autoLogout = function (callback) {
		  
		  var currUsr,currUsr2;

		  if(typeof $rootScope.currentUser!='undefined')
		  {
		  
		  currUsr = JSON.stringify($rootScope.currentUser);
		  currUsr2 = JSON.parse(currUsr);
		  
		  $rootScope.uname=currUsr2.username;
		  $rootScope.pname=currUsr2.practicename;	

		  }
		  
          var cb = callback || angular.noop;
		  
		  $('.modal-content > .ng-scope').each(function(){
      		try{
      		     $(this).scope().$dismiss();
      		 }catch(_) {}
          });

          return Session.Sessionlogin().delete(function () {
              debugger;
             
              debugger;
              socket.disconnect();
			  
			  //$localStorage.uname=$rootScope.currentUser.username;
			  //$localStorage.pname=$rootScope.currentUser.practicename;	

			  
			 	  

              $rootScope.currentUser = null;
			  			
              $rootScope.currentState = '';
              $cookies.selectedState = '';
              
              $rootScope.autoLogoutStatus = false;
			  
			  
			  
              $location.path('/login');
              $idle.unwatch();
              angular.forEach($cookies, function (v, k) {
                  $cookieStore.remove(k);
              });

              $rootScope.currentUser = '';
              //socket.samelogin({ id: null });
              return cb();

          },
            function (err) {
                return cb(err);
            }).$promise;
      };

      var logout = function (callback) {
          var cb = callback || angular.noop;
          //console.log('callback: ' + callback);
          var currentPath = window.location.pathname;

          if (currentPath == '/createreport') {
              debugger;
             
              var scope = angular.element(document.getElementById("reportForm")).scope();

              scope.deletereportTrack();

              var sectionId = scope.currentBdSectionId ? scope.currentBdSectionId : scope.currentsectionId;
              
              if ((scope.reportStatus == 'open' || scope.reportStatus == 'level1' || scope.reportStatus == 'level2' ) && angular.element('#' + sectionId).scope() && !scope.fieldDisable) {
                  

                  var Text = "angular.element('#" + sectionId + "').scope()." + sectionId + '.$dirty';
                  var result = eval(Text);

                  if (result) {
                      scope.savenewPatientdata('autosavelogout', '', deleteAllSess);
                  } else {
                      
                      autoLogout();
                  }

              } else {
                 
                  autoLogout();
              }

             return cb();

          } else {
              
              return Session.Sessionlogin().delete(function () {
                  debugger;
                  //console.log('In else');
                  autoLogout();
                  return cb();
              },
            function (err) {
                return cb(err);
            }).$promise;
          }

      };

      return {

          login: login,
          logout: logout,

          /**
           * Authenticate user
           * 
           * @param  {Object}   user     - login info,
             
           * @param  {Function} callback - optional
           * @return {Promise}            
           */

          /**
           * check email,password,practicename for change of username
           * 
           * @param  {Object}   user     - credentials info,
             
           * @param  {Function} callback - optional
           * @return {Promise}            
           */
          checkcredentails: function (credentials, callback) {
              var cb = callback || angular.noop;
              return Session.checkcredentails().save(credentials, function () {
                  return cb();
              }, function (err) {
                  return cb(err);
              }).$promise;
          },

          /**
         * check email,username,practicename for change of password
         * 
         * @param  {Object}   user     - credentials info,
           
         * @param  {Function} callback - optional
         * @return {Promise}            
         */
          checkcredentailspassword: function (user, callback) {
              var cb = callback || angular.noop;
              return Session.ForgotPassword().save({
                  email: user.email,
                  password: user.password,
                  practicename: user.practicename
              }, function (user) {
                  $rootScope.currentUser = user;
                  return cb();
              }, function (err) {
                  return cb(err);
              }).$promise;
          },


          /**
         * check question, answer for both forgot username,password 
         * 
         * @param  {Object}   user     - credentials info,
           
         * @param  {Function} callback - optional
         * @return {Promise}            
         */
          verifyanswer: function (user, callback) {
              var cb = callback || angular.noop;
              return Session.VerifyAnswer().save({
                  question: user.question,
                  answer: user.answer,
                  email: user.email,
                  flg: user.flg
              }, function (user) {
                  $rootScope.currentUser = user;
                  return cb();
              }, function (err) {
                  return cb(err);
              }).$promise;
          },


          /**
           * Create a new user
           * 
           * @param  {Object}   user     - user info
           * @param  {Function} callback - optional
           * @return {Promise}            
           */
          createUser: function (user, callback) {
              var cb = callback || angular.noop;

              return User.save(user,
                function (user) {
                    $rootScope.currentUser = user;
                    return cb(user);
                },
                function (err) {
                    return cb(err);
                }).$promise;
          },

          /**
           * Unauthenticate user
           * 
           * @param  {Function} callback - optional
           * @return {Promise}           
           */



          /**
           * Change password
           * 
           * @param  {String}   oldPassword 
           * @param  {String}   newPassword 
           * @param  {Function} callback    - optional
           * @return {Promise}              
           */
          changePassword: function (password, id, callback) {
              var cb = callback || angular.noop;

              return User.update({
                  password: password,
                  id: id
              }, function (user) {
                  return cb(user);
              }, function (err) {
                  return cb(err);
              }).$promise;
          },

          /**
           * Gets all available info on authenticated user
           * 
           * @return {Object} user
           */
          currentUser: function () {
              return User.get();
          },

          /**
           * Simple check to see if a user is logged in
           * 
           * @return {Boolean}
           */
          isLoggedIn: function () {
              var user = $rootScope.currentUser;
              return !!user;
          },

          currentLoggedinUser: function () {
              var user = $rootScope.currentUser;
              return user;
          },

          IsActiveUserRole: function (roles) {
              if ($rootScope.currentUser != null && roles != null) {
                  if ($rootScope.currentUser.role) {
                      var currentRole = $rootScope.currentUser.role.trim().toLowerCase();
                      if (currentRole) {
                          if ((roles.indexOf(currentRole) != -1)) {
                              return true;
                          }
                          else {
                              return false;
                          }
                      }
                  }
              }
              return false;
          },

          IsSuperAdmin: function () {
              var currentRole = $rootScope.currentUser.role.trim().toLowerCase();
              if (currentRole == 'superadmin') {
                  return true;
              }
              else {
                  return false;
              }
          }

      };
  });