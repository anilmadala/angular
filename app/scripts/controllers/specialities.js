/**
 * Created by Mayur.Mathurkar on 2/21/14.
 */
angular.module('ratefastApp').controller('specialityCtrl', function ($scope, SpecialitiesList) {

    //For getting list of questions
    $scope.allspecialities = function() {
        SpecialitiesList.query(function(speciality) {
            $scope.speciality = speciality;
        });
    }
});
