'use strict';

angular.module('ratefastApp')
    .controller('FormbuilderCtrl', function ($scope, $http, $cookies, $builder, $validator, saveForm, $routeParams, getFormdata, $modal, $location, FormList, $route) {

        $scope.formidurl = $cookies.formId;
        var sortableEle;
        var checkbox;
        $scope.sortingLog = [];
        $scope.sortableOptions = {
            update: function (e, ui) {
                var curr = $scope.currentsection;
                var origin = ui.item.index();
                $scope.selectedIndex = origin;
            },
            stop: function (e, ui) {
                var curr = $scope.currentsection;
                var target = ui.item.index();
                $scope.selectedIndex = target;
            }
        };
        $scope.report = new Object();
        $scope.report.sections = [];
        $scope.report.forms = new Object();
        $scope.report.data = new Object();
        $scope.reportdata = new Object();
        $scope.selectedIndex = 0;

        $scope.currentsectionchange = function (s, index) {
            $scope.selectedIndex = index;
            $scope.currentsection = s;
            $scope.currentsectionId = s.sectiondataid;
        };

        $scope.checkname = function (sectionname) {
            if ($scope.sectionlist) {
                if ($scope.sectionlist.indexOf(sectionname) == -1) {
                    $scope.error = false;
                } else {
                    $scope.error = true;
                }
            }
        };

        $scope.open = function (currentsection) {   //******************(currentsection) parameter
            debugger;
            var modalInstance = $modal.open({
                templateUrl: 'partials/section.html',
                controller: 'SectionsCtrl',
                resolve: {
                    sectionlist: function () {
                        return $scope.report.sections;
                    },
                    currentsection: function () {
                        return currentsection;
                    },
                    formtype: function () {
                        return $scope.formtype
                    }
                   
                }
            });

            modalInstance.result.then(function (section) {
                debugger;
                var add = section.type;
                if (add) {                      //add
                    $scope.report.sections.push(section);
                    var cont = $scope.report.sections.length;
                    $scope.selectedIndex = cont - 1;
                } else {
                    $scope.report.sections = section;       //edit                    
                }

                $builder.addFormObject(section.sectiondataid, {
                    component: 'textInput',
                    label: 'Dummy Field',
                    description: 'Dummy Field',
                    placeholder: 'Dummy Field',
                    required: true,
                    editable: true
                });
                $scope.report.forms[section.sectiondataid] = $builder.forms[section.sectiondataid];
                $scope.report.data[section.sectiondataid] = new Object();
                $scope.currentsection = section;
                $scope.currentsectionId = section.sectiondataid;
            }, function () {

            });
        };

        //********************************* Start ***********************************

        $scope.openprompt = function (currentsection) {   //******************(currentsection) parameter
            debugger;
            var modalInstance = $modal.open({
                templateUrl: 'partials/prompt.html',
                controller: 'SectionsCtrl',
                resolve: {
                    sectionlist: function () {
                        return $scope.report.sections;
                    },
                    currentsection: function () {
                        return currentsection;
                    },
                    formlist: function () {
                        return $scope.formlist;
                    },
                    formtype: function () {
                        return $scope.formtype
                    }

                }

            });
            modalInstance.result.then(function (section) {
                debugger;
                delete $scope.report.forms[section.sectiondataid];
                delete $scope.report.data[section.sectiondataid];
                var i = $scope.report.sections.indexOf(section);
                if (i != -1) {
                    $scope.report.sections.splice(i, 1);
                }
            }, function () {

            });
        };

        $scope.editsection = function (section) {

            this.open(section);
        }

        $scope.deletesection = function (section) {
            this.openprompt(section);
        }

        //******************************* End *************************************

        $scope.preview = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/formPreview.html',
                controller: 'PreviewCtrl',
                windowClass: 'app-modal-window',
                resolve: {
                    formdata: function () {
                        return $scope.report;
                    },
                    formTitle: function () {
                        return $scope.responce;
                    },
                    currentsectionId: function () {
                        return $scope.currentsectionId;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.report = selectedItem;
            }, function () {
            });
        };


        $scope.getData = function () {
            debugger;
            $cookies.formId;
            if ($location.$$path == "/formbuilder") { $scope.type = "form"; } else { $scope.type = "template"; }
            getFormdata.query({ id: $cookies.formId, formtype: 0, version: 0 }, function (responce) {
                debugger;
                $scope.responce = responce;
                var data = new Object;
                data = angular.fromJson($scope.responce[0].dataform);
                $scope.formversion = responce[0].version;
                $scope.formname = responce[0].title;
                $scope.formtype = responce[0].formtype;
                $scope.report = angular.fromJson(responce[0].dataform);
                //var aa = data.data.bginfo.bginfogender;
                if (responce[0].dataform) {
                    //$scope.report = responce[0].dataform;
                    if ($scope.report) {
                        for (var i = 0; i < $scope.report.sections.length; i++) {
                            var aaaa = $scope.report.forms[$scope.report.sections[i].sectiondataid];
                            $builder.forms[$scope.report.sections[i].sectiondataid] = $scope.report.forms[$scope.report.sections[i].sectiondataid];
                        }
                        $scope.currentsection = $scope.report.sections[0].sectionname;
                        $scope.currentsectionId = $scope.report.sections[0].sectiondataid;
                    }
                }

            }), function (err) {

            }.$promise;
        };


        //$scope.getData = function () {
        //    debugger;
        //    if ($location.$$path == "/formbuilder") { $scope.type = "form"; } else { $scope.type = "template"; }
        //    getFormdata.query({ id: $scope.formidurl, formtype: 0, version: 0 }, function (responce) {
        //        $scope.responce = responce;
        //        var data = new Object;
        //        data = angular.fromJson($scope.responce[0].dataform);
        //        //var aa = data.data.bginfo.bginfogender;
        //        if (responce[0].dataform) {
        //            $scope.formversion = responce[0].version;
        //            $scope.formname = responce[0].title;
        //            $scope.formtype = responce[0].formtype;
        //            $scope.report = angular.fromJson(responce[0].dataform);
        //            //$scope.report = responce[0].dataform;

        //            if ($scope.report) {
        //                for (var i = 0; i < $scope.report.sections.length; i++) {
        //                    var aaaa = $scope.report.forms[$scope.report.sections[i].sectiondataid];
        //                    $builder.forms[$scope.report.sections[i].sectiondataid] = $scope.report.forms[$scope.report.sections[i].sectiondataid];
        //                }

        //                $scope.currentsection = $scope.report.sections[0].sectionname;
        //                $scope.currentsectionId = $scope.report.sections[0].sectiondataid;
        //            }
        //        }

        //    }), function (err) {

        //    }.$promise;
        //};

        $scope.saveformData = function (req) {
            debugger;
            var obj = $scope.report.forms;
            Object.keys(obj).forEach(function (key) {
                var objectKey = obj[key];
                for (var i = 0; i < objectKey.length; i++) {                   
                    objectKey[i].id = i;
                }
            });
            debugger;
            var aaaaaa = $scope.report;                      
            if ($scope.type == "template") {
                
                saveForm.update({ id: $scope.formidurl, data: $scope.report, type: 'template' }).$promise.then(function (res) {
                    alert('Data Saved Successfully');
                    //$route.reload();
                });
            }
            else {
                saveForm.update({ id: $scope.formidurl, data: $scope.report, type: 'form' }).$promise.then(function () {
                    alert('Data Saved Successfully');
                    //$route.reload();
                });
            }            
        }

        return $scope.submit = function (section) {
            return $validator.validate($scope, section).success(function () {
                return console.log('success');
            }).error(function () {
                return console.log('error');
            });
        };


    });

