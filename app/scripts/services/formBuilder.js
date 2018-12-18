//For Blogs Service

'use strict';

angular.module('ratefastApp').factory('Blogs', ['$resource', function($resource) {
    return $resource('/api/formbuilder/' , {

    });
}]);


