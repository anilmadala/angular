'use strict';

angular.module('ratefastApp').factory('Testimonials', ['$resource', function($resource) {

	return $resource('/api/testimonial/:randomController/:pageController/:pagenum' , {
				  randomController: '@randomController',
		 		  pagenum: '@pagenum',
                  pageController: '@pageController'
	});

}]);
