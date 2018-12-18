'use strict';

angular.module('ratefastApp')
    .controller('TemplatebuilderCtrl', function ($scope, $http, $builder, $validator) {
        $scope.template = new Object();
        $scope.template.forms = new Object();
        $scope.template.data = new Object();
        $scope.templateData = new Object();
        $scope.defaultValue = {};
        $scope.template.sections = [{type:"label",visiblity:true,class:"h4",sectiondataid:"dashboard",sectionname:"Dashboard"},{type:"section",visiblity:true,class:"btn btn-warning",sectionid:"report.backgroundinfo",sectionname:"Background Information",sectiondataid:"backgroundinfo"}];
        // $scope.getData = function () {

        //     var formID = (location.pathname.split('/')[2]);
        //     getTemplatedata.query({ id: formID }, function (responce) {
        //         if (responce[0].datatemplate) {
        //             $scope.template = angular.fromJson(responce[0].dataform);
        //             for (var i = 0; i < $scope.template.length; i++) {
        //                 $builder.forms[$scope.template] = $scope.template.forms[$scope.template];
        //             }
        //         }
        //         $scope.formname = responce[0].title;
        //         $scope.formversion = responce[0].version;
        //     }), function (err) {

        //     }.$promise;
        // };
    });

