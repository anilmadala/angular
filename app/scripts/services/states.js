'use strict';

angular.module('ratefastApp').factory('StatesList', ['$resource', function($resource) {
     return $resource('/api/states/:status', {
            status: '@status'
        });
}]);