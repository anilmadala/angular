angular.module('ratefastApp').controller('StatesCtrl', function ($scope, $routeParams, $location, StatesList) {

	//For getting list of salespersons
    $scope.statesList = function() {
        StatesList.query(function(states) {
            $scope.states = states;
        });
    }
		
});