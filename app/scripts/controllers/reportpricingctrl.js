angular.module('ratefastApp')
.controller('ReportPricingCtrl', function ($scope, $rootScope, $location, $parse, $filter, $modal, ReportPricing, getReportPricingList, updateGlobalPricing) {

    $scope.pricing = new Object();
    $scope.practice = new Object();
    $scope.practice.reportpricing = new Object();
	
	debugger;
	

    $scope.reportPricing = function (formData) {
        var query = {
            formtype: $scope.pricing.formtype,
            pricing: $scope.pricing.pricing
        };
        debugger;
        ReportPricing.save(query).$promise.then(function (response) {
            debugger;
        });
    }

    $scope.getReportPricingList = function () {
		
		if($rootScope.currentUser.rolename!="siteadmin"){
			$location.path('/admin/dashboard');
		}
		
		$scope.rolename= $rootScope.currentUser.rolename;
        debugger;
        getReportPricingList.query().$promise.then(function (result) {
            debugger;
            $scope.reportpricinglist = result;

            var dfrCharge = $filter("filter")($scope.reportpricinglist, { formtype: "dfr" });
            var pr2Charge = $filter("filter")($scope.reportpricinglist, { formtype: "pr2" });
            var pr4Charge = $filter("filter")($scope.reportpricinglist, { formtype: "pr4" });

            $scope.pricing.dfr = dfrCharge[0].pricing;
            $scope.pricing.pr2 = pr2Charge[0].pricing;
            $scope.pricing.pr4 = pr4Charge[0].pricing;

        });
    };


    $scope.updateGlobalPricing = function () {
        debugger;
        //Change Global Pricing
        //1.Change the global pricing of all the reports in the reportpricing collection
        
        //Confirm before changing the Global Pricing of all the Reports
        var modalInstance = $modal.open({
            templateUrl: 'partials/confirmglobalpricing.html',
            controller: 'confirmglobalpricingctrl'
        });
        modalInstance.result.then(function () {
            debugger;
            $scope.isLoad = true;
            updateGlobalPricing.save({ 'pricing': $scope.pricing }).$promise.then(function (result) {
                $scope.isLoad = false;
                var messageinfo = 'Default price updated successfully.';
                var modalInstance = $modal.open({
                    templateUrl: 'partials/popupmessage.html',
                    controller: 'popupMessagectrl',
                    resolve: {
                        message: function () {
                            return messageinfo;
                        }
                    }

                });
            });
           
        });

    };
})
.controller('confirmglobalpricingctrl', function ($scope, $modalInstance) {

    $scope.cancel = function () {
        $modalInstance.dismiss(false);
    }

    $scope.no = function () {
        $modalInstance.dismiss(false);
    }

    $scope.yes = function () {
        $modalInstance.close('yes');
    }

});