'use strict';

angular.module('ratefastApp')
    .controller('chargereportCtrl', function ($scope, $http, $routeParams, $rootScope, getmasterchargereportdata, downloadReportSafari, $filter) {
        
		$scope.currentuserrole = $rootScope.currentUser.role;
		$scope.loginActivity = true;
        $scope.showfirsttable = false;
        $scope.showsecondtable = false;
        $scope.formd = [];
        $scope.form = [];
        $scope.itemsByPage = 10;
        $scope.dateOptions = {
            startingDay: 1,
            changeMonth: true,
            changeYear: true,
            showAnim: "clip",
            clearBtn: true,
			maxDate: new Date()
        };
        $scope.isLoad = false;

        $scope.formats = ['mm/dd/yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.itemsByPage = 10;

        $scope.select2Options = {
            allowClear: true,
            'multiple': true
        };

        $scope.getPracticesList = function () {
            $http.get('/api/getreportactivity/getpractices')
              .success(function (data, status, headers, config) {
                  debugger;    
				var allpractices = {"_id": "1", "practicename": "All Accounts"}				
				
				var newdata=[];
				newdata.push(allpractices);
				
				var items = data[0].data;
				
				//sorting use to make practicename sorted in dropdown n 1st name should be all accounts
		           items.sort(function (a, b) {
		        	   var aName=a.practicename.toLowerCase();
		        	   var bName=b.practicename.toLowerCase();
		        	   
				             if (aName > bName) {
				               return 1;
				             }
				             if (aName < bName) {
				               return -1;
				             }
				             // a must be equal to b
				             return 0;
		           });
		           
				for(var i=0; i<items.length;i++){		
						newdata.push(items[i]);
					}
				
				$scope.practiceList = newdata;
				
				//following $scope.formd.practicename --> use to default practicename in dropdown
				$scope.formd.practicename = $scope.practiceList[0];
              });
        }
		
		$scope.getLocationList = function (currentpractice) {
			  $scope.formd.locationname = [];
			
			$scope.showfirsttable = false;
            $http.get('/api/getdataclinic/' + currentpractice.practicename)
              .success(function (data, status, headers, config) {
                  debugger;    
				var alllocations = {"_id": "0", "locationanme": "All Locations"}				
				var newdata=[];
				$scope.LocationWithDetails=[];
				
				var loc;
				for(var i=0; i<data[0].clinicLocation.length;i++)
				{
					loc= data[0].clinicLocation[i];
					for(var j=0; j<loc.practiceaddress.length;j++)
					{
						newdata.push({"_id": "" + (j+1) + "", "locationanme": loc.practiceaddress[j].street + ', ' + loc.practiceaddress[j].city});
						$scope.LocationWithDetails.push({"_id": "" + (j+1) + "", "street": loc.practiceaddress[j].street ,"city": loc.practiceaddress[j].city});
					}
				}
				
				//sorting use to make locationname sorted in dropdown n 1st name should be all accounts
				newdata.sort(function (a, b) {
		        	   var aName=a.locationanme.toLowerCase();
		        	   var bName=b.locationanme.toLowerCase();
		        	   
				             if (aName > bName) {
				               return 1;
				             }
				             if (aName < bName) {
				               return -1;
				             }
				             // a must be equal to b
				             return 0;
		           });
				
				var finallocationata=[];
				finallocationata.push(alllocations);	
				
				for(var i=0; i<newdata.length;i++)		
					finallocationata.push(newdata[i]);
				
				$scope.LocationList = finallocationata;
				
				//following $scope.formd.locationname -->  use to default locationname in dropdown				
				$scope.formd.locationname = $scope.LocationList[0];
              });			  
        }

        $scope.createuserCSV = function () {
            debugger;
            $scope.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
            if ($scope.isSafari) {
                var filename = $filter('date')(Date.now(), 'MM-dd-yyyy') + ' ' + 'MasterChargeReport.csv';
                //var filename = '04-08-2015 johnpractice DFR Discovery.zip';
            } else {
                var filename = $filter('date')(Date.now(), 'MM-dd-yyyy') + ' ' + 'MasterChargeReport.csv';
            }
            /*var content = 'Practice Name, Clinic Location Address, Practice ID, Address, Date Report Submitted, Report Type, Charge Amount, Treating Physician Name,  Signing Physician User Name, Sales Representative, Date of Exam, Report ID';*/
			
			var content = 'Practice, Clinic Location, Date Submitted, Report, Charge Amount, Treating Physician,  Signing Physician, Patient Name, Date of Exam, Report ID';
			
            for (var i = 0; i < $scope.rowCollection.length; i++) {
                content = content.concat('\n');                               
                
                if ($scope.rowCollection[i].practicename) {
                    content = content.concat($scope.rowCollection[i].practicename + ', ');
                } else {
                    content = content.concat(', ');
                }
				if ($scope.rowCollection[i].data.patientcomplaints.cliniclocation) {
                    content = content.concat($scope.rowCollection[i].data.patientcomplaints.cliniclocation.replace(/, /g, ' ') + ', ');
                } else {
                    content = content.concat(', ');
                }                
				if ($scope.rowCollection[i].submittedDate) {
                    content = content.concat($filter('date') ($scope.rowCollection[i].submittedDate, 'MM/dd/yyyy') + ', ');
					//content = content.concat($filter('date') ($scope.rowCollection[i].submittedDate, 'HH:mm:ss') + 'PST, ');
                } else {
                    content = content.concat(', ');
					//content = content.concat(', ');
                }
				if ($scope.rowCollection[i].formtype) {
                    content = content.concat($scope.rowCollection[i].formtype.toUpperCase() + ', ');
                } else {
                    content = content.concat(', ');
                }
				if ($scope.rowCollection[i].reportcharge) {
                    content = content.concat($scope.rowCollection[i].reportcharge + ', ');
                } else {
                    content = content.concat(', ');
                }
				if ($scope.rowCollection[i].data.patientcomplaints.treatphynamedropdown) {
                    content = content.concat($scope.rowCollection[i].data.patientcomplaints.treatphynamedropdown + ', ');
                } else {
                    content = content.concat(', ');
                }
				if ($scope.rowCollection[i].data.signDoctor)
				{
					if ($scope.rowCollection[i].data.signDoctor.level4.firstname) {
						//content = content.concat($scope.rowCollection[i].data.signDoctor.level4.firstname + ' ' + //$scope.rowCollection[i].data.signDoctor.level4.lastname + ', ');
						content = content.concat($scope.rowCollection[i].data.signDoctor.level4.firstname + ' ' + $scope.rowCollection[i].data.signDoctor.level4.lastname  + ', ');
					} else {
						content = content.concat(', ');
					}
				}	
				else {
						content = content.concat(', ');
				}
				if ($scope.rowCollection[i].data.bginfo.firstname) {
					//take first character of lastname					
					var pLastName=$scope.rowCollection[i].data.bginfo.lastname.length >0 ? $scope.rowCollection[i].data.bginfo.lastname[0] : ''; 
					content = content.concat($scope.rowCollection[i].data.bginfo.firstname +' '+ pLastName + ', ');
                } else {
                    content = content.concat(', ');
                }
				if ($scope.rowCollection[i].data.patientcomplaints.currentexamdate) {
                    content = content.concat($filter('date') ($scope.rowCollection[i].data.patientcomplaints.currentexamdate, 'MM/dd/yyyy') + ', ');
                } else {
                    content = content.concat(', ');
                }				
				if ($scope.rowCollection[i]._id) {
                    content = content.concat($scope.rowCollection[i]._id + ', ');
                } else {
                    content = content.concat(', ');
                }				
            }
            if ($scope.isSafari) {
                //window.open("/tmp/" + filename, "_blank", "fullscreen=no,toolbar=yes, width=800, height=600, menubar=yes, status=no,scroll=yes");
                downloadReportSafari.save({ 'content': content, 'filename': filename }).$promise.then(function (response) {
                    var popup = window.open("/tmp/" + filename, "_blank", "fullscreen=no,toolbar=yes, width=800, height=600, menubar=yes, status=no,scroll=yes");

                    if (popup == undefined) {
                        alert('Please disable your popup blocker');
                    }
                });

            } else {
                var blobs = [];
                blobs.push(content);
                var blob = new Blob(blobs, {
                    type: "application/vnd.oasis.opendocument.text"
                });
                saveAs(blob, filename);
            }
        }
		
		$scope.createuserCSVNew = function () {
            debugger;
            $scope.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
            if ($scope.isSafari) {
                var filename = $filter('date')(Date.now(), 'MM-dd-yyyy') + ' ' + 'MasterChargeReport.csv';
                //var filename = '04-08-2015 johnpractice DFR Discovery.zip';
            } else {
                var filename = $filter('date')(Date.now(), 'MM-dd-yyyy') + ' ' + 'MasterChargeReport.csv';
            }
            /*var content = 'Practice Name, Clinic Location Address, Practice ID, Address, Date Report Submitted, Report Type, Charge Amount, Treating Physician Name,  Signing Physician User Name, Sales Representative, Date of Exam, Report ID';*/
			
			var content = 'Practice, Clinic Location, Date Submitted, Report, Charge Amount, Treating Physician,  Signing Physician, Patient First Name, Patient Last Name, Patient DOB, Date of Exam, Report ID';
			
            for (var i = 0; i < $scope.rowCollection.length; i++) {
                content = content.concat('\n');                               
                
                if ($scope.rowCollection[i].practicename) {
                    content = content.concat($scope.rowCollection[i].practicename + ', ');
                } else {
                    content = content.concat(', ');
                }
				if ($scope.rowCollection[i].data.patientcomplaints.cliniclocation) {
                    content = content.concat($scope.rowCollection[i].data.patientcomplaints.cliniclocation.replace(/, /g, ' ') + ', ');
                } else {
                    content = content.concat(', ');
                }                
				if ($scope.rowCollection[i].submittedDate) {
                    content = content.concat($filter('date') ($scope.rowCollection[i].submittedDate, 'MM/dd/yyyy') + ', ');
					//content = content.concat($filter('date') ($scope.rowCollection[i].submittedDate, 'HH:mm:ss') + 'PST, ');
                } else {
                    content = content.concat(', ');
					//content = content.concat(', ');
                }
				if ($scope.rowCollection[i].formtype) {
                    content = content.concat($scope.rowCollection[i].formtype.toUpperCase() + ', ');
                } else {
                    content = content.concat(', ');
                }
				if ($scope.rowCollection[i].reportcharge) {
                    content = content.concat($scope.rowCollection[i].reportcharge + ', ');
                } else {
                    content = content.concat(', ');
                }
				if ($scope.rowCollection[i].data.patientcomplaints.treatphynamedropdown) {
                    content = content.concat($scope.rowCollection[i].data.patientcomplaints.treatphynamedropdown + ', ');
                } else {
                    content = content.concat(', ');
                }
				if ($scope.rowCollection[i].data.signDoctor)
				{
					if ($scope.rowCollection[i].data.signDoctor.level4.firstname) {
						//content = content.concat($scope.rowCollection[i].data.signDoctor.level4.firstname + ' ' + //$scope.rowCollection[i].data.signDoctor.level4.lastname + ', ');
						content = content.concat($scope.rowCollection[i].data.signDoctor.level4.firstname + ' ' + $scope.rowCollection[i].data.signDoctor.level4.lastname  + ', ');
					} else {
						content = content.concat(', ');
					}
				}	
				else {
						content = content.concat(', ');
				}
				if ($scope.rowCollection[i].data.bginfo.firstname) {					
					content = content.concat($scope.rowCollection[i].data.bginfo.firstname + ', ');
                } else {
                    content = content.concat(', ');
                }
				
				if ($scope.rowCollection[i].data.bginfo.lastname) {					
					content = content.concat($scope.rowCollection[i].data.bginfo.lastname + ', ');
                } else {
                    content = content.concat(', ');
                }
				
				
				if ($scope.rowCollection[i].data.bginfo.dateofbirth) {					
					content = content.concat($filter('date') ($scope.rowCollection[i].data.bginfo.dateofbirth, 'MM/dd/yyyy') + ', ');
                } else {
                    content = content.concat(', ');
                }
				
				if ($scope.rowCollection[i].data.patientcomplaints.currentexamdate) {
                    content = content.concat($filter('date') ($scope.rowCollection[i].data.patientcomplaints.currentexamdate, 'MM/dd/yyyy') + ', ');
                } else {
                    content = content.concat(', ');
                }				
				if ($scope.rowCollection[i]._id) {
                    content = content.concat($scope.rowCollection[i]._id + ', ');
                } else {
                    content = content.concat(', ');
                }				
            }
            if ($scope.isSafari) {
                //window.open("/tmp/" + filename, "_blank", "fullscreen=no,toolbar=yes, width=800, height=600, menubar=yes, status=no,scroll=yes");
                downloadReportSafari.save({ 'content': content, 'filename': filename }).$promise.then(function (response) {
                    var popup = window.open("/tmp/" + filename, "_blank", "fullscreen=no,toolbar=yes, width=800, height=600, menubar=yes, status=no,scroll=yes");

                    if (popup == undefined) {
                        alert('Please disable your popup blocker');
                    }
                });

            } else {
                var blobs = [];
                blobs.push(content);
                var blob = new Blob(blobs, {
                    type: "application/vnd.oasis.opendocument.text"
                });
                saveAs(blob, filename);
            }
        }
		
		$scope.createreportuserCSV = function () {
            debugger;
            $scope.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
            if ($scope.isSafari) {
                var filename = $filter('date')(Date.now(), 'MM-dd-yyyy') + ' ' + 'reportactivity.csv';
                //var filename = '04-08-2015 johnpractice DFR Discovery.zip';
            } else {
                var filename = $filter('date')(Date.now(), 'MM-dd-yyyy') + ' ' + 'reportactivity.csv';
            }
            /*var content = 'Practice Name, Clinic Location Address, Practice ID, Address, Date Report Submitted, Report Type, Charge Amount, Treating Physician Name,  Signing Physician User Name, Sales Representative, Date of Exam, Report ID';*/
			
			var content = 'Practice, Clinic Location, Date Submitted, Report, Charge Amount, Treating Physician,  Signing Physician, Patient Name, Date of Exam, Report ID';
			
            for (var i = 0; i < $scope.rowCollection.length; i++) {
                content = content.concat('\n');
                if ($scope.rowCollection[i].practicename) {
                    content = content.concat($scope.rowCollection[i].practicename + ', ');
                } else {
                    content = content.concat(', ');
                }
				if ($scope.rowCollection[i].data.patientcomplaints.cliniclocation) {
                    content = content.concat($scope.rowCollection[i].data.patientcomplaints.cliniclocation.replace(/, /g, ' ') + ', ');
                } else {
                    content = content.concat(', ');
                }												
				if ($scope.rowCollection[i].submittedDate) {
                    content = content.concat($filter('date') ($scope.rowCollection[i].submittedDate, 'MM/dd/yyyy') + ', ');
					//content = content.concat($filter('date') ($scope.rowCollection[i].submittedDate, 'HH:mm:ss') + 'PST, ');
                } else {
                    content = content.concat(', ');
					//content = content.concat(', ');
                }
				if ($scope.rowCollection[i].formtype) {
                    content = content.concat($scope.rowCollection[i].formtype.toUpperCase() + ', ');
                } else {
                    content = content.concat(', ');
                }
				if ($scope.rowCollection[i].reportcharge) {
                    content = content.concat($scope.rowCollection[i].reportcharge + ', ');
                } else {
                    content = content.concat(', ');
                }
				if ($scope.rowCollection[i].data.patientcomplaints.treatphynamedropdown) {
                    content = content.concat($scope.rowCollection[i].data.patientcomplaints.treatphynamedropdown + ', ');
                } else {
                    content = content.concat(', ');
                }
				if ($scope.rowCollection[i].data.signDoctor)
				{
					if ($scope.rowCollection[i].data.signDoctor.level4.firstname) {
						//content = content.concat($scope.rowCollection[i].data.signDoctor.level4.firstname + ' ' + //$scope.rowCollection[i].data.signDoctor.level4.lastname + ', ');
						content = content.concat($scope.rowCollection[i].data.signDoctor.level4.firstname + ' ' + $scope.rowCollection[i].data.signDoctor.level4.lastname  + ', ');
					} else {
						content = content.concat(', ');
					}
				}	
				else {
						content = content.concat(', ');
				}
				if ($scope.rowCollection[i].data.bginfo.firstname) {
					//take first character of lastname					
					var pLastName=$scope.rowCollection[i].data.bginfo.lastname.length >0 ? $scope.rowCollection[i].data.bginfo.lastname[0] : ''; 
					content = content.concat($scope.rowCollection[i].data.bginfo.firstname +' '+ pLastName + ', ');
					
                } else {
                    content = content.concat(', ');
                }
				if ($scope.rowCollection[i].data.patientcomplaints.currentexamdate) {
                    content = content.concat($filter('date') ($scope.rowCollection[i].data.patientcomplaints.currentexamdate, 'MM/dd/yyyy') + ', ');
                } else {
                    content = content.concat(', ');
                }				
				if ($scope.rowCollection[i]._id) {
                    content = content.concat($scope.rowCollection[i]._id + ', ');
                } else {
                    content = content.concat(', ');
                }	
            }
            if ($scope.isSafari) {
                //window.open("/tmp/" + filename, "_blank", "fullscreen=no,toolbar=yes, width=800, height=600, menubar=yes, status=no,scroll=yes");
                downloadReportSafari.save({ 'content': content, 'filename': filename }).$promise.then(function (response) {
                    var popup = window.open("/tmp/" + filename, "_blank", "fullscreen=no,toolbar=yes, width=800, height=600, menubar=yes, status=no,scroll=yes");

                    if (popup == undefined) {
                        alert('Please disable your popup blocker');
                    }
                });

            }else {
                var blobs = [];
                blobs.push(content);
                var blob = new Blob(blobs, {
                    type: "application/vnd.oasis.opendocument.text"
                });
                saveAs(blob, filename);
            }
        }

        $scope.createreportuserCSVNew = function () {
            debugger;
            $scope.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
            if ($scope.isSafari) {
                var filename = $filter('date')(Date.now(), 'MM-dd-yyyy') + ' ' + 'reportactivity.csv';
                //var filename = '04-08-2015 johnpractice DFR Discovery.zip';
            } else {
                var filename = $filter('date')(Date.now(), 'MM-dd-yyyy') + ' ' + 'reportactivity.csv';
            }
            /*var content = 'Practice Name, Clinic Location Address, Practice ID, Address, Date Report Submitted, Report Type, Charge Amount, Treating Physician Name,  Signing Physician User Name, Sales Representative, Date of Exam, Report ID';*/
			
			var content = 'Practice, Clinic Location, Date Submitted, Report, Charge Amount, Treating Physician,  Signing Physician, Patient First Name, Patient Last Name, Patient DOB, Date of Exam, Report ID';
			
            for (var i = 0; i < $scope.rowCollection.length; i++) {
                content = content.concat('\n');
                if ($scope.rowCollection[i].practicename) {
                    content = content.concat($scope.rowCollection[i].practicename + ', ');
                } else {
                    content = content.concat(', ');
                }
				if ($scope.rowCollection[i].data.patientcomplaints.cliniclocation) {
                    content = content.concat($scope.rowCollection[i].data.patientcomplaints.cliniclocation.replace(/, /g, ' ') + ', ');
                } else {
                    content = content.concat(', ');
                }												
				if ($scope.rowCollection[i].submittedDate) {
                    content = content.concat($filter('date') ($scope.rowCollection[i].submittedDate, 'MM/dd/yyyy') + ', ');
					//content = content.concat($filter('date') ($scope.rowCollection[i].submittedDate, 'HH:mm:ss') + 'PST, ');
                } else {
                    content = content.concat(', ');
					//content = content.concat(', ');
                }
				if ($scope.rowCollection[i].formtype) {
                    content = content.concat($scope.rowCollection[i].formtype.toUpperCase() + ', ');
                } else {
                    content = content.concat(', ');
                }
				if ($scope.rowCollection[i].reportcharge) {
                    content = content.concat($scope.rowCollection[i].reportcharge + ', ');
                } else {
                    content = content.concat(', ');
                }
				if ($scope.rowCollection[i].data.patientcomplaints.treatphynamedropdown) {
                    content = content.concat($scope.rowCollection[i].data.patientcomplaints.treatphynamedropdown + ', ');
                } else {
                    content = content.concat(', ');
                }
				if ($scope.rowCollection[i].data.signDoctor)
				{
					if ($scope.rowCollection[i].data.signDoctor.level4.firstname) {
						//content = content.concat($scope.rowCollection[i].data.signDoctor.level4.firstname + ' ' + //$scope.rowCollection[i].data.signDoctor.level4.lastname + ', ');
						content = content.concat($scope.rowCollection[i].data.signDoctor.level4.firstname + ' ' + $scope.rowCollection[i].data.signDoctor.level4.lastname  + ', ');
					} else {
						content = content.concat(', ');
					}
				}	
				else {
						content = content.concat(', ');
				}
				if ($scope.rowCollection[i].data.bginfo.firstname) {					
					content = content.concat($scope.rowCollection[i].data.bginfo.firstname + ', ');
                } else {
                    content = content.concat(', ');
                }
				
				if ($scope.rowCollection[i].data.bginfo.lastname) {					
					content = content.concat($scope.rowCollection[i].data.bginfo.lastname + ', ');
                } else {
                    content = content.concat(', ');
                }
				
				if ($scope.rowCollection[i].data.bginfo.dateofbirth) {										
					content = content.concat($filter('date') ($scope.rowCollection[i].data.bginfo.dateofbirth, 'MM/dd/yyyy') + ', ');
                } else {
                    content = content.concat(', ');
                }
				
				if ($scope.rowCollection[i].data.patientcomplaints.currentexamdate) {
                    content = content.concat($filter('date') ($scope.rowCollection[i].data.patientcomplaints.currentexamdate, 'MM/dd/yyyy') + ', ');
                } else {
                    content = content.concat(', ');
                }				
				if ($scope.rowCollection[i]._id) {
                    content = content.concat($scope.rowCollection[i]._id + ', ');
                } else {
                    content = content.concat(', ');
                }	
            }
            if ($scope.isSafari) {
                //window.open("/tmp/" + filename, "_blank", "fullscreen=no,toolbar=yes, width=800, height=600, menubar=yes, status=no,scroll=yes");
                downloadReportSafari.save({ 'content': content, 'filename': filename }).$promise.then(function (response) {
                    var popup = window.open("/tmp/" + filename, "_blank", "fullscreen=no,toolbar=yes, width=800, height=600, menubar=yes, status=no,scroll=yes");

                    if (popup == undefined) {
                        alert('Please disable your popup blocker');
                    }
                });

            }else {
                var blobs = [];
                blobs.push(content);
                var blob = new Blob(blobs, {
                    type: "application/vnd.oasis.opendocument.text"
                });
                saveAs(blob, filename);
            }
        }

        $scope.blanckdata = function () {
            debugger;
            $scope.submited = false;
            $scope.showfirsttable = false;
            $scope.showsecondtable = false;
            $scope.formd = [];
            $scope.form = [];

        }
        
	 $scope.checkErr = function(startDate,endDate) {
		$scope.errMessage = '';           		
		if(new Date(endDate) < new Date(startDate)){
		  $scope.validationMessage=true;
		  $scope.errMessage = 'To Date should not be less than From Date.';
		  $scope.showfirsttable = false;
		  return false;
		}
		/*if(new Date(startDate) > new Date(endDate)){
		  $scope.validationMessage=true;
		  $scope.errMessage = 'From date should not be greater than To date.';
		  $scope.showfirsttable = false;
		  return false;
		}*/		
	};
		
	$scope.create = function (isValid, formdata) {
        debugger;      
		$scope.validationMessage=false;		
        $scope.date;         
        $scope.submited = true;
		if($scope.checkErr(formdata.startdate,formdata.enddate)==false)
		{
		  return false;
		}
        if (isValid) {
	        	if(formdata.practicename.practicename!='All Accounts'){
	        		if(formdata.locationname.locationanme==undefined){
	        			divMsg.style.display='block';
	        			divnorecordMsg.style.display='none';
	        			return;
	        		}
	        		else
					{
						divMsg.style.display='none';
					}
	        	}
				else
				{
					divMsg.style.display='none';
				}
        	
	        	
	        	var query={};
	        	query.startdate=formdata.startdate;
	        	query.enddate=formdata.enddate;
	        	query.practicename=formdata.practicename.practicename;
	        	
	        	if(formdata.practicename.practicename!='All Accounts'){
	        		/*
	        		 *if user select specific location then query contain street n city
	        		 * user want records for all locations then strret n city will be empty
	        		 * this condition base on _id...if _id ==0 then it means user want for all location
	        		 */	        		
	        			var locationname={}  
	        			locationname.street='';
	        			locationname.city='';
	        			locationname.all='';
		        			if(formdata.locationname!=undefined){
		        				
		        				if(formdata.locationname._id==0){
		        						locationname.all='All Locations';
		        					}
		        				else{
			        				for(var locID in $scope.LocationWithDetails) {
			        	                if(formdata.locationname._id==$scope.LocationWithDetails[locID]._id){	        	                	
			    	        				locationname.street=$scope.LocationWithDetails[locID].street;
			    	        				locationname.city=$scope.LocationWithDetails[locID].city;	    	        				
			        	                }
			        	             }
		        				}
		        			}
		        			else{		        				
		        				locationname.all='All Locations';
		        			}		        			
		        			query.locationname=locationname;
	        		}
	        		        	              	
	            $scope.isLoad = true;
	            getmasterchargereportdata.save(query).$promise.then(function (reports) {
	                debugger;
	                $scope.isLoad = false;
	                $scope.rowCollection = reports.data;
	                $scope.displayedCollection = [].concat($scope.rowCollection);
	                if ($scope.displayedCollection.length > 0) {
	                    $scope.showfirsttable = true;
	                } else {
	                    $scope.showfirsttable = false;
	                }                
	            });        	        
        }
        else{    
        	$scope.showfirsttable = false;
        }
    }
    });