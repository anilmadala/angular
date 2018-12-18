angular.module('ratefastApp')
.controller('PricingCtrl', function ($scope, $location, $parse, $filter, StatesList, getReportPricingList) {

    $scope.states = '';

    //$scope.step = '1'; //Display State selection screen before displaying the Pricing
    $scope.step = '2'; // Display pricing directly without display the State Selection Screen
    $scope.provider1 = true;
    $scope.provider2 = true;
    $scope.provider3 = true;
    $scope.attorney = true;
    $scope.providertrial = true;
    $scope.attorneytrial = true;

           
    $scope.mapClick = function () {
        if ($scope.selectedState.state) {
            $scope.step = '2';
        }
    };

    $scope.backToMain = function () {
        $scope.selectedState = '';
        $scope.step = '1';
    };

    $scope.populatePricing = function () {
        getReportPricingList.query().$promise.then(function (result) {
            debugger;
            $scope.pricing = {};
            $scope.reportpricinglist = result;
            

            var dfrCharge = $filter("filter")($scope.reportpricinglist, { formtype: "dfr" });
            var pr2Charge = $filter("filter")($scope.reportpricinglist, { formtype: "pr2" });
            var pr4Charge = $filter("filter")($scope.reportpricinglist, { formtype: "pr4" });

            $scope.pricing.dfr = dfrCharge[0].pricing;
            $scope.pricing.pr2 = pr2Charge[0].pricing;
            $scope.pricing.pr4 = pr4Charge[0].pricing;



        });
    };

});