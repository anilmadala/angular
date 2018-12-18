/**
 * Created by Mayur.Mathurkar on 2/21/14.
 */
'use strict';

angular.module('ratefastApp').factory('SpecialitiesList', ['$resource', function ($resource) {
    return $resource('/api/specialities');
}]);

