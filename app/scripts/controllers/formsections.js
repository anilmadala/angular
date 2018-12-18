angular.module('ratefastApp')
    .controller('SectionsCtrl', function ($scope, $modalInstance, $builder, sectionlist, currentsection, formtype, getFormdata) {
        $scope.items = ["One", "Two", "Three"];
        debugger;
        if ($scope.section) {
            $scope.$watch('section.sectionid', function () {
                if ($scope.section.sectionid) {
                    $scope.section.sectionid = $scope.section.sectionid.toLowerCase().replace(/\s+/g, '');
                }
            });
        }


        getFormdata.query({ id: "all", formtype: 0, version: 0 }, function (formList) {
            debugger;
            $scope.formlist = formList;
        });


        //$scope.formlist = formlist;
        $scope.formtype = formtype;
        $scope.sectionlist = sectionlist;
        $scope.isUpdate = true;
        // edit section

        $scope.section = { type: 'section', visiblity: true, class: '', index: sectionlist.length + 1, sectionid: '' };
        if (currentsection) {
            debugger;
            $scope.section = currentsection;
            $scope.isUpdate = false;
        }
        $scope.error = false;
        $scope.cancel = function () {

            $modalInstance.dismiss('cancel');
        };

        $scope.deletesection = function () {

            $modalInstance.close(currentsection);
        }

        $scope.addSection = function (sectionname) {
            if ($scope.sectionlist) {
                if ($scope.sectionlist.indexOf(sectionname) == -1) {
                    $modalInstance.close(sectionname);
                } else {
                    $scope.error = true;
                }
            }
            else {
                $modalInstance.close(sectionname);
            }
        };

        $scope.editSection = function (section) {
            if ($scope.sectionlist) {
                var count = $scope.sectionlist.length;
                for (var i = 0; i < count; i++) {
                    if ($scope.sectionlist[i].sectiondataid == section.sectiondataid) {
                        $scope.sectionlist[i].sectionname = section.sectionname;
                        $scope.sectionlist[i].visiblity = section.visiblity;
                        $scope.sectionlist[i].class = section.class;
                        $scope.sectionlist[i].template = section.template;
                        break;
                    }
                }
                $modalInstance.close($scope.sectionlist);
            }

        };
        $scope.checkname = function (sectionid) {
            if ($scope.sectionlist) {
                var count = $scope.sectionlist.length;
                for (var i = 0; i < count; i++) {
                    if ($scope.sectionlist[i].sectiondataid.toLowerCase() == sectionid.toLowerCase() && !currentsection) {
                        $scope.error = true;
                        break;
                    }
                    $scope.error = false;
                }
            }
        };



    });