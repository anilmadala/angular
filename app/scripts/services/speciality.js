'use strict';

angular.module('ratefastApp').factory('Specialities', ['$resource', function($resource) {
    return $resource('/api/speciality');
}]);