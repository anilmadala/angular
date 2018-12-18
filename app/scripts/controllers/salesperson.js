angular.module('ratefastApp').controller('SalespersonCtrl', function ($scope, $routeParams, $location, SalespersonList, CreateSalesperson) {

	$scope.ViewEnum = {
        Card: 0,
        List: 1,
        Detail: 2
    };
    $scope.currentPage = 1;
    $scope.maxsize = 5;
    $scope.itemsperpage = 9;
    $scope.search = "";
    $scope.statusId = "";
    $scope.salesperson = new Object();

	$scope.ViewEnum = {
        Card: 0,
        List: 1
    };
    $scope.currentPage = 1;
    $scope.maxsize = 5;
    $scope.itemsperpage = 9;
    $scope.search = "";
    $scope.statusId = "";

	//For getting list of salespersons
    $scope.salespersonList = function(pagenumber) {

        var query = {
            pagenum: pagenumber,
            pageController: 'page'
        };

        $scope.currentPage = pagenumber;

        if ($scope.statusId != "") {
            query.statusId = $scope.statusId;
            query.statusController = 'status';
        }

        if ($scope.search != "") {
            query.searchId = $scope.search;
            query.searchController = 'search';
        }

        SalespersonList.query(query, function(salespersons) {
            $scope.salespersons = salespersons[0].salespersons;
           
            $scope.totalItems = salespersons[0].totalitem;
            $scope.noOfPages = salespersons[0].pages;
        });
    };

    $scope.filterSalesPersons = function () {
        $scope.currentPage = "1";
        $scope.salespersonList($scope.currentPage);
    };

    $scope.searchSalespersons = function () {
        $scope.currentPage = '1';
        $scope.salespersonList($scope.currentPage);
    }

$scope.register = function()
    {
        if($scope.salesperson._id)     
        {
            return CreateSalesperson.update({id : $scope.salesperson._id, data : $scope.salesperson});
        }
        CreateSalesperson.save($scope.salesperson).$promise.then(function(response) {
                $scope.salespersonList($scope.currentPage);
                $scope.alerts.push({ type: 'success', msg: 'You have added new salesperson successfully' });
                
            })
            .catch(function(err){
                    //console.log(err);
                    $scope.alerts.push({ type: 'danger', msg: err.data });
            });
    };

    $scope.newSalesPerson = function()
    {
       $scope.section = 3;
       $scope.salesperson = {'name':'','email':'','status':'active','commissionpercentage':''};
    };

    $scope.editSalesPerson = function(salesperson)
    {
        $scope.section = 3;
        $scope.salesperson = salesperson;

    };
});