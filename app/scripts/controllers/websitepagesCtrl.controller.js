/**
 * New node file
 */
'use strict';

angular.module('ratefastApp')
  .controller('websitePageCtrl', function ($scope, $location,$anchorScroll, $http) {
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
                   
            $scope.downloadDFR = function() {
            		//set response type as arraybuffer
                    $http.post("/api/download/DFR",{}, {responseType:'arraybuffer'}).then(function(response) {
                        var file = new Blob([ response.data ], {
                            type : 'application/pdf'
                        });
						
						//var file = new Blob([response.data.buffer], {type: "application/pdf"});
                        //trick to download store a file having its URL
                        var fileURL = URL.createObjectURL(file);
                        var a         = document.createElement('a');
                        a.href        = fileURL; 
                        a.target      = '_blank';
                        a.download    = 'DFR_Report_John_Doe.pdf';
                        document.body.appendChild(a);
                        //a.click();
						fireClick(a);
                    });
              
             };
             $scope.downloadPR2 = function() {
                  //set response type as arraybuffer
                  $http.post("/api/download/PR2",{}, {responseType:'arraybuffer'}).then(function(response) {
                       var file = new Blob([ response.data ], {
                          type : 'application/pdf'
                      });
                      //trick to download store a file having its URL
                      var fileURL = URL.createObjectURL(file);
                      var a         = document.createElement('a');
                      a.href        = fileURL; 
                      a.target      = '_blank';
                      a.download    = 'PR2_Report_John_Doe.pdf';
                      document.body.appendChild(a);
                      //a.click();
					  fireClick(a);
                  });
            
           };
           $scope.downloadPR4 = function() {
        	   //set response type as arraybuffer
                $http.post("/api/download/PR4",{}, {responseType:'arraybuffer'}).then(function(response) {
                 var file = new Blob([ response.data ], {
                        type : 'application/pdf'
                    });
                    //trick to download store a file having its URL
                    var fileURL = URL.createObjectURL(file);
                    var a         = document.createElement('a');
                    a.href        = fileURL; 
                    a.target      = '_blank';
                    a.download    = 'PR4_Report_John_Doe.pdf';
                    document.body.appendChild(a);
                    //a.click();
					fireClick(a);
					
                });
          
         };
		 
		function fireClick(elem) {
			if(typeof elem == "string") elem = document.getElementById(objID);
			if(!elem) return;

			if(document.dispatchEvent) {   // W3C
				var oEvent = document.createEvent( "MouseEvents" );
				oEvent.initMouseEvent("click", true, true, window, 1, 1, 1, 1, 1, false, false, false, false, 0, elem);
				elem.dispatchEvent(oEvent);
			}
			else if(document.fireEvent) {   // IE
				elem.click();
			}    
		}
});