/* global io */
'use strict';

angular.module('ratefastApp')
  .factory('socket', function(socketFactory, $modal, $rootScope, $location) {
    // socket.io now auto-configures its connection when we ommit a connection url
      var ioSocket = io('', {
          // Send auth token on connection, you will need to DI the Auth service above
          // 'query': 'token=' + Auth.getToken()
          path: '/socket.io-client',
          'transports': ['websocket', 'xhr-polling']
      });


    var socket = socketFactory({
      ioSocket: ioSocket
    });


    //var movetolib = function (callback) {
    //    var cb = callback || angular.noop;
    //    debugger;
    //    $scope.exitform('/patient/createinjury');
    //};

    return {
      socket: socket,
      authroize: function (user) {
          debugger;
        //tell socket so that the same user logged at ohter place can logout
        socket.emit("login", user);
        socket.on("reportopenedbyuser", function (data) {
            debugger;
          
            var currentPath = window.location.pathname;
            
            if (currentPath == '/createreport') {
                debugger;
                var scope = angular.element(document.getElementById("reportForm")).scope();
                debugger;
                if (data.reportid == scope.reportId) {
                    var sectionId = scope.currentBdSectionId ? scope.currentBdSectionId : scope.currentsectionId;

                    if (scope.reportStatus == 'open' || scope.reportStatus == 'level1' || scope.reportStatus == 'level2') {

                        if (angular.element('#' + sectionId).scope() && !scope.fieldDisable) {

                            var Text = "angular.element('#" + sectionId + "').scope()." + sectionId + '.$dirty';
                            var result = eval(Text);

                            if (result) {
                                scope.savenewPatientdata();
                            }

                        }
                    } 
					$modalStack.dismissAll('close');
                    $modal.open({
                        templateUrl: 'forceLogoutReport-dialog.html',
                        windowClass: 'modal-danger'
                    });
                    if ($rootScope.currentUser.role == 'rater1' || $rootScope.currentUser.role == 'rater2') {
                        scope.exitform('/submittedreport');
                    }
                    else {
                        scope.exitform('/patient/createinjury');
                    }
                }
                
            }
         
        });
      },

      disconnect: function () {
          try {
              

              socket.removeAllListeners("samelogin");
          }
          catch (err) {
              
          }
     },
      
      //Emit when report is opened
      reportopened: function (user, reportid) {
              
          //tell socket so that the same user logged at ohter place can logout
          socket.emit("reportopenedbyuser", { 'user': user, 'reportid': reportid });
      },
      
       /**
       * logout if the same user login the socket
       *
       * @param modelName
       */
      samelogin: function (currentuser, cb) {
         /**
         * logout user if same user login somewhere
         */
        socket.on("samelogin", function (item) {
         
         
          cb = cb || angular.noop;
          //if user id matches.. logout current user
          if (item.id == currentuser.id) {
            cb(); 
          }
        });

      }

    };
  });
