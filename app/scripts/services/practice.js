angular.module('ratefastApp')
    .factory('PracticesUnique', ['$resource', function ($resource) {
        return {
            UniqueName: function () {
                return $resource('/api/practice/uniquepractice/:practiceName', { practiceName: '@practicename', });
            },
            UniqueLicense: function () {
                return $resource('/api/practice/uniquelicense/:licenseNumber');
            }
        }
    }]);

'use strict';

angular.module('ratefastApp')
  .factory('Practices', ['$resource', function ($resource) {
      var practices = $resource('/api/practices/:statusController/:statusId/:searchController/:searchId/:practiceId/:pageController/:pagenum', {
          practiceId: '@practiceId',
          statusId: '@statusId',
          statusController: '@statusController',
          searchId: '@searchId',
          searchController: '@searchController',
          pagenum: '@pagenum',
          pageController: '@pageController'
      });
      return {
          updatePractice: function () {
              return $resource('/api/practicesUpdate/:practiceId', {
                  practiceId: '@_id'
              }, { //parameters default
                  update: {
                      method: 'PUT'
                  }
              });
          },
		  searchAllPractice: function () {
              return $resource('/api/practices/search', {
                
              }, { //parameters default
                  save: {
                      method: 'POST',
                      isArray: true 
                  }
              });
          },
          updateCreditCard: function () {
              return $resource('/api/practicesCreditCardUpdate/:practiceId', {
                  practiceId: '@_id'
              }, { //parameters default
                  updateCredit: {
                      method: 'PUT'
                  }
              });
          },
          updateLogo: function () {
              return $resource('/api/practicesUpload',
                  {}, { 'save': { method: 'POST' } });
          },
          getLogo: function () {
              return $resource('/api/practicesGetLogo',
                  {}, { 'query': { method: 'GET', params: {}, isArray: false } });
          },
          updateStampApproval: function () {
              return $resource('/api/practicesStampUpdate/:practiceId', {
                  practiceId: '@_id'
              }, { //parameters default
                  updateStamp: {
                      method: 'PUT'
                  }
              });
          },
          getPracticeByName: function () {
              return $resource('/api/practicesByName/:practiceName',{
                  practiceName: '@_practicename'
                  }, { 'query': { method: 'GET', params: {}, isArray: false } });
          },
          getStampapprovalBypracticeName: function () {
              return $resource('/api/getstampofapproval/:practiceName', {
                  practiceName: '@_practicename'
              }, { 'query': { method: 'GET', params: {}, isArray: false } });
          },
          updateCustomReportPricing: function () {
              return $resource('/api/updateCustomReportPricing/:practiceId', {
                  practiceId: '@_id'
              }, { //parameters default
                  update: {
                      method: 'PUT'
                  }
              });
          },
		  getUserListbyPracticename: function(){
          	return $resource('/api/getUserListByPracticename',{},{'save': {method: 'POST', params: {}, isArray: false}})  
          },		  
          practices: practices
      }
  }]);

angular.module('ratefastApp').factory('PracticeGetDataByName', ['$resource', function ($resource) {
    return $resource('/api/getpracticedata/:practicename', {
        practicename: '@practicename'
    });
}]);
