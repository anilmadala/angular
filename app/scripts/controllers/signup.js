'use strict';

angular.module('ratefastApp')
    .controller('SignupCtrl', function ($scope, $http, Practices, $locale, $location, SalespersonAllList, CountriesList, StatesList, QuestionsList, SpecialitiesList, PracticesUnique, UsersUnique, $modal) {

		$scope.practiceaddressValidation=false;
        $scope.user = {};
        $scope.errors = {};
        $scope.practice = new Object();
        $scope.practice.practiceaddress = [
            { 'streetaddress': '', 'country': '', 'city': '', 'state': '', 'zipcoe': '', 'isUS': true }
        ];
        $scope.practice.profession = [];
        $scope.isDisabled = false;
        $scope.practice.accounttype = "provider";
        $scope.practice.stampapproval = "publish";
        $scope.isLoad = false;
        $scope.confirmPasswordDisableCond = true; // set Confirm Password field Disable 
        //To disable signup button if more than 4 Professional degree selected
    	$scope.isDisabledOnProfession = false;
		
		// Set the default value of inputType
            $scope.inputType = 'password';
            
            $scope.hideShowPassword = function(){
                    if ($scope.inputType == 'password')
                      $scope.inputType = 'text';
                    else
                      $scope.inputType = 'password';
           };

        $scope.formatZip = function (zipcode, text, index) {
            debugger;
            if (zipcode) {
                zipcode = zipcode.replace('-', '');
                if (typeof index != "undefined") {
                    text = text.replace('arrayindex', index);
                }
                if (zipcode.length == 5) { // (11) 9 means mobile, or instead, you could use a regex
                    eval(text + '=' + "'" + zipcode + "'");
                }
                else if (zipcode.length == 9) {
                    var zipcodeFirst = zipcode.slice(0, 5);
                    var zipcodeLast = zipcode.slice(5, 9);
                    //if (zipcode.length > 5) {
                    var zipcodeArray = zipcode.slice(0, 5) + '-' + zipcode.slice(5, 9);
                    eval(text + '=' + "'" + zipcodeArray + "'");
                    return zipcodeArray;
                    //}
                } 
            }
        };

        //GT:PSHA 29th June 2015
        $scope.setConfirmPassword = function () {
                        
            if ($scope.step1form.password.$error.required) {
                return true;
            }
            if ($scope.step1form.password.$error.pattern) {
               return true;
            }
            if ($scope.step1form.password.$error.minlength) {
                return true;
            }
            return false;
        }

		//change by shri for billing zipcode
        $scope.setzipcode = function () {        	
        	  $scope.step2form.zipcode.$error.maxlength = false;
              $scope.step2form.zipcode.$invalid = false;
              $scope.step2form.zipcode.$valid = true;
              
            if ($scope.practice.billingaddress.zipcode.length > 5) {                
            	$scope.practice.billingaddress.zipcode = $scope.practice.billingaddress.zipcode.replace('-', '');
            	$scope.practice.billingaddress.zipcode = $scope.practice.billingaddress.zipcode.slice(0, 5) + '-' + $scope.practice.billingaddress.zipcode.substring(5, 9);
            }
            if ($scope.practice.billingaddress.zipcode.substr($scope.practice.billingaddress.zipcode.length - 1) == '-') {
            	$scope.practice.billingaddress.zipcode = $scope.practice.billingaddress.zipcode.replace('-', '');
            }
        }


        
        //change by shri for billing zipcode
        $scope.setzipcodeafterchange = function () {
        	if(typeof $scope.practice!='undefined'){
        		if(typeof $scope.practice.billingaddress!='undefined'){
        			if(typeof $scope.practice.billingaddress.zipcode !='undefined'){ 
        				if ($scope.practice.billingaddress.zipcode.length > 5) {
        	                if ($scope.practice.billingaddress.zipcode.split('-')[1].length != 4) {
        	                	 $scope.practice.billingaddress.zipcode = '';
        						 $scope.step2form.zipcode.$error.maxlength = true;
        						 $scope.step2form.zipcode.$invalid = true;
        						 $scope.step2form.zipcode.$valid = false;
        	                }
        	            }
        	            if ($scope.practice.billingaddress.zipcode.length < 5 && $scope.practice.billingaddress.zipcode.length != 0) {
        	            	$scope.practice.billingaddress.zipcode= '';
        					$scope.step2form.zipcode.$error.maxlength = true;
        	                $scope.step2form.zipcode.$invalid = true;
        	                $scope.step2form.zipcode.$valid = false;
        	            }
        			}
            	}
        	}        	  
        }
		
		//changed by shri for practice location zipcode
        $scope.setzipcodePracticeaddress = function (zipcodeIndex) {        	              
            if ($scope.practice.practiceaddress[zipcodeIndex].zipcode.length > 5) {                
            	$scope.practice.practiceaddress[zipcodeIndex].zipcode = $scope.practice.practiceaddress[zipcodeIndex].zipcode.replace('-', '');
            	$scope.practice.practiceaddress[zipcodeIndex].zipcode = $scope.practice.practiceaddress[zipcodeIndex].zipcode.slice(0, 5) + '-' + $scope.practice.practiceaddress[zipcodeIndex].zipcode.substring(5, 9);
            }
            if ($scope.practice.practiceaddress[zipcodeIndex].zipcode.substr($scope.practice.practiceaddress[zipcodeIndex].zipcode.length - 1) == '-') {
            	$scope.practice.practiceaddress[zipcodeIndex].zipcode = $scope.practice.practiceaddress[zipcodeIndex].zipcode.replace('-', '');
            }
        }


        
        //change by shri for practice location zipcode
        $scope.setzipcodePracticeaddressafterchange = function (zipcodeIndex) {
        	if(typeof $scope.practice!='undefined'){
        		if(typeof $scope.practice.practiceaddress!='undefined'){
        			if(typeof $scope.practice.practiceaddress[zipcodeIndex].zipcode !='undefined'){ 
        				if ($scope.practice.practiceaddress[zipcodeIndex].zipcode.length > 5) {
        	                if ($scope.practice.practiceaddress[zipcodeIndex].zipcode.split('-')[1].length != 4) {
        	                	$scope.practice.practiceaddress[zipcodeIndex].zipcode = '';
        	                }
        	            }
        	            if ($scope.practice.practiceaddress[zipcodeIndex].zipcode.length < 5 && $scope.practice.practiceaddress[zipcodeIndex].zipcode.length != 0) {
        	            	$scope.practice.practiceaddress[zipcodeIndex].zipcode = '';
        	            }
        	            $scope.checkAddressValidation();
        			}
            	}
        	}        	  
        }
		
        $scope.formatBillingZip = function () {
            debugger;
            $scope.step2form.zipcode.$valid = false;
            var zipcode = $scope.practice.billingaddress.zipcode;
            if (zipcode) {
                zipcode = zipcode.replace('-', '');
                if (zipcode.length > 5 && zipcode.length < 9) {
                    var zipcodeFirst = zipcode.slice(0, 5);
                    var zipcodeLast = zipcode.slice(5, 9);
                    var zipcodeArray = zipcode.slice(0, 5) + '-' + zipcode.slice(5, 9);
                    $scope.practice.billingaddress.zipcode = zipcodeArray;
                    $scope.step2form.zipcode.$invalid = true;
                    $scope.step2form.zipcode.$error.maxlength = true;
                    $scope.step2form.zipcode.$valid = false;
                }
                else if (zipcode.length < 5 && zipcode.length > 0) {
                    $scope.step2form.zipcode.$error.maxlength = true;
                    $scope.step2form.zipcode.$invalid = true;
                    $scope.step2form.zipcode.$valid = false;
                }
                else if (zipcode.length == 5 || zipcode.length == 9) {
                    $scope.step2form.zipcode.$error.maxlength = false;
                    $scope.step2form.zipcode.$invalid = false;
                    $scope.step2form.zipcode.$valid = true;
                }
            } else {
                $scope.step2form.zipcode.$error.maxlength = false;
                
            }
        };

        $scope.zipcodeChange = function () {

            $scope.zipcodeArray = '';
        };

        $scope.practice.speciality = [
            { 'name': '', 'boardcertified': '' }
        ];


        //$scope.practice.address = [{'streetaddress': 'dasda', 'country': 'dasda', 'city': 'asddsa','state':'AK','zipcoe':'22222'}];
        $scope.disableDrop = false;
        $scope.disable = false;
        $scope.wks = { number: 1, name: 'testing' };
        $scope.currentYear = new Date().getFullYear();
        $scope.currentMonth = new Date().getMonth() + 1;
        $scope.months = $locale.DATETIME_FORMATS.MONTH;
        $scope.ccinfo = { type: undefined };
        //$scope.stateslist();

        $scope.countriesList = function () {
            debugger;
            CountriesList.query(function (countries) {
                $scope.countries = countries;
            });
        };

        $scope.getValidatorRegex = function () {
            debugger;            
            return /^[a-zA-Z][a-zA-Z0-9.,$;]+$/;
        }

        $scope.valid_credit_card = function (value) {

            debugger;
            // accept only digits, dashes or spaces
            if (/[^0-9-\s]+/.test(value) || value.length < 13) return false;

            // The Luhn Algorithm. It's so pretty.
            var nCheck = 0, nDigit = 0, bEven = false;
            value = value.replace(/\D/g, "");

            for (var n = value.length - 1; n >= 0; n--) {
                var cDigit = value.charAt(n),
                      nDigit = parseInt(cDigit, 10);

                if (bEven) {
                    if ((nDigit *= 2) > 9) nDigit -= 9;
                }

                nCheck += nDigit;
                bEven = !bEven;
            }
            debugger;
            var returnValue = (nCheck % 10) == 0;
            $scope.step2form.ccnumber.$invalid = !returnValue;
            $scope.step2form.ccnumber.$error.validate = !returnValue;
            $scope.submitted = !returnValue;
            $scope.step2form.ccnumber.$valid = returnValue;
            return (nCheck % 10) == 0;
        }

        $scope.register = function (form) {
            $scope.isLoad = true;
            $scope.submitted = true;
            $scope.sectionValidate = true;
            debugger;
            Practices.practices.save($scope.practice, function (err, res) {
                debugger;
                $scope.isLoad = false;
                $scope.step = 4;
            }).$promise
                .then(function (error, responce) {
                    debugger;
                    $scope.isLoad = false;
                    $scope.regMaindiv = true;
                })
                .catch(function (err) {

                    debugger;
                    err = err.data;
                    $scope.errors = { 'error': err };
                    $scope.haserror = true;
                    // Update validity of form fields that match the mongoose errors
                    angular.forEach(err.errors, function (error, field) {
                        form[field].$setValidity('mongoose', false);
                        $scope.errors[field] = error.type;
                    });
                    $scope.isLoad = false;
                    if (err.errorid == 'ccerror') {
                        $scope.open(5);
                        $scope.step = 2;
                        $scope.step2form.ccnumber.$invalid = true;
                        $scope.step2form.ccnumber.$valid = false;
                        $scope.step2form.ccnumber.$error.validate = true;
                    }
                    if (err.data) {
                        if (err.data.errorid == 'ccerror') {
                            $scope.open(5);
                            $scope.step = 2;
                            $scope.step2form.ccnumber.$invalid = true;
                            $scope.step2form.ccnumber.$valid = false;
                            $scope.step2form.ccnumber.$error.validate = true;
                        }
                    } if (err.code) {
                        $scope.open(5);
                        $scope.step = 2;
                        $scope.step2form.ccnumber.$invalid = true;
                        $scope.step2form.ccnumber.$valid = false;
                        $scope.step2form.ccnumber.$error.validate = true;
                    }
                });
        };

        $scope.changecountry = function (code) {
            debugger;

            if (code.country == 'US') {

                code.isUS = true;
            } else {
                code.isUS = false;
            }

        };

        $scope.validateform2 = function (step2form) {
            debugger;

            $scope.submitted = true;
            $scope.sectionValidate = true;

            if (!$scope.step2form.zipcode.$valid) {
                return false;
            }

            if (step2form.$valid && $scope.valid_credit_card($scope.practice.creditcardnumber)) {

                if ($scope.checkCCValid == false) {
                    $scope.sectionValidate = false;
                }
                if ($scope.sectionValidate == false) {
                    $scope.step = 2;
                } else {

                    $scope.step = 3;
                    $scope.submitted = false;
                }
            }
        }

        $scope.validateform1 = function (step1form) {
            if ($scope.practice.password != $scope.practice.confirmpassword) {
                return false;
            }
            $scope.submitted = true;
            $scope.sectionValidate = true;
            debugger;
            if (step1form.$valid) {

                if ($scope.uniquePracticename == true) {
                    $scope.sectionValidate = false;
                }

                if($scope.UniqueemailId == true) {
                  $scope.sectionValidate = false;
                }

                if ($scope.Uniqueuser == true) {
                    $scope.sectionValidate = false;
                }

                if ($scope.StrongPassmess == true) {
                    $scope.sectionValidate = false;
                }

                if ($scope.MatchedPass == true) {
                    $scope.sectionValidate = false;
                }

                if ($scope.PracticeAddress == true) {
                    $scope.sectionValidate = false;
                }
                if ($scope.sectionValidate == false) {
                    $scope.step = 1;
                }
                else {
                    $scope.step = 2;
                    $scope.submitted = false;
                }
            }
            else {
                $scope.practice.practiceaddress;
                debugger;
                if (!$scope.practice.practiceaddress[0].StreetAddress)
                    $scope.showstreetmessage = true;
                else
                    $scope.showstreetmessage = false;
                if (!$scope.practice.practiceaddress[0].county)
                    $scope.showcountymessage = true;
                else
                    $scope.showcountymessage = false;
                if (!$scope.practice.practiceaddress[0].city)
                    $scope.showcitymessage = true;
                else
                    $scope.showcitymessage = false;
                /*if (!$scope.practice.practiceaddress[0].state)
                    $scope.showstatemessage = true;
                else
                    $scope.showstatemessage = false;*/
                if (!$scope.practice.practiceaddress[0].zipcode)
                    $scope.showzipcodemessage = true;
                else
                    $scope.showzipcodemessage = false;
                debugger;
            }
        };

        $scope.validateform3 = function (step3form, practiceProfession) {
            debugger;
            $scope.submitted = true;
            $scope.sectionValidate = true;
            if ($scope.practice.accounttype != 'provider') {
                practiceProfession.length = 1;
            }
            if (practiceProfession.length > 0) {
                $scope.isDisabled = false;
            }
            else {
                $scope.isDisabled = true;
            }
            if (step3form.$valid) {
                debugger;
                if (practiceProfession.length > 0) {
                    $scope.isDisabled = false;
                    $scope.register(myform);
                }
                else {
                    $scope.isDisabled = true;
                }
            }
        };

        $scope.firstalphabetCheck = function (licensenumber) {
            debugger;
            if (licensenumber.length == '1') {
                var regex = /[^a-zA-Z]g/;
                var result = licensenumber.replace(/[^a-zA-Z._]/g, '');
                if (!result)
                    return false;
            }
        };
        $scope.UniquePracticeName = function (practicename) {

            $scope.practicename = practicename;
            var query = { practiceName: practicename }
            if (practicename) {
                PracticesUnique.UniqueName().get(query, function (result) {
                    if (result[0] == 't') {
                        $scope.uniquePracticename = false;
                    }
                    else {
                        $scope.uniquePracticename = true;
                    }
                });
            }
        };

        $scope.validatePassword = function (password) {

            var p = password;
            var errors = [];
            if (p.length < 8) {
                errors.push("Your password must be at least 8 characters.")
            }
            if (p.search(/[A-Z]/) < 0) {
                errors.push("Your password must contain at least one Capital letter.")
            }
            if (p.search(/[a-z]/) < 0) {
                errors.push("Your password must contain at least one Small letter.")
            }
            if (p.search(/[$&+,:;=?@#|'<>.^*()%!-]/) < 0) {
                errors.push("Your password must contain at least one Special Character.")
            }
            if (p.search(/[0-9]/) < 0) {
                errors.push("Your password must contain at least one digit.")
            }
            if (errors.length > 0) {
                $scope.StrongPassmess = true;
            }
            else {
                $scope.StrongPassmess = false;
            }
        };

        $scope.matchpassword = function (pass, cpass) {
            var pass = pass;
            var cpass = cpass;
            if (cpass) {
                if (pass == cpass) {
                    $scope.MatchedPass = false;

                }
                else {
                    $scope.MatchedPass = true;
                }
            }
        };

        $scope.showSections = function (item) {
            if (item == 'section1') {
                $scope.section1 = true;
                $scope.section2 = true;
               
            }
            if (item == 'sectionNext') {
                $scope.section3 = true;
                $scope.section2 = false;
            }
            if (item == 'previousSection1') {
                $scope.section1 = false;
                $scope.section2 = false;
                $scope.section3 = false;
            }
            if (item == 'previousSection2') {
                $scope.section2 = true;
                $scope.section3 = false;
            }
        };
        //For salesperson list
        $scope.salespersonList = function () {

            SalespersonList.query(function (salespersons) {
               
                $scope.salespersons = salespersons[0].salespersons;
            });

            if ($scope.salespersons == 0) {
                $scope.practice.salesperson = 'No';
            }
        };

        //For states list

        $scope.statesList = function () {
            StatesList.query(function (states) {
                $scope.states = states;
            });
        };

        //For Security Question list

        $scope.questionsList = function () {
            QuestionsList.query(function (questions) {
                $scope.questions = questions;
            });
        };
        //For Specialities

        $scope.addProfession = function (id, operation) {

            if (operation == 'add') {
                $scope.practice.profession.push(id);
            } else {
                var i = $scope.practice.profession.indexOf(id);
                if (i != -1) {
                    $scope.practice.profession.splice(i, 1);
                }
            }
						
            $scope.checkProfessiononOtherCheckbox();
        };
		
		$scope.checkProfessiononOtherCheckbox=function(){
			 if(typeof $scope.practice !='undefined'){
				if(typeof $scope.practice.profession !='undefined'){
					if(typeof $scope.practice.profession.other !='undefined'){
						if ($scope.practice.profession.length > 3 && $scope.practice.profession.other) {
							  $scope.isDisabledOnProfession = true;               				
						   }else if($scope.practice.profession.length > 4 && !$scope.practice.profession.other) {
							$scope.isDisabledOnProfession = true;               				
						   }
						   else {
							$scope.isDisabledOnProfession = false;
						   }
					   }else if(typeof $scope.practice.profession.other =='undefined'){
						if ($scope.practice.profession.length > 4) {
							$scope.isDisabledOnProfession = true;                               
						   }
						   else {
							$scope.isDisabledOnProfession = false;
						   }
					   }
				   }            	
			   }
        }


        $scope.removeProfession = function (proffesion) {

            var i = $scope.practice.profession.indexOf(proffesion);
            if (i != -1) {
                $scope.practice.profession.splice(i, 1);
            }

        };

        $scope.specialitiesList = function (id) {
            debugger;
            SpecialitiesList.query(function (specialities) {
                debugger;
                $scope.specialities = specialities;
            });

        };

        $scope.filterAlreadyAdded = function (id) {

            //$scope.specialitiesList();
        };
        $scope.specialitiesList();

        //For add another speciality
        $scope.addSpeciality = function () {
            debugger;
            if ($scope.practice.speciality.length > 0) {
                if ($scope.practice.speciality[$scope.practice.speciality.length - 1].boardcertified && $scope.practice.speciality[$scope.practice.speciality.length - 1].name) {
                    $scope.practice.speciality.push({ 'name': '', 'boardcertified': '' });
                }
            } else {
                $scope.practice.speciality.push({ 'name': '', 'boardcertified': '' });
            }
        }

        $scope.removespeciality = function (id) {

            var i = $scope.practice.speciality.indexOf(id);
            if (i != -1) {
                $scope.practice.speciality.splice(i, 1);
            }
        }
        $scope.Isdisabledropdown = function (id) {

            $scope.disableDrop = true;
        }

        $scope.UniqueEmail = function (email) {
            $scope.email = email;
            var query = { email: email }
            if (email) {
                UsersUnique.uniqueemail().get(query, function (result) {
                    if (result[0] == 't') {
                        $scope.UniqueemailId = false;
                    }
                    else {
                        $scope.UniqueemailId = true;
                    }
                });
            }
        }

        $scope.UniqueUsername = function (username) {
            $scope.username = username;
            var query = { username: username }
            if (username) {
                UsersUnique.uniqueusername().get(query, function (result) {
                    if (result[0] == 't') {
                        $scope.Uniqueuser = false;
                    }
                    else {
                        $scope.Uniqueuser = true;
                    }
                });
            }
        }

        $scope.creditcard = function (response) {
           
            var result = document.getElementById("creditCardValid").value;

            if (result == "Valid Credit Card") {
                $scope.checkCCValid = true;

            }
            else {
                $scope.checkCCValid = false;
            }
        }

        $scope.addTodo = function (street, county, city, state, zip) {

          
            $scope.practice.address.push({ street: street, county: county, city: city, state: state, zip: zip });
            $scope.practice.StreetAddress = '';
            $scope.practice.County = '';
            $scope.practice.City = '';
            $scope.practice.stateSelected = '';
            $scope.practice.zipcode = '';
            $scope.PracticeAddShow = true;           
        };


        $scope.addToAddress = function () {            
            $scope.submitted = false;
            $scope.practice.practiceaddress.push({ street: '', county: '', city: '', state: '', zip: '', isUS: true, country: 'US' });
			
			//added by shridhar :  to disable "add another button" when practice addess not fully entered
        	$scope.practiceaddressValidation=false;
        }
		
        $scope.removeAddress = function (id) {
            var i = $scope.practice.practiceaddress.indexOf(id);
            if (i != -1) {
                $scope.practice.practiceaddress.splice(i, 1);
            }
			
			//added by shridhar :  to disable "add another button" when practice addess not fully entered
        	$scope.checkAddressValidation();
        };
		
		$scope.checkAddressValidation= function(){
        	//added by shridhar :  to disable "add another button" wnen practice addess not fully entered        	
        	$scope.practiceaddressValidation=true;
        	for(var i=0; i< $scope.practice.practiceaddress.length; i++){
        		if (!$scope.practice.practiceaddress[i].street || !$scope.practice.practiceaddress[i].county || !$scope.practice.practiceaddress[i].city || !$scope.practice.practiceaddress[i].state || !$scope.practice.practiceaddress[i].zipcode){        		        			
        			$scope.practiceaddressValidation=false;
        		}
        	}        	        	
        }

        $scope.validationMessage = function (category, modelvalue) {
            switch (category) {
                case 'street':
                    if (modelvalue)
                        $scope.showstreetmessage = false;
                    break;
                case 'county':
                    if (modelvalue)
                        $scope.showcountymessage = false;
                    break;
                case 'city':
                    if (modelvalue)
                        $scope.showcitymessage = false;
                    break;
                case 'state':
                    if (modelvalue)
                        $scope.showstatemessage = false;
                    break;
                case 'zipcode':
                    if (modelvalue)
                        $scope.showzipcodemessage = false;
                    break;
            }
        }

        $scope.archive = function () {
            var selectedAdd = $scope.practice.address;
            $scope.practice.address = [];
            angular.forEach(selectedAdd, function () {

            });
        }

        $scope.salespersonList = function () {
            SalespersonAllList.query(function (salespersons) {
                $scope.salespersons = salespersons[0].salespersons;
                
            });
        };

        $scope.open = function (type) {
            debugger;
            var template = '';
            debugger;
            if (type == 1 || type == 4 || type == 13) {
                template = 'partials/providerpopup.html';
            }
            else if (type == 2) {
                template = 'partials/certifyrating.html';
            } else if (type == 3) {
                template = 'partials/providerpopup.html';
            } else if (type == 5) {
                template = 'partials/ccvalidationerror.html';
            }	
			else if (type == 6) {
            	 template = 'partials/providerpopup.html';
            }			
            var modalInstance = $modal.open({
                templateUrl: template,
                controller: 'signPopupCtrl',
                resolve: {
                    type: function () {
                        return type;
                    }
                }
            });
        };

    })
    .controller('signPopupCtrl', function ($scope, $modalInstance, type) {

        $scope.popuptype = type;
        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });