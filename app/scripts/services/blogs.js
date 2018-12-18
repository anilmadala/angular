//For Blogs Service

'use strict';

angular.module('ratefastApp').factory('Blogs', ['$resource', function($resource) {
    return $resource('/api/blog/:blogId/:catController/:catId/:searchController/:searchId/:pageController/:pagenum' , {
                  blogId: '@_id',
                  catId: '@catId',
                  catController: '@catController',
                  searchId: '@searchId',
                  searchController: '@searchController',
                  pagenum: '@pagenum',
                  pageController: '@pageController'

      });
}]);