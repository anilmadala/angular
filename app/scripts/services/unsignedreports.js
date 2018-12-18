'use strict';

angular.module('ratefastApp')
  .factory('unsignedReports', ['$resource', function ($resource) {
      
    return {
          getUnsignedReports: function () {
              return $resource('/api/unsignedReports/:practicename/:selectedstatecode', {});
          }
      }

  }]);

