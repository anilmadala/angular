angular.module('ratefastApp')
  .controller('athenaDynamicPopUpCtrl', function ($scope, $http, $routeParams, athenaPatientID,confirmButtonText,cancelButtonText,dispalyMessage, $modalInstance) {
	  $scope.id = athenaPatientID;
	  
	  $scope.confirmButtonText=confirmButtonText;
	  $scope.cancelButtonText=cancelButtonText;
	  $scope.dispalyMessage=dispalyMessage;
      $scope.proceed = function () {
          $modalInstance.close('yes');
      };

      $scope.cancel = function () {
          $modalInstance.close('no');
      };

})
.controller('athenaDynamicPopUp3ButtonsCtrl', function ($scope, $http, $routeParams, ID,confirmButtonText1,confirmButtonText2,cancelButtonText,dispalyMessage, $modalInstance) {
	  $scope.id = ID;
	  
	  $scope.confirmButtonText1=confirmButtonText1;
	  $scope.confirmButtonText2=confirmButtonText2;
	  
	  $scope.cancelButtonText=cancelButtonText;
	  $scope.dispalyMessage=dispalyMessage;
    
	  $scope.proceed = function (text) {
        $modalInstance.close(text);
	  };

    $scope.cancel = function () {
        $modalInstance.close('cancel');
    };
 })
