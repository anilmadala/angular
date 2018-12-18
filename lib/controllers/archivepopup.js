'use strict';

angular.module('ratefastApp')
    .controller('archivectrl', function ($scope, $http, $routeParams, $modalInstance, text, injuryId, Injuries, page) {

        if (text != "simplepopUp" && text != "cancel") {
            Injuries.getlatestinjuries().query({ ptid: $routeParams.patientid, skip: 0 }, function (res) {              
                for (var i = 0; i < res[0].injury.length; i++) {
                    if (res[0].injury[i]._id == injuryId) {                      
                        $scope.data = res[0].injury[i].injurydata[text];
                        break;
                    }
                }
            });
            $scope.ok = function () {                
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
                $modalInstance.dismiss('cancel');
            };
            $scope.changeStatus = function (id) {                
                $scope.currentId = id;
                for (var i = 0; i < $scope.data.length; i++) {                   
                    if ($scope.data[i]._id == id) {
                        $scope.data[i].status = "current";
                        $scope.changeSectionData = $scope.data[i];
                        $scope.changeSectionData.updateddate = new Date();
                        Injuries.updatearchiveStatus().save({ injid: injuryId, currentId: $scope.currentId, sectionname: text, injurydata: $scope.changeSectionData }, function (res) {
                            
                        }).$promise.then(function (response) {
                            Injuries.getlatestinjuries().query({ ptid: $routeParams.patientid, skip: 0 }, function (res) {                               
                                for (var i = 0; i < res[0].injury.length; i++) {
                                    if (res[0].injury[i]._id == injuryId) {                                        
                                        $scope.data = res[0].injury[i].injurydata[text];
                                        break;
                                    }
                                }
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
                $modalInstance.close();
                //$modalInstance.close(injuryId);
            }
            $scope.leave = function () {
                location.reload();
                //$modalInstance.dismiss('cancel');
                //Injuries.deleteInjury().save({ injid: injuryId }, function () {
                //});
                //if (page == "gotoinjurypage") {
                //    location.reload();
                //} else {
                //    window.location = 'patientdemographics/' + $scope.patientId;
                //}
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
                $modalInstance.dismiss('cancel');
                Injuries.deleteInjury().save({ injid: injuryId }, function () {
                });
                if (page == "gotoinjurypage") {
                    location.reload();
                } else {
                    window.location = 'patientdemographics/' + $scope.patientId;
                }
            }
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            }
        }
    });