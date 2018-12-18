angular.module('ratefastApp').controller('PostCtrl', function ($scope, $location, $cookies, $http, $routeParams, getReportlist, getFormdata, $builder, updatereportdata, $modal, $sessionStorage) {
    
    $scope.isHide = false;
    $scope.reportid = $sessionStorage.reportId;

    $scope.changediv = function (action) {
        debugger;
        if (action == 1) {
            $scope.changeeditor = 'col-sm-11';
            $scope.isHide = true;
        }
        else {
            $scope.changeeditor = 'col-sm-8';
            $scope.isHide = false;
        }
    }
    $scope.changeeditor = 'col-sm-8';
    $scope.tinymceOptions = {
        selector: "textarea",
        height: 650,
        theme: "modern",
        //external_plugins: { "nanospell": "D:\ratefastlatest\nanospell" },
        nanospell_server: "java",
        onchange_callback: "myCustomOnChangeHandler",
        plugins: [
           "advlist autolink lists link image charmap print preview hr anchor pagebreak",
           "searchreplace wordcount visualblocks visualchars code fullscreen",
           "insertdatetime media nonbreaking save table contextmenu directionality",
           "emoticons template paste textcolor moxiemanager", "fullpage", "spellchecker"
        ],
        toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
        toolbar2: "print preview media | forecolor backcolor emoticons",
        toolbar3: "fullpage",
        toolbar4: "spellchecker",
        valid_children: "+body[style],+body[div],p[strong|a|#text],+div[ng-repeat],+ng-pluralize,+div[style]",
        extended_valid_elements: 'ng-pluralize[count|when],tbody[ng-init],tr[ng-init|style],input[accept|alt|checked|disabled|maxlength|name|readonly|size|src|type|value|ng-init|style|ng-checked],div[ng-repeat|style|ng-if|ng-hide|ng-bind-html|ng-bind-template|filter|orderBy|capitalize|$last|ng-animate|class|ng-show|ng-init|mapdefault|ng-checked|ng-include|src],span[ng-bind|ng-if|dynamic|class|map|ng-bind-html|ng-bind-template|filter|join|orderBy|capitalize|$last|ng-repeat|ng-show|ng-init|mapdefault|ng-checked|mapGroinGenitaliaForSkin|ng-include|src],mycustominline',
        custom_elements: 'mycustom-block,~mycustominline',
        image_advtab: true
        //image_advtab: true,
        //templates: [
        //    { title: 'Test template 1', content: 'Test 1', url: "views/partials/template1.html" },
        //    { title: 'Test template 2', content: 'Test 2' }
        //]
    };

    $scope.myCustomOnChangeHandler = function () {
        var data = inst.getBody().innerHTML;
    };


    $scope.getreportdata = function () {
        debugger;
        var query = {
            pagenum: 9999,
            pageController: 'page',
            id: $sessionStorage.reportId
        };

        var bodypartdetail = new Object();
        var bodypartuniqueid = [];
        //var reportID = (location.pathname.split('/')[2]);       
        getReportlist.query(query, function (reportlist) {
            debugger;
            $scope.reportlist = reportlist[0].reportList;
            $scope.currentreport = $scope.reportlist[0];
            getFormdata.query({ id: "forreport", formtype: $scope.currentreport.formtype, version: $scope.currentreport.formversion }, function (responce) {
                debugger;
                $scope.formlist = responce[0];
                $scope.report = angular.fromJson($scope.formlist.dataform);
                for (var i = 0; i < $scope.report.sections.length; i++) {
                    if ($scope.report.sections[i].type == 'bodypart') {
                        $scope.bodypart = $scope.$eval($scope.report.sections[i].modal);
                        for (var j = 0; j < $scope.$eval($scope.report.sections[i].modal).length; j++) {
                            debugger;
                            bodypartdetail[$scope.$eval($scope.report.sections[i].modal)[j]] = $scope.report.sections[i].sectiondataid + $scope.$eval($scope.report.sections[i].modal)[j];
                            //bodypartdetail[$scope.report.sections[i].sectiondataid + $scope.$eval($scope.report.sections[i].modal)[j]] = $scope.report.data[$scope.report.sections[i].sectiondataid + $scope.$eval($scope.report.sections[i].modal)[j]];
                        }
                    }
                }

                $scope.bodypartdata = bodypartdetail;
            });

        });

    };

    $scope.open = function () {
        var modalInstance = $modal.open({
            templateUrl: 'partials/reportpreviewnew.html',
            windowClass: 'app-modal-window',
            controller: 'reportPreviewController',
            resolve: {
                reportdata: function () {
                    return $scope.currentreport.reportdata;
                },
                report: function () {
                    return $scope.report;
                }
            }

        });
    }

    $scope.oneAtATime = true;

    $scope.addItem = function () {
        var newItemNo = $scope.items.length + 1;
        $scope.items.push('Item ' + newItemNo);
    };

    $scope.setscope = function () {
        $scope.currentreport.reportdata = tinyMCE.activeEditor.getContent();
    }

    $scope.savereportData = function () {
        updatereportdata.update({ reportid: $scope.currentreport._id, rdata: $scope.currentreport.reportdata }, function (resp) {
            alert('Report Succesfully Updated!');
        });
    };


});