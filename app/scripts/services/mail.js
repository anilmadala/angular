angular.module('ratefastApp')
.factory('Mail', ['$resource', function ($resource) {
	return {
	    sendfeedbackmail: function () {
	        return $resource('/api/sendfeedbackmail/:feedback', {}, { 'query': { method: 'GET', isArray: false } });
	    }
	}
}]);