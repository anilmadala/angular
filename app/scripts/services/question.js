'use strict';

angular.module('ratefastApp').factory('QuestionsList', ['$resource', function($resource) {
    return $resource('/api/questions');
}]);