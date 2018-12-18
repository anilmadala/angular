(function () {
    var copyObjectToScope;
    var checkConsoleTime = true;

    copyObjectToScope = function (object, scope) {

        /*
        Copy object (ng-repeat="object in objects") to scope without `hashKey`.
         */
        var key, value;
        for (key in object) {
            value = object[key];
            if (key !== '$$hashKey') {
                scope[key] = value;
            }
        }
    };

    angular.module('builder.controller', ['builder.provider']).controller('fbFormObjectEditableController', [
      '$scope', '$injector', function ($scope, $injector) {
          var $builder;
          $builder = $injector.get('$builder');


          $scope.setupScope = function (formObject) {

              /*
              1. Copy origin formObject (ng-repeat="object in formObjects") to scope.
              2. Setup optionsText with formObject.options.
              3. Watch scope.label, .description, .placeholder, .required, .options then copy to origin formObject.
              4. Watch scope.optionsText then convert to scope.options.
              5. setup validationOptions
              */

              var component;
              copyObjectToScope(formObject, $scope);
              $scope.optionsText = formObject.options.join('\n');
              //var unbindFunction = 
			  $scope.$watch('[label, description, placeholder, required, inline, options, validation, condition, disablecondition, maxlength, uniqueid, inputclass, labelclass, validatorcondition, validatorset, blurvalidatorcondition, watchvalidatorcondition, blurvalidatorset, watchvalidatorset,validationevents, mainclass, onkeypress, textareatext, ispopup, checkboxclass, popuplable, uimasking, validatoruniqueid, numberonly, numbercharonly, charonly, futuredate, displaycalculation, ngchangecondition, rangefrom, rangeto, alertmessage]', function () {
                  formObject.label = $scope.label;
                  formObject.description = $scope.description;
                  formObject.placeholder = $scope.placeholder;
                  formObject.validationevents = $scope.validationevents;
                  formObject.required = $scope.required;
                  formObject.numberonly = $scope.numberonly;
                  formObject.numbercharonly = $scope.numbercharonly;
                  formObject.charonly = $scope.charonly;
                  formObject.futuredate = $scope.futuredate;
                  formObject.inline = $scope.inline;
                  formObject.mainclass = $scope.mainclass;
                  formObject.inputclass = $scope.inputclass;
                  formObject.labelclass = $scope.labelclass;
                  formObject.onkeypress = $scope.onkeypress;
                  formObject.condition = $scope.condition;
                  formObject.disablecondition = $scope.disablecondition;
                  formObject.maxlength = $scope.maxlength;
                  formObject.textareatext = $scope.textareatext;
                  formObject.uniqueid = $scope.uniqueid;
                  formObject.validatorcondition = $scope.validatorcondition;
                  formObject.validatorset = $scope.validatorset;
                  formObject.isblur = $scope.isblur;
                  formObject.iswatch = $scope.iswatch;
                  formObject.blurvalidatorcondition = $scope.blurvalidatorcondition;
                  formObject.watchvalidatorcondition = $scope.watchvalidatorcondition;
                  formObject.blurvalidatorset = $scope.blurvalidatorset;
                  formObject.watchvalidatorset = $scope.watchvalidatorset;
                  formObject.options = $scope.options;
                  formObject.ispopup = $scope.ispopup;
                  formObject.checkboxclass = $scope.checkboxclass;
                  formObject.popuplable = $scope.popuplable;
                  formObject.uimasking = $scope.uimasking;
                  formObject.validatoruniqueid = $scope.validatoruniqueid;
                  formObject.displaycalculation = $scope.displaycalculation;
                  formObject.ngchangecondition = $scope.ngchangecondition;
                  formObject.rangefrom = $scope.rangefrom;
                  formObject.rangeto = $scope.rangeto;
                  formObject.alertmessage = $scope.alertmessage;
                  return formObject.validation = $scope.validation;
              }, true);
			  
			  //Unbinding by Unais
			  /*scope.$on('$destroy', function(){
				alert('Inside destroy');
				unbindFunction();
			  })*/
			  
              $scope.$watch('optionsText', function (text) {
                  var x;
                  $scope.options = (function () {
                      var _i, _len, _ref, _results;
                      _ref = text.split('\n');
                      _results = [];
                      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                          x = _ref[_i];
                          if (x.length > 0) {
                              _results.push(x);
                          }
                      }
                      return _results;
                  })();
                  return $scope.inputText = $scope.options[0];
              });
              component = $builder.components[formObject.component];
              if (component.validationOptions) {
                  debugger;
                  return $scope.validationOptions = component.validationOptions;
              }
          };
          return $scope.data = {
              model: null,
              backup: function () {

                  /*
                  Backup input value.
                   */
                  return this.model = {
                      label: $scope.label,
                      description: $scope.description,
                      placeholder: $scope.placeholder,
                      validationevents: $scope.validationevents,
                      required: $scope.required,
                      numberonly: $scope.numberonly,
                      numbercharonly: $scope.numbercharonly,
                      charonly: $scope.charonly,
                      futuredate: $scope.futuredate,
                      inline: $scope.inline,
                      mainclass: $scope.mainclass,
                      inputclass: $scope.inputclass,
                      labelclass: $scope.labelclass,
                      onkeypress: $scope.onkeypress,
                      textareatext: $scope.textareatext,
                      condition: $scope.condition,
                      disablecondition: $scope.disablecondition,
                      maxlength: $scope.maxlength,
                      uniqueid: $scope.uniqueid,
                      validatorcondition: $scope.validatorcondition,
                      validatorset: $scope.validatorset,
                      isblur: $scope.isblur,
                      iswatch: $scope.iswatch,
                      blurvalidatorcondition: $scope.blurvalidatorcondition,
                      blurvalidatorset: $scope.blurvalidatorset,
                      watchvalidatorcondition: $scope.watchvalidatorcondition,
                      watchvalidatorset: $scope.watchvalidatorset,
                      optionsText: $scope.optionsText,
                      ispopup: $scope.ispopup,
                      checkboxclass: $scope.checkboxclass,
                      popuplable: $scope.popuplable,
                      uimasking: $scope.uimasking,
                      validatoruniqueid: $scope.validatoruniqueid,
                      displaycalculation: $scope.displaycalculation,
                      ngchangecondition: $scope.ngchangecondition,
                      rangefrom: $scope.rangefrom,
                      rangeto: $scope.rangeto,
                      alertmessage: $scope.alertmessage,
                      validation: $scope.validation
                  };
              },
              rollback: function () {

                  /*
                  Rollback input value.
                   */
                  if (!this.model) {
                      return;
                  }
                  $scope.label = this.model.label;
                  $scope.description = this.model.description;
                  $scope.placeholder = this.model.placeholder;
                  $scope.validationevents = this.model.validationevents;
                  $scope.required = this.model.required;
                  $scope.numberonly = this.model.numberonly;
                  $scope.numbercharonly = this.model.numbercharonly;
                  $scope.charonly = this.model.charonly;
                  $scope.futuredate = this.model.futuredate;
                  $scope.inline = this.model.inline;
                  $scope.mainclass = this.model.mainclass;
                  $scope.inputclass = this.model.inputclass;
                  $scope.labelclass = this.model.labelclass;
                  $scope.onkeypress = this.model.onkeypress;
                  $scope.textareatext = this.model.textareatext;
                  $scope.condition = this.model.condition;
                  $scope.disablecondition = this.model.disablecondition;
                  $scope.maxlength = this.model.maxlength;
                  $scope.uniqueid = this.model.uniqueid;
                  $scope.validatorcondition = this.model.validatorcondition;
                  $scope.validatorset = this.model.validatorset;
                  $scope.isblur = this.model.isblur;
                  $scope.iswatch = this.model.iswatch;
                  $scope.blurvalidatorcondition = this.model.blurvalidatorcondition;
                  $scope.blurvalidatorset = this.model.blurvalidatorset;
                  $scope.watchvalidatorcondition = this.model.watchvalidatorcondition;
                  $scope.watchvalidatorset = this.model.watchvalidatorset;
                  $scope.optionsText = this.model.optionsText;
                  $scope.ispopup = this.model.ispopup;
                  $scope.checkboxclass = this.model.checkboxclass;
                  $scope.popuplable = this.model.popuplable;
                  $scope.uimasking = this.model.uimasking;
                  $scope.validatoruniqueid = this.model.validatoruniqueid;
                  $scope.displaycalculation = this.model.displaycalculation;
                  $scope.ngchangecondition = this.model.ngchangecondition;
                  $scope.rangefrom = this.model.rangefrom;
                  $scope.rangeto = this.model.rangeto;
                  $scope.alertmessage = this.model.alertmessage;
                  return $scope.validation = this.model.validation;
              }
          };
      }
    ]).controller('fbComponentsController', [
      '$scope', '$injector', function ($scope, $injector) {
          var $builder;
          $builder = $injector.get('$builder');
          $scope.selectGroup = function ($event, group) {
              var component, name, _ref, _results;
              if ($event != null) {
                  $event.preventDefault();
              }
              $scope.activeGroup = group;
              $scope.components = [];
              _ref = $builder.components;
              _results = [];
              for (name in _ref) {
                  component = _ref[name];
                  if (component.group === group) {
                      _results.push($scope.components.push(component));
                  }
              }
              return _results;
          };
          $scope.groups = $builder.groups;
          $scope.activeGroup = $scope.groups[0];
          $scope.allComponents = $builder.components;
          return $scope.$watch('allComponents', function () {
              return $scope.selectGroup(null, $scope.activeGroup);
          });
      }
    ]).controller('fbComponentController', [
      '$scope', function ($scope) {
          return $scope.copyObjectToScope = function (object) {
              return copyObjectToScope(object, $scope);
          };
      }
    ]).controller('fbFormController', [
      '$scope', '$injector', '$rootScope', '$http', '$cookies', '$cookieStore', '$filter', 'getdatafromAPI', 'getdataClinic', 'UsersList', 'CountriesList', 'Injuries', function ($scope, $injector, $rootScope, $http, $cookies, $cookieStore, $filter, getdatafromAPI, getdataClinic, CountriesList, Injuries, UsersList) {
          var $builder;
          $builder = $injector.get('$builder');
          $scope.sectionid = $scope.formName;
          $scope.radio = 'radio';
          $scope.report = $rootScope.report;
          var replaceValue = [' ', '-', '_'];
          if (!$scope.categories) {
              $scope.categories = new Array();
          }
		  
		  $scope.isAthena = false;
		  $scope.isAthena = $rootScope.currentUser.practiceDetails.isAthena;

          $scope.getClaimadmin = function (value) {
              debugger;
              var query = { value: value }
              Injuries.getclaimadminsdataformbuilder().query(value, function (res) {
                  $scope.claimoptions = res[0];
                  debugger;
              });
          };

          $scope.validator = function () {
              alert('Triggered');
          }

          $scope.textfieldKeypress = function (id) {
              debugger;
              if (id) {
                  var p = $scope.categories.indexOf(id);
                  if ($scope.categories.indexOf(id) == -1) {
                      $scope.categories.push(id);
                  }
                  if ($scope.categories.length > 0)
                      $cookieStore.put('selectedCategories', $scope.categories);
              }
          };

          //$scope.formatZip = function (modal) {
          //    debugger;
          //    var value = $scope.$eval(modal).length;
          //    if (modal.length > 5) {
          //        var zipcodeFirst = modal.slice(0, 5);
          //        var zipcodeLast = modal.slice(5, 9);
          //        var alreadyExist = modal.split('-');
          //        debugger;
          //        if (!alreadyExist[1]) {
          //            if (modal.length > 5) {
          //                var zipcodeArray = modal.slice(0, 5) + '-' + modal.slice(5, 9);
          //                var execute = modal + "='" + zipcodeArray + "'";
          //                eval('$scope.injurydata.employeraddress[0].emp_zipcode = zipcodeArray');
          //                $scope.injurydata.employeraddress[0].emp_zipcode;
          //            }
          //        }
          //        else {
          //            eval('$scope.injurydata.employeraddress[0].emp_zipcode = modal');
          //        }
          //    }
          //};

          //$scope.getdataApi = function (api) {
          //    debugger;
          //    $scope.currentUserid = $rootScope.currentUser.id;
          //    $scope.currentUserlevel = $rootScope.currentUser.role;
          //    $scope.currentUserName = $rootScope.currentUser.practicename;
          //    $scope.api = api;
          //    getdatafromAPI.query({ currentuserid: $scope.currentUserlevel, currentusername: $scope.currentUserName }, function (response) {
          //        if (response[0]) {
          //            $scope.practices = response[0].userList;
          //        }
          //    });
          //}

          $scope.getProfession = function (data, otherprof) {
              if (data) {
                  var ret_text = '';

				  if(typeof data!='undefined')
				  {		
					  if(data!=null)	
					  {						  
						  if (data.length == 1) {
							  if (data[0] != 'other') {								  
								  if(data[0]!= null && data[0]!= "" ){
									  ret_text = data[0].toUpperCase();  
								 }						  
							  } else {
								  if (otherprof) {
									  ret_text = otherprof;
								  }
							  }
						  }
						  if (data.length > 1) {
							  for (var k = 0; k < data.length; k++) {

								  if (data[k]) {
									  if (k == data.length - 1) {
										  
										  if (data[k] != 'other') {
											  if(data[k]!= null && data[k]!= "" ){
												  ret_text = ret_text + data[k].toUpperCase();
											  }											  
										  } else {
											  if (otherprof) {
												  ret_text = ret_text + otherprof;
											  }
										  }

									  }
									  if (k != data.length - 1) {
										  if (data[k] != 'other') {
											  if(data[k]!= null && data[k]!= "" ){
												ret_text = ret_text + data[k].toUpperCase() + ', ';
											  }
										  } else {
											  if (otherprof) {
												  ret_text = ret_text + otherprof + ', ';
											  }
										  }
									  }
								  }
							  }
						  }
					  }		
				  }
                  return ret_text;
              }

          };

          $scope.getdataApi = function () {
			  
			   if(typeof $rootScope.apidataTreatingPhysician != 'undefined')
        	  {        		  
        		  if($rootScope.apidataTreatingPhysician.length!=0){
            		  $scope.practices = $rootScope.apidataTreatingPhysician;
        		  }
				  else
				  {        			  	
        				delete $rootScope.apidataTreatingPhysician;
        		  }
        	  }
			                
              $scope.currentUserid = $rootScope.currentUser.id;
              $scope.currentUserlevel = $rootScope.currentUser.role;
              $scope.currentUsername = $rootScope.currentUser.practicename;
              if ($rootScope.existingReportPracticeName) {
                  var getCurrentUserName = $rootScope.existingReportPracticeName;
              } else {
                  var getCurrentUserName = $rootScope.currentUser.practicename;
              }

              /*getdatafromAPI.query({ 'currentuserid': getCurrentUserName, 'currentuserlevel': $scope.currentUserlevel }, function (response) {
                  if (response[0]) {
                      $scope.practices = response[0].userList;
                      debugger;
                  }
              });*/
			  
			   if(typeof $rootScope.apidataTreatingPhysician != 'undefined')
	        	  {	        		 
	        		  $scope.practices = $rootScope.apidataTreatingPhysician;  
	        	  }
				  else
				  {                  	  
					  getdatafromAPI.query({ 'currentuserid': getCurrentUserName, 'currentuserlevel': $scope.currentUserlevel }, function (response) {
						  if (response[0]) {
							  $scope.practices = response[0].userList;
							  $rootScope.apidataTreatingPhysician=response[0].userList;
							  debugger;
						  }
					  });
              }
          }

          //Dropdown values of all clinic location of a practice account
          $scope.allcliniclocation = $rootScope.allcliniclocation;
		  
		  $scope.funGetlocationSelected=function(getcliniclocation){                  
        	  var clinicLocationIDdata;			  	
			  if(!$rootScope.report.data.patientcomplaints.cliniclocationobj)
			  {				 
				  return true;
			  }
			  else
			  {
				clinicLocationIDdata=$rootScope.report.data.patientcomplaints.cliniclocationobj;		  
				if(getcliniclocation._id==clinicLocationIDdata._id){
            	  return true;
				}              
				else
				{				  
				  return false;
				}  
			  }               
          }
		   
		   $scope.watchcliniclocation = function (currentselection,isInitialized) {
              try
			  {
            	  if(typeof isInitialized=='undefined'){
                      isInitialized=false;
              }                  
        	  
			  var currentIndex=0;
              /**
                * Code to save clinical location in object
                */
               if ($rootScope.allcliniclocation.length > 0) {
                   var i = 0;
                   var len = $rootScope.allcliniclocation.length;
                   for (i = 0; i < len; i++) {
                       var getcliniclocation = $rootScope.allcliniclocation[i];
                       var currentloc = getcliniclocation.county + ', ' + getcliniclocation.street + ', ' + getcliniclocation.city + ', ' + getcliniclocation.zipcode + ', ' + getcliniclocation.state + ', ' + getcliniclocation.country;
                       if (currentloc == currentselection) {
                           currentIndex= i;
                       }
                   }
               }               
			  if(typeof $rootScope.allcliniclocation[currentIndex].phonenumber != 'undefined'){
                  if($scope.report.data.patientcomplaints.subjectivecomplaints_contactphonenumber==''){
                    $scope.report.data.patientcomplaints.subjectivecomplaints_contactphonenumber=$rootScope.allcliniclocation[currentIndex].phonenumber;   
                  }
                   if(isInitialized==false){
                    $scope.report.data.patientcomplaints.subjectivecomplaints_contactphonenumber=$rootScope.allcliniclocation[currentIndex].phonenumber;   
                  }
            	   
               }
               if(typeof $rootScope.allcliniclocation[currentIndex].extension != 'undefined'){
            	   if($scope.report.data.patientcomplaints.subjectivecomplaints_extension==''){
                        $scope.report.data.patientcomplaints.subjectivecomplaints_extension=$rootScope.allcliniclocation[currentIndex].extension;
                   }
                if(isInitialized==false){
                     $scope.report.data.patientcomplaints.subjectivecomplaints_extension=$rootScope.allcliniclocation[currentIndex].extension;
                  }
               }
               if(typeof $rootScope.allcliniclocation[currentIndex].faxnumber != 'undefined'){
            	   if($scope.report.data.patientcomplaints.subjectivecomplaints_fax==''){
                     $scope.report.data.patientcomplaints.subjectivecomplaints_fax=$rootScope.allcliniclocation[currentIndex].faxnumber;
                   }
                   if(isInitialized==false){
                     $scope.report.data.patientcomplaints.subjectivecomplaints_fax=$rootScope.allcliniclocation[currentIndex].faxnumber;
                  }
                   
               }               
                             
               $("input[name='subjectivecomplaints_contactphonenumber']").val($scope.report.data.patientcomplaints.subjectivecomplaints_contactphonenumber);
               $("input[name='subjectivecomplaints_extension']").val($scope.report.data.patientcomplaints.subjectivecomplaints_extension);
               $("input[name='subjectivecomplaints_fax']").val($scope.report.data.patientcomplaints.subjectivecomplaints_fax);	
              
              }catch(err){
            	  //console.log(err);
              }
          }
		  
		   try{
			  $scope.watchcliniclocation($scope.report.data.patientcomplaints.cliniclocation,true);
			}catch(err){
					  //console.log(err);
			}
		  
		  $scope.getClinicFax = function (fax) {
	           if(typeof fax=='undefined')
        		  //return $rootScope.practicefaxnumber;
					return  $scope.report.data.patientcomplaints.subjectivecomplaints_fax;
        	  else 
        		  return fax;
          };
		  
		  $scope.getClinicBillingTelephone = function (Telephone) {
	          //return $rootScope.billingTelephonenumber;
              return  $scope.report.data.patientcomplaints.subjectivecomplaints_contactphonenumber;
          };
          $scope.getClinicBillingExtension = function (gextension) {
	         // return $rootScope.billingExtension;
	          return  $scope.report.data.patientcomplaints.subjectivecomplaints_extension;
          };

          $scope.getdataClinic = function (api) {
              debugger;
              $scope.currentUsername = $rootScope.currentUser.practicename;
              $scope.api = api;
              getdataClinic.query({ currentusername: $scope.currentUsername }, function (response) {
                  debugger;
                  if (response[0]) {
                      $scope.cliniclocations = response[0].clinicLocation[0].practiceaddress;
                  }
              });
          }

          $scope.getLocation = function (val) {
              debugger;
              return $http.get('/api/getclaimadmin', {
                  params: {
                      q: val,
                      sensor: false
                  }
              }).then(function (res) {
                  debugger;
                  var addresses = [];
                  angular.forEach(res.data, function (item) {
                      addresses.push(item.text);
                  });
                  debugger;
                  return addresses;
              });
          };

          $scope.countriesList = function () {
              debugger;
              CountriesList.query(function (countries) {
                  $scope.countries = countries;
              });
          };

          $scope.changecountry = function (code) {
              debugger;
              code.state = '';
              if (code.country == 'US') {

                  code.isUS = true;
              } else {
                  code.isUS = false;
              }

          };

          $scope.select = function () {
              debugger;
              $rootScope.currentUser;
              if ($rootScope.currentUser.level) {
                  if ($rootScope.currentUser.level == 'level4' || $rootScope.currentUser.level == 'level3') {
                      return true;
                  }
              }
              if ($rootScope.currentUser.rolename == 'superadmin' || $rootScope.currentUser.rolename == 'siteadmin') {                  
                  return true;
              }
          };

          if ($scope.input == null) {
              $scope.input = [];
          }
          return $scope.$watch('form', function () {
              if ($scope.input.length > $scope.form.length) {
                  $scope.input.splice($scope.form.length);
              }
              $scope.$broadcast($builder.broadcastChannel.updateInput);
              return console.log;
          }, true);
      }
    ]).controller('fbFormObjectController', ['$scope', '$injector', '$filter', function ($scope, $injector, $filter) {

        var $builder, $rootScope, report, $filter;
        $builder = $injector.get('$builder');
        $rootScope = $injector.get('$rootScope');
        $scope.report = $rootScope.report;
        //debugger;

        if (checkConsoleTime) {

        }
        $scope.showhide = function (condition) {
			
            if (condition == "$rootScope.populatedata == ''") {
                              
            }
            if (condition) {
                if (condition == "currentUser.level=='level2'") {
                    return $rootScope.$eval(condition);
                }
                else {
                    return $scope.$eval(condition);
                }
            }
            else {
                return false;
            }            
            var data = $scope.$eval(condition);
        };

        $scope.tinymceOptions = {
            resize: false,
            menubar: false,
            plugins: 'searchreplace',
            browser_spellcheck: true,
            contextmenu: false,
            toolbar: "bold italic underline",
            theme_advanced_buttons3_add: "search,replace"
        };		

        $scope.tinymceOptions1 = {
            resize: false,
            menubar: false,
            plugins: 'searchreplace',
            height: 300,
            browser_spellcheck: true,
            contextmenu: false,
            toolbar: "bold italic underline",
            theme_advanced_buttons3_add: "search,replace"
        };

        $scope.impairmentRatingCal = function (concateId) {
            var a = 0, b = 0;
            if ($scope.report.data['impairmentrating' + concateId]) {
                if ($scope.report.data['impairmentrating' + concateId].txtAlmaraz) {
                    if ($scope.report.data['impairmentrating' + concateId].txtAlmaraz == '')
                        a = 0;
                    else
                        a = parseInt($scope.report.data['impairmentrating' + concateId].txtAlmaraz);
                }
                if ($scope.report.data['impairmentrating' + concateId].txtAlmarazWPI) {
                    if ($scope.report.data['impairmentrating' + concateId].txtAlmarazWPI == '')
                        b = 0;
                    else
                        b = parseInt($scope.report.data['impairmentrating' + concateId].txtAlmarazWPI);
                }
            }
            return (a + b).toString() + '%';
        };

        $scope.clickfunction = function (optionData) {
            $scope.optionsData = $scope.report.data[optionData]['chkCurrentMedicationOptions'];
        };

        $scope.pcmedicationchildcheckboxes = function (option) {

            var returnValue = false;
            if (option) {
                for (var i = 0; i < $scope.report.data['selectinjuries'].sibodypart.length; i++) {
                    if ($scope.report.data['selectinjuries'].sibodypart[i].id != 'other') {
                        if ($scope.report.data['selectinjuries'].sibodypart[i].bdsides != 'none') {
                            $scope.allsectionIds = 'patientcomplaints' + $scope.report.data['selectinjuries'].sibodypart[i].id + $scope.report.data['selectinjuries'].sibodypart[i].bdsides;
                            if ($scope.allsectionIds != $scope.$parent.sectionid) {
                                if ($scope.report.data[$scope.allsectionIds]) {
                                    if ($scope.report.data[$scope.allsectionIds][option]) {
                                        if ($scope.report.data[$scope.allsectionIds][option].length > 0) {

                                            return true;
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            $scope.allsectionIds = 'patientcomplaints' + $scope.report.data['selectinjuries'].sibodypart[i].id;
                            if ($scope.allsectionIds != $scope.$parent.sectionid) {
                                if ($scope.report.data[$scope.allsectionIds]) {
                                    if ($scope.report.data[$scope.allsectionIds][option]) {
                                        if ($scope.report.data[$scope.allsectionIds][option].length > 0) {

                                            return true;
                                        }

                                    }

                                }
                            }
                        }
                    } else {
                        if ($scope.report.data['selectinjuries'].sibodypart[i].bdsides != 'n/a') {
                            $scope.allsectionIds = 'patientcomplaints' + $scope.report.data['selectinjuries'].sibodypart[i].bdsystemother + $scope.report.data['selectinjuries'].sibodypart[i].bdpartother + $scope.report.data['selectinjuries'].sibodypart[i].bdsides;
                            if ($scope.allsectionIds != $scope.$parent.sectionid) {
                                if ($scope.report.data[$scope.allsectionIds]) {
                                    if ($scope.report.data[$scope.allsectionIds][option]) {
                                        if ($scope.report.data[$scope.allsectionIds][option].length > 0) {

                                            return true;
                                        }

                                    }

                                }
                            }
                        }
                        else {
                            $scope.allsectionIds = 'patientcomplaints' + $scope.report.data['selectinjuries'].sibodypart[i].bdsystemother + $scope.report.data['selectinjuries'].sibodypart[i].bdpartother;
                            if ($scope.allsectionIds != $scope.$parent.sectionid) {
                                if ($scope.report.data[$scope.allsectionIds]) {
                                    if ($scope.report.data[$scope.allsectionIds][option]) {
                                        if ($scope.report.data[$scope.allsectionIds][option].length > 0) {

                                            return true;
                                        }

                                    }

                                }
                            }
                        }
                    }
                }
                return returnValue;
            }
            return returnValue;
        };

        $scope.findbodysystem = function (data) {
            return eval("$filter('filter')($scope.report.data.selectinjuries.sibodypart, { bodysystem: data }).length == 0");
        };

        $scope.findbodypart = function (bdpart, side) {
            return eval("$filter('filter')($scope.report.data.selectinjuries.sibodypart, { id: bdpart, bdsides: side }).length == 0");
        };

        $scope.hideeffectsofmedication = function () {
            if ($scope.report) {
                if ($scope.report.data) {
                    if ($scope.report.data.selectinjuries) {
                        if ($scope.report.data.selectinjuries.concatedbodypart) {
                            for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                                var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];

                                if ($scope.report.data['patientcomplaints' + bodypart.concateId]) {
                                    if ($scope.report.data['patientcomplaints' + bodypart.concateId].chkCurrentPainQualityNoPain) {
                                        if ($scope.report.data['patientcomplaints' + bodypart.concateId].chkCurrentPainQualityNoPain.length > 0) {
                                            if ($scope.report.data['patientcomplaints' + bodypart.concateId].chkCurrentPainQualityNoPain[0] == 'No Pain/Symptoms') {
                                                if ($scope.report.data['patientcomplaints' + bodypart.concateId].totalremissionradio) {
                                                    if ($scope.report.data['patientcomplaints' + bodypart.concateId].totalremissionradio == 'Yes') {
                                                        return false;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return true;
        };


        $scope.evalauteCondition = function (data) {
            return eval(data);
        };

        $scope.evaluateCondition = function (data) {
            return eval(data);
        };

        $scope.disable = function (disablecondition) {
            if (disablecondition == true) {
                return true;
            }
            else {
                var data = $scope.$eval(disablecondition);
                return $scope.$eval(disablecondition);
            }
        };

        $scope.copyObjectToScope = function (object) {
            return copyObjectToScope(object, $scope);
        };

        return $scope.updateInput = function (value) {

            /*
            Copy current scope.input[X] to $parent.input.
            @param value: The input value.
             */
            //var d = new Date();
            //console.log('fbFormObjectController In Time: ' + d);

            var input;
            input = {
                id: $scope.formObject.id,
                label: $scope.formObject.label,
                uniqueid: $scope.formObject.uniqueid,
                value: value != null ? value : ''
            };
            $scope.$parent.input[$scope.formObject.uniqueid] = value != null ? value : '';
            return true;           
            //return $scope.$parent.input.splice($scope.$index, 1, input);
        };
        //var d = new Date();       
    }
    ]);

}).call(this);

(function () {
    angular.module('builder.directive', ['builder.provider', 'builder.controller', 'builder.drag', 'validator']).directive('fbBuilder', [
      '$injector', function ($injector) {
          return {
              restrict: 'A',
              template: "<div class='form-horizontal'>\n    <div class='fb-form-object-editable' ng-repeat=\"object in formObjects\"\n        fb-form-object-editable=\"object\"></div>\n</div>",
              link: function (scope, element, attrs) {
                  var $builder, $drag, beginMove, _base, _name;
                  $builder = $injector.get('$builder');
                  $drag = $injector.get('$drag');
                  scope.formName = attrs.fbBuilder;
                  if ((_base = $builder.forms)[_name = scope.formName] == null) {
                      _base[_name] = [];
                  }
                  scope.formObjects = $builder.forms[scope.formName];
                  beginMove = true;
                  $(element).addClass('fb-builder');
                  return $drag.droppable($(element), {
                      move: function (e) {
                          var $empty, $formObject, $formObjects, height, index, offset, positions, _i, _j, _ref, _ref1;
                          if (beginMove) {
                              $("div.fb-form-object-editable").popover('hide');
                              beginMove = false;
                          }
                          $formObjects = $(element).find('.fb-form-object-editable:not(.empty,.dragging)');
                          if ($formObjects.length === 0) {
                              if ($(element).find('.fb-form-object-editable.empty').length === 0) {
                                  $(element).find('>div:first').append($("<div class='fb-form-object-editable empty'></div>"));
                              }
                              return;
                          }
                          positions = [];
                          positions.push(-1000);
                          for (index = _i = 0, _ref = $formObjects.length; _i < _ref; index = _i += 1) {
                              $formObject = $($formObjects[index]);
                              offset = $formObject.offset();
                              height = $formObject.height();
                              positions.push(offset.top + height / 2);
                          }
                          positions.push(positions[positions.length - 1] + 1000);
                          for (index = _j = 1, _ref1 = positions.length - 1; _j <= _ref1; index = _j += 1) {
                              if (e.pageY > positions[index - 1] && e.pageY <= positions[index]) {
                                  $(element).find('.empty').remove();
                                  $empty = $("<div class='fb-form-object-editable empty'></div>");
                                  if (index - 1 < $formObjects.length) {
                                      $empty.insertBefore($($formObjects[index - 1]));
                                  } else {
                                      $empty.insertAfter($($formObjects[index - 2]));
                                  }
                                  break;
                              }
                          }
                      },
                      out: function () {
                          if (beginMove) {
                              $("div.fb-form-object-editable").popover('hide');
                              beginMove = false;
                          }
                          return $(element).find('.empty').remove();
                      },
                      up: function (e, isHover, draggable) {
                          var formObject, newIndex, oldIndex;
                          beginMove = true;
                          if (!$drag.isMouseMoved()) {
                              $(element).find('.empty').remove();
                              return;
                          }
                          if (!isHover && draggable.mode === 'drag') {
                              formObject = draggable.object.formObject;
                              if (formObject.editable) {
                                  $builder.removeFormObject(attrs.fbBuilder, formObject.index);
                              }
                          } else if (isHover) {
                              if (draggable.mode === 'mirror') {
                                  $builder.insertFormObject(scope.formName, $(element).find('.empty').index('.fb-form-object-editable'), {
                                      component: draggable.object.componentName
                                  });
                              }
                              if (draggable.mode === 'drag') {
                                  oldIndex = draggable.object.formObject.index;
                                  newIndex = $(element).find('.empty').index('.fb-form-object-editable');
                                  if (oldIndex < newIndex) {
                                      newIndex--;
                                  }
                                  $builder.updateFormObjectIndex(scope.formName, oldIndex, newIndex);
                              }
                          }
                          return $(element).find('.empty').remove();
                      }
                  });
              }
          };
      }
    ]).directive('fbFormObjectEditable', [
      '$injector', function ($injector) {
          return {
              restrict: 'A',
              controller: 'fbFormObjectEditableController',
              link: function (scope, element, attrs) {
                  var $builder, $compile, $drag, $parse, $validator, component, formObject, popover, view;
                  $builder = $injector.get('$builder');
                  $drag = $injector.get('$drag');
                  $parse = $injector.get('$parse');
                  $compile = $injector.get('$compile');
                  $validator = $injector.get('$validator');
                  scope.inputArray = [];
                  formObject = $parse(attrs.fbFormObjectEditable)(scope);
                  component = $builder.components[formObject.component];
                  scope.setupScope(formObject);
                  
                  /* Unais' comment: Following 3 lines are written to destroy previous scope to avoid unwanted watchers */
                  /*if(scope.inheritedScope) scope.inheritedScope.$destroy();
                  scope.inheritedScope = scope.$new(false);                      
                  view = $compile(component.template)(scope.inheritedScope);*/
                  
                  
                  view = $compile(component.template)(scope);
                  $(element).append(view);
                  $(element).on('click', function () {
                      return false;
                  });
                  $drag.draggable($(element), {
                      object: {
                          formObject: formObject
                      }
                  });
                  if (!formObject.editable) {
                      return;
                  }
                  popover = {
                      id: "fb-" + (Math.random().toString().substr(2)),
                      isClickedSave: false,
                      view: null,
                      html: component.popoverTemplate
                  };
                  popover.html = $(popover.html).addClass(popover.id);
                  scope.popover = {
                      save: function ($event) {

                          /*
                          The save event of the popover.
                           */
                          $event.preventDefault();
                          $validator.validate(scope).success(function () {
                              popover.isClickedSave = true;
                              return $(element).popover('hide');
                          });
                      },
                      remove: function ($event) {
                          debugger
                          /*
                          The delete event of the popover.
                           */
                          $event.preventDefault();
                          debugger;
                          $builder.removeFormObject(scope.formName, scope.$index);
                          $(element).popover('hide');
                      },
                      shown: function () {

                          /*
                          The shown event of the popover.
                           */
                          scope.data.backup();
                          return popover.isClickedSave = false;
                      },
                      cancel: function ($event) {
                          /*
                          The cancel event of the popover.
                           */
                          scope.data.rollback();
                          if ($event) {
                              $event.preventDefault();
                              $(element).popover('hide');
                          }
                      },
                      checkvalidationEvent: function ($event) {
                          if (scope.isblur != '' && scope.iswatch != '' && scope.isblur && scope.iswatch) {
                              scope.validationevents = "onblur,onwatch";
                          } else {
                              scope.validationevents = (scope.isblur + scope.iswatch).replace('undefined', '').trim();
                          }
                      }
                  };
                  popover.view = $compile(popover.html)(scope);
                  $(element).addClass(popover.id);
                  $(element).popover({
                      html: true,
                      title: component.label,
                      content: popover.view,
                      container: 'body'
                  });
                  $(element).on('show.bs.popover', function () {
                      var $popover, elementOrigin, popoverTop;
                      if ($drag.isMouseMoved()) {
                          return false;
                      }
                      $("div.fb-form-object-editable:not(." + popover.id + ")").popover('hide');
                      $popover = $("form." + popover.id).closest('.popover');
                      if ($popover.length > 0) {
                          elementOrigin = $(element).offset().top + $(element).height() / 2;
                          popoverTop = elementOrigin - $popover.height() / 2;
                          $popover.css({
                              position: 'absolute',
                              top: popoverTop
                          });
                          $popover.show();
                          setTimeout(function () {
                              $popover.addClass('in');
                              return $(element).triggerHandler('shown.bs.popover');
                          }, 0);
                          return false;
                      }
                  });
                  $(element).on('shown.bs.popover', function () {
                      $(".popover ." + popover.id + " input:first").select();
                      scope.$apply(function () {
                          return scope.popover.shown();
                      });
                  });
                  return $(element).on('hide.bs.popover', function () {
                      var $popover;
                      $popover = $("form." + popover.id).closest('.popover');
                      if (!popover.isClickedSave) {
                          if (scope.$$phase) {
                              scope.popover.cancel();
                          } else {
                              scope.$apply(function () {
                                  return scope.popover.cancel();
                              });
                          }
                      }
                      $popover.removeClass('in');
                      setTimeout(function () {
                          return $popover.hide();
                      }, 300);
                      return false;
                  });
              }
          };
      }
    ]).directive('fbComponents', function () {
        return {
            restrict: 'A',
            template: "<ul ng-if=\"groups.length > 1\" class=\"nav nav-tabs nav-justified\">\n    <li ng-repeat=\"group in groups\" ng-class=\"{active:activeGroup==group}\">\n        <a href='#' ng-click=\"selectGroup($event, group)\">{{group}}</a>\n    </li>\n</ul>\n<div class='form-horizontal'>\n    <div class='fb-component' ng-repeat=\"component in components\"\n        fb-component=\"component\"></div>\n</div>",
            controller: 'fbComponentsController'
        };
    }).directive('fbComponent', [
      '$injector', function ($injector) {
          return {
              restrict: 'A',
              controller: 'fbComponentController',
              link: function (scope, element, attrs) {
                  var $builder, $compile, $drag, $parse, component, view;
                  $builder = $injector.get('$builder');
                  $drag = $injector.get('$drag');
                  $parse = $injector.get('$parse');
                  $compile = $injector.get('$compile');
                  component = $parse(attrs.fbComponent)(scope);
                  scope.copyObjectToScope(component);
                  $drag.draggable($(element), {
                      mode: 'mirror',
                      defer: false,
                      object: {
                          componentName: component.name
                      }
                  });

                  /* Unais' comment: Following 3 lines are written to destroy previous scope to avoid unwanted watchers */
                  /*if(scope.inheritedScope) scope.inheritedScope.$destroy();
                  scope.inheritedScope = scope.$new(false);                      
                  view = $compile(component.template)(scope.inheritedScope);*/



                  view = $compile(component.template)(scope);
                  return $(element).append(view);
              }
          };
      }
    ]).directive('fbForm', [
      '$injector', function ($injector) {
          return {
              restrict: 'A',
              require: 'ngModel',
              scope: {
                  formName: '@fbForm',
                  input: '=ngModel',
                  "default": '=fbDefault'
              },
              template: "<div ng-repeat=\"object in form\" fb-form-object=\"object\" ng-class=\"object.mainclass\"></div>",
              controller: 'fbFormController',
              link: function (scope, element, attrs) {
                  var $builder, _base, _name;
                  $builder = $injector.get('$builder');
                  if ((_base = $builder.forms)[_name = scope.formName] == null) {
                      _base[_name] = [];
                  }
                  return scope.form = $builder.forms[scope.formName];
              }
          };
      }
    ]).directive('fbFormObject', [
      '$injector', function ($injector) {
          return {
              restrict: 'A',
              controller: 'fbFormObjectController',
              link: function (scope, element, attrs) {
                  var $builder, $compile, $input, $parse, $template, component, view;
                  scope.inputArray = [];
                  $builder = $injector.get('$builder');
                  $compile = $injector.get('$compile');
                  $parse = $injector.get('$parse');
                  scope.formObject = $parse(attrs.fbFormObject)(scope);
                  component = $builder.components[scope.formObject.component];
                  if (angular.isDefined(scope.$parent.input[scope.formObject.uniqueid])) {
                      scope.inputText = scope.$parent.input[scope.formObject.uniqueid];
                  }
                  scope.$on($builder.broadcastChannel.updateInput, function () {
                      return scope.updateInput(scope.inputText);
                  });
                  if (component) {
                      if (component.arrayToText) {
                          //scope.inputArray = [];
                          scope.$watch('inputArray', function (newValue, oldValue) {
                              var checked, index;
                              if (newValue === oldValue) {
                                  return;
                              }
                              checked = [];
                              for (index in scope.inputArray) {
                                  if (scope.inputArray[index]) {
                                      checked.push(scope.options[index]);
                                  }
                              }
                              return scope.inputText = checked;
                          }, true);
                      }
                  }
                  scope.$watch('inputText', function () {
                      return scope.updateInput(scope.inputText);
                  });

                  scope.$watch(attrs.fbFormObject, function () {
                      return scope.copyObjectToScope(scope.formObject);
                  }, true);
				  
				  try
				  {

					  $template = $(component.templatewithclass);
					  $input = $template.find("[ng-model='inputText']");
					  
                      /* Unais' comment: Following 3 lines are written to destroy previous scope to avoid unwanted watchers */
                      /*if(scope.inheritedScope) scope.inheritedScope.$destroy();
                      scope.inheritedScope = scope.$new(false);                      
                      view = $compile($template)(scope.inheritedScope);*/

					  view = $compile($template)(scope);
					  $(element).append(view);
					  if (!component.arrayToText && scope.formObject.options.length > 0) {
						  //scope.inputText = scope.formObject.options[0];
					  }
				  
				  }
				  catch(err)
				  {
					  
				  }

                  return scope.$watch("default." + scope.formObject.uniqueid, function (value) {
                      if (!value) {
                          return;
                      }
                      if (component.arrayToText) {
                          return scope.inputArray = value;
                      } else {
                          return scope.inputText = value;
                      }
                  });
              }
          };
      }
    ]);

}).call(this);

(function () {
    angular.module('builder.drag', []).provider('$drag', function () {

        var $injector, $rootScope, delay;
        $injector = null;
        $rootScope = null;
        this.data = {
            draggables: {},
            droppables: {}
        };
        this.mouseMoved = false;
        this.isMouseMoved = (function (_this) {
            return function () {
                return _this.mouseMoved;
            };
        })(this);
        this.hooks = {
            down: {},
            move: {},
            up: {}
        };
        this.eventMouseMove = function () { };
        this.eventMouseUp = function () { };
        $((function (_this) {
            return function () {
                $(document).on('mousedown', function (e) {
                    var func, key, _ref;
                    _this.mouseMoved = false;
                    _ref = _this.hooks.down;
                    for (key in _ref) {
                        func = _ref[key];
                        func(e);
                    }
                });
                $(document).on('mousemove', function (e) {
                    var func, key, _ref;
                    _this.mouseMoved = true;
                    _ref = _this.hooks.move;
                    for (key in _ref) {
                        func = _ref[key];
                        func(e);
                    }
                });
                return $(document).on('mouseup', function (e) {
                    var func, key, _ref;
                    _ref = _this.hooks.up;
                    for (key in _ref) {
                        func = _ref[key];
                        func(e);
                    }
                });
            };
        })(this));
        this.currentId = 0;
        this.getNewId = (function (_this) {
            return function () {
                return "" + (_this.currentId++);
            };
        })(this);
        this.setupEasing = function () {
            return jQuery.extend(jQuery.easing, {
                easeOutQuad: function (x, t, b, c, d) {
                    return -c * (t /= d) * (t - 2) + b;
                }
            });
        };
        this.setupProviders = function (injector) {

            /*
            Setup providers.
             */
            $injector = injector;
            return $rootScope = $injector.get('$rootScope');
        };
        this.isHover = (function (_this) {
            return function ($elementA, $elementB) {

                /*
                Is element A hover on element B?
                @param $elementA: jQuery object
                @param $elementB: jQuery object
                 */
                var isHover, offsetA, offsetB, sizeA, sizeB;
                offsetA = $elementA.offset();
                offsetB = $elementB.offset();
                sizeA = {
                    width: $elementA.width(),
                    height: $elementA.height()
                };
                sizeB = {
                    width: $elementB.width(),
                    height: $elementB.height()
                };
                isHover = {
                    x: false,
                    y: false
                };
                isHover.x = offsetA.left > offsetB.left && offsetA.left < offsetB.left + sizeB.width;
                isHover.x = isHover.x || offsetA.left + sizeA.width > offsetB.left && offsetA.left + sizeA.width < offsetB.left + sizeB.width;
                if (!isHover) {
                    return false;
                }
                isHover.y = offsetA.top > offsetB.top && offsetA.top < offsetB.top + sizeB.height;
                isHover.y = isHover.y || offsetA.top + sizeA.height > offsetB.top && offsetA.top + sizeA.height < offsetB.top + sizeB.height;
                return isHover.x && isHover.y;
            };
        })(this);
        delay = function (ms, func) {
            return setTimeout(function () {
                return func();
            }, ms);
        };
        this.autoScroll = {
            up: false,
            down: false,
            scrolling: false,
            scroll: (function (_this) {
                return function () {
                    _this.autoScroll.scrolling = true;
                    if (_this.autoScroll.up) {
                        $('html, body').dequeue().animate({
                            scrollTop: $(window).scrollTop() - 50
                        }, 100, 'easeOutQuad');
                        return delay(100, function () {
                            return _this.autoScroll.scroll();
                        });
                    } else if (_this.autoScroll.down) {
                        $('html, body').dequeue().animate({
                            scrollTop: $(window).scrollTop() + 50
                        }, 100, 'easeOutQuad');
                        return delay(100, function () {
                            return _this.autoScroll.scroll();
                        });
                    } else {
                        return _this.autoScroll.scrolling = false;
                    }
                };
            })(this),
            start: (function (_this) {
                return function (e) {
                    if (e.clientY < 50) {
                        _this.autoScroll.up = true;
                        _this.autoScroll.down = false;
                        if (!_this.autoScroll.scrolling) {
                            return _this.autoScroll.scroll();
                        }
                    } else if (e.clientY > $(window).innerHeight() - 50) {
                        _this.autoScroll.up = false;
                        _this.autoScroll.down = true;
                        if (!_this.autoScroll.scrolling) {
                            return _this.autoScroll.scroll();
                        }
                    } else {
                        _this.autoScroll.up = false;
                        return _this.autoScroll.down = false;
                    }
                };
            })(this),
            stop: (function (_this) {
                return function () {
                    _this.autoScroll.up = false;
                    return _this.autoScroll.down = false;
                };
            })(this)
        };
        this.dragMirrorMode = (function (_this) {
            return function ($element, defer, object) {
                var result;
                if (defer == null) {
                    defer = true;
                }
                result = {
                    id: _this.getNewId(),
                    mode: 'mirror',
                    maternal: $element[0],
                    element: null,
                    object: object
                };
                $element.on('mousedown', function (e) {
                    var $clone;
                    e.preventDefault();
                    $clone = $element.clone();
                    result.element = $clone[0];
                    $clone.addClass("fb-draggable form-horizontal prepare-dragging");
                    _this.hooks.move.drag = function (e, defer) {
                        var droppable, id, _ref, _results;
                        if ($clone.hasClass('prepare-dragging')) {
                            $clone.css({
                                width: $element.width(),
                                height: $element.height()
                            });
                            $clone.removeClass('prepare-dragging');
                            $clone.addClass('dragging');
                            if (defer) {
                                return;
                            }
                        }
                        $clone.offset({
                            left: e.pageX - $clone.width() / 2,
                            top: e.pageY - $clone.height() / 2
                        });
                        _this.autoScroll.start(e);
                        _ref = _this.data.droppables;
                        _results = [];
                        for (id in _ref) {
                            droppable = _ref[id];
                            if (_this.isHover($clone, $(droppable.element))) {
                                _results.push(droppable.move(e, result));
                            } else {
                                _results.push(droppable.out(e, result));
                            }
                        }
                        return _results;
                    };
                    _this.hooks.up.drag = function (e) {
                        var droppable, id, isHover, _ref;
                        _ref = _this.data.droppables;
                        for (id in _ref) {
                            droppable = _ref[id];
                            isHover = _this.isHover($clone, $(droppable.element));
                            droppable.up(e, isHover, result);
                        }
                        delete _this.hooks.move.drag;
                        delete _this.hooks.up.drag;
                        result.element = null;
                        $clone.remove();
                        return _this.autoScroll.stop();
                    };
                    $('body').append($clone);
                    if (!defer) {
                        return _this.hooks.move.drag(e, defer);
                    }
                });
                return result;
            };
        })(this);
        this.dragDragMode = (function (_this) {
            return function ($element, defer, object) {
                var result;
                if (defer == null) {
                    defer = true;
                }
                result = {
                    id: _this.getNewId(),
                    mode: 'drag',
                    maternal: null,
                    element: $element[0],
                    object: object
                };
                $element.addClass('fb-draggable');
                $element.on('mousedown', function (e) {
                    e.preventDefault();
                    if ($element.hasClass('dragging')) {
                        return;
                    }
                    $element.addClass('prepare-dragging');
                    _this.hooks.move.drag = function (e, defer) {
                        var droppable, id, _ref;
                        if ($element.hasClass('prepare-dragging')) {
                            $element.css({
                                width: $element.width(),
                                height: $element.height()
                            });
                            $element.removeClass('prepare-dragging');
                            $element.addClass('dragging');
                            if (defer) {
                                return;
                            }
                        }
                        $element.offset({
                            left: e.pageX - $element.width() / 2,
                            top: e.pageY - $element.height() / 2
                        });
                        _this.autoScroll.start(e);
                        _ref = _this.data.droppables;
                        for (id in _ref) {
                            droppable = _ref[id];
                            if (_this.isHover($element, $(droppable.element))) {
                                droppable.move(e, result);
                            } else {
                                droppable.out(e, result);
                            }
                        }
                    };
                    _this.hooks.up.drag = function (e) {
                        var droppable, id, isHover, _ref;
                        _ref = _this.data.droppables;
                        for (id in _ref) {
                            droppable = _ref[id];
                            isHover = _this.isHover($element, $(droppable.element));
                            droppable.up(e, isHover, result);
                        }
                        delete _this.hooks.move.drag;
                        delete _this.hooks.up.drag;
                        $element.css({
                            width: '',
                            height: '',
                            left: '',
                            top: ''
                        });
                        $element.removeClass('dragging defer-dragging');
                        return _this.autoScroll.stop();
                    };
                    if (!defer) {
                        return _this.hooks.move.drag(e, defer);
                    }
                });
                return result;
            };
        })(this);
        this.dropMode = (function (_this) {
            return function ($element, options) {
                var result;
                result = {
                    id: _this.getNewId(),
                    element: $element[0],
                    move: function (e, draggable) {
                        return $rootScope.$apply(function () {
                            return typeof options.move === "function" ? options.move(e, draggable) : void 0;
                        });
                    },
                    up: function (e, isHover, draggable) {
                        return $rootScope.$apply(function () {
                            return typeof options.up === "function" ? options.up(e, isHover, draggable) : void 0;
                        });
                    },
                    out: function (e, draggable) {
                        return $rootScope.$apply(function () {
                            return typeof options.out === "function" ? options.out(e, draggable) : void 0;
                        });
                    }
                };
                return result;
            };
        })(this);
        this.draggable = (function (_this) {
            return function ($element, options) {
                var draggable, element, result, _i, _j, _len, _len1;
                if (options == null) {
                    options = {};
                }

                /*
                Make the element could be drag.
                @param element: The jQuery element.
                @param options: Options
                    mode: 'drag' [default], 'mirror'
                    defer: yes/no. defer dragging
                    object: custom information
                 */
                result = [];
                if (options.mode === 'mirror') {
                    for (_i = 0, _len = $element.length; _i < _len; _i++) {
                        element = $element[_i];
                        draggable = _this.dragMirrorMode($(element), options.defer, options.object);
                        result.push(draggable.id);
                        _this.data.draggables[draggable.id] = draggable;
                    }
                } else {
                    for (_j = 0, _len1 = $element.length; _j < _len1; _j++) {
                        element = $element[_j];
                        draggable = _this.dragDragMode($(element), options.defer, options.object);
                        result.push(draggable.id);
                        _this.data.draggables[draggable.id] = draggable;
                    }
                }
                return result;
            };
        })(this);
        this.droppable = (function (_this) {
            return function ($element, options) {
                var droppable, element, result, _i, _len;
                if (options == null) {
                    options = {};
                }

                /*
                Make the element coulde be drop.
                @param $element: The jQuery element.
                @param options: The droppable options.
                    move: The custom mouse move callback. (e, draggable)->
                    up: The custom mouse up callback. (e, isHover, draggable)->
                    out: The custom mouse out callback. (e, draggable)->
                 */
                result = [];
                for (_i = 0, _len = $element.length; _i < _len; _i++) {
                    element = $element[_i];
                    droppable = _this.dropMode($(element), options);
                    result.push(droppable);
                    _this.data.droppables[droppable.id] = droppable;
                }
                return result;
            };
        })(this);
        this.get = function ($injector) {
            this.setupEasing();
            this.setupProviders($injector);
            return {
                isMouseMoved: this.isMouseMoved,
                data: this.data,
                draggable: this.draggable,
                droppable: this.droppable
            };
        };
        this.get.$inject = ['$injector'];
        this.$get = this.get;
    });

}).call(this);

(function () {
    angular.module('builder', ['builder.directive']);

}).call(this);


/*
    component:
        It is like a class.
        The base components are textInput, textArea, select, check, radio.
        User can custom the form with components.
    formObject:
        It is like an object (an instance of the component).
        User can custom the label, description, required and validation of the input.
    form:
        This is for end-user. There are form groups int the form.
        They can input the value to the form.
 */

(function () {
    var __indexOf = [].indexOf || function (item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

    angular.module('builder.provider', []).provider('$builder', function () {
        this.version = '0.0.1';
        this.components = {};
        this.groups = [];
        this.broadcastChannel = {
            updateInput: '$updateInput'
        };
        this.forms = {
            "default": []
        };
        this.formsId = {
            "default": 0
        };
        this.convertComponent = function (name, component) {
            var result, _ref, _ref1, _ref10, _ref11, _ref12, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref20, _ref21, _ref22, _ref23, _ref24, _ref25, _ref26, _ref27, _ref28, _ref29, _ref30, _ref31, _ref32, _ref33, _ref34, _ref35, _ref36, _ref37, _ref38, _ref39, _ref40, _ref41, _ref42;
            result = {
                name: name,
                group: (_ref = component.group) != null ? _ref : 'Default',
                label: (_ref1 = component.label) != null ? _ref1 : '',
                description: (_ref2 = component.description) != null ? _ref2 : '',
                placeholder: (_ref3 = component.placeholder) != null ? _ref3 : '',
                editable: (_ref4 = component.editable) != null ? _ref4 : true,
                required: (_ref5 = component.required) != null ? _ref5 : false,
                inline: (_ref6 = component.inline) != null ? _ref6 : false,
                inputclass: (_ref7 = component.inputclass) != null ? _ref7 : '',
                condition: (_ref8 = component.condition) != null ? _ref8 : '',
                maxlength: (_ref9 = component.maxlength) != null ? _ref9 : '',
                uniqueid: (_ref10 = component.uniqueid) != null ? _ref10 : '',
                validation: (_ref11 = component.validation) != null ? _ref11 : '/.*/',
                validationOptions: (_ref12 = component.validationOptions) != null ? _ref12 : [],
                options: (_ref13 = component.options) != null ? _ref13 : [],
                arrayToText: (_ref14 = component.arrayToText) != null ? _ref14 : false,
                validatorcondition: (_ref15 = component.validatorcondition) != null ? _ref15 : '',
                validatorset: (_ref16 = component.validatorset) != null ? _ref16 : '',
                blurvalidatorcondition: (_ref17 = component.blurvalidatorcondition) != null ? _ref17 : '',
                blurvalidatorset: (_ref18 = component.blurvalidatorset) != null ? _ref18 : '',
                watchvalidatorcondition: (_ref19 = component.watchvalidatorcondition) != null ? _ref19 : '',
                watchvalidatorset: (_ref20 = component.watchvalidatorset) != null ? _ref20 : '',
                isblur: (_ref21 = component.isblur) != null ? _ref21 : false,
                iswatch: (_ref22 = component.iswatch) != null ? _ref22 : false,
                labelclass: (_ref23 = component.labelclass) != null ? _ref23 : '',
                disablecondition: (_ref24 = component.disablecondition) != null ? _ref24 : '',
                onkeypress: (_ref25 = component.onkeypress) != null ? _ref25 : '',
                textareatext: (_ref26 = component.textareatext) != null ? _ref26 : '',
                ispopup: (_ref27 = component.ispopup) != null ? _ref27 : '',
                checkboxclass: (_ref28 = component.checkboxclass) != null ? _ref28 : '',
                popuplable: (_ref29 = component.popuplable) != null ? _ref29 : '',
                uimasking: (_ref30 = component.uimasking) != null ? _ref30 : '',
                futuredate: (_ref31 = component.futuredate) != null ? _ref31 : '',
                validatoruniqueid: (_ref32 = component.validatoruniqueid) != null ? _ref32 : '',
                numberonly: (_ref33 = component.numberonly) != null ? _ref33 : '',
                numbercharonly: (_ref34 = component.numbercharonly) != null ? _ref34 : '',
                charonly: (_ref35 = component.charonly) != null ? _ref35 : '',
                displaycalculation: (_ref36 = component.displaycalculation) != null ? _ref36 : '',
                ngchangecondition: (_ref37 = component.ngchangecondition) != null ? _ref37 : '',
                rangefrom: (_ref38 = component.rangefrom) != null ? _ref38 : '',
                rangeto: (_ref39 = component.rangeto) != null ? _ref39 : '',
                alertmessage: (_ref40 = component.alertmessage) != null ? _ref40 : '',
                template: component.template,
                popoverTemplate: component.popoverTemplate,
                templatewithclass: component.templatewithclass
            };
            if (!result.template) {
               
            }
            if (!result.popoverTemplate) {
               
            }
            return result;
        };
        this.convertFormObject = function (name, formObject) {
            var component, exist, form, result, _i, _len, _ref, _ref1, _ref10, _ref11, _ref12, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref20, _ref21, _ref22, _ref23, _ref24, _ref25, _ref26, _ref27, _ref28, _ref29, _ref30, _ref31, _ref32, _ref33, _ref34, _ref35, _ref36, _ref37, _ref38, _ref39, _ref40, _ref41, _ref42;
            if (formObject == null) {
                formObject = {};
            }
            component = this.components[formObject.component];
            if (component == null) {
                throw "The component " + formObject.component + " was not registered.";
            }
            if (formObject.id) {
                exist = false;
                _ref = this.forms[name];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    form = _ref[_i];
                    if (!(formObject.id <= form.id)) {
                        continue;
                    }
                    formObject.id = this.formsId[name]++;
                    exist = true;
                    break;
                }
                if (!exist) {
                    this.formsId[name] = formObject.id + 1;
                }
            }
            result = {
                id: (_ref1 = formObject.id) != null ? _ref1 : this.formsId[name]++,
                component: formObject.component,
                editable: (_ref2 = formObject.editable) != null ? _ref2 : component.editable,
                index: (_ref3 = formObject.index) != null ? _ref3 : 0,
                label: (_ref4 = formObject.label) != null ? _ref4 : component.label,
                description: (_ref5 = formObject.description) != null ? _ref5 : component.description,
                placeholder: (_ref6 = formObject.placeholder) != null ? _ref6 : component.placeholder,
                options: (_ref7 = formObject.options) != null ? _ref7 : component.options,
                required: (_ref8 = formObject.required) != null ? _ref8 : component.required,
                inline: (_ref9 = formObject.inline) != null ? _ref9 : component.inline,
                inputclass: (_ref10 = formObject.inputclass) != null ? _ref10 : component.inputclass,
                condition: (_ref11 = formObject.condition) != null ? _ref11 : component.condition,
                maxlength: (_ref12 = formObject.maxlength) != null ? _ref11 : component.maxlength,
                validation: (_ref12 = formObject.validation) != null ? _ref12 : component.validation,
                uniqueid: (_ref13 = formObject.uniqueid) != null ? _ref13 : component.uniqueid,
                disablecondition: (_ref14 = formObject.disablecondition) != null ? _ref14 : component.disablecondition,
                validatorcondition: (_ref15 = formObject.validatorcondition) != null ? _ref15 : component.validatorcondition,
                validatorset: (_ref16 = formObject.validatorset) != null ? _ref16 : component.validatorset,
                blurvalidatorcondition: (_ref17 = component.blurvalidatorcondition) != null ? _ref17 : component.blurvalidatorcondition,
                blurvalidatorset: (_ref18 = component.blurvalidatorset) != null ? _ref18 : component.blurvalidatorset,
                watchvalidatorcondition: (_ref19 = component.watchvalidatorcondition) != null ? _ref19 : component.watchvalidatorcondition,
                watchvalidatorset: (_ref20 = component.watchvalidatorset) != null ? _ref20 : component.watchvalidatorset,
                isblur: (_ref21 = component.isblur) != null ? _ref21 : false,
                iswatch: (_ref22 = component.iswatch) != null ? _ref22 : false,
                labelclass: (_ref23 = formObject.labelclass) != null ? _ref23 : component.labelclass,
                onkeypress: (_ref24 = formObject.onkeypress) != null ? _ref24 : component.onkeypress,
                textareatext: (_ref25 = formObject.textareatext) != null ? _ref25 : component.textareatext,
                ispopup: (_ref26 = formObject.ispopup) != null ? _ref26 : component.ispopup,
                checkboxclass: (_ref27 = formObject.checkboxclass) != null ? _ref27 : component.checkboxclass,
                popuplable: (_ref28 = formObject.popuplable) != null ? _ref28 : component.popuplable,
                uimasking: (_ref29 = formObject.uimasking) != null ? _ref29 : component.uimasking,
                futuredate: (_ref30 = formObject.futuredate) != null ? _ref30 : component.futuredate,
                validatoruniqueid: (_ref31 = formObject.validatoruniqueid) != null ? _ref31 : component.validatoruniqueid,
                numberonly: (_ref32 = formObject.numberonly) != null ? _ref32 : component.numberonly,
                numbercharonly: (_ref33 = formObject.numbercharonly) != null ? _ref33 : component.numbercharonly,
                charonly: (_ref34 = formObject.charonly) != null ? _ref34 : component.charonly,
                displaycalculation: (_ref36 = formObject.displaycalculation) != null ? _ref36 : component.displaycalculation,
                ngchangecondition: (_ref37 = formObject.ngchangecondition) != null ? _ref37 : component.ngchangecondition,
                rangefrom: (_ref38 = formObject.rangefrom) != null ? _ref38 : component.rangefrom,
                rangeto: (_ref39 = formObject.rangeto) != null ? _ref39 : component.rangeto,
                alertmessage: (_ref40 = formObject.alertmessage) != null ? _ref40 : component.alertmessage
            };
            return result;
        };
        this.reindexFormObject = (function (_this) {
            return function (name) {
                var formObjects, index, _i, _ref;
                formObjects = _this.forms[name];
                for (index = _i = 0, _ref = formObjects.length; _i < _ref; index = _i += 1) {
                    formObjects[index].index = index;
                }
            };
        })(this);
        this.registerComponent = (function (_this) {
            return function (name, component) {
                var newComponent, _ref;
                if (component == null) {
                    component = {};
                }

                /*
                Register the component for form-builder.
                @param name: The component name.
                @param component: The component object.
                    group: {string} The component group.
                    label: {string} The label of the input.
                    description: {string} The description of the input.
                    placeholder: {string} The placeholder of the input.
                    editable: {bool} Is the form object editable?
                    required: {bool} Is the form object required?
                    inline: {bool} Is the form object appears inline?
                    hide: {bool} Is the form object hide?
                    showcondition: {string} The hideCondition of the input.
                    validation: {string} angular-validator. "/regex/" or "[rule1, rule2]". (default is RegExp(.*))
                    validationOptions: {array} [{rule: angular-validator, label: 'option label'}] the options for the validation. (default is [])
                    options: {array} The input options.
                    arrayToText: {bool} checkbox could use this to convert input (default is no)
                    template: {string} html template
                    popoverTemplate: {string} html template
                 */
                if (_this.components[name] == null) {
                    newComponent = _this.convertComponent(name, component);
                    _this.components[name] = newComponent;
                    if (_ref = newComponent.group, __indexOf.call(_this.groups, _ref) < 0) {
                        _this.groups.push(newComponent.group);
                    }
                } else {
                    //console.error("The component " + name + " was registered.");
                }
            };
        })(this);
        this.addFormObject = (function (_this) {
            return function (name, formObject) {
                var _base;
                if (formObject == null) {
                    formObject = {};
                }

                /*
                Insert the form object into the form at last.
                 */
                if ((_base = _this.forms)[name] == null) {
                    _base[name] = [];
                }
                return _this.insertFormObject(name, _this.forms[name].length, formObject);
            };
        })(this);
        this.insertFormObject = (function (_this) {
            return function (name, index, formObject) {
                var _base, _base1;
                if (formObject == null) {
                    formObject = {};
                }

                /*
                Insert the form object into the form at {index}.
                @param name: The form name.
                @param index: The form object index.
                @param form: The form object.
                    id: {int} The form object id. It will be generate by $builder if not asigned.
                    component: {string} The component name
                    editable: {bool} Is the form object editable? (default is yes)
                    label: {string} The form object label.
                    description: {string} The form object description.
                    placeholder: {string} The form object placeholder.
                    options: {array} The form object options.
                    required: {bool} Is the form object required? (default is no)
                    inline: {bool} Is the form object appears inline ? (default is no)
                    hide: {bool} Is the form object hide? (default is false)
                    showcondition: {string} The form object hidecondition.
                    validation: {string} angular-validator. "/regex/" or "[rule1, rule2]".
                    [index]: {int} The form object index. It will be updated by $builder.
                @return: The form object.
                 */
                if ((_base = _this.forms)[name] == null) {
                    _base[name] = [];
                }
                if ((_base1 = _this.formsId)[name] == null) {
                    _base1[name] = 0;
                }
                if (index > _this.forms[name].length) {
                    index = _this.forms[name].length;
                } else if (index < 0) {
                    index = 0;
                }
                _this.forms[name].splice(index, 0, _this.convertFormObject(name, formObject));
                _this.reindexFormObject(name);
                return _this.forms[name][index];
            };
        })(this);
        this.removeFormObject = (function (_this) {
            return function (name, index) {

                /*
                Remove the form object by the index.
                @param name: The form name.
                @param index: The form object index.
                 */
                var formObjects;
                formObjects = _this.forms[name];
                formObjects.splice(index, 1);
                return _this.reindexFormObject(name);
            };
        })(this);
        this.updateFormObjectIndex = (function (_this) {
            return function (name, oldIndex, newIndex) {

                /*
                Update the index of the form object.
                @param name: The form name.
                @param oldIndex: The old index.
                @param newIndex: The new index.
                 */
                var formObject, formObjects;
                if (oldIndex === newIndex) {
                    return;
                }
                formObjects = _this.forms[name];
                formObject = formObjects.splice(oldIndex, 1)[0];
                formObjects.splice(newIndex, 0, formObject);
                return _this.reindexFormObject(name);
            };
        })(this);
        this.get = function () {
            return {
                version: this.version,
                components: this.components,
                groups: this.groups,
                forms: this.forms,
                broadcastChannel: this.broadcastChannel,
                registerComponent: this.registerComponent,
                addFormObject: this.addFormObject,
                insertFormObject: this.insertFormObject,
                removeFormObject: this.removeFormObject,
                updateFormObjectIndex: this.updateFormObjectIndex
            };
        };
        this.$get = this.get;
    });

}).call(this);
