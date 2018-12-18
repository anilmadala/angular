/**
 * New node file
 */
'use strict';

angular.module('ratefastApp')
  .controller('websitePageCtrl', function ($scope, $location,$anchorScroll) {
      debugger;
      $scope.gotoDFR = function() {
          // set the location.hash to the id of
          // the element you wish to scroll to.
          $location.hash('dfr');

          // call $anchorScroll()
          $anchorScroll();
        };
        
        $scope.gotoPR2 = function() {
            // set the location.hash to the id of
            // the element you wish to scroll to.
            $location.hash('pr2');

            // call $anchorScroll()
            $anchorScroll();
          };
          
         $scope.gotoPR4 = function() {
              // set the location.hash to the id of
              // the element you wish to scroll to.
              $location.hash('pr4');

              // call $anchorScroll()
              $anchorScroll();
            };      
                   
});