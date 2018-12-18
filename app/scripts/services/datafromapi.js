angular.module('ratefastApp').factory('getdatafromAPI', ['$resource', function ($resource) {
    return $resource('/api/getdataapi/:currentuserid/:currentuserlevel', {
        currentuserid: '@currentuserid',
        currentuserlevel: '@currentuserlevel'
    });
}]);

angular.module('ratefastApp').factory('getdataClinic', ['$resource', function ($resource) {
    return $resource('/api/getdataclinic/:currentusername', {
        currentusername: '@currentusername'
    });
}]);
