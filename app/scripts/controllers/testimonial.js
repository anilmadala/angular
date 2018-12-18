'use strict';

angular.module('ratefastApp').controller('TestimonialController', function ($scope, $routeParams, $location, Testimonials) {

     $scope.currentPage = 1;
     $scope.maxsize = 5;
     $scope.itemsperpage = 4;

   
    $scope.findRandom = function() {
        var query =  {
                        randomController:'random'
                     };
        Testimonials.query(query).$promise.then(function(data) {
            $scope.random = data[0];            
          });     
    };

     $scope.findPaged = function(pagenumber) { 

        var query =  {pagenum: pagenumber,
                      pageController:'page'
                     };
        $scope.currentPage = pagenumber;   
        Testimonials.query(query).$promise.then(function(data) {
            $scope.testimonials = data[0].testimonials;
            $scope.totalItems = data[0].totalitem;
            $scope.noOfPages = data[0].pages;

        });     
    };
});
