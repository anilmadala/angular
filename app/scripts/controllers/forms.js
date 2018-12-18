/**
 * Created by Mayur.Mathurkar on 3/10/14.$scope.section
 */
angular.module('ratefastApp').controller('FormCtrl', function ($scope, $cookies, FormTypeList, FormList, versionList, saveForm, getReportlist, saveReport, $location, getReportlistPost, $sessionStorage) {
    $scope.section = 1;
    $scope.itemsperpage = 9;
    $scope.search = "";
    $scope.statusId = "";
    $scope.isAlert = false;
    $scope.create_type = "new";
    //For getting list of questions
    $scope.getformtype = function () {
        FormTypeList.query(function (responce) {
            $scope.formtypes = responce;
        });
    }
    $scope.isLoad = false;
    $scope.getformlist = function (pagenumber) {
        debugger;
        var query = {
            pagenum: pagenumber,
            pageController: 'page',
			formType: 'form'
        };
        $scope.currentPage = pagenumber;
        if ($scope.search != "") {
            query.searchId = $scope.search;
            query.searchController = 'search';
        }
        if ($scope.statusId != "") {
            query.statusId = $scope.statusId;
            query.statusController = 'status';
        }
        FormList.save(query, function (formList) {
            debugger;
            $scope.formlist = formList.formList;
            $scope.totalItems = formList.totalitem;
            $scope.noOfPages = formList.pages;
            //$scope.formlist = responce;
        });
    }

    $scope.formid = function (formId) {
        if ($cookies.formId) {
            $cookies.formId = '';
        }
        $cookies.formId = formId;
    };

    $scope.reportid = function (reportId) {
        if ($sessionStorage.reportId) {
            $sessionStorage.reportId = '';
        }
        $sessionStorage.reportId = reportId;
    };

    $scope.filterPractices = function () {
        $scope.currentPage = "1";
        $scope.getformlist($scope.currentPage);
    }
    $scope.searchForm = function () {
        $scope.currentPage = '1';
        $scope.getformlist($scope.currentPage);
    };
    $scope.openReportList = function () {
        $scope.section = 3;
    }
    $scope.getversion = function () {
        $scope.isLoad = true;
        versionList.query({ formid: $scope.formid }, function (responce) {
            $scope.versionlist = responce;
            $scope.isLoad = false;
        });
    }

    $scope.openFormbuilder = function (url) {
        window.location = "/formbuilder/" + url;
    }

    $scope.createForm = function (type) {
        debugger;
        //new form if action 0 i.e create otherwise copy
        if (type == 1) {
            saveForm.save({ addform: $scope.newformtype, action: 0, type: 'form' }, function (result, err) {
                debugger;
                var formid = result.id;
                if (formid) {
                    debugger;


                    $cookies.formId = formid;
                    //window.location('/formbuilder');
                    $location.path("/formbuilder");
                }
                else {
                    $scope.url = '';
                }
                if (!err) {
                    $scope.isAlert = true;
                }
            }, function (err) {
                debugger;
            }).$promise;
        }
        else {
            debugger;
            saveForm.save({ addform: $scope.newformtype, version: $scope.version, action: 1, mainform: $scope.formid, type: 'form' }, function (resp, err) {
                debugger;
                var formid = resp.id;
                if (formid) {
                    debugger;

                    $cookies.formId = formid;
                    //window.location('/formbuilder');
                    $location.path("/formbuilder");
                }
            }, function (err) {
                debugger;
            }).$promise.then(function (formid) {

            });
        }
    }

    // $scope.saveformData = function() {
    //     saveForm.update({ id: $scope., data: $scope.report }, function (response) {

    //     });
    // };

    $scope.changedrop = function () {
        debugger;
        $scope.isAlert = false;
        $scope.newformtype = "";
        $scope.formid = "";
        $scope.version = "";
        $scope.reportversion = "";
        $scope.reportversions = "";
    }
    $scope.ViewEnum = {
        Card: 0,
        List: 1
    };
    $scope.changeView = function (view) {
        switch (view) {
            case $scope.ViewEnum.Card:
                $scope.listViewEnabled = false;
                break;
            case $scope.ViewEnum.List:
                $scope.listViewEnabled = true;
                break;
        }
    };

    $scope.getReportlist = function (pagenumber) {
        debugger;
        var query = {
            pagenum: pagenumber,
            pageController: 'page',
			formType: 'report'
        };
        $scope.currentPage = pagenumber;
        if ($scope.search != "") {
            query.searchId = $scope.search;
            query.searchController = 'search';
        }
        if ($scope.statusId != "") {
            query.statusId = $scope.statusId;
            query.statusController = 'status';
        }
        getReportlistPost.save(query, function (reportlist) {
            debugger;
            $scope.reportlist = reportlist.reportList;
            $scope.totalItems = reportlist.totalitem;
            $scope.noOfPages = reportlist.pages;
            $scope.CurrentPage = reportlist.page;
        });
    }

    $scope.filterReportStatus = function () {
        $scope.currentPage = "1";
        $scope.getReportlist($scope.currentPage);
    }

    $scope.searchReport = function () {
        $scope.currentPage = '1';
        $scope.getReportlist($scope.currentPage);
    };

    $scope.createReport = function (type) {
        debugger;
        var reqdata = {
            formtype: $scope.formid,
            formversion: $scope.version,
            reportformat: $scope.format,
            reportversion: $scope.reportversions
        }
        saveReport.save({ data: reqdata }, function (res) {
            debugger;
            //window.location = "/reports/#" + res.data._id;
            $sessionStorage.reportId = res.data._id;
            $location.path('/reports/');
        }, function (err) {

        }).$promise;

    };

    $scope.Formbuilder = function (formid) {
        
    }

});