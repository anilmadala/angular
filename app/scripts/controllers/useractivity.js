
'use strict';

angular.module('ratefastApp')
    .controller('useractivityCtrl', function ($scope, $http, $routeParams, $rootScope, getreportactivity, getreportAllactivity, downloadReportSafari, $filter) {
        $scope.loginActivity = true;
        $scope.showfirsttable = false;
        $scope.showsecondtable = false;
        $scope.formd = [];
        $scope.form = [];
        $scope.itemsByPage = 10;
        $scope.dateOptions = {
            startingDay: 1,
            changeMonth: true,
            changeYear: true,
            showAnim: "clip",
            clearBtn: true
        };
        $scope.isLoad = false;

        $scope.formats = ['mm/dd/yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.itemsByPage = 10;

        $scope.select2Options = {
            allowClear: true,
            'multiple': true
        };

        $scope.getpracticesList = function () {
            $http.get('/api/getreportactivity/getpractices')
              .success(function (data, status, headers, config) {
                  debugger;
                  $scope.practiceList = data[0].data;
              });
        }

        $scope.createuserCSV = function () {
            debugger;
            $scope.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
            if ($scope.isSafari) {
                var filename = $filter('date')(Date.now(), 'MM-dd-yyyy') + ' ' + 'Useractivity.csv';
                //var filename = '04-08-2015 johnpractice DFR Discovery.zip';
            } else {
                var filename = $filter('date')(Date.now(), 'MM-dd-yyyy') + ' ' + 'Useractivity.csv';
            }
            var content = 'User, Sign in date, Sign in time, Sign out date, Sign out time';
            for (var i = 0; i < $scope.rowCollection.length; i++) {
                content = content.concat('\n');
                if ($scope.rowCollection[i].username) {
                    content = content.concat($scope.rowCollection[i].username + ', ');
                } else {
                    content = content.concat(', ');
                }
                if ($scope.rowCollection[i].signindate) {
                    content = content.concat($filter('date')($scope.rowCollection[i].signindate, 'MM/dd/yyyy') + ', ');
                    content = content.concat($filter('date')($scope.rowCollection[i].signindate, 'HH:mm:ss') + 'PST, ');
                } else {
                    content = content.concat(', ');
                    content = content.concat(', ');
                }
                if ($scope.rowCollection[i].signoutdate) {
                    content = content.concat($filter('date')($scope.rowCollection[i].signoutdate, 'MM/dd/yyyy') + ', ');
                    content = content.concat($filter('date')($scope.rowCollection[i].signoutdate, 'HH:mm:ss') + 'PST, ');
                } else {
                    content = content.concat(', ');
                    content = content.concat(', ');
                }
            }
            if ($scope.isSafari) {
                //window.open("/tmp/" + filename, "_blank", "fullscreen=no,toolbar=yes, width=800, height=600, menubar=yes, status=no,scroll=yes");
                downloadReportSafari.save({ 'content': content, 'filename': filename }).$promise.then(function (response) {
                    var popup = window.open("/tmp/" + filename, "_blank", "fullscreen=no,toolbar=yes, width=800, height=600, menubar=yes, status=no,scroll=yes");

                    if (popup == undefined) {
                        alert('Please disable your popup blocker');
                    }
                });

            } else {
                var blobs = [];
                blobs.push(content);
                var blob = new Blob(blobs, {
                    type: "application/vnd.oasis.opendocument.text"
                });
                saveAs(blob, filename);
            }
        }

        $scope.createreportuserCSV = function () {
            debugger;
            $scope.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
            if ($scope.isSafari) {
                var filename = $filter('date')(Date.now(), 'MM-dd-yyyy') + ' ' + 'reportactivity.csv';
                //var filename = '04-08-2015 johnpractice DFR Discovery.zip';
            } else {
                var filename = $filter('date')(Date.now(), 'MM-dd-yyyy') + ' ' + 'reportactivity.csv';
            }
            var content = 'Report ID, Opened by, Level, Admin, Open date, Open time, Close date, Close time';
            for (var i = 0; i < $scope.rowCollection.length; i++) {
                content = content.concat('\n');
                if ($scope.rowCollection[i].reportid) {
                    content = content.concat($scope.rowCollection[i].reportid + ', ');
                } else {
                    content = content.concat(', ');
                }
                if ($scope.rowCollection[i].username) {
                    content = content.concat($scope.rowCollection[i].username + ', ');
                } else {
                    content = content.concat(', ');
                }
                if ($scope.rowCollection[i].level) {
                    content = content.concat($scope.rowCollection[i].level + ', ');
                } else {
                    content = content.concat(', ');
                }
                if ($scope.rowCollection[i].rolename) {
                    content = content.concat($scope.rowCollection[i].rolename + ', ');
                } else {
                    content = content.concat(', ');
                }
                
                if ($scope.rowCollection[i].opendate) {
                    content = content.concat($filter('date')($scope.rowCollection[i].opendate, 'MM/dd/yyyy')+', ');
                    content = content.concat($filter('date')($scope.rowCollection[i].opendate, 'HH:mm:ss')+'PST, ');
                } else {
                    content = content.concat(', ');
                    content = content.concat(', ');
                }
                if ($scope.rowCollection[i].closedate) {
                    content = content.concat($filter('date')($scope.rowCollection[i].closedate, 'MM/dd/yyyy') + ', ');
                    content = content.concat($filter('date')($scope.rowCollection[i].closedate, 'HH:mm:ss') + 'PST, ');
                } else {
                    content = content.concat(', ');
                    content = content.concat(', ');
                }
            }
            if ($scope.isSafari) {
                //window.open("/tmp/" + filename, "_blank", "fullscreen=no,toolbar=yes, width=800, height=600, menubar=yes, status=no,scroll=yes");
                downloadReportSafari.save({ 'content': content, 'filename': filename }).$promise.then(function (response) {
                    var popup = window.open("/tmp/" + filename, "_blank", "fullscreen=no,toolbar=yes, width=800, height=600, menubar=yes, status=no,scroll=yes");

                    if (popup == undefined) {
                        alert('Please disable your popup blocker');
                    }
                });

            } else {
                var blobs = [];
                blobs.push(content);
                var blob = new Blob(blobs, {
                    type: "application/vnd.oasis.opendocument.text"
                });
                saveAs(blob, filename);
            }
        }

        $scope.blanckdata = function () {
            debugger;
            $scope.submited = false;
            $scope.showfirsttable = false;
            $scope.showsecondtable = false;
            $scope.formd = [];
            $scope.form = [];

        }

        $scope.create = function (isValid, formdata) {
            debugger;
            $scope.submited = true;
            if (isValid) {
                $scope.isLoad = true;
                getreportactivity.save({ startdate: formdata.startdate, enddate: formdata.enddate, practicename: formdata.practicename.practicename }).$promise.then(function (reports) {
                    debugger;
                    $scope.isLoad = false;
                    $scope.rowCollection = reports.data;
                    $scope.displayedCollection = [].concat($scope.rowCollection);
                    if ($scope.displayedCollection.length > 0) {
                        $scope.showfirsttable = true;
                    } else {
                        $scope.showfirsttable = false;
                    }
                });
            }
        }

        $scope.createreport = function (isValid, formdata) {
            debugger;
            $scope.submited = true;
            if (isValid) {
                $scope.isLoad = true;
                getreportAllactivity.save({ startdate: formdata.startdate, enddate: formdata.enddate, practicename: formdata.practicename.practicename }).$promise.then(function (reports) {
                    debugger;
                    $scope.isLoad = false;
                    //var rowCollection = reports.data;
                    //$scope.rowCollection = rowCollection.filter(function (val) {
                    //    debugger;
                    //    return (val.reportid != '');
                    //});
                    $scope.rowCollection = reports.data;
                    $scope.displayedCollection = [].concat($scope.rowCollection);
                    
                    if ($scope.displayedCollection.length > 0) {
                        $scope.showsecondtable = true;
                    } else {
                        $scope.showsecondtable = false;
                    }
                });
            }
        }
    });