.controller('athenaInsuranceOptionPopUpCtrl', function ($scope, $http, $routeParams, insuranceOptions,confirmButtonText,cancelButtonText,dispalyMessage, $modalInstance) {
	  $scope.athenaInsurance = insuranceOptions;
	  
	  $scope.confirmButtonText=confirmButtonText;
	  $scope.cancelButtonText=cancelButtonText;
	  $scope.dispalyMessage=dispalyMessage;
      $scope.proceed = function (insuranceid) {
          $modalInstance.close(insuranceid);
      };

      $scope.cancel = function () {
          $modalInstance.close('no');
      };

})
.controller('athenaMedicationCtrl', function ($scope, $http, $routeParams, ID,confirmButtonText2,cancelButtonText,dispalyMessage,medicationMsg, $modalInstance) {
	  $scope.id = ID;
	  	
	  $scope.confirmButtonText2=confirmButtonText2;
	  
	  $scope.cancelButtonText=cancelButtonText;
	  $scope.dispalyMessage=dispalyMessage;
    
	  $scope.msgClipboard = medicationMsg;
	  
	  $scope.proceed = function (text) {
        $modalInstance.close(text);
	  };

    $scope.cancel = function () {
        $modalInstance.close('cancel');
    };
 })
 .controller('athenaDynamicPopUpSingleButtonCtrl', function ($scope, $http, $routeParams,ID,cancelButtonText,dispalyMessage, $modalInstance) {
	  $scope.id = ID;
	  
	  $scope.cancelButtonText=cancelButtonText;
	  $scope.dispalyMessage=dispalyMessage;

      $scope.cancel = function () {
          $modalInstance.close();
      };
})
 .controller('athenaDynamicPopUpWithoutButtonCtrl', function ($scope, $http, $routeParams,dispalyMessage, $modalInstance) {
	   
	  $scope.dispalyMessage=dispalyMessage;
})
 .controller('athenaDynamicPopUpWithoutButtonLoginCtrl', function ($scope, $http, $location, $routeParams,$modalInstance) {
	   
	  $scope.cancel=function()
	  {
		  $modalInstance.close();
		  $location.path('/login');
	  }
})
 .controller('athenaPhoneNumberCtrl', function ($scope, $http, $routeParams,phoneExtension,confirmButtonText,dispalyMessage, $modalInstance) {
	  $scope.phoneExtensionNumber = phoneExtension;
	  
	  $scope.adjusterNumber = {};
	  $scope.adjusterNumber.phone = '';
	  $scope.adjusterNumber.extension = '';
	  
	  try{
	  if(typeof $scope.phoneExtensionNumber != 'undefined'){
		  if($scope.phoneExtensionNumber != null && $scope.phoneExtensionNumber != ''){		
			  var str = $scope.phoneExtensionNumber;
			  var num  = str.replace( /\D+/g, '');
			
			  if(num != null && num !=''){
				  if(num.length >= 10){	
					  if(num.substring(0,1) == 1){
						  $scope.adjusterNumber.phone = num.substring(1,11);
						  $scope.adjusterNumber.extension = num.substring($scope.adjusterNumber.phone.length+1,num.length);				  
					  }else{
						  $scope.adjusterNumber.phone = num.substring(0,10);
						  $scope.adjusterNumber.extension = num.substring($scope.adjusterNumber.phone.length,num.length);				  
					  }
				  }
			  }
		  }
	  }  
	  }catch(err){
		  console.log("adjuster phone error : "+err);
	  }
	  
	  
	  $scope.confirmButtonText = confirmButtonText;

	  $scope.dispalyMessage = "<h3><p>The number for \'adjusterphone'\ contains some strange formatting.<br/> Here is the number entered into Athena: <strong>"+$scope.phoneExtensionNumber+"</strong><br/>Here is the number that will be entered into RateFast: <br/> </p</h3>";

	  function checkValues(val){
          var returnVal = '';
          
          if(typeof val != 'undefined'){
           if(val != null){                     
                 var num  = val.toString().replace( /\D+/g, '');                
               if(num.length==10){
                   return num;
               }else{
                   return returnVal;
               }                          
           }else{
                 return returnVal;
               }                
           }else{
                return returnVal;
           }
     }
	  
	  $scope.proceed = function (text) {		

		  $scope.adjusterNumber.phone = checkValues($scope.adjusterNumber.phone);
          if($scope.adjusterNumber.phone == ''){
              $scope.adjusterNumber.extension = '';
          }
          $modalInstance.close($scope.adjusterNumber);
      };
	  
      $scope.cancel = function () {
          $modalInstance.close();
      };
})
.controller('athenaPatientPhonePopupCtrl', function ($scope, $http, $routeParams,phoneExtension,confirmButtonText,cancelButtonText,dispalyMessage, $modalInstance) {
       
      var homephone = phoneExtension.homephone;
      var mobilephone = phoneExtension.mobilephone;
      var workphone = phoneExtension.workphone;
	  
	  console.log(phoneExtension.homephone);
	  
	  
	  $scope.CurrentphoneValues = {};
      $scope.CurrentphoneValues.homephone = phoneExtension.homephone; 
      $scope.CurrentphoneValues.mobilephone = phoneExtension.mobilephone;
      $scope.CurrentphoneValues.workphone = phoneExtension.workphone;
	  
	  console.log(phoneExtension.homephone);
      
      $scope.phoneValues = {};
      $scope.phoneValues.homephone = ''; 
      $scope.phoneValues.mobilephone = '';
      $scope.phoneValues.workphone = '';
      $scope.phoneValues.workphoneExtension = '';
      
        
      try{
      if(typeof homephone != 'undefined'){
          if( homephone != null && homephone != ''){        
              var str =  homephone;
              var num  = str.replace( /\D+/g, '');
            
              if(num != null && num !=''){
                  if(num.length >= 10){    
                      if(num.substring(0,1) == 1){
                          $scope.phoneValues.homephone = num.substring(1,11);                                      
                      }else{
                          $scope.phoneValues.homephone = num.substring(0,10);              
                      }
                  }
              }
          }
      }	  
      }catch(err){
          console.log("phone error : "+err);
      }
      
      try{
          if(typeof  mobilephone != 'undefined'){
              if(mobilephone != null && mobilephone != ''){        
                  var str = mobilephone;
                  var num  = str.replace( /\D+/g, '');
                
                  if(num != null && num !=''){
                      if(num.length >= 10){    
                          if(num.substring(0,1) == 1){
                              $scope.phoneValues.mobilephone = num.substring(1,11);                                      
                          }else{
                              $scope.phoneValues.mobilephone = num.substring(0,10);              
                          }
                      }
                  }
              }
          }  
          }catch(err){
              console.log("phone error : "+err);
          }
      
      try{
          if(typeof workphone != 'undefined'){
              if(workphone != null && workphone != ''){        
                  var str = workphone;
                  var num  = str.replace( /\D+/g, '');
                
                  if(num != null && num !=''){
                      if(num.length >= 10){    
                          if(num.substring(0,1) == 1){
                              $scope.phoneValues.workphone = num.substring(1,11);                
                              $scope.phoneValues.workphoneExtension = num.substring($scope.phoneValues.workphone.length+1,num.length);    
                          }else{
                              $scope.phoneValues.workphone = num.substring(0,10);        
                              $scope.phoneValues.workphoneExtension = num.substring($scope.phoneValues.workphone.length,num.length);    
                          }
                      }
                  }
              }
          }  
          }catch(err){
              console.log("phone error : "+err);
          }
      
        
      
      $scope.confirmButtonText = confirmButtonText;
      $scope.cancelButtonText = cancelButtonText;
      
      $scope.dispalyMessage = "<h3>Before importing phone numbers from Athena, please verify that the formatting is correct.</h3>";
	  
	  function checkValues(val){
          var returnVal = '';
          
          if(typeof val != 'undefined'){
           if(val != null){                     
                 var num  = val.toString().replace( /\D+/g, '');                
               if(num.length==10){
                   return num;
               }else{
                   return returnVal;
               }                          
           }else{
                 return returnVal;
               }                
           }else{
                return returnVal;
           }
     }

      $scope.proceed = function (text) {   
		
		  $scope.phoneValues.homephone = checkValues($scope.phoneValues.homephone); 
		  $scope.phoneValues.mobilephone = checkValues($scope.phoneValues.mobilephone);
		  $scope.phoneValues.workphone = checkValues($scope.phoneValues.workphone);
		  if($scope.phoneValues.workphone == ''){
			  $scope.phoneValues.workphoneExtension = '';
		  }
			  
         $modalInstance.close($scope.phoneValues);
      };
      
     $scope.cancel = function () {
         $modalInstance.close();
     };
})
.controller('athenaInjuryPhonePopupCtrl', function ($scope, $http, $routeParams,phoneData,confirmButtonText,cancelButtonText,dispalyMessage, $modalInstance) {
       
      var employerContact = phoneData.employerContact;
      var adjusterPhone = phoneData.adjusterPhone;
      var adjusterFax = phoneData.adjusterFax;
	  
	  $scope.CurrentphoneValues = {};
      $scope.CurrentphoneValues.employerContact = phoneData.employerContact; 
      $scope.CurrentphoneValues.adjusterPhone = phoneData.adjusterPhone;
      $scope.CurrentphoneValues.adjusterFax = phoneData.adjusterFax;
      
      $scope.phoneValues = {};
      $scope.phoneValues.employerContact = ''; 
      $scope.phoneValues.adjusterPhone = '';
      $scope.phoneValues.adjusterPhoneExtension = '';
      $scope.phoneValues.adjusterFax = '';
      
        
      try{
      if(typeof employerContact != 'undefined'){
          if( employerContact != null && employerContact != ''){        
              var str =  employerContact;
              var num  = str.replace( /\D+/g, '');
            
              if(num != null && num !=''){
                  if(num.length >= 10){    
                      if(num.substring(0,1) == 1){
                          $scope.phoneValues.employerContact = num.substring(1,11);                                      
                      }else{
                          $scope.phoneValues.employerContact = num.substring(0,10);              
                      }
                  }
              }
          }
      }  
      }catch(err){
          console.log("Employer Contact Error : "+err);
      }            
      
      try{
          if(typeof adjusterPhone != 'undefined'){
              if(adjusterPhone != null && adjusterPhone != ''){        
                  var str = adjusterPhone;
                  var num  = str.replace( /\D+/g, '');
                
                  if(num != null && num !=''){
                      if(num.length >= 10){    
                          if(num.substring(0,1) == 1){
                              $scope.phoneValues.adjusterPhone = num.substring(1,11);                
                              $scope.phoneValues.adjusterPhoneExtension = num.substring($scope.phoneValues.adjusterPhone.length+1,num.length);    
                          }else{
                              $scope.phoneValues.adjusterPhone = num.substring(0,10);        
                              $scope.phoneValues.adjusterPhoneExtension = num.substring($scope.phoneValues.adjusterPhone.length,num.length);    
                          }
                      }
                  }
              }
          }  
          }catch(err){
              console.log("Adjuster Phone Error : "+err);
          }
		  
		  try{
      if(typeof adjusterFax != 'undefined'){
          if( adjusterFax != null && adjusterFax != ''){        
              var str =  adjusterFax;
              var num  = str.replace( /\D+/g, '');
            
              if(num != null && num !=''){
                  if(num.length >= 10){    
                      if(num.substring(0,1) == 1){
                          $scope.phoneValues.adjusterFax = num.substring(1,11);                                      
                      }else{
                          $scope.phoneValues.adjusterFax = num.substring(0,10);              
                      }
                  }
              }
          }
      }  
      }catch(err){
          console.log("Adjuster Fax Error : "+err);
      }
      
        
      
      $scope.confirmButtonText = confirmButtonText;
      $scope.cancelButtonText = cancelButtonText;
      
      $scope.dispalyMessage = "<h3>The following fields contain some strange formatting.<br/> Please make corrections if needed</h3>";
	  
	   function checkValues(val){
          var returnVal = '';
          
          if(typeof val != 'undefined'){
           if(val != null){                     
                 var num  = val.toString().replace( /\D+/g, '');                
               if(num.length==10){
                   return num;
               }else{
                   return returnVal;
               }                          
           }else{
                 return returnVal;
               }                
           }else{
                return returnVal;
           }
     }

      $scope.proceed = function (text) {

		$scope.phoneValues.employerContact = checkValues($scope.phoneValues.employerContact); 
        $scope.phoneValues.adjusterFax = checkValues($scope.phoneValues.adjusterFax);
        $scope.phoneValues.adjusterPhone = checkValues($scope.phoneValues.adjusterPhone);
        if($scope.phoneValues.adjusterPhone == ''){
          $scope.phoneValues.adjusterPhoneExtension = '';
        }
	  
         $modalInstance.close($scope.phoneValues);
     };
      
     $scope.cancel = function () {
         $modalInstance.close();
     };
})