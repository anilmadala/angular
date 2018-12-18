//For Report Pricing
'use strict';

angular.module('ratefastApp').factory('ReportPricing', ['$resource', function ($resource) {
    return $resource('/api/reportpricing');
}]);

angular.module('ratefastApp').factory('getReportCharge', ['$resource', function ($resource) {
    return $resource('/api/getreportpricing/:formtype', {
        formtype: '@formtype'
    });
}]);

angular.module('ratefastApp').factory('getReportPricingList', ['$resource', function ($resource) {
    return $resource('/api/getreportpricinglist');
}]);

angular.module('ratefastApp').factory('updateGlobalPricing', ['$resource', function ($resource) {
    return $resource('/api/updateglobalpricing');
}]);

