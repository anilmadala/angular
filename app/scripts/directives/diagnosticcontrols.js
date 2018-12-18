angular.module('ratefastApp')
.directive('addanotherXraycervical', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/xraycervicaladdanother.html",
        controller: 'XrayCervicalAddAnotherCtrl'
    };
}).directive('addanotherXraythoracic', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/xraythoracicaddanother.html",
        controller: 'XrayThoracicAddAnotherCtrl'
    };
}).directive('addanotherXraylumbar', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/xraylumbaraddanother.html",
        controller: 'XrayLumbarAddAnotherCtrl'
    };
}).directive('addanotherXrayshoulderleftright', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/xrayshoulderleftrightaddanother.html",
        controller: 'XrayShoulderLeftRightAddAnotherCtrl'
    };
}).directive('addanotherXrayelbowleftright', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/xrayelbowleftrightaddanother.html",
        controller: 'XrayElbowLeftRightAddAnotherCtrl'
    };
}).directive('addanotherXraywristleftright', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/xraywristleftrightaddanother.html",
        controller: 'XrayWristLeftRightAddAnotherCtrl'
    };
}).directive('addanotherXraythumbleftright', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/xraythumbleftrightaddanother.html",
        controller: 'XrayThumbLeftRightAddAnotherCtrl'
    };
}).directive('addanotherXrayfinger', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/xrayfingeraddanother.html",
        controller: 'XrayFingerAddAnotherCtrl'
    };
}).directive('addanotherXraypelvishipleftright', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/xraypelvishipleftrightaddanother.html",
        controller: 'XrayPelvisHipLeftRightAddAnotherCtrl'
    };
}).directive('addanotherXraykneeleftright', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/xraykneeleftrightaddanother.html",
        controller: 'XrayKneeLeftRightAddAnotherCtrl'
    };
}).directive('addanotherXrayanklefootleftright', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/xrayanklefootleftrightaddanother.html",
        controller: 'XrayAnkleFootLeftRightAddAnotherCtrl'
    };
}).directive('addanotherXraytoeleftright', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/xraytoeleftrightaddanother.html",
        controller: 'XrayToeLeftRightAddAnotherCtrl'
    };
}).directive('addanotherMricervical', function () {
    debugger;
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/mricervicaladdanother.html",
        controller: 'MriCervicalAddAnotherCtrl'
    };
}).directive('addanotherMrithoracic', function () {
    debugger;
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/mrithoracicaddanother.html",
        controller: 'MriThoracicAddAnotherCtrl'
    };
}).directive('addanotherMrilumbar', function () {
    debugger;
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/mrilumbaraddanother.html",
        controller: 'MriLumbarAddAnotherCtrl'
    };
}).directive('addanotherMrishoulder', function () {
    debugger;
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/mrishoulderaddanother.html",
        controller: 'MriShoulderAddAnotherCtrl'
    };
}).directive('addanotherMrielbowleftright', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/mrielbowleftrightaddanother.html",
        controller: 'MriElbowLeftRightAddAnotherCtrl'
    };
}).directive('addanotherMriwristleftright', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/mriwristleftrightaddanother.html",
        controller: 'MriWristLeftRightAddAnotherCtrl'
    };
}).directive('addanotherMrifingerall', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/mrifingeralladdanother.html",
        controller: 'MriFingerAllAddAnotherCtrl'
    };
}).directive('addanotherMripelvishipleftright', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/mripelvishipleftrightaddanother.html",
        controller: 'MriPelvisHipLeftRightAddAnotherCtrl'
    };
}).directive('addanotherMrikneeleftright', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/mrikneeleftrightaddanother.html",
        controller: 'MriKneeLeftRightAddAnotherCtrl'
    };
}).directive('addanotherMrianklefootleftright', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/mrianklefootleftrightaddanother.html",
        controller: 'MriAnkleFootLeftRightAddAnotherCtrl'
    };
}).directive('addanotherMritoeleftright', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/mritoeleftrightaddanother.html",
        controller: 'MriToeLeftRightAddAnotherCtrl'
    };
}).directive('addanotherCtscancervical', function () {
    debugger;
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/ctscancervicaladdanother.html",
        controller: 'CtscanCervicalAddAnotherCtrl'
    };
}).directive('addanotherCtscanthoracic', function () {
    debugger;
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/ctscanthoracicaddanother.html",
        controller: 'CtscanThoracicAddAnotherCtrl'
    };
}).directive('addanotherCtscanlumbar', function () {
    debugger;
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/ctscanlumbaraddanother.html",
        controller: 'CtscanLumbarAddAnotherCtrl'
    };
}).directive('addanotherCtscanshoulder', function () {
    debugger;
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/ctscanshoulderaddanother.html",
        controller: 'CtscanShoulderAddAnotherCtrl'
    };
}).directive('addanotherSkinpathology', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/skinpathologyaddanother.html",
        controller: 'SkinPathologyAddAnotherCtrl'
    };
}).directive('addanotherOfficebased', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/skinofficebasedaddanother.html",
        controller: 'SkinOfficeBasedAddAnotherCtrl'
    };
}).directive('selectbodypartforrating', function () { //Added by Shridhar for select body part control
    return {
        require: 'ngModel',
        restrict: 'A',
        templateUrl: "/partials/selectbodypartforrating.html",
        controller: 'SelectBodyPartForRatingCtrl'
    };
});