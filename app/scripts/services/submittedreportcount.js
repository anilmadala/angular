'use strict';

angular.module('ratefastApp').factory('submittedReportcount', ['$resource', function ($resource) {
    return $resource('/api/submittedReportcount/:practicename/:formtype', {
        practicename: '@practicename'
    });
}]);