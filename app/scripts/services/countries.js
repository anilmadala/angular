'use strict';

angular.module('ratefastApp').factory('CountriesList', ['$resource', function($resource) {
    return $resource('/api/countries');
}]);