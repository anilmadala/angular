'use strict';

angular.module('ratefastApp').factory('SalespersonList', ['$resource', function ($resource) {
    return $resource('/api/salespersons/:statusController/:statusId/:searchController/:searchId/:salespersonId/:pageController/:pagenum', {
        salespersonId: '@salespersonId',
        statusId: '@statusId',
        statusController: '@statusController',
        searchId: '@searchId',
        searchController: '@searchController',
        pagenum: '@pagenum',
        pageController: '@pageController'
    });
}]);

angular.module('ratefastApp').factory('SalespersonAllList', ['$resource', function ($resource) {
    return $resource('/api/salespersons/list');
}]);

angular.module('ratefastApp').factory('CreateSalesperson', ['$resource', function ($resource) {
    return $resource('/api/salespersons/:id', {
      id: '@id'
    }, { //parameters default
      update: {
        method: 'PUT',
        params: {}
      }
    });
}]);
