'use strict';

angular.module('ratefastApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'angular-carousel',
  'ui.bootstrap',
  'ui.date',
  'ui.mask',
  'validator',
  'validator.rules',
  'builder',
  'builder.components',
  'ui.sortable',
  'ui.select2',
  'ui.tinymce',
  'ngTouch',
  //'ngIdle',
  '$idle',
  'btford.socket-io',
  'smart-table',
  'ngCapsLock',
  'checklist-model',
  'vcRecaptcha',
  'ngStorage',
  'ng-clipboard',
  'angularStats'
])
    .config(function ($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider
          .when('/', {
              templateUrl: 'partials/main',
              controller: 'MainCtrl'
          })
          .when('/admin/dashboard', {
              templateUrl: 'partials/dashboard.html',
              controller: 'PatientCtrl',
              authenticate: true
          })
          .when('/login', {
              templateUrl: 'partials/login',
              controller: 'LoginCtrl'
          })
          .when('/activation/:activateid', {
              templateUrl: 'partials/activate',
              controller: 'activatePracticeCtrl'
          })
          .when('/confirmpassword/:id', {
              templateUrl: 'partials/confirmpassword',
              controller: 'SettingsCtrl'
          })
          .when('/useractivation/:userid/:practicename', {
              templateUrl: 'partials/newUserSignup',
              controller: 'UsersCtrl'
          })
          .when('/userinvite/:userid/:practicename', {
              templateUrl: 'partials/userinvitesucces',
              controller: 'UsersCtrl'
          })
          .when('/success', {
              templateUrl: 'partials/success',
              controller: 'LoginCtrl'
          })
          .when('/signup', {
              templateUrl: 'partials/signup',
              controller: 'SignupCtrl'
          })
          .when('/settings', {
              templateUrl: 'partials/settings',
              controller: 'SettingsCtrl'

          })
          .when('/pricing', {
              templateUrl: 'partials/pricing',
              controller: 'PricingCtrl'
          })
            .when('/reportpricing', {
                templateUrl: 'partials/reportpricing',
                controller: 'ReportPricingCtrl'
            })
          .when('/about', {
              templateUrl: 'partials/aboutus'
          })
          .when('/contact', {
              templateUrl: 'partials/contactus'
          })
          .when('/inclinometer', {
              template: '<div ng-init="redirectToInclinometer()"></div>',
              controller: 'redirectCtrlForInclinometer'
          })
		  .when('/goniometer', {
              template: '<div ng-init="redirectToGoniometer()"></div>',
              controller: 'redirectCtrlForGoniometer'
          })
		  .when('/faq', {
              templateUrl: 'partials/faq'
          })
          //.when('/blog', {
          //    templateUrl: 'partials/blogs'
          //})
          .when('/learn', {
              templateUrl: 'partials/learn'
          })
          /*.when('/sample', {
              templateUrl: 'partials/sample'
          })*/
          .when('/testimonial/random', {
              templateUrl: 'partials/random'
          })
          .when('/testimonial', {
              templateUrl: 'partials/testimonial-new'
          })
          .when('/docfirst', {
              templateUrl: 'partials/docfirst'
          })
          .when('/pr2', {
              templateUrl: 'partials/pr2'
          })
          .when('/pr4', {
              templateUrl: 'partials/pr4'
          })
          .when('/userprofile', {
              templateUrl: 'partials/user-profile',
              controller: 'UsersCtrl',
              authenticate: true

          })
		  .when('/myprofile', {
              templateUrl: 'partials/user-profile',
              controller: 'UsersCtrl',
              authenticate: true

          })
		  .when('/inviteuser', {
              templateUrl: 'partials/user-profile',
              controller: 'UsersCtrl',
              authenticate: true
          })
		.when('/practiceprofile', {
			templateUrl: 'partials/practice-profile',
			controller: 'PracticeCtrl',
			authenticate: true
		})
		.when('/salesperson', {
			templateUrl: 'partials/salesperson',
			controller: 'SalespersonCtrl',
			authenticate: true
		})
	   .when('/reportlist', {
		   templateUrl: 'partials/reportinfo',
		   controller: 'FormCtrl',
		   authenticate: true
	   })
		.when('/templates', {
			templateUrl: 'partials/templates',
			controller: 'TemplateCtrl',
			authenticate: true
		})
	   .when('/formbuilder', {
		   templateUrl: 'partials/formBuilder',
		   controller: 'FormbuilderCtrl',
		   authenticate: true
	   })
		.when('/templatebuilder', {
			templateUrl: 'partials/formBuilder',
			controller: 'FormbuilderCtrl',
			authenticate: true
		})
	   .when('/form', {
		   templateUrl: 'partials/createForm',
		   controller: 'FormCtrl',
		   authenticate: true
	   })
		.when('/reports', {
			templateUrl: 'partials/reportsection',
			controller: 'PostCtrl',
			authenticate: true
		})
		.when('/reportform', {
			templateUrl: 'partials/reportform',
			controller: 'reportFormCtrl',
			authenticate: true
		})
		.when('/addpatient', {
			templateUrl: 'partials/patient-add',
			controller: 'PatientCtrl',
			authenticate: true
		})
		.when('/patientdemographics', {
			templateUrl: 'partials/patient-demographics',
			controller: 'PatientCtrl',
			authenticate: true
		})
		.when('/patientlibrary/:patientid', {
			templateUrl: 'partials/patient-library',
			controller: 'PatientCtrl',
			authenticate: true
		})
		.when('/patient/createinjury', {
			templateUrl: 'partials/createinjury',
			controller: 'injuryCtrl',
			authenticate: true
		})
		.when('/createreport', {
			templateUrl: 'partials/formreport',
			controller: 'reportFormCtrl',
			authenticate: true
		})
		.when('/unsignedreports', {
			templateUrl: 'partials/unsignedreports',
			controller: 'unsignedReportsCtrl',
			authenticate: true
		})
		.when('/completedpr4report', {
			templateUrl: 'partials/completedpr4report',
			controller: 'completedpr4reportCtrl',
			authenticate: true
		})
		.when('/reportpreviewincluded', {
			templateUrl: 'partials/reportpreviewincluded',
			controller: 'formdataDownloadCtrl',
			authenticate: true
		})
		.when('/demoideal', {
			templateUrl: 'partials/idletimeoutpage',
			controller: 'DemoCtrl',
			authenticate: true
		})
		.when('/submittedreport', {
			templateUrl: 'partials/ratersubmittedreport',
			controller: 'submitreportCtrl',
			authenticate: true
		})
		.when('/stateselection', {
			templateUrl: 'partials/stateselection',
			controller: 'PatientCtrl',
			authenticate: true
		})
		.when('/useractivity', {
			templateUrl: 'partials/useractivitypage',
			controller: 'useractivityCtrl',
			authenticate: true
		})
		.when('/chargereport', {
			templateUrl: 'partials/chargereport',
			controller: 'chargereportCtrl',
			authenticate: true
		})
		.when('/admin/pricing', {
			templateUrl: 'partials/globalpricing',
			controller: 'ReportPricingCtrl',
			authenticate: true
		})
		.when('/classic', {
			template: '<div ng-init="redirect()"></div>',
			controller: 'redirectCtrl'
		})
		 .when('/jointoday', {
			 templateUrl: 'partials/jointoday'
		 })
		.when('/googlee7116de807cba6b4', {
			template: '<div ng-init="redirecttoVerificationPage()"></div>',
			controller: 'redirectVerCtrl'
		})
		.when('/google6373496e5ed57f74', {
			template: '<div ng-init="redirecttoYoutubeVerificationPage()"></div>',
			controller: 'redirectYoutubeVerCtrl'
		})
		.when('/googled616db3beafa74e8', {
			template: '<div ng-init="redirecttoStagingVerificationPage()"></div>',
			controller: 'redirectStagingVerCtrl'
		})
		.when('/insurance',{
			templateUrl: 'partials/insurance'
		})
		 .when('/attorneys',{
			templateUrl: 'partials/attorneys'
		})
		.when('/provider',{
			templateUrl: 'partials/provider',
			controller:  'websitePageCtrl'
		})
		.when('/changepassword',{
			templateUrl: 'partials/changeUserPassword',
			controller:  'changeUserPasswordCtrl'
        })
		.when('/workstatusfax',{
			templateUrl: 'partials/workstatusFaxScreen',
			controller:  'workstatusController'
        })
		.when('/security',{
			templateUrl: 'partials/security'
		})
		.when('/oauth', {
              templateUrl: 'partials/oauth',
              controller: 'OauthCtrl',
        })
		.when('/injury/:kickstartid', {
              templateUrl: 'partials/injurykickstart',
              controller: 'injurykickstart'
        })
		.when('/injurykickstartsuccess/:kickstartid', {
              templateUrl: 'partials/injurykickstartsuccess',
			  controller: 'injurykickstartsuccess'
        })
		.when('/addendum/:reportid', {
              templateUrl: 'partials/addendum',
              controller: 'addendumCtrl'
        })
		.when('/athena-importpatient', {
             templateUrl: 'partials/athena/athena-patientImport',
             controller: 'athenaPatientDetailsCtrl',
			 authenticate: true
       })
       .when('/athena-sso-result', {
             templateUrl: 'partials/athena/athena-sso-result',
              controller: 'athenaPatientDetailsCtrl'
       })
		.otherwise({
		  redirectTo: '/'
		});

        $locationProvider.html5Mode(true);

        // Intercept 401s and 403s and redirect you to login
        $httpProvider.interceptors.push(['$q', '$location', function ($q, $location) {
            return {
                'responseError': function (response) {
                    if (response.status === 401 || response.status === 403) {
                        $location.path('/login');
                        return $q.reject(response);
                    }
                    else {
                        return $q.reject(response);
                    }
                }
            };
        }]);

		$httpProvider.defaults.cache = false;
		if (!$httpProvider.defaults.headers.get) {
		  $httpProvider.defaults.headers.get = {};
		}
		// disable IE ajax request caching
		$httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
    })
    .run(function ($rootScope, $location, Auth, $route, $window) {

        // Redirect to login if route requires auth and you're not logged in
        $rootScope.$on('$routeChangeStart', function (event, next) {

            if (document.getElementById("hideNavbar")) {
                if (document.getElementById("hideNavbar").style) {
                    document.getElementById("hideNavbar").style.visibility = "visible";
                }
            }

            if (next.authenticate && !Auth.isLoggedIn()) {
                $location.path('/login');
            }

        });

        //Google Analytics - Send Different Page views
        $rootScope.$on('$routeChangeSuccess',
        function (event) {

            if (!$window.ga) {
                return;
            }
            $window.ga('send', 'pageview', {
                page: $location.path()
            });
        });

    }).config(['$keepaliveProvider', '$idleProvider', function ($keepaliveProvider, $idleProvider) {
        //testing
        //$idleProvider.idleDuration(15);
        //$idleProvider.warningDuration(10);
        //live
       // $idleProvider.idleDuration(900);
       // $idleProvider.warningDuration(60);
       // $keepaliveProvider.interval(10);
		//new idle timeout system

        // Set the idle and timeout timers in seconds.
        // User is considered idle
        //$idleProvider.setIdleTime(900);
        // User will timeout at the end of 15 seconds anfter considered idle.
        //$idleProvider.setTimeoutTime(10);
    }])
	.run(['$idle',function ($idle) {
        //$idle.watch();
    }]);

	/*
	 * this swallows backspace keys on any non-input element.
	 * stops backspace -> back
	 */
	var rx = /INPUT|SELECT|TEXTAREA/i;

	$(document).bind("keydown keypress", function(e){
		if( e.which == 8 ){ // 8 == backspace
			if(!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly ){
				e.preventDefault();
			}
		}
	});
