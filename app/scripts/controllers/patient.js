

'use strict';

angular.module('ratefastApp')
.controller('PatientCtrl', function ($http, $scope, $cookies, $rootScope, $route, $cookieStore, $routeParams, $location, $locale, $modal, $timeout, $filter, Patients, Injuries, Auth, StatesList, downloadReportSafari, $sce, $sessionStorage, $athenaModal) {


	/*showAngularStats({
		position: 'bottomright',
		logDigest: true,
		logWatches: true
	});*/

	//scope declaration
    $scope.patientcurrentPage = 1;
	$scope.currentPage = 1;
	$scope.searchBox=true;
    $scope.maxsize = 5;
    $scope.itemsperpage = 10;
    $scope.recentitemsperpage = 5;
    $scope.patientYes = true;
    $scope.flagSocial = false;
    $scope.listView = false;
    $scope.step = '1';
    $scope.getAge = getAge;
    $scope.patient = new Object();
    var practicename = $rootScope.currentUser.practicename;
    var patientid = $sessionStorage.patientId;

	$scope.kickstartEnable=false;
	$scope.recordsBy='practicename';
	$scope.searchType="patient";
    $scope.searchReport={};
   	$scope.orderByField = 'basicinformation[0].firstname'; // set the default sort type
    $scope.reverseSort  = false;  // set the default sort order

    debugger;
	 $scope.getSortClass = function (column)
	 {
			if ($scope.orderByField == column) {
				return $scope.reverseSort ? 'arrow-down' : 'arrow-up';
			}
			return '';
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

    createPatientObject();

	$scope.tinymceOptions = {
            resize: false,
            menubar: false,
            plugins: '',
            browser_spellcheck: true,
            contextmenu: false,
            toolbar: "bold italic underline"
        };

    $scope.listPatients = function (pagenumber) {

      $scope.isLoadDashboard = true;

		 if($scope.recordsBy=='signingphysician')
		   {
				$scope.searchType="patient";
		   }
		if($scope.searchType=="patient"){
        debugger;
        	$scope.orderByField = 'basicinformation[0].firstname'; // set the default sort type
        }
        else{
        	$scope.orderByField = 'data.bginfo.firstname';
        }
        $scope.listView = true;
        $rootScope.flagSearch = true;
        $scope.patientYes = true;
        var practicename = $rootScope.currentUser.practicename;
        showLoader();
        if (pagenumber == null)
            pagenumber = 1;

        var gender='';
        if($rootScope.search.Male && $rootScope.search.Female){

        }
        else if($rootScope.search.Male){
        	gender='Male';
        }else if($rootScope.search.Female){
        	gender='Female';
        }

		$scope.patientcurrentPage = pagenumber;
		$scope.recordsBy='practicename';

        var query = {
            pageController: 'page',
            pagenum: pagenumber,
            sfname: $rootScope.search.firstname ? $rootScope.search.firstname : 0,
            slname: $rootScope.search.lastname ? $rootScope.search.lastname : 0,
            sdob: $rootScope.search.dateofbirth ? $rootScope.search.dateofbirth : 0,
            ssocial: $rootScope.search.socialsecurityno ? $rootScope.search.socialsecurityno : 0,
            searchController: 'search',
            selectedstatecode: $cookies.selectedStatecode,
            gender:gender,
            recordsBy: $scope.recordsBy,
			confirmed: $scope.search.confirmed ? true : false
        };

        if($scope.searchType=="report"){
	        var reportStatus=[];
	        var reporttype=[];

	        if(!$scope.searchReport.open && !$scope.searchReport.closed && !$scope.searchReport.inrating){
	        	reportStatus.push('open','closed','level1','level2');
	        }else{
		        	if($scope.searchReport.open){
		        		reportStatus.push('open');
			        }
		        	if($scope.searchReport.closed){
		        		reportStatus.push('closed');
			        }
		        	if($scope.searchReport.inrating){
			        	reportStatus.push('level1','level2');
			        }
		   	}

	        if(!$scope.searchReport.dfr && !$scope.searchReport.pr2 && !$scope.searchReport.pr4){
	        	reporttype.push('dfr','pr2','pr4');
	        }else{
	        	if($scope.searchReport.dfr){
	        		reporttype.push('dfr');
	        	}
		        if($scope.searchReport.pr2){
		        	reporttype.push('pr2');
		        }
		        if($scope.searchReport.pr4){
		        	reporttype.push('pr4');
		        }
	        }

	        var startInjuryDate,endInjuryDate,startServiceDate,endServiceDate,startSubmitDate,endSubmitate;

	        query.startInjuryDate = $scope.searchReport.frominjurydate ? $scope.searchReport.frominjurydate : 0;
	        //query.endInjuryDate = $scope.searchReport.toinjurydate ? $scope.searchReport.toinjurydate : query.startInjuryDate;
	        query.endInjuryDate = $scope.searchReport.toinjurydate ? $scope.searchReport.toinjurydate : new Date();

	        query.startServiceDate = $scope.searchReport.fromservicedate ? $scope.searchReport.fromservicedate : 0;
	        query.endServiceDate = $scope.searchReport.toservicedate ? $scope.searchReport.toservicedate : new Date();

	        query.startSubmitDate = $scope.searchReport.fromsubmitdate ? $scope.searchReport.fromsubmitdate : 0;
	        query.endSubmitate = $scope.searchReport.tosubmitdate ? $scope.searchReport.tosubmitdate : new Date();

	        //add to query for search
	        query.status=reportStatus;
	        query.reporttype=reporttype;
        }
        debugger;

        $scope.patients = null;
		$scope.patientsSafe = null;

        if ($rootScope.search.lastname || $rootScope.search.firstname || $rootScope.search.dateofbirth || $rootScope.search.socialsecurityno) {
            $scope.patients = null;
        }

        if($scope.searchType=="patient"){
		        Patients.patientSearch().save(query).$promise.then(function (patients) {
		        	try{
		        		$scope.kickstartEnable=patients.data.kickstartEnable;
		        	}catch(err){}
		        	homeDashboaardData(patients);
		        });
		 }else if($scope.searchType=="report"){
	            Patients.patientWithReportSearch().save(query).$promise.then(function (patients) {
	            	homeDashboaardData(patients);
	            });
          	}
    };

    $scope.listPatientsBySigningPhysician = function (pagenumber) {
    	$scope.isLoadDashboard = true;
		$scope.resetSearch();

		$scope.searchType="report";

    	$scope.searchBox  = false;
    	$scope.orderByField = 'data.bginfo.firstname';

        $scope.listView = true;
        $rootScope.flagSearch = true;
        $scope.patientYes = true;

        showLoader();
        if (pagenumber == null)
            pagenumber = 1;

		$scope.patientcurrentPage = pagenumber;
		$scope.recordsBy= 'signingphysician';

        var query = {
            pageController: 'page',
            pagenum: pagenumber,
            searchController: 'search',
            selectedstatecode: $cookies.selectedStatecode,
            recordsBy: $scope.recordsBy
        };

        debugger;

        $scope.patients = null;
		$scope.patientsSafe = null;

        Patients.patientWithReportSearch().save(query).$promise.then(function (patients) {
	       homeDashboaardData(patients)
	    });

    };

    function homeDashboaardData(patients){
    	 debugger;
         var countPatient = patients.data.patients.length;
		 $scope.isLoadDashboard = false;

         if (countPatient == 0) {
             $scope.patientYes = false;
         } else {
             $scope.patients = patients.data.patients;
			 $scope.patientsSafe = patients.data.patients;
             $scope.totalItems = patients.data.totalitem;
             $scope.noOfPages = patients.data.pages;
         }
         hideLoader();
    }

    $scope.commaseperateArray = function (val) {
    	if(val){
	    	var address='';
	    	if(val.addressline1){
	    		address=val.addressline1;
	    	}
	    	if(val.addressline2){
	    		address=address+', '+val.addressline2;
	    	}
	    	if(val.city){
	    		address=address+', '+val.city;
	    	}
	    	if(val.state){
	    		address=address+', '+val.state;
	    	}
	    	if(val.zipcode){
	    		address=address+', '+val.zipcode;
	    	}
	    	address = address.replace(/^,/, '');

	    	return address;

    	}else{
    		return ;
    	}

    }

    $scope.recentPatientsLeft = function () {
        $scope.currentPage = $scope.currentPage + 1
        $scope.recentPatients($scope.currentPage);
    }

    $scope.recentPatientsRight = function () {
        $scope.currentPage = $scope.currentPage - 1
        $scope.recentPatients($scope.currentPage);
    }

    $scope.recentPatients = function (pagenumber) {

        if (pagenumber == null)
            pagenumber = 1;

        var query = {
            pageController: 'page',
            pagenum: pagenumber,
            selectedstatecode: $cookies.selectedStatecode
        };

        debugger;

        Patients.getRecentPatients().query(query).$promise.then(function (patients) {
            debugger;
            if (patients[0]) {
                $scope.recentpatients = patients[0].patients;
                $scope.recenttotalItems = patients[0].totalitem;
                $scope.recentnoOfPages = patients[0].pages;
                $scope.patientEmpty = false
				$scope.noRecordsFoundMsg="";
            } else {
                $scope.patientEmpty = true;
				$scope.noRecordsFoundMsg ='<div class="col-sm-12 col-sm-offset alert alert-dismissable alert-danger text-center" ng-hide="noreport">No Patient Found!</div>';
            }
        });

    }

	$scope.trustAsHtml = function(string) {
		return $sce.trustAsHtml(string);
	};

    $scope.createPatient = function (step2form) {
		//$('#btnCreatePatient').attr('disabled', true);

		if(typeof $scope.patient.contactinformation[0].preferredcommunication != 'undefiend'){
    		var communicationmethod = $scope.patient.contactinformation[0].preferredcommunication;

    			if(communicationmethod=='Home phone'){
    				  if(typeof $scope.patient.contactinformation[0].homephone == 'undefiend'){
    					  alert('Please enter home phone number for communication');
    					  return;
    				  } else if($scope.patient.contactinformation[0].homephone == '' || $scope.patient.contactinformation[0].homephone == null){
    					  alert('Please enter home phone number for communication');
    					  return;
    				  }
    			}else if(communicationmethod=='Cell phone'){
  				  if(typeof $scope.patient.contactinformation[0].cellphone == 'undefiend'){
					  alert('Please enter cell phone number for communication');
					  return;
				  } else if($scope.patient.contactinformation[0].cellphone == '' || $scope.patient.contactinformation[0].cellphone == null){
					  alert('Please enter cell phone number for communication');
					  return;
				  }
    			}else if(communicationmethod=='Work phone'){
    				  if(typeof $scope.patient.contactinformation[0].workphone == 'undefiend'){
    					  alert('Please enter work phone number for communication');
    					  return;
    				  } else if($scope.patient.contactinformation[0].workphone == '' || $scope.patient.contactinformation[0].workphone == null){
    					  alert('Please enter work phone number for communication');
    					  return;
    				  }
        		}
    	}


        $scope.submitted = true;
        debugger;
        if (step2form.$valid) {
            $scope.patient.practicename = practicename;
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

            debugger;
            Patients.createPatient().save($scope.patient).$promise.then(function (response) {
                alert('Patient created successfully!');
                //$location.path('/admin/dashboard');
				$scope.openPatientLibrary(response.PatientDetails._id);
            })
        }
        else {
            $scope.submitted = true;
        }
    }

    $scope.getPatient = function (category) {
        if ($cookies.step) {
            $scope.step = $cookies.step;
            delete $cookies['step'];
        }

        var query = {
            category: category,
            patientid: patientid
        };

        Patients.getpatient.query(query).$promise.then(function (patients) {
            debugger;
            $scope.patientrecordno = patients[0].patients[0].patientrecordno;
            $scope.basicinformationall = patients[0].patients[0].basicinformation;
            $scope.contactinformationall = patients[0].patients[0].contactinformation;
            $scope.addressall = patients[0].patients[0].address;
            $scope.emergencycontactinfoall = patients[0].patients[0].emergencycontactinfo;
            $scope.demographicsall = patients[0].patients[0].demographics;
            $scope.occupationall = patients[0].patients[0].occupation;

			$scope.medicalhistoryall = patients[0].patients[0].medicalhistory;
            $scope.shall = patients[0].patients[0].sh;


			// Athena changes
            //athena patient id
			if($rootScope.currentUser.practiceDetails.isAthena){
               if(typeof patients[0].patients[0].athena_patientid != 'undefined'){
                   $scope.athena_patientid = patients[0].patients[0].athena_patientid;
               }
			}
            //$scope.patient.basicinformation[0] = $filter('filter')($scope.basicinformationall, { 'status': 'current' });

            for (var i = 0; i < patients[0].patients[0].basicinformation.length; i++) {
                if (patients[0].patients[0].basicinformation[i].status == 'current') {
                    $scope.patient.basicinformation[0] = patients[0].patients[0].basicinformation[i];
                    break;
                }
            }

            for (var i = 0; i < patients[0].patients[0].contactinformation.length; i++) {
                if (patients[0].patients[0].contactinformation[i].status == 'current') {
                    $scope.patient.contactinformation[0] = patients[0].patients[0].contactinformation[i];
                    if ($scope.patient.contactinformation[0].homephone) {
                        $scope.patient.contactinformation[0].phonenumberselect = 'Home';
                        if ($scope.patient.contactinformation[0].voicemailradio) {
                            $scope.patient.contactinformation[0].voicemailradio = $scope.patient.contactinformation[0].voicemailradio;
                        }
                        else {
                            $scope.patient.contactinformation[0].voicemailradio = 'No';
                        }

                    }
                    if ($scope.patient.contactinformation[0].workphone) {
                        $scope.patient.contactinformation[0].phonenumberselectsecond = 'Work';
                        if ($scope.patient.contactinformation[0].voicemailsecondradio) {
                            $scope.patient.contactinformation[0].voicemailsecondradio = $scope.patient.contactinformation[0].voicemailsecondradio;
                        }
                        else {
                            $scope.patient.contactinformation[0].voicemailsecondradio = 'No';
                        }
                    }
                    if ($scope.patient.contactinformation[0].cellphone) {
                        $scope.patient.contactinformation[0].phonenumberselectthird = 'Cell';
                        if ($scope.patient.contactinformation[0].voicemailthirdradio) {
                            $scope.patient.contactinformation[0].voicemailthirdradio = $scope.patient.contactinformation[0].voicemailthirdradio;
                        }
                        else {
                            $scope.patient.contactinformation[0].voicemailthirdradio = 'No';
                        }
                    }
                    break;
                }
            }

            for (var i = 0; i < patients[0].patients[0].address.length; i++) {
                if (patients[0].patients[0].address[i].status == 'current') {
                    $scope.patient.address[0] = patients[0].patients[0].address[i];
                    break;
                }
            }

            for (var i = 0; i < patients[0].patients[0].emergencycontactinfo.length; i++) {
                if (patients[0].patients[0].emergencycontactinfo[i].status == 'current') {
                    $scope.patient.emergencycontactinfo[0] = patients[0].patients[0].emergencycontactinfo[i];
                    break;
                }
            }

            for (var i = 0; i < patients[0].patients[0].demographics.length; i++) {
                if (patients[0].patients[0].demographics[i].status == 'current') {
                    $scope.patient.demographics[0] = patients[0].patients[0].demographics[i];
                    break;
                }
            }

            for (var i = 0; i < patients[0].patients[0].occupation.length; i++) {
                if (patients[0].patients[0].occupation[i].status == 'current') {
                    $scope.patient.occupation[0] = patients[0].patients[0].occupation[i];
                    break;
                }
            }

			for (var i = 0; i < patients[0].patients[0].medicalhistory.length; i++) {
                if (patients[0].patients[0].medicalhistory[i].status == 'current') {
                    $scope.patient.medicalhistory[0] = patients[0].patients[0].medicalhistory[i];
                    break;
                }
            }

            for (var i = 0; i < patients[0].patients[0].sh.length; i++) {
                if (patients[0].patients[0].sh[i].status == 'current') {
                    $scope.patient.sh[0] = patients[0].patients[0].sh[i];
                    break;
                }
            }

        });
    }

     $scope.clearCheckBoxGeneralPrior=function(){

    	$scope.patient.medicalhistory[0].shgeneralreviewpriorothertext=null;
        $scope.patient.medicalhistory[0].shgeneraleyesothertext=null;
        $scope.patient.medicalhistory[0].shgeneralthroatothertext=null;
        $scope.patient.medicalhistory[0].shgeneralcardiovascularothertext=null;
        $scope.patient.medicalhistory[0].shgeneralrespiratoryothertext=null;
        $scope.patient.medicalhistory[0].shgeneralgastrointestinalothertext=null;
        $scope.patient.medicalhistory[0].shgeneralgenitourinaryothertext=null;
        $scope.patient.medicalhistory[0].shgeneralmusculoskeletalothertext=null;
        $scope.patient.medicalhistory[0].shgeneralskinothertext=null;
        $scope.patient.medicalhistory[0].shgeneralneurologicalothertext=null;
        $scope.patient.medicalhistory[0].shgeneralpsychiatricothertext=null;
        $scope.patient.medicalhistory[0].shgeneralendocrineothertext=null;
        $scope.patient.medicalhistory[0].shgeneralhematologicalothertext=null;
        $scope.patient.medicalhistory[0].shgeneralallergicothertext=null;

        $scope.patient.medicalhistory[0].shgeneralreviewpriorcheck=[];
        $scope.patient.medicalhistory[0].shgeneralconstitutionalcheck=[];
        $scope.patient.medicalhistory[0].negativeshgeneralconstitutionalcheck=[];
        $scope.patient.medicalhistory[0].shgeneraleyescheck=[];
        $scope.patient.medicalhistory[0].shgeneralthroatcheck=[];
        $scope.patient.medicalhistory[0].shgeneralcardiovascularcheck=[];
        $scope.patient.medicalhistory[0].shgeneralrespiratorycheck=[];
        $scope.patient.medicalhistory[0].shgeneralgastrointestinalcheck=[];
        $scope.patient.medicalhistory[0].shgeneralgenitourinary=[];
        $scope.patient.medicalhistory[0].shgeneralmusculoskeletalcheck=[];
        $scope.patient.medicalhistory[0].shgeneralskincheck=[];
        $scope.patient.medicalhistory[0].shgeneralneurologicalcheck=[];
        $scope.patient.medicalhistory[0].shgeneralpsychiatric=[];
        $scope.patient.medicalhistory[0].shgeneralendocrinecheck=[];
        $scope.patient.medicalhistory[0].shgeneralhematologicalcheck=[];
        $scope.patient.medicalhistory[0].shgeneralallergiccheck=[];
    }

    $scope.updatePatient = function (category) {

        switch (category) {
            case 'basicinformation':
                $scope.categorynewdata = $scope.patient.basicinformation[0];
                $scope.basicinformationform.$setPristine();
                break;
            case 'contactinformation':
                $scope.categorynewdata = $scope.patient.contactinformation[0];
                $scope.contactinformationform.$setPristine();
                break;
            case 'address':
                $scope.categorynewdata = $scope.patient.address[0];
                $scope.addressmainform.$setPristine();
                break;
            case 'emergencycontactinfo':
                $scope.categorynewdata = $scope.patient.emergencycontactinfo[0];
                $scope.emergencyform.$setPristine();
                break;
            case 'demographics':
                $scope.categorynewdata = $scope.patient.demographics[0];
                $scope.demographicsform.$setPristine();
                break;
            case 'occupation':
                $scope.categorynewdata = $scope.patient.occupation[0];
                $scope.occupationform.$setPristine();
                break;

			case 'medicalhistory':
                $scope.categorynewdata = $scope.patient.medicalhistory[0];
                $scope.medicalhistoryform.$setPristine();
                break;
            case 'sh':
            	$scope.categorynewdata = $scope.patient.sh[0];
                $scope.shform.$setPristine();
                break;
        }

        var query = {
            patientid: patientid,
            category: category,
            categorynewdata: $scope.categorynewdata
        };

        Patients.updatePatient().save(query).$promise.then(function (patients) {
            alert('Data updated successfully!');
        });

    }

    $scope.updatePatientDemographics = function (categoryform, category, step) {
        debugger;
        $scope.submitted = true;
        var flag = true;
        if (categoryform.$valid) {
            switch (category) {
                case 'basicinformation':
                    var dob = Date.parse($scope.patient.basicinformation[0].dateofbirth);
                    var dod = Date.parse($scope.patient.basicinformation[0].dateofdeath);

                    if (dob > dod) {
                        alert('Date of Death cannot be before Date of Birth');
						return false;
                    }
                    else {
                        $scope.categorynewdata = $scope.patient.basicinformation[0];
                        $scope.basicinformationform.$setPristine();
                    }
                    break;
                case 'contactinformation':
                    $scope.categorynewdata = $scope.patient.contactinformation[0];
                    $scope.contactinformationform.$setPristine();
                    break;
                case 'address':
                    $scope.categorynewdata = $scope.patient.address[0];
                    $scope.addressmainform.$setPristine();
                    break;
                case 'emergencycontactinfo':
                    $scope.categorynewdata = $scope.patient.emergencycontactinfo[0];
                    $scope.emergencyform.$setPristine();
                    break;
                case 'demographics':
                    $scope.categorynewdata = $scope.patient.demographics[0];
                    $scope.demographicsform.$setPristine();
                    break;
                case 'occupation':
                    $scope.categorynewdata = $scope.patient.occupation[0];
                    $scope.occupationform.$setPristine();
                    break;

				case 'medicalhistory':

                    $scope.categorynewdata = $scope.patient.medicalhistory[0];
                    $scope.medicalhistoryform.$setPristine();
                    break;

                case 'sh':

                	$scope.categorynewdata = $scope.patient.sh[0];
                    $scope.shform.$setPristine();
                    break;
            }

            if (flag) {
                var query = {
                    patientid: patientid,
                    category: category,
                    categorynewdata: $scope.categorynewdata
                };
                debugger;
                Patients.updatePatient().save(query).$promise.then(function (patients) {
                    if (step != 'back') {
                        alert('Data updated successfully!');
                        debugger;
                        //$route.reload();
                        debugger;
                        $cookies.step = step;
                    }
                });
            }
        }
    }

    $scope.OnlyDevStaging = function () {
        $scope.domainName = window.location.host;

        $scope.showDocxBtn = false;
        if ($scope.domainName == 'localhost:9000' || $scope.domainName == 'localhost:3000' || $scope.domainName == 'ratefastcloud.azurewebsites.net') {
            return true;
        }
        return false;
    }

    $scope.downloadDFRDiscovery = function () {
        debugger;
        $scope.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
        if ($scope.isSafari) {
            var filename = $filter('date')(Date.now(), 'MM-dd-yyyy') + ' ' + $rootScope.currentUser.practicename + ' DFR Discovery.csv';
            //var filename = '04-08-2015 johnpractice DFR Discovery.zip';
        } else {
            var filename = $filter('date')(Date.now(), 'MM-dd-yyyy') + ' ' + $rootScope.currentUser.practicename + ' DFR Discovery.csv';
        }

        var query = {
            practicename: $rootScope.currentUser.practicename,
            state: $cookies.selectedStatecode
        }
        var content = 'Report Id,Employer Name,Employer Address,Location of Injury,Injured Body Part,Mechanism of Injury,Toxins,Hospitalization,Work Status';

        Patients.getDFRDiscovery().query(query).$promise.then(function (patients) {
            debugger;
            if (patients[0].dfrdata.length > 0) {
                for (var i = 0; i < patients[0].dfrdata.length; i++) {
                    content = content.concat('\n');
                    content = content.concat(patients[0].dfrdata[i]._id + ',');
                    if (patients[0].dfrdata[i].data.bginfo) {
                        content = content.concat(patients[0].dfrdata[i].data.bginfo.company + ',');
                        content = content.concat(patients[0].dfrdata[i].data.bginfo.emp_address1 + ' ' + patients[0].dfrdata[i].data.bginfo.emp_address2 + ' ' + patients[0].dfrdata[i].data.bginfo.emp_city + ' ' + patients[0].dfrdata[i].data.bginfo.emp_state + ' ' + patients[0].dfrdata[i].data.bginfo.emp_zipcode + ',');
                        content = content.concat(patients[0].dfrdata[i].data.bginfo.location_address1 + ' ' + patients[0].dfrdata[i].data.bginfo.location_address2 + ' ' + patients[0].dfrdata[i].data.bginfo.location_city + ' ' + patients[0].dfrdata[i].data.bginfo.location_state + ' ' + patients[0].dfrdata[i].data.bginfo.location_zipcode + ',');
                    }
                    if (patients[0].dfrdata[i].data.selectinjuries) {
                        for (var j = 0; j < patients[0].dfrdata[i].data.selectinjuries.sibodypart.length; j++) {
                            debugger;
                            var side = patients[0].dfrdata[i].data.selectinjuries.sibodypart[j].bdsides != 'n/a' ? patients[0].dfrdata[i].data.selectinjuries.sibodypart[j].bdsides != 'none' ? patients[0].dfrdata[i].data.selectinjuries.sibodypart[j].bdsides : '' : '';
                            if (patients[0].dfrdata[i].data.selectinjuries.sibodypart[j].text == 'Other') {

                                content = content.concat(patients[0].dfrdata[i].data.selectinjuries.sibodypart[j].bdsystemother + ' - ' + patients[0].dfrdata[i].data.selectinjuries.sibodypart[j].bdpartother + ' ' + side + ',');
                                content = content.concat(patients[0].dfrdata[i].data.selectinjuries.sibodypart[j].bdmechanism.toLowerCase() == 'other' ? patients[0].dfrdata[i].data.selectinjuries.sibodypart[j].bdmechanismother : patients[0].dfrdata[i].data.selectinjuries.sibodypart[j].bdmechanism + ',');
                            } else {
                                content = content.concat(patients[0].dfrdata[i].data.selectinjuries.sibodypart[j].bodysystem + ' - ' + patients[0].dfrdata[i].data.selectinjuries.sibodypart[j].text + ' ' + side + ',');
                                content = content.concat(patients[0].dfrdata[i].data.selectinjuries.sibodypart[j].bdmechanism.toLowerCase() == 'other' ? patients[0].dfrdata[i].data.selectinjuries.sibodypart[j].bdmechanismother : patients[0].dfrdata[i].data.selectinjuries.sibodypart[j].bdmechanism + ',');
                            }
                            break;
                        }
                    }
                    content = content.concat(patients[0].dfrdata[i].data.decisionmaking ? patients[0].dfrdata[i].data.decisionmaking.mdmq2 + ',' : ',');
                    content = content.concat(patients[0].dfrdata[i].data.decisionmaking ? patients[0].dfrdata[i].data.decisionmaking.mdmq3 + ',' : ',');
                    content = content.concat(patients[0].dfrdata[i].data.workrestriction ? patients[0].dfrdata[i].data.workrestriction.WRpatientReturnOptions == 'Yes' ? 'Full duty' : patients[0].dfrdata[i].data.workrestriction.WRpatientReturnOptions == 'Yes with modifications' ? 'Modified' : patients[0].dfrdata[i].data.workrestriction.WRpatientReturnOptions == 'No' ? 'TTD' : ',' + ',' : ',');
                    debugger;
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

            } else {
                $scope.popupMessage('Sorry, there are not currently any Doctors First Reports, so there is no data to display!', 400);
            }
        });
    };

    $scope.popupMessage = function (message, width) {
        $rootScope.modalInstance = $modal.open({
            templateUrl: 'partials/popupmessage.html',
            controller: 'popupMessagectrl',
            resolve: {
                message: function () {
                    return message;
                }
            }

        });

    };

    function updateRecentViews(patientId) {

        var query = {
            patientid: patientId
        };
        Patients.updateRecentViews().save(query, function () {

        });
    };

    $scope.validateform1 = function (step1form) {
        $scope.submitted = true;
        if (step1form.$valid) {
			debugger;
            var dob = $scope.patient.basicinformation[0].dateofbirth;
            var dod = $scope.patient.basicinformation[0].dateofdeath;

			var currDt = new Date();

			var dobYear = dob.getFullYear();
			var currYear = currDt.getFullYear();

			if(currYear-dobYear>110)
			{
				alert('Please enter a valid Date of Birth');
				return false;
			}
			else
			{
                $scope.step = 2;
                $scope.submitted = false;
            }
            if (dod) {
                if (dob > dod) {
                    alert('Date of Death cannot be before Date of Birth');
					$scope.step = 1;
					$scope.submitted = false;
                }
                else {
                    $scope.step = 2;
                    $scope.submitted = false;
                }
            }
            else {
                $scope.step = 2;
                $scope.submitted = false;
            }
        }
        else {
            $scope.step = 1;
            $scope.submitted = true;
        }
        //$scope.step = 2;
    };

    $scope.checkunknown = function (ctrl) {
        ctrl.$setValidity('required', true);
        ctrl.disabled = true;
        document.getElementById('basicsocialsecurity').disabled = true;
        document.getElementById("basicsocialsecurityunknown").checked = false;
        document.getElementById("basicsocialsecurityvalid").checked = true;
        $scope.flagSocial = true;

    };

    $scope.uncheckunknown = function (ctrl) {
        ctrl.$setValidity('required', false);
        ctrl.disabled = false;
        document.getElementById('basicsocialsecurity').disabled = false;
    };

    $scope.checkoccupunknown = function (ctrl) {
        ctrl.$setValidity('required', true);
        ctrl.disabled = true;
        document.getElementById('occupcurrent').disabled = true;
        document.getElementById("occupcurrentunknown").checked = false;
        document.getElementById("occupvalid").checked = true;
        $scope.flagSocial = true;

    };

    $scope.uncheckoccupunknown = function (ctrl) {
        ctrl.$setValidity('required', false);
        ctrl.disabled = false;
        document.getElementById('occupcurrent').disabled = false;
    };

    $scope.checkaddressunknown = function (ctrl) {
        ctrl.addline1.$setValidity('required', true);
        ctrl.addline2.$setValidity('required', true);
        ctrl.addcity.$setValidity('required', true);
        ctrl.addstate.$setValidity('required', true);
        ctrl.addzip.$setValidity('required', true);
        document.getElementById("addressvalid").disabled = true;
        $scope.flagSocial = true;
    };

    $scope.checkcellunknown = function (ctrl) {
        ctrl.$setValidity('required', true);
        ctrl.disabled = true;
        document.getElementById('contactcellphone').disabled = true;
        document.getElementById("contactcellphoneunknown").checked = false;
        document.getElementById("contactcellphonevalid").checked = true;
        $scope.flagSocial = true;

    };

    $scope.uncheckcellunknown = function (ctrl) {
        ctrl.$setValidity('required', false);
        ctrl.disabled = false;
        document.getElementById('contactcellphone').disabled = false;
    };

    $scope.clearForm = function (formdata) {
        var result = confirm('Are you sure that you want to clear all fields? \n\nAll information that you have entered for this patient will be lost.');
        if (result == true) {
            $scope.submitted = false;
            if (formdata == 'step1form') {
                $scope.patient.basicinformation = [{
                    patientrecordno: null,
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
                    extension: null,
                    phonenumberselectthird: null,
                    phonenumberselectsecond: null,
                    phonenumberselect: null,
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
                    state: '',
                    zipcode: null,
                    status: null,
                    updateddate: Date.now(),
                    updatedby: $rootScope.currentUser.username
                }];
            }
            else {
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
                            state: null,
                            zipcode: null
                        }
                    ],
                    status: null,
                    updateddate: Date.now(),
                    updatedby: $rootScope.currentUser.username
                }];
            }
        }

    };

    $scope.formatZip = function () {
        debugger;
        if ($scope.patient.address[0].zipcode.length < 5) { // (11) 9 means mobile, or instead, you could use a regex
            $scope.patient.address[0].zipcode = '';
        }
        else if ($scope.patient.address[0].zipcode.length > 5 && $scope.patient.address[0].zipcode.length < 9) {
            $scope.patient.address[0].zipcode = '';
        }
        else {
            var zipcodeFirst = $scope.patient.address[0].zipcode.slice(0, 5);
            var zipcodeLast = $scope.patient.address[0].zipcode.slice(5, 9);
            if ($scope.patient.address[0].zipcode.length > 5) {
                var zipcodeArray = $scope.patient.address[0].zipcode.slice(0, 5) + '-' + $scope.patient.address[0].zipcode.slice(5, 9);
                $scope.patient.address[0].zipcode = zipcodeArray;
            }
        }
    };

    $scope.formatEmergencyZip = function () {
        debugger;
        if ($scope.patient.emergencycontactinfo[0].address[0].zipcode.length < 5) { // (11) 9 means mobile, or instead, you could use a regex
            $scope.patient.emergencycontactinfo[0].address[0].zipcode = '';
        }
        else if ($scope.patient.emergencycontactinfo[0].address[0].zipcode.length > 5 && $scope.patient.emergencycontactinfo[0].address[0].zipcode.length < 9) {
            $scope.patient.emergencycontactinfo[0].address[0].zipcode = '';
        }
        else {
            var zipcodeFirst = $scope.patient.emergencycontactinfo[0].address[0].zipcode.slice(0, 5);
            var zipcodeLast = $scope.patient.emergencycontactinfo[0].address[0].zipcode.slice(5, 9);
            if ($scope.patient.emergencycontactinfo[0].address[0].zipcode.length > 5) {
                var zipcodeArray = $scope.patient.emergencycontactinfo[0].address[0].zipcode.slice(0, 5) + '-' + $scope.patient.emergencycontactinfo[0].address[0].zipcode.slice(5, 9);
                $scope.patient.emergencycontactinfo[0].address[0].zipcode = zipcodeArray;
            }
        }
    };

    $scope.cancelForm = function () {
        var result = confirm('Are you sure that you want to cancel? \n\nAll information that you have entered for this patient will be lost.');
        if (result == true) {
            window.location = '/admin/dashboard';
        }
    };

    $scope.statesList = function () {
        debugger;
        StatesList.query(function (states) {
            debugger;
            $scope.states = states;
            //$scope.patient.address[0].state = 'CA';
            //$scope.patient.emergencycontactinfo[0].address[0].state = 'CA';
        });
    };

    $scope.mapClick = function () {
        debugger;
        //$cookies.selectedState = 'California';
        //$cookies.selectedStatecode = 'CA';
        $cookies.selectedState = $scope.selectedState.state;
        $cookies.selectedStatecode = $scope.selectedState.statecode;
        $rootScope.currentState = $cookies.selectedState;

        $('.jvectormap-label').css('display', 'none');

        if ($rootScope.currentUser.role == 'rater1' || $rootScope.currentUser.role == 'rater2') {
            $location.path('/submittedreport');
        } else {
            $location.path('/admin/dashboard');
        }

    };

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

		/*Athena changes*/
		try{
            if ($sessionStorage.athena_patient_id) {
                delete $sessionStorage.athena_patient_id;
            }
        }catch(err){}
		/*Athena changes*/

        updateRecentViews(patientId);
        $rootScope.patientId = patientId;
        $sessionStorage.patientId = patientId;
        $location.path('/patient/createinjury');
    }

    $scope.openarchivepopup = function (modeldata, category, step) {
        debugger;
        $scope.isLoad = true;
        var patientCategory = { patientid: patientid, category: null };
        patientCategory.category = category;
        debugger;
        switch (category) {
            case 'basicinformation':
                var columns = ["firstname", "middlename", "lastname", "gender", "dateofbirth", "dateofdeath", "socialsecurityno", "employeehandedness", "updateddate", "updatedby"];
                var columnHeaders = ["First name", "Middle name", "Last name", "Gender", "Date of birth", "Date of death", "Social security no", "Employee Handedness", "Updated", "Updated by"];
                break;
            case 'contactinformation':
                var columns = ["email", "homephone", "cellphone", "workphone", "extension", "preferredcommunication", "preferredcommunicationother", "updateddate", "updatedby"];
                var columnHeaders = ["Email", "Home phone", "Cell phone", "Work phone", "Extension", "Preferred communication", "Preferred communication other", "Updated date", "Updated by"];
                break;
            case 'address':
                var columns = ["addressline1", "addressline2", "city", "state", "zipcode", "updateddate", "updatedby"];
                var columnHeaders = ["Address line 1", "Address line 2", "City", "State", "Zip code", "Updated date", "Updated by"];
                break;
            case 'emergencycontactinfo':
                var columns = ["relationship", "firstname", "lastname", "email", "homephone", "cellphone", "workphone", "extension", "addressline1", "updateddate", "updatedby"];
                var columnHeaders = ["Relationship", "First name", "Last name", "Email", "Home phone", "Cell phone", "Work phone", "Extension", "Address", "Updated date", "Updated by"];
                break;
            case 'demographics':
                var columns = ["preferredlanguage", "preferredlanguageother", "ethnicity", "ethnicityother", "race", "raceother", "updateddate", "updatedby"];
                var columnHeaders = ["Preferred language", "Preferred language other", "Nationality", "Nationality other", "Ethnicity", "Ethnicity other", "Updated date", "Updated by"];
                break;
            case 'occupation':
                var columns = ["currentoccupation", "currentoccupationother", "updateddate", "updatedby"];
                var columnHeaders = ["Current occupation", "Current occupation other", "Updated date", "Updated by"];
                break;

			case 'medicalhistory' :
            	var columns = ["shgeneralpriorhealthradio","shgeneralhealthpriorsurgeryradio","shcurrentmedicationradio","shpriorillnessradio", "updateddate","updatedby"];
                var columnHeaders = ["Prior illness","Prior surgery","Current (all) medications","General Prior illness", "Updated date","Updated by"];
                break;
            case 'sh' :
            	var columns = ["SHrdoMaritalStatus","SHrdoEmploymentStatus","updateddate","updatedby"];
                var columnHeaders = ["Marital Status","Employment Status","Updated date","Updated by"];
                break;
        }

        var template = 'partials/patient-archive-popup.html';
        $rootScope.modalInstance = $modal.open({
            templateUrl: template,
            windowClass: 'pdp-modal-window',
            controller: 'patientarchivectrl',
            resolve: {
                data: function () {
                    return modeldata;
                },
                columns: function () {
                    return columns;
                },
                columnHeaders: function () {
                    return columnHeaders;
                },
                patientCategory: function () {
                    return patientCategory;
                },
                injuryId: function () {
                    return null;
                },
                category: function () {
                    return category;
                },
                step: function () {
                    return step;
                }
            }
        });
        $rootScope.modalInstance.result.then(function (result) {
            debugger;
            $scope.isLoad = false;
            $scope.setArchiveData(category);
        }, function () {
            debugger;
            $scope.isLoad = false;
            //$route.reload();
            $scope.setArchiveData(category);
        });
    };

    $scope.setArchiveData = function (category) {
        if ($cookies.step) {
            $scope.step = $cookies.step;
            delete $cookies['step'];
        }

        var query = {
            category: category,
            patientid: patientid
        };

        Patients.getpatient.query(query).$promise.then(function (patients) {
            debugger;
            $scope.patientrecordno = patients[0].patients[0].patientrecordno;
            $scope.basicinformationall = patients[0].patients[0].basicinformation;
            $scope.contactinformationall = patients[0].patients[0].contactinformation;
            $scope.addressall = patients[0].patients[0].address;
            $scope.emergencycontactinfoall = patients[0].patients[0].emergencycontactinfo;
            $scope.demographicsall = patients[0].patients[0].demographics;
            $scope.occupationall = patients[0].patients[0].occupation;
			$scope.medicalhistoryall = patients[0].patients[0].medicalhistory;
            $scope.shall = patients[0].patients[0].sh;

            //$scope.patient.basicinformation[0] = $filter('filter')($scope.basicinformationall, { 'status': 'current' });
            if (category == 'basicinformation') {
                for (var i = 0; i < patients[0].patients[0].basicinformation.length; i++) {
                    if (patients[0].patients[0].basicinformation[i].status == 'current') {
                        $scope.patient.basicinformation[0] = patients[0].patients[0].basicinformation[i];
                        break;
                    }
                }
            }
            if (category == 'contactinformation') {
                for (var i = 0; i < patients[0].patients[0].contactinformation.length; i++) {
                    if (patients[0].patients[0].contactinformation[i].status == 'current') {
                        $scope.patient.contactinformation[0] = patients[0].patients[0].contactinformation[i];
                        if ($scope.patient.contactinformation[0].homephone) {
                            $scope.patient.contactinformation[0].phonenumberselect = 'Home';
                            if ($scope.patient.contactinformation[0].voicemailradio) {
                                $scope.patient.contactinformation[0].voicemailradio = $scope.patient.contactinformation[0].voicemailradio;
                            }
                            else {
                                $scope.patient.contactinformation[0].voicemailradio = 'No';
                            }

                        }
                        if ($scope.patient.contactinformation[0].workphone) {
                            $scope.patient.contactinformation[0].phonenumberselectsecond = 'Work';
                            if ($scope.patient.contactinformation[0].voicemailsecondradio) {
                                $scope.patient.contactinformation[0].voicemailsecondradio = $scope.patient.contactinformation[0].voicemailsecondradio;
                            }
                            else {
                                $scope.patient.contactinformation[0].voicemailsecondradio = 'No';
                            }
                        }
                        if ($scope.patient.contactinformation[0].cellphone) {
                            $scope.patient.contactinformation[0].phonenumberselectthird = 'Cell';
                            if ($scope.patient.contactinformation[0].voicemailthirdradio) {
                                $scope.patient.contactinformation[0].voicemailthirdradio = $scope.patient.contactinformation[0].voicemailthirdradio;
                            }
                            else {
                                $scope.patient.contactinformation[0].voicemailthirdradio = 'No';
                            }
                        }
                        break;
                    }
                }
            }

            if (category == 'address') {
                for (var i = 0; i < patients[0].patients[0].address.length; i++) {
                    if (patients[0].patients[0].address[i].status == 'current') {
                        $scope.patient.address[0] = patients[0].patients[0].address[i];
                        break;
                    }
                }
            }
            if (category == 'emergencycontactinfo') {
                for (var i = 0; i < patients[0].patients[0].emergencycontactinfo.length; i++) {
                    if (patients[0].patients[0].emergencycontactinfo[i].status == 'current') {
                        $scope.patient.emergencycontactinfo[0] = patients[0].patients[0].emergencycontactinfo[i];
                        break;
                    }
                }
            }

            if (category == 'demographics') {
                for (var i = 0; i < patients[0].patients[0].demographics.length; i++) {
                    if (patients[0].patients[0].demographics[i].status == 'current') {
                        $scope.patient.demographics[0] = patients[0].patients[0].demographics[i];
                        break;
                    }
                }
            }

            if (category == 'occupation') {
                for (var i = 0; i < patients[0].patients[0].occupation.length; i++) {
                    if (patients[0].patients[0].occupation[i].status == 'current') {
                        $scope.patient.occupation[0] = patients[0].patients[0].occupation[i];
                        break;
                    }
                }
            }

			 if (category == 'medicalhistory') {
                for (var i = 0; i < patients[0].patients[0].medicalhistory.length; i++) {
                    if (patients[0].patients[0].medicalhistory[i].status == 'current') {
                        $scope.patient.medicalhistory[0] = patients[0].patients[0].medicalhistory[i];
                        break;
                    }
                }
            }

            if (category == 'sh') {
                for (var i = 0; i < patients[0].patients[0].sh.length; i++) {
                    if (patients[0].patients[0].sh[i].status == 'current') {
                        $scope.patient.sh[0] = patients[0].patients[0].sh[i];
                        break;
                    }
                }
            }

        });
    }

    $scope.goBack = function () {

        if ($scope.basicinformationform.$dirty || $scope.contactinformationform.$dirty || $scope.addressform.$dirty || $scope.emergencyform.$dirty || $scope.demographicsform.$dirty || $scope.occupationform.$dirty || $scope.medicalhistoryform.$dirty || $scope.shform.$dirty) {
            var result = confirm('New information on this page has not been saved. \n\nDo you want to save your information before leaving?');
            if (result == true) {
                debugger;
                if ($scope.basicinformationform.$dirty)
                    $scope.updatePatientDemographics($scope.basicinformationform, 'basicinformation', 'back');
                if ($scope.contactinformationform.$dirty)
                    $scope.updatePatientDemographics($scope.contactinformationform, 'contactinformation', 'back');
                if ($scope.addressform.$dirty)
                    $scope.updatePatientDemographics($scope.addressform, 'address');
                if ($scope.emergencyform.$dirty)
                    $scope.updatePatientDemographics($scope.emergencyform, 'emergencycontactinfo', 'back');
                if ($scope.demographicsform.$dirty)
                    $scope.updatePatientDemographics($scope.demographicsform, 'demographics', 'back');
                if ($scope.occupationform.$dirty)
                    $scope.updatePatientDemographics($scope.occupationform, 'occupation', 'back');
				if ($scope.medicalhistoryform.$dirty)
                    $scope.updatePatientDemographics($scope.medicalhistoryform, 'medicalhistory', 'back');
                if ($scope.shform.$dirty)
                    $scope.updatePatientDemographics($scope.shform, 'sh', 'back');
            }
        }
    };

    $scope.addanotherPhone = function (section, patientdata) {
        if (patientdata) {
            if (section == '1' && patientdata.phonenumberselect != '' && patientdata.contactinformation[0].homephone.length == '10' && patientdata.phonenumberselectsecond != '' && patientdata.contactinformation[0].cellphone.length == '10') {
                $scope.sectiondataid = '2';
                $scope.hideaddanotherButton = true;
            }
            else {
                $scope.sectionid = '1';
            }
        }
    }

    $scope.deletePhone = function (section, selectid) {
        debugger;
        if (section == '1') {
            $scope.sectionid = '0';
            $scope.patient.contactinformation[0].phonenumberselectsecond = '';
            if (selectid) {
                var selectedid = selectid.toLowerCase() + 'phone';
                $scope.patient.contactinformation[0][selectedid] = '';
            }
            $scope.hideaddanotherButton = false;
        }
        if (section == '2') {
            $scope.sectiondataid = '0';
            $scope.patient.contactinformation[0].phonenumberselectthird = '';
            if (selectid) {
                var selectedid = selectid.toLowerCase() + 'phone';
                $scope.patient.contactinformation[0][selectedid] = '';
            }
            $scope.hideaddanotherButton = false;
        }
    }

    // Patient Demographics

    $scope.unknownCheckboxValidation = function (ctrl, id) {
        if (document.getElementById(id).checked) {
            ctrl.$setValidity('required', true);
        }
        else {
            ctrl.$setValidity('required', false);
        }
    }

    // Search

    $rootScope.search = {
        lastname: '',
        firstname: '',
        dateofbirth: '',
        socialsecurityno: '',
		Male:'',
        Female:'',
        confirmed:''
    }

    $scope.searchPatients = function () {
        $scope.listRecords(1);
    }

    $scope.resetSearch = function () {
        $rootScope.search = {
            lastname: '',
            firstname: '',
            dateofbirth: '',
            socialsecurityno: '',
			Male:'',
            Female:'',
            confirmed:''
        }
        $scope.searchReport={};
    }

    // Date Picker

    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        startingDay: 1,
        changeMonth: true,
        changeYear: true,
        showAnim: "clip",
        clearBtn: true,
        yearRange: "-100:+0",
        defaultDate: '-18Y',
        maxDate: new Date,
    };

    $scope.formats = ['mm/dd/yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

	//****************** athena code start ***********************
    // Athena changes (new code)
    $scope.athenaMedication = function () {

    	var query={}
  		query.athena_patientid = $scope.athena_patientid;
  		query.athena_practiceid = $rootScope.currentUser.practiceDetails.athena_practiceid;
  		query.athena_departmentid = $rootScope.currentUser.athena_departmentid;

  		try{

  		if($rootScope.currentUser.practiceDetails.isAthena){
  			$scope.isLoad = true;

	  		$http.get('/api/athena/medications', { params: query }
	  		 ).success(function (athenaMedicationdetails, status, headers, config) {
	  			 var athena_medicatiionMessage = '';
	  			 var athena_ClipboardMedicatiionMessage = '';
	  			 if(typeof athenaMedicationdetails.medicationData != 'undefined'){
	  				if(typeof athenaMedicationdetails.medicationData.medications != 'undefined'){
	  					athenaMedicationdetails.medicationData.medications.forEach(function(medicationItem){
	  							var item =medicationItem[0];
		  	  					if(typeof item.medication != 'undefined'){
			  	  					if(item.medication != null && item.medication != ''){
			  	  						if(athena_medicatiionMessage == ''){
			  	  							athena_medicatiionMessage = athena_medicatiionMessage+" "+ item.medication;
			  	  							athena_ClipboardMedicatiionMessage = athena_ClipboardMedicatiionMessage+" "+ item.medication;
			  	  						}else{
			  	  							athena_medicatiionMessage = athena_medicatiionMessage+"<br/><br/>"+ item.medication;
			  	  							athena_ClipboardMedicatiionMessage = athena_ClipboardMedicatiionMessage+" "+ item.medication;
			  	  						}
		  	  						}
		  	  					}
		  	  					if(typeof item.unstructuredsig != 'undefined'){
		  	  						if(item.unstructuredsig != null && item.unstructuredsig != ''){
		  	  							athena_medicatiionMessage = athena_medicatiionMessage+ ": "+item.unstructuredsig;
		  	  							athena_ClipboardMedicatiionMessage = athena_ClipboardMedicatiionMessage+ ": "+item.unstructuredsig;
		  	  						}else{
		  	  						athena_medicatiionMessage = athena_medicatiionMessage +". ";
		  	  						athena_ClipboardMedicatiionMessage = athena_ClipboardMedicatiionMessage +". ";
		  	  						}
		  	  					}else{
		  	  						athena_medicatiionMessage  = athena_medicatiionMessage +". ";
		  	  						athena_ClipboardMedicatiionMessage = athena_ClipboardMedicatiionMessage +". ";
		  	  					}
	  	  				})
	  				}

	  				if(typeof athenaMedicationdetails.medicationData.nomedicationsreported != 'undefined'){
	  					if(athenaMedicationdetails.medicationData.nomedicationsreported == true){
	  						athena_medicatiionMessage = athena_medicatiionMessage + "<br/><br/> No medications reported.";
	  						athena_ClipboardMedicatiionMessage = athena_ClipboardMedicatiionMessage + "  No medications reported.";
	  					}
	  				}
	  				if(typeof athenaMedicationdetails.medicationData.sectionnote != 'undefined'){
	  					if(athenaMedicationdetails.medicationData.sectionnote != null && athenaMedicationdetails.medicationData.sectionnote != ''){
	  						athena_medicatiionMessage = athena_medicatiionMessage + "<br/><br/>Note: " + athenaMedicationdetails.medicationData.sectionnote;
	  						athena_ClipboardMedicatiionMessage = athena_ClipboardMedicatiionMessage + " Note: " + athenaMedicationdetails.medicationData.sectionnote;
	  					}
	  				}
	  				if(athena_medicatiionMessage ==''){
		  				athena_medicatiionMessage = 'There are no medication for this patient in Athena.';
		  			 }
	  			 }else{
	  				athena_medicatiionMessage = 'There are no medication for this patient in Athena.';
	  			 }

	  			 	var message="<h3><p>"+athena_medicatiionMessage+"</p></h3>"

			        $rootScope.modalInstance = $athenaModal.open({
			        	 templateUrl: 'partials/athena/athena-medicationPopup.html',
				         controller: 'athenaMedicationCtrl',
			            resolve: {
			            	ID: function () {
			                    return '';
			                },
			                confirmButtonText2: function () {
			                    return "Copy to Clipboard";
			                },
			                cancelButtonText: function () {
			                    return "Cancel";
			                },
			                dispalyMessage: function () {
			                    return message;
			                },
			                medicationMsg: function () {
			                    return athena_ClipboardMedicatiionMessage;
			                }
			            }
			        });
			        $rootScope.modalInstance.result.then(function (returndata) {
			            debugger;
			            if (returndata == 'confirm2') {

			            }
			            if (returndata == 'cancel') {
			            	//Popup will close here
			            }
			        }, function (returndata) {
			            debugger;
			            console.log('returndata' + returndata);
			        });
	  		}).catch(function (err) {
	  	      // Log error somehow.

	  			console.log(err);
	  	    }).finally(function () {
	  	    	$scope.isLoad = false;
	  	    });
  		}
  		}catch(err){
  			console.log(err);
  		}
    }

    function checkValues(valType, val){

    	var returnVal = '';
    	if(valType == 'General'){
        	if(typeof val != 'undefined'){
        		if(val != null){
          	  	  return val;
        		}else{
      	  		  return returnVal;
      	  	    }
    	  	 }else{
    	  		  return returnVal;
    	  	 }
    	}

		if(valType == 'PhoneNumber'){
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

    	if(valType == 'Gender'){
    		if(typeof val != 'undefined'){
    			if(val != null){
            	  	  if(val == 'Male'){
            	  		return 'M';
            	  	  }else if(val == 'Female'){
      		  	  		return 'F';
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

    	if(valType == 'ContactPreference'){
    		if(typeof val != 'undefined'){
    			if(val != null){
            	  	  if(val == 'Home phone'){
            	  		return 'HOMEPHONE';
            	  	  }else if(val == 'Cell phone'){
      		  	  		return 'MOBILEPHONE';
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

    }


    $scope.setPatientDataToAthena = function(){
    	try{
	  		if($rootScope.currentUser.practiceDetails.isAthena){

	  			if(typeof $scope.patient.basicinformation[0].firstname == 'undefined' || typeof $scope.patient.basicinformation[0].lastname == 'undefined' || typeof $scope.patient.basicinformation[0].dateofbirth == 'undefined' ){
	  				var message="<h3><p>Patient's Firstname, Lastname and Birthdate must be entered.</p></h3>";
		  			$scope.PopupMessageSingleButton('',message,"Okay");
	  			}else{
		  			$scope.isLoad = true;

		  			// ssn : jr ssn update kela tr 1st 5digit he zero jatil.tyamule athena mdhil original ssn replace hoil

		  			var query={}
		  	  		query.patientid = $scope.athena_patientid;
		  	  		query.practiceid = $rootScope.currentUser.practiceDetails.athena_practiceid;
		  	  		query.departmentid = $rootScope.currentUser.athena_departmentid;

		  	  		//basic info
		  	  			query.firstname = checkValues('General', $scope.patient.basicinformation[0].firstname);
			  	  		query.lastname  = checkValues('General', $scope.patient.basicinformation[0].lastname);
			  	  		query.sex		= checkValues('Gender', $scope.patient.basicinformation[0].gender);

			  	  	//address
					  	query.address1 = checkValues('General', $scope.patient.address[0].addressline1);
					  	query.address2 = checkValues('General', $scope.patient.address[0].addressline2);
					  	query.zip	   = checkValues('General', $scope.patient.address[0].zipcode);
					  	query.city 	   = checkValues('General', $scope.patient.address[0].city);
					  	query.state	   = checkValues('General', $scope.patient.address[0].state);

					//contactinformation
					  	query.email	   = checkValues('General', $scope.patient.contactinformation[0].email);

						var hPhone = checkValues('PhoneNumber', $scope.patient.contactinformation[0].homephone);
					  	if(hPhone !=''){
					  		query.homephone = hPhone;
					  	}

					  	var mPhone = checkValues('PhoneNumber', $scope.patient.contactinformation[0].cellphone);
			  			if(mPhone !=''){
			  				query.mobilephone = mPhone;
			  			}

			  			var wPhone = checkValues('PhoneNumber', $scope.patient.contactinformation[0].workphone);
			  			if(wPhone !=''){
			  				query.workphone = wPhone;
			  			}

			  			var contactpreference =  checkValues('ContactPreference', $scope.patient.contactinformation[0].preferredcommunication);
			  			if(contactpreference != ''){
				  			query.contactpreference = contactpreference;
			  			}

			  		//social history : it must be in uppercase
			  			var maritalstatusname = checkValues('General', $scope.patient.sh[0].SHrdoMaritalStatus);
			  			if(maritalstatusname!=''){
			  				query.maritalstatus = maritalstatusname.charAt(0).toUpperCase();
			  			}


				  	  if(typeof $scope.patient.basicinformation[0].dateofbirth != 'undefined'){
				  		 var dob = new Date($scope.patient.basicinformation[0].dateofbirth);

				  		 var day = dob.getDate() < 10 ? '0'+dob.getDate() : dob.getDate();
				  		 var month = dob.getMonth()+1;
				  		 	 month = month<10 ? '0'+month : month;

				  		 var year = dob.getFullYear();

				  	  	 query.dob = month+"/"+day+"/"+year;
				  	  }

					$http.put('/api/athena/syncpatienttoathena',query).success(function (athenaPatient, status, headers, config) {

		 			 if(athenaPatient.updatedpatient.length>0){
		 				var message="<h3><p>Patient with patient id '" + athenaPatient.updatedpatient[0].patientid + "' was synced successfully.</p></h3>";
			  			$scope.PopupMessageSingleButton('',message,"Okay");
		 			 }else{
		 				var message="<h3><p>Patient synced fail.</p></h3>";
			  			$scope.PopupMessageSingleButton('',message,"Okay");
		 			 }

		 		 }).catch(function (err) {

			  			console.log(err);
			  			$scope.isLoad = false;
			  			var message="<h3><p><strong>Technical Error</strong></p></h3>";
						if(err.data.indexOf('Phone numbers must follow the North American Numbering Plan')>-1)
						{
							message = message + "<h3><p>Athena will not accept the current format of one or more phone numbers for this patient. This often occurs if a phone number has been entered incorrectly. Please check the phone numbers, or clear the phone number fields entirely.</p></h3>";

							message = message + "<h3><p>Here is the error message provided by Athena:</p></h3>";

							message = message + '<h3><p>"Phone numbers must follow the North American Numbering Plan. The following fields are invalid:HOMEPHONE, MOBILEPHONE, WORKPHONE"</p></h3>';
						}
						else
							message = message + "<h3><p>" + err.data + "</p></h3>";
			  			$scope.PopupMessageSingleButton('',message,"Okay");
		  	    }).finally(function () {
		  	    	$scope.isLoad = false;
		  	    });

	    	}
    	  }
	    }catch(err){
	    	$scope.isLoad = false;
	    	console.log(err);
	    }
    }


	$scope.getUpdatedAthenaPatientPhoneNumbers = function(){
       //this function used to only update athena patient phone numbers in ratefast..
       try{
                  if($rootScope.currentUser.practiceDetails.isAthena){
                      $scope.isLoad = true;

                      var query = {};
                      query.patientid = $scope.athena_patientid;
                      query.practiceid = $rootScope.currentUser.practiceDetails.athena_practiceid;
                      query.departmentid = $rootScope.currentUser.athena_departmentid;

                      $http.get('/api/athena/getpatientByID',{ params : query }
                          ).success(function(patinetdata){

                              var phoneValues = {};
                              phoneValues.homephone = checkValues('General', patinetdata.PatientDetail[0].homephone);
                              phoneValues.mobilephone = checkValues('General', patinetdata.PatientDetail[0].mobilephone);
                              phoneValues.workphone = checkValues('General', patinetdata.PatientDetail[0].workphone);

                              $scope.isLoad = false;

                              if(phoneValues.homephone =='' && phoneValues.mobilephone == '' && phoneValues.workphone == ''){
                                  var message="<h3><p>Homephone, Mobilephone and Workphone does not exist for patient "+$scope.athena_patientid+" in athena to update</p></h3>";
                                  $scope.PopupMessageSingleButton('',message,"Okay");
                              }else{
                                   $rootScope.modalInstance = $modal.open({
                                             templateUrl: 'partials/athena/athena-PatientPhonePopup.html',
                                          controller: 'athenaPatientPhonePopupCtrl',
                                            resolve: {
                                              phoneExtension: function () {
                                                return phoneValues;
                                            },
                                                confirmButtonText: function () {
                                                    return 'Proceed';
                                                },
                                                cancelButtonText: function () {
                                                    return 'Cancel';
                                                },
                                                dispalyMessage: function () {
                                                    return '';
                                                }
                                            }
                                        });
                                        $rootScope.modalInstance.result.then(function (returndata) {
                                            if(typeof returndata!='undefined'){
                                                $scope.patient.contactinformation[0].homephone  = returndata.homephone;
                                                $scope.patient.contactinformation[0].cellphone  = returndata.mobilephone;
                                                $scope.patient.contactinformation[0].workphone  = returndata.workphone;
                                                $scope.patient.contactinformation[0].extension  = returndata.workphoneExtension;

											    if(typeof patinetdata.PatientDetail[0].contactpreference != 'undefined'){
												   if(patinetdata.PatientDetail[0].contactpreference == 'HOMEPHONE'){
													$scope.patient.contactinformation[0].preferredcommunication = 'Home phone';
												   }else if(patinetdata.PatientDetail[0].contactpreference == 'MOBILEPHONE'){
													$scope.patient.contactinformation[0].preferredcommunication = 'Cell phone';
												   }
												}


                                                //update to database
                                                $scope.updatePatientDemographics($scope.contactinformationform, 'contactinformation', 'back');

												setTimeout(function(){

													var message="<h3><p>Patient phone numbers for patient id '" + $scope.athena_patientid + "' were synced successfully.</p></h3>";
													$scope.PopupMessageSingleButton('',message,"Okay");
												}, 2000);


                                            }
                                        }, function (err) {
                                            debugger;
                                            // model failed
                                            console.log('err : ' + err);
                                        });

                              }

                          }).catch(function (err) {
                            $scope.isLoad = false;
                              var message="<h3><p>Technical Error : </p></h3> <h3><p>"+ err.data +"</p></h3>";
                              $scope.PopupMessageSingleButton('',message,"Okay");
                          }).finally(function () {

                          });
                  }
           }
       catch(err){
               console.log(err);
               $scope.isLoad = false;
       }
   }

    $scope.getUpdatedAthenaPatientData = function(){
  		try{
	  		if($rootScope.currentUser.practiceDetails.isAthena){
	  			$scope.isLoad = true;
	  			var query={}
				query.patientid = $scope.athena_patientid;
				query.practiceid = $rootScope.currentUser.practiceDetails.athena_practiceid;
				query.departmentid = $rootScope.currentUser.athena_departmentid;

				$http.get('/api/athena/getpatientByID',{ params : query }
					).success(function(patinetdata){

						$http.get('/api/athena/patientmedicalsocialdata',{ params : query }
                         ).success(function(allergypatinetdata){
						  if(typeof allergypatinetdata.alleriesdata.medicalData !='undefined'){
							if(allergypatinetdata.alleriesdata.medicalData !='' && allergypatinetdata.alleriesdata.medicalData !=null){
								$scope.patient.medicalhistory[0].shknownallergiesothertext = allergypatinetdata.alleriesdata.medicalData;
								$scope.updatePatientDemographics($scope.medicalhistoryform, 'medicalhistory', 'back');
							}
						}

						  if(typeof allergypatinetdata.alleriesdata.socialData !='undefined'){
							  if(allergypatinetdata.alleriesdata.socialData !='' && allergypatinetdata.alleriesdata.socialData !=null){
								  $scope.patient.sh[0].chkTobacco = [allergypatinetdata.alleriesdata.socialData];
								  $scope.patient.sh[0].chkCaffeineNegative = [];
								  $scope.updatePatientDemographics($scope.shform, 'sh', 'back');
							  }
                          }

							  }).catch(function (err) {
								console.log("error during fetching medical social data");
                        })

						updatefromAthenatoRatefast(patinetdata.PatientDetail[0]);

					}).catch(function (err) {
						$scope.isLoad = false;
						var message="<h3><p>Technical Error : </p></h3> <h3><p>"+ err.data +"</p></h3>";
						$scope.PopupMessageSingleButton('',message,"Okay");
					}).finally(function () {

					});
	    	}
	    }catch(err){
	    	$scope.isLoad = false;
	    	console.log(err);
	    }
  	}

    var updatefromAthenatoRatefast = function(athenaPatientData){

			//basicinformation
			$scope.patient.basicinformation[0].firstname = athenaPatientData.firstname;
	  		$scope.patient.basicinformation[0].lastname = athenaPatientData.lastname;
	  		$scope.patient.basicinformation[0].dateofbirth = athenaPatientData.dob;

	  		//address
	  		$scope.patient.address[0].addressline1 = checkValues('General', athenaPatientData.address1);
	  		$scope.patient.address[0].addressline2  = checkValues('General', athenaPatientData.address2);
	  		$scope.patient.address[0].zipcode = checkValues('General', athenaPatientData.zip);
	  		$scope.patient.address[0].city  = checkValues('General', athenaPatientData.city);
			$scope.patient.address[0].state  = checkValues('General', athenaPatientData.state);

			//contactinformation
			$scope.patient.contactinformation[0].email  = checkValues('General', athenaPatientData.email);

			//Below two lines commented
			//$scope.patient.contactinformation[0].homephone  = checkValues('General', athenaPatientData.homephone);
			//$scope.patient.contactinformation[0].cellphone  = checkValues('General', athenaPatientData.mobilephone);

			if(typeof athenaPatientData.sex != 'undefined'){
	  			if(athenaPatientData.sex=='M'){
					$scope.patient.basicinformation[0].gender = 'Male';
				}else if(athenaPatientData.sex=='F'){
					$scope.patient.basicinformation[0].gender = 'Female';
				}
	  		}

	//social history
			if(typeof athenaPatientData.maritalstatusname != 'undefined'){
				if(athenaPatientData.maritalstatusname == 'SINGLE' || athenaPatientData.maritalstatusname == 'MARRIED' || athenaPatientData.maritalstatusname == 'DIVORCED' || athenaPatientData.maritalstatusname == 'WIDOWED'){
					if(athenaPatientData.maritalstatusname.length>0){
						var maritalstatustext = athenaPatientData.maritalstatusname.toLowerCase();
						$scope.patient.sh[0].SHrdoMaritalStatus = maritalstatustext.charAt(0).toUpperCase() + maritalstatustext.slice(1);
					}
				}
			}

			 $scope.updatePatientDemographics($scope.basicinformationform, 'basicinformation', 'back');
			 $scope.updatePatientDemographics($scope.contactinformationform, 'contactinformation', 'back');
			 $scope.updatePatientDemographics($scope.addressform, 'address','back');


         setTimeout(function(){
         	$scope.isLoad = false;
         	$scope.PopupMessageSingleButton('',"Patient details successfully synced with Athena!","Okay");
         }, 2000);
    }

    $scope.PopupMessageSingleButton= function(id,message,buttonName){
		 debugger;
	     var messge="<h3><p>"+message+"</p></h3>"
	       $rootScope.modalInstance = $athenaModal.open({
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

    //****************** athena code end ***********************


})



.controller('patientarchivectrl', function ($scope, $http, $routeParams, $modal, $rootScope, $cookies, $modalInstance, data, injuryId, Injuries, columns, columnHeaders, patientCategory, Patients, category, step, $sessionStorage) {
    debugger;
    $scope.isLoad = false;
    $scope.category = category;
    $scope.step = step;
    $scope.cancel = function () {
        debugger;
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        $modalInstance.dismiss('cancel');
    }

    var categorynewdata = new Array();
    var columns = columns;
    var patientCategory = patientCategory;
    var patientid = patientCategory.patientid;
    var category = patientCategory.category;

    $scope.columns = columns;
    $scope.columnHeaders = columnHeaders;
    $scope.rows = data;

    $scope.changeStatus = function (id) {
        debugger;
        var result = confirm('This information will be restored to the patients demographics page.');
        if (result) {
            for (var i = 0; i < $scope.rows.length; i++) {
                if ($scope.rows[i].status == 'current') {
                    $scope.rows[i].status = 'archive';
                }
                if ($scope.rows[i]._id == id) {
                    categorynewdata = $scope.rows[i];
                    categorynewdata.status = 'current';
                }
            }
            debugger;
            var query = {
                patientid: $sessionStorage.patientId,
                category: category,
                categorynewdata: categorynewdata
            };
            debugger;
            Patients.updatePatient().save(query).$promise.then(function (patients) {
                debugger;
                Patients.getpatient.query(query).$promise.then(function (patients) {
                    debugger;
                    $scope.basicinformationall = patients[0].patients[0].basicinformation;
                    $scope.contactinformationall = patients[0].patients[0].contactinformation;
                    $scope.addressall = patients[0].patients[0].address;
                    $scope.emergencycontactinfoall = patients[0].patients[0].emergencycontactinfo;
                    $scope.demographicsall = patients[0].patients[0].demographics;
                    $scope.occupationall = patients[0].patients[0].occupation;
					$scope.medicalhistoryall = patients[0].patients[0].medicalhistory;
                    $scope.shall = patients[0].patients[0].sh;

                    switch (category) {
                        case 'basicinformation':
                            $scope.rows = $scope.basicinformationall;
                            break;
                        case 'contactinformation':
                            $scope.rows = $scope.contactinformationall;
                            break;
                        case 'address':
                            $scope.rows = $scope.addressall;
                            break;
                        case 'demographics':
                            $scope.rows = $scope.demographicsall;
                            break;
                        case 'occupation':
                            $scope.rows = $scope.occupationall;
                            break;
						case 'medicalhistory':
                            $scope.rows = $scope.medicalhistoryall;
                            break;
                        case 'sh':
                            $scope.rows = $scope.shall;
                            break;
                    }

                    $rootScope.modalInstance = $modal.open({
                        template: '<div class="modal-header"><button type="button" class="close" aria-hidden="true" ng-click="close()">&times;</button><h3>RateFast</h3></div><div class="modal-body"><div class="login-sign"><h3>Data restored successfully!</h3></div></div><div class="modal-footer"><button class="btn btn-primary" ng-click="close()">Ok</button></div>',
                        controller: 'popupbuttonClosefunctionCtrl',
                        resolve: {
                            step: function () {
                                return step;
                            }
                        }
                    });
                });
            });
        }
    }
});

angular.module('ratefastApp').filter('trailIfTrue', function () {
    return function (val, trail) {
        return !!val ? val + trail : '';
    };
});

angular.module('ratefastApp').filter('separetBycomma', function () {
    return function (address) {
        var array = new Array();
        angular.forEach(address, function (value, key) {
            if (key != 'id' && key != '_id' && value) {
                array.push(value);
            }
        })
        return array.join(',');
    }
});

angular.module('ratefastApp').filter('sortByColumn', function () {
    return function (obj, columns) {

        if (columns.length > 0) {
            var item = [];
            angular.forEach(columns, function (col) {
                item.push(obj[col]);

            });
            return item;
        } else {
            return obj;
        }
    };
});

angular.module('ratefastApp').filter('capitalize', function () {
    return function (input, scope) {
        if (input) {
            input = input.toLowerCase();
            return input.substring(0, 1).toUpperCase() + input.substring(1);
        }
    }
});

angular.module('ratefastApp').filter('substring', function () {
    return function (input) {
        if (input != '')
            return input.substr((input.indexOf('(') + 1), 3);
        else
            return input;
    };
});

angular.module('ratefastApp').filter('socialSecurityFormat', function () {
    return function (ssn) {
        if (!ssn) { return ''; }

        var value = ssn.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return ssn;
        }

        var country, city, number;

        switch (value.length) {
            case 9: // +1PPP####### -> C (PPP) ###-####
                country = 1;
                city = value.slice(0, 3);
                number = value.slice(3);
                break;
            default:
                return tel;
        }

        if (country == 1) {
            country = "";
        }

        number = number.slice(0, 2) + '-' + number.slice(2);

        return (country + " " + city + "-" + number).trim();
    };
});

angular.module('ratefastApp').filter('phonenumberFormat', function () {
    return function (phonenumber) {
        if (!phonenumber) { return ''; }

        var value = phonenumber.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return phonenumber;
        }

        var firstSlot, secondSlot, thirdSlot;
        switch (value.length) {
            case 10:
                firstSlot = value.slice(0, 3);
                secondSlot = value.substring(3, 6);
                thirdSlot = value.substring(6, 10);
                break;
            default:
                return phonenumber;
        }

        return ("(" + firstSlot + ") " + secondSlot + "-" + thirdSlot).trim();
    };
});
