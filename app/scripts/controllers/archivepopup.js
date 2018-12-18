'use strict';

angular.module('ratefastApp')
    .controller('archivectrl', function ($scope, $http, $routeParams, $cookies, $modalInstance, text, injuryId, Injuries, page, $route, $rootScope, $modal, isReload, $sessionStorage) {

        debugger;
        $scope.isLoader = false;
        //$scope.columns = ["jobtitle", "durationofemployement", "durationtype", "status", "updatedby", "updateddate"];
        debugger;
        switch (text) {
            case 'employment':
                $scope.columns = ["jobtitle", "durationofemployement", "durationtype", "status", "updatedby", "updateddate"];
                break;
            case 'employercontact':
                $scope.columns = ["employercontact_firstname", "employercontact_lastname", "employercontact_email", "employercontact_telephoneno", "employercontact_extension", "employercontact_fax", "employercontact_address", "employercontact_city", "employercontact_state", "employercontact_zipcode", "status", "updatedby", "updateddate"];
                break;
            case 'claimsadjuster':
                $scope.columns = ["claimsadjuster_firstname", "claimsadjuster_lastname", "claimsadjuster_email", "claimsadjuster_telephoneno", "claimsadjuster_extension", "claimsadjuster_fax", "claimsadjuster_address", "claimsadjuster_city", "claimsadjuster_state", "claimsadjuster_zipcode", "status", "updatedby", "updateddate"];
                break;
            case 'billreview':
                $scope.columns = ["billreview_firstname", "billreview_lastname", "billreview_email", "billreview_telephoneno", "billreview_extension", "billreview_fax", "billreview_address", "billreview_city", "billreview_state", "billreview_zipcode", "status", "updatedby", "updateddate"];
                break;
            case 'utilizationreview':
                $scope.columns = ["utilizationreview_firstname", "utilizationreview_lastname", "utilizationreview_email", "utilizationreview_telephoneno", "utilizationreview_extension", "utilizationreview_fax", "utilizationreview_address", "utilizationreview_city", "utilizationreview_state", "utilizationreview_zipcode", "status", "updatedby", "updateddate"];
                break;
            case 'applicantattorney':
                $scope.columns = ["applicantattorney_firstname", "applicantattorney_lastname", "applicantattorney_email", "applicantattorney_telephoneno", "applicantattorney_extension", "applicantattorney_fax", "applicantattorney_address", "applicantattorney_city", "applicantattorney_state", "applicantattorney_zipcode", "status", "updatedby", "updateddate"];
                break;
            case 'defenseattorney':
                $scope.columns = ["defenseattorney_firstname", "defenseattorney_lastname", "defenseattorney_email", "defenseattorney_telephoneno", "defenseattorney_extension", "defenseattorney_fax", "defenseattorney_address", "defenseattorney_city", "defenseattorney_state", "defenseattorney_zipcode", "status", "updatedby", "updateddate"];
                break;
            case 'rncasemanager':
                $scope.columns = ["rncasemanager_firstname", "rncasemanager_lastname", "rncasemanager_email", "rncasemanager_telephoneno", "rncasemanager_extension", "rncasemanager_fax", "rncasemanager_address", "rncasemanager_city", "rncasemanager_state", "rncasemanager_zipcode", "status", "updatedby", "updateddate"];
                break;
            default:
                $scope.columns = [];
        }


        $scope.isLoad = false;
        if (text != "simplepopUp" && text != "cancel") {
            Injuries.getlatestinjuries().query({ ptid: $sessionStorage.patientId, skip: 0 }, function (res) {

                for (var i = 0; i < res[0].injury.length; i++) {
                    if (res[0].injury[i]._id == injuryId) {

                        $scope.data = res[0].injury[i].injurydata[text];
                        break;
                    }
                } debugger;
                $scope.isLoad = true;
                $scope.isLoader = true;
            });
            $scope.ok = function () {
                debugger;
                if ($scope.changeSectionData) {
                    $modalInstance.close($scope.changeSectionData);
                } else {
                    $modalInstance.dismiss('cancel');
                }
            };
            $scope.leave = function () {
                //debugger
                //Injuries.deleteInjury().save({ injid: injuryId }, function () {

                //});
                debugger;
                $modalInstance.dismiss('cancel');
            };
            $scope.changeStatus = function (id) {
                $scope.isLoader = false;
                $scope.currentId = id;
                debugger;
                for (var i = 0; i < $scope.data.length; i++) {

                    if ($scope.data[i]._id == id) {
                        $scope.data[i].status = "current";
                        $scope.changeSectionData = $scope.data[i];
                        $scope.changeSectionData.updateddate = new Date();
                        Injuries.updatearchiveStatus().save({ injid: injuryId, currentId: $scope.currentId, sectionname: text, injurydata: $scope.changeSectionData }, function (res) {
                            debugger;
                        }).$promise.then(function (response) {
                            Injuries.getlatestinjuries().query({ ptid: $sessionStorage.patientId, skip: 0 }, function (res) {
                                debugger;
                                for (var i = 0; i < res[0].injury.length; i++) {
                                    if (res[0].injury[i]._id == injuryId) {

                                        $scope.data = res[0].injury[i].injurydata[text];
                                        break;
                                    }
                                }
                                $scope.isLoader = true;
                                // alert message
                                if (isReload) {
                                    $rootScope.modalInstance = $modal.open({
                                        template: '<div class="modal-header"><button type="button" class="close" aria-hidden="true" ng-click="close()">&times;</button><h3>RateFast</h3></div><div class="modal-body"><div class="login-sign"><h3>Data restored successfully!</h3></div></div><div class="modal-footer"><button class="btn btn-primary" ng-click="close()">Ok</button></div>',
                                        controller: 'popupbuttonClosefunctionCtrl',
                                        resolve: {
                                            step: function () {
                                                return 1;
                                            }
                                        }
                                    });
                                } else {
                                    alert("Data restored successfully!");
                                }
                                // complete mesage                              
                            });
                        });
                    } else {
                        $scope.data[i].status = "archive";
                    }
                }
            }
        } else if (text == "cancel") {
            $scope.patientId = $routeParams.patientid;
            $scope.save = function () {
                debugger;
                $modalInstance.close();
                //$modalInstance.close(injuryId);
            }
            $scope.leave = function () {
                debugger;
                $route.reload();
                //window.location = 'patientdemographics/' + $routeParams.patientid;

            }
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            }
        } else {

            $scope.patientId = $routeParams.patientid;
            $scope.createinjury = function () {
                $modalInstance.close(injuryId);
            }
            $scope.leave = function () {
                debugger;
                $modalInstance.dismiss('cancel');
                Injuries.deleteInjury().save({ injid: injuryId }, function () {
                });
                if (page == "gotoinjurypage") {
                    $route.reload();
                    //location.reload();
                } else {
                    window.location = 'patientdemographics/' + $scope.patientId;
                }
            }
            $scope.save = function () {
                debugger;
                //$modalInstance.close();
                $modalInstance.close(injuryId);
            }

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            }
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
    });