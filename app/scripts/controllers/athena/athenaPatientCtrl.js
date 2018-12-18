'use strict';
angular.module('ratefastApp')
  .controller('athenaPatientDetailsCtrl', function ($scope, $http,$rootScope, $cookies,$location,$idle,Patients,$sessionStorage,Auth, $athenaModal) {
	 	 
	 //Function to check if string is a valid JSON
	 function isJson(str) 
	 {
		try 
		{
			JSON.parse(str);
		} 
		catch(e) 
		{
			return false;
		}
		return true;
	 }


	//Unais' comment: Function to get parameter value from query string
	function getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}	
	
	//isSpinnerImportPatient : used on importpatient html
  	//$scope.isSpinnerImportPatient = false;
  	$('#isSpinnerImportPatient').hide();
  	$('#spiningwheel').hide();		
	 
	//Unais' comment: Function to create user in RateFast using the details received via SSO 
  	$scope.createUser = function(athenaUserData){						
				
		var parsedUserData;
		
		//if(isJson(athenaUserData))		
			parsedUserData = JSON.parse(athenaUserData);		
		//else
			//parsedUserData = athenaUserData;					
				
  		$scope.athena_patientID = null;  
		if(typeof parsedUserData.patientid !='undefined')
		{
			if(parsedUserData.patientid!=null)
			{
				if(parsedUserData.patientid!='')
					$scope.athena_patientID= parsedUserData.patientid;
			}
		}	
		
  		$http.get('/api/athena/ratefast/checkUserExistence', 
				{ params: {
					firstname : parsedUserData.firstName,
					lastname : parsedUserData.lastName, 
					email : parsedUserData.email,
					//username : parsedUserData.pingone? parsedUserData.pingone.subject.from.idp: parsedUserData.username,
					username : parsedUserData.subject,
					athena_practiceid : parsedUserData.practiceID, 
					athena_departmentid : parsedUserData.departmentID 					
				} 				
				})
  			.success(function (res, status, headers, config) {
  				
				$('#spiningwheel').hide();	
				
				var userData= res.data;			 			 
			 
			 /*
			  * data.userResponseMsg=='create user'
			  * means user does not exist in the ratefast system. So prompt user to enter password
			  * after user enters a desired password, create the user in the system and check for patient id 
				  * if patientID is passed from athena : 
				  * popup - > Do you want to import the patient(s) - >'Yes' - > create patient n save data
				  * popup - > Do you want to import the patient(s) -> 'No' - > redirect user to admin/dashboard
			  */
		     //Scenario 1: If user is not present in RF, create the same
			 if(userData.userResponseMsg=='user not present'){  					
				$scope.passwordpopup(userData.user);  				  									
			 }
			 else if(userData.userResponseMsg=='Email id present against athena practice') //Log the user in to athena
			 {
				//Scenario 2: If user's email id is present in RateFast and a athena practice is already associated with it,
				//give the message to connect manually.
				var message="<h3><p>It appears you already have a RateFast user account. You will need to connect your RateFast user account and your Athena user account manually. Please contact RateFast at info@rate-fast.com.</p></h3>";			
				$scope.errorPopup2('',message,'Okay');					
				
				//setTimeout(function(){ $location.path('/login'); }, 3000);
             }
			 else if(userData.userResponseMsg=='Email id not present against athena practice') //Ask for password and update the practice
			 {   					
				//Scenario 3: If user's email id is present but there is no athena practice associated with it,
				//show a popup asking for the password of current RateFast account, to make sure user is genuine.
				//After he enters password successfully, log him in.
				$scope.passwordpopupAthenaExisting(userData.user);                     
             }
			 else if(userData.userResponseMsg=='user present'){
				//Scenario 4: If user is already present in RateFast, whereas there is no other user with the same
                //email id in Ratefast, log the user in automatically
				login(userData.user[0].username,userData.randomString,userData.user[0].practice[0].name);	  									  				
			 }else if(userData.userResponseMsg == "Athena practice account does not exist"){
				 //Scenario 5: If Athena practice account does not exist, give appropriate message
				 alert("Athena Practice Account does not exist. Please contact the customer team.");
			 }				 
			}).catch(function (err) {								
				$('#spiningwheel').hide();	
				
				var message="<h3><p>Oops, sorry. There was an error. Please try again.</p></h3>";			
				$scope.errorPopup('',message,'Okay');
				console.log('In createUser');
				console.log(err);
			}).finally(function () {
			     //Hide loading spinner whether our call succeeded or failed.	
			     $('#spiningwheel').hide();	  	      
			});			
  	}	

	$scope.getSSODetails = function() {	
	
		$scope.spMsg='Loading...';
		$('#spiningwheel').show();			
		
		//Athena SSO integration code starts from here
		//Unais' comment: Fetch the token id and agent id from the response received from Athena
		var token = getParameterByName('token'); //Get the token id 
		var agent = getParameterByName('agent'); //Get the agent id	


		//Unais' comment: Fetch user details of logged in user from athena, if token id and user id are received successfully
		if((typeof token!='undefined' && token!=null) && (typeof agent!='undefined' && agent!=null))
		{					
			var query = {};
			query.token = token;
			query.agent = agent; 			
					
			$http.get('/athena-user-details',{params:query}
			).success(function(data){			
				
				if(typeof data.userDetails!='undefined')
				{
					if(data.userDetails!='Sorry, the supplied token ID is invalid.\n' && data.userDetails!='We\'re unable to find the requested token. It\'s possible the token has expired. Please sign in (SSO) again.\n')
					{										
						//Unais' comment: Call function to create user in RateFast using the details received						
						$scope.createUser(data.userDetails);		
					}
					else if(data.userDetails=='Sorry, the supplied token ID is invalid.\n')
					{
						$('#spiningwheel').hide();	
						alert(data.userDetails);						
					}
					else
					{
						$('#spiningwheel').hide();	
						alert(data.userDetails);
						//Need to handle following error message as well: 
						//{"userDetails":"We're unable to find the requested token. It's possible the token has expired. Please sign in (SSO) again.\n"}
						//Give a message to user stating that the token id is invalid
					}
				}
				
			}).catch(function (err) {
				$('#spiningwheel').hide();	
				// Log error here
				console.log(err);
			}).finally(function () {
			  // Hide loading spinner whether our call succeeded or failed.  
			  $('#spiningwheel').hide();				  
			});							
		}
		else
		{	
			alert('Token not received');
			//$location.path('/login');
			var userDetails={};
			userDetails.firstName= 'Belal';
			userDetails.lastName='Ahmed';
			userDetails.email='b.elal@rate-fast.com';			
			userDetails.subject='belal2';//'athenaprac_belal';
			userDetails.practiceID=1959378;
			userDetails.departmentID=170;
			
			$scope.createUser(JSON.stringify(userDetails));
			
		}
	}
	
	$scope.passwordpopupAthenaExisting = function (userInfo) {
	  debugger;
	  
	  //Here ask athena user to enter ratefast password... and check this password is valid or not by username,password,practicename...
	  //if valid, then push practice object with hashedString.. dont update hashedPassword here..
	  
		var msg='';
	  
		
		msg = msg + '<div>';
		msg = msg + '<h4>Your email address ' + userInfo.email + ' already exists in the RateFast system. This email is associated with the RateFast user name ' + userInfo.username + '. If this is your username, then please enter your RateFast password below to connect your Athena and RateFast accounts.</h4><br/>';	
		msg = msg + '<h4>If this is not your username, then please contact RateFast support at info@rate-fast.com or 707.304.5949.</h4><br/><br/>';			
		msg = msg + '</div>';
	  
	  $rootScope.modalInstance = $athenaModal.open({
		 templateUrl: 'partials/athena/athena-userpasswordExisting.html',
		 controller: 'athenaUserPasswordExistingCtrl',
				
		
		  resolve:
		  {			
			confirmButtonText: function () {
				return "Go";
			},
			dispalyMessage: function () {
				return msg;
			}
		}
		 
	  });
	  
	  $rootScope.modalInstance.result.then(function (returndata) {
		  debugger;
		  if(typeof returndata.password != 'undefined'){
			 userInfo.password = returndata.password;					  
			$scope.updateUserPractice(userInfo);			
			
		  }
	  }, function (err) {
		  debugger;
		  //model failed : log error here
		  console.log(err);
	  });	        
    }
  	  	
  		  	
  	$scope.passwordpopup = function (pwdData) {
	  debugger;
	  $rootScope.modalInstance = $athenaModal.open({
		 templateUrl: 'partials/athena/athena-userpassword.html',
		 controller: 'athenaUserPasswordCtl'            
	  });
	  $rootScope.modalInstance.result.then(function (returndata) {
		  debugger;
		  if(typeof returndata.password != 'undefined'){
			  pwdData.password= returndata.password;			 			  			 
			 
			  $scope.spMsg='&nbsp;&nbsp;Getting user data...';
			 
			  //create user
			  $http.post('/api/athena/ratefast/createuser',pwdData).success(function(response, status, headers, config){  					
							
				  //check if multiple practices // then practice[0]				  				 
				 
				  //login(response.data.username,pwdData.password,response.data.practice[0].name);
				 
				  login(response.data.username,pwdData.password,response.data.practice[0].name);
				  
			 }).catch(function (err) {
				 console.log(err);
				 var msg = '<h3><p>Technical Error </p></h3>';
				 if(typeof err.data!='undefined'){
					 //console.log(JSON.stringify(err));
					 
					if(err.data)
					{
						if(err.data.code)
						{
							if(err.data.code==11000)
							{
								if(err.data.errmsg.indexOf('duplicate key')>-1) //Duplicate found
								{
									if(err.data.errmsg.indexOf('username_1 dup key')>-1)
									{
										msg = msg +"<h3><p>User name is not unique. Please contact RateFast support at <a href='mailto:info@rate-fast.com'>info@rate-fast.com</a> or 707.304.5949.</p></h3>"   
									}
									else if(err.data.errmsg.indexOf('email_1 dup key')>-1)
									{
										msg = msg +"<h3><p>User name is not unique. Please contact RateFast support at <a href='mailto:info@rate-fast.com'>info@rate-fast.com</a> or 707.304.5949.</p></h3>"   
									}
								}
							}
						}
						else if(err.data.errors)
						{
							if(err.data.errors.username)
							{
								if(err.data.errors.username.properties)
								{
									if(err.data.errors.username.properties.message=='Value is not unique.')
									{
										msg = msg +"<h3><p>User name is not unique. Please contact RateFast support at <a href='mailto:info@rate-fast.com'>info@rate-fast.com</a> or 707.304.5949.</p></h3>" 
									}
								}
							}
							else if(err.data.errors.email)
							{
								if(err.data.errors.email.properties)
								{
									if(err.data.errors.email.properties.message=='Value is not unique.')
									{
										msg = msg +"<h3><p>User name is not unique. Please contact RateFast support at <a href='mailto:info@rate-fast.com'>info@rate-fast.com</a> or 707.304.5949.</p></h3>"
									}
								}
							}
						}	
					}	
					else
					{
						msg = msg +"<h3><p>Something went wrong. Please contact RateFast support at <a href='mailto:info@rate-fast.com'>info@rate-fast.com</a> or 707.304.5949.</p></h3>"
					}
				 }
				 else
				 {
					 msg = msg +"<h3><p>Something went wrong. Please contact RateFast support at <a href='mailto:info@rate-fast.com'>info@rate-fast.com</a> or 707.304.5949.</p></h3>"
				 }
				 
				 if(msg == '<h3><p>Technical Error </p></h3>')
				 {
					 msg = msg +"<h3><p>Something went wrong. Please contact RateFast support at <a href='mailto:info@rate-fast.com'>info@rate-fast.com</a> or 707.304.5949.</p></h3>"
				 }
				         
				 $scope.messagePopupWithoutButton('',msg,'');

			}).finally(function () {
			 
			});	           
		  }
	  }, function (err) {
		  debugger;
		  //model failed : log error here
		  console.log(err);
	  });	        
    }
	
	$scope.updateUserPractice = function (updateData) {
          //update user
       $http.post('/api/athena/ratefast/updateuser',updateData).success(function(response, status, headers, config){                      
           
		   if(response.comparison)
			{
				if(response.comparison=='not matched')
				{																			
					$scope.messagePopupWithoutButtonLogin();
				}
				else if(response.comparison=='matched')
				{						
						login(updateData.username,updateData.password,updateData.practice[0].name);	
						
				}
			}			   
           
		}).catch(function (err) {
		 console.log(err);
		
	   }).finally(function () {	
	   });      
   }
      
  	function login(aUsername,aPassword,aPracticename){
        debugger;
        Auth.login({
            username: aUsername,
            password: aPassword,
            practicename : aPracticename
        })
        .then(function (userinfo) {         
            debugger;
            $idle.watch();
			  $rootScope.currentUser=userinfo;
			  
			  if (userinfo.isresetPwdexpired) {                
				  $location.path('confirmpassword/' + userinfo.id);
            	} else {
						/*var todaysDate= new Date(); // todays date
						var getPWDchangeDate=new Date(userinfo.passwordchangedate);              		               		
						var diffdays=Math.round((todaysDate-getPWDchangeDate)/(1000*60*60*24));
						if(diffdays > 90){
							$location.path('confirmpassword/' + userinfo.id);
						}else*/
						//{
							$cookies.selectedState = 'California';
							$cookies.selectedStatecode = 'CA';
							$rootScope.currentState = $cookies.selectedState;
														
							try{									
								//if (typeof $rootScope.currentUser.level!='undefined') {
								if($rootScope.currentUser.rolename!='siteadmin' && $rootScope.currentUser.rolename!='superadmin' && $rootScope.currentUser.rolename!='rater1' && $rootScope.currentUser.rolename!='rater2')	
								{
									$idle.setIdleTime($rootScope.currentUser.practiceDetails.session_timeout[$rootScope.currentUser.rolename+'_'+$rootScope.currentUser.level]);
									$idle.setTimeoutTime($rootScope.currentUser.practiceDetails.logout_warning_seconds);
									$idle.watch();
								} 	
								else 
								{										
									$idle.setIdleTime($rootScope.currentUser.practiceDetails.session_timeout[$rootScope.currentUser.rolename]);
									$idle.setTimeoutTime($rootScope.currentUser.practiceDetails.logout_warning_seconds);
									$idle.watch();
								}								
							}catch(err){
								console.log(err);
							}								
							
							//if patient id pass from sso 
														
							if ($scope.athena_patientID != null) {
								$scope.checkAthenaPatient($scope.athena_patientID);
							} else {
									$location.path('/admin/dashboard');
							}
						//}
		            }
		        })
		        .catch(function (err) {
		            debugger;
			            console.log(err);
		        });
  		}
			
  	// ******************************************************************* //
  	
  	
  	/*
  	 * Part 2 : Patient code
  	 */
  	
  	// check patient existance into ratefast account
  	$scope.checkAthenaPatient = function(patientID){  		
  		if(typeof patientID!='undefined'){
  			if(patientID!=''){			
  				$http.get('/api/athena/ratefast/checkPatientExistance', { params: {patientid: patientID} }
  				 ).success(function (patientdata, status, headers, config) {  					 
  					 if(patientdata.patients.length>0){
  						 //patient exist : redirect injury page of patient
  						 $scope.openPatientLibrary(patientdata.patients[0]._id);
  					 }else{
  						 // popup to athena user : want to insert patient inside ratefast ?
  						 $scope.popup(patientID);
  					 }  					
  				}).catch(function (err) {
					var message="<h3><p>Technical Error : </p></h3> <h3><p>"+ err.data +"</p></h3>";			
	  				$scope.errorPopup('',message,'Okay');	
  		  	    }).finally(function () {
  		  	      // Hide loading spinner whether our call succeeded or failed.  		  	     
  		  	    });	
  			}	
  		}
  	}	  
  	
  	
  	//popup : want to insert patient inside ratefast ?
  	$scope.popup = function (athenaPatientID) {
          debugger;
        var messge="<h3><p>When you signed in to RateFast, you were viewing a patient who does not currently exist in RateFast. Would you like to import this patient from Athena to RateFast?</p></h3>"
          $rootScope.modalInstance = $athenaModal.open({
          	 templateUrl: 'partials/athena/athena-dynamicPopup.html',
  	         controller: 'athenaDynamicPopUpCtrl',
              resolve: {
              	athenaPatientID: function () {
                      return athenaPatientID;
                  },
                  confirmButtonText: function () {
                      return "Yes";
                  },
                  cancelButtonText: function () {
                      return "No";
                  },
                  dispalyMessage: function () {
                      return messge;
                  }
              }
          });
          $rootScope.modalInstance.result.then(function (returndata) {
              debugger;
        
              if (returndata == 'no') {
              	$location.path('admin/dashboard');
              }
              if (returndata == 'yes') {
				  $scope.spMsg='Getting patient data...';
            	  $('#spiningwheel').show();
            	  
	              	var query={}
	          		query.patientid=athenaPatientID;	              	
	              	query.practiceid = $rootScope.currentUser.practiceDetails.athena_practiceid;
	              	query.departmentid = $rootScope.currentUser.athena_departmentid;
	              		          		 
	              	$http.get('/api/athena/getpatientByID',{ params : query }
	              		).success(function(patinetdata){
		              		$scope.exportpatient(patinetdata.PatientDetail[0]);
	              		}).catch(function (err) {
	              			 $('#spiningwheel').hide();
	              			var message="<h3><p>Technical Error : </p></h3> <h3><p>"+ err.data +"</p></h3>";			
	    	  				$scope.errorPopup('',message,'Okay');	  
	              	    }).finally(function () {
	              	      // Hide loading spinner whether our call succeeded or failed.              	    
	              	    });	
              }
          }, function (err) {
              debugger;
              // model failed
              $('#spiningwheel').hide();
              $location.path('admin/dashboard');
          });	        
      }
  	
  	
  	//insert athena patient manually
  	$scope.patientfirstname='';
  	$scope.patientlastname='';
  	$scope.patientdob='';
    $scope.patient = {};
  	
    //Get list of patients from athena
  	$scope.getAthenaPatients = function()
  	{		
  		$('#isSpinnerImportPatient').show();
  	
  		var query={}
  		query.firstname=$scope.patientfirstname;
  		query.lastname=$scope.patientlastname;
  		//query.dob=$scope.patientdob;
  		query.practiceid=$rootScope.currentUser.practiceDetails.athena_practiceid;
		
		var dob = new Date($scope.patientdob);        
         
        var day = dob.getDate() < 10 ? '0'+dob.getDate() : dob.getDate();
        var month = dob.getMonth()+1;
               month = month<10 ? '0'+month : month;
         
        var year = dob.getFullYear();
                                    
        query.dob = month+"/"+day+"/"+year;
  		
  		$http.get('/api/athena/getpatientList', { params: query }
  		 ).success(function (data, status, headers, config) {
  			 $scope.patients=data.patients.patients;
  		}).catch(function (err) {
  			var message="<h3><p>Technical Error : </p></h3> <h3><p>"+ err.data +"</p></h3>";			
			$scope.errorPopup('',message,'Okay');	  
  	    }).finally(function () {
  	    	$('#isSpinnerImportPatient').hide();
  	    });	
  	}
  	
  	$scope.clearFields=function(){
  		$scope.patientfirstname='';
  		$scope.patientlastname='';
  		$scope.patientdob='';
  	}
  	
  	
    function createPatientObject() {
      	
	  $scope.patient.recentviews = [{
		  viewedby: null,
		  vieweddate: null
	  }];
	  $scope.patient.basicinformation = [{
		  firstname: null,
		  middlename: null,
		  lastname: null,
		  gender: null,
		  dateofbirth: null,
		  dateofdeath: null,
		  socialsecurityno: null,
		  employeehandedness: '',
		  status: null,
		  updateddate: Date.now(),
		  updatedby: $rootScope.currentUser.username
	  }];
	  $scope.patient.contactinformation = [{
		  email: null,
		  homephone: null,
		  cellphone: null,
		  workphone: null,
		  phonenumberselect: '',
		  phonenumberselectsecond: '',
		  phonenumberselectthird: '',
		  voicemailthirdradio: 'No',
		  voicemailsecondradio: 'No',
		  voicemailradio: 'No',
		  extension: null,
		  preferredcommunication: '',
		  preferredcommunicationother: null,
		  status: null,
		  updateddate: Date.now(),
		  updatedby: $rootScope.currentUser.username
	  }];
	  $scope.patient.address = [{
		  addressline1: null,
		  addressline2: null,
		  city: null,
		  state: 'CA',
		  zipcode: null,
		  status: null,
		  updateddate: Date.now(),
		  updatedby: $rootScope.currentUser.username
	  }];
	  $scope.patient.demographics = [{
		  preferredlanguage: '',
		  preferredlanguageother: null,
		  ethnicity: '',
		  ethnicityother: null,
		  race: '',
		  raceother: null,
		  status: null,
		  updateddate: Date.now(),
		  updatedby: $rootScope.currentUser.username
	  }];
	  $scope.patient.occupation = [{
		  currentoccupation: '',
		  currentoccupationother: null,
		  status: null,
		  updateddate: Date.now(),
		  updatedby: $rootScope.currentUser.username
	  }];
	  $scope.patient.emergencycontactinfo = [{
		  relationship: '',
		  firstname: null,
		  lastname: null,
		  email: null,
		  homephone: null,
		  cellphone: null,
		  workphone: null,
		  extension: null,
		  address: [
			  {
				  addressline1: null,
				  addressline2: null,
				  city: null,
				  state: 'CA',
				  zipcode: null
			  }
		  ],
		  status: null,
		  updateddate: Date.now(),
		  updatedby: $rootScope.currentUser.username
	  }];
	
	
	  $scope.patient.medicalhistory = [{
		shgeneralpriorhealthradio:  null,
		shgeneralhealthcontricheck:  [],
		shgeneralhealthontritextother:  null,	              
		shgeneralhealthpriorsurgeryradio:  null,
		shgeneralhealthpriorsugeycheck: [],
		shgeneralhealthpriorsurgerytextother:  null,
		  shcurrentmedicationradio:null,
		  shcurrentmedications:[],
		  shcurrentmedicationsothertext:null,	            
		  shknownallergiesNonecheck: [],
		  shknownallergiescheck: [],
		  shknownallergiesOthercheck: [],
		  shknownallergiesOthercheckTextarea:  null,
		  shknownallergiesothertext:  null,            
		  shpriorillnessradio: null,
		  shgeneralreviewpriorcheck :[],
		  negativeshgeneralconstitutionalcheck : [],
		  shgeneralconstitutionalcheck : [],	           
		  shgeneraleyescheck : [], 	        
		  shgeneralthroatcheck : [],
		  shgeneralcardiovascularcheck : [],
		  shgeneralrespiratorycheck:  [],
		  shgeneralgastrointestinalcheck: [],
		  shgeneralgenitourinary: [],
		  shgeneralmusculoskeletalcheck: [],	        	            
		shgeneralskincheck: [],
		  shgeneralneurologicalcheck: [],
		  shgeneralpsychiatric: [],
		  shgeneralendocrinecheck: [],
		  shgeneralhematologicalcheck: [],
		  shgeneralallergiccheck: [],        	        
		  shgeneralreviewpriorothertext : null,           
		  shgeneraleyesothertext:  null,
		shgeneralthroatothertext:  null,
		shgeneralcardiovascularothertext:  null,	    		
		shgeneralrespiratoryothertext:  null,
		shgeneralgastrointestinalothertext:  null,
		shgeneralgenitourinaryothertext:  null,	    		
		shgeneralmusculoskeletalothertext:  null,
		shgeneralskinothertext:  null,	    		
		shgeneralneurologicalothertext:  null,	
		shgeneralpsychiatricothertext:  null,	
		shgeneralendocrineothertext:  null,
		shgeneralhematologicalothertext:  null,
		shgeneralallergicothertext:  null,
		  status: null,
		  updateddate: Date.now(),
		  updatedby: $rootScope.currentUser.username
	  }];
	  
	  $scope.patient.sh = [{
		  updateddate: Date.now(),
			updatedby: $rootScope.currentUser.username,
			status: null,
			SHrdoMaritalStatus:null,
			SHrdoEmploymentStatus:null,  		                   
			SHchkOccupationalHistory:[],
			SHchkOccupationalHistory_option:null,
			chkOccupationalHistoryOtherTextarea:null,  	  		                   
			chkCaffeineNegative:[],
			chkCaffeineNegative_option:null,  		                 
			chkCaffeine:[],
			chkCaffeine_option:null,
			txtCaffeine:null,  		                  
			chkStreetDrug:[],
			chkStreetDrug_option:null,
			txtStreetDrug:null,  		                   
			chkTobacco:[],
			chkTobacco_option:null,
			txtTobacco:null,  		                   
			chkAlcohol:[],
			chkAlcohol_option:null,
			txtAlcohol:null,  		                    		                   
			shfreedataentry:null,  		                   
			SHrdoLevelOfEducation:null,  		                   
			SHrdoLevelOfEducationtextA:null,
			rdoSecondJobs:null,
			rdoSecondJobsTextarea:null,
			rdoSelfEmployment:null,
			rdoSelfEmploymentTextarea:null,
			rdoMilitaryService:null,
			rdoMilitaryServiceTextarea:null,  		                  
			chkHobbiesNone:[],
			chkHobbiesNone_option:null,
			chkHobbies:[],  		                   
			chkHobbies_option:null,
			chkHobbiesOtherTextarea:null,
	  }];
    };

      
   // check patient existance into ratefast account
    	$scope.checkPatientExistanceForImport = function(athenaPatientData){  		    	
    		var patientID = athenaPatientData.patientid;
    		if(typeof patientID!='undefined'){
    			if(patientID !='' && patientID != null ){			
    				$http.get('/api/athena/ratefast/checkPatientExistance', { params: {patientid: patientID} }
    				 ).success(function (patientdata, status, headers, config) {    					 
    					 if(patientdata.patients.length>0){    						
							var message="<h3><p>This patient seems to have been imported already.</p></h3>";			
							$scope.errorPopup('',message,'Okay');	
    					 }else{
    						 $('#isSpinnerImportPatient').show();
    						 $scope.exportpatient(athenaPatientData);
    					 }  					
    				}).catch(function (err) {
    					var message="<h3><p>Technical Error : </p></h3> <h3><p>"+ err.data +"</p></h3>";			
    	  				$scope.errorPopup('',message,'Okay');	  
    		  	    }).finally(function () {
    		  	    	  	     
    		  	    });	
    			}	
    		}
    	}	  
      
      // insert patient into ratefast	
  	$scope.exportpatient = function(athenaPatientData){
	  	try{	  		
		  		createPatientObject(); 

	  		   $scope.patient.practicename = $rootScope.currentUser.practicename;
	           $scope.patient.createddate = Date.now();
	           $scope.patient.createdby = $rootScope.currentUser.username;
	           $scope.patient.state = $cookies.selectedStatecode;
	
	           $scope.patient.recentviews[0].viewedby = $rootScope.currentUser.username;
	           $scope.patient.recentviews[0].vieweddate = Date.now();
	
	           $scope.patient.basicinformation[0].status = 'current';
	           $scope.patient.contactinformation[0].status = 'current';
	           $scope.patient.address[0].status = 'current';
	           $scope.patient.demographics[0].status = 'current';
	           $scope.patient.occupation[0].status = 'current';
	           $scope.patient.emergencycontactinfo[0].status = 'current';
	  		   $scope.patient.medicalhistory[0].status = 'current';
	           $scope.patient.sh[0].status = 'current';
  		
           //basic info
	           	          
	           $scope.patient.athena_practiceid =  $rootScope.currentUser.practiceDetails.athena_practiceid;          
		  	   $scope.patient.athena_departmentid = $rootScope.currentUser.athena_departmentid;
		  		
		  		$scope.patient.athena_patientid = athenaPatientData.patientid;
		  		$scope.patient.basicinformation[0].firstname = athenaPatientData.firstname;
		  		$scope.patient.basicinformation[0].lastname = athenaPatientData.lastname;
		  		$scope.patient.basicinformation[0].dateofbirth = athenaPatientData.dob;
		  				 
		  		var ssn='';
  	
	  		if(typeof athenaPatientData.ssn != 'undefined'){
	  			ssn =  athenaPatientData.ssn.slice(-4)		
	  	  		$scope.patient.basicinformation[0].socialsecurityno = '00000'+ ssn;  	  		
	  		}
  		
			if(typeof athenaPatientData.sex != 'undefined'){
                  if(athenaPatientData.sex=='M'){
                      $scope.patient.basicinformation[0].gender = 'Male';
                  }else if(athenaPatientData.sex=='F'){
                      $scope.patient.basicinformation[0].gender = 'Female';
                  }
              }
  		
  		//address
	  		if(typeof athenaPatientData.address1 != 'undefined'){
	  			$scope.patient.address[0].addressline1  = athenaPatientData.address1;
	  		}
	  		if(typeof athenaPatientData.address2 != 'undefined'){
	  			$scope.patient.address[0].addressline2  = athenaPatientData.address2;
	  		}
	  		if(typeof athenaPatientData.zip != 'undefined'){
	  			$scope.patient.address[0].zipcode = athenaPatientData.zip;
	  		}
	  		if(typeof athenaPatientData.city != 'undefined'){
	  			$scope.patient.address[0].city  = athenaPatientData.city;
	  		}
	  		if(typeof athenaPatientData.state != 'undefined'){
	  			$scope.patient.address[0].state  = athenaPatientData.state;
	  		}
	  		
	  		//contact
	  		if(typeof athenaPatientData.email != 'undefined'){
	  			$scope.patient.contactinformation[0].email  = athenaPatientData.email;
	  		}
			
			
			
	  		if(typeof athenaPatientData.homephone != 'undefined'){
                  //format number
                  $scope.patient.contactinformation[0].homephone  = formatAthenaPhoneNumbers(athenaPatientData.homephone);
              }
              if(typeof athenaPatientData.mobilephone != 'undefined'){
                  //format number
                  $scope.patient.contactinformation[0].cellphone  = formatAthenaPhoneNumbers(athenaPatientData.mobilephone);
              }
              
              //work phone
              try{
                  if(typeof athenaPatientData.workphone != 'undefined'){
                  if(athenaPatientData.workphone != null && athenaPatientData.workphone != ''){        
                      var str = athenaPatientData.workphone;
                      var num  = str.toString().replace( /\D+/g, '');
                    
                      if(num != null && num !=''){
                          if(num.length >= 10){    
                              if(num.substring(0,1) == 1){
                                  $scope.patient.contactinformation[0].workphone  = num.substring(1,11);                                
                                       $scope.patient.contactinformation[0].extension = num.substring($scope.patient.contactinformation[0].workphone.length+1,num.length);
                              }else{
                                  $scope.patient.contactinformation[0].workphone  = num.substring(0,10);
                                  $scope.patient.contactinformation[0].extension = num.substring($scope.patient.contactinformation[0].workphone.length,num.length);
                              }
                          }
                      }
                  }
                }
              }catch(err){
                  
              }
			
			
			
	  		if(typeof athenaPatientData.contactpreference != 'undefined'){
	  			if(athenaPatientData.contactpreference == 'HOMEPHONE'){			
	  				$scope.patient.contactinformation[0].preferredcommunication = 'Home phone';
	  			}else if(athenaPatientData.contactpreference == 'MOBILEPHONE'){			
	  				$scope.patient.contactinformation[0].preferredcommunication = 'Cell phone';
	  			}
	  		}
	  				
	  		//social history
			if(typeof athenaPatientData.maritalstatusname != 'undefined'){
                  if(athenaPatientData.maritalstatusname == 'SINGLE' || athenaPatientData.maritalstatusname == 'MARRIED' || athenaPatientData.maritalstatusname == 'DIVORCED' || athenaPatientData.maritalstatusname == 'WIDOWED'){
                      //partner, unknown, separated  -- > not available in ratefast
                      if(athenaPatientData.maritalstatusname.length>0){
                          var maritalstatustext = athenaPatientData.maritalstatusname.toLowerCase();
                                          
                          $scope.patient.sh[0].SHrdoMaritalStatus = maritalstatustext.charAt(0).toUpperCase() + maritalstatustext.slice(1);    
                      }
                  }                          
              }

  		 	$http.post('api/athena/createpatient', $scope.patient).success(function(response, status, headers, config){		   			
		   			$scope.openPatientLibrary(response.newPatientID);   			
			 }).catch(function (err) { 		  	  
	  				var message="<h3><p>Technical Error : </p></h3> <h3><p>"+ err.data +"</p></h3>";			
	  				$scope.errorPopup('',message,'Okay');	  			
	  	    }).finally(function () {
		  	      $('#spiningwheel').hide();
		  	      $('#isSpinnerImportPatient').hide();
	  	    });  		 	
  		}catch(err){  			  			
  			 $('#isSpinnerImportPatient').hide();
  			 $('#spiningwheel').hide();
  			
    		var message="<h3><p>Technical Error : </p></h3> <h3><p>"+ err +".</p></h3>";			
			$scope.errorPopup('',message,'Okay');
			
			$location.path('admin/dashboard');  				
  		}   
  	}
	
	function formatAthenaPhoneNumbers(phnNumber){
         
         var returnNumber = '';
         try{
                  if(typeof phnNumber != 'undefined'){
                      if(phnNumber != null && phnNumber != ''){        
                          var str = phnNumber;
                          var num  = str.toString().replace( /\D+/g, '');
                        
                          if(num != null && num !=''){
                              if(num.length >= 10){    
                                  if(num.substring(0,1) == 1){
                                    returnNumber = num.substring(1,11);          
                                  }else{
                                    returnNumber = num.substring(0,10);                  
                                  }
                              }
                          }
                      }
                    }
               
               return returnNumber;
         }catch(err){
             return returnNumber;
         }
                   
     }
  	
  	$scope.errorPopup= function(id,message,buttonName){
		 debugger;
	     var messge="<h3><p>"+message+"</p></h3>"
	       $rootScope.modalInstance = $athenaModal.open({
	       	 options: {keyboard: true},
			 templateUrl: 'partials/athena/athena-dynamicPopupSingleButton.html',
		         controller: 'athenaDynamicPopUpSingleButtonCtrl',
	           resolve: {
	           		ID: function () {
	                   return id;
	               },
	               cancelButtonText: function () {
	                   return buttonName;
	               },
	               dispalyMessage: function () {
	                   return messge;
	               }
	           }
	       });
	       $rootScope.modalInstance.result.then(function (returndata) {
	           
	       }, function (err) {
	           debugger;
	           // model failed
	           console.log('err : ' + err);           
	       });	 
	}
	
	$scope.messagePopupWithoutButton= function(id,message,buttonName){
		 debugger;
	     var messge="<h3><p>"+message+"</p></h3>"
	       $rootScope.modalInstance = $athenaModal.open({
	       	 options: {keyboard: true},
			 templateUrl: 'partials/athena/athena-dynamicPopupWithoutButton.html',
		         controller: 'athenaDynamicPopUpWithoutButtonCtrl',
	           resolve: {	           			             
	               dispalyMessage: function () {
	                   return messge;
	               }
	           }
	       });
	       $rootScope.modalInstance.result.then(function (returndata) {
	           
	       }, function (err) {
	           debugger;
	           // model failed
	           console.log('err : ' + err);           
	       });	 
	}
	
	//Has a login link to redirect to login
	$scope.messagePopupWithoutButtonLogin= function(){
		 
	       $rootScope.modalInstance = $athenaModal.open({
	       	 options: {keyboard: true},
			 templateUrl: 'partials/athena/athena-dynamicPopupWithoutButtonLogin.html',
		         controller: 'athenaDynamicPopUpWithoutButtonLoginCtrl',
	           resolve: {	           			             	               
	           }
	       });
	       $rootScope.modalInstance.result.then(function (returndata) {
	           
	       }, function (err) {
	           debugger;
	           // model failed
	           console.log('err : ' + err);           
	       });	 
	}
	
	$scope.errorPopup2= function(id,message,buttonName){
		 debugger;
	     var messge="<h3><p>"+message+"</p></h3>"
	       $rootScope.modalInstance = $athenaModal.open({
	       	 options: {keyboard: true},
			 templateUrl: 'partials/athena/athena-dynamicPopupSingleButton.html',
		         controller: 'athenaDynamicPopUpSingleButtonCtrl',
	           resolve: {
	           		ID: function () {
	                   return id;
	               },
	               cancelButtonText: function () {
	                   return buttonName;
	               },
	               dispalyMessage: function () {
	                   return messge;
	               }
	           }
	       });
	       $rootScope.modalInstance.result.then(function (returndata) {
				
				$location.path('/login');
		   
	       }, function (err) {
	           debugger;
	           // model failed
	           console.log('err : ' + err);           
	       });	 
	}
  	
  	
  	// update current patient into racentview to show on dashbaord
  	  function updateRecentViews(patientId) {
  	        var query = {
  	            patientid: patientId
  	        };
  	        Patients.updateRecentViews().save(query, function () {  	        	
  	        });
        };

        // redirect to injury page of patient
  	    $scope.openPatientLibrary = function (patientId) {
  	        debugger;
  	        if ($sessionStorage.patientId) {
  	            delete $sessionStorage.patientId;
  	            delete $sessionStorage.InjuryId;
  	            delete $sessionStorage.reportId;
  	        }
  			
  			if(typeof $rootScope.apidataTreatingPhysician != 'undefined'){              	
  	        	delete $rootScope.apidataTreatingPhysician;
  	        }
  			
			try{
            if ($sessionStorage.athena_patient_id) {
                delete $sessionStorage.athena_patient_id;
            }
			}catch(err){}
			
  	        updateRecentViews(patientId);
  	          	       
  	        $rootScope.patientId = patientId;
  	        $sessionStorage.patientId = patientId;
  	        $location.path('/patient/createinjury');
  	    }	
})
.controller('athenaUserPasswordCtl', function ($scope, $http, $routeParams, $modalInstance) {
  	
  	$scope.user={};
  	
  	$scope.getPassword = function (form) {
  		$modalInstance.close(form);
  	  };
})
.controller('athenaUserPasswordExistingCtrl', function ($scope, $http, $routeParams, $modalInstance, confirmButtonText, dispalyMessage) {
  	
  	$scope.user={};
  	$scope.confirmButtonText= confirmButtonText;
	$scope.dispalyMessage= dispalyMessage;
	
	
  	$scope.getPassword = function (form) {
  		$modalInstance.close(form);
  	  };
})