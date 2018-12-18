/**
 * Created by Mayur.Mathurkar on 3/10/14.$scope.section
 */
angular.module('ratefastApp').controller('TemplateCtrl', function ($scope, $cookies, FormTypeList, FormList, versionList, saveForm, getReportlist, saveReport) {
    $scope.section = 1;
    $scope.itemsperpage = 9;
    $scope.search = "";
    $scope.statusId = "";
    $scope.isAlert = false;
    $scope.create_type = "new";
    $scope.newformtype = "";
    $scope.templatename = "";
    $scope.existingtemplate = "";
    $scope.existingformtype = "";
    //For getting list of questions
    $scope.getformtype = function () {
        FormTypeList.query(function (responce) {         
            $scope.formtypes = responce;
        });
    }
    $scope.getformlist = function (pagenumber) {
     
        var query = {
            pagenum: pagenumber,
            pageController: 'page',
            formType: 'template'
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
		/*
        FormList.query(query, function (formList) {
            debugger;
            $scope.templatelist = formList[0].formList;
            $scope.totalItems = formList[0].totalitem;
            $scope.noOfPages = formList[0].pages;
            //$scope.formlist = responce;
        });
          */
		FormList.save(query, function (formList) {
            debugger;
           //$scope.formlist = formList.formList;;
        }).$promise.then(function (formList) {
        	 $scope.templatelist = formList.formList;
             $scope.totalItems = formList.totalitem;
             $scope.noOfPages = formList.pages;
        });;
    }

    $scope.templateid = function (templateId) {
        debugger;
        if ($cookies.formId) {
            $cookies.formId = '';
        }
        $cookies.formId = templateId;
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
        versionList.query({ formid: $scope.formid }, function (responce) {
            $scope.versionlist = responce;
        });
    }

    $scope.openFormbuilder = function (url) {
        window.location = "/templatebuilder/" + url;
    }

    $scope.createForm = function (type) {
        //new form if action 0 i.e create otherwise copy
        if (type == 1) {
            saveForm.save({ addform: $scope.newformtype, action: 0, type: 'template', templatename: $scope.templatename }, function (result) {
                debugger;
                var formid = result.id;
                if (formid) {
                    debugger;
                    window.location = "/templatebuilder/#" + formid;
                }
                else {
                    $scope.url = '';
                }
                if (!err) {
                    $scope.isAlert = true;
                }
            }, function (err) {

            }).$promise;
        }
        else {
            debugger;
            saveForm.save({ addform: $scope.newformtype, version: $scope.version, action: 1, mainform: $scope.existingformtype, type: 'template', templatename: $scope.templatename }, function (resp) {
                debugger;
                var formid = resp.id;
                if (formid) {
                    debugger;
                    window.location = "/templatebuilder/#" + formid;
                }
            }, function (err) {
                debugger;
            }).$promise;
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
        var query = {
            pagenum: pagenumber,
            pageController: 'page'
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
        getReportlist.query(query, function (reportlist) {
            $scope.reportlist = reportlist[0].reportList;
            $scope.totalItems = reportlist[0].totalitem;
            $scope.noOfPages = reportlist[0].pages;
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
            window.location = "/templates/#" + res.data._id;
        }, function (err) {

        }).$promise;

    };

    $scope.Formbuilder = function (formid) {
       
    }

});