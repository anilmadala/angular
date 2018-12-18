'use strict';

angular.module('ratefastApp')
.controller('reportFormCtrl', function ($scope, $http, $compile, $sce, $rootScope, $anchorScroll, $cookies, $builder, $interpolate, $route, $validator, saveForm, $filter, $routeParams, getFormdata, $modal, $location, FormList, reportFormdata, getReportdata, getReportlist, newpatientData, savePatientdata, updatePatienttable, getsavedPatientid, getSavedreportdata, updatePatientdata, getexistingpatientData, selectinjuriesPatientdata, Patients, Injuries, $cookieStore, getExistingdata, getLatestClosedReport, currentUserData, submittedReportcount, chargeReport, getPublishReportId, getReportDataById, getReportCharge, reportFormdataByVersion, getdataClinic, reportFormdataById, getdatafromAPI, currentLoggedinUserdata, PracticeGetDataByName, deletereport, openedReportTrack, updateReportStatus, updateReportData, reportLogging, serviceworkstatusnotefax, serviceworkstatusnote, serviceGetReportsClaimAdmWise, $sessionStorage, $athenaModal) {
    
	$('#isSpinnerAthenaMedication').hide(); // Athena changes
	
	$('#isAthenaUpdateSpinner').hide(); // Athena changes
    $scope.athenaSpinnerMessage = ''; // Athena changes
	
	//variable declaration
	var templatearray = new Array();
    var templateSectionData = new Array();
    $scope.defaultValue = {};
    $cookies.disableHeader = true;
    $scope.currentData = '';
    $scope.sourceSection = 'bginfo';
    var scopeValidator = '';
    $scope.validateCurrentSectionId = 'bginfo';
    $scope.validateCurrentSection = 'Background Information';
    $scope.submittedreportCount = '';
    $scope.isLoad = true;
    $scope.submitFormLoader = true;
    $scope.fullFormLoader = false;
    $scope.closedreport = false;
    $scope.hideQuestion = true;
    $scope.randomPublishReportId = '';
    $scope.loggedinUserLevel = $rootScope.currentUser.level;
    $scope.loggedinUserRole = $rootScope.currentUser.role;
    $rootScope.rfas = [];
	
	/*$scope.dateOptions = {
        startingDay: 1,
        changeMonth: true,
        changeYear: true,
        showAnim: "clip",
        clearBtn: true,
        yearRange: "-125:+0",
        defaultDate: '-18Y',
        maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + -10)),
				minDate: new Date(new Date().setFullYear(new Date().getFullYear() + -125))
    };*/
	
	//mmiRatebodystatus used to show hide yes/ no radio ques at the time of importing report
	$scope.mmiRatebodystatus=false;
	
	$scope.checkHipActivitiesPR4Rating=false;
	
    if (!$scope.CurrentLoggedinUserpracticename) {
        $scope.CurrentLoggedinUserpracticename = '';
    }
    $scope.showReportCondition = false;

    $scope.deletereportTrack = function () {
        if ($sessionStorage.reportId) {
            openedReportTrack.deletereportloginfo().query({ 'username': $rootScope.currentUser.username, 'reportid': $sessionStorage.reportId });
        }
    }

    $scope.assignClass = function (sectionname) {
        try {
            if ($scope.report.data[sectionname]) {
                if (!$scope.report.data[sectionname]['visited']) {
                    return "redbg sidebarcolor " + sectionname;

                } else {
                    if ($rootScope.newReportImported) {
                        return "greenbg sidebarcolor " + sectionname;
                    } else {
                        return "greenbg sidebarcolor " + sectionname;
                    }
                }
            } else {
                return "redbg sidebarcolor " + sectionname;
            }
        }
        catch (e) {
            //console.log(e);
        }
    }

    $scope.assignClassToBodyParts = function (bodypartname, sectionname) {
        try {
            if ($scope.report.data[sectionname + bodypartname]) {
                if (!$scope.report.data[sectionname + bodypartname]['visited']) {
                    return "redbgbodypart  sidebarcolor " + sectionname.replace(/ /g, '') + bodypartname.replace(/ /g, '');
                } else {
                    return "greenbgbodypart sidebarcolor " + sectionname.replace(/ /g, '') + bodypartname.replace(/ /g, '');
                }
            } else {
                return "defaultanchor sidebarcolor " + sectionname.replace(/ /g, '') + bodypartname.replace(/ /g, '');
            }
        }
        catch (e) {
            //console.log(e);
        }
    }

    $scope.hideSectionOnMMINo = function (bodypartname, sectionname) {
        /*
        *shridhar
        *this function use to hide body parts in section bar
        *for hiding if MMI isn't set for any one body part
        */

        if ($rootScope.formtype == "pr4") {
            var j = 0
            var anyOnePresent = true;
            var newdata = $scope.report.data.selectinjuries.sibodypart;
            var txt = "";
            if (sectionname == 'impairmentrating' || sectionname == 'apportionment' || sectionname=='treatment' || $rootScope.currentUser.role == 'rater1' || $rootScope.currentUser.role == 'rater2') {
                for (j = 0; j < newdata.length; j++) {
                    if (typeof newdata[j].ratebodyYesNoRadio != "undefined") {
                        if (newdata[j].id == 'other') {
                            if (newdata[j].bdsides != 'n/a') {
                                txt = newdata[j].bdsystemother + newdata[j].bdpartother + newdata[j].bdsides;
                            }
                            if (newdata[j].bdsides == 'n/a') {
                                txt = newdata[j].bdsystemother + newdata[j].bdpartother;
                            }
                        } else {
                            txt = newdata[j].id;
                            if (newdata[j].bdsides != "none") {
                                txt = newdata[j].id + newdata[j].bdsides;
                            }
                        }
                        if (txt == bodypartname) {
                            if (newdata[j].ratebodyYesNoRadio == 'Yes') {
                                anyOnePresent = false;
                                break;
                            }
                        }
                    }
                }
                return anyOnePresent;
            } else {
                return false;
            }
        }
    }
	
	$scope.computePainAssesment = function()
	{		
		debugger;		
		
		var activities = [{ 'id': 'ADLselfCareUrinBody', 'value': 'Urinating' }, { 'id': 'ADLselfCareDefeBody', 'value': 'Defecating' }, { 'id': 'ADLselfCareTeethBody', 'value': 'Brushing teeth' }, { 'id': 'ADLselfCareHairBody', 'value': 'Combing hair' }, { 'id': 'ADLselfCareDressBody', 'value': 'Dressing oneself' }, { 'id': 'ADLselfCareBathBody', 'value': 'Bathing' }, { 'id': 'ADLselfCareEatBody', 'value': 'Eating' }, { 'id': 'ADLcommWritBody', 'value': 'Writing' }, { 'id': 'ADLcommTypingBody', 'value': 'Typing' }, { 'id': 'ADLcommSeeingBody', 'value': 'Seeing' }, { 'id': 'ADLcommHearingBody', 'value': 'Hearing' }, { 'id': 'ADLcommSpeakingBody', 'value': 'Speaking' }, { 'id': 'ADLPhysicalStandBody', 'value': 'Standing' }, { 'id': 'ADLPhysicalSitBody', 'value': 'Sitting' }, { 'id': 'ADLPhysicalRecliBody', 'value': 'Reclining' }, { 'id': 'ADLPhysicalWalkBody', 'value': 'Walking' }, { 'id': 'ADLPhysicalClimbBody', 'value': 'Climbing stairs' }, { 'id': 'ADLsensoryHearBody', 'value': 'Hearing' }, { 'id': 'ADLsensorySeeBody', 'value': 'Seeing' }, { 'id': 'ADLsensoryTactileBody', 'value': 'Tactile feeling' }, { 'id': 'ADLsensoryTastBody', 'value': 'Tasting' }, { 'id': 'ADLsensorySmellBody', 'value': 'Smelling' }, { 'id': 'ADLnonSpecGraspBody', 'value': 'Grasping' }, { 'id': 'ADLnonSpecLiftBody', 'value': 'Lifting' }, { 'id': 'ADLnonSpecTactBody', 'value': 'Tactile discrimination' }, { 'id': 'ADLtravelRidBody', 'value': 'Riding' }, { 'id': 'ADLtravelDrivBody', 'value': 'Driving' }, { 'id': 'ADLtravelFlyBody', 'value': 'Flying' }, { 'id': 'ADLsexualOrgaBody', 'value': 'Orgasm' }, { 'id': 'ADLsexualEjacBody', 'value': 'Ejaculation' }, { 'id': 'ADLsexualLubriBody', 'value': 'Lubrication' }, { 'id': 'ADLsexualErecBody', 'value': 'Erection' }, { 'id': 'ADLsleepRestBody', 'value': 'Restful' }, { 'id': 'ADLsleepNoctBody', 'value': 'Nocturnal sleep patterns' }]; 
		var totalHighCount = 0; 
		var selCount=0;
		
		if(typeof $scope.report.data['painassessment']!=undefined)
		{
			
			if($scope.report.data['painassessment'])
			{
				if($scope.report.data['painassessment']['rdoAssessment'])
				{					
					if($scope.report.data['painassessment']['rdoAssessment'] == 'Yes') 
					{ 
						$.each($scope.report.data['selectinjuries'].concatedbodypart, function (index, item) 
						{ 
							selCount = 0; 
							$.each(activities, function (index1, item1) 
							{ 
								if ($scope.report.data['ActivitiesofDailyLiving'][item1.id + item.concateId + 'radio']) 
								{ 
									if(item.ratebodyYesNoRadio)
									{ 
										if(item.ratebodyYesNoRadio=='Yes')
										{ 
											if ($scope.report.data['ActivitiesofDailyLiving'][item1.id + item.concateId + 'radio'] == 'Cannot perform activity at all') 
											{ 
												selCount++; 
											} 
										}
									}
								}
							}); 
							if(selCount > totalHighCount) 
							{ 
								totalHighCount = selCount; 
							} 
						}); 
						if( totalHighCount >= 1 && totalHighCount <= 9 ) 
						{ 
							$scope.report.data['ActivitiesofDailyLiving']['wpiCal'] = '1% WPI'; 
						} 
						else if( totalHighCount >= 10 && totalHighCount <= 25 ) 
						{ 
							$scope.report.data['ActivitiesofDailyLiving']['wpiCal'] = '2% WPI'; 
						} 
						else if( totalHighCount >= 26 && totalHighCount <= 34 ) 
						{ 
							$scope.report.data['ActivitiesofDailyLiving']['wpiCal'] = '3% WPI'; 
						} 
						else if ( totalHighCount == 0 ) 
						{ 
							$scope.report.data['ActivitiesofDailyLiving']['wpiCal'] = '0% WPI'; 
						} 
						
						if($scope.report.data['painassessment']['rdoAssessment'] == 'Yes') 
						{ 
							$scope.report.data['painassessment']['ddlAssessment'] = $scope.report.data['ActivitiesofDailyLiving']['wpiCal']; 
						} 
						
					}
				}	
				else
				{					
					//$scope.report.data['painassessment']['ddlAssessment']='0% WPI';
				}
			}
			else
			{								
				//$scope.report.data['painassessment']['ddlAssessment']='0% WPI';
				
				 
			}
		}	
	}

    $scope.currentsectionchange = function (sectionname, index, previousId) {
         
		if($scope.formtype=='pr4')
			$scope.computePainAssesment();
		
		/*
		*checkHipActivitiesPR4Rating used to hide show red color msg
		*/
		 $scope.checkHipActivitiesPR4Rating=false;		
		 
		 if(sectionname.sectiondataid==	"hipactivities"){		 		 
			 if($filter('filter')($scope.report.data.selectinjuries.sibodypart, { id: 'pelviship' }).length>0)
			 {
				var hipData = $filter('filter')($scope.report.data.selectinjuries.sibodypart, { id: 'pelviship' });
				$.each(hipData, function(index,item){
						if(!$scope.checkHipActivitiesPR4Rating){
							if(item.ratebodyYesNoRadio=='Yes'){
									$scope.checkHipActivitiesPR4Rating=true;
							}
						}
				});
			 }
		 }
		
		
        /**
		 * Try...Catch, used for making current selected section dark green
		 * Author : manoj gupta<manoj97738@gmail.com>
		 * Date modified: 24-feb-2016
		 */
        try {
            $('.sidebarcolor').removeClass('active-anchor');
            $('.' + sectionname.sectiondataid.replace(/ /g, '')).addClass('active-anchor');

        }
        catch (err) {
            //console.log(err);
        }

        // increase time interval in reportTrack (Commented by Unais (/api/log/reportopenlog) as no need to update the time in report)        		
		/*openedReportTrack.updatereportloginfo().query({ 'reportid': $sessionStorage.reportId }).$promise.then(function(response){
			
		});*/				

        previousId = previousId ? previousId : 'bginfo';
        if ($scope.previousBodypart) { previousId = $scope.previousBodypart; }

        if (angular.element('#' + previousId).scope() && !$scope.fieldDisable) {
            var Text = "angular.element('#" + previousId + "').scope()." + previousId + '.$dirty';
            var result = eval(Text);
            if (result) {                
				
				//var report_autosave= typeof $rootScope.currentUser.practiceDetails.report_autosave != 'undefined' ? $rootScope.currentUser.practiceDetails.report_autosave : true;
            	
            	//if(report_autosave == true){
	                if (!$scope.currentBdSectionId) {   
	                	$scope.checkValidation(previousId, 'sectionChange', '');
	                } else {  
	                		$scope.savenewPatientdata('sectionChange', '');                	
	                }
            	//}
            }
        }
        $scope.isLoad = false;
        $scope.previousBodypart = '';

        $scope.submit(sectionname, $scope.validateCurrentSectionId, $scope.validateCurrentSection);
        $scope.selectedIndex = index;
        $scope.currentsectionIdcode = sectionname.sectiondataid;
        $rootScope.currentsectionId = sectionname.sectiondataid;
        var previousId = sectionname.sectiondataid;
        $scope.newPreviousId = previousId; // Passing value for validating previous section
        $scope.filterBodypartid = '';
        $scope.otherbodypartfullname = '';
        $scope.filterotherbodypartsystem = '';
        $scope.filterotherbodypartid = '';
        $scope.filterotherbodypartside = '';
        $scope.currentBdSectionId = '';
        $scope.currentBdSectionName = '';

        document.getElementById('start').focus();
        $("#start").blur();
        $scope.currentbodypart = '';
        var validator = $scope.validator;

        if (typeof $scope.report.data[$scope.currentsectionIdcode] != "object") {
            $scope.report.data[$scope.currentsectionIdcode] = new Object();
        }

        if (typeof $scope.defaultValue[$scope.currentsectionIdcode] != "object") {
            $scope.defaultValue[$scope.currentsectionIdcode] = new Object();
			
			try{
            	if(sectionname.sectiondataid=="patientcomplaints" && $scope.closedreport == true){            		         		
    	        	 var curLocindex=$scope.rfaClinicalLocation($scope.defaultcliniclocation);
    	        	 if(typeof $scope.report.data.patientcomplaints.subjectivecomplaints_contactphonenumber=='undefined'){
    	                 $scope.report.data.patientcomplaints.subjectivecomplaints_contactphonenumber = $rootScope.allcliniclocation[curLocindex].phonenumber;
    	             }
    	        	 if(typeof $scope.report.data.patientcomplaints.subjectivecomplaints_extension=='undefined'){
    	                 $scope.report.data.patientcomplaints.subjectivecomplaints_extension = $rootScope.allcliniclocation[curLocindex].extension;
    	             }
    	        	 if(typeof $scope.report.data.patientcomplaints.subjectivecomplaints_fax=='undefined'){
    	                 $scope.report.data.patientcomplaints.subjectivecomplaints_fax = $rootScope.allcliniclocation[curLocindex].faxnumber;
    	             }
            	}        	            
            }
			catch(err)
			{
    			//console.log(err);
    		}
        }
        //On loading of preview the below code is set the default Value for checkbox, radio and select2
        if ($scope.report.forms[$scope.currentsectionIdcode]) {

            $scope.report.data[$scope.currentsectionIdcode]['visited'] = true;

            for (var i = 0; i < $scope.report.forms[$scope.currentsectionIdcode].length; i++) {

                if ($scope.report.forms[$scope.currentsectionIdcode][i]) {
                    //setting default value for radio and select2
                    if ($scope.report.forms[$scope.currentsectionIdcode][i].component != 'checkbox') {
                        if ($scope.report.forms[$scope.currentsectionIdcode][i].uniqueid) {
                            var uniqueid = $scope.report.forms[$scope.currentsectionIdcode][i].uniqueid;
                            $scope.defaultValue[$scope.currentsectionIdcode][uniqueid] = $scope.report.data[$scope.currentsectionIdcode][uniqueid];
                        }
                    }

                    //checkbox
                    if ($scope.report.forms[$scope.currentsectionIdcode][i].component == 'checkbox') {
                        var setCheckbox = [];
                        var checkboxValue = [];
                        var uniqueid = $scope.report.forms[$scope.currentsectionIdcode][i].uniqueid;

                        for (var j = 0; j < $scope.report.forms[$scope.currentsectionIdcode][i].options.length; j++) {
                            if ($scope.report.data[$scope.currentsectionIdcode][uniqueid]) {
                                checkboxValue = $scope.report.data[$scope.currentsectionIdcode][uniqueid];
                                var checkCondtion = false;
                                if (checkboxValue) {
                                    for (var k = 0; k < checkboxValue.length; k++) {
                                        if (checkboxValue[k]) {
                                           
                                            if ($scope.report.forms[$scope.currentsectionIdcode][i].options[j] == checkboxValue[k].trim()) {
                                                checkCondtion = true;
                                            }
                                        }
                                    }
                                    setCheckbox.push(checkCondtion);
                                }
                            }
                        }
                        $scope.defaultValue[$scope.currentsectionIdcode][uniqueid] = setCheckbox;
                    }
                }

            }
        }

    };
	
	$scope.addendum = function () {
				 $location.path('/addendum/' + $sessionStorage.reportId);
	}

    $scope.workStatusNote = function (currentsectionId, savedata, currentReportStatus) {

        $scope.checkValidation(currentsectionId, savedata, currentReportStatus);
        $scope.isLoad = true;
        var formid = $routeParams.patientid;
        var reportstatus = reportstatus;
        $rootScope.currentUser;
        $scope.report;
        $rootScope.rfas = $rootScope.rfaData();
        //Changes made for workstatus
        $scope.rfaClinicLocUpdate($scope.report.data.patientcomplaints.cliniclocation);
        $rootScope.currentSelectedCliniclocation = $scope.report.data.patientcomplaints.cliniclocationobj;

        /**
           * code to solve phone and extension not getting displayed in work status note preview
           */
        if (typeof $scope.report.data.patientcomplaints.subjectivecomplaints_contactphonenumber == 'undefined') {
            $scope.report.data.patientcomplaints.subjectivecomplaints_contactphonenumber = $rootScope.billingTelephonenumber;
        }
        if (typeof $scope.report.data.patientcomplaints.subjectivecomplaints_extension == 'undefined') {
            $scope.report.data.patientcomplaints.subjectivecomplaints_extension = $rootScope.billingExtension;
        }

         

        $rootScope.modalPreview = $modal.open({
            templateUrl: 'partials/workStatusNotePreview.html',
            windowClass: 'app-modal-window',
            controller: 'formdataPreviewCtrl',
            resolve: {
                report: function () {
                    return $scope.report;
                },
                reportdata: function () {
                    return $scope.reportList;
                },
                reportFlavor: function () {
                    return $scope.reportFlavor;
                },
                closedreport: function () {
                    return $scope.closedreport;
                },
                submittedreportcount: function () {
                    return '';
                },
                chargeReport: function () {
                    return '';
                },
                newReportStatus: function () {
                    return true;
                },
                submitStatus: function () {
                    return '';
                },
                submittedDate: function () {
                    return $scope.submittedDate;
                },
                existingReportPracticeName: function () {
                    return $rootScope.existingReportPracticeName;
                },
                currentSelectedCliniclocation: function () {
                    return $rootScope.currentSelectedCliniclocation;
                },
                strTemplate: function () {
                    return '';
                },

            }
        });

        $rootScope.modalPreview.result.then(function (workStatusData) {
            $scope.isLoad = true;

            if (workStatusData.sendAs == 'sendfax') {

                var postWorkStatusData = {};
                postWorkStatusData.workStatusData = workStatusData;
                postWorkStatusData.reportid = $sessionStorage.reportId;
                $rootScope.workStatusData = postWorkStatusData;
                //Redirect to fax cover page screen before that make sure the work status data are stored in root scope
                $location.path('/workstatusfax');
                //$location.replace();
            }
            if (workStatusData.sendAs == 'senddoc') {
                var postWorkStatusData = {};
                postWorkStatusData.workStatusData = workStatusData;
                postWorkStatusData.reportid = $sessionStorage.reportId;

                serviceworkstatusnote.save(postWorkStatusData).$promise.then(function (response) {
                    $scope.isLoad = true;
                    $route.reload();
                    $scope.popupMessage('Work status note saved sucessfully.', 200);
                }).catch(function (err) {

                     
                    $scope.isLoad = true;
                    $scope.popupMessage('Due to some technical issue, the report could not be saved. Please try again. ', 400);

                });
            }


        });

    }

    $scope.setDefaultValues = function (section, bodypartname, actualbdid, index, otherbodypartsystem, otherbodypartid, otherbodypartside) {
         
        var formbodypartname = bodypartname;
        var databodypartname = bodypartname;
        $scope.otherbodypartfullname = '';
        $scope.filterotherbodypartsystem = otherbodypartsystem;
        $scope.filterotherbodypartid = otherbodypartid;
        $scope.filterotherbodypartside = otherbodypartside;

        if (otherbodypartsystem) {
            if (otherbodypartside != 'n/a') {
                databodypartname = otherbodypartsystem + otherbodypartid + otherbodypartside;
                $scope.otherbodypartfullname = otherbodypartsystem + otherbodypartid + otherbodypartside;

            } else {
                databodypartname = otherbodypartsystem + otherbodypartid;
                $scope.otherbodypartfullname = otherbodypartsystem + otherbodypartid;

            }
        }

        //Created New Object on template load for storing the data 
        if (typeof $scope.report.data[section.sectiondataid + databodypartname] != "object") {
            $scope.report.data[section.sectiondataid + databodypartname] = new Object();
        }

        $scope.defaultValue[section.sectiondataid + databodypartname] = new Object();

        if ($scope.currenttemplatedata.forms[bodypartname]) {
            templatearray.push(section.sectiondataid + databodypartname);
            $builder.forms[section.sectiondataid + databodypartname] = $scope.currenttemplatedata.forms[bodypartname];

        } else {
            templatearray.push(section.sectiondataid + databodypartname);
            $builder.forms[section.sectiondataid + databodypartname] = $scope.currenttemplatedata.forms["other"];
        }

        $scope.bodypart = true;
        $scope.selectedIndex = index;
        $scope.currentsection = section.sectionname;
        $scope.currentbodypart = bodypartname;
        $scope.currentsectionId = section.sectiondataid;
        $scope.filterBodypartid = actualbdid;

        //$scope.report.data[$scope.currentsectionIdcode]['visited']=true;

        //set the default Value for checkbox, radio and select2 while loading the template
        if ($scope.currenttemplatedata.forms[bodypartname]) {
            for (var i = 0; i < $scope.currenttemplatedata.forms[bodypartname].length; i++) {
                if ($scope.currenttemplatedata.forms[bodypartname][i].component) {
                    //radio and select2    
                    if ($scope.currenttemplatedata.forms[bodypartname][i].component != 'checkbox') {
                        if ($scope.currenttemplatedata.forms[bodypartname][i].uniqueid) {
                            var uniqueid = $scope.currenttemplatedata.forms[bodypartname][i].uniqueid;

                            if ($scope.report.data[$scope.currentsectionId + databodypartname][uniqueid]) {
                                $scope.defaultValue[$scope.currentsectionId + databodypartname][uniqueid] = $scope.report.data[$scope.currentsectionId + databodypartname][uniqueid];
                            }
                        }
                    }
                    //Checkbox
                    if ($scope.currenttemplatedata.forms[bodypartname][i].component == 'checkbox') {
                        var setCheckbox = [];
                        var checkboxValue = [];
                        if ($scope.currenttemplatedata.forms[bodypartname][i]) {
                            for (var j = 0; j < $scope.currenttemplatedata.forms[bodypartname][i].options.length; j++) {
                                if ($scope.currenttemplatedata.forms[bodypartname][i].uniqueid) {
                                    var uniqueid = $scope.currenttemplatedata.forms[bodypartname][i].uniqueid;
                                    checkboxValue = $scope.report.data[section.sectiondataid + databodypartname][uniqueid];

                                   
                                    //if ($scope.report.data[section.sectiondataid + databodypartname][uniqueid].length == 1 && $scope.report.data[section.sectiondataid + databodypartname][uniqueid][0].indexOf('#') > -1) {                                   
                                    //    checkboxValue = $scope.report.data[section.sectiondataid + databodypartname][uniqueid][0].split('#')[1];
                                    //}
                                    //else {                                    
                                    //    checkboxValue = $scope.report.data[section.sectiondataid + databodypartname][uniqueid];
                                    //}
                                    var checkCondtion = false;
                                    if (checkboxValue) {
                                        //if (checkboxValue.length == 1 && checkboxValue.indexOf('#') > -1) {
                                        //    checkboxValue = checkboxValue.split('#')[1];
                                        //    if ($scope.currenttemplatedata.forms[bodypartname][i].options[j] == checkboxValue.trim()) {
                                        //        checkCondtion = true;
                                        //    }
                                        //}
                                        //else {
                                        for (var k = 0; k < checkboxValue.length; k++) {
                                            if (checkboxValue[k]) {
                                                if ($scope.currenttemplatedata.forms[bodypartname][i].options[j] == checkboxValue[k].trim()) {
                                                    checkCondtion = true;
                                                }
                                            }
                                        }
                                        //}
                                        setCheckbox.push(checkCondtion);
                                    }
                                }
                            }

                            if ($scope.report.data[section.sectiondataid + databodypartname]) {
                                $scope.defaultValue[section.sectiondataid + databodypartname][uniqueid] = setCheckbox;
                            }
                        }

                    }
                }
            }
        }
    };

    $scope.gettemplate = function (section, bodypartname, index, previousId) {
                 		
		
		/*
		*added by shridhar
		* to show alert msg of body part not selected for rating 
		*/
        $scope.mmiRatebodystatus = false;
        if ($rootScope.formtype == "pr4") {
            if (typeof bodypartname.ratebodyYesNoRadio != "undefined") {
                if (bodypartname.ratebodyYesNoRadio == 'No') {
                    $scope.mmiRatebodystatus = true;					
                }
            }
        }

        /*
        * Try...Catch, used for making current selected section dark green
        * Author : manoj gupta<manoj97738@gmail.com>
        * Date modified: 24-feb-2016
        */
        try {
            $('.sidebarcolor').removeClass('active-anchor');
            $('.' + section.sectiondataid + bodypartname.concateId.replace(/ /g, '')).addClass('active-anchor');

        }
        catch (err) {
            //console.log(err);
        }

        // increase time interval in reportTrack (Commented by Unais (/api/log/reportopenlog) as no need to update the time in report)
        /*openedReportTrack.updatereportloginfo().query({ 'reportid': $sessionStorage.reportId });*/

        var sectionVisited = section.sectiondataid + bodypartname.concateId;

        if ($scope.report.data[sectionVisited]) {
            if ($scope.reportStatus == "open") {
                $scope.report.data[section.sectiondataid + bodypartname.concateId].visited = true;
            }
        }
        else {
            if ($scope.reportStatus == "open") {
                $scope.report.data[sectionVisited] = {};
                $scope.report.data[section.sectiondataid + bodypartname.concateId].visited = true;
            }
        }

        //GT:MATYA 20th November 2014 Code for $dirty
        if (!$scope.previousBodypart) {
            $scope.previousBodypart = $scope.currentsectionIdcode;
        } else {
            $scope.previousBodypart = $scope.previousBodypart;
        }
        //if (angular.element('#' + $scope.previousBodypart).scope()) {
        //    var a = angular.element('#' + $scope.previousBodypart).scope();
        //}

        if (angular.element('#' + $scope.previousBodypart).scope() && !$scope.fieldDisable) {
            var Text = "angular.element('#" + $scope.previousBodypart + "').scope()." + $scope.previousBodypart + '.$dirty';
            var result = eval(Text);
            if (result) {
                //$scope.checkValidation(previousId, 'sectionChange', '');
                $scope.savenewPatientdata('sectionChange', '');
            }
        }
        var bdpartname = (bodypartname.id != 'other') ? bodypartname.id : bodypartname.bdsystemother;
        var side = (bodypartname.bdsides == 'n/a' || bodypartname.bdsides == 'none') ? '' : bodypartname.bdsides;
        $scope.previousBodypart = section.sectiondataid + bdpartname + side;
        $scope.previousBodyid = bodypartname.id + side;

        //Load the template if not exist in the templateSectionData Array 
        $scope.isLoad = false;
        $scope.bodypartname = bodypartname;
        $rootScope.bodypartname = bodypartname;
        $scope.sibodypart = $scope.report.data['selectinjuries']['sibodypart'];
        $scope.bodypartid = bodypartname.id;
        $scope.bdpartname = bodypartname.bdsides;
        document.getElementById('start').focus();
        $("#start").blur();

        var currentSectionId;

        var otherbodypartsystem = bodypartname.bdsystemother;
        var otherbodypartid = bodypartname.bdpartother;
        var otherbodypartside = bodypartname.bdsides;
        $scope.currentBdSectionId = '';
        $scope.currentBdSectionName = '';

        //set current section id for body part
        if ($scope.bodypartid == 'other') {
            if (otherbodypartsystem) {
                if (otherbodypartside != 'n/a') {
                    currentSectionId = section.sectiondataid + otherbodypartsystem + otherbodypartid + otherbodypartside;
                    $scope.currentBdSectionId = section.sectiondataid + otherbodypartsystem + otherbodypartid + otherbodypartside;
                    $scope.currentBdSectionName = $filter('capitalize')(otherbodypartid) + ' - ' + $filter('capitalize')(otherbodypartside);
                    $scope.concateId = otherbodypartsystem + otherbodypartid + otherbodypartside;
                } else {
                    currentSectionId = section.sectiondataid + otherbodypartsystem + otherbodypartid;
                    $scope.currentBdSectionId = section.sectiondataid + otherbodypartsystem + otherbodypartid;
                    $scope.currentBdSectionName = $filter('capitalize')(otherbodypartid);
                    $scope.concateId = otherbodypartsystem + otherbodypartid;
                }
            }
        } else {
            if (bodypartname.bdsides != 'none' && bodypartname.bdsides != 'n/a') {
                currentSectionId = section.sectiondataid + $scope.bodypartid + bodypartname.bdsides;
                $scope.currentBdSectionId = section.sectiondataid + $scope.bodypartid + bodypartname.bdsides;
				
				//added by shridhar 30aug
				if($scope.bodypartid=='pelviship'){
					//this condition bcz: for Hip/pelvis : $scope.bodypartid is pelviship. but in message client want to display 'Hip/pelvis'			 
					$scope.currentBdSectionName = 'Hip/pelvis - ' + $filter('capitalize')(bodypartname.bdsides);
				}else if($scope.bodypartid=='anklefoot'){
					$scope.currentBdSectionName = 'Ankle/foot - ' + $filter('capitalize')(bodypartname.bdsides);
				}
				else if($scope.bodypartid=='fingerindex'){
                    $scope.currentBdSectionName = 'Finger - Index - ' + $filter('capitalize')(bodypartname.bdsides);
                }else if($scope.bodypartid=='fingermiddle'){
                    $scope.currentBdSectionName = 'Finger - Middle - ' + $filter('capitalize')(bodypartname.bdsides);
                }else if($scope.bodypartid=='fingerring'){
                    $scope.currentBdSectionName = 'Finger - Ring - ' + $filter('capitalize')(bodypartname.bdsides);
                }else if($scope.bodypartid=='fingerlittle'){
                    $scope.currentBdSectionName = 'Finger - Little - ' + $filter('capitalize')(bodypartname.bdsides);
                }
				else{					
					$scope.currentBdSectionName = $filter('capitalize')($scope.bodypartid) + ' - ' + $filter('capitalize')(bodypartname.bdsides);
				}
				                
                $scope.concateId = $scope.bodypartid + bodypartname.bdsides;
            } else {
                currentSectionId = section.sectiondataid + $scope.bodypartid
                $scope.currentBdSectionId = section.sectiondataid + $scope.bodypartid;
				
				if($scope.bodypartid=='neck'){								
					$scope.currentBdSectionName = 'Head/neck';
				}else if($scope.bodypartid=='groingenitalia'){								
					$scope.currentBdSectionName = 'Groin/genitalia';
				}else{
					$scope.currentBdSectionName = $filter('capitalize')($scope.bodypartid);
				}
				             		
                $scope.concateId = $scope.bodypartid;
            }
        }

        $scope.newPreviousId = $scope.currentBdSectionId; // Passing value for validating previous section

        if (!templateSectionData[section.template]) {
            getFormdata.query({ id: section.template }).$promise.then(function (responce) {
                if (responce[0].dataform != 'Error') {
                    $scope.templatedata = responce[0].dataform;
                     
                    templateSectionData[section.template] = angular.fromJson(responce[0].dataform);
                    $scope.currenttemplatedata = angular.fromJson(responce[0].dataform);
                    //function to Set Values of template from database
                    if (bodypartname.bdsides != 'none' && bodypartname.bdsides != '' && bodypartname.bdsides != 'n/a') {
                        var bodypartid = $filter('lowercase')(bodypartname.id) + $filter('lowercase')(bodypartname.bdsides);
                        $rootScope.currentsectionId = currentSectionId;
                        $scope.currentsection = section.sectionname;
                        $rootScope.currentbodypartId = bodypartid;
                        $scope.currentbodypart = bodypartname;
                        $scope.setDefaultValues(section, bodypartid, bodypartname.id, index, otherbodypartsystem, otherbodypartid, otherbodypartside);
                    }
                    else {
                        var bodypartid = $filter('lowercase')(bodypartname.id);
                        $rootScope.currentsectionId = currentSectionId;
                        $scope.currentsection = section.sectionname;
                        $rootScope.currentbodypartId = bodypartid;
                        $scope.currentbodypart = bodypartname;
                        $scope.setDefaultValues(section, bodypartid, bodypartname.id, index, otherbodypartsystem, otherbodypartid, otherbodypartside);
                    }
                }
                else {
                    alert('Body Part does not exist for this section.');
                }
                $scope.isLoad = true;
            });
        }
        else {   //template already exists in the templateSectionData array 
            $scope.currenttemplatedata = templateSectionData[section.template];
            //function to Set Values of template from database
            if (bodypartname.bdsides != 'none' && bodypartname.bdsides != '' && bodypartname.bdsides != 'n/a') {
                var bodypartid = $filter('lowercase')(bodypartname.id) + $filter('lowercase')(bodypartname.bdsides);
                $rootScope.currentsectionId = currentSectionId;
                $scope.currentsection = section.sectionname;
                $rootScope.currentbodypartId = bodypartid;
                $scope.currentbodypart = bodypartname;
                $scope.setDefaultValues(section, bodypartid, bodypartname.id, index, otherbodypartsystem, otherbodypartid, otherbodypartside);
            }
            else {
                var bodypartid = $filter('lowercase')(bodypartname.id);
                $rootScope.currentsectionId = currentSectionId;
                $rootScope.currentbodypartId = bodypartid;
                $scope.currentbodypart = bodypartname;
                $scope.currentsection = section.sectionname;
                $scope.setDefaultValues(section, bodypartid, bodypartname.id, index, otherbodypartsystem, otherbodypartid, otherbodypartside);
            }
            $scope.isLoad = true;
        }
    };

    $scope.commaseperated = function (data) {
         
        if (!$scope.skinbodypart)
            $scope.skinbodypart = [];
        $scope.skinbodypart.push(data);
         
    };

    $scope.newdfrReport = function () {
        $rootScope.newReportImported = false;
        // hide nav bar when in report
        if (document.getElementById("hideNavbar")) {
            if (document.getElementById("hideNavbar").style)
                document.getElementById("hideNavbar").style.visibility = "hidden";
        }
        //Clearing CookisStore set for change in PDP or IDP $dirty
        $cookieStore.remove('selectedCategories');

        $scope.displayFormdiv = true;
        $scope.displayNoReratingdiv = false;
        $scope.displayYesReratingdiv = false;

        $scope.formid = $cookies.formid;
        $scope.formType = $cookies.formType;
        $scope.version = 1;
        $scope.patientId = '';
        $scope.formversion = $cookieStore.get('formVersion');
        $rootScope.startIdletime = true;
        $rootScope.reportStarted = true;
        $scope.telephonenumber = '';
        $scope.reportpopup = true;
        $scope.currentUsername = $rootScope.currentUser.practicename;
        $scope.currentUser = $rootScope.currentUser;
        $scope.existingReportPracticeName = '';
         
        if ($sessionStorage.reportId) {
            $scope.reportStatus = $cookies.reportstatus;
        }
        else {
            $scope.reportStatus = 'open';
        }
        //Code for getting telephone number

        //getdataClinic.query({ currentusername: $scope.currentUsername }, function (response) {
        //     
        //    if (response[0]) {
        //        $scope.telephonenumber = response[0].clinicLocation[0].phonenumber;
        //    }
        //});

        //Code for initializing idle conditions
        //GT:RISHU 10.14.14 For idle time save data and auto Logout code

        function closeModals() {

            if ($scope.timedout) {
                $scope.timedout.close();
                $scope.timedout = null;
            }
        }

        $scope.idleTimeout = function () {
            $("#data_save_msg_box").fadeIn(2000).fadeToggle(3000);
            //closeModals();            
        };

        //Ends Here
        if (!$scope.patientId) {
            $scope.patientId = $sessionStorage.patientId;
        }

        $scope.reportId = $sessionStorage.reportId;
        if ($scope.formType) {
            switch ($scope.formType) {
                case 'dfr':
                    $scope.formTypeName = "Doctor's First Report";
                    break;
                case 'pr2':
                    $scope.formTypeName = 'PR-2';

                    break;
                case 'pr4':
                    $scope.formTypeName = 'PR-4';
                    break;
            }
        }

        // mayur code
        $scope.injuryId = $sessionStorage.InjuryId;
        if (!$scope.injuryId) {
            $sessionStorage.InjuryId = $rootScope.InjuryId;
            $scope.injuryId = $rootScope.InjuryId;
        }
        $scope.reportid = $sessionStorage.reportId;
        $scope.report = new Object;
        $scope.report.data = new Object();
        $scope.goaheadResponse = false;
         
        //Closed Report condition
        newpatientData.query({ 'patientid': $scope.patientId }, function (response) {
             
            $scope.patientData = response[0];		

			// Athena changes (entire if)
           if($rootScope.currentUser.practiceDetails.isAthena){
               try{
                   if ($sessionStorage.athena_patient_id) {
                       delete $sessionStorage.athena_patient_id;
                   }
               }catch(err){}
                
               $sessionStorage.athena_patient_id = $scope.patientData.patientsList[0].athena_patientid;                
               $scope.athena_patient_id = $scope.patientData.patientsList[0].athena_patientid;    
           }	
			
        }).$promise.then(function (newpatient) {
             
            selectinjuriesPatientdata.query({ 'injuryid': $scope.injuryId }, function (injuryData) {
                 
                $scope.injuryData = injuryData[0];
            }).$promise.then(function (injuryData) {

                 
                currentLoggedinUserdata.query({ userid: $scope.currentUser.id }).$promise.then(function (loggenInUser) {
                     
                    if ($sessionStorage.reportId) { //Get Form for the existing Report according to the Form type and Version
                         

                        getexistingpatientData.query({ 'reportid': $sessionStorage.reportId }).$promise.then(function (result) {
                             
                            $scope.existingpatientData = result[0];
                            $scope.reportStatus = $scope.existingpatientData.patientData[0].status;
                            $scope.rerateflag = $scope.existingpatientData.patientData[0].rerateflag ? $scope.existingpatientData.patientData[0].rerateflag : false;
                            $scope.reratecomment = $scope.existingpatientData.patientData[0].reratecomment ? $scope.existingpatientData.patientData[0].reratecomment : '';
                            $scope.reratetype = $scope.existingpatientData.patientData[0].reratetype ? $scope.existingpatientData.patientData[0].reratetype : '';
                            $scope.closedreport = $scope.existingpatientData.patientData[0].previousclosedreport ? $scope.existingpatientData.patientData[0].previousclosedreport : false;
                            $scope.formid = $scope.existingpatientData.patientData[0].formid;
                            $scope.submittedDate = $scope.existingpatientData.patientData[0].submittedDate ? $scope.existingpatientData.patientData[0].submittedDate : '';
                            $scope.existingReportPracticeName = $scope.existingpatientData.patientData[0].practicename ? $scope.existingpatientData.patientData[0].practicename : '';
                            $rootScope.existingReportPracticeName = $scope.existingReportPracticeName;
                            //set publish Report id 
                            $scope.randomPublishReportId = $scope.existingpatientData.patientData[0].reportpublishid;

                            //Code added by Unais to save flavor
                            $scope.flavor = $scope.existingpatientData.patientData[0].flavor;

                            //code changed shridhar : Reason vsited true functionality where injured body system was always not visietd
                            $scope.visitedSelectInjury = $scope.existingpatientData.patientData[0].data.selectinjuries.visited;

                            if ($scope.existingpatientData.patientData[0].status == 'closed') {
                                $scope.fieldDisable = true;
                            }
                            else {
                                $scope.fieldDisable = false;
                            }

                             
                            getdataClinic.query({ 'currentusername': $scope.existingReportPracticeName }).$promise.then(function (amaedition) {
                                 
                                if (amaedition[0]) {
                                    $scope.practiceInfo = amaedition[0].clinicLocation[0];
                                    $scope.amaeditions = amaedition[0].clinicLocation[0].editionama;
                                    $scope.amaeditionData = { 'administrativerule': $scope.amaeditions };
                                    $scope.telephonenumber = '';
                                    if (amaedition[0].clinicLocation[0].billingaddress) {
                                        $scope.telephonenumber = amaedition[0].clinicLocation[0].billingaddress.phonenumber ? amaedition[0].clinicLocation[0].billingaddress.phonenumber : '';
                                        $rootScope.billingTelephonenumber = amaedition[0].clinicLocation[0].billingaddress.phonenumber ? amaedition[0].clinicLocation[0].billingaddress.phonenumber : '';
                                        $rootScope.billingExtension = amaedition[0].clinicLocation[0].billingaddress.billingextension ? amaedition[0].clinicLocation[0].billingaddress.billingextension : '';
                                    }
                                    $rootScope.allcliniclocation = amaedition[0].clinicLocation[0].practiceaddress;
                                    var getcliniclocation = amaedition[0].clinicLocation[0].practiceaddress[0];
                                    $scope.defaultcliniclocation = getcliniclocation.county + ', ' + getcliniclocation.street + ', ' + getcliniclocation.city + ', ' + getcliniclocation.zipcode + ', ' + getcliniclocation.state + ', ' + getcliniclocation.country;
                                }
                                 
                                reportFormdataById.query({ id: $scope.formid }, function (responce) {
                                    
									
                                    $scope.form = responce[0];
                                    if (responce[0].form[0].formdata) {
                                        $scope.formversion = responce[0].form[0].version;
                                        $scope.formname = responce[0].form[0].title;
                                        $scope.formtype = responce[0].form[0].formtype;
                                        $scope.report = angular.fromJson(responce[0].form[0].formdata);
                                        $rootScope.version = responce[0].form[0].version;
                                        $rootScope.formname = responce[0].form[0].title;
                                        $rootScope.formtype = responce[0].form[0].formtype;
                                        $rootScope.report = angular.fromJson(responce[0].form[0].formdata);

                                        var injuredPartid = '';
                                        $scope.bodyParts = [];
                                        $scope.bodypartSide = [];
                                        $scope.bodypartMechanism = [];
                                        $scope.bodypartOther = [];
                                        $scope.bodysystemOther = [];
                                        $scope.mechanismOther = [];

                                        $scope.patientName = $scope.patientData.patientsList[0].basicinformation[0].firstname + " " + $scope.patientData.patientsList[0].basicinformation[0].lastname;
                                        $scope.report.data = $scope.existingpatientData.patientData[0].data;
										
										try{
											$scope.rfaClinicLocUpdate($scope.report.data.patientcomplaints.cliniclocation);

                                            var curLocindex=$scope.rfaClinicalLocation($scope.defaultcliniclocation);
                                            if( $scope.report.data.patientcomplaints.subjectivecomplaints_fax=='' && $scope.existingpatientData.patientData[0].status != 'closed'){
                                                $scope.report.data.patientcomplaints.subjectivecomplaints_fax = $rootScope.allcliniclocation[curLocindex].faxnumber;
                                            }
                                            if( $scope.report.data.patientcomplaints.subjectivecomplaints_contactphonenumber=='' && $scope.existingpatientData.patientData[0].status != 'closed'){
                                                $scope.report.data.patientcomplaints.subjectivecomplaints_contactphonenumber = $rootScope.allcliniclocation[curLocindex].phonenumber;
                                            }
                                            if(typeof $scope.report.data.patientcomplaints.subjectivecomplaints_contactphonenumber=='undefined'){
                                                $scope.report.data.patientcomplaints.subjectivecomplaints_contactphonenumber = $rootScope.allcliniclocation[curLocindex].phonenumber;
                                            }
                                             if(typeof $scope.report.data.patientcomplaints.subjectivecomplaints_fax=='undefined'){
                                                $scope.report.data.patientcomplaints.subjectivecomplaints_fax = $rootScope.allcliniclocation[curLocindex].faxnumber;
                                            }
                                             if(typeof $scope.report.data.patientcomplaints.subjectivecomplaints_extension=='undefined'){
                                                $scope.report.data.patientcomplaints.subjectivecomplaints_extension = $rootScope.allcliniclocation[curLocindex].extension;
                                            }
                                            if( $scope.report.data.patientcomplaints.subjectivecomplaints_extension=='' && $scope.existingpatientData.patientData[0].status != 'closed'){
                                               
                                                $scope.report.data.patientcomplaints.subjectivecomplaints_extension = $rootScope.allcliniclocation[curLocindex].extension;
                                            }else{
                                                
                                            }
                                            
                                            if(typeof $scope.report.data.patientcomplaints=='undefined'){
                                                $scope.report.data.patientcomplaints={};
                                                $scope.report.data.patientcomplaints.subjectivecomplaints_contactphonenumber= $rootScope.allcliniclocation[curLocindex].phonenumber;;
                                                $scope.report.data.patientcomplaints.subjectivecomplaints_extension= $rootScope.allcliniclocation[curLocindex].extension;
                                                $scope.report.data.patientcomplaints.subjectivecomplaints_fax= $rootScope.allcliniclocation[curLocindex].faxnumber;
                                            }
                                        }catch(err){
											//console.log(err);
										}
										
										
                                        /*** Author: Manoj Gupta
											 Date: 16th March, 2016
                                             Purpose: For workstatus printing
										***/
                                        $scope.report.data.workStatusNote = $scope.existingpatientData.patientData[0].workStatusNote;
										try{
											$scope.report.data.addendum = $scope.existingpatientData.patientData[0].addendum;
											}
										catch(err){
											$scope.report.data.addendum = [];
										}
                                        if ($scope.existingpatientData.patientData[0].status != 'open') {
                                            $scope.hideQuestion = false;
                                        }
                                        //ama edition does not import from practice profile for existing dfr/pr2/pr4 reports
                                        $scope.amaeditionData = { 'administrativerule': $scope.report.data.bginfo.administrativerule };

                                        $scope.injuryData = injuryData[0].selectinjuries[0].injury[0].injurydata;
                                        $scope.injuryinfo = $filter("filter")($scope.injuryData.injuryinformation);
                                        $scope.createdDate = $scope.injuryinfo[0].dateofinjury;
                                        $rootScope.currentReportStatus = $scope.existingpatientData.patientData[0].status;
                                        $scope.currentReportStatus = $scope.existingpatientData.patientData[0].status;

                                        //display current Status Report Wise
                                        $scope.displayReportStatus = $scope.getDisplayReportStatus($scope.currentReportStatus, $scope.formType, $scope.reratetype);

                                        //End

                                        //if report is in open state then import the PDP and IDP info in background and Injurebody system section
                                        if ($scope.existingpatientData.patientData[0].status == 'open') {

                                            $scope.report.data.bginfo = new Object();
                                            $scope.basicinfo = $scope.patientData.patientsList[0].basicinformation[0];
                                            $scope.contactinfo = $scope.patientData.patientsList[0].contactinformation[0];
                                            $scope.address = $scope.patientData.patientsList[0].address[0];
                                            $scope.occupation = $scope.patientData.patientsList[0].occupation[0];
                                            $scope.demographics = $scope.patientData.patientsList[0].demographics[0];

                                            //get value from patient to medical history 
                                            getSelectedMedicalHistoryCheckbox();
                                            //get value from patient to social history
                                            getSelectedSocialhistoryCheckbox();

                                            $scope.currentData = $scope.report;
                                            for (var i = 0; i < injuryData[0].selectinjuries[0].injury[0].injurydata.acceptedbodyparts.length; i++) {
                                                if (injuryData[0].selectinjuries[0].injury[0].injurydata.acceptedbodyparts[i].status == 'current') {
                                                    injuredPartid = injuryData[0].selectinjuries[0].injury[0].injurydata.acceptedbodyparts[i];
                                                }
                                            }

                                            $scope.selectedArray = [];
                                            $scope.bodypartPreview = [];
                                            if (injuredPartid != '') {
                                                for (var i = 0; i < injuredPartid.injuredbodypart.length; i++) {
                                                    $scope.bodyParts[i] = angular.fromJson(injuredPartid.injuredbodypart[i].bodypart);
                                                    $scope.bodypartSide[i] = injuredPartid.injuredbodypart[i].bodypartsides;
                                                    $scope.bodypartMechanism[i] = injuredPartid.injuredbodypart[i].bodypart_mechanism;

                                                    /*
													*shridhar
													*bodypartDateOfRating,bodypartRateBodypart, ratebodyYesNoRadio this part used for MMI rate body
													*/

                                                    var bodypartDateOfRating = '';
                                                    var bodypartRateBodypart = false;
                                                    var ratebodyYesNoRadio = 'No';

                                                    try {
                                                        if (typeof injuredPartid.injuredbodypart[i].dateOfRating != 'undefined' && injuredPartid.injuredbodypart[i].dateOfRating != '' && injuredPartid.injuredbodypart[i].dateOfRating != null) {
                                                            bodypartDateOfRating = injuredPartid.injuredbodypart[i].dateOfRating;
                                                            bodypartRateBodypart = injuredPartid.injuredbodypart[i].ratebodypart;
                                                            ratebodyYesNoRadio = injuredPartid.injuredbodypart[i].ratebodyYesNoRadio;
                                                        }
                                                    }
                                                    catch (err) {
                                                        //console.log(err);
                                                    }

                                                    if (injuredPartid.injuredbodypart[i].otherbodypart_mechanismshowmodel) {
                                                        $scope.mechanismOther[i] = injuredPartid.injuredbodypart[i].otherbodypart_mechanismshowmodel;
                                                    }
                                                    if (injuredPartid.injuredbodypart[i].otherBodyparts) {
                                                        $scope.bodypartOther[i] = injuredPartid.injuredbodypart[i].otherBodyparts;
                                                    } else {
                                                        $scope.bodypartOther[i] = '';
                                                    }
                                                    if (injuredPartid.injuredbodypart[i].otherBodysystem) {
                                                        $scope.bodysystemOther[i] = injuredPartid.injuredbodypart[i].otherBodysystem;
                                                    } else {
                                                        $scope.bodysystemOther[i] = '';
                                                    }
                                                    /*scope.selectedArray.push(($scope.merge($scope.bodyParts[i], { bdsides: $filter('lowercase')($scope.bodypartSide[i]) }, { bdmechanism: $scope.bodypartMechanism[i] }, { bdpartother: $scope.bodypartOther[i] }, { bdsystemother: $scope.bodysystemOther[i] }, { bdmechanismother: $scope.mechanismOther[i] })));*/

                                                    $scope.selectedArray.push(($scope.merge($scope.bodyParts[i], { bdsides: $filter('lowercase')($scope.bodypartSide[i]) }, { bdmechanism: $scope.bodypartMechanism[i] }, { bdpartother: $scope.bodypartOther[i] }, { bdsystemother: $scope.bodysystemOther[i] }, { bdmechanismother: $scope.mechanismOther[i] }, { dateOfRating: bodypartDateOfRating }, { ratebodypart: bodypartRateBodypart }, { ratebodyYesNoRadio: ratebodyYesNoRadio })));
                                                    //setting concated bodypartid for Report preview
                                                    var concatedBodypartId;

                                                    if ($scope.bodyParts[i].id == 'other') {
                                                        if ($scope.bodypartSide[i] == 'N/A') {
                                                            concatedBodypartId = $scope.bodysystemOther[i] + $scope.bodypartOther[i];
                                                        } else {
                                                            concatedBodypartId = $scope.bodysystemOther[i] + $scope.bodypartOther[i] + $filter('lowercase')($scope.bodypartSide[i]);
                                                        }
                                                    } else {
                                                        if ($scope.bodypartSide[i] == 'None') {
                                                            concatedBodypartId = $scope.bodyParts[i].id;
                                                        } else {
                                                            concatedBodypartId = $scope.bodyParts[i].id + $filter('lowercase')($scope.bodypartSide[i]);
                                                        }
                                                    }

                                                    /*$scope.bodypartPreview.push(($scope.merge($scope.bodyParts[i], { bdsides: $filter('lowercase')($scope.bodypartSide[i]) }, { bdmechanism: $scope.bodypartMechanism[i] }, { bdpartother: $scope.bodypartOther[i] }, { bdsystemother: $scope.bodysystemOther[i] }, { bdmechanismother: $scope.mechanismOther[i] }, { concateId: concatedBodypartId })));*/

                                                    $scope.bodypartPreview.push(($scope.merge($scope.bodyParts[i], { bdsides: $filter('lowercase')($scope.bodypartSide[i]) }, { bdmechanism: $scope.bodypartMechanism[i] }, { bdpartother: $scope.bodypartOther[i] }, { bdsystemother: $scope.bodysystemOther[i] }, { bdmechanismother: $scope.mechanismOther[i] }, { concateId: concatedBodypartId }, { 'dateOfRating': bodypartDateOfRating }, { 'ratebodypart': bodypartRateBodypart }, { 'ratebodyYesNoRadio': injuredPartid.injuredbodypart[i].ratebodyYesNoRadio })));
                                                    //End of setting concated bodypartid for Report preview
                                                }
                                            }


                                            $scope.injuryData = injuryData[0].selectinjuries[0].injury[0].injurydata;
                                            $scope.employment = $filter("filter")($scope.injuryData.employment, { status: "current" });
                                            $scope.employer = $filter("filter")($scope.injuryData.employer, { status: "current" });
                                            $scope.empaddress = $filter("filter")($scope.injuryData.employeraddress, { status: "current" });
                                            $scope.insurance = $filter("filter")($scope.injuryData.insurance, { status: "current" });
                                            $scope.claimadjuster = $filter("filter")($scope.injuryData.claimsadjuster, { status: "current" });
                                            //edited for default value. by manoj 12-april-2016
                                            $scope.employercontact = $filter("filter")($scope.injuryData.employercontact, { status: "current" });
                                            //end here manoj 12-april-2016

                                            $scope.acceptedbody = injuredPartid;
                                            //Merged above data
                                            $scope.mergedInjuriesforBackground = $scope.merge($scope.employer[0], $scope.empaddress[0], $scope.insurance[0], $scope.claimadjuster[0], $scope.basicinfo);
                                            $scope.utilization = $filter("filter")($scope.injuryData.utilizationreview, { status: "current" });
                                            $scope.rncasemanager = $filter("filter")($scope.injuryData.rncasemanager, { status: "current" });
                                            $scope.locationaddress = $filter("filter")($scope.injuryData.locationaddressinjury, { status: "current" });
                                            $scope.injuryinfo = $filter("filter")($scope.injuryData.injuryinformation);
                                            $scope.createdDate = $scope.injuryinfo[0].dateofinjury;
                                             
                                            $scope.mergedData = $scope.merge($scope.mergedInjuriesforBackground, $scope.utilization[0], $scope.rncasemanager[0], $scope.locationaddress[0], $scope.injuryinfo[0], $scope.employment[0]);
                                            //Merging Injury data with Background Data
                                            $scope.backgroundInfo = $scope.merge($scope.locationaddress[0], $scope.empaddress[0], $scope.employer[0], $scope.employment[0], $scope.insurance[0], $scope.claimadjuster[0], $scope.injuryinfo[0], $scope.amaeditionData);
                                            //Assigning values to selectinjuries data
                                            $scope.report.data.bginfo = $scope.merge($scope.basicinfo, $scope.contactinfo, $scope.address, $scope.occupation, $scope.backgroundInfo);

                                            //set witness data in injured body systems section
                                            var witnes = [];
                                            var witnesOther = [];
                                             
                                            if ($scope.injuryinfo[0].witnes) {
                                                if ($scope.injuryinfo[0].witnes.Supervisor == true) {
                                                    witnes.push('Supervisor');
                                                }
                                                if ($scope.injuryinfo[0].witnes.Coworker == true) {
                                                    witnes.push('Coworker');
                                                }
                                                if ($scope.injuryinfo[0].witnes.Other == true) {
                                                    witnesOther.push('Other');
                                                }
                                            }
                                            //set first aid measure in injured body systems section
                                            var firstAidMeasure = [];
                                            //var firstAidMeasureOther = [];
											$scope.report.data.selectinjuries.other_measure=[];
                                            if ($scope.injuryinfo[0].firstaid_measure) {
                                                if ($scope.injuryinfo[0].firstaid_measure.Ice == true) {
                                                    firstAidMeasure.push('Ice');
                                                }
                                                if ($scope.injuryinfo[0].firstaid_measure.Heat == true) {
                                                    firstAidMeasure.push('Heat');
                                                }
                                                if ($scope.injuryinfo[0].firstaid_measure.counterPain == true) {
                                                    firstAidMeasure.push('Over the counter pain meds');
                                                }
                                                if ($scope.injuryinfo[0].firstaid_measure.other_measure == true) {
                                                    //firstAidMeasureOther.push('Other');
													$scope.report.data.selectinjuries.other_measure.push('Other');
                                                }
                                            }
                                            //set Reported Employee in injured body systems section
                                            var reportedEmployee = [];
                                            //var reportedEmployeeOther = [];
											$scope.report.data.selectinjuries.other_reportedemploye=[];
                                            if ($scope.injuryinfo[0].reportedemploye) {
                                                if ($scope.injuryinfo[0].reportedemploye.Supervisor == true) {
                                                    reportedEmployee.push('Supervisor');
                                                }
                                                if ($scope.injuryinfo[0].reportedemploye.HR == true) {
                                                    reportedEmployee.push('Human resources');
                                                }
                                                if ($scope.injuryinfo[0].reportedemploye.Owner == true) {
                                                    reportedEmployee.push('Owner');
                                                }
                                                if ($scope.injuryinfo[0].reportedemploye.Other_reportemployer == true) {
                                                    //reportedEmployeeOther.push('Other');
													$scope.report.data.selectinjuries.other_reportedemploye.push('Other');
                                                }
                                            }

                                            $scope.report.data.selectinjuries = $scope.mergedData;
                                            $scope.report.data.selectinjuries.witnes = witnes;
                                            $scope.report.data.selectinjuries.witnesothercheck = witnesOther;
                                            $scope.report.data.selectinjuries.otherwitnes = $scope.injuryinfo[0].otherwitnes;
                                            $scope.report.data.selectinjuries.firstaid_measure = firstAidMeasure;
                                            //$scope.report.data.selectinjuries.other_measure = firstAidMeasureOther;
                                            $scope.report.data.selectinjuries.reportedemploye = reportedEmployee;
                                            //$scope.report.data.selectinjuries.other_reportedemploye = reportedEmployeeOther;
                                            $scope.report.data.selectinjuries.reportedEmployerOtherText = $scope.injuryinfo[0].reportedemployOther;
                                            $scope.report.data.selectinjuries.employeehandedness = $scope.patientData.patientsList[0].basicinformation[0].employeehandedness;
                                            if ($scope.injuryinfo[0].additionaldetail) {
                                                $scope.report.data.selectinjuries.siadditional = 'Yes';
                                            }

                                            //set concatedbody part for open reports
                                            $scope.report.data.selectinjuries.sibodypart = $scope.selectedArray;
                                            //set concated si body part 
                                            $scope.report.data.selectinjuries.concatedbodypart = new Array;
                                            $scope.report.data.selectinjuries.concatedbodypart = $scope.bodypartPreview;

                                            try
											{
												$scope.report.data.selectinjuries.ethnicityselect = $scope.demographics.ethnicity;
											}
											catch(err)
											{
												//console.log(err);
											}
											
											try
											{
												$scope.report.data.selectinjuries.injuredrace = $scope.demographics.race;
											}
											catch(err)
											{
												//console.log(err);
											}
											
											try
											{
												$scope.report.data.selectinjuries.ethnicityselectother = $scope.demographics.ethnicityother;
											}
											catch(err)
											{
												//console.log(err);
											}
											
											try
											{
												$scope.report.data.selectinjuries.injuredraceother = $scope.demographics.raceother;
											}
											catch(err)
											{
												//console.log(err);
											}
											
                                            $scope.report.data.selectinjuries.phonenumber = new Object();
                                            $scope.report.data.selectinjuries.phonenumber = $scope.telephonenumber;

                                            //code by shridhar date 19-jan-2015 reason: for injure system problem
                                            $scope.report.data.selectinjuries.visited = $scope.visitedSelectInjury;

                                            //setting default value for adl section
                                            var parentSelectMenus = ['ADLselfCareUrinBody', 'ADLselfCareDefeBody', 'ADLselfCareTeethBody', 'ADLselfCareHairBody', 'ADLselfCareDressBody', 'ADLselfCareBathBody', 'ADLselfCareEatBody',
                                                'ADLcommWritBody', 'ADLcommTypingBody', 'ADLcommSeeingBody', 'ADLcommHearingBody', 'ADLcommSpeakingBody', 'ADLPhysicalStandBody', 'ADLPhysicalSitBody', 'ADLPhysicalRecliBody', 'ADLPhysicalWalkBody', 'ADLPhysicalClimbBody',
                                                'ADLsensoryHearBody', 'ADLsensorySeeBody', 'ADLsensoryTactileBody', 'ADLsensoryTastBody', 'ADLsensorySmellBody', 'ADLnonSpecGraspBody', 'ADLnonSpecLiftBody', 'ADLnonSpecTactBody', 'ADLtravelRidBody', 'ADLtravelDrivBody', 'ADLtravelFlyBody',
                                                'ADLsleepRestBody', 'ADLsleepNoctBody', 'ADLsexualOrgaBody', 'ADLsexualEjacBody', 'ADLsexualLubriBody', 'ADLsexualErecBody'
                                            ];

                                            if (typeof $scope.report.data['ActivitiesofDailyLiving'] === 'undefined') {
                                                $scope.report.data['ActivitiesofDailyLiving'] = new Object();
                                            }

                                            for (var j = 0; j < parentSelectMenus.length; j++) {
                                                var currentradioID = '';
                                                for (var i = 0; i < $scope.report.data['selectinjuries'].concatedbodypart.length; i++) {
                                                    currentradioID = parentSelectMenus[j] + $scope.report.data['selectinjuries'].concatedbodypart[i].concateId + 'radio';
                                                    if (typeof $scope.report.data['ActivitiesofDailyLiving'][currentradioID] === 'undefined') {
                                                        $scope.report.data['ActivitiesofDailyLiving'][currentradioID] = 'No limitations';
                                                    }
                                                }
                                            }

                                            if (typeof $scope.report.data.signDoctor != "object") {
                                                $scope.report.data.signDoctor = new Object();
                                            }
											else
											{
												$scope.report.data.signDoctor = new Object();
											}

                                            //NPI number data must be seen for all users
                                            $scope.report.data.usernpinumber = loggenInUser[0].userData[0].usernpinumber ? loggenInUser[0].userData[0].usernpinumber : '';
                                            $rootScope.usernpinumber = loggenInUser[0].userData[0].usernpinumber ? loggenInUser[0].userData[0].usernpinumber : '';

                                            if ($scope.currentUser.level == 'level4') {

                                                $scope.report.data.signDoctor.level4 = new Object;
                                                $scope.report.data.signDoctor.level4.firstname = new Object;
                                                $scope.report.data.signDoctor.level4.lastname = new Object;
                                                $scope.report.data.signDoctor.level4.licensenumber = new Object;
                                                $scope.report.data.signDoctor.level4.speciality = new Object;
                                                $scope.report.data.signDoctor.level4.profession = new Object;
                                                $scope.report.data.signDoctor.level4.otherprofessiontext = new Object;
                                                $scope.report.data.signDoctor.level4.firstname = loggenInUser[0].userData[0].firstname ? loggenInUser[0].userData[0].firstname : '';
                                                $scope.report.data.signDoctor.level4.lastname = loggenInUser[0].userData[0].lastname ? loggenInUser[0].userData[0].lastname : '';
                                                $scope.report.data.signDoctor.level4.licensenumber = loggenInUser[0].userData[0].licensenumber ? loggenInUser[0].userData[0].licensenumber : '';
                                                $scope.report.data.signDoctor.level4.speciality = loggenInUser[0].userData[0].speciality ? loggenInUser[0].userData[0].speciality : '';
                                                $scope.report.data.signDoctor.level4.profession = loggenInUser[0].userData[0].profession ? loggenInUser[0].userData[0].profession : '';
                                                $scope.report.data.signDoctor.level4.otherprofessiontext = loggenInUser[0].userData[0].otherprofessiontext ? loggenInUser[0].userData[0].otherprofessiontext : '';
                                                $scope.report.data.signDoctor.level4.id = new Object;
                                                $scope.report.data.signDoctor.level4.id = $scope.currentUser.id;
                                            }
                                            else if ($scope.currentUser.level == 'level3') {
                                                $scope.report.data.signDoctor.level3 = new Object;
                                                $scope.report.data.signDoctor.level3.firstname = new Object;
                                                $scope.report.data.signDoctor.level3.lastname = new Object;
                                                $scope.report.data.signDoctor.level3.profession = new Object;
                                                $scope.report.data.signDoctor.level3.id = new Object;
                                                $scope.report.data.signDoctor.level3.otherprofessiontext = new Object;
                                                $scope.report.data.signDoctor.level3.firstname = loggenInUser[0].userData[0].firstname ? loggenInUser[0].userData[0].firstname : '';
                                                $scope.report.data.signDoctor.level3.lastname = loggenInUser[0].userData[0].lastname ? loggenInUser[0].userData[0].lastname : '';
                                                $scope.report.data.signDoctor.level3.profession = loggenInUser[0].userData[0].profession ? loggenInUser[0].userData[0].profession : '';
                                                $scope.report.data.signDoctor.level3.otherprofessiontext = loggenInUser[0].userData[0].otherprofessiontext ? loggenInUser[0].userData[0].otherprofessiontext : '';
                                                $scope.report.data.signDoctor.level3.id = $scope.currentUser.id;
                                            }

                                        }//End of report status == open
                                         
										if ($scope.existingpatientData.patientData[0].status == 'closed') {			
											//to print npi number of user, who submitted report
											$rootScope.usernpinumber = $scope.report.data.usernpinumber;
										} 

                                        if ($scope.report) {
                                            for (var i = 0; i < $scope.report.sections.length; i++) {
                                                $builder.forms[$scope.report.sections[i].sectiondataid] = $scope.report.forms[$scope.report.sections[i].sectiondataid];
                                            }
                                            var Isselectinjury = $cookieStore.get('isBdpart');
                                            if (!Isselectinjury) {
                                                var section = {
                                                    class: "",
                                                    index: 1,
                                                    sectiondataid: "bginfo",
                                                    sectionid: "",
                                                    sectionname: "Background Information",
                                                    type: "section",
                                                    visiblity: true
                                                }
                                                $scope.currentsectionchange(section, 0, 'bginfo');
                                            } else {
                                                $scope.currentsection = "Injured Body System(s)";
                                                //$scope.currentsectionchange(section, 1, 'selectinjuries');
                                                // 
                                                var section = {
                                                    class: "",
                                                    index: 2,
                                                    sectiondataid: "selectinjuries",
                                                    sectionid: "",
                                                    sectionname: "Injured Body System(s)",
                                                    type: "section",
                                                    visiblity: true
                                                }
                                                $scope.currentsectionchange(section, 1, 'selectinjuries');
                                                $cookieStore.remove('isBdpart');
                                            }
                                        }
                                    }
                                });

                            });
                        });
                    }
                    else {
                        $rootScope.newReportImported = true;
                        getdataClinic.query({ 'currentusername': $rootScope.currentUser.practicename }).$promise.then(function (amaedition) {

                            if (amaedition[0]) {
                                $scope.practiceInfo = amaedition[0].clinicLocation[0];
                                $scope.amaeditions = amaedition[0].clinicLocation[0].editionama;
                                $scope.amaeditionData = { 'administrativerule': $scope.amaeditions };
                                $scope.telephonenumber = '';
                                if (amaedition[0].clinicLocation[0].billingaddress) {
                                    $scope.telephonenumber = amaedition[0].clinicLocation[0].billingaddress.phonenumber ? amaedition[0].clinicLocation[0].billingaddress.phonenumber : '';
                                    $rootScope.billingTelephonenumber = amaedition[0].clinicLocation[0].billingaddress.phonenumber ? amaedition[0].clinicLocation[0].billingaddress.phonenumber : '';
                                    $rootScope.billingExtension = amaedition[0].clinicLocation[0].billingaddress.billingextension ? amaedition[0].clinicLocation[0].billingaddress.billingextension : '';
                                }
                                $rootScope.allcliniclocation = amaedition[0].clinicLocation[0].practiceaddress;
                                var getcliniclocation = amaedition[0].clinicLocation[0].practiceaddress[0];
                                $scope.defaultcliniclocation = getcliniclocation.county + ', ' + getcliniclocation.street + ', ' + getcliniclocation.city + ', ' + getcliniclocation.zipcode + ', ' + getcliniclocation.state + ', ' + getcliniclocation.country;
                                
                                $rootScope.practicefaxnumber = amaedition[0].clinicLocation[0].faxnumber;
								
								

                            }

                            //Get Form for the NEW Report according to the Form type(dfr/pr2/pr4) and status:'Publish'

                            reportFormdata.query({ id: $scope.formType }).$promise.then(function (responce) {
                                 
                                $scope.formlist = responce[0];
                                if (responce[0].formList) {
                                    if (responce[0].formList.formdata) {
                                        //Get Publish Id First for saving the publish Id while creating a new Report
                                        $scope.formversion = responce[0].formList.version;

                                        //get publish report id 
                                        var query = { formtype: $scope.formType, formversion: $scope.formversion };
                                        getPublishReportId.query(query).$promise.then(function (publishData) {
                                            if (publishData[0].reportId[0]) {
                                               
                                                $scope.randomPublishReportId = publishData[0].reportId[0]._id;

                                                $scope.formid = responce[0].formList._id;
                                                $scope.formname = responce[0].formList.title;
                                                $scope.formtype = responce[0].formList.formtype;
                                                $scope.report = angular.fromJson(responce[0].formList.formdata);
                                                $rootScope.version = responce[0].formList.version;
                                                $rootScope.formname = responce[0].formList.title;
                                                $rootScope.formtype = responce[0].formList.formtype;
                                                $rootScope.report = angular.fromJson(responce[0].formList.formdata);
                                                $rootScope.currentReportStatus = 'open';
                                                $scope.currentReportStatus = 'open';
                                                $scope.report.data = new Object();
												$scope.report.data.objectivefindingsgeneral = new Object();
												$scope.report.data.objectivefindingsgeneral.objfindingslblPublishTextarea = "<p>A general exam is performed. The patient is in no acute distress, alert, oriented and cooperative. External head exam is normal. The neck is without evidence of external swelling or gross deformity. The chest is clear to auscultation right and left fields. The cardiac exam reveals regular rhythm and rate. No murmur. The abdomen is soft. Skin exam is clear.</p>";
																								
												$scope.report.data.irsnumber = $rootScope.currentUser.practiceDetails.irsnumber;
                                                $scope.report.data.rfadetails = $rootScope.currentUser.practiceDetails.rfadetails;																							
												
                                                //display current Status Report Wise
                                                $scope.displayReportStatus = $filter('capitalize')($scope.currentReportStatus);

                                                //For importing from DFR Locked report
                                                if ($scope.formType == 'dfr' || $scope.formType == 'pr2' || $scope.formType == 'pr4') {
                                                    getLatestClosedReport.query({ patientid: $sessionStorage.patientId, injuryid: $sessionStorage.InjuryId }).$promise.then(function (response) {
                                                         
                                                        if (response[0]) {
                                                            var closedReportType = response[0].patients[0].formtype;
                                                            //New Report will import data from the previous DFR/PR2/PR4 Report
                                                            $scope.closedreport = true;

                                                            //New Report will import data from the previous DFR or PR2 Report
                                                            //if ($scope.formType == 'pr2') {
                                                            //    if (closedReportType == 'dfr' || closedReportType == 'pr2') {
                                                            //        $scope.closedreport = true;
                                                            //    }
                                                            //} else if ($scope.formType == 'pr4') {
                                                            //    $scope.closedreport = true;
                                                            //}

                                                            if ($scope.closedreport) {
                                                                //importing report data from previous report.
                                                                $scope.report.data = response[0].patients[0].data;
																
																//re-assigning RFA & IRS details from practice setting for close report. 
																$scope.report.data.irsnumber = $rootScope.currentUser.practiceDetails.irsnumber;
																$scope.report.data.rfadetails = $rootScope.currentUser.practiceDetails.rfadetails;
																																
																/**code to signature issue starts here*/
																 $scope.report.data.signDoctor=new Object;
																if ($scope.currentUser.level == 'level4') {

																		$scope.report.data.signDoctor.level4 = new Object;
																		$scope.report.data.signDoctor.level4.firstname = new Object;
																		$scope.report.data.signDoctor.level4.lastname = new Object;
																		$scope.report.data.signDoctor.level4.licensenumber = new Object;
																		$scope.report.data.signDoctor.level4.speciality = new Object;
																		$scope.report.data.signDoctor.level4.profession = new Object;
																		$scope.report.data.signDoctor.level4.otherprofessiontext = new Object;
																		$scope.report.data.signDoctor.level4.firstname = loggenInUser[0].userData[0].firstname ? loggenInUser[0].userData[0].firstname : '';
																		$scope.report.data.signDoctor.level4.lastname = loggenInUser[0].userData[0].lastname ? loggenInUser[0].userData[0].lastname : '';
																		$scope.report.data.signDoctor.level4.licensenumber = loggenInUser[0].userData[0].licensenumber ? loggenInUser[0].userData[0].licensenumber : '';
																		$scope.report.data.signDoctor.level4.speciality = loggenInUser[0].userData[0].speciality ? loggenInUser[0].userData[0].speciality : '';
																		$scope.report.data.signDoctor.level4.profession = loggenInUser[0].userData[0].profession ? loggenInUser[0].userData[0].profession : '';
																		$scope.report.data.signDoctor.level4.otherprofessiontext = loggenInUser[0].userData[0].otherprofessiontext ? loggenInUser[0].userData[0].otherprofessiontext : '';
																		$scope.report.data.signDoctor.level4.id = new Object;
																		$scope.report.data.signDoctor.level4.id = $scope.currentUser.id;
																}
																else if ($scope.currentUser.level == 'level3') {
																		$scope.report.data.signDoctor.level3 = new Object;
																		$scope.report.data.signDoctor.level3.firstname = new Object;
																		$scope.report.data.signDoctor.level3.lastname = new Object;
																		$scope.report.data.signDoctor.level3.profession = new Object;
																		$scope.report.data.signDoctor.level3.id = new Object;
																		$scope.report.data.signDoctor.level3.otherprofessiontext = new Object;
																		$scope.report.data.signDoctor.level3.firstname = loggenInUser[0].userData[0].firstname ? loggenInUser[0].userData[0].firstname : '';
																		$scope.report.data.signDoctor.level3.lastname = loggenInUser[0].userData[0].lastname ? loggenInUser[0].userData[0].lastname : '';
																		$scope.report.data.signDoctor.level3.profession = loggenInUser[0].userData[0].profession ? loggenInUser[0].userData[0].profession : '';

																		$scope.report.data.signDoctor.level3.otherprofessiontext = loggenInUser[0].userData[0].otherprofessiontext ? loggenInUser[0].userData[0].otherprofessiontext : '';
																		$scope.report.data.signDoctor.level3.id = $scope.currentUser.id;
																}
																		 /**code to signature issue ends here*/

                                                                if ($scope.report.data) {
                                                                    angular.forEach($scope.report.data, function (value, key) {

                                                                        var treatment = key.match(/treatment/gi);
                                                                        //Do not set Yes/No questions for following section in pr2 and pr4 reports when report data is copied from previous report.  

                                                                        /*if (key != 'bginfo' && key != 'selectinjuries' && key != 'patientcomplaints' && key != treatment && key != 'documentation' && key != 'objectivefindings') {*/

                                                                        /*Treatment condition changed by Unais to prevent 'disableradio' radio button to show up in treatment sections (both general and body parts) (Dated 11th Feb, 2016)*/
                                                                        if (key != 'bginfo' && key != 'selectinjuries' && key != 'patientcomplaints' && key.indexOf('treatment') == -1 && key != 'documentation' && key != 'objectivefindings') { //&& ($scope.formType == 'pr4' && key != 'ActivitiesofDailyLiving')) {
                                                                            try {
                                                                                if ($scope.report.data[key]) {
																					if($scope.formType == 'pr4')
																					{
																						if(key != 'ActivitiesofDailyLiving')
																							$scope.report.data[key].disableradio = '1';
																						else
																							$scope.report.data[key].disableradio = 'Yes';
																					}
																					else
																						$scope.report.data[key].disableradio = '1';
                                                                                }
                                                                            }
                                                                            catch (e) {
                                                                                //console.log(e.message);
                                                                            }
                                                                        }
                                                                    });
                                                                }

                                                                //clear data of section which does not import from previous report.
                                                                if ($scope.report.data.selectinjuries.concatedbodypart.length > 0) {

                                                                    for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                                                                        var concateId = $scope.report.data.selectinjuries.concatedbodypart[i].concateId;
                                                                        var bodystystem = $scope.report.data.selectinjuries.concatedbodypart[i].bodysystem;
                                                                        //treatment body part data does not import from previous dfr/pr2/pr4 reports
                                                                        if ($scope.report.data['treatment' + concateId]) {
                                                                            $scope.report.data['treatment' + concateId] = new Object();
                                                                        }
                                                                        //Impairment Rating body part does not import from previous PR4 reports 
                                                                        if ($scope.report.data['impairmentrating' + concateId]) {
                                                                            $scope.report.data['impairmentrating' + concateId] = new Object();
                                                                        }

                                                                        if ($scope.formType == 'pr4') {
                                                                            if (bodystystem == 'Spine' || bodystystem == 'Upper Extremity' || bodystystem == 'Lower Extremity') {
                                                                                if ($scope.report.data['objectivefindings' + concateId]) {
                                                                                    $scope.report.data['objectivefindings' + concateId] = new Object();
                                                                                }
                                                                            }
                                                                            //added by shridhar.. to set No when new pr4 created
                                                                            $scope.report.data.selectinjuries.concatedbodypart[i].ratebodyYesNoRadio = 'No';
                                                                            $scope.report.data.selectinjuries.sibodypart[i].ratebodyYesNoRadio = 'No';
                                                                        }
                                                                    }
                                                                }

                                                                //General section do not import from previous dfr/pr2/pr4 reports
                                                                $scope.report.data['patientcomplaints'] = new Object();
                                                                $scope.report.data.patientcomplaints.currentexamdate = new Date();
                                                                $scope.report.data.patientcomplaints.phonenumber = $scope.telephonenumber;
                                                                $scope.report.data.patientcomplaints.cliniclocation = $scope.defaultcliniclocation;
                                                                $scope.rfaClinicLocUpdate($scope.defaultcliniclocation);
                                                                $scope.report.data['objectivefindings'] = new Object();
                                                                $scope.report.data.objectivefindings.OfTempratureRadio = "F";
                                                                $scope.report.data['documentation'] = new Object();
                                                                $scope.report.data['impairmentratingfinalclaim'] = new Object();
                                                                $scope.report.data['bc'] = new Object();

                                                                $scope.report.data['otherforminfo'] = new Object();
                                                                $scope.report.data.otherforminfo.previousclosereportdateofinjury = new Date();
                                                                $scope.report.data.otherforminfo.previousclosereportdateofinjury = response[0].patients[0].data.patientcomplaints.currentexamdate;

                                                                //Shridhar : 29 April 2016  get data from patient for medical history n social history
                                                                getSelectedMedicalHistoryCheckbox();
                                                                getSelectedSocialhistoryCheckbox()
                                                            }
                                                        }
                                                    }); // End of Closed Report Data getLatestClosedReport
                                                }

                                                var injuredPartid = '';
                                                $scope.bodyParts = [];
                                                $scope.bodypartSide = [];
                                                $scope.bodypartMechanism = [];
                                                $scope.bodypartOther = [];
                                                $scope.bodysystemOther = [];
                                                $scope.mechanismOther = [];
                                                $scope.patientName = $scope.patientData.patientsList[0].basicinformation[0].firstname + " " + $scope.patientData.patientsList[0].basicinformation[0].lastname;
                                                $scope.createdDate = $scope.patientData.patientsList[0].createddate;
                                                 
                                                //General section do not import from previous dfr/pr2/pr4 reports
                                                $scope.report.data.bginfo = new Object();
                                                $scope.report.data.selectinjuries = new Object();
                                                $scope.report.data['patientcomplaints'] = new Object();
												
												try{      
													var curLocindex=$scope.rfaClinicalLocation($scope.defaultcliniclocation);
												
													if(typeof $scope.report.data.patientcomplaints=='undefined'){
														//$scope.report.data.patientcomplaints={};
														$scope.report.data.patientcomplaints.subjectivecomplaints_contactphonenumber= $rootScope.allcliniclocation[curLocindex].phonenumber;;
														$scope.report.data.patientcomplaints.subjectivecomplaints_extension= $rootScope.allcliniclocation[curLocindex].extension;
														$scope.report.data.patientcomplaints.subjectivecomplaints_fax= $rootScope.allcliniclocation[curLocindex].faxnumber;
													}else{
														if( $scope.report.data.patientcomplaints.subjectivecomplaints_fax==''){
														$scope.report.data.patientcomplaints.subjectivecomplaints_fax = $rootScope.allcliniclocation[curLocindex].faxnumber;
														}
														if( $scope.report.data.patientcomplaints.subjectivecomplaints_contactphonenumber==''){
															$scope.report.data.patientcomplaints.subjectivecomplaints_contactphonenumber = $rootScope.allcliniclocation[curLocindex].phonenumber;
														}
														if(typeof $scope.report.data.patientcomplaints.subjectivecomplaints_contactphonenumber=='undefined'){
															$scope.report.data.patientcomplaints.subjectivecomplaints_contactphonenumber = $rootScope.allcliniclocation[curLocindex].phonenumber;
														}
														if(typeof $scope.report.data.patientcomplaints.subjectivecomplaints_fax=='undefined'){
															$scope.report.data.patientcomplaints.subjectivecomplaints_fax = $rootScope.allcliniclocation[curLocindex].faxnumber;
														}
															if(typeof $scope.report.data.patientcomplaints.subjectivecomplaints_extension=='undefined'){
															$scope.report.data.patientcomplaints.subjectivecomplaints_extension = $rootScope.allcliniclocation[curLocindex].extension;
														}
														if( $scope.report.data.patientcomplaints.subjectivecomplaints_extension==''){
															
															$scope.report.data.patientcomplaints.subjectivecomplaints_extension = $rootScope.allcliniclocation[curLocindex].extension;
														}else{
															
														}
													}
												}catch(err){
													//console.log(err);
												} 
                                                $scope.report.data.patientcomplaints.currentexamdate = new Date();
                                                $scope.report.data.patientcomplaints.currenttimeofexam = new Date();
                                                $scope.report.data.patientcomplaints.cliniclocation = $scope.defaultcliniclocation;
                                                //Calls RFA update function to update scope with the currently selected clinic address
                                                $scope.rfaClinicLocUpdate($scope.defaultcliniclocation);

                                                $scope.report.data.patientcomplaints.phonenumber = $scope.telephonenumber;
                                                $scope.report.data['objectivefindings'] = new Object();
                                                $scope.report.data.objectivefindings.OfTempratureRadio = "F";
                                                $scope.report.data['documentation'] = new Object();
                                                //Remove billing calculation data of previous PR4 Report
                                                $scope.report.data['bc'] = new Object();
                                                $scope.basicinfo = $scope.patientData.patientsList[0].basicinformation[0];
                                                $scope.contactinfo = $scope.patientData.patientsList[0].contactinformation[0];
                                                $scope.address = $scope.patientData.patientsList[0].address[0];
                                                $scope.occupation = $scope.patientData.patientsList[0].occupation[0];
                                                $scope.demographics = $scope.patientData.patientsList[0].demographics[0];
                                                $scope.amaeditionData;

                                                $scope.backgroundData = $scope.merge($scope.basicinfo, $scope.contactinfo, $scope.address, $scope.occupation, $scope.amaeditionData);

                                                for (var i = 0; i < injuryData[0].selectinjuries[0].injury[0].injurydata.acceptedbodyparts.length; i++) {
                                                    if (injuryData[0].selectinjuries[0].injury[0].injurydata.acceptedbodyparts[i].status == 'current') {
                                                        injuredPartid = injuryData[0].selectinjuries[0].injury[0].injurydata.acceptedbodyparts[i];
                                                    }
                                                }
                                                $scope.selectedArray = [];
                                                $scope.bodypartPreview = [];
                                                if (injuredPartid != '') {
                                                    for (var i = 0; i < injuredPartid.injuredbodypart.length; i++) {
                                                        $scope.bodyParts[i] = angular.fromJson(injuredPartid.injuredbodypart[i].bodypart);
                                                        $scope.bodypartSide[i] = injuredPartid.injuredbodypart[i].bodypartsides;
                                                        $scope.bodypartMechanism[i] = injuredPartid.injuredbodypart[i].bodypart_mechanism;

                                                        /*
														*shridhar
														*bodypartDateOfRating,bodypartRateBodypart, ratebodyYesNoRadio this part used for MMI rate body
														*/

                                                        var bodypartDateOfRating = '';
                                                        var bodypartRateBodypart = false;
                                                        var ratebodyYesNoRadio = 'No';
                                                        //this set No -- bcz whenever pr4 created, ratebodyYesNoRadio must be no
                                                        injuredPartid.injuredbodypart[i].ratebodyYesNoRadio = 'No'

                                                        try {
                                                            if (typeof injuredPartid.injuredbodypart[i].dateOfRating != 'undefined' && injuredPartid.injuredbodypart[i].dateOfRating != '' && injuredPartid.injuredbodypart[i].dateOfRating != null) {
                                                                bodypartDateOfRating = injuredPartid.injuredbodypart[i].dateOfRating;
                                                                bodypartRateBodypart = injuredPartid.injuredbodypart[i].ratebodypart;
                                                                //ratebodyYesNoRadio = injuredPartid.injuredbodypart[i].ratebodyYesNoRadio;														
                                                            }
                                                        } catch (err) {
                                                            //console.log(err);
                                                        }

                                                        if (injuredPartid.injuredbodypart[i].otherbodypart_mechanismshowmodel) {
                                                            $scope.mechanismOther[i] = injuredPartid.injuredbodypart[i].otherbodypart_mechanismshowmodel;
                                                        }
                                                        else {
                                                            $scope.mechanismOther[i] = '';
                                                        }

                                                        if (injuredPartid.injuredbodypart[i].otherBodyparts) {

                                                            $scope.bodypartOther[i] = injuredPartid.injuredbodypart[i].otherBodyparts;
                                                        } else {
                                                            $scope.bodypartOther[i] = '';
                                                        }
                                                        if (injuredPartid.injuredbodypart[i].otherBodysystem) {
                                                            $scope.bodysystemOther[i] = injuredPartid.injuredbodypart[i].otherBodysystem;
                                                        } else {
                                                            $scope.bodysystemOther[i] = '';
                                                        }
                                                        $scope.selectedArray.push(($scope.merge($scope.bodyParts[i], { bdsides: $filter('lowercase')($scope.bodypartSide[i]) }, { bdmechanism: $scope.bodypartMechanism[i] }, { bdpartother: $scope.bodypartOther[i] }, { bdsystemother: $scope.bodysystemOther[i] }, { bdmechanismother: $scope.mechanismOther[i] }, { 'dateOfRating': bodypartDateOfRating }, { 'ratebodypart': bodypartRateBodypart }, { 'ratebodyYesNoRadio': ratebodyYesNoRadio })));
                                                        //setting concated bodypartid for Report preview
                                                        var concatedBodypartId;

                                                        if ($scope.bodyParts[i].id == 'other') {
                                                            if ($scope.bodypartSide[i] == 'N/A') {
                                                                concatedBodypartId = $scope.bodysystemOther[i] + $scope.bodypartOther[i];
                                                            } else {
                                                                concatedBodypartId = $scope.bodysystemOther[i] + $scope.bodypartOther[i] + $filter('lowercase')($scope.bodypartSide[i]);
                                                            }
                                                        } else {
                                                            if ($scope.bodypartSide[i] == 'None') {
                                                                concatedBodypartId = $scope.bodyParts[i].id;
                                                            } else {
                                                                concatedBodypartId = $scope.bodyParts[i].id + $filter('lowercase')($scope.bodypartSide[i]);
                                                            }
                                                        }

                                                        $scope.bodypartPreview.push(($scope.merge($scope.bodyParts[i], { bdsides: $filter('lowercase')($scope.bodypartSide[i]) }, { bdmechanism: $scope.bodypartMechanism[i] }, { bdpartother: $scope.bodypartOther[i] }, { bdsystemother: $scope.bodysystemOther[i] }, { bdmechanismother: $scope.mechanismOther[i] }, { concateId: concatedBodypartId }, { 'dateOfRating': bodypartDateOfRating }, { 'ratebodypart': bodypartRateBodypart }, { 'ratebodyYesNoRadio': injuredPartid.injuredbodypart[i].ratebodyYesNoRadio })));
                                                    }
                                                }

                                                //get value from patient to medical history 
                                                getSelectedMedicalHistoryCheckbox();
                                                //get value from patient to social history
                                                getSelectedSocialhistoryCheckbox();

                                                $scope.injuryData = injuryData[0].selectinjuries[0].injury[0].injurydata;

                                                $scope.employer = $filter("filter")($scope.injuryData.employer, { status: "current" });
                                                $scope.empaddress = $filter("filter")($scope.injuryData.employeraddress, { status: "current" });
                                                $scope.insurance = $filter("filter")($scope.injuryData.insurance, { status: "current" });
                                                $scope.claimadjuster = $filter("filter")($scope.injuryData.claimsadjuster, { status: "current" });
                                                $scope.acceptedbody = injuredPartid;
                                                //Merged above data
                                                $scope.mergedInjuriesforBackground = $scope.merge($scope.employer[0], $scope.empaddress[0], $scope.insurance[0], $scope.claimadjuster[0]);
                                                $scope.utilization = $filter("filter")($scope.injuryData.utilizationreview, { status: "current" });
                                                $scope.rncasemanager = $filter("filter")($scope.injuryData.rncasemanager, { status: "current" });
                                                $scope.locationaddress = $filter("filter")($scope.injuryData.locationaddressinjury, { status: "current" });
                                                $scope.injuryinfo = $filter("filter")($scope.injuryData.injuryinformation);
                                                $scope.employment = $filter("filter")($scope.injuryData.employment, { status: "current" });

                                                $scope.createdDate = $scope.injuryinfo[0].dateofinjury;
                                                //Merged Above Data
                                                $scope.mergedData = $scope.merge($scope.mergedInjuriesforBackground, $scope.utilization[0], $scope.rncasemanager[0], $scope.locationaddress[0], $scope.injuryinfo[0], $scope.employment[0]);
                                                //Merging Injury data with Background Data
                                                 
                                                $scope.amaeditionData = { 'administrativerule': $scope.amaeditions };

                                                $scope.backgroundInfo = $scope.merge($scope.locationaddress[0], $scope.empaddress[0], $scope.employer[0], $scope.employment[0], $scope.insurance[0], $scope.claimadjuster[0], $scope.injuryinfo[0], $scope.amaeditionData);
                                                //Assigning values to selectinjuries data
                                                $scope.report.data.bginfo = $scope.merge($scope.basicinfo, $scope.contactinfo, $scope.address, $scope.occupation, $scope.backgroundInfo);

                                                //set witness data in injured body systems section
                                                var witnes = [];
                                                var witnesOther = [];

                                                if ($scope.injuryinfo[0].witnes) {
                                                    if ($scope.injuryinfo[0].witnes.Supervisor == true) {
                                                        witnes.push('Supervisor');
                                                    }
                                                    if ($scope.injuryinfo[0].witnes.Coworker == true) {
                                                        witnes.push('Coworker');
                                                    }
                                                    if ($scope.injuryinfo[0].witnes.Other == true) {
                                                        witnesOther.push('Other');
                                                    }
                                                }
                                                //set first aid measure in injured body systems section
                                                var firstAidMeasure = [];
                                                var firstAidMeasureOther = [];
                                                if ($scope.injuryinfo[0].firstaid_measure) {
                                                    if ($scope.injuryinfo[0].firstaid_measure.Ice == true) {
                                                        firstAidMeasure.push('Ice');
                                                    }
                                                    if ($scope.injuryinfo[0].firstaid_measure.Heat == true) {
                                                        firstAidMeasure.push('Heat');
                                                    }
                                                    if ($scope.injuryinfo[0].firstaid_measure.counterPain == true) {
                                                        firstAidMeasure.push('Over the counter pain meds');
                                                    }
                                                    if ($scope.injuryinfo[0].firstaid_measure.other_measure == true) {
                                                        firstAidMeasureOther.push('Other');
                                                    }
                                                }
                                                //set Reported Employee in injured body systems section
                                                var reportedEmployee = [];
                                                //var reportedEmployeeOther = [];
												$scope.report.data.selectinjuries.other_reportedemploye=[];
                                                if ($scope.injuryinfo[0].reportedemploye) {
                                                    if ($scope.injuryinfo[0].reportedemploye.Supervisor == true) {
                                                        reportedEmployee.push('Supervisor');
                                                    }
                                                    if ($scope.injuryinfo[0].reportedemploye.HR == true) {
                                                        reportedEmployee.push('Human resources');
                                                    }
                                                    if ($scope.injuryinfo[0].reportedemploye.Owner == true) {
                                                        reportedEmployee.push('Owner');
                                                    }
                                                    if ($scope.injuryinfo[0].reportedemploye.Other_reportemployer == true) {
                                                        //reportedEmployeeOther.push('Other');
														$scope.report.data.selectinjuries.other_reportedemploye.push('Other');
                                                    }
                                                }

                                                $scope.report.data.selectinjuries = $scope.mergedData;
                                                $scope.report.data.selectinjuries.witnes = witnes;
                                                $scope.report.data.selectinjuries.witnesothercheck = witnesOther;
                                                $scope.report.data.selectinjuries.otherwitnes = $scope.injuryinfo[0].otherwitnes;
                                                $scope.report.data.selectinjuries.firstaid_measure = firstAidMeasure;
                                                $scope.report.data.selectinjuries.other_measure = firstAidMeasureOther;
                                                $scope.report.data.selectinjuries.reportedemploye = reportedEmployee;
                                                //$scope.report.data.selectinjuries.other_reportedemploye = reportedEmployeeOther;
                                                $scope.report.data.selectinjuries.reportedEmployerOtherText = $scope.injuryinfo[0].reportedemployOther;
                                                $scope.report.data.selectinjuries.sibodypart = $scope.selectedArray;
                                                
												
												try
												{
													$scope.report.data.selectinjuries.ethnicityselect = $scope.demographics.ethnicity;
												}
												catch(err)
												{
													//console.log(err);
												}
												
												try
												{
													$scope.report.data.selectinjuries.injuredrace = $scope.demographics.race;
												}
												catch(err)
												{
													//console.log(err);
												}
												
												try
												{
													 $scope.report.data.selectinjuries.ethnicityselectother = $scope.demographics.ethnicityother;
												}
												catch(err)
												{
													//console.log(err);
												}
												
												try
												{
													$scope.report.data.selectinjuries.injuredraceother = $scope.demographics.raceother;
												}
												catch(err)
												{
													//console.log(err);
												}												
                                               
                                                
                                                $scope.report.data.selectinjuries.employeehandedness = $scope.patientData.patientsList[0].basicinformation[0].employeehandedness;

                                                $scope.report.data.selectinjuries.phonenumber = new Object();
                                                $scope.report.data.selectinjuries.phonenumber = $scope.telephonenumber;

                                                $scope.report.data.selectinjuries.visited = false;

                                                if ($scope.injuryinfo[0].additionaldetail) {
                                                    $scope.report.data.selectinjuries.siadditional = new Object;
                                                    $scope.report.data.selectinjuries.siadditional = 'Yes';
                                                }

                                                if (!$scope.report.data.selectinjuries.timeofpriorevaluation) {
                                                    $scope.report.data.selectinjuries.timeofpriorevaluation = new Date();
                                                }
                                                //set concated si body part 
                                                $scope.report.data.selectinjuries.concatedbodypart = new Array;
                                                $scope.report.data.selectinjuries.concatedbodypart = $scope.bodypartPreview;

                                                //setting default value for adl section
                                                $scope.report.data['ActivitiesofDailyLiving'] = new Object();

                                                var parentSelectMenus = ['ADLselfCareUrinBody', 'ADLselfCareDefeBody', 'ADLselfCareTeethBody', 'ADLselfCareHairBody', 'ADLselfCareDressBody', 'ADLselfCareBathBody', 'ADLselfCareEatBody',
													'ADLcommWritBody', 'ADLcommTypingBody', 'ADLcommSeeingBody', 'ADLcommHearingBody', 'ADLcommSpeakingBody', 'ADLPhysicalStandBody', 'ADLPhysicalSitBody', 'ADLPhysicalRecliBody', 'ADLPhysicalWalkBody', 'ADLPhysicalClimbBody',
													'ADLsensoryHearBody', 'ADLsensorySeeBody', 'ADLsensoryTactileBody', 'ADLsensoryTastBody', 'ADLsensorySmellBody', 'ADLnonSpecGraspBody', 'ADLnonSpecLiftBody', 'ADLnonSpecTactBody', 'ADLtravelRidBody', 'ADLtravelDrivBody', 'ADLtravelFlyBody',
													'ADLsleepRestBody', 'ADLsleepNoctBody', 'ADLsexualOrgaBody', 'ADLsexualEjacBody', 'ADLsexualLubriBody', 'ADLsexualErecBody'
                                                ];

                                                for (var j = 0; j < parentSelectMenus.length; j++) {
                                                    var currentradioID = '';
                                                    for (var i = 0; i < $scope.report.data['selectinjuries'].concatedbodypart.length; i++) {
                                                        currentradioID = parentSelectMenus[j] + $scope.report.data['selectinjuries'].concatedbodypart[i].concateId + 'radio';

                                                        $scope.report.data['ActivitiesofDailyLiving'][currentradioID] = new Object();
                                                        $scope.report.data['ActivitiesofDailyLiving'][currentradioID] = 'No limitations';

                                                    }
                                                }

                                                //setting default value for workrestriction section
                                                $scope.report.data['workrestriction'] = new Object();

                                                //setting default value of work restriction questions
                                                for (var j = 2; j <= 29; j++) {
                                                    $scope.report.data['workrestriction']['WRtb1tr' + j] = 'No limitations';
                                                }

                                                //setting default value of environmental restrictions
                                                for (var j = 1; j <= 10; j++) {
                                                    $scope.report.data['workrestriction']['WRea' + j] = 'Allowed';
                                                }

                                                if ($scope.report) {
                                                    for (var i = 0; i < $scope.report.sections.length; i++) {
                                                        $builder.forms[$scope.report.sections[i].sectiondataid] = $scope.report.forms[$scope.report.sections[i].sectiondataid];
                                                    }
                                                    $scope.currentsection = $scope.report.sections[0].sectionname;
                                                    $scope.currentsectionId = $scope.report.sections[0].sectiondataid;
                                                }

                                                //set info of user level4 and level3 for publish information
                                                if (typeof $scope.report.data.signDoctor != "object") {
                                                    $scope.report.data.signDoctor = new Object();
                                                }
												else
												{
													$scope.report.data.signDoctor = new Object();
												}

                                                //NPI number data must be seen for all users
                                                $scope.report.data.usernpinumber = loggenInUser[0].userData[0].usernpinumber ? loggenInUser[0].userData[0].usernpinumber : '';
                                                $rootScope.usernpinumber = loggenInUser[0].userData[0].usernpinumber ? loggenInUser[0].userData[0].usernpinumber : '';

                                                if ($scope.currentUser.level == 'level4') {

                                                    $scope.report.data.signDoctor.level4 = new Object;
                                                    $scope.report.data.signDoctor.level4.firstname = new Object;
                                                    $scope.report.data.signDoctor.level4.lastname = new Object;
                                                    $scope.report.data.signDoctor.level4.licensenumber = new Object;
                                                    $scope.report.data.signDoctor.level4.speciality = new Object;
                                                    $scope.report.data.signDoctor.level4.profession = new Object;
                                                    $scope.report.data.signDoctor.level4.otherprofessiontext = new Object;
                                                    $scope.report.data.signDoctor.level4.firstname = loggenInUser[0].userData[0].firstname ? loggenInUser[0].userData[0].firstname : '';
                                                    $scope.report.data.signDoctor.level4.lastname = loggenInUser[0].userData[0].lastname ? loggenInUser[0].userData[0].lastname : '';
                                                    $scope.report.data.signDoctor.level4.licensenumber = loggenInUser[0].userData[0].licensenumber ? loggenInUser[0].userData[0].licensenumber : '';
                                                    $scope.report.data.signDoctor.level4.speciality = loggenInUser[0].userData[0].speciality ? loggenInUser[0].userData[0].speciality : '';
                                                    $scope.report.data.signDoctor.level4.profession = loggenInUser[0].userData[0].profession ? loggenInUser[0].userData[0].profession : '';
                                                    $scope.report.data.signDoctor.level4.otherprofessiontext = loggenInUser[0].userData[0].otherprofessiontext ? loggenInUser[0].userData[0].otherprofessiontext : '';
                                                    $scope.report.data.signDoctor.level4.id = new Object;
                                                    $scope.report.data.signDoctor.level4.id = $scope.currentUser.id;
                                                }
                                                else if ($scope.currentUser.level == 'level3') {
                                                    $scope.report.data.signDoctor.level3 = new Object;
                                                    $scope.report.data.signDoctor.level3.firstname = new Object;
                                                    $scope.report.data.signDoctor.level3.lastname = new Object;
                                                    $scope.report.data.signDoctor.level3.profession = new Object;
                                                    $scope.report.data.signDoctor.level3.id = new Object;
                                                    $scope.report.data.signDoctor.level3.otherprofessiontext = new Object;
                                                    $scope.report.data.signDoctor.level3.firstname = loggenInUser[0].userData[0].firstname ? loggenInUser[0].userData[0].firstname : '';
                                                    $scope.report.data.signDoctor.level3.lastname = loggenInUser[0].userData[0].lastname ? loggenInUser[0].userData[0].lastname : '';
                                                    $scope.report.data.signDoctor.level3.profession = loggenInUser[0].userData[0].profession ? loggenInUser[0].userData[0].profession : '';

                                                    $scope.report.data.signDoctor.level3.otherprofessiontext = loggenInUser[0].userData[0].otherprofessiontext ? loggenInUser[0].userData[0].otherprofessiontext : '';
                                                    $scope.report.data.signDoctor.level3.id = $scope.currentUser.id;
                                                }

                                                //Create a New Report 
                                                //$scope.savenewPatientdata('sectionChange', '');

                                                //Code added by Unais to generate random flavor and assign to report
                                                $scope.flavor = 'a';
                                                //If a random number between 1 and 1000 is even, set flavor 'a', else set flavor 'b'
                                                if (Math.floor((Math.random() * 1000) + 1) % 2 == 0) {
                                                    $scope.flavor = 'a';
                                                }
                                                else {
                                                    $scope.flavor = 'b';
                                                };
												

											   // Athena changes
                                               var athena_patientid = $scope.patientData.patientsList[0].athena_patientid;
                                               var athena_practiceid = $rootScope.currentUser.practiceDetails.athena_practiceid;
                                               var athena_departmentid = $rootScope.currentUser.athena_departmentid;
												
												// Athena changes
                                                savePatientdata.save({ 'status': 'open', 'data': $scope.report.data, 'patientid': $scope.patientId, 'injuryid': $scope.injuryId, 'formid': $scope.formid, 'formtype': $scope.formtype, 'version': $scope.formversion, 'reportpublishid': $scope.randomPublishReportId, 'state': $cookies.selectedStatecode, 'practicename': $rootScope.currentUser.practicename, 'previousclosedreport': $scope.closedreport, flavor: $scope.flavor, 'athena_patientid' : athena_patientid, 'athena_practiceid' : athena_practiceid, 'athena_departmentid' : athena_departmentid }).$promise.then(function (response) {
                                                    //Code for patient table data update

                                                    //this function for synchronous. when new pr4 created then default ratebodyyesno is NO.. 
                                                    if ($scope.formType == 'pr4') {
                                                        $scope.saveRateBodyInjuryData($scope.injuryId);
                                                    }

                                                    $sessionStorage.reportId = response.id;
                                                    $cookies.reportId = response.id;
                                                    var reportstatus = response.status;
                                                    if (reportstatus) {
                                                        $cookies.reportstatus = reportstatus;
                                                        $scope.reportStatus = reportstatus;
                                                    }

                                                    //Report Log for Opening a Report
                                                    $scope.reportLogOpenTime($sessionStorage.reportId);

                                                    var Isselectinjury = $cookieStore.get('isBdpart');
                                                    if (!Isselectinjury) {
                                                        var section = {
                                                            class: "",
                                                            index: 1,
                                                            sectiondataid: "bginfo",
                                                            sectionid: "",
                                                            sectionname: "Background Information",
                                                            type: "section",
                                                            visiblity: true
                                                        }
                                                        $scope.currentsectionchange(section, 0, 'bginfo');
                                                    } else {
                                                        $scope.currentsection = "Injured Body System(s)";
                                                        var section = {
                                                            class: "",
                                                            index: 2,
                                                            sectiondataid: "selectinjuries",
                                                            sectionid: "",
                                                            sectionname: "Injured Body System(s)",
                                                            type: "section",
                                                            visiblity: true
                                                        }
                                                        $scope.currentsectionchange(section, 1, 'selectinjuries');
                                                        $cookieStore.remove('isBdpart');
                                                    }

                                                });
                                            }


                                        });//End of getPublishReportId
                                    }
                                }

                            });

                        });
                    }

                });
            });
        });
    };

    $scope.reportLogOpenTime = function (reportid) {

        //reportLogging.reportopen().query({ 'reportid': reportid });
		
		reportLogging.reportopen().query({ 'reportid': reportid }).$promise.then(function(res){           
        });

    }

    $scope.gettemplateBodypart = function (section, bodypartname, index) {
        $scope.bodypart = true;
        $scope.selectedIndex = index;
        $scope.currentsection = section.sectionname;
        $scope.currentbodypart = bodypartname;
        $scope.currentsectionId = section.sectiondataid;        
    };

    $scope.getDisplayReportStatus = function (status, formType, reratetype) {
        var displayReportStatus;
        if (formType == 'pr4') {

            if (status == 'closed') {
                if (reratetype == 'nochange') {
                    displayReportStatus = 'Re-rate no changes Rating Complete';
                } else if (reratetype == 'withchange') {
                    displayReportStatus = 'Re-rate with changes Rating Complete';
                } else {
                    displayReportStatus = 'Rating Complete';
                }

            } else if (status == 'level1') {
                if (reratetype == 'nochange') {
                    displayReportStatus = 'Re-rate no changes Level I';
                } else if (reratetype == 'withchange') {
                    displayReportStatus = 'Re-rate with changes Level I';
                } else {
                    displayReportStatus = 'Level I';
                }

            } else if (status == 'level2') {
                if (reratetype == 'nochange') {
                    displayReportStatus = 'Re-rate no changes Level II';
                } else if (reratetype == 'withchange') {
                    displayReportStatus = 'Re-rate with changes Level II';
                } else {
                    displayReportStatus = 'Level II';
                }
            } else {
                displayReportStatus = $filter('capitalize')(status);
            }
        } else {
            displayReportStatus = $filter('capitalize')(status);
        }

        return displayReportStatus;
    };

    $scope.clearformData = function () {
        $validate.reset($scope, currentsectionId);
    };

    $scope.conditionstohide = function (condition) {        
    };

    $scope.getSection = function (id) {
        if (id) {
            return $scope.$eval(id);
        }
    };

    $scope.showBodyPart = function (bodypart, hidebodypart) {

        if (bodypart) {
            if (hidebodypart) {
                var hidebodypartArray = hidebodypart.split(',');
                var test = hidebodypartArray.indexOf(bodypart);
                if (test != -1) {
                    return false;
                } else {
                    return true;
                }
            }
            return true;
        }
    };

    $scope.level1sections = ['bginfo', 'selectinjuries'];

    $scope.level2sections = ['bginfo', 'selectinjuries', 'patientcomplaints', 'ActivitiesofDailyLiving', 'relevantmedicalsocialhistory', 'sh', 'objectivefindings'];

    $scope.visibility = function (section) {

        if ($rootScope.currentUser) {
            if ($rootScope.currentUser.level) {
                if ($rootScope.currentUser.level == 'level1') {
                    if ($scope.level1sections.indexOf(section.sectiondataid) != -1) {
                        return true;
                    } else {
                        return false;
                    }
                }
                if ($rootScope.currentUser.level == 'level2') {
                    if ($scope.level2sections.indexOf(section.sectiondataid) != -1) {
                        return true;
                    } else {
                        return false;
                    }

                }
            }
        }

        var result = '';
		if(section.visiblity)	
		{	
			if (section.visiblity != true || section.visiblity != false) {
				result = eval(section.visiblity);
				/*
				*shridhar
				*for hiding if MMI isn't set for any one body part
				*/
				if ($scope.formType == 'pr4') {
					if (section.sectiondataid == 'bginfo' || section.sectiondataid == 'selectinjuries') {
						return result;
					} else {
						var j = 0
						var anyOnePresent = false;
						var newdata = $scope.report.data.selectinjuries.sibodypart;

						for (j = 0; j < newdata.length; j++) {
							if (newdata[j].ratebodypart == true) {
								if (typeof newdata[j].dateOfRating == "undefined") {
									return anyOnePresent;
								}
								else if (newdata[j].dateOfRating == "") {
									return anyOnePresent;
								}

							}
						}

						for (j = 0; j < newdata.length; j++) {
							if (typeof newdata[j].ratebodyYesNoRadio != "undefined") {
								if (newdata[j].ratebodyYesNoRadio == 'Yes') {
									anyOnePresent = true;
									break;
								}
							}
						}
						if (!anyOnePresent) {
							return false;
						}
					}
				}
				//ends here
				return result;
			}
			else {
				return true;
			}
		}
    };

    $scope.mmiUncompleted = function () {
        if ($scope.formType == 'pr4') {
            var j = 0
            if (typeof $scope.report.data.selectinjuries != 'undefined') {
                var newdata = $scope.report.data.selectinjuries.sibodypart;

                for (j = 0; j < newdata.length; j++) {
                    if (newdata[j].ratebodypart == true) {
                        if (typeof newdata[j].dateOfRating == "undefined" || newdata[j].dateOfRating == '') {
                            return false;
                        }

                    }
                }
                for (j = 0; j < newdata.length; j++) {
                    if (typeof newdata[j].ratebodyYesNoRadio != "undefined") {
                        if (newdata[j].ratebodyYesNoRadio == 'Yes') {
                            return true;
                        }
                    }
                }
            }
            return false;
        } else {
            return true;
        }
    }

    $scope.bodypartVisibility = function (section) {

        var level12sections = ['objectivefindings'];
        if ($rootScope.currentUser) {
            if ($rootScope.currentUser.level == 'level1' || $rootScope.currentUser.level == 'level2') {
                if (level12sections.indexOf(section.sectiondataid) != -1) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        }
    };

    $scope.reportConfirmation = function (patientid) {
         
        $scope.patientid = patientid;
        $scope.reportcategory = 'new';
        var modalInstance = $modal.open({
            templateUrl: 'partials/reportconfirmation.html',
            controller: 'reportPreviewctrl',
            resolve: {
                patientid: function () {
                    return $scope.patientid;
                },
                reportCat: function () {
                    return $scope.reportcategory;
                }
            }
        });
    };

    $scope.agree = function () {
        window.location = "/createreport";
    };

    $scope.merge = function (obj1, obj2, obj3, obj4, obj5, obj6, obj7, obj8, obj9, obj10, obj11, obj12) {

        var result = {}; // return result
        for (var i in obj1) {  // for every property in obj1 
            if (obj2) {
                if ((i in obj2) && (typeof obj1[i] === "object") && (i !== null)) {
                    result[i] = merge(obj1[i], obj2[i]); // if it's an object, merge
                } else {
                    result[i] = obj1[i]; // add it to result
                }
            }
            if (obj3) {
                if ((i in obj3) && (typeof obj1[i] === "object") && (i !== null)) {
                    result[i] = merge(obj1[i], obj3[i]); // if it's an object, merge   
                } else {
                    result[i] = obj1[i]; // add it to result
                }
            }

            if (obj4) {
                if ((i in obj4) && (typeof obj1[i] === "object") && (i !== null)) {
                    result[i] = merge(obj1[i], obj4[i]); // if it's an object, merge   
                } else {
                    result[i] = obj1[i]; // add it to result
                }
            }
            if (obj5) {
                if ((i in obj5) && (typeof obj1[i] === "object") && (i !== null)) {
                    result[i] = merge(obj1[i], obj5[i]); // if it's an object, merge   
                } else {
                    result[i] = obj1[i]; // add it to result
                }
            }
            if (obj6) {
                if ((i in obj6) && (typeof obj1[i] === "object") && (i !== null)) {
                    result[i] = merge(obj1[i], obj6[i]); // if it's an object, merge   
                } else {
                    result[i] = obj1[i]; // add it to result
                }
            }
            if (obj7) {
                if ((i in obj7) && (typeof obj1[i] === "object") && (i !== null)) {
                    result[i] = merge(obj1[i], obj7[i]); // if it's an object, merge   
                } else {
                    result[i] = obj1[i]; // add it to result
                }
            }
            if (obj8) {
                if ((i in obj8) && (typeof obj1[i] === "object") && (i !== null)) {
                    result[i] = merge(obj1[i], obj8[i]); // if it's an object, merge   
                } else {
                    result[i] = obj1[i]; // add it to result
                }
            }
            if (obj9) {
                if ((i in obj9) && (typeof obj1[i] === "object") && (i !== null)) {
                    result[i] = merge(obj1[i], obj9[i]); // if it's an object, merge   
                } else {
                    result[i] = obj1[i]; // add it to result
                }
            }
            if (obj10) {
                if ((i in obj10) && (typeof obj1[i] === "object") && (i !== null)) {
                    result[i] = merge(obj1[i], obj10[i]); // if it's an object, merge   
                } else {
                    result[i] = obj1[i]; // add it to result
                }
            }
            if (obj11) {
                if ((i in obj11) && (typeof obj1[i] === "object") && (i !== null)) {
                    result[i] = merge(obj1[i], obj11[i]); // if it's an object, merge   
                } else {
                    result[i] = obj1[i]; // add it to result
                }
            }
            if (obj12) {
                if ((i in obj12) && (typeof obj1[i] === "object") && (i !== null)) {
                    result[i] = merge(obj1[i], obj12[i]); // if it's an object, merge   
                } else {
                    result[i] = obj1[i]; // add it to result
                }
            }

        }
        for (i in obj2) { // add the remaining properties from object 2
            if (i in result) { //conflict
                continue;
            }
            result[i] = obj2[i];
        }
        for (i in obj3) { // add the remaining properties from object 3
            if (i in result) { //conflict
                continue;
            }
            result[i] = obj3[i];
        }
        for (i in obj4) { // add the remaining properties from object 4
            if (i in result) { //conflict
                continue;
            }
            result[i] = obj4[i];
        }
        for (i in obj5) { // add the remaining properties from object 4
            if (i in result) { //conflict
                continue;
            }
            result[i] = obj5[i];
        }
        for (i in obj6) { // add the remaining properties from object 4
            if (i in result) { //conflict
                continue;
            }
            result[i] = obj6[i];
        }
        for (i in obj7) { // add the remaining properties from object 4
            if (i in result) { //conflict
                continue;
            }
            result[i] = obj7[i];
        }
        for (i in obj8) { // add the remaining properties from object 4
            if (i in result) { //conflict
                continue;
            }
            result[i] = obj8[i];
        }
        for (i in obj9) { // add the remaining properties from object 4
            if (i in result) { //conflict
                continue;
            }
            result[i] = obj9[i];
        }
        for (i in obj10) { // add the remaining properties from object 4
            if (i in result) { //conflict
                continue;
            }
            result[i] = obj10[i];
        }
        for (i in obj11) { // add the remaining properties from object 4
            if (i in result) { //conflict
                continue;
            }
            result[i] = obj11[i];
        }
        for (i in obj12) { // add the remaining properties from object 4
            if (i in result) { //conflict
                continue;
            }
            result[i] = obj12[i];
        }

        return result;
    };

    $scope.updateForm = function (information, category, updatedData) {
        var data = $scope.report.data;
        var patientId = $sessionStorage.patientId;
        var currentUser = $rootScope.currentUser.username;
        if (information == 'archive') {
            var query = {
                category: category,
                patientid: patientId
            };

            Patients.getpatient.query(query).$promise.then(function (patients) {

                $scope.basicinformationall = patients[0].patients[0].basicinformation;
                $scope.contactinformationall = patients[0].patients[0].contactinformation;
                $scope.addressall = patients[0].patients[0].address;
                $scope.emergencycontactinfoall = patients[0].patients[0].emergencycontactinfo;
                $scope.demographicsall = patients[0].patients[0].demographics;
                $scope.occupationall = patients[0].patients[0].occupation;

                switch (category) {
                    case 'basicinformation':
                        $scope.categorynewdata = $scope.basicinformationall;
                        $scope.openarchivepopup($scope.categorynewdata, category);
                        break;
                    case 'contactinformation':
                        $scope.categorynewdata = $scope.contactinformationall;
                        $scope.openarchivepopup($scope.categorynewdata, category);
                        break;
                    case 'address':
                        $scope.categorynewdata = $scope.addressall;
                        $scope.openarchivepopup($scope.categorynewdata, category);
                        break;
                    case 'occupation':
                        $scope.categorynewdata = $scope.occupationall;
                        $scope.openarchivepopup($scope.categorynewdata, category);
                        break;
                }
            });
        }
    };

    $scope.archiveButton = function (category) {
        debugger
        switch (category) {
            case 'basicinformation':
                setTimeout(function () {
                    var el = document.getElementById('basicinformation_archive');
                    angular.element(el).triggerHandler('click');
                }, 0);
                break;
            case 'contactinformation':
                setTimeout(function () {
                    var el = document.getElementById('contactinformation_archive');
                    angular.element(el).triggerHandler('click');
                }, 0);
                break;
            case 'address':
                setTimeout(function () {
                    var el = document.getElementById('address_archive');
                    angular.element(el).triggerHandler('click');
                }, 0);
                break;
            case 'occupation':
                setTimeout(function () {
                    var el = document.getElementById('occupation_archive');
                    angular.element(el).triggerHandler('click');
                }, 0);
                break;
            case 'empduration':
                setTimeout(function () {
                    var el = document.getElementById('empduration_archive');
                    angular.element(el).triggerHandler('click');
                }, 0);
                break;
            case 'employer':
                setTimeout(function () {
                    var el = document.getElementById('employer_archive');
                    angular.element(el).triggerHandler('click');
                }, 0);
                break;
            case 'insuranceadministrator':
                setTimeout(function () {
                    var el = document.getElementById('insuranceadministrator_archive');
                    angular.element(el).triggerHandler('click');
                }, 0);
                break;
            case 'claimsadjuster':
                setTimeout(function () {
                    var el = document.getElementById('claimsadjuster_archive');
                    angular.element(el).triggerHandler('click');
                }, 0);
                break;
            case 'injuryinformation':
                setTimeout(function () {
                    var el = document.getElementById('injuryinformation_archive');
                    angular.element(el).triggerHandler('click');
                }, 0);
                break;
            case 'employeraddress':
                setTimeout(function () {
                    var el = document.getElementById('employeraddress_archive');
                    angular.element(el).triggerHandler('click');
                }, 0);
                break;
            case 'locationaddressinjury':
                setTimeout(function () {
                    var el = document.getElementById('locationaddressinjury_archive');
                    angular.element(el).triggerHandler('click');
                }, 0);
                break;
        }
    };

    $scope.openarchivepopup = function (modeldata, category) {
        var patientCategory = { patientid: $routeParams.patientid, category: null };
        patientCategory.category = category;

        switch (category) {
            case 'basicinformation':
                var columns = ["firstname", "middlename", "lastname", "gender", "dateofbirth", "dateofdeath", "socialsecurityno", "employeehandedness", "updateddate", "updatedby"];
                var columnHeaders = ["First name", "Middle name", "Last name", "Gender", "Date of birth", "Date of death", "Social security no", "Employee Handedness", "Updated date", "Updated by"];
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
                var columns = ["relationship", "firstname", "lastname", "email", "homephone", "cellphone", "workphone", "extension", "updateddate", "updatedby"];
                var columnHeaders = ["Relationship", "First name", "Last name", "Email", "Home phone", "Cell phone", "Work phone", "Extension", "Updated date", "Updated by"];
                break;
            case 'demographics':
                var columns = ["preferredlanguage", "preferredlanguageother", "ethnicity", "ethnicityother", "race", "raceother", "updateddate", "updatedby"];
                var columnHeaders = ["Preferred language", "Preferred language other", "Ethnicity", "Ethnicity other", "Race", "Race other", "Updated date", "Updated by"];
                break;
            case 'occupation':
                var columns = ["currentoccupation", "currentoccupationother", "updateddate", "updatedby"];
                var columnHeaders = ["Current occupation", "Current occupation other", "Updated date", "Updated by"];
                break;
        }

        var template = 'partials/patient-archive-popup.html';
        $rootScope.modalInstance = $modal.open({
            templateUrl: template,
            windowClass: 'app-modal-window',
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
                    return '';
                }
            }
        });
    };
    $scope.isReload = true;
    $scope.openinjuryarchivepopup = function (text) {
        var template = 'partials/archivepopup.html';
        $rootScope.modalInstance = $modal.open({
            templateUrl: template,
            windowClass: 'app-modal-window',
            controller: 'archivectrl',
            resolve: {
                text: function () {
                    return text;
                },
                injuryId: function () {
                    return $scope.injuryId;
                },
                page: function () {
                    return '';
                },
                isReload: function () {
                    return true;
                }
            }
        });
        $rootScope.modalInstance.result.then(function (currentdata) {
            debugger
            //$route.reload();
            var step = 1;


            $scope.injurydata[text][0] = currentdata;
        }, function () {


             
        });
    };

    $scope.createInjuryCancel = function (text) {
         
        var template = 'partials/cancelPagePopup.html';
        $rootScope.modalInstance = $modal.open({
            templateUrl: template,
            controller: 'reportformpopupSavectrl',
            resolve: {
                text: function () {
                    return text;
                }
            }

        });
        $rootScope.modalInstance.result.then(function (status) {
             
            if (status == 'save') {
                $scope.savenewPatientdata();
            }
            if (status == 'leave') {
				$scope.deletereportTrack();
                $location.path('/patient/createinjury');
            }
        });
    };

    $scope.exitform = function (path) {
         
        //$http.post('/api/log/submitedreportcloselog', { 'reportid': $scope.reportid }).success();
        if ($sessionStorage.reportId) {
            reportLogging.reportclose().query({ 'reportid': $sessionStorage.reportId });
        }

        $scope.deletereportTrack();

        if (document.getElementById("hideNavbar").style)
            document.getElementById("hideNavbar").style.visibility = "visible";

        $location.path(path);
    };

    function getSelectedMedicalHistoryCheckbox() {
        try {
            $scope.medicalhistory = $scope.patientData.patientsList[0].medicalhistory[0];
        } catch (err) { }
        try {
            if (typeof $scope.medicalhistory != 'undefined') {
                if (typeof $scope.report.data['relevantmedicalsocialhistory'] === 'undefined') {
                    $scope.report.data['relevantmedicalsocialhistory'] = new Object();
                }
                $scope.report.data.relevantmedicalsocialhistory.shgeneralpriorhealthradio = $scope.medicalhistory.shgeneralpriorhealthradio;
                $scope.report.data.relevantmedicalsocialhistory.shgeneralhealthcontricheck = $scope.medicalhistory.shgeneralhealthcontricheck;
                $scope.report.data.relevantmedicalsocialhistory.shgeneralhealthontritextother = $scope.medicalhistory.shgeneralhealthontritextother;

                $scope.report.data.relevantmedicalsocialhistory.shgeneralhealthpriorsurgeryradio = $scope.medicalhistory.shgeneralhealthpriorsurgeryradio;
                $scope.report.data.relevantmedicalsocialhistory.shgeneralhealthpriorsugeycheck = $scope.medicalhistory.shgeneralhealthpriorsugeycheck;
                $scope.report.data.relevantmedicalsocialhistory.shgeneralhealthpriorsurgerytextother = $scope.medicalhistory.shgeneralhealthpriorsurgerytextother;

                $scope.report.data.relevantmedicalsocialhistory.shcurrentmedicationradio = $scope.medicalhistory.shcurrentmedicationradio;
                $scope.report.data.relevantmedicalsocialhistory.shcurrentmedications = $scope.medicalhistory.shcurrentmedications;
                $scope.report.data.relevantmedicalsocialhistory.shcurrentmedicationsothertext = $scope.medicalhistory.shcurrentmedicationsothertext;

                $scope.report.data.relevantmedicalsocialhistory.shknownallergiesNonecheck = $scope.medicalhistory.shknownallergiesNonecheck;
                $scope.report.data.relevantmedicalsocialhistory.shknownallergiescheck = $scope.medicalhistory.shknownallergiescheck;
                $scope.report.data.relevantmedicalsocialhistory.shknownallergiesOthercheck = $scope.medicalhistory.shknownallergiesOthercheck;
                $scope.report.data.relevantmedicalsocialhistory.shknownallergiesOthercheckTextarea = $scope.medicalhistory.shknownallergiesOthercheckTextarea;
                $scope.report.data.relevantmedicalsocialhistory.shknownallergiesothertext = $scope.medicalhistory.shknownallergiesothertext;

                $scope.report.data.relevantmedicalsocialhistory.shpriorillnessradio = $scope.medicalhistory.shpriorillnessradio;
                $scope.report.data.relevantmedicalsocialhistory.shgeneralreviewpriorcheck = $scope.medicalhistory.shgeneralreviewpriorcheck;
                $scope.report.data.relevantmedicalsocialhistory.negativeshgeneralconstitutionalcheck = $scope.medicalhistory.negativeshgeneralconstitutionalcheck;
                $scope.report.data.relevantmedicalsocialhistory.shgeneralconstitutionalcheck = $scope.medicalhistory.shgeneralconstitutionalcheck;

                $scope.report.data.relevantmedicalsocialhistory.shgeneraleyescheck = $scope.medicalhistory.shgeneraleyescheck;
                $scope.report.data.relevantmedicalsocialhistory.shgeneralthroatcheck = $scope.medicalhistory.shgeneralthroatcheck;
                $scope.report.data.relevantmedicalsocialhistory.shgeneralcardiovascularcheck = $scope.medicalhistory.shgeneralcardiovascularcheck;
                $scope.report.data.relevantmedicalsocialhistory.shgeneralrespiratorycheck = $scope.medicalhistory.shgeneralrespiratorycheck;
                $scope.report.data.relevantmedicalsocialhistory.shgeneralgastrointestinalcheck = $scope.medicalhistory.shgeneralgastrointestinalcheck;
                $scope.report.data.relevantmedicalsocialhistory.shgeneralgenitourinary = $scope.medicalhistory.shgeneralgenitourinary;
                $scope.report.data.relevantmedicalsocialhistory.shgeneralmusculoskeletalcheck = $scope.medicalhistory.shgeneralmusculoskeletalcheck;
                $scope.report.data.relevantmedicalsocialhistory.shgeneralskincheck = $scope.medicalhistory.shgeneralskincheck;
                $scope.report.data.relevantmedicalsocialhistory.shgeneralneurologicalcheck = $scope.medicalhistory.shgeneralneurologicalcheck;
                $scope.report.data.relevantmedicalsocialhistory.shgeneralpsychiatric = $scope.medicalhistory.shgeneralpsychiatric;
                $scope.report.data.relevantmedicalsocialhistory.shgeneralendocrinecheck = $scope.medicalhistory.shgeneralendocrinecheck;
                $scope.report.data.relevantmedicalsocialhistory.shgeneralhematologicalcheck = $scope.medicalhistory.shgeneralhematologicalcheck;
                $scope.report.data.relevantmedicalsocialhistory.shgeneralallergiccheck = $scope.medicalhistory.shgeneralallergiccheck;

                $scope.report.data.relevantmedicalsocialhistory.shgeneralreviewpriorothertext = $scope.medicalhistory.shgeneralreviewpriorothertext;

                $scope.report.data.relevantmedicalsocialhistory.shgeneraleyesothertext = $scope.medicalhistory.shgeneraleyesothertext;
                $scope.report.data.relevantmedicalsocialhistory.shgeneralthroatothertext = $scope.medicalhistory.shgeneralthroatothertext;
                $scope.report.data.relevantmedicalsocialhistory.shgeneralcardiovascularothertext = $scope.medicalhistory.shgeneralcardiovascularothertext;
                $scope.report.data.relevantmedicalsocialhistory.shgeneralrespiratoryothertext = $scope.medicalhistory.shgeneralrespiratoryothertext;
                $scope.report.data.relevantmedicalsocialhistory.shgeneralgastrointestinalothertext = $scope.medicalhistory.shgeneralgastrointestinalothertext;
                $scope.report.data.relevantmedicalsocialhistory.shgeneralgenitourinaryothertext = $scope.medicalhistory.shgeneralgenitourinaryothertext;
                $scope.report.data.relevantmedicalsocialhistory.shgeneralmusculoskeletalothertext = $scope.medicalhistory.shgeneralmusculoskeletalothertext;
                $scope.report.data.relevantmedicalsocialhistory.shgeneralskinothertext = $scope.medicalhistory.shgeneralskinothertext;
                $scope.report.data.relevantmedicalsocialhistory.shgeneralneurologicalothertext = $scope.medicalhistory.shgeneralneurologicalothertext;
                $scope.report.data.relevantmedicalsocialhistory.shgeneralpsychiatricothertext = $scope.medicalhistory.shgeneralpsychiatricothertext;
                $scope.report.data.relevantmedicalsocialhistory.shgeneralendocrineothertext = $scope.medicalhistory.shgeneralendocrineothertext;
                $scope.report.data.relevantmedicalsocialhistory.shgeneralhematologicalothertext = $scope.medicalhistory.shgeneralhematologicalothertext;
                $scope.report.data.relevantmedicalsocialhistory.shgeneralallergicothertext = $scope.medicalhistory.shgeneralallergicothertext;
            }
        } catch (err) 
		{ 
			//console.log(err); 
		}
    }

    function getSelectedSocialhistoryCheckbox() {
        try {
            $scope.sh = $scope.patientData.patientsList[0].sh[0];
        } catch (err)
        { }

        try {
            if (typeof $scope.sh != 'undefined') {
                if (typeof $scope.report.data['sh'] === 'undefined') {
                    $scope.report.data['sh'] = new Object();
                }
                //shridhar 14 april 2016

                $scope.report.data.sh.SHrdoMaritalStatus = $scope.sh.SHrdoMaritalStatus;
                $scope.report.data.sh.SHrdoEmploymentStatus = $scope.sh.SHrdoEmploymentStatus;
                $scope.report.data.sh.SHchkOccupationalHistory = $scope.sh.SHchkOccupationalHistory;
                $scope.report.data.sh.chkOccupationalHistoryOtherTextarea = $scope.sh.chkOccupationalHistoryOtherTextarea;
                $scope.report.data.sh.chkCaffeineNegative = $scope.sh.chkCaffeineNegative;
                $scope.report.data.sh.chkCaffeine = $scope.sh.chkCaffeine;
                $scope.report.data.sh.txtCaffeine = $scope.sh.txtCaffeine;
                $scope.report.data.sh.chkStreetDrug = $scope.sh.chkStreetDrug;
                $scope.report.data.sh.txtStreetDrug = $scope.sh.txtStreetDrug;
                $scope.report.data.sh.chkTobacco = $scope.sh.chkTobacco;
                $scope.report.data.sh.txtTobacco = $scope.sh.txtTobacco;
                $scope.report.data.sh.chkAlcohol = $scope.sh.chkAlcohol;
                $scope.report.data.sh.txtAlcohol = $scope.sh.txtAlcohol;
                $scope.report.data.sh.shfreedataentry = $scope.sh.shfreedataentry;
                $scope.report.data.sh.SHrdoLevelOfEducation = $scope.sh.SHrdoLevelOfEducation;
                $scope.report.data.sh.SHrdoLevelOfEducationtextA = $scope.sh.SHrdoLevelOfEducationtextA;
                $scope.report.data.sh.rdoSecondJobs = $scope.sh.rdoSecondJobs;
                $scope.report.data.sh.rdoSecondJobsTextarea = $scope.sh.rdoSecondJobsTextarea;
                $scope.report.data.sh.rdoSelfEmployment = $scope.sh.rdoSelfEmployment;
                $scope.report.data.sh.rdoSelfEmploymentTextarea = $scope.sh.rdoSelfEmploymentTextarea;
                $scope.report.data.sh.rdoMilitaryService = $scope.sh.rdoMilitaryService;
                $scope.report.data.sh.rdoMilitaryServiceTextarea = $scope.sh.rdoMilitaryServiceTextarea;
                $scope.report.data.sh.chkHobbiesNone = $scope.sh.chkHobbiesNone;
                $scope.report.data.sh.chkHobbies = $scope.sh.chkHobbies;
                $scope.report.data.sh.chkHobbiesOtherTextarea = $scope.sh.chkHobbiesOtherTextarea;
            }
        } catch (err) 
		{ 
			//console.log(err); 
		}
    }

    function getSocialhistoryUpdatedata(currentUser) {
        try {
            var mediObj = typeof ($scope.report.data.sh) != "undefined" ? $scope.report.data.sh : {};

            var sh = [{
                SHrdoMaritalStatus: typeof (mediObj.SHrdoMaritalStatus) != "undefined" ? mediObj.SHrdoMaritalStatus : "",
                SHrdoEmploymentStatus: typeof (mediObj.SHrdoEmploymentStatus) != "undefined" ? mediObj.SHrdoEmploymentStatus : "",
                SHchkOccupationalHistory: typeof (mediObj.SHchkOccupationalHistory) != "undefined" ? mediObj.SHchkOccupationalHistory : "",
                chkOccupationalHistoryOtherTextarea: typeof (mediObj.chkOccupationalHistoryOtherTextarea) != "undefined" ? mediObj.chkOccupationalHistoryOtherTextarea : "",
                chkCaffeineNegative: typeof (mediObj.chkCaffeineNegative) != "undefined" ? mediObj.chkCaffeineNegative : "",
                chkCaffeine: typeof (mediObj.chkCaffeine) != "undefined" ? mediObj.chkCaffeine : "",
                txtCaffeine: typeof (mediObj.txtCaffeine) != "undefined" ? mediObj.txtCaffeine : "",
                chkStreetDrug: typeof (mediObj.chkStreetDrug) != "undefined" ? mediObj.chkStreetDrug : "",
                txtStreetDrug: typeof (mediObj.txtStreetDrug) != "undefined" ? mediObj.txtStreetDrug : "",
                chkTobacco: typeof (mediObj.chkTobacco) != "undefined" ? mediObj.chkTobacco : "",
                txtTobacco: typeof (mediObj.txtTobacco) != "undefined" ? mediObj.txtTobacco : "",
                chkAlcohol: typeof (mediObj.chkAlcohol) != "undefined" ? mediObj.chkAlcohol : "",
                txtAlcohol: typeof (mediObj.txtAlcohol) != "undefined" ? mediObj.txtAlcohol : "",
                shfreedataentry: typeof (mediObj.shfreedataentry) != "undefined" ? mediObj.shfreedataentry : "",
                SHrdoLevelOfEducation: typeof (mediObj.SHrdoLevelOfEducation) != "undefined" ? mediObj.SHrdoLevelOfEducation : "",
                SHrdoLevelOfEducationtextA: typeof (mediObj.SHrdoLevelOfEducationtextA) != "undefined" ? mediObj.SHrdoLevelOfEducationtextA : "",
                rdoSecondJobs: typeof (mediObj.rdoSecondJobs) != "undefined" ? mediObj.rdoSecondJobs : "",
                rdoSecondJobsTextarea: typeof (mediObj.rdoSecondJobsTextarea) != "undefined" ? mediObj.rdoSecondJobsTextarea : "",
                rdoSelfEmployment: typeof (mediObj.rdoSelfEmployment) != "undefined" ? mediObj.rdoSelfEmployment : "",
                rdoSelfEmploymentTextarea: typeof (mediObj.rdoSelfEmploymentTextarea) != "undefined" ? mediObj.rdoSelfEmploymentTextarea : "",
                rdoMilitaryService: typeof (mediObj.rdoMilitaryService) != "undefined" ? mediObj.rdoMilitaryService : "",
                rdoMilitaryServiceTextarea: typeof (mediObj.rdoMilitaryServiceTextarea) != "undefined" ? mediObj.rdoMilitaryServiceTextarea : "",
                chkHobbiesNone: typeof (mediObj.chkHobbiesNone) != "undefined" ? mediObj.chkHobbiesNone : "",
                chkHobbies: typeof (mediObj.chkHobbies) != "undefined" ? mediObj.chkHobbies : "",
                chkHobbiesOtherTextarea: typeof (mediObj.chkHobbiesOtherTextarea) != "undefined" ? mediObj.chkHobbiesOtherTextarea : "",

                status: 'current',
                updateddate: Date.now(),
                updatedby: currentUser
            }];
            return sh;
        }
        catch (err) {
            //console.log(err);
            var emptyobj = {};
            return emptyobj;
        }
    }

     function getMedicalhistoryUpdatedata(currentUser) {
				var _arr=[];
        try {
            var mediObj = typeof ($scope.report.data.relevantmedicalsocialhistory) != "undefined" ? $scope.report.data.relevantmedicalsocialhistory : {};
            var medicalhistory = [{
                shgeneralpriorhealthradio: typeof (mediObj.shgeneralpriorhealthradio) != "undefined" ? $scope.forcedString(mediObj.shgeneralpriorhealthradio) : "",
                shgeneralhealthcontricheck: typeof (mediObj.shgeneralhealthcontricheck) != "undefined" ? $scope.forcedArray(mediObj.shgeneralhealthcontricheck) : _arr,
                shgeneralhealthontritextother: typeof (mediObj.shgeneralhealthontritextother) != "undefined" ? $scope.forcedString(mediObj.shgeneralhealthontritextother) : "",
                shgeneralhealthpriorsurgeryradio: typeof (mediObj.shgeneralhealthpriorsurgeryradio) != "undefined" ? $scope.forcedString(mediObj.shgeneralhealthpriorsurgeryradio) : "",
                shgeneralhealthpriorsugeycheck: typeof (mediObj.shgeneralhealthpriorsugeycheck) != "undefined" ?  $scope.forcedArray(mediObj.shgeneralhealthpriorsugeycheck) : _arr,
                shgeneralhealthpriorsurgerytextother: typeof (mediObj.shgeneralhealthpriorsurgerytextother) != "undefined" ? $scope.forcedString(mediObj.shgeneralhealthpriorsurgerytextother) : "",
                shcurrentmedicationradio: typeof (mediObj.shcurrentmedicationradio) != "undefined" ?  $scope.forcedString(mediObj.shcurrentmedicationradio) : "",
                shcurrentmedications: typeof (mediObj.shcurrentmedications) != "undefined" ? $scope.forcedArray(mediObj.shcurrentmedications) :_arr,
                shcurrentmedicationsothertext: typeof (mediObj.shcurrentmedicationsothertext) != "undefined" ? $scope.forcedString(mediObj.shcurrentmedicationsothertext) : "", 
                shknownallergiesNonecheck: typeof (mediObj.shknownallergiesNonecheck) != "undefined" ? $scope.forcedArray(mediObj.shknownallergiesNonecheck) : _arr,
                shknownallergiescheck: typeof (mediObj.shknownallergiescheck) != "undefined" ? $scope.forcedArray(mediObj.shknownallergiescheck) :_arr,
                shknownallergiesOthercheck: typeof (mediObj.shknownallergiesOthercheck) != "undefined" ? $scope.forcedArray(mediObj.shknownallergiesOthercheck) : _arr,
                shknownallergiesOthercheckTextarea: typeof (mediObj.shknownallergiesOthercheckTextarea) != "undefined" ? $scope.forcedString(mediObj.shknownallergiesOthercheckTextarea) : "",
                shknownallergiesothertext: typeof (mediObj.shknownallergiesothertext) != "undefined" ?  $scope.forcedString(mediObj.shknownallergiesothertext) : "",

                shpriorillnessradio: typeof (mediObj.shpriorillnessradio) != "undefined" ? $scope.forcedString(mediObj.shpriorillnessradio) : "",
                shgeneralreviewpriorcheck: typeof (mediObj.shgeneralreviewpriorcheck) != "undefined" ?  $scope.forcedArray(mediObj.shgeneralreviewpriorcheck) : _arr ,
                negativeshgeneralconstitutionalcheck: typeof (mediObj.negativeshgeneralconstitutionalcheck) != "undefined" ? $scope.forcedArray(mediObj.negativeshgeneralconstitutionalcheck) : _arr,
								
								
								
                shgeneralconstitutionalcheck: typeof (mediObj.shgeneralconstitutionalcheck) != "undefined" ?  $scope.forcedArray(mediObj.shgeneralconstitutionalcheck) : _arr,
                shgeneraleyescheck: typeof (mediObj.shgeneraleyescheck) != "undefined" ? $scope.forcedArray(mediObj.shgeneraleyescheck ): _arr,
                shgeneralthroatcheck: typeof (mediObj.shgeneralthroatcheck) != "undefined" ? $scope.forcedArray(mediObj.shgeneralthroatcheck) : _arr,
                shgeneralcardiovascularcheck: typeof (mediObj.shgeneralcardiovascularcheck) != "undefined" ? $scope.forcedArray(mediObj.shgeneralcardiovascularcheck) : _arr,

                shgeneralrespiratorycheck: typeof (mediObj.shgeneralrespiratorycheck) != "undefined" ? $scope.forcedArray(mediObj.shgeneralrespiratorycheck) : "",
                shgeneralgastrointestinalcheck: typeof (mediObj.shgeneralgastrointestinalcheck) != "undefined" ? $scope.forcedArray(mediObj.shgeneralgastrointestinalcheck) : _arr,
                shgeneralgenitourinary: typeof (mediObj.shgeneralgenitourinary) != "undefined" ? $scope.forcedArray(mediObj.shgeneralgenitourinary ): _arr,
                shgeneralmusculoskeletalcheck: typeof (mediObj.shgeneralmusculoskeletalcheck) != "undefined" ? $scope.forcedArray(mediObj.shgeneralmusculoskeletalcheck) :_arr,
                shgeneralskincheck: typeof (mediObj.shgeneralskincheck) != "undefined" ? $scope.forcedArray(mediObj.shgeneralskincheck) : _arr,
                shgeneralneurologicalcheck: typeof (mediObj.shgeneralneurologicalcheck) != "undefined" ? $scope.forcedArray(mediObj.shgeneralneurologicalcheck) : _arr,
                shgeneralpsychiatric: typeof (mediObj.shgeneralpsychiatric) != "undefined" ? $scope.forcedArray(mediObj.shgeneralpsychiatric) : _arr,
                shgeneralendocrinecheck: typeof (mediObj.shgeneralendocrinecheck) != "undefined" ? $scope.forcedArray(mediObj.shgeneralendocrinecheck) : _arr,
                shgeneralhematologicalcheck: typeof (mediObj.shgeneralhematologicalcheck) != "undefined" ? $scope.forcedArray(mediObj.shgeneralhematologicalcheck) : _arr,
                shgeneralallergiccheck: typeof (mediObj.shgeneralallergiccheck) != "undefined" ? $scope.forcedArray(mediObj.shgeneralallergiccheck) : _arr,
                shgeneralreviewpriorothertext: typeof (mediObj.shgeneralreviewpriorothertext) != "undefined" ? $scope.forcedString(mediObj.shgeneralreviewpriorothertext) : "",
                shgeneraleyesothertext: typeof (mediObj.shgeneraleyesothertext) != "undefined" ?  $scope.forcedString(mediObj.shgeneraleyesothertext) : "",
                shgeneralthroatothertext: typeof (mediObj.shgeneralthroatothertext) != "undefined" ? $scope.forcedString(mediObj.shgeneralthroatothertext) : "",
                shgeneralcardiovascularothertext: typeof (mediObj.shgeneralcardiovascularothertext) != "undefined" ?  $scope.forcedString(mediObj.shgeneralcardiovascularothertext) : "",
                shgeneralrespiratoryothertext: typeof (mediObj.shgeneralrespiratoryothertext) != "undefined" ?  $scope.forcedString(mediObj.shgeneralrespiratoryothertext) : "",
                shgeneralgastrointestinalothertext: typeof (mediObj.shgeneralgastrointestinalothertext) != "undefined" ?$scope.forcedString(mediObj.shgeneralgastrointestinalothertext) : "", //manoj
                shgeneralgenitourinaryothertext: typeof (mediObj.shgeneralgenitourinaryothertext) != "undefined" ? $scope.forcedString(mediObj.shgeneralgenitourinaryothertext) : "",
                shgeneralmusculoskeletalothertext: typeof (mediObj.shgeneralmusculoskeletalothertext) != "undefined" ? $scope.forcedString(mediObj.shgeneralmusculoskeletalothertext) : "",
                shgeneralskinothertext: typeof (mediObj.shgeneralskinothertext) != "undefined" ? $scope.forcedString(mediObj.shgeneralskinothertext) : "",
                shgeneralneurologicalothertext: typeof (mediObj.shgeneralneurologicalothertext) != "undefined" ? $scope.forcedString(mediObj.shgeneralneurologicalothertext) : "", 
                shgeneralpsychiatricothertext: typeof (mediObj.shgeneralpsychiatricothertext) != "undefined" ? $scope.forcedString(mediObj.shgeneralpsychiatricothertext) : "",
                shgeneralendocrineothertext: typeof (mediObj.shgeneralendocrineothertext) != "undefined" ? $scope.forcedString(mediObj.shgeneralendocrineothertext) : "",
                shgeneralhematologicalothertext: typeof (mediObj.shgeneralhematologicalothertext) != "undefined" ? $scope.forcedString(mediObj.shgeneralhematologicalothertext) : "",
                shgeneralallergicothertext: typeof (mediObj.shgeneralallergicothertext) != "undefined" ? $scope.forcedString(mediObj.shgeneralallergicothertext) : "",

                status: 'current',
                updateddate: Date.now(),
                updatedby: currentUser
            }];
            return medicalhistory;
        }
        catch (err) {
            //console.log(err);
            var emptyobj = {};
            return emptyobj;
        }
    }

    $scope.updateArchiveData = function () {

         
        $scope.changedSections = $cookieStore.get('selectedCategories');
        var currentUser = $rootScope.currentUser.username;
        var reportid = $sessionStorage.reportId;
        $scope.patientId = $sessionStorage.patientId;
        $scope.selectesState = $cookies.selectedState;

        $scope.medicalhistory = getMedicalhistoryUpdatedata(currentUser);
        $scope.sh = getSocialhistoryUpdatedata(currentUser);

        // Patient Demographics Page
        $scope.basicinformation = [{
            firstname: $scope.report.data.bginfo.firstname,
            middlename: $scope.report.data.bginfo.middlename,
            lastname: $scope.report.data.bginfo.lastname,
            gender: $scope.report.data.bginfo.gender,
            dateofbirth: $scope.report.data.bginfo.dateofbirth,
            socialsecurityno: $scope.report.data.bginfo.socialsecurityno,
            employeehandedness: $scope.report.data.selectinjuries.employeehandedness,
            status: 'current',
            updateddate: Date.now(),
            updatedby: currentUser
        }];

        $scope.contactinformation = [{
            email: $scope.report.data.bginfo.email,
            homephone: $scope.report.data.bginfo.homephone,
            cellphone: $scope.report.data.bginfo.cellphone,
            workphone: $scope.report.data.bginfo.workphone,
            extension: $scope.report.data.bginfo.extension,
            preferredcommunication: $scope.report.data.bginfo.preferredcommunication,
            preferredcommunicationother: $scope.report.data.bginfo.preferredcommunicationother,
            status: 'current',
            updateddate: Date.now(),
            updatedby: currentUser
        }];

        $scope.address = [{
            addressline1: $scope.report.data.bginfo.addressline1,
            addressline2: $scope.report.data.bginfo.addressline2,
            city: $scope.report.data.bginfo.city,
            state: $scope.report.data.bginfo.state,
            zipcode: $scope.report.data.bginfo.zipcode,
            status: 'current',
            updateddate: Date.now(),
            updatedby: currentUser
        }];
		
		//Changes for working in NodeJS 6.5
		var ethnicity='';
		var ethnicityselectother='';
		var injuredraceother='';
		var injuredrace='';
		try{
			if($scope.report.data.selectinjuries.ethnicityselect)
			{
				if($scope.report.data.selectinjuries.ethnicityselect.length>0){
						ethnicity =$scope.report.data.selectinjuries.ethnicityselect;
				}
			}
			if($scope.report.data.selectinjuries.ethnicityselectother)
			{
				if($scope.report.data.selectinjuries.ethnicityselectother.length>0){
					ethnicityselectother =$scope.report.data.selectinjuries.ethnicityselectother;
				}
			}
			if($scope.report.data.selectinjuries.injuredraceother)
			{			
				if($scope.report.data.selectinjuries.injuredraceother.length>0){
					injuredraceother =$scope.report.data.selectinjuries.injuredraceother;
				}
			}
			if($scope.report.data.selectinjuries.injuredrace)
			{			
				if($scope.report.data.selectinjuries.injuredrace.length>0){
					injuredrace =$scope.report.data.selectinjuries.injuredrace;
				}
			}	
		}catch(err){
			//console.log(err);
		}
	
		var ethnicity=$scope.report.data.selectinjuries.ethnicityselect;
				
        $scope.demographics = [{
			ethnicity: ethnicity,//$scope.report.data.selectinjuries.ethnicityselect,
            ethnicityother: ethnicityselectother,//$scope.report.data.selectinjuries.ethnicityselectother,
            race: injuredrace,//$scope.report.data.selectinjuries.injuredrace,
            raceother: injuredraceother,//$scope.report.data.selectinjuries.injuredraceother,		
            status: 'current',
            updateddate: Date.now(),
            updatedby: currentUser
        }];
        $scope.occupation = [{
            currentoccupation: $scope.report.data.bginfo.currentoccupation,
            currentoccupationother: $scope.report.data.bginfo.currentoccupationother,
            status: 'current',
            updateddate: Date.now(),
            updatedby: currentUser
        }];
        //Injury Demographics Page
        $scope.employment = [
               {
                   status: 'current',
                   updateddate: Date.now(),
                   updatedby: currentUser,
                   durationofemployement: $scope.report.data.bginfo.durationofemployement,
                   durationtype: $scope.report.data.bginfo.durationtype,
                   jobtitle: $scope.report.data.bginfo.jobtitle
               }
        ];
        $scope.employer = [
                {
                    company: $scope.report.data.bginfo.company,
                    natureofbusiness: $scope.report.data.bginfo.natureofbusiness,
                    othernatureofbusiness: $scope.report.data.bginfo.othernatureofbusiness,
                    emp_telephone: $scope.report.data.bginfo.emp_telephone,
                    emp_extension: $scope.report.data.bginfo.emp_extension,
                    emp_fax: $scope.report.data.bginfo.emp_fax,
                    status: 'current',
                    updateddate: Date.now(),
                    updatedby: currentUser
                }
        ];
        $scope.insurance = [
                 {
                     status: 'current',
                     updateddate: Date.now(),
                     updatedby: currentUser,
                     insurance_claimsadministrator: $scope.report.data.bginfo.insurance_claimsadministrator,
                     insurance_claimsnumber: $scope.report.data.bginfo.insurance_claimsnumber,
                     insuranceaddressline1: $scope.report.data.bginfo.insuranceaddressline1,
                     insuranceaddressline2: $scope.report.data.bginfo.insuranceaddressline2,
                     insurancecity: $scope.report.data.bginfo.insurancecity,
                     insurancestate: $scope.report.data.bginfo.insurancestate,
                     insurancezipcode: $scope.report.data.bginfo.insurancezipcode
                 }
        ];
        $scope.claimsadjuster = [
                {
                    claimsadjuster_firstname: $scope.report.data.bginfo.claimsadjuster_firstname,
                    claimsadjuster_lastname: $scope.report.data.bginfo.claimsadjuster_lastname,
                    claimsadjuster_telephoneno: $scope.report.data.bginfo.claimsadjuster_telephoneno,
                    claimsadjuster_extension: $scope.report.data.bginfo.claimsadjuster_extension,
                    claimsadjuster_email: $scope.report.data.bginfo.claimsadjuster_email,
                    claimsadjuster_fax: $scope.report.data.bginfo.claimsadjuster_fax,
                    claimsadjuster_address: $scope.report.data.bginfo.claimsadjuster_address,
                    claimsadjuster_city: $scope.report.data.bginfo.claimsadjuster_city,
                    claimsadjuster_state: $scope.report.data.bginfo.claimsadjuster_state,
                    claimsadjuster_zipcode: $scope.report.data.bginfo.claimsadjuster_zipcode,
                    claimsadjuster_company: $scope.report.data.bginfo.claimsadjuster_company,
                    status: 'current',
                    updateddate: Date.now(),
                    updatedby: currentUser
                }
        ];

        $scope.employeraddress = [
                {
                    emp_address1: $scope.report.data.bginfo.emp_address1,
                    emp_address2: $scope.report.data.bginfo.emp_address2,
                    emp_city: $scope.report.data.bginfo.emp_city,
                    emp_zipcode: $scope.report.data.bginfo.emp_zipcode,
                    emp_state: $scope.report.data.bginfo.emp_state,
                    status: 'current',
                    updateddate: Date.now(),
                    updatedby: currentUser
                }
        ];
        $scope.locationaddressinjury = [
                {
                    location_address1: $scope.report.data.bginfo.location_address1,
                    location_address2: $scope.report.data.bginfo.location_address2,
                    location_city: $scope.report.data.bginfo.location_city,
                    location_state: $scope.report.data.bginfo.location_state,
                    status: 'current',
                    location_zipcode: $scope.report.data.bginfo.location_zipcode,
                    updateddate: Date.now(),
                    updatedby: currentUser
                }
        ];

        if ($scope.changedSections) {
            if ($scope.changedSections.length > 0) {
                for (var i = 0; i < $scope.changedSections.length; i++) {
                    switch ($scope.changedSections[i]) {
                        case 'basicinformation':
                            $scope.categorypatientdata = $scope.basicinformation[0];
                            break;
                        case 'contactinformation':
                            $scope.categorypatientdata = $scope.contactinformation[0];
                            break;
                        case 'address':
                            $scope.categorypatientdata = $scope.address[0];
                            break;
                        case 'occupation':
                            $scope.categorypatientdata = $scope.occupation[0];
                            break;
                        case 'demographics':
                            $scope.categorypatientdata = $scope.demographics[0];
                            break;
                        case 'empduration':
                            $scope.categoryinjurydata = $scope.employment[0];
                            $scope.text = 'injury.$.injurydata.employment';
                            break;
                        case 'employer':
                            $scope.categoryinjurydata = $scope.employer[0];
                            $scope.text = 'injury.$.injurydata.employer';
                            break;
                        case 'insuranceadministrator':
                            $scope.categoryinjurydata = $scope.insurance[0];
                            $scope.text = 'injury.$.injurydata.insurance';
                            break;
                        case 'claimsadjuster':
                            $scope.categoryinjurydata = $scope.claimsadjuster[0];
                            $scope.text = 'injury.$.injurydata.claimsadjuster';
                            break;
                        case 'injuryinformation':
                            $scope.categoryinjurydata = $scope.injuryinformation[0];
                            $scope.text = 'injury.$.injurydata.injuryinformation';
                            break;
                        case 'employeraddress':
                            $scope.categoryinjurydata = $scope.employeraddress[0];
                            $scope.text = 'injury.$.injurydata.employeraddress';
                            break;
                        case 'locationaddressinjury':
                            $scope.categoryinjurydata = $scope.locationaddressinjury[0];
                            $scope.text = 'injury.$.injurydata.locationaddressinjury';
                            break;
                        case 'medicalhistory':
                            $scope.categorypatientdata = $scope.medicalhistory[0];
                            break;
                        case 'sh':
                            $scope.categorypatientdata = $scope.sh[0];
                            break;
                    }

                     
                    if ($scope.categoryinjurydata) {
                        Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.categoryinjurydata, text: $scope.text }, function (res) {
                             
                        }).$promise.then(function () {
                            
                        })
                    }
                    if ($scope.categorypatientdata) {
                        var query = {
                            patientid: $sessionStorage.patientId,
                            category: $scope.changedSections[i],
                            categorynewdata: $scope.categorypatientdata
                        };
                        Patients.updatePatient().save(query).$promise.then(function (patients) {
                           
                            //$('#saveuserForm').prop("disabled", false);
                        });
                    }
                }
            }
        }

    };

    $scope.autoSaveReportData = function (callback) {
         
        var reportid = $sessionStorage.reportId;
        $scope.reportid = $sessionStorage.reportId;
        $scope.formType = $cookies.formType;
        $scope.formVersion = $cookies.formVersion;
        var formid = $scope.formid ? $scope.formid : '';

        $scope.updateArchiveData();

        if (!reportid) {
             
            savePatientdata.save({ 'data': $scope.report.data, 'reportType': $scope.formType, 'id': patientid, 'injury': injuryId, 'formid': formid, 'type': formtype, 'version': formversion, 'modifiedby': currentusername, 'userlevel': Level, 'createdby': $rootScope.currentUser.username, 'status': 'open', 'reportpublishid': $scope.randomPublishReportId, 'state': $cookies.selectedStatecode, 'practicename': $rootScope.currentUser.practicename, 'dateofinjury': $cookies.dateofInjury, 'previousclosedreport': $scope.closedreport, 'createdDate': Date.now(), 'rfas': $rootScope.rfas }).$promise.then(function (response) {
                //Code for patient table data update
                 
                reportid = response.id;
                $scope.reportid = response.id;
                $scope.redirect = true;
                $sessionStorage.reportId = reportid;
                var reportstatus = response.status;
                if (reportstatus) {
                    $cookies.reportstatus = reportstatus;
                    $scope.reportStatus = reportstatus;
                }
                var patientid = $routeParams.patientid;
                var injuryid = $rootScope.InjuryId;
                Injuries.updateinjuryinfo().save({ injid: injuryId, injuryinformation: injurydata }, function (res) {
                     
                }).$promise.then(function () {
                    callback();
                })
            });
        }
        else {
             
            savePatientdata.save({ 'data': $scope.report.data, 'reportType': $scope.formType, 'id': patientid, 'reportid': reportid, 'injury': injuryId, 'type': formtype, 'version': formversion, 'modifiedby': currentusername, 'userlevel': Level, 'status': 'open', 'state': $cookies.selectedStatecode }).$promise.then(function (response) {
                //Code for patient table data update
                 
                $scope.redirect = true;
                var reportstatus = response.status;
                if (reportstatus) {
                    $cookies.reportstatus = reportstatus;
                    $scope.reportStatus = reportstatus;
                }
                var patientid = $sessionStorage.patientId;
                var injuryid = $sessionStorage.InjuryId;
                Injuries.updateinjuryinfo().save({ injid: injuryId, injuryinformation: injurydata }, function (res) {
                     
                }).$promise.then(function () {
                    $scope.isLoad = true;
                    callback();
                })
            });
        }


        callback();
    };

    /*
	* Assign sibodypart  to concatedbodypart  since sibodypart model are attached. 
	*/
    $scope.assigntoConcatedbodypart = function () {
        var sibodyparts = $scope.report.data.selectinjuries.sibodypart;
        var concatedbodypart = $scope.report.data.selectinjuries.concatedbodypart;
        var sidetxt = '';
        var contxt = '';

        for (var i = 0; i < sibodyparts.length; i++) {
            if (sibodyparts[i].id == 'other') {
                if (sibodyparts[i].bdsides != 'n/a') {
                    sidetxt = sibodyparts[i].bdsystemother + sibodyparts[i].bdpartother + sibodyparts[i].bdsides;
                }
                if (sibodyparts[i].bdsides == 'n/a') {
                    sidetxt = sibodyparts[i].bdsystemother + sibodyparts[i].bdpartother;
                }
            } else {
                sidetxt = sibodyparts[i].id;
                if (sibodyparts[i].bdsides != "none") {
                    sidetxt = sibodyparts[i].id + sibodyparts[i].bdsides;
                }
            }

            for (var j = 0; j < concatedbodypart.length; j++) {
                if (concatedbodypart[j].id == 'other') {
                    if (concatedbodypart[j].bdsides != 'n/a') {
                        contxt = concatedbodypart[j].bdsystemother + concatedbodypart[j].bdpartother + concatedbodypart[j].bdsides;
                    }
                    if (concatedbodypart[j].bdsides == 'n/a') {
                        contxt = concatedbodypart[j].bdsystemother + concatedbodypart[j].bdpartother;
                    }
                } else {
                    contxt = concatedbodypart[j].id;
                    if (concatedbodypart[j].bdsides != "none") {
                        contxt = concatedbodypart[j].id + concatedbodypart[j].bdsides;
                    }
                }
                if (sidetxt == contxt) {
                    $scope.report.data.selectinjuries.concatedbodypart[j].dateOfRating = $scope.report.data.selectinjuries.sibodypart[i].dateOfRating;
                    $scope.report.data.selectinjuries.concatedbodypart[j].ratebodypart = $scope.report.data.selectinjuries.sibodypart[i].ratebodypart;
                    $scope.report.data.selectinjuries.concatedbodypart[j].ratebodyYesNoRadio = $scope.report.data.selectinjuries.sibodypart[i].ratebodyYesNoRadio;
                }
            }
        }
    }
	
		/*
		* Forced string is used set value as string
		*/
	$scope.forcedString = function (val) {
      try{
				var str='';
				//Val is object hence blank value will be send
				if(Object.prototype.toString.call(val)=='[object Object]'){
						str='';
				}
				//Val is Array hence blank value will be send
				if(Object.prototype.toString.call(val)=='[object Array]'){
						str=val.toString();
				}
					//Val is Array hence blank value will be send
				if(typeof val=="string"){
						str=val.toString();
				}
				}catch(err)
				{
					//console.log(err);
				}
			return str;
    };
		/*
		* Forced Array is used set value as array
		*/
	$scope.forcedArray = function (val) {
      try{
				 var _val=[];
				//Val is Array hence blank value will be send
				if(Object.prototype.toString.call(val)=='[object Array]'){
						_val=val;
				}
				}catch(err)
				{
					//console.log(err);
				}		
			return _val;
    };
		
		/*
		* Forced Array is used set value as array
		*/
	$scope.forcedObject = function (val) {
      try{
				 var _val={};
					//Val is Array hence blank value will be send
					if(Object.prototype.toString.call(val)=='[object Object]'){
							_val=val;
					}
			}catch(err)
			{
				//console.log(err);
			}
		
			return _val;
    };

    $scope.savenewPatientdata = function (submitStatus, newReportStatus, callback) {		
		try
		{
			if(typeof($scope.report.data['workrestriction']['WRremainoffdate1']) != 'undefined')
			{
				if($scope.report.data['workrestriction']['WRremainoffdate1'] != '')
				{									
						var d1 = new Date($scope.report.data['workrestriction']['WRremainoffdate1']);								
						var d2 = new Date($scope.report.data['workrestriction']['WRraminoffdate2']);									
						if (d1.getTime() >= d2.getTime()) 
						{
							if($cookies.formType=="pr4"){
									
									var messge="<h3><p>On the Functional Limitations page, the Remain off-work date range is invalid.</p></h3>"
							}else{
										var messge="<h3><p>On the Work Status page, the Remain off-work date range is invalid.</p></h3>"
									
							}
							
							$rootScope.modalInstance = $modal.open({
								 templateUrl: 'partials/customModal.html',
										controller: 'customModalController',
									resolve: {
											dispalyMessage: function () {
													return messge;
											}
									}
							});
							return false;
						}
				}
			}
			
			if(typeof($scope.report.data['workrestriction']['WRremainoffdate1modified']) != 'undefined')
			{
				if($scope.report.data['workrestriction']['WRremainoffdate1modified'] != '')
				{									
						var d1 = new Date($scope.report.data['workrestriction']['WRremainoffdate1modified']);								
						var d2 = new Date($scope.report.data['workrestriction']['WRraminoffdate2modified']);									
						if (d1.getTime() >= d2.getTime()) 
						{
							if($cookies.formType=="pr4"){
									
									var messge="<h3><p>On the Functional Limitations page, the Return to modified work date range is invalid.</p></h3>"
							}else{
										var messge="<h3><p>On the Work Status page, the Return to modified work date range is invalid.</p></h3>"
									
							}
							
							$rootScope.modalInstance = $modal.open({
								 templateUrl: 'partials/customModal.html',
										controller: 'customModalController',
									resolve: {
											dispalyMessage: function () {
													return messge;
											}
									}
							});
							//$scope.report.data['workrestriction']['WRraminoffdate2modified'] = '';
							return false;
						}
				}
			}
		}
		catch(err)
		{
			//console.log(err);
		}
		
		
         
        /*
		*shridhar : assigntoConcatedbodypart() used to sync sibodypart with concatedbodypart
		*/
        if ($cookies.formType == 'pr4') {
            $scope.assigntoConcatedbodypart();
        }

        $scope.rfaClinicLocUpdate($scope.report.data.patientcomplaints.cliniclocation);
        $scope.isLoad = false;
        var reportid = '';
        var modalInstance;
        //set current Form information from the cookies for saving the Form info in the Patient Reports 
        $scope.formType = $cookies.formType;
        //$scope.formVersion = $cookies.formVersion;
        var formid = $scope.formid ? $scope.formid : '';

         
        $scope.changedSections = $cookieStore.get('selectedCategories');
        var currentUser = $rootScope.currentUser.username;
        var reportid = $sessionStorage.reportId;
        $scope.reportid = $sessionStorage.reportId;
        $scope.newReportStatus = newReportStatus;

         
        $scope.patientId = $sessionStorage.patientId;
        $scope.selectesState = $cookies.selectedState;

         

        var Level = ($rootScope.currentUser.level) ? $rootScope.currentUser.level : 'level4';
        var witnes = {};
        var firstaid_measure = {};
        var reported_employee = {};

        if ($scope.report.data.selectinjuries.firstaid_measure) {
            angular.forEach($scope.report.data.selectinjuries.firstaid_measure, function (value, key) {
                switch (value) {
                    case 'Heat':
                        $scope.measureValue = "Heat";
                        break;
                    case 'Ice':
                        $scope.measureValue = "Ice";
                        break;
                    case 'Over the counter pain meds':
                        $scope.measureValue = "counterPain";
                        break;
                }
                if ($scope.report.data.selectinjuries.other_measure == 'Other') {
                    firstaid_measure['other_measure'] = true;
                }
                firstaid_measure[$scope.measureValue] = true;
            });
        }

        if ($scope.report.data.selectinjuries.witnes) {
            angular.forEach($scope.report.data.selectinjuries.witnes, function (value, key) {
                switch (value) {
                    case 'Supervisor':
                        $scope.witnessValue = "Supervisor";
                        break;
                    case 'Coworker':
                        $scope.witnessValue = "Coworker";
                        break;
                }
                if ($scope.report.data.selectinjuries.witnesothercheck == 'Other') {
                    witnes['Other'] = true;
                }
                witnes[$scope.witnessValue] = true;
            });
        }

        if ($scope.report.data.selectinjuries.reportedemploye) {
            angular.forEach($scope.report.data.selectinjuries.reportedemploye, function (value, key) {
                 
                switch (value) {
                    case 'Supervisor':
                        $scope.employeeValue = "Supervisor";
                        break;
                    case 'Human resources':
                        $scope.employeeValue = "HR";
                        break;
                    case 'Owner':
                        $scope.employeeValue = "Owner";
                        break;
                }
                if ($scope.report.data.selectinjuries.other_reportedemploye == 'Other') {
                    reported_employee['Other_reportemployer'] = true;
                }
                reported_employee[$scope.employeeValue] = true;
            });
        }

        $scope.injuryinformation = [
            {
                dateofinjury: $scope.report.data.bginfo.dateofinjury,
                dateoflastwork:$scope.report.data.bginfo.dateoflastwork,
                dateofpermanent: $scope.report.data.selectinjuries.dateofpermanent,
                timeofinjury: $scope.report.data.bginfo.timeofinjury,
                injuryplace: $scope.forcedString($scope.report.data.selectinjuries.injuryplace),
                isinjurywitnes: $scope.forcedString($scope.report.data.selectinjuries.isinjurywitnes),
								other_injuryplace: $scope.forcedString($scope.report.data.selectinjuries.other_injuryplace),
                firstaid: $scope.forcedString($scope.report.data.selectinjuries.firstaid),
                firstaid_measure: $scope.forcedObject(firstaid_measure),
                other_measure: 	$scope.forcedArray($scope.report.data.selectinjuries.other_measure),
                other_measure_text: $scope.forcedString($scope.report.data.selectinjuries.other_measure_text),
                reportedemployOther: $scope.forcedString($scope.report.data.selectinjuries.reportedEmployerOtherText),
                reportedemployer: $scope.forcedString($scope.report.data.selectinjuries.reportedemployer),
                reportedemploye: reported_employee,
								other_reportedemploye: 	$scope.forcedArray($scope.report.data.selectinjuries.other_reportedemploye),
                afterworking:$scope.forcedString( $scope.report.data.selectinjuries.afterworking),
                other_afterworking: $scope.forcedString($scope.report.data.selectinjuries.other_afterworking),
                additionaldetail: $scope.forcedString($scope.report.data.selectinjuries.additionaldetail),
                witnes: $scope.forcedObject(witnes),
                other_isinjurywitnes: $scope.forcedString($scope.report.data.selectinjuries.other_isinjurywitnes),
                evaluated_prior: $scope.forcedString($scope.report.data.selectinjuries.evaluated_prior),
                timeofpriorevaluation: $scope.report.data.selectinjuries.timeofpriorevaluation,
                dateofpriorevaluation: $scope.report.data.selectinjuries.dateofpriorevaluation,
                otherwitnes: $scope.forcedString($scope.report.data.selectinjuries.otherwitnes),
                updateddate: $scope.report.data.selectinjuries.updateddate,
                updatedby: $scope.forcedString($scope.report.data.selectinjuries.updatedby)
            }
        ];
		
         
        //reportFormdata.query({ id: $scope.formType }, function (responce) {

         
        $scope.ID = $scope.formlistId;
        var data = $scope.report.data;
        //var formversion = $cookies.formVersion;
        var formversion = $scope.formversion
        var formtype = $cookies.formType;
        var patientid = $sessionStorage.patientId;
        var injuryId = $sessionStorage.InjuryId;
        var reportid = $sessionStorage.reportId;
        var injurydata = $scope.injuryinformation;
        var currentusername = $rootScope.currentUser.username;
        var currentdate = Date.now();
        $scope.practicename = $rootScope.currentUser.practicename;
        $scope.formtype = $cookies.formType;
         
        // Do when report is Submitted
        if (submitStatus == 'submit') {

            //Below code added by Unais to return the path to display report from HTML
            var strTemplate = $scope.getHTMLTemplatePreviewSubmit(formtype, $scope.formversion, $scope.flavor);


            $scope.isLoad = false;
            //get Report Price
            getReportCharge.query({ formtype: $scope.formtype }).$promise.then(function (response) {
                 
                //If pricing type is default then global pricing will applied for the report
                if ($scope.practiceInfo.pricingtype == 'defaultpricing') {
                    $scope.reportcharge = parseFloat(response[0].pricing);
                } else { //if pricing type is custom then custom pricing of a practice account will be applied 
                    $scope.reportcharge = parseFloat($scope.practiceInfo.reportpricing[$scope.formtype]);
                }

                //get count of submitted Report in that practice account
                submittedReportcount.query({ 'practicename': $scope.practicename, 'formtype': $scope.formtype }, function (response) {
                    if (response[0].count == 0) {
                        $scope.submittedreportCount = 0;
                        $scope.reportcharge = 0;
                    }
                    else {
                        $scope.submittedreportCount = response[0].count;
                    }

                     
                }).$promise.then(function (response) {
                    //set true when loading the report from database to keep the loader on;
                    //$scope.isLoad = true;

                    //get Report html from database
                    
                    getReportDataById.query({ 'reportid': $scope.randomPublishReportId }).$promise.then(function (result) {

                         
                        if (result[0].reportList.length > 0) {
                            $scope.reportList = result[0].reportList[0].reportdata;
                            $scope.reportFlavor = result[0].reportList[0].reportformat;
                        }
                        else {
                            $scope.reportList = 'Blankdata';
                        }
                        //$scope.isLoad = true;
                        $rootScope.modalPreview = $modal.open({
                            templateUrl: 'partials/reportpreview.html',
                            windowClass: 'app-modal-window',
                            controller: 'formdataPreviewCtrl',
                            resolve: {
                                report: function () {
                                    return $scope.report;
                                },
                                submittedreportcount: function () {
                                    return $scope.submittedreportCount;
                                },
                                chargeReport: function () {
                                    return $scope.reportcharge;
                                },
                                reportdata: function () {
                                    return $scope.reportList;
                                },
                                newReportStatus: function () {
                                    return $scope.newReportStatus;
                                },
                                closedreport: function () {
                                    return '';
                                },
                                reportFlavor: function () {
                                    return '';
                                },
                                submitStatus: function () {
                                    return submitStatus;
                                },
                                submittedDate: function () {
                                    return $scope.submittedDate;
                                },
                                strTemplate: function () {
                                    return strTemplate;
                                }
                            }
                        });
                        $rootScope.modalPreview.result.then(function (currentdata) {
                            $rootScope.rfas = $rootScope.rfaData();
                             
                            $scope.isLoad = true;
                            if (currentdata == 'submit') {
                                if ($scope.currentReportStatus == 'open') {
                                    $scope.submitFormLoader = false;
                                } else {
                                    $scope.fullFormLoader = false;
                                }

                                //Update the Archive Data from the Background information Section of the Report
                                $scope.updateArchiveData();

                                //Update currently selected clinic location in scope
                                $scope.rfaClinicLocUpdate($scope.report.data.patientcomplaints.cliniclocation);

                                var savePatientdataQueryString = {
                                    'reportid': reportid,
                                    'data': $scope.report.data,
                                    'formtype': formtype,
                                    'reportcharge': $scope.reportcharge,
                                    'status': newReportStatus,
                                    'state': $cookies.selectedStatecode, //State is required for PR4 billing calculation 
                                    'rfas': $rootScope.rfas,
                                    'mail_reratecomment': $scope.reratecomment,
                                    'mail_reratetype': $scope.reratetype
                                };
                                 
                                savePatientdata.save(savePatientdataQueryString).$promise.then(function (response) {                                    
                                    //Code for patient table data update
                                    if (!reportid) {
                                        reportid = response.id;
                                        $sessionStorage.reportId = response.id;
                                        $scope.reportid = response.id;
                                    }
                                    $scope.redirect = true;

                                    //var reportstatus = response.status;
                                    //if (reportstatus) {
                                    //    $cookies.reportstatus = reportstatus;
                                    //    $scope.reportStatus = reportstatus;
                                    //}
                                    //var patientid = $routeParams.patientid;

                                    if ($scope.formtype == 'pr4') {
                                        $scope.saveRateBodyInjuryData($scope.injuryId);
                                    }

                                    var injuryid = $rootScope.InjuryId;
                                    Injuries.updateinjuryinfo().save({ injid: injuryId, injuryinformation: injurydata }, function (res) {
                                         
                                    }).$promise.then(function () {                                         
                                        if ($scope.submittedreportCount >= 2 && $rootScope.currentUser.role != 'siteadmin' && $rootScope.currentUser.role != 'rater1' && $rootScope.currentUser.role != 'rater2' && $scope.reportcharge != 0) {                                            
                                            //service called from report.js
                                            chargeReport.query({ chargeamount: $scope.reportcharge }, function (response, err) {											
                                            }).$promise.then(function (response, err) {
                                                											
                                                $scope.isLoad = true;

                                                if (!err) {
                                                    if (submitStatus == 'idletimeout') {
                                                        $scope.isLoad = true;

                                                    }
                                                    else {
                                                       
                                                        if ($rootScope.currentUser.role == 'rater1' || $rootScope.currentUser.role == 'rater2') {
                                                            $scope.exitform('/submittedreport');
                                                        }
                                                        else {
                                                            $scope.exitform('/patient/createinjury');
                                                        }
                                                    }

                                                }
                                                else {
                                                    //update status to open
                                                    updateReportStatus.query({ 'reportid': $scope.reportid });
													
                                                    $scope.submitFormLoader = true;
                                                    $scope.popupMessage('We\'re sorry, but there is an issue with your credit card information. If you are an administrator please update the credit card information for this practice. Otherwise, please contact your account\'s administrator.', 400);

                                                }

                                            }).catch(function (err) {
                                                                                           
                                               
                                                $scope.isLoad = true;
                                                $scope.submitFormLoader = true;
                                                //update status to open
                                                updateReportStatus.query({ 'reportid': $scope.reportid });                                               
                                                if (err) {
                                                    if (err.data) {
                                                        if (err.data.message) {
                                                            if (err.data.code) {
                                                                if (err.data.code == 'E00027') {
                                                                    $scope.popupMessage('Another report has been submitted recently. To avoid billing errors, please wait for 2 minutes and then submit the report again.', 400);
                                                                }
																else if (err.data.code == 'E00007') {
                                                                    $scope.popupMessage('Your credit card was declined! Your report has not been submitted. If your credit card has expired, please exit this report and re-enter your credit card information in the practice settings, or ask an admin user to do the same. For help, please email info@rate-fast.com', 400);
                                                                }
																else
																{
																	$scope.popupMessage('We\'re sorry, but there is an issue with your credit card information. If you are an administrator please update the credit card information for this practice. Otherwise, please contact your account\'s administrator.', 400);
																}
                                                            }
                                                        }
                                                    }
                                                } else {
                                                    $scope.popupMessage('We\'re sorry, but there is an issue with your credit card information. If you are an administrator please update the credit card information for this practice. Otherwise, please contact your account\'s administrator.', 400);
                                                }

                                            });
                                        } else {
											
											
                                            if (submitStatus == 'idletimeout') {
                                                $scope.isLoad = true;

                                            }
                                            else {
                                                if ($rootScope.currentUser.role == 'rater1' || $rootScope.currentUser.role == 'rater2') {
                                                    $scope.exitform('/submittedreport');
                                                }
                                                else {
                                                    $scope.exitform('/patient/createinjury');
                                                }
                                            }
                                        }

                                    }).catch(function (err) {

                                         
                                        $scope.isLoad = true;
                                        $scope.submitFormLoader = true;

                                        $scope.popupMessage('Due to some technical issue, the report could not be saved. Please try again. ', 400);

                                    });
                                }).catch(function (err) {

                                     
                                    $scope.isLoad = true;
                                    $scope.submitFormLoader = true;

                                    $scope.popupMessage('Due to some technical issue, the report could not be saved. Please try again. ', 400);

                                });



                            }
                            else {
                                $scope.isLoad = true;
                            }

                        }, function (currentdata) {
                             
                            $scope.isLoad = true;

                        });
                    });

                });
            });
        }
        else {
             
            //Update the Archive Data from the Background information Section of the Report
            $scope.updateArchiveData();

            //Updating scope with currently selected clinic location
            $scope.rfaClinicLocUpdate($scope.report.data.patientcomplaints.cliniclocation);

            var rfas=$rootScope.rfaData();
			try{
				if(typeof($scope.existingpatientData) !="undefined"){
					if(typeof($scope.existingpatientData.patientData) !="undefined"){
						if(typeof($scope.existingpatientData.patientData[0]) !="undefined"){
							if(typeof($scope.existingpatientData.patientData[0].rfas) !="undefined"){
								rfas=typeof($scope.existingpatientData)!='undefined'?$scope.existingpatientData.patientData[0].rfas:$rootScope.rfaData();
							}
						}
					}
				}
			}catch(err){
				//console.log(err);
			}
					
            if (!reportid) {
                var savePatientdataQueryString = {
                    'status': 'open',
                    'data': $scope.report.data,
                    'patientid': $scope.patientId,
                    'injuryid': $scope.injuryId,
                    'formid': $scope.formid,
                    'formtype': $scope.formtype,
                    'version': $scope.formversion,
                    'reportpublishid': $scope.randomPublishReportId,
                    'state': $cookies.selectedStatecode,
                    'practicename': $rootScope.currentUser.practicename,
                    'previousclosedreport': $scope.closedreport,
                    'rfas': rfas
                };
            } else {
                var savePatientdataQueryString = { 'reportid': reportid, 'data': $scope.report.data, 'formtype': formtype ,'rfas': rfas};
            }

            savePatientdata.save(savePatientdataQueryString).$promise.then(function (response) {
                 
                if (!reportid) {
                    reportid = response.id;
                    $scope.reportid = response.id;
                    $sessionStorage.reportId = reportid;
                }

                $scope.redirect = true;
                var reportstatus = response.status;
                if (reportstatus) {
                    $cookies.reportstatus = reportstatus;
                    $scope.reportStatus = reportstatus;
                }
                var patientid = $routeParams.patientid;
                var injuryid = $rootScope.InjuryId;

                //Shridhar code for MMI
                if ($scope.formtype == 'pr4') {
                    $scope.saveRateBodyInjuryData($scope.injuryId);
                }

                Injuries.updateinjuryinfo().save({ injid: injuryId, injuryinformation: injurydata }, function (res) {
                     
                }).$promise.then(function () {
                     
                    $scope.isLoad = true;
                    if (submitStatus == 'idletimeout') {
                        $scope.isLoad = true;
                    }
                    else if (submitStatus == 'autosavelogout') {
                        callback();
                    }
                    else if (submitStatus == 'savedata') {
                        $scope.popupMessage('Your data has been saved!', 400);

                    }
                    else if (submitStatus == 'savefaxdata') {
                        //$scope.popupMessage('Your data has been saved!', 400);

                    }
					else if (submitStatus == 'saveforpreview') {
                        //no alert msg
                    }
                    else {
                        if (submitStatus != 'sectionChange') {
                            $scope.exitform('/patient/createinjury');
                        }
                    }
                })
            });

        }

        //});
    };

    $scope.saveRateBodyInjuryData = function (injuryID) {

        /*
		*shridhar
		*for hiding if MMI isn't set for any one body part
		*this function used to save data in injury collection for rate body 
		*/

        var latestinjuryData = {};

        selectinjuriesPatientdata.query({ injuryid: $sessionStorage.InjuryId }, function (injuryData) {
            debugger
            var getupdatedInjuryDetails = injuryData[0].selectinjuries[0].injury[0].injurydata.acceptedbodyparts;

            for (var i = 0; i < getupdatedInjuryDetails.length; i++) {
                if (getupdatedInjuryDetails[i].status == 'current') {
                    latestinjuryData = getupdatedInjuryDetails[i];
                }
            }

            if (latestinjuryData != '') {
                latestinjuryData.status = "current";
                delete latestinjuryData._id;
                for (var i = 0; i < latestinjuryData.injuredbodypart.length; i++) {

                    var latestBodypartData = JSON.parse(latestinjuryData.injuredbodypart[i].bodypart);
                    for (var j = 0; j < $scope.report.data.selectinjuries.sibodypart.length; j++) {

                        if (latestBodypartData.sequence == $scope.report.data.selectinjuries.sibodypart[j].sequence && latestinjuryData.injuredbodypart[i].bodypartsides.toLowerCase() == $scope.report.data.selectinjuries.sibodypart[j].bdsides) {
                            latestinjuryData.injuredbodypart[i].ratebodypart = $scope.report.data.selectinjuries.sibodypart[j].ratebodypart;
                            latestinjuryData.injuredbodypart[i].dateOfRating = $scope.report.data.selectinjuries.sibodypart[j].dateOfRating;
                            latestinjuryData.injuredbodypart[i].ratebodyYesNoRadio = $scope.report.data.selectinjuries.sibodypart[j].ratebodyYesNoRadio;
                            break;
                        }
                    }
                }

                Injuries.updatesubinjuriesforbdpart().save({ injid: injuryID, injurydata: latestinjuryData, text: 'injury.$.injurydata.acceptedbodyparts', changetoarchive: true }, function (res) {
                }).$promise.then(function () {
                     
                    Injuries.updatesubinjuriesforbdpart().save({ injid: injuryID, injurydata: latestinjuryData, text: 'injury.$.injurydata.acceptedbodyparts', changetoarchive: false }, function (res) {
                        
                    });
                });
            }
        })
    }

    /*$scope.rfaClinicalLocation = function (currentselection) {
        /**
         * Code to save clinical location in object
         *//*
        if ($rootScope.allcliniclocation.length > 0) {
            var i = 0;
            var len = $rootScope.allcliniclocation.length;
            for (i = 0; i < len; i++) {
                var getcliniclocation = $rootScope.allcliniclocation[i];
                var currentloc = getcliniclocation.county + ', ' + getcliniclocation.street + ', ' + getcliniclocation.city + ', ' + getcliniclocation.zipcode + ', ' + getcliniclocation.state + ', ' + getcliniclocation.country;
                if (currentloc == currentselection) {
                    return i;
                }
            }
        }

        //$scope.report.data.patientcomplaints.cliniclocationobj=$rootScope.allcliniclocation[selClinicIndex];

        /**
         * Code to save clinical location i object ends here
         *//*
    }

    $scope.rfaClinicLocUpdate = function (currentLoc) {
        /**
       * Code to save clinical location in object
       *//*
        var selClinicIndex = $scope.rfaClinicalLocation(currentLoc);
        $scope.report.data.patientcomplaints.cliniclocationobj = $rootScope.allcliniclocation[selClinicIndex];

        /**
       * Code to save clinical location i object ends here
      *//*
    };*/
	
	 $scope.rfaClinicalLocation = function (currentselection) {
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
                        return i;
                    }
                }
            }

            //$scope.report.data.patientcomplaints.cliniclocationobj=$rootScope.allcliniclocation[selClinicIndex];

            /**
             * Code to save clinical location i object ends here
             */
            return -1;
        }

         $scope.rfaClinicLocUpdate = function (currentLoc) {
            /**
           * Code to save clinical location in object
           */
            try {
                var selClinicIndex = $scope.rfaClinicalLocation(currentLoc);
                if (selClinicIndex == -1) {
                    if (typeof $scope.report.data.patientcomplaints.cliniclocation != 'undefined') {
                        var newclinicLocation = $scope.report.data.patientcomplaints.cliniclocation;
                        var newaddressArray = newclinicLocation.split(",");
                        var clobj = {};
                        clobj.county = newaddressArray[0].trim();
                        clobj.street = newaddressArray[1].trim();
                        clobj.city = newaddressArray[2].trim();
                        clobj.zipcode = newaddressArray[3].trim();
                        clobj.state = newaddressArray[4].trim();
                        clobj.country = newaddressArray[5].trim();
                        if (typeof $scope.report.data.patientcomplaints.cliniclocationobj != 'undefined') {
                            clobj.zipcode = $scope.report.data.patientcomplaints.cliniclocationobj.zipcode;
                            clobj._id = $scope.report.data.patientcomplaints.cliniclocationobj._id;
                            clobj.location = $scope.report.data.patientcomplaints.cliniclocationobj.location;
                        }
                        $rootScope.allcliniclocation.push(clobj);
                        $scope.report.data.patientcomplaints.cliniclocationobj = clobj;

                    }
                } else {
                    $scope.report.data.patientcomplaints.cliniclocationobj = $rootScope.allcliniclocation[selClinicIndex];

                }
            } catch (err) {

            }

            /**
           * Code to save clinical location i object ends here
          */
        };
		

    //Rater Save & Exit Function
    $scope.saveReportData = function (path) {
        $scope.isLoad = false;
        updateReportData.save({ 'reportid': $sessionStorage.reportId, 'data': $scope.report.data }).$promise.then(function (response) {
            $scope.isLoad = true;
             
            $scope.exitform(path);

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

    $scope.showDiv = function () {
        $scope.displayNoReratingdiv = false;
        $scope.displayYesReratingdiv = false;
        $scope.displayFormdiv = true;
    };

    $scope.confirmSubmitRerating = function () {

         
        $rootScope.modalInstance = $modal.open({
            templateUrl: 'partials/confirmsubmitrerating.html',
            windowClass: 'app-modal-window',
            controller: 'confirmSubmitReratingctrl',
            resolve: {
            }

        });
        $rootScope.modalInstance.result.then(function (displayReratingdiv) {
             
            if (displayReratingdiv == 'NoRerating') {
                $scope.displayNoReratingdiv = true;
                $scope.displayYesReratingdiv = false;
                $scope.displayFormdiv = false;
            } else if (displayReratingdiv == 'YesRerating') {
                $scope.displayYesReratingdiv = true;
                $scope.displayNoReratingdiv = false;
                $scope.displayFormdiv = false;
            } else {
                $scope.displayFormdiv = true;
                $scope.displayNoReratingdiv = false;
                $scope.displayYesReratingdiv = false;
            }



        }, function () {
             
        });

    };

    $scope.rerateReport = function (status) {
         
        //set current Form information from the cookiees for saving the Form info in the Patient Reports 
        var formtype = $cookies.formType;
        var formversion = $cookies.formVersion;
        var reportId = $sessionStorage.reportId;
        var patientId = $sessionStorage.patientId;
        var injuryId = $sessionStorage.InjuryId;
        var currentUser = $rootScope.currentUser.username;
        var Level = ($rootScope.currentUser.level) ? $rootScope.currentUser.level : 'level4';
        var practicename = $rootScope.currentUser.practicename;
        var createdby = $scope.createdby;
        var reportId = $scope.reportId;
        var formid = $scope.formid;

        //Remove data of billing calculator while re-rating
        $scope.report.data.bc = new Object();
        //Adding Re-rate comment of the user in the final claim summary section
        $scope.report.data.impairmentratingfinalclaim = new Object();
        $scope.report.data.impairmentratingfinalclaim.rerateComment = new Object();
        $scope.report.data.impairmentratingfinalclaim.rerateComment = $scope.reratecomment;

        var rerateComment = '';
        //Re-rate report without changes 
        if (status == 'level1') {
            var reratetype = 'nochange';
            rerateComment = $scope.reratecomment;

            if ($scope.reratecomment) {
                if ($scope.reratecomment.length == 0) {
                    alert("Would you please enter some text?");
                    return false;
                }
            } else {
                alert("Would you please enter some text?");
                return false;
            }

            var queryString = {
                'data': $scope.report.data,
                'patientid': patientId,
                'injuryid': injuryId,
                'reportcopiedfrom': reportId,
                'formid': formid,
                'formtype': formtype,
                'version': formversion,
                'status': status,
                'reportpublishid': $scope.randomPublishReportId,
                'state': $cookies.selectedStatecode,
                'reratecomment': rerateComment,
                'reratetype': reratetype,
                'submittedBy': currentUser,
                'submittedDate': Date.now(),
                'mail_reratecomment': $scope.reratecomment,
                'mail_reratetype': reratetype

            };

        } else if (status == 'open') { //Re-rate report with changes 
            var reratetype = 'withchange';

            var queryString = {
                'data': $scope.report.data,
                'patientid': patientId,
                'injuryid': injuryId,
                'reportcopiedfrom': reportId,
                'formid': formid,
                'formtype': formtype,
                'version': formversion,
                'status': status,
                'reportpublishid': $scope.randomPublishReportId,
                'state': $cookies.selectedStatecode,
                'reratecomment': rerateComment,
                'reratetype': reratetype
            };

        } else {
            alert("Invalid Command");
            return false;
        }

         
        savePatientdata.save(queryString).$promise.then(function (response) {
             
            if (reratetype == 'withchange') {
                $scope.displayYesReratingdiv = false;
                $sessionStorage.reportId = response.id;
                $scope.popupMessage('Report copied to new report successfully.', 400);
                $scope.newdfrReport();


            } else {
                $scope.exitform('/patient/createinjury');
            }
        });



    };

    $scope.reportUpdatedData = function () {
         
        return $scope.report;
    };

    //Added by Unais to load report dynamically from HTML
    $scope.getHTMLTemplatePreviewSubmit = function (formtype, version, flavor) {
        /*
    	 * this function return the template url
    	 * url used to load file as per version and flavor defined
    	 */
        var strTemplate = "";
		

        //if(typeof flavor=='undefined')
        flavor = 'a';
        strTemplate = "partials/" + formtype + "/v" + version + "/" + flavor + "/" + formtype + "-main.html";
        return strTemplate;
    }

    $scope.newdfrReportPreivew = function (newReportStatus, currentsectionId) {
		
		if($scope.formtype=='pr4')
			$scope.computePainAssesment();
		
		//author : shridhar : - save data when click on preview
    	if(newReportStatus=='preview'){    	
    		$scope.checkValidation(currentsectionId,'saveforpreview','open');
    	}

        //Added by Unais to populate template for report through HTML
        var strTemplate = $scope.getHTMLTemplatePreviewSubmit($rootScope.formtype, $scope.formversion, $scope.flavor);


         
        $scope.rfaClinicLocUpdate($scope.report.data.patientcomplaints.cliniclocation);
        $scope.isLoad = false;
        var formid = $routeParams.patientid;
        var reportstatus = reportstatus;
        $rootScope.currentUser;
        $scope.report;
        $rootScope.rfas = $rootScope.rfaData();

        // GT:RISHU 09.26.14 Report Publish text from databse 

        getReportDataById.query({ reportid: $scope.randomPublishReportId }).$promise.then(function (result) {
             
            if (result[0].reportList.length > 0) {
                $scope.reportList = result[0].reportList[0].reportdata;
                $scope.reportFlavor = result[0].reportList[0].reportformat;
            }
            else {
                $scope.reportList = 'Blankdata';
            }
            $rootScope.billingcalculatoromfs = $scope.practiceInfo.billingcalculatoromfs;
            $rootScope.modalPreview = $modal.open({
                templateUrl: 'partials/reportpreview.html',
                windowClass: 'app-modal-window',
                controller: 'formdataPreviewCtrl',
                resolve: {
                    report: function () {
                        return $scope.report;
                    },
                    reportdata: function () {
                        return $scope.reportList;
                    },
                    reportFlavor: function () {
                        return $scope.reportFlavor;
                    },
                    closedreport: function () {
                        return $scope.closedreport;
                    },
                    submittedreportcount: function () {
                        return '';
                    },
                    chargeReport: function () {
                        return '';
                    },
                    newReportStatus: function () {
                        return newReportStatus;
                    },
                    submitStatus: function () {
                        return '';
                    },
                    submittedDate: function () {
                        return $scope.submittedDate;
                    },
                    strTemplate: function () {
                        return strTemplate;
                    }
                }
            });
            $rootScope.modalPreview.result.then(function () {
                $scope.isLoad = true;
            }, function () {
                $scope.isLoad = true;
            });
        });

        // Report Publish text from HTML File

        //var modalInstance = $modal.open({
        //    templateUrl: 'partials/reportpreview.html',
        //    windowClass: 'app-modal-window',
        //    controller: 'formdataPreviewCtrl',
        //    resolve: {
        //        report: function () {
        //            return $scope.report;
        //        },
        //        reportdata: function () {
        //            return 'test';
        //        },
        //        closedreport: function () {
        //            return $scope.closedreport;
        //        },
        //        reportFlavor: function () {
        //            return '';
        //        },
        //        submittedreportcount: function () {
        //            return '';
        //        },
        //        chargeReport: function () {
        //            return '';
        //        },
        //        newReportStatus: function () {
        //            return '';
        //        },
        //        submitStatus: function () {
        //            return '';
        //        }
        //    }
        //});
        //modalInstance.result.then(function () {
        //    $scope.isLoad = true;
        //}, function () {
        //    $scope.isLoad = true;
        //});
    };

    /**
    * Extract custom Rfas data
    * @return Array of objects
    */
    $rootScope.rfaData = function () {
         
        var rfas = [];
        var i = 0;
        var list = $("[id^=treatmentData]");
        var lenList = list.length;
       
        for (i = 0; i < lenList; i++) {
            try {
                var obj = {};
                //check 
                if (list[i].id != "") {
                    //extracting each treatment data
                    var txt = $('#' + list[i].id).html();
                    var treatmenttext = $(txt).text();
                    var trimmedtext = treatmenttext.trim();
                    var finaltext = trimmedtext.replace(/\s\s+/g, ' ');
                    obj.publishtext = finaltext;

                    var servicetext = list[i].id.substr(13).trim();
                    var serhtml = $('#servicetext' + servicetext).html();
                    var sertext = $(serhtml).text();
                    var trimtext = sertext.trim();
                    var finalServiceText = trimtext.replace(/\s\s+/g, ' ');
                    obj.svctext = finalServiceText;

                    var headertext = {};
                    headertext.bodysystem = $('#bodysystem' + servicetext).val();
                    headertext.bdsides = $('#bdsides' + servicetext).val();
                    headertext.bdsystemother = $('#bdsystemother' + servicetext).val();
                    headertext.bdpartother = $('#bdpartother' + servicetext).val();
                    headertext.bdsides = headertext.bdsides.charAt(0).toUpperCase() + headertext.bdsides.slice(1);
                    headertext.bdtext = $('#bdtext' + servicetext).val();
                    headertext.selectnsaids = $('#selectnsaids' + servicetext).val();
                    //Following 2 lines added by Unais since selectnsaids for Durable Medical Equipment comes blank (dated 11th Feb,2016)
                    if (headertext.selectnsaids == '')
                        headertext.selectnsaids = trimtext;

                    obj.faxed = "No";
                    obj.status = "Pending";
                    obj.createdate = new Date();
                    obj.header = headertext;
                    obj.treatingPhysician = "";
                    obj.signingPhysician = "";
                    if (headertext.bodysystem == "Upper Extremity" || headertext.bodysystem == "Lower Extremity") {
                        obj.headertext = headertext.selectnsaids + " - " + headertext.bdtext + " - " + headertext.bdsides;
                        obj.bdtext_bdside = headertext.bdtext + " - " + headertext.bdsides;
                    }

                    if (headertext.bodysystem == "Spine") {
                        obj.headertext = headertext.selectnsaids + " - " + headertext.bdtext + " Spine";
                        obj.bdtext_bdside = headertext.bdtext + " - Spine";
                    }

                    if (headertext.bodysystem == "Skin") {
                        if (headertext.bdsides == "None") {
                            obj.headertext = headertext.selectnsaids + " - Skin - " + headertext.bdtext;
                            obj.bdtext_bdside = "Skin - " + headertext.bdtext;
                        } else {
                            obj.headertext = headertext.selectnsaids + " - Skin - " + headertext.bdtext + " - " + headertext.bdsides;
                            obj.bdtext_bdside = "Skin - " + headertext.bdtext + " - " + headertext.bdsides;
                        }
                    }
                    if (headertext.bodysystem == "Other") {
                       
                        if (headertext.bdsides == "N/a") {
                            obj.headertext = headertext.selectnsaids + " - " + headertext.bdsystemother.charAt(0).toUpperCase() + headertext.bdsystemother.slice(1) + " " + headertext.bdpartother.charAt(0).toUpperCase() + headertext.bdpartother.slice(1);
                            obj.bdtext_bdside = headertext.bdsystemother.charAt(0).toUpperCase() + headertext.bdsystemother.slice(1) + " " + headertext.bdpartother.charAt(0).toUpperCase() + headertext.bdpartother.slice(1);
                        } else {
                            obj.headertext = headertext.selectnsaids + " - " + headertext.bdsystemother.charAt(0).toUpperCase() + headertext.bdsystemother.slice(1) + " " + headertext.bdpartother.charAt(0).toUpperCase() + headertext.bdpartother.slice(1) + " - " + headertext.bdsides.charAt(0).toUpperCase() + headertext.bdsides.slice(1);
                            obj.bdtext_bdside = headertext.bdsystemother.charAt(0).toUpperCase() + headertext.bdsystemother.slice(1) + " " + headertext.bdpartother.charAt(0).toUpperCase() + headertext.bdpartother.slice(1) + " - " + headertext.bdsides.charAt(0).toUpperCase() + headertext.bdsides.slice(1);
                        }
                    }

                    obj.comments = [];
                    obj.treatingPhysician = $('#treatingPhysician' + servicetext).html();
                    obj.signingPhysician = $('#signingPhysician' + servicetext).html();
                    rfas.push(obj);

                }
            }
            catch (err) {
                //console.log(err.message);
            }
        }        
        return rfas;
    }

    $scope.showPreview = function (condition) {
         
        $scope.showReportCondition = condition;

    };
	
    
	
     //******************************************* athena code start **********************************
 // Athena changes
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
    
 	$scope.isAthenaPatient = function(){
 		debugger;
 		if($rootScope.currentUser.practiceDetails.isAthena){ 			
 			if(typeof $scope.athena_patient_id != 'undefined'){
 				if($scope.athena_patient_id == 0){
 	 				return false;
 	 			}else{
 	 				return true;
 	 			}
 			}else{
 				return false;
 			} 			
 		}else{
 			return false;
 		}
 	}
 
 
 	$scope.setPatientDataToAthena = function(){
 		
    	try{  		
	  		if($rootScope.currentUser.practiceDetails.isAthena){
	  			
	  			if(typeof $scope.report.data.bginfo.firstname == 'undefined' || typeof $scope.report.data.bginfo.lastname == 'undefined' || typeof $scope.report.data.bginfo.dateofbirth == 'undefined' ){
	  				var message="<h3><p>Patient's Firstname, lastname and Birthdate must be entered.</p></h3>";			
		  			$scope.PopupMessageSingleButton('',message,"Okay");
	  			}else{	  				
	  				$('#isAthenaUpdateSpinner').show();	  				
	  				$scope.athenaSpinnerMessage = 'Updating Patient details to Athena.';
	  					  				
	  				// get industry and occupation code.. but it returns data too late.. 
	  				$scope.getAthenaOccIndustryCode({},'toAthena');
		  		
		  			// ssn : jr ssn update kela tr 1st 5digit he zero jatil.tyamule athena mdhil original ssn replace hoil
		  	  			
		  			var query={}
		  	  		query.patientid 	= $scope.athena_patient_id;
		  	  		query.practiceid 	= $rootScope.currentUser.practiceDetails.athena_practiceid;
		  	  		query.departmentid  = $rootScope.currentUser.athena_departmentid;		  	  		
			  	  	
		  	  		//basic info
		  	  			query.firstname = checkValues('General', $scope.report.data.bginfo.firstname);
			  	  		query.lastname  = checkValues('General', $scope.report.data.bginfo.lastname);	
			  	  		query.sex		= checkValues('Gender', $scope.report.data.bginfo.gender);
				   	
			  	  	//address
					  	query.address1 = checkValues('General', $scope.report.data.bginfo.addressline1);	
					  	query.address2 = checkValues('General', $scope.report.data.bginfo.addressline2);	
					  	query.zip	   = checkValues('General', $scope.report.data.bginfo.zipcode);	
					  	query.city 	   = checkValues('General', $scope.report.data.bginfo.city);	
					  	query.state	   = checkValues('General', $scope.report.data.bginfo.state);	
					  	
					//contactinformation
					  	query.email	   = checkValues('General', $scope.report.data.bginfo.email);	
					  	query.homephone = checkValues('General', $scope.report.data.bginfo.homephone);	
			  			query.mobilephone = checkValues('General', $scope.report.data.bginfo.cellphone);
			  			
			  			query.workphone = checkValues('General', $scope.report.data.bginfo.workphone);
			  						  			
			  			var contactpreference =  checkValues('ContactPreference', $scope.report.data.bginfo.preferredcommunication);
			  			if(contactpreference != ''){
				  			query.contactpreference = contactpreference;
			  			}
			  			
			  			
			  		//social history : it must be in uppercase	
			  			var maritalstatusname = checkValues('General', $scope.report.data.sh.SHrdoMaritalStatus);
			  			if(maritalstatusname!=''){
			  				query.maritalstatus = maritalstatusname.charAt(0).toUpperCase();
			  			}
			  			
			  			
				  	 if(typeof $scope.report.data.bginfo.dateofbirth != 'undefined'){		
				  		 var dob = new Date($scope.report.data.bginfo.dateofbirth);		
				  		 
				  		 var day = dob.getDate() < 10 ? '0'+dob.getDate() : dob.getDate();
				  		 var month = dob.getMonth()+1;
				  		 	 month = month<10 ? '0'+month : month;
				  		 
				  		 var year = dob.getFullYear();
				  		 				  		
				  	  	 query.dob = month+"/"+day+"/"+year;
				  	 }		  	  	
				  	 
				  	
			    	$http.put('/api/athena/syncpatienttoathena',query).success(function (athenaPatient, status, headers, config) {
			 			 
			    		$('#isAthenaUpdateSpinner').hide();
			    		$scope.athenaSpinnerMessage = '';
			    		
			    		var codeQuery={}
			    		codeQuery.patientid 	 = $scope.athena_patient_id;
			    		codeQuery.practiceid 	 = $rootScope.currentUser.practiceDetails.athena_practiceid;
			    		codeQuery.departmentid   = $rootScope.currentUser.athena_departmentid;		
			    		codeQuery.occupationcode = checkValues('General', $scope.codeName.occupationCode);
					  	codeQuery.industrycode   = checkValues('General', $scope.codeName.industryCode);

			    		// update following from  $scope.getAthenaOccIndustryCodeAgainstName
						$http.put('/api/athena/syncpatienttoathena',codeQuery).success(function (athenaPatientCodeUpdate, status, headers, config) {
				 			
				 		 }).catch(function (err) {
					  			console.log(err);
				  	     })
			    		
			 			 if(athenaPatient.updatedpatient.length>0){
			 				 
			 				if($scope.injuryData.athena_insurancepackageid == 0){
			 					$('#isAthenaUpdateSpinner').hide();  				
			 					$scope.athenaSpinnerMessage = '';			 				
				 				var message="<h3><p>Patient with patient id '" + $scope.athena_patient_id + "' was synced successfully.</p><p>However, there is no insurance information associated with this patient in Athena. To add workers’ compensation insurance information, please go to the patient’s chart in Athena, scroll down to the “Insurance” section, and click “Add case policy.”</p><p>After adding the details of the workers’ compensation case policy, you can import the injury from Athena to RateFast.</p></h3>";			
					  			$scope.PopupMessageSingleButton('',message,"Okay");	
					  			
			 				}else{
			 					$('#isAthenaUpdateSpinner').show();
					  			$scope.athenaSpinnerMessage = 'Updating Insurance details to Athena.';
					  			
					  			//here update insurance data to athena
					  			$scope.getDetailsAthenaInsuranceData('toAthena');
			 				}
			 				
			 			 }else{
			 				var message="<h3><p>Patient synced fail.</p></h3>";			
				  			$scope.PopupMessageSingleButton('',message,"Okay");
			 			 }
			 				
			 		 }).catch(function (err) {
				  			
				  			console.log(err);
				  			$('#isAthenaUpdateSpinner').hide();
				  			var message="<h3><p>Technical Error : </p></h3> <h3><p>"+ err.data +"</p></h3>";			
				  			$scope.PopupMessageSingleButton('',message,"Okay");			  			
			  	    }).finally(function () {
			  	    
			  	    });	    		    	
	    	}
    	  }
	    }catch(err){
	    	$('#isAthenaUpdateSpinner').hide();
	    	$scope.athenaSpinnerMessage = '';
	    	console.log(err);
	    }
    }
    
    
    
    $scope.getUpdatedAthenaPatientData = function(){
    	// this update data into ratefast from athena
  		try{  		
	  		if($rootScope.currentUser.practiceDetails.isAthena){
	  		
	  			$('#isAthenaUpdateSpinner').show();  				
  				$scope.athenaSpinnerMessage = 'Fetching Patient details from Athena.';
  				
	  			var query={}
	  				  			
              	query.patientid = $scope.athena_patient_id;
	  	  		query.practiceid = $rootScope.currentUser.practiceDetails.athena_practiceid;
	  	  		query.departmentid = $rootScope.currentUser.athena_departmentid;
              		          		 
              	$http.get('/api/athena/getpatientByID',{ params : query }
              		).success(function(patinetdata){
              			
              			$http.get('/api/athena/patientmedicalsocialdata',{ params : query }
                  		).success(function(allergypatinetdata){
                  			//update medical data to ratefast
                  			$scope.report.data.relevantmedicalsocialhistory.shknownallergiesothertext = allergypatinetdata.alleriesdata.medicalData;	                  			
                  			
                  			//update social data  to ratefast
                  			if(typeof allergypatinetdata.alleriesdata.socialData !='undefined'){
                  				if(allergypatinetdata.alleriesdata.socialData !='' && allergypatinetdata.alleriesdata.socialData !=null){
                  					$scope.report.data.sh.chkTobacco = [allergypatinetdata.alleriesdata.socialData];
                  					$scope.report.data.sh.chkCaffeineNegative = [];                  					
                  				}
                  			}
                  			
                  		}).catch(function (err) {	              			
                			console.log("Error fetching medical / social data from Athena");
                  	    })
              			
              			// update all patient data
              			updatefromAthenatoRatefast(patinetdata.PatientDetail[0]);	
              			
              		}).catch(function (err) {	              			
              			$('#isAthenaUpdateSpinner').hide();  				
          				$scope.athenaSpinnerMessage = '';
          				
              			var message="<h3><p>Technical Error : </p></h3> <h3><p>"+ err.data +"</p></h3>";			
			  			$scope.PopupMessageSingleButton('',message,"Okay");		
              	    }).finally(function () {
              	                 	    
              	    });	
	  			
	  			}	  			
	    }catch(err){
	    	$('#isAthenaUpdateSpinner').hide();  				
			$scope.athenaSpinnerMessage = '';
	    	console.log(err);
	    }
  	}
    
    var updatefromAthenatoRatefast = function(athenaPatientData){
    	
    	try{
    	
    	//basicinformation
			$scope.report.data.bginfo.firstname = athenaPatientData.firstname;		 						
	  		$scope.report.data.bginfo.lastname = athenaPatientData.lastname;
	  		$scope.report.data.bginfo.dateofbirth = athenaPatientData.dob;
						
			if(athenaPatientData.sex=='M'){
				$scope.report.data.bginfo.gender = 'Male';
			}else{
				$scope.report.data.bginfo.gender = 'Female';
			}
		
			//address		 				  		
			$scope.report.data.bginfo.addressline1 = checkValues('General', athenaPatientData.address1);
			$scope.report.data.bginfo.addressline2  = checkValues('General', athenaPatientData.address2);
			$scope.report.data.bginfo.zipcode = checkValues('General', athenaPatientData.zip);
			$scope.report.data.bginfo.city  = checkValues('General', athenaPatientData.city);
			$scope.report.data.bginfo.state  = checkValues('General', athenaPatientData.state);
		
			//contactinformation
			$scope.report.data.bginfo.email  = checkValues('General', athenaPatientData.email);
													 					
			if(typeof athenaPatientData.contactpreference != 'undefined'){
				if(athenaPatientData.contactpreference == 'HOMEPHONE'){			
					$scope.report.data.bginfo.preferredcommunication = 'Home phone';
				}else if(athenaPatientData.contactpreference == 'CELLPHONE'){			
					$scope.report.data.bginfo.preferredcommunication = 'Cell phone';
				}
			}
					
	//social history
			if(typeof athenaPatientData.maritalstatusname != 'undefined'){
				if(athenaPatientData.maritalstatusname.length>0){
					var maritalstatustext = athenaPatientData.maritalstatusname.toLowerCase();
									
					$scope.report.data.sh.SHrdoMaritalStatus = maritalstatustext.charAt(0).toUpperCase() + maritalstatustext.slice(1);	
				}			
			}
			 
			// call here save button function or change the section to reflect chnages 
			
			
			//update insurance to ratefast

			
			if($scope.injuryData.athena_insurancepackageid == 0){
				$('#isAthenaUpdateSpinner').hide();  				
				$scope.athenaSpinnerMessage = '';
			
				var message="<h3><p>Patient with patient id '" + $scope.athena_patient_id + "' was synced successfully.</p><p>However, there is no insurance information associated with this patient in Athena. To add workers’ compensation insurance information, please go to the patient’s chart in Athena, scroll down to the “Insurance” section, and click “Add case policy.”</p><p>After adding the details of the workers’ compensation case policy, you can import the injury from Athena to RateFast.</p></h3>";
				$scope.PopupMessageSingleButton('',message,"Okay");		
				
				//athena section change
                setTimeout(function(){ athenaSectionChange(); }, 2000);				
			}else{
				 $('#isAthenaUpdateSpinner').show();  				
				 $scope.athenaSpinnerMessage = 'Fetching Insurance details from Athena.';				 
				 $scope.getDetailsAthenaInsuranceData('toRatefast');
			}
			 
				
    	}catch(err){
    		var message="<h3><p>Technical Error : </p></h3> <h3><p>"+ err +"</p></h3>";			
			$scope.PopupMessageSingleButton('',message,'Okay');
    	}
    }
    
	function athenaSectionChange(){        
       if($rootScope.currentsectionId == 'bginfo'){
            var section = {
                    class: "",
                    index: 2,
                    sectiondataid: "selectinjuries",
                    sectionid: "",
                    sectionname: "Injured Body System(s)",
                    type: "section",
                    visiblity: true
                }
             $scope.currentsectionchange(section, 1, 'selectinjuries');
       }else{            
            var section = {
                    class: "",
                    index: 1,
                    sectiondataid: "bginfo",
                    sectionid: "",
                    sectionname: "Background Information",
                    type: "section",
                    visiblity: true
                }
            $scope.currentsectionchange(section, 0, 'bginfo');
       }        
   }
    
    $scope.getDetailsAthenaInsuranceData = function(modeOfUpdate){
	 	 if($rootScope.currentUser.practiceDetails.isAthena){			

			$('#isAthenaUpdateSpinner').show(); 		
			 
  			var query={}
  				  			
          	query.patientid = $scope.athena_patient_id;
  	  		query.practiceid = $rootScope.currentUser.practiceDetails.athena_practiceid;
  	  		query.departmentid = $rootScope.currentUser.athena_departmentid;
			 			 
			 $http.get('/api/athena/getinjurydetails', { params: query
				}).success(function (athenaInjuryData, status, headers, config) {			
					try{								
						
						if(typeof athenaInjuryData != 'undefined'){				
							if(typeof athenaInjuryData.athenaInjury != 'undefined'){								
								if(typeof athenaInjuryData.athenaInjury.insurances != 'undefined'){
									if(athenaInjuryData.athenaInjury.insurances.length>0){										
											var blnInsurancePresent = false;
											var countInsurance = 0;							
											var indexOfInsurance = null;
											athenaInjuryData.athenaInjury.insurances.forEach(function( item, index ){																	
												countInsurance++;
												
												if($scope.injuryData.athena_insurancepackageid == item.insurancepackageid){														
													blnInsurancePresent = true;
													indexOfInsurance = index;																					
												}										
										});		
											
										if(countInsurance == athenaInjuryData.athenaInjury.insurances.length){											
												if(blnInsurancePresent ==false){
													$('#isAthenaUpdateSpinner').hide();
													$scope.athenaSpinnerMessage = '';
													var message="<h3><p>Patient with patient id '" + $scope.athena_patient_id + "' was synced successfully.</p><p>However, there is no insurance information associated with this patient in Athena. To add workers’ compensation insurance information, please go to the patient’s chart in Athena, scroll down to the “Insurance” section, and click “Add case policy.”</p><p>After adding the details of the workers’ compensation case policy, you can import the injury from Athena to RateFast.</p></h3>";										
										  			$scope.PopupMessageSingleButton('',message,'Okay');	
													//athena section change
													setTimeout(function(){ athenaSectionChange(); }, 2000);				
										  			
												}else{
													if(modeOfUpdate=='toAthena'){															
														
														$scope.sendInsuranceDataToAthena(athenaInjuryData.athenaPatient,athenaInjuryData.athenaInjury.insurances[indexOfInsurance]);
													
													}else if(modeOfUpdate=='toRatefast'){														
														$scope.getAthenaOccIndustryCode(athenaInjuryData.athenaPatient[0],modeOfUpdate);															
														$scope.getAthenaInsuranceDataForUpdate(athenaInjuryData.athenaPatient[0],athenaInjuryData.athenaInjury.insurances[indexOfInsurance]);
													
													}else if(modeOfUpdate=='toPhoneNumber'){
														$scope.getUpdatedAthenaInjuryPhoneNumbers(athenaInjuryData.athenaPatient,athenaInjuryData.athenaInjury.insurances[indexOfInsurance]);
													}
												}																			
										}	
									}else{	
										$('#isAthenaUpdateSpinner').hide();
										$scope.athenaSpinnerMessage = '';
										var message="<h3><p>Patient with patient id '" + $scope.athena_patient_id + "' was synced successfully.</p><p>However, there is no insurance information associated with this patient in Athena. To add workers’ compensation insurance information, please go to the patient’s chart in Athena, scroll down to the “Insurance” section, and click “Add case policy.”</p><p>After adding the details of the workers’ compensation case policy, you can import the injury from Athena to RateFast.</p></h3>";										
							  			$scope.PopupMessageSingleButton('',message,'Okay');	
										//athena section change
										setTimeout(function(){ athenaSectionChange(); }, 2000);				
									}
								}			
							}		
						}			
					}catch(err){
						$('#isAthenaUpdateSpinner').hide();
						$scope.athenaSpinnerMessage = '';
						var message="<h3><p>Technical Error : </p></h3> <h3><p>"+ err +"</p></h3>";			
						$scope.PopupMessageSingleButton('',message,'Okay');
					}		
				})	
				.catch(function (err) {					
					$('#isAthenaUpdateSpinner').hide();
					$scope.athenaSpinnerMessage = '';
					console.log(err)
					var message="<h3><p>Technical Error : </p></h3> <h3><p>"+ err.data +"</p></h3>";			
					$scope.PopupMessageSingleButton('',message,'Okay');
				})
				.finally(function(){			
							
				})		 	
		 }				 
	 }
    

    $scope.getAthenaInsuranceDataForUpdate = function(athenaPatientData,athena_injury){		
    	//update from athena to ratefast
    	try{    	
			
		// insurance details update 
			
			//employer section
			
			//employer
             	$scope.report.data.bginfo.company = athena_injury.insurancepolicyholder;	
				
			//empolyeraddress
				$scope.report.data.bginfo.emp_address1 = athena_injury.insurancepolicyholderaddress1;
				$scope.report.data.bginfo.emp_city = athena_injury.insurancepolicyholdercity;
				$scope.report.data.bginfo.emp_state = athena_injury.insurancepolicyholderstate;
				$scope.report.data.bginfo.emp_zipcode = athena_injury.insurancepolicyholderzip;
				
				
		// Admin section
	
			//insurance								
				$scope.report.data.bginfo.insurance_claimsadministrator = athena_injury.insuranceplanname;
				$scope.report.data.bginfo.insurance_claimsnumber = athena_injury.insuranceclaimnumber;
					
			//claim adjuster									
				$scope.report.data.bginfo.claimsadjuster_firstname = athena_injury.adjusterfirstname;
				$scope.report.data.bginfo.claimsadjuster_lastname = athena_injury.adjusterlastname;
					
		
				 if(typeof athena_injury.caseinjurydate != 'undefined'){
					 if(athena_injury.caseinjurydate != ''){
						 if(athena_injury.caseinjurydate != null){										 
							 $scope.report.data.bginfo.dateofinjury = athena_injury.caseinjurydate;
							
							// set time 12.00 AM
							 
							 var tempDate = new Date(athena_injury.caseinjurydate);
							 tempDate.setHours(0,0,0);	
							 $scope.report.data.bginfo.timeofinjury = tempDate;							
						 } 
					 }
				 }
					 							
				
				$('#isAthenaUpdateSpinner').hide();
				$scope.athenaSpinnerMessage = '';
				
				var message="<h3><p>Patient and Insurance data for patient id '" + $scope.athena_patient_id + "' were synced successfully.</p></h3>";
				
				$scope.PopupMessageSingleButton('',message,"Okay"); 
				//athena section change
                setTimeout(function(){ athenaSectionChange(); }, 2000);				
						    
    	}catch(err){
    		console.log(err);

			$('#isAthenaUpdateSpinner').hide();
			$scope.athenaSpinnerMessage = '';
			
    		var message="<h3><p>Technical Error : </p></h3> <h3><p>"+ err +".</p></h3>";			
			$scope.PopupMessageSingleButton('',message,'Okay');
			
    	}		
 	}
    
       
    //get occupation and industry code
    $scope.getAthenaOccIndustryCode = function(athenaPatient,updateMode){    	
    	try{	
    		$scope.codeName={}    		
    		$scope.codeName.industryCode = '';
    		$scope.codeName.occupationCode = '';
    		
    		$http.get('/api/athena/ratefast/getAthenaCode').success(function (codeData, status, headers, config) {
		
    			if(updateMode == 'toRatefast'){
    				if(typeof athenaPatient.industrycode != 'undefined'){
    		 			if(athenaPatient.industrycode != null && athenaPatient.industrycode !=''){    		 			
			 				for (var key in codeData.codeDetails.industry[0]){
					 			if(key == athenaPatient.industrycode){			 				 										 			
					 				$scope.report.data.bginfo.natureofbusiness = 'Other';
					 				$scope.report.data.bginfo.othernatureofbusiness = codeData.codeDetails.industry[0][key];
						 			break;
					 			}
					 		} 				
    		 			}		 				
    		 		}
    				if(typeof athenaPatient.occupationcode != 'undefined'){
    		 			if(athenaPatient.occupationcode != null && athenaPatient.occupationcode !=''){    		 			
		 					for (var key in codeData.codeDetails.occupation[0]){			 		
					 			if(key == athenaPatient.occupationcode){	
					 				$scope.report.data.bginfo.jobtitle = codeData.codeDetails.occupation[0][key];
						 			break;
					 			}
					 		}    		 					 			
    		 			}		 				
    		 		}
    				
    			}else if(updateMode == 'toAthena'){    				
    				//this used to 
    	    		var codeDetails={};
    				codeDetails.industrycode = checkValues('General',  $scope.report.data.bginfo.othernatureofbusiness);
    				codeDetails.occupationcode = checkValues('General',  $scope.report.data.bginfo.jobtitle);
    				
					if(codeDetails.industrycode!=''){
						for (var key in codeData.codeDetails.industry[0]){
				 			if(codeData.codeDetails.industry[0][key] == codeDetails.industrycode){			 				 				
				 				$scope.codeName.industryCode = key;
					 			break;
				 			}
				 		}
					}
					
					if(codeDetails.occupationcode!=''){
						for (var key in codeData.codeDetails.occupation[0]){			 		
				 			if(codeData.codeDetails.occupation[0][key] == codeDetails.occupationcode){				 								 		
				 				$scope.codeName.occupationCode = key;				 			
					 			break;
				 			}
				 		}
					}					
    			}
			}).catch(function (err) {			
				console.log(err);
				//var message="<h3><p>Technical Error : </p></h3> <h3><p>"+ err.data +"</p></h3>";			
				//$scope.errorPopup('',message,'Ok');
			})	
    	}catch(err){
    		console.log("getAthenaOccIndustryCode : "+ err);
    	}	
    }
    
    
    $scope.sendInsuranceDataToAthena = function(athena_patient,athena_injury){
		 
		 //aata occ code n industry code rahila fakt... 
		 
		 try{  													  		
	  			var query={}
	  			query.patientid = $scope.athena_patient_id;
		  		query.practiceid = $rootScope.currentUser.practiceDetails.athena_practiceid;
		  		query.departmentid = $rootScope.currentUser.athena_departmentid;
	  	  		query.insuranceid = athena_injury.insuranceid;
		  	  		  	  		
	  	  	//employer section
			
	  	  		if(typeof $scope.report.data.bginfo.company !='undefined'){
	  	  			if($scope.report.data.bginfo.company !='' && $scope.report.data.bginfo.company != null){

	  					//employer
	  		  	  		query.insurancepolicyholder =  checkValues('General', $scope.report.data.bginfo.company);
	  	  				query.insuredentitytypeid = '2';
			  	  		query.relationshiptoinsuredid = '12';		  	  		
	  	  			}
	  	  		}
	  	  			  	  	
	  	  		//empolyeraddress	
	  	  		query.insurancepolicyholderaddress1 = checkValues('General', $scope.report.data.bginfo.emp_address1);
	  	  		query.insurancepolicyholdercity = checkValues('General', $scope.report.data.bginfo.emp_city);	
	  	  		query.insurancepolicyholderstate = checkValues('General', $scope.report.data.bginfo.emp_state);
	  	  		query.insurancepolicyholderzip = checkValues('General', $scope.report.data.bginfo.emp_zipcode);
	  	  			  	  			  	  		
				//insurance								
			 	query.insuranceplanname = checkValues('General', $scope.report.data.bginfo.insurance_claimsadministrator);
			 	query.insuranceclaimnumber = checkValues('General', $scope.report.data.bginfo.insurance_claimsnumber);
			  	 
				//claim adjuster
			  	query.adjusterfirstname = checkValues('General', $scope.report.data.bginfo.claimsadjuster_firstname);
			  	query.adjusterlastname = checkValues('General', $scope.report.data.bginfo.claimsadjuster_lastname);
							  
			  	query.adjusterphone = checkValues('General', $scope.report.data.bginfo.claimsadjuster_telephoneno);
			  	query.adjusterfax = checkValues('General', $scope.report.data.bginfo.claimsadjuster_fax);
			  	
			  	try
               {
                   if(typeof $scope.report.data.bginfo.dateofinjury != 'undefined'){                  
                     var dob = new Date($scope.report.data.bginfo.dateofinjury);                         
                     
                     var day = dob.getDate() < 10 ? '0' + dob.getDate() : dob.getDate();
                     var month = dob.getMonth() + 1;
                     month = month <10 ? '0' + month : month;
                     
                     var year = dob.getFullYear();
                                                                                                                   
                     query.caseinjurydate = month + "/" + day + "/" + year;
                   }                          
               }catch(err)
               { 
            	   
               }
			 
               $http.put('/api/athena/updateInsuranceDatatoAthena',query).success(function (athenaPatient, status, headers, config) {
		 					    		
		    		$('#isAthenaUpdateSpinner').hide();	
		    		$scope.athenaSpinnerMessage = '';
		 			var message="<h3><p>Patient and Insurance data for patient id '" + $scope.athena_patient_id + "' were synced successfully.</p></h3>";			
			  		$scope.PopupMessageSingleButton('',message,"Okay");
		    				 			 											 				
		 		 }).catch(function (err) {			  			
			  			console.log(err);
			  			$('#isAthenaUpdateSpinner').hide();
			  			$scope.athenaSpinnerMessage = '';
			  			//var message="<h3><p>Technical Error : </p></h3> <h3><p>"+ err.data +"</p></h3>";
			  			
			  			var message="<h3><p>Patient data with patient id '" + $scope.athena_patient_id + "' was synced successfully.</p> <p> But an error occurred to save Insurance data. If the issue persists, please contact the help desk or enter the information manually.</p></h3>";
			  			$scope.PopupMessageSingleButton('',message,'Okay');			  			
		  	    }).finally(function () {												  	    
		  	    });												  		
		 }catch(err){
			 $('#isAthenaUpdateSpinner').hide();
			 $scope.athenaSpinnerMessage = '';
			console.log(err);
			var message="<h3><p>Patient data with patient id '" + $scope.athena_patient_id + "' was synced successfully.</p> <p> But an error occurred to save Insurance data. If the issue persists, please contact the help desk or enter the information manually.</p></h3>";
  			$scope.PopupMessageSingleButton('',message,'Okay');		
		 }
	 }
    
    
    $scope.getUpdatedAthenaPatientPhoneNumbers = function(){
    	
    	
        //this function used to only update athena patient phone numbers in ratefast..
        try{          
               if($rootScope.currentUser.practiceDetails.isAthena){
            	   $('#isAthenaUpdateSpinner').show();
            	   $scope.athenaSpinnerMessage = 'Fetching Patient phone numbers from Athena.';
      			 
                   var query = {};
                   query.patientid = $scope.athena_patient_id;
				   query.practiceid = $rootScope.currentUser.practiceDetails.athena_practiceid;
				   query.departmentid = $rootScope.currentUser.athena_departmentid;
			                    
                   $http.get('/api/athena/getpatientByID',{ params : query }
                       ).success(function(patinetdata){
                           
                           var phoneValues = {};
                           phoneValues.homephone = checkValues('General', patinetdata.PatientDetail[0].homephone); 
                           phoneValues.mobilephone = checkValues('General', patinetdata.PatientDetail[0].mobilephone);
                           phoneValues.workphone = checkValues('General', patinetdata.PatientDetail[0].workphone);
                           
                           $('#isAthenaUpdateSpinner').hide();
                    	   $scope.athenaSpinnerMessage = '';
                           
                           if(phoneValues.homephone =='' && phoneValues.mobilephone == '' && phoneValues.workphone == ''){
                               var message="<h3><p>Homephone, Mobilephone and Workphone does not exist for patient "+$scope.athena_patientid+" in athena to update</p></h3>";            
                               $scope.PopupMessageSingleButton('',message,"Okay");    
                               
                               if($scope.injuryData.athena_insurancepackageid != 0){
                            	   $('#isAthenaUpdateSpinner').show();  				
                            	   $scope.athenaSpinnerMessage = 'Fetching Insurance phone numbers from Athena.';				 
                            	   $scope.getDetailsAthenaInsuranceData('toPhoneNumber');		
                    			}
                               
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
                                             $scope.report.data.bginfo.homephone  = returndata.homephone;
                                             $scope.report.data.bginfo.cellphone  = returndata.mobilephone;
                                             $scope.report.data.bginfo.workphone  = returndata.workphone;
                                             $scope.report.data.bginfo.extension  = returndata.workphoneExtension;
											                     
                                             
                                             
                                             if($scope.injuryData.athena_insurancepackageid == 0){
                                 				$('#isAthenaUpdateSpinner').hide();  				
                                 				$scope.athenaSpinnerMessage = '';
                                 			
                                 				var message="<h3><p>Patient with patient id '" + $scope.athena_patient_id + "' was synced successfully.</p><p>However, there is no insurance information associated with this patient in Athena. To add workers’ compensation insurance information, please go to the patient’s chart in Athena, scroll down to the “Insurance” section, and click “Add case policy.”</p><p>After adding the details of the workers’ compensation case policy, you can import the injury from Athena to RateFast.</p></h3>";
                                 				$scope.PopupMessageSingleButton('',message,"Okay");
                                                //athena section change
												setTimeout(function(){ athenaSectionChange(); }, 2000);
												
                                 			}else{
                                 				 $('#isAthenaUpdateSpinner').show();  				
                                 				 $scope.athenaSpinnerMessage = 'Fetching Insurance phone numbers from Athena.';				 
                                 				 $scope.getDetailsAthenaInsuranceData('toPhoneNumber');
                                 			}
                                            
                                         }
                                     }, function (err) {
                                         debugger;
                                         // model failed
                                         console.log('err : ' + err);          
                                     });
                               
                           }
                               
                       }).catch(function (err) {                              
                    	   $('#isAthenaUpdateSpinner').hide();  				
            			   $scope.athenaSpinnerMessage = '';
                           var message="<h3><p>Technical Error : </p></h3> <h3><p>"+ err.data +"</p></h3>";            
                           $scope.PopupMessageSingleButton('',message,"Okay");        
                       }).finally(function () {
                                            
                       });                          
               }
            }catch(err){
                console.log(err);
                $('#isAthenaUpdateSpinner').hide();  				
 				$scope.athenaSpinnerMessage = '';
        }
     }
 	
 	$scope.getUpdatedAthenaInjuryPhoneNumbers = function(patientData,injuryData){
        //this function used to only update athena patient phone numbers in ratefast..
 	   	   
        try{          					   			 	  				 
 			 var phoneValues = {};
 				  phoneValues.employerContact = checkValues('General', patientData[0].employerphone); 
 				  phoneValues.adjusterPhone = checkValues('General', injuryData.adjusterphone);
 				  phoneValues.adjusterFax = checkValues('General', injuryData.adjusterfax);
 				  				   				 
	          	   $('#isAthenaUpdateSpinner').hide();
	          	   $scope.athenaSpinnerMessage = '';

 				  if(phoneValues.employerContact =='' && phoneValues.adjusterPhone == '' && phoneValues.adjusterFax == ''){
 					  var message="<h3><p>Employer Contact, Adjuster Phone and Adjuster Fax does not exist for patient " + $scope.athena_patientid +" in athena to update</p></h3>";            
 					  $scope.PopupMessageSingleButton('',message,"Okay");    
 				  }else{                                      
 					   $rootScope.modalInstance = $modal.open({
 							  templateUrl: 'partials/athena/athena-InjuryPhonePopup.html',
 							  controller: 'athenaInjuryPhonePopupCtrl',
 								resolve: {        
 								  phoneData: function () {
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
 									
 									//$scope.injurydata.employercontact[0].employercontact_telephoneno  = returndata.employerContact;
 									$scope.report.data.bginfo.claimsadjuster_telephoneno  = returndata.adjusterPhone;
 									$scope.report.data.bginfo.claimsadjuster_extension = returndata.adjusterPhoneExtension;
 									$scope.report.data.bginfo.claimsadjuster_fax  = returndata.adjusterFax; 					
 									
 									var message="<h3><p>Patient and Insurance phone numbers were synced successfully.</p></h3>";			
 							  		$scope.PopupMessageSingleButton('',message,"Okay");
									//athena section change
									setTimeout(function(){ athenaSectionChange(); }, 2000);				
 								}
 							}, function (err) {
 								debugger;
 								// model failed
 								console.log('err : ' + err);          
 							}); 					  
 			}                        		
         }
        catch(err){
                console.log(err);
                $('#isAthenaUpdateSpinner').hide();
	            $scope.athenaSpinnerMessage = '';
        }
     }
    
 	// end
 	

  	function formatAthenaPhoneNumbers(phnNumber){  		
  		var returnNumber = '';
  		try{
  			if(typeof phnNumber != 'undefined'){
	  		  if(phnNumber != null && phnNumber != ''){		
	  			  var str = phnNumber;
	  			  var num  = str.toString().replace( /\D+/g, '');
	  			
	  			  if(num != null && num !=''){
	  				  if(num.length > 1){	
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
    
    
    
    $scope.PopupMessageSingleButton= function(id,message,buttonName){
		 debugger;
	     var messge="<h3><p>"+message+"</p></h3>"
	       $rootScope.modalInstance = $modal.open({
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
    
    $scope.athenaMedication = function () {
    	
    	// same things on patient-demographics
    	// patient.js
    	try{

	    	$('#isSpinnerAthenaMedication').show();
	
	    	var query={}    	
	  		query.athena_patientid = $sessionStorage.athena_patient_id;
	  		query.athena_practiceid = $rootScope.currentUser.practiceDetails.athena_practiceid;
	  		query.athena_departmentid = $rootScope.currentUser.athena_departmentid;
	  		
	  		if(query.athena_practiceid!=0 && query.athena_departmentid!=0){
	  		  		
		  		$http.get('/api/athena/medications', { params: query }).success(function (athenaMedicationdetails, status, headers, config) {
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
		    		        $rootScope.modalInstance = $modal.open({
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
		    		            
		    		        });	            		    	 
		  		}).catch(function (err) {			  			
		  			var message="<h3><p>Technical Error : </p></h3> <h3><p>"+ err.data +"</p></h3>";            
                    $scope.PopupMessageSingleButton('',message,"Okay");
		  			//for athena query : used err.data... it handle from backend
		  			console.log(err.data);
		  	    }).finally(function () {
		  	    	$('#isSpinnerAthenaMedication').hide();
		  	    });	
	  		}else{
	  			$('#isSpinnerAthenaMedication').hide();
	  		}  		
    	}catch(err){
    		$('#isSpinnerAthenaMedication').hide();
    		console.log(err);
    	}
   }
    
  
    
    //***************************************Athena code end********************************
	

    $scope.selectBodypartUpdate = function (text) {
        var template = 'partials/template_demo.html';
        $rootScope.modalInstance = $modal.open({
            templateUrl: template,
            windowClass: 'app-modal-window',
            controller: 'bdpartupdateCtrl',
            resolve: {
                text: function () {
                    return 'acceptedbodyparts';
                },
                injuryId: function () {
                    return $sessionStorage.InjuryId;
                }
            }
        });
        $rootScope.modalInstance.result.then(function (injuredbodypart) {
             
            //$cookieStore.put('isBdpart', true);
            selectinjuriesPatientdata.query({ injuryid: $sessionStorage.InjuryId }, function (injuryData) {
                $scope.injuryData = injuryData[0];
            }).$promise.then(function (injuryData) {
                 
                $scope.bodyParts = [];
                $scope.bodypartSide = [];
                $scope.bodypartMechanism = [];
                $scope.bodypartOther = [];
                $scope.bodysystemOther = [];
                $scope.mechanismOther = [];
                $scope.bdmechanismother = [];
                $scope.bdmechanism = [];
                for (var i = 0; i < injuryData[0].selectinjuries[0].injury[0].injurydata.acceptedbodyparts.length; i++) {
                    if (injuryData[0].selectinjuries[0].injury[0].injurydata.acceptedbodyparts[i].status == 'current') {
                        var injuredPartid = injuryData[0].selectinjuries[0].injury[0].injurydata.acceptedbodyparts[i];
                    }
                }
                $scope.selectedArray = [];
                $scope.bodypartPreview = [];
                if (injuredPartid != '') {
                    for (var i = 0; i < injuredPartid.injuredbodypart.length; i++) {
                        $scope.bodyParts[i] = angular.fromJson(injuredPartid.injuredbodypart[i].bodypart);
                        $scope.bodypartSide[i] = injuredPartid.injuredbodypart[i].bodypartsides;
                        $scope.bodypartMechanism[i] = injuredPartid.injuredbodypart[i].bodypart_mechanism;

                        /*
						*shridhar
						*bodypartDateOfRating,bodypartRateBodypart, ratebodyYesNoRadio this part used for MMI rate body
						*/

                        var bodypartDateOfRating = '';
                        var bodypartRateBodypart = false;
                        var ratebodyYesNoRadio = 'No';

                        try {
                            if (typeof injuredPartid.injuredbodypart[i].dateOfRating != 'undefined' && injuredPartid.injuredbodypart[i].dateOfRating != '' && injuredPartid.injuredbodypart[i].dateOfRating != null) {
                                bodypartDateOfRating = injuredPartid.injuredbodypart[i].dateOfRating;
                                bodypartRateBodypart = injuredPartid.injuredbodypart[i].ratebodypart;
                                ratebodyYesNoRadio = injuredPartid.injuredbodypart[i].ratebodyYesNoRadio;
                            }
                        } catch (err) {
                            //console.log(err);
                        }

                        if (injuredPartid.injuredbodypart[i].otherBodyparts) {
                            $scope.bodypartOther[i] = injuredPartid.injuredbodypart[i].otherBodyparts;
                        } else {
                            $scope.bodypartOther[i] = '';
                        }
                        if (injuredPartid.injuredbodypart[i].otherBodysystem) {
                            $scope.bodysystemOther[i] = injuredPartid.injuredbodypart[i].otherBodysystem;
                        } else {
                            $scope.bodysystemOther[i] = '';
                        }
                        if (injuredPartid.injuredbodypart[i].bodypart_mechanism == 'Other') {
                            $scope.bdmechanismother[i] = injuredPartid.injuredbodypart[i].otherbodypart_mechanismshowmodel;
                            $scope.bdmechanism[i] = injuredPartid.injuredbodypart[i].bdmechanism;
                        } else {
                            $scope.bdmechanismother[i] = '';
                            $scope.bdmechanism[i] = '';
                        }
                        $scope.selectedArray.push(($scope.merge($scope.bodyParts[i], { bdsides: $filter('lowercase')($scope.bodypartSide[i]) }, { bdmechanism: $scope.bodypartMechanism[i] }, { bdpartother: $scope.bodypartOther[i] }, { bdsystemother: $scope.bodysystemOther[i] }, { bdmechanism: $scope.bdmechanism[i] }, { bdmechanismother: $scope.bdmechanismother[i] }, { 'dateOfRating': bodypartDateOfRating }, { 'ratebodypart': bodypartRateBodypart }, { 'ratebodyYesNoRadio': ratebodyYesNoRadio })));
                        //setting concated bodypartid for Report preview
                        var concatedBodypartId;

                        if ($scope.bodyParts[i].id == 'other') {
                            if ($scope.bodypartSide[i] == 'N/A') {
                                concatedBodypartId = $scope.bodysystemOther[i] + $scope.bodypartOther[i];
                            } else {
                                concatedBodypartId = $scope.bodysystemOther[i] + $scope.bodypartOther[i] + $filter('lowercase')($scope.bodypartSide[i]);
                            }
                        } else {
                            if ($scope.bodypartSide[i] == 'None') {
                                concatedBodypartId = $scope.bodyParts[i].id;
                            } else {
                                concatedBodypartId = $scope.bodyParts[i].id + $filter('lowercase')($scope.bodypartSide[i]);
                            }
                        }

                        $scope.bodypartPreview.push(($scope.merge($scope.bodyParts[i], { bdsides: $filter('lowercase')($scope.bodypartSide[i]) }, { bdmechanism: $scope.bodypartMechanism[i] }, { bdpartother: $scope.bodypartOther[i] }, { bdsystemother: $scope.bodysystemOther[i] }, { bdmechanismother: $scope.mechanismOther[i] }, { concateId: concatedBodypartId }, { 'dateOfRating': bodypartDateOfRating }, { 'ratebodypart': bodypartRateBodypart }, { 'ratebodyYesNoRadio': injuredPartid.injuredbodypart[i].ratebodyYesNoRadio })));
                        //End
                    }
                }
                if ($scope.report.data) {
                    $scope.report.data.selectinjuries.sibodypart = $scope.selectedArray;
                    $scope.report.data.selectinjuries.concatedbodypart = new Array;
                    $scope.report.data.selectinjuries.concatedbodypart = $scope.bodypartPreview;

                    //setting default value for adl section
                    var parentSelectMenus = ['ADLselfCareUrinBody', 'ADLselfCareDefeBody', 'ADLselfCareTeethBody', 'ADLselfCareHairBody', 'ADLselfCareDressBody', 'ADLselfCareBathBody', 'ADLselfCareEatBody',
                        'ADLcommWritBody', 'ADLcommTypingBody', 'ADLcommSeeingBody', 'ADLcommHearingBody', 'ADLcommSpeakingBody', 'ADLPhysicalStandBody', 'ADLPhysicalSitBody', 'ADLPhysicalRecliBody', 'ADLPhysicalWalkBody', 'ADLPhysicalClimbBody',
                        'ADLsensoryHearBody', 'ADLsensorySeeBody', 'ADLsensoryTactileBody', 'ADLsensoryTastBody', 'ADLsensorySmellBody', 'ADLnonSpecGraspBody', 'ADLnonSpecLiftBody', 'ADLnonSpecTactBody', 'ADLtravelRidBody', 'ADLtravelDrivBody', 'ADLtravelFlyBody',
                        'ADLsleepRestBody', 'ADLsleepNoctBody', 'ADLsexualOrgaBody', 'ADLsexualEjacBody', 'ADLsexualLubriBody', 'ADLsexualErecBody'
                    ];

                    for (var j = 0; j < parentSelectMenus.length; j++) {
                        var currentradioID = '';
                        for (var i = 0; i < $scope.report.data['selectinjuries'].concatedbodypart.length; i++) {
                            currentradioID = parentSelectMenus[j] + $scope.report.data['selectinjuries'].concatedbodypart[i].concateId + 'radio';
                            if (typeof $scope.report.data['ActivitiesofDailyLiving'][currentradioID] === 'undefined') {
                                $scope.report.data['ActivitiesofDailyLiving'][currentradioID] = 'No limitations';
                            }
                        }
                    }
                }
                 
                $scope.selectedArray;
            });
        }, function () {

        });
    };

    $scope.openmodal = function () {
         
        $rootScope.modalInstance = $modal.open({
            templateUrl: 'partials/alertpopupbackbutton.html',
            windowClass: 'app-modal-window',
            controller: 'backbuttonpopupCtrl'
        });
    };

    $scope.submit = function (sectionId, validateSectionId, validateSection) {
         
        $validator.validate($scope, validateSectionId)
        .success(function () {
             
            $scope.isLoad = true;
            $scope.fullFormLoader = true;
            $scope.currentsectionId = sectionId.sectiondataid;
            $scope.currentsection = sectionId.sectionname;
            $scope.validateCurrentSectionId = sectionId.sectiondataid;
            $scope.validateCurrentSection = sectionId.sectionname;
            //$scope.savenewPatientdata('', );           
            return true;
        })
        .error(function () {
             
            $scope.isLoad = true;
            $scope.fullFormLoader = true;
            $scope.currentsection = validateSection;
            $scope.currentsectionId = validateSectionId;

            return false;
        });
    };

    $scope.validateBodyPart = function () {
         
        var validateSectionId = 'thoracic';

        if ($scope.currenttemplatedata) {
            $validator.validate($scope.currenttemplatedata.forms, validateSectionId)
            .success(function () {
                 
                $scope.isLoad = true;
                $scope.fullFormLoader = true;
                $scope.currentsectionId = 'patientcomplaintslumbar';
                $scope.currentsection = 'patientcomplaintslumbar';
                //$scope.savenewPatientdata('', );
               
                return true;
            })
            .error(function () {
                 
                $scope.isLoad = true;
                $scope.fullFormLoader = true;
                $scope.currentsection = 'patientcomplaintsthoracic';
                $scope.currentsectionId = 'patientcomplaintsthoracic';
                
                return false;
            });
        }
    };

    $scope.validationSubmit = function () {
         
        $scope.requiredSection = [];

        if ($scope.report.forms) {
            var log = [];
            angular.forEach($scope.report.forms, function (value, key) {

                $validator.validate($scope, key)
                    .success(function () {

                    })
                    .error(function () {
                         
                       
                        $scope.requiredSection.push(key);
                        return false;
                    });

            }, log);

            $scope.displaySec;
            for (var i = 0; i < $scope.requiredSection.length; i++) {
                 
                $scope.displaySec += $scope.requiredSection[i];
            }
             
            //var sectionsDisplay = $scope.requiredSection
            $scope.popupMessage($scope.displaySec, 300);
        }
    };

    $scope.checkValidation = function (validateSectionId, submitStatus, newReportStatus) {
        
		if($scope.formtype=='pr4')	
			$scope.computePainAssesment(); 
        $rootScope.rfas = $rootScope.rfaData();
        $validator.validate($scope, validateSectionId)
        .success(function () {
             
            $scope.savenewPatientdata(submitStatus, newReportStatus);
        })
        .error(function () {
             
           
            //$scope.isLoad = true;
            return false;
        });
    };

    $scope.getNextSection = function () {
         
    };

    $scope.disablesectionInit = function () {
         
        $scope.currentsectionId;
        $scope.filterBodypartid;
      

        if ($scope.currentReportStatus == 'open') {

            if ($scope.report.data[$scope.currentsectionId]) {
                if ($scope.report.data[$scope.currentsectionId].disableradio) {

                    if ($scope.report.data[$scope.currentsectionId].disableradio == 'Yes') {
                        $scope.DisableSections = false;
                    } else {
                        $scope.DisableSections = true;
                    }

                } else {
                    $scope.DisableSections = false;
                }
            } else {
                $scope.DisableSections = false;
            }
        } else {
            if ($scope.currentsectionId == 'impairmentrating' || $scope.currentsectionId == 'impairmentratingfinalclaim') {
                $scope.DisableSections = false;
            } else {
                $scope.DisableSections = true;
            }
        }


    };

    $scope.disablebodypartInit = function () {
         
        $scope.filterBodypartid;
        $scope.bdpartname;
        var bodypartid;
        if ($scope.otherbodypartfullname) {
            bodypartid = $scope.otherbodypartfullname;
        } else {
            bodypartid = $scope.filterBodypartid;
        }

        if ($scope.currentReportStatus == 'open') {

            if ($scope.report.data[$scope.currentBdSectionId]) {
                if ($scope.report.data[$scope.currentBdSectionId].disableradio) {

                    if ($scope.report.data[$scope.currentBdSectionId].disableradio == 'Yes') {
                        $scope.DisableBodyparts = false;
                    } else {
                        $scope.DisableBodyparts = true;
                    }

                } else {
                    $scope.DisableBodyparts = false;
                }
            } else {
                $scope.DisableBodyparts = false;
            }
        } else {
            if ($scope.currentsectionId == 'impairmentrating') {
                $scope.DisableBodyparts = false;
            } else {
                $scope.DisableBodyparts = true;
            }
        }


    };

    $scope.enableForm = function () {
         
        $scope.DisableSections = false;
    };

    $scope.disableForm = function () {
         
        $scope.DisableSections = true;
    };

    $scope.enableBodypartForm = function () {
         
        $scope.DisableBodyparts = false;
    };

    $scope.disableBodypartForm = function () {
        $scope.DisableBodyparts = true;
    };

    $scope.hideSubmitButton = function () {

    };

    //GT:RISHU 24th November 2014 Code for date format
    $scope.dateFilter = function (input) {
         
        if (input == null) { return ""; }
         
        var date = $filter('date')(new Date(input), 'dd-MMM-yyyy');
        return date;
    }

    $scope.datenewFormat = function (input) {
        if (input == null) { return ""; }

        var date = $filter('date')(new Date(input), 'MM/dd/yyyy');
        return date;
    }

    $scope.deleteReportfunc = function () {
         

        $rootScope.modalInstance = $modal.open({
            templateUrl: 'partials/deletereportpopup.html',
            controller: 'deleteReportPopUpCtrl',
            resolve: {
                reportid: function () {
                    return $sessionStorage.reportId;
                }
            }
        });
        $rootScope.modalInstance.result.then(function (returndata) {
             
            if (returndata == 'delete') {
                if ($sessionStorage.reportId) {
                    deletereport.query({ reportid: $sessionStorage.reportId }, function (response) {
                    });
                }
            }

            $scope.exitform('/patient/createinjury');

        }, function (returndata) {

        });
    }

    //Publish functions
    $scope.domainName = window.location.host;

    $scope.showDocxBtn = false; //Don't Display Docx Button on production site for open reports
    if ($scope.domainName == 'localhost:9000' || $scope.domainName == 'localhost:3000' || $scope.domainName == 'ratefastcloud.azurewebsites.net') {

        $scope.showDocxBtn = true; //Display only for the local and staging server

        $scope.currentUser = $rootScope.currentUser;
        $scope.currentUserid = $rootScope.currentUser.id;
        $scope.currentUserlevel = $rootScope.currentUser.role;
        $scope.currentUsername = $rootScope.currentUser.practicename;
        $scope.currentReportStatus = $rootScope.currentReportStatus;

        //Check free report
        //$scope.submittedReportcount = submittedreportcount;

        //if ($scope.submittedReportcount == 'null') {
        //    $scope.freereportsLeft = 'No Reports';
        //}
        //else {
        //    if ($scope.submittedReportcount) {
        //        if ($scope.submittedReportcount >= 2) {
        //            $scope.freereportsLeft = $scope.submittedReportcount;
        //            $scope.reportsCharged = true;
        //            $scope.reportcharge = chargeReport;
        //            $scope.freereportsLeft = 0;
        //        }
        //        else {
        //            $scope.freereportsLeft = 2 - $scope.submittedReportcount;
        //            $scope.reportsLeft = true;
        //        }
        //    }
        //    else {
        //        $scope.freereportsLeft = 0;
        //        $scope.reportsLeft = true;
        //    }
        //}
        //End of check free Report


        //getdatafromAPI.query({ currentuserid: $scope.currentUsername, currentuserlevel: $scope.currentUserlevel }, function (response) {
        //    if (response[0]) {
        //        $scope.practices = response[0].userList;

        //        for (var i = 0; i < $scope.practices.length; i++) {
        //            if ($scope.report) {
        //                if ($scope.report.data) {
        //                    if ($scope.report.data['patientcomplaints']) {
        //                        if ($scope.practices[i]._id == $scope.report.data['patientcomplaints'].treatphynamedropdown) {
        //                            $scope.treatingPhysicianName = $scope.practices[i].firstname + ' ' + $scope.practices[i].lastname;
        //                            $scope.treatingPhysicianProfession = $scope.practices[i].profession;
        //                        }
        //                    }
        //                }
        //            }
        //        }

        //    }
        //});

        //Personal Signature and Letter head
        //if ($scope.report) {
        //    if ($scope.report.data) {

        //        if ($scope.report.data['patientcomplaints'].cliniclocation)
        //            $scope.treatingPhysicianClinicLocation = $scope.report.data['patientcomplaints'].cliniclocation;

        //        if ($scope.report.data['patientcomplaints'].treatphynamedropdown) {
        //            $scope.treatphynamedropdownId = $scope.report.data['patientcomplaints'].treatphynamedropdown;
        //            if ($scope.treatphynamedropdownId) {
        //                currentLoggedinUserdata.query({ userid: $scope.treatphynamedropdownId }, function (response) {

        //                }).$promise.then(function (response) {

        //                    $scope.treatingphyFirstname = response[0].userData[0].firstname;
        //                    $scope.treatingphyLastname = response[0].userData[0].lastname;
        //                    $scope.treatingphyLicensenumber = response[0].userData[0].licensenumber;
        //                    $scope.treatingphyProfession = response[0].userData[0].profession;
        //                    $scope.treatingphyPersonalsignature = response[0].userData[0].personalsignature;
        //                    // Upload Personal Signature
        //                    if ($scope.treatingphyPersonalsignature) {
        //                        var data = {
        //                            id: $scope.treatingphyPersonalsignature
        //                        };

        //                        UpdateSignature.getLogo().query(data, function (res) {
        //                            $scope.signature_img = 'data:image/jpeg;base64,' + res.data;
        //                        });
        //                    }
        //                    PracticeGetDataByName.query({ practicename: $rootScope.currentUser.practicename }, function (response) {

        //                    }).$promise.then(function (response) {

        //                        $scope.treatingphyPhonenumber = response[0].practices[0].phonenumber;
        //                        $scope.treatingphyLetterhead = response[0].practices[0].letterhead;
        //                        if ($scope.treatingphyLetterhead) {
        //                            var data = {
        //                                id: $scope.treatingphyLetterhead
        //                            }
        //                            Practices.getLogo().query(data, function (res) {

        //                                $scope.letterhead_img = 'data:image/jpeg;base64,' + res.data;
        //                            });
        //                        }
        //                    });
        //                });
        //            }
        //        }
        //    }
        //}

        $scope.displayBodyPartName = function (bodypart) {

            var bodyPartName;

            if (bodypart) {
                if (bodypart.text == 'other' || bodypart.text == 'Other') {
                    if (bodypart.bdpartother) {
                        bodyPartName = $filter('capitalize')(bodypart.bdpartother);
                    }
                } else {
                    bodyPartName = bodypart.text;
                }

                if (bodypart.bodysystem == 'Spine') {
                    bodyPartName = bodyPartName + ' Spine';
                }

                if (bodypart.bodysystem == 'Skin') {
                    bodyPartName = 'Skin - ' + bodyPartName;
                }

                if (bodypart.bdsides != 'none' && bodypart.bdsides != 'n/a') {
                    bodyPartName = bodyPartName + ' - ' + $filter('capitalize')(bodypart.bdsides);
                }
            }
            return bodyPartName;
        };

        $scope.getLowerCase = function (data) {
            var lowerSection = data.toLowerCase();
            return lowerSection;
        };

        $scope.findChangeInTreatment = function (data) {
            var status = false;
            if ($scope.report) {
                $.each(data, function (index, item) {

                    if (report.data['treatment' + item.id]) {
                        if (report.data['treatment' + item.id]['treatcurrentradio']) {
                            if (report.data['treatment' + item.id]['treatcurrentradio'] == 'Yes') {
                                status = true;
                            }
                        }
                    } else if (report.data['treatment' + item.id + item.bdsides]) {
                        if (report.data['treatment' + item.id + item.bdsides]['treatcurrentradio']) {
                            if (report.data['treatment' + item.id + item.bdsides]['treatcurrentradio'] == 'Yes') {
                                status = true;
                            }
                        }
                    }
                });
                return status;
            }
        };

        $scope.findNeedForReferral = function (data) {
            if ($scope.report) {
                var status = false;

                $.each(data, function (index, item) {

                    if (report.data['treatment' + item.id]) {
                        if (report.data['treatment' + item.id]['treatmentreferral']) {
                            if (report.data['treatment' + item.id]['treatmentreferral'].length > 0) {
                                status = true;
                            }
                        }
                    } else if (report.data['treatment' + item.id + item.bdsides]) {
                        if (report.data['treatment' + item.id + item.bdsides]['treatmentreferral']) {
                            if (report.data['treatment' + item.id + item.bdsides]['treatmentreferral'].length > 0) {
                                status = true;
                            }
                        }
                    }
                });
                return status;
            }
        };

        $scope.findChangeInPC = function (data) {
            if ($scope.report) {
                var status = false;

                $.each(data, function (index, item) {
                    if (report.data['patientcomplaints' + item.id]) {
                        if (report.data['patientcomplaints' + item.id]['disableradio']) {
                            if (report.data['patientcomplaints' + item.id]['disableradio'] == 'Yes') {
                                status = true;
                            }
                        }
                    } else if (report.data['patientcomplaints' + item.id + item.bdsides]) {
                        if (report.data['patientcomplaints' + item.id + item.bdsides]['disableradio']) {
                            if (report.data['patientcomplaints' + item.id + item.bdsides]['disableradio'] == 'Yes') {
                                status = true;
                            }
                        }
                    }
                });
                return status;
            }
        };

        $scope.diagnosesCoverpage = function () {
            if ($scope.report) {
                $scope.diagnosesValue = "";
                $scope.isarray = false;
                var checkIn = ['diagnoses', 'diagnoseshandleft', 'diagnoseshandright'];

                // first it will check in main diagnoses form and subsections
                for (var j = 0; j < checkIn.length; j++) {

                    if ($scope.report.data[checkIn[j]]) {
                        angular.forEach($scope.report.data[checkIn[j]], function (value, key) {
                            if (!$scope.diagnosesValue) {
                                if (value && value.length > 0) {

                                    $scope.diagnosesValue = value;
                                    $scope.isarray = angular.isArray($scope.diagnosesValue);
                                    return value;
                                }
                            }
                        });
                    }
                }
                // check in body part
                if (!$scope.diagnosesValue) {
                    if ($scope.report.data.selectinjuries) {
                        for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                            var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];

                            if ($scope.report.data['diagnoses' + bodypart.concateId]) {
                                angular.forEach($scope.report.data['diagnoses' + bodypart.concateId], function (value, key) {

                                    if (!$scope.diagnosesValue) {
                                        if (value && value.length > 0) {

                                            $scope.diagnosesValue = value;
                                            $scope.isarray = angular.isArray($scope.diagnosesValue);
                                            return value;
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            }
        };

        $scope.diagnosesCheck = function () {

            if ($scope.report) {
                var returnValue = false;
                var checkIn = ['diagnoses', 'diagnoseshandleft', 'diagnoseshandright'];

                // first it will check in main diagnoses form and subsections
                for (var j = 0; j < checkIn.length; j++) {

                    if ($scope.report.data[checkIn[j]]) {
                        angular.forEach($scope.report.data[checkIn[j]], function (value, key) {
                            if (!returnValue) {
                                if (value && value.length > 0) {
                                    returnValue = true;
                                }
                            }
                        });
                    }
                }
                // check in body part
                if (!returnValue) {

                    if ($scope.report.data.selectinjuries) {
                        for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                            var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];

                            if ($scope.report.data['diagnoses' + bodypart.concateId]) {
                                angular.forEach($scope.report.data['diagnoses' + bodypart.concateId], function (value, key) {

                                    if (!returnValue) {
                                        if (value && value.length > 0) {
                                            returnValue = true;
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
                return returnValue;
            }
        };

        $scope.diagnosesCheckPr2 = function () {
            if ($scope.report) {
                var returnValue = false;
                var checkIn = ['diagnoses', 'diagnoseshandleft', 'diagnoseshandright'];

                // first it will check in main diagnoses form and subsections
                for (var j = 0; j < checkIn.length; j++) {
                    if ($scope.report.data[checkIn[j]]) {
                        angular.forEach($scope.report.data[checkIn[j]], function (value, key) {
                            if (!returnValue) {
                                if ((value && value.length > 0) && ($scope.report.data[checkIn[j]].disableradio != 1 && $scope.report.data[checkIn[j]].disableradio != 'No')) {
                                    returnValue = true;
                                }
                            }
                        });
                    }
                }
                // check in body part
                if (!returnValue) {

                    if ($scope.report.data.selectinjuries) {
                        for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                            var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];

                            //if ($scope.report.data['diagnoses' + bodypart.concateId].disableradio && $scope.report.data['diagnoses' + bodypart.concateId].disableradio != 1 && $scope.report.data['diagnoses' + bodypart.concateId].disableradio != 'No') {
                            if ($scope.report.data['diagnoses' + bodypart.concateId]) {
                                angular.forEach($scope.report.data['diagnoses' + bodypart.concateId], function (value, key) {

                                    if (!returnValue) {
                                        if ((value && value.length > 0) && ($scope.report.data['diagnoses' + bodypart.concateId].disableradio != 1 && $scope.report.data['diagnoses' + bodypart.concateId].disableradio != 'No')) {
                                            returnValue = true;
                                        }
                                    }
                                });
                            }
                            //}
                        }
                    }
                }
                return returnValue;
            }
        };

        $scope.diagnosesHandsCheckPr2 = function (side) {
            if ($scope.report) {
                var returnValue = false;
                var checkIn = 'diagnoseshand' + side;

                if ($scope.report.data[checkIn]) {
                    angular.forEach($scope.report.data[checkIn], function (value, key) {
                        if (!returnValue) {
                            if ((value && value.length > 0) && ($scope.report.data[checkIn].disableradio != 1 && $scope.report.data[checkIn].disableradio != 'No')) {
                                returnValue = true;
                            }
                        }
                    });
                }
                return returnValue;
            }
        };

        $scope.checkImpairmentExist = function (item, section) {
            if ($scope) {
                if ($scope.report) {
                    if ($scope.report.data[section + item.concateId]) {
                        if ($scope.report.data[section + item.concateId].txtUsrInput.length > 0 || $scope.report.data[section + item.concateId].txtAlmaraz.toString().length > 0 || $scope.report.data[section + item.concateId].txtAlmarazWPI.toString().length > 0) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };

        $scope.checkImpairmentExistAll = function () {
            if ($scope) {
                if ($scope.report) {
                    if ($scope.report.data) {
                        if ($scope.report.data.selectinjuries) {
                            if ($scope.report.data.selectinjuries.concatedbodypart) {
                                for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                                    var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];

                                    if ($scope.report.data['impairmentrating' + bodypart.concateId]) {

                                        if (typeof ($scope.report.data['impairmentrating' + bodypart.concateId].txtUsrInput) != 'undefined') {
                                            if ($scope.report.data['impairmentrating' + bodypart.concateId].txtUsrInput.length > 0) {
                                                return true;
                                            }
                                        }
                                        if (typeof ($scope.report.data['impairmentrating' + bodypart.concateId].txtUsrInput) != 'undefined') {
                                            if ($scope.report.data['impairmentrating' + bodypart.concateId].txtAlmaraz.toString().length > 0) {
                                                return true;
                                            }
                                        }
                                        if (typeof ($scope.report.data['impairmentrating' + bodypart.concateId].txtUsrInput) != 'undefined') {
                                            if ($scope.report.data['impairmentrating' + bodypart.concateId].txtAlmarazWPI.toString().length > 0) {
                                                return true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if ($scope.report.data['impairmentratingfinalclaim']) {
                            if (typeof ($scope.report.data['impairmentratingfinalclaim'].txtUsrInput) != 'undefined') {
                                if ($scope.report.data['impairmentratingfinalclaim'].txtUsrInput.length > 0) {
                                    return true;
                                }
                            }
                            if (typeof ($scope.report.data['impairmentratingfinalclaim'].txtUsrInput) != 'undefined') {
                                if ($scope.report.data['impairmentratingfinalclaim'].txtAlmaraz.toString().length > 0) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
            return false;
        };

        $scope.showImpairmentPublish = function (item) {
            if ($rootScope.currentUser.role != 'rater1' && $rootScope.currentUser.role != 'rater2')
                return true;
            else {
                if (item.dateOfRating != '' && item.ratebodyYesNoRadio == 'Yes')
                    return true;
                else
                    return false;
            }

        }

        $scope.addNums = function (num1, num2) {
            var a, b;
            if (num1 == '')
                a = 0;
            else
                a = parseInt(num1);

            if (num2 == '')
                b = 0;
            else
                b = parseInt(num2);
            return Math.abs(a + b).toString() + '%';
        };

        $scope.getSpeciality = function (speciality) {

            if (speciality) {
                var ret_text = '';


                if (speciality.length == 1) {

                    ret_text = speciality[0].name + '.';
                }
                if (speciality.length > 1) {
                    for (var k = 0; k < speciality.length; k++) {

                        if (speciality[k].name) {

                            if (k == speciality.length - 1) {
                                ret_text = ret_text + speciality[k].name;
                            }
                            if (k != speciality.length - 1) {
                                ret_text = ret_text + speciality[k].name + ', ';
                            }
                        }
                    }
                }

                return ret_text;

            }

        };

        $scope.getProfession = function (data, otherprof) {

            if (data) {
                var ret_text = '';


                if (data.length == 1) {
                    if (data[k] != 'other') {
                        ret_text = data[0].toUpperCase();
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
                                    ret_text = ret_text + data[k].toUpperCase();
                                } else {
                                    if (otherprof) {
                                        ret_text = ret_text + otherprof;
                                    }
                                }

                            }
                            if (k != data.length - 1) {
                                if (data[k] != 'other') {
                                    ret_text = ret_text + data[k].toUpperCase() + ', ';
                                } else {
                                    if (otherprof) {
                                        ret_text = ret_text + otherprof + ', ';
                                    }
                                }
                            }
                        }
                    }
                }

                return ret_text;

            }

        };

        //Storing practice name from rootscope to display in RFA report
        $scope.mypracticename = $rootScope.currentUser.practicename;

        //Function to split the practice address into city, street, etc.
        $scope.getPracticeAdd = function (i) {
            if ($scope.report) {
                if ($scope.report.data) {
                    if ($scope.report.data['patientcomplaints']) {
                        if ($scope.report.data['patientcomplaints'].cliniclocation) {

                            var clinicLocation = $scope.report.data['patientcomplaints'].cliniclocation;
                            var addressArray = clinicLocation.split(",");
                            if (i) {
                                return addressArray[i];
                            } else {
                                return addressArray[0];
                            }

                        }
                    }
                }
            }
        }

        //Functions to get diagnoses text and ICD codes in RFA

        /*$scope.getDiagnosesText = function (text) {            
			 
			var diagnosesName = '';
			var icdCode = '';
			var flag = true;
			var tempID = '';
			
			var arrIDs=[];
			var arrText=[];
					
			angular.forEach(text, function (value, key) {					
				if (key=='disableradio') {
					if(value=='Yes')
						flag=true;	
					else if(value!='Yes')
						flag=false;					
				}
			});
			
			if(flag)
			{
				angular.forEach(text, function (value, key) {					
					if (value.length > 0 && value.indexOf('<p>') ==-1 && value.indexOf('Industrial') ==-1 && value.indexOf('Non-industrial') ==-1 && key!='disableradio') {
						arrIDs.push(key);
						arrText.push(value);
					}
				});
				
				//arrIDs.reverse();
				//arrText.reverse();
				
				if ($scope.checkArray(arrText[0]).length > 1) {
					var diagnosesName = '';
					var icdCode = '';
					var textArray = $scope.checkArray(arrText[0]).split(' ');            
					for (var i = 0; i < textArray.length; i++) {
						if (isNaN(textArray[i].substr(0, 1)))
							diagnosesName += textArray[i] + ' ';
						else {
							icdCode = textArray[i];
						}
					}
					  
					if (diagnosesName.indexOf('.') > -1)
						diagnosesName = diagnosesName.substring(0, diagnosesName.lastIndexOf('.'));
					return diagnosesName;
				}
			}
			else		
				diagnosesName='';
			return diagnosesName;
		}
		
        $scope.getDiagnosesTextV2 = function (text) {            
             
            var diagnosesName = '';
            var icdCode = '';
            var flag = true;
            var tempID = '';
			
			var arrIDs=[];
			var arrText=[];
			
			angular.forEach(text, function (value, key) {					
            if (key=='disableradio') {
				if(value=='Yes')
					flag=true;	
				else if(value!='Yes')
					flag=false;					
				}
			});
		
			if(flag)
			{			
				angular.forEach(text, function (value, key) {					
					if (value.length > 0 && value.indexOf('<p>') ==-1 && key.indexOf('rdo')==-1 && key!='disableradio') {
						arrIDs.push(key);
						arrText.push(value);
					}
				});
				
				//arrIDs.reverse();
				//arrText.reverse();
				
				//var textArray = $scope.checkArray(arrText[0]).split(' ICD');
				//	diagnosesName = textArray[0];
				//	if (diagnosesName.indexOf('.') > -1)
				//		diagnosesName = diagnosesName.substring(0, diagnosesName.lastIndexOf('.'));		

				var flag=false;	
				for( var i=0;i<arrText.length;i++)
				{	
					if(!flag)
					{
						var textArray = $scope.checkArray(arrText[i]).split(' ICD');
						diagnosesName = diagnosesName + textArray[0];
						if (diagnosesName.indexOf('.') > -1)
							diagnosesName = diagnosesName.substring(0, diagnosesName.lastIndexOf('.'));		
						flag=true;	
					}				
				}
			}
			else
				diagnosesName='';
            return diagnosesName;
        }
		
		$scope.getDiagnosesTextSkin = function (text) {            
             
            var diagnosesName = '';
            var icdCode = '';
            var flag = true;
            var tempID = '';
			
			var arrIDs=[];
			var arrText=[];
			
			angular.forEach(text, function (value, key) {					
            if (key=='disableradio') {
				if(value=='Yes')
					flag=true;	
				else if(value!='Yes')
					flag=false;					
				}
			});
		
			if(flag)
			{			
				angular.forEach(text, function (value, key) {					
					if (value.length > 0 && value.indexOf('<p>') ==-1 && key.indexOf('rdo')==-1 && value!='Industrial' && value!='Non-industrial' && key!='disableradio') {
						arrIDs.push(key);
						arrText.push(value);
					}
				});
				
				//arrIDs.reverse();
				//arrText.reverse();
				
				//var textArray = $scope.checkArray(arrText[0]).split(' ICD');
				//	diagnosesName = textArray[0];
				//	if (diagnosesName.indexOf('.') > -1)
				//		diagnosesName = diagnosesName.substring(0, diagnosesName.lastIndexOf('.'));		

				var flag=false;	
				for( var i=0;i<arrText.length;i++)
				{	
					if(!flag)
					{
						if($scope.checkArray(arrText[i]).indexOf('ICD')>-1)
						{
							var textArray = $scope.checkArray(arrText[i]).split(' ICD');
							diagnosesName = diagnosesName + textArray[0];
							if (diagnosesName.indexOf('.') > -1)
								diagnosesName = diagnosesName.substring(0, diagnosesName.lastIndexOf('.'));		
							flag=true;	
						}
					}				
				}
			}
			else
				diagnosesName='';
            return diagnosesName;
        }*/

        $scope.getDiagnosesText = function (text) {
             
            var diagnosesName = '';
            var icdCode = '';
            var flag = true;
            var tempID = '';

            var arrIDs = [];
            var arrText = [];

            /*angular.forEach(text, function (value, key) {
                if (key == 'disableradio') {
                    if (value == 'Yes')
                        flag = true;
                    else if (value != 'Yes')
                        flag = false;
                }
            });*/

            if (flag) {
                angular.forEach(text, function (value, key) {
                    if (value.length > 0 && value.indexOf('<p>') == -1 && value.indexOf('Industrial') == -1 && value.indexOf('Non-industrial') == -1){// && key != 'disableradio') {
                        arrIDs.push(key);
                        arrText.push(value);
                    }
                });

                //arrIDs.reverse();
                //arrText.reverse();

                for (var j = 0; j < arrText.length; j++) {
                    if ($scope.checkArray(arrText[j]).length > 1) {
                        var diagnosesName = '';
                        var icdCode = '';
                        var textArray = $scope.checkArray(arrText[j]).split(' ');
                        for (var i = 0; i < textArray.length; i++) {
                            if (isNaN(textArray[i].substr(0, 1)))
                                diagnosesName += textArray[i] + ' ';
                            if (diagnosesName.indexOf('.') > -1)
                                diagnosesName = diagnosesName.substring(0, diagnosesName.lastIndexOf('.'));
                            if (diagnosesName != '')
                                diagnosesName = diagnosesName + '<br/>';
                            else {
                                icdCode = textArray[i];
                            }
                        }
                    }
                }
                return diagnosesName;
            }
            else
                diagnosesName = '';
            return diagnosesName;
        }

        $scope.getDiagnosesTextV2 = function (text) {
             
            var diagnosesName = '';
            var icdCode = '';
            var flag = true;
            var tempID = '';

            var arrIDs = [];
            var arrText = [];

            /*angular.forEach(text, function (value, key) {
                if (key == 'disableradio') {
                    if (value == 'Yes')
                        flag = true;
                    else if (value != 'Yes')
                        flag = false;
                }
            });*/

            if (flag) {
                angular.forEach(text, function (value, key) {
                    if (value.length > 0 && value.indexOf('<p>') == -1 && key.indexOf('rdo') == -1){// && key != 'disableradio') {
                        arrIDs.push(key);
                        arrText.push(value);
                    }
                });

                //arrIDs.reverse();
                //arrText.reverse();

                //var textArray = $scope.checkArray(arrText[0]).split(' ICD');
                //	diagnosesName = textArray[0];
                //	if (diagnosesName.indexOf('.') > -1)
                //		diagnosesName = diagnosesName.substring(0, diagnosesName.lastIndexOf('.'));		

                var flag = false;
                for (var i = 0; i < arrText.length; i++) {
                    if (!flag) {
                        var textArray = $scope.checkArray(arrText[i]).split(' ICD');
                        diagnosesName = diagnosesName + textArray[0];
                        if (diagnosesName.indexOf('.') > -1)
                            diagnosesName = diagnosesName.substring(0, diagnosesName.lastIndexOf('.'));
                        if (diagnosesName != '')
                            diagnosesName = diagnosesName + '<br/>';
                        //flag=true;	
                    }
                }
            }
            else
                diagnosesName = '';
            return diagnosesName;
        }

        $scope.getDiagnosesTextSkin = function (text) {
             
            var diagnosesName = '';
            var icdCode = '';
            var flag = true;
            var tempID = '';

            var arrIDs = [];
            var arrText = [];

            /*angular.forEach(text, function (value, key) {
                if (key == 'disableradio') {
                    if (value == 'Yes')
                        flag = true;
                    else if (value != 'Yes')
                        flag = false;
                }
            });*/

            if (flag) {
                angular.forEach(text, function (value, key) {
                    if (value.length > 0 && value.indexOf('<p>') == -1 && key.indexOf('rdo') == -1 && value != 'Industrial' && value != 'Non-industrial'){// && key != 'disableradio') {
                        arrIDs.push(key);
                        arrText.push(value);
                    }
                });

                //arrIDs.reverse();
                //arrText.reverse();

                //var textArray = $scope.checkArray(arrText[0]).split(' ICD');
                //	diagnosesName = textArray[0];
                //	if (diagnosesName.indexOf('.') > -1)
                //		diagnosesName = diagnosesName.substring(0, diagnosesName.lastIndexOf('.'));		

                var flag = false;
                for (var i = 0; i < arrText.length; i++) {
                    if (!flag) {
                        if ($scope.checkArray(arrText[i]).indexOf('ICD') > -1) {
                            var textArray = $scope.checkArray(arrText[i]).split(' ICD');
                            diagnosesName = diagnosesName + textArray[0];
                            if (diagnosesName.indexOf('.') > -1)
                                diagnosesName = diagnosesName.substring(0, diagnosesName.lastIndexOf('.'));
                            if (diagnosesName != '')
                                diagnosesName = diagnosesName + '<br/>';
                            //flag=true;	
                        }
                    }
                }
            }
            else
                diagnosesName = '';
            return diagnosesName;
        }        

        $scope.getDiagnosesICDCode = function (text) {
             
            var diagnosesName = '';
            var icdCode = '';
            var flag = true;
            var tempID = '';

            var arrIDs = [];
            var arrText = [];

            /*angular.forEach(text, function (value, key) {
                if (key == 'disableradio') {
                    if (value == 'Yes')
                        flag = true;
                    else if (value != 'Yes')
                        flag = false;
                }
            });*/

            if (flag) {
                angular.forEach(text, function (value, key) {
                    if (value.length > 0 && value.indexOf('<p>') == -1 && value.indexOf('Industrial') == -1 && value.indexOf('Non-industrial') == -1){// && key != 'disableradio') {
                        arrIDs.push(key);
                        arrText.push(value);
                    }
                });

                //arrIDs.reverse();
                //arrText.reverse();

                for (var j = 0; j < arrText.length; j++) {
                    if ($scope.checkArray(arrText[j]).length > 1) {
                        var diagnosesName = '';
                        var icdCode = '';
                        var textArray = $scope.checkArray(arrText[j]).split(' ');
                        for (var i = 0; i < textArray.length; i++) {
                            if (isNaN(textArray[i].substr(0, 1)))
                                diagnosesName += textArray[i] + ' ';
                            else {
                                icdCode = textArray[i];
                                if (icdCode.indexOf('.') > -1)
                                    icdCode = icdCode.substring(0, icdCode.lastIndexOf('.'));
                                icdCode = icdCode + '<br/>';
                            }
                        }
                    }
                }
                return icdCode;
            }
            else
                icdCode = '';
            return icdCode;
        }

        $scope.getDiagnosesICDCodeV2 = function (text) {
             
            var diagnosesName = '';
            var icdCode = '';
            var flag = true;
            var tempID = '';

            var arrIDs = [];
            var arrText = [];

            /*angular.forEach(text, function (value, key) {
                if (key == 'disableradio') {
                    if (value == 'Yes')
                        flag = true;
                    else if (value != 'Yes')
                        flag = false;
                }
            });*/

            if (flag) {
                angular.forEach(text, function (value, key) {
                    if (value.length > 0 && value.indexOf('<p>') == -1){// && key != 'disableradio') {
                        arrIDs.push(key);
                        arrText.push(value);
                    }
                });

                //arrIDs.reverse();
                //arrText.reverse();

                var textArray;

                //if(arrIDs[0].substr(3)==arrIDs[1].substr(3))
                //	textArray = $scope.checkArray(arrText[0]);
                //else
                //	textArray = $scope.checkArray(arrText[1]).split(' ICD')[1];

                //icdCode = 'ICD ' + textArray;
                //if (icdCode.indexOf('.') > -1)
                //    icdCode = icdCode.substring(0, icdCode.lastIndexOf('.'));	

                var textArray;
                var flag = false;
                for (var i = 0; i < arrText.length; i++) {
                    if (!flag) {
                        if ($scope.checkArray(arrText[i]).indexOf('ICD') > -1) {
                            if ($scope.checkArray(arrIDs[i]).indexOf('chk') > -1) {
                                textArray = $scope.checkArray(arrText[i]).split(' ICD');
                                icdCode = icdCode + 'ICD ' + textArray[1];
                                icdCode = icdCode + '<br/>';
                                //flag=true;
                            }
                            else if ($scope.checkArray(arrIDs[i]).indexOf('rdo') > -1) {
                                textArray = $scope.checkArray(arrText[i]);
                                icdCode = icdCode + textArray;
                                icdCode = icdCode + '<br/>';
                                //flag=true;
                            }
                        }
                    }
                }
            }
            else
                icdCode = '';
            //icdCode='ICD code: ' + icdCode + '<br/><br/><br/> \n End';
            return icdCode;

            //icdCode='ICD code:&nbsp;' + icdCode + '<br/>End';
            //var htmlObject = document.createElement('div');
            //htmlObject.innerHTML = '<p>' + icdCode + '</p>';           
            //return 	htmlObject.innerHTML;	
        }

        $scope.getDiagnosesICDCodeSkin = function (text) {
             
            var diagnosesName = '';
            var icdCode = '';
            var flag = true;
            var tempID = '';

            var arrIDs = [];
            var arrText = [];

            /*angular.forEach(text, function (value, key) {
                if (key == 'disableradio') {
                    if (value == 'Yes')
                        flag = true;
                    else if (value != 'Yes')
                        flag = false;
                }
            });*/

            if (flag) {
                angular.forEach(text, function (value, key) {
                    if (value.length > 0 && value.indexOf('<p>') == -1 && value != 'Industrial' && value != 'Non-industrial'){// && key != 'disableradio') {
                        arrIDs.push(key);
                        arrText.push(value);
                    }
                });

                //arrIDs.reverse();
                //arrText.reverse();

                var textArray;

                //if(arrIDs[0].substr(3)==arrIDs[1].substr(3))
                //	textArray = $scope.checkArray(arrText[0]);
                //else
                //	textArray = $scope.checkArray(arrText[1]).split(' ICD')[1];

                //icdCode = 'ICD ' + textArray;
                //if (icdCode.indexOf('.') > -1)
                //    icdCode = icdCode.substring(0, icdCode.lastIndexOf('.'));	

                var textArray;
                var flag = false;
                for (var i = 0; i < arrText.length; i++) {
                    if (!flag) {
                        if ($scope.checkArray(arrText[i]).indexOf('ICD') > -1) {
                            textArray = $scope.checkArray(arrText[i]).split(' ICD')[1];
                            icdCode = icdCode + 'ICD' + textArray;
                            icdCode = icdCode + '<br/>';
                            //flag=true;																		
                        }
                    }
                }
            }
            else
                icdCode = '';
            return icdCode;
        }

        /*$scope.isTreatmentInputted = function (bodypart, treatmentarray) {				
			var returnval = false;
            if (treatmentarray) {
                angular.forEach(treatmentarray, function (value, key) {					
					if (value['diagnosticnecessary']!='undefined' || value['injectionsnecessary']!='undefined' || value['therapynecessary']!='undefined' || value['referalnecessary']!='undefined' || $scope.report.data['treatment' + bodypart]['tensunitradio'] !='undefined' || $scope.report.data['treatment' + bodypart]['waveradio']!='undefined' || $scope.report.data['treatment' + bodypart]['wheelunititradio']!='undefined' || $scope.report.data['treatment' + bodypart]['durablecraneradio']!='undefined' || $scope.report.data['treatment' + bodypart]['durableCrutch_radio']!='undefined' || $scope.report.data['treatment' + bodypart]['AFO_radio']!='undefined' || $scope.report.data['treatment' + bodypart]['KAFO_radio']!='undefined' || $scope.report.data['treatment' + bodypart]['tenniselbowstrapradiolabel']!='undefined' || $scope.report.data['treatment' + bodypart]['Neoprenestrapradiolabel']!='undefined' || $scope.report.data['treatment' + bodypart]['splintsradio']!='undefined' || $scope.report.data['treatment' + bodypart]['wristsupportradio']!='undefined' || $scope.report.data['treatment' + bodypart]['lumbarsupportradio']!='undefined')
					{									
						if (value['diagnosticnecessary']=='Yes' || value['injectionsnecessary']=='Yes' || value['therapynecessary']=='Yes' || value['referalnecessary']=='Yes' || $scope.report.data['treatment' + bodypart]['tensunitradio']=='Yes' || $scope.report.data['treatment' + bodypart]['waveradio']=='Yes' || $scope.report.data['treatment' + bodypart]['wheelunititradio']=='Yes' || $scope.report.data['treatment' + bodypart]['durablecraneradio']=='Yes' || $scope.report.data['treatment' + bodypart]['durableCrutch_radio']=='Yes' || $scope.report.data['treatment' + bodypart]['AFO_radio']=='Yes' || $scope.report.data['treatment' + bodypart]['KAFO_radio']=='Yes' || $scope.report.data['treatment' + bodypart]['tenniselbowstrapradiolabel']=='Yes' || $scope.report.data['treatment' + bodypart]['Neoprenestrapradiolabel']=='Yes' || $scope.report.data['treatment' + bodypart]['splintsradio']=='Yes' || $scope.report.data['treatment' + bodypart]['wristsupportradio']=='Yes' || $scope.report.data['treatment' + bodypart]['lumbarsupportradio']=='Yes'  )						
							returnval = true;
						else
							returnval = false;
					}
					else
						returnval = true;		
				});
            }
			return returnval;
        };*/

        $scope.isTreatmentInputted = function (bodypart, mediValue, treatmentarray) {
            //var returnval = false;
            if (treatmentarray) {
                //angular.forEach(treatmentarray, function (value, key) {	
                switch (mediValue) {
                    case 'treatmenttherapy':
                        var therapyreturn = false;
                        angular.forEach(treatmentarray, function (value, key) {
                            if (value['therapynecessary'] != 'undefined') {
                                if (value['therapynecessary'] == 'Yes') {
                                    therapyreturn = true;
                                    return therapyreturn;
                                }
                                else
                                    therapyreturn = false;
                            }
                        });
                        return therapyreturn;
                        break;

                    case 'treatmentinjections':
                        var injectionsreturn = false;
                        angular.forEach(treatmentarray, function (value, key) {
                            if (value['injectionsnecessary'] != 'undefined') {
                                if (value['injectionsnecessary'] == 'Yes') {
                                    injectionsreturn = true;
                                    return injectionsreturn;
                                }
                                else
                                    injectionsreturn = false;
                            }
                        });
                        return injectionsreturn;
                        break;

                    case 'treatmentdiagnostic':
                        var diagnosticreturn = false;
                        angular.forEach(treatmentarray, function (value, key) {
                            if (value['diagnosticnecessary'] != 'undefined') {
                                if (value['diagnosticnecessary'] == 'Yes') {
                                    diagnosticreturn = true;
                                    return diagnosticreturn;
                                }
                                else
                                    diagnosticreturn = false;
                            }
                        });
                        return diagnosticreturn;
                        break;

                    case 'treatmentreferral':
                        var referralreturn = false;
                        angular.forEach(treatmentarray, function (value, key) {
                            if (value['referalnecessary'] != 'undefined') {
                                if (value['referalnecessary'] == 'Yes') {
                                    referralreturn = true;
                                    return referralreturn;
                                }
                                else
                                    referralreturn = false;
                            }
                        });
                        return referralreturn;
                        break;

                    case 'durabletensunit':
                        if ($scope.report.data['treatment' + bodypart]['tensunitradio'] != 'undefined') {
                            if ($scope.report.data['treatment' + bodypart]['tensunitradio'] == 'Yes')
                                return true;
                            else
                                return false;
                        }
                        break;

                    case 'durablehwaveunit':
                        if ($scope.report.data['treatment' + bodypart]['waveradio'] != 'undefined') {
                            if ($scope.report.data['treatment' + bodypart]['waveradio'] == 'Yes')
                                return true;
                            else
                                return false;
                        }
                        break;

                    case 'durablewheelchair':
                        if ($scope.report.data['treatment' + bodypart]['wheelunititradio'] != 'undefined') {
                            if ($scope.report.data['treatment' + bodypart]['wheelunititradio'] == 'Yes')
                                return true;
                            else
                                return false;
                        }
                        break;

                    case 'durablecane':
                        if ($scope.report.data['treatment' + bodypart]['durablecaneradio'] != 'undefined') {
                            if ($scope.report.data['treatment' + bodypart]['durablecaneradio'] == 'Yes')
                                return true;
                            else
                                return false;
                        }
                        break;

                    case 'durableCrutch':
                        if ($scope.report.data['treatment' + bodypart]['durableCrutch_radio'] != 'undefined') {
                            if ($scope.report.data['treatment' + bodypart]['durableCrutch_radio'] == 'Yes')
                                return true;
                            else
                                return false;
                        }
                        break;


                    case 'durableAFO':
                        if ($scope.report.data['treatment' + bodypart]['AFO_radio'] != 'undefined') {
                            if ($scope.report.data['treatment' + bodypart]['AFO_radio'] == 'Yes')
                                return true;
                            else
                                return false;
                        }
                        break;

                    case 'durableKAFO':
                        if ($scope.report.data['treatment' + bodypart]['KAFO_radio'] != 'undefined') {
                            if ($scope.report.data['treatment' + bodypart]['KAFO_radio'] == 'Yes')
                                return true;
                            else
                                return false;
                        }
                        break;

                    case 'durabletenniselbowstrap':
                        if ($scope.report.data['treatment' + bodypart]['tenniselbowstrapradiolabel'] != 'undefined') {
                            if ($scope.report.data['treatment' + bodypart]['tenniselbowstrapradiolabel'] == 'Yes')
                                return true;
                            else
                                return false;
                        }
                        break;

                    case 'durableneoprenesleeve':
                        if ($scope.report.data['treatment' + bodypart]['Neoprenestrapradiolabel'] != 'undefined') {
                            if ($scope.report.data['treatment' + bodypart]['Neoprenestrapradiolabel'] == 'Yes')
                                return true;
                            else
                                return false;
                        }
                        break;

                    case 'durablesplints':
                        if ($scope.report.data['treatment' + bodypart]['splintsradio'] != 'undefined') {
                            if ($scope.report.data['treatment' + bodypart]['splintsradio'] == 'Yes')
                                return true;
                            else
                                return false;
                        }
                        break;

                    case 'durablewristsupport':
                        if ($scope.report.data['treatment' + bodypart]['wristsupportradio'] != 'undefined') {
                            if ($scope.report.data['treatment' + bodypart]['wristsupportradio'] == 'Yes')
                                return true;
                            else
                                return false;
                        }
                        break;

                    case 'durablelumbarsupport':
                        if ($scope.report.data['treatment' + bodypart]['lumbarsupportradio'] != 'undefined') {
                            if ($scope.report.data['treatment' + bodypart]['lumbarsupportradio'] == 'Yes')
                                return true;
                            else
                                return false;
                        }
                        break;

                    case 'durableother':
                        if ($scope.report.data['treatment' + bodypart]['durableotherradio'] != 'undefined') {
                            if ($scope.report.data['treatment' + bodypart]['durableotherradio'] == 'Yes') {
                                if ($scope.report.data['treatment' + bodypart]['txtEquipmentName'] != '') {
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            }
                            else
                                return false;
                        }
                        break;

                }

                /*if (value['diagnosticnecessary']!='undefined' || value['injectionsnecessary']!='undefined' || value['therapynecessary']!='undefined' || value['referalnecessary']!='undefined' || $scope.report.data['treatment' + bodypart]['tensunitradio'] !='undefined' || $scope.report.data['treatment' + bodypart]['waveradio']!='undefined' || $scope.report.data['treatment' + bodypart]['wheelunititradio']!='undefined' || $scope.report.data['treatment' + bodypart]['durablecraneradio']!='undefined' || $scope.report.data['treatment' + bodypart]['durableCrutch_radio']!='undefined' || $scope.report.data['treatment' + bodypart]['AFO_radio']!='undefined' || $scope.report.data['treatment' + bodypart]['KAFO_radio']!='undefined' || $scope.report.data['treatment' + bodypart]['tenniselbowstrapradiolabel']!='undefined' || $scope.report.data['treatment' + bodypart]['Neoprenestrapradiolabel']!='undefined' || $scope.report.data['treatment' + bodypart]['splintsradio']!='undefined' || $scope.report.data['treatment' + bodypart]['wristsupportradio']!='undefined' || $scope.report.data['treatment' + bodypart]['lumbarsupportradio']!='undefined')
                {									
                    if (value['diagnosticnecessary']=='Yes' || value['injectionsnecessary']=='Yes' || value['therapynecessary']=='Yes' || value['referalnecessary']=='Yes' || $scope.report.data['treatment' + bodypart]['tensunitradio']=='Yes' || $scope.report.data['treatment' + bodypart]['waveradio']=='Yes' || $scope.report.data['treatment' + bodypart]['wheelunititradio']=='Yes' || $scope.report.data['treatment' + bodypart]['durablecraneradio']=='Yes' || $scope.report.data['treatment' + bodypart]['durableCrutch_radio']=='Yes' || $scope.report.data['treatment' + bodypart]['AFO_radio']=='Yes' || $scope.report.data['treatment' + bodypart]['KAFO_radio']=='Yes' || $scope.report.data['treatment' + bodypart]['tenniselbowstrapradiolabel']=='Yes' || $scope.report.data['treatment' + bodypart]['Neoprenestrapradiolabel']=='Yes' || $scope.report.data['treatment' + bodypart]['splintsradio']=='Yes' || $scope.report.data['treatment' + bodypart]['wristsupportradio']=='Yes' || $scope.report.data['treatment' + bodypart]['lumbarsupportradio']=='Yes'  )						
                        returnval = true;
                    else
                        returnval = false;
                }
                else
                    returnval = true;	*/
                //});
            }
            //return returnval;
        };

        $scope.getDoctordata = function (userid) {

            if (userid) {
                currentLoggedinUserdata.query({ userid: userid }, function (response) {
                    $scope.doctorInfo = response[0].userData[0];
                });
            }
        };

        $scope.dingnosticCoverpage = function () {
            if ($scope.report) {
                if ($scope.report.data) {
                    $scope.DTSValue = false;

                    var checkIn = ['diagnostictestresults', 'diagnostictestresultslimblength'];

                    // first it will check in main diagnoses form and subsections
                    for (var j = 0; j < checkIn.length; j++) {

                        if ($scope.report.data[checkIn[j]]) {
                            angular.forEach($scope.report.data[checkIn[j]], function (value, key) {
                                if (!$scope.diagnosesValue) {
                                    if (value && value.length > 0) {
                                        $scope.DTSValue = true;
                                    }
                                }
                            });
                        }
                    }
                    if ($scope.report.data.selectinjuries) {
                        for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                            var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];

                            if ($scope.report.data['diagnostictestresults' + bodypart.concateId]) {

                                angular.forEach($scope.report.data['diagnostictestresults' + bodypart.concateId], function (value, key) {

                                    if (!$scope.DTSValue) {
                                        if (value && value.length > 0) {
                                            $scope.DTSValue = true;
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            }
        };

        $scope.diagnosticFullCheck = function () {
            if ($scope.report) {

                var returnValue = false;

                var checkIn = ['diagnostictestresults', 'diagnostictestresultslimblength'];

                // first it will check in main diagnoses form and subsections
                for (var j = 0; j < checkIn.length; j++) {

                    if ($scope.report.data[checkIn[j]]) {
                        angular.forEach($scope.report.data[checkIn[j]], function (value, key) {
                            if (!returnValue) {
                                if (value && value.length > 0) {
                                    returnValue = true;
                                }
                            }
                        });
                    }
                }

                if ($scope.report.data.selectinjuries) {
                    for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                        var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];

                        if ($scope.report.data['diagnostictestresults' + bodypart.concateId]) {

                            angular.forEach($scope.report.data['diagnostictestresults' + bodypart.concateId], function (value, key) {

                                if (!returnValue) {
                                    if (value && value.length > 0) {
                                        returnValue = true;
                                    }
                                }
                            });
                        }
                    }
                }
                return returnValue;
            }
        };

        //Added by Unais dated 31-01-2015 for handling disable radio button for PR2
        $scope.diagnosticFullCheckPr2 = function () {
            if ($scope.report) {

                var returnValue = false;

                var checkIn = ['diagnostictestresults', 'diagnostictestresultslimblength'];

                // first it will check in main diagnoses form and subsections
                for (var j = 0; j < checkIn.length; j++) {

                    if ($scope.report.data[checkIn[j]]) {
                        angular.forEach($scope.report.data[checkIn[j]], function (value, key) {
                            if (!returnValue) {
                                if ((value && value.length > 0) && ($scope.report.data[checkIn[j]].disableradio != 1 && $scope.report.data[checkIn[j]].disableradio != 'No')) {
                                    returnValue = true;
                                }
                            }
                        });
                    }
                }

                if ($scope.report.data.selectinjuries) {
                    for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                        var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];

                        if ($scope.report.data['diagnostictestresults' + bodypart.concateId]) {

                            angular.forEach($scope.report.data['diagnostictestresults' + bodypart.concateId], function (value, key) {

                                if (!returnValue) {
                                    if ((value && value.length > 0) && ($scope.report.data['diagnostictestresults'].disableradio != 1 && $scope.report.data['diagnostictestresults'].disableradio != 'No')) {
                                        returnValue = true;
                                    }
                                }
                            });
                        }
                    }
                }
                return returnValue;
            }
        };

        $scope.diagnosticBodyPartCheck = function (type) {

            var returnValue = false;

            if ($scope.report) {
                if ($scope.report.data) {
                    if ($scope.report.data.selectinjuries) {
                        var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];

                        if (bodypart.bdpartother != "" && bodypart.bdsystemother != "") {
                            if (bodypart.bodysystem != 'Skin') {

                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId]) {

                                    angular.forEach($scope.report.data['diagnostictestresults' + bodypart.concateId], function (value, key) {

                                        if (type == 'xray') {
                                            if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnXrayAddAnother) {
                                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnXrayAddAnother.length > 0) {
                                                    returnValue = true;
                                                }
                                            }
                                        } else if (type == 'mri') {
                                            if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnMriAddAnother) {
                                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnMriAddAnother.length > 0) {
                                                    returnValue = true;
                                                }
                                            }
                                        }
                                        else if (type == 'ctscan') {
                                            if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnCTScanAddAnother) {
                                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnCTScanAddAnother.length > 0) {
                                                    returnValue = true;
                                                }
                                            }
                                        }
                                    });
                                }
                            } else if (bodypart.bodysystem == 'Skin') {

                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId]) {

                                    angular.forEach($scope.report.data['diagnostictestresults' + bodypart.concateId], function (value, key) {

                                        if (type == 'pathology') {
                                            if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnSkinPathologyAddAnother) {
                                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnSkinPathologyAddAnother.length > 0) {
                                                    returnValue = true;
                                                }
                                            }
                                        } else if (type == 'officebased') {
                                            if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnOfficeBasedAddAnother) {
                                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnOfficeBasedAddAnother.length > 0) {
                                                    returnValue = true;
                                                }
                                            }
                                        }

                                    });
                                }

                            }

                        }
                    }
                }
            }

            return returnValue;
        };

        //Added by Unais dated 31-01-2015 for handling disable radio button for PR2
        $scope.diagnosticBodyPartCheckPr2 = function (type) {

            var returnValue = false;

            if ($scope.report) {
                if ($scope.report.data) {
                    if ($scope.report.data.selectinjuries) {
                        for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                            var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];

                            if ($scope.checkIfReadyForRating(bodypart)) {

                                if (bodypart.bodysystem != 'Skin') {

                                    if ($scope.report.data['diagnostictestresults' + bodypart.concateId]) {

                                        angular.forEach($scope.report.data['diagnostictestresults' + bodypart.concateId], function (value, key) {

                                            if (type == 'xray') {
                                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnXrayAddAnother) {
                                                    if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnXrayAddAnother.length > 0 && ($scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 1 && $scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 'No')) {
                                                        returnValue = true;
                                                    }
                                                }
                                            } else if (type == 'mri') {
                                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnMriAddAnother) {
                                                    if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnMriAddAnother.length > 0 && ($scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 1 && $scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 'No')) {
                                                        returnValue = true;
                                                    }
                                                }
                                            }
                                            else if (type == 'ctscan') {
                                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnCTScanAddAnother) {
                                                    if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnCTScanAddAnother.length > 0 && ($scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 1 && $scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 'No')) {
                                                        returnValue = true;
                                                    }
                                                }
                                            }
                                        });
                                    }
                                } else if (bodypart.bodysystem == 'Skin') {

                                    if ($scope.report.data['diagnostictestresults' + bodypart.concateId]) {

                                        angular.forEach($scope.report.data['diagnostictestresults' + bodypart.concateId], function (value, key) {

                                            if (type == 'pathology') {
                                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnSkinPathologyAddAnother) {
                                                    if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnSkinPathologyAddAnother.length > 0 && ($scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 1 && $scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 'No')) {
                                                        returnValue = true;
                                                    }
                                                }
                                            } else if (type == 'officebased') {
                                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnOfficeBasedAddAnother) {
                                                    if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnOfficeBasedAddAnother.length > 0 && ($scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 1 && $scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 'No')) {
                                                        returnValue = true;
                                                    }
                                                }
                                            }

                                        });
                                    }

                                }
                            }
                        }
                    }
                }
            }

            return returnValue;
        };

        /*$scope.diagnosticBodyPartCheckPr2 = function (type) {

            var returnValue = false;

            if ($scope.report) {
                if ($scope.report.data) {
                    if ($scope.report.data.selectinjuries) {
                        for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                            var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];

                            if (bodypart.bodysystem != 'Skin') {

                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId]) {

                                    angular.forEach($scope.report.data['diagnostictestresults' + bodypart.concateId], function (value, key) {

                                        if (type == 'xray') {
                                            if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnXrayAddAnother) {
                                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnXrayAddAnother.length > 0 && ($scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 1 && $scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 'No')) {
                                                    returnValue = true;
                                                }
                                            }
                                        } else if (type == 'mri') {
                                            if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnMriAddAnother) {
                                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnMriAddAnother.length > 0 && ($scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 1 && $scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 'No')) {
                                                    returnValue = true;
                                                }
                                            }
                                        }
                                        else if (type == 'ctscan') {
                                            if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnCTScanAddAnother) {
                                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnCTScanAddAnother.length > 0 && ($scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 1 && $scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 'No')) {
                                                    returnValue = true;
                                                }
                                            }
                                        }
                                    });
                                }
                            } else if (bodypart.bodysystem == 'Skin') {

                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId]) {

                                    angular.forEach($scope.report.data['diagnostictestresults' + bodypart.concateId], function (value, key) {

                                        if (type == 'pathology') {
                                            if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnSkinPathologyAddAnother) {
                                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnSkinPathologyAddAnother.length > 0 && ($scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 1 && $scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 'No')) {
                                                    returnValue = true;
                                                }
                                            }
                                        } else if (type == 'officebased') {
                                            if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnOfficeBasedAddAnother) {
                                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnOfficeBasedAddAnother.length > 0 && ($scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 1 && $scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 'No')) {
                                                    returnValue = true;
                                                }
                                            }
                                        }

                                    });
                                }

                            }
                        }
                    }
                }
            }

            return returnValue;
        };*/

        $scope.diagnosticSkinBodyPartCheck = function () {
            var returnValue = false;

            if ($scope.report) {
                if ($scope.report.data) {
                    if ($scope.report.data.selectinjuries) {
                        for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                            var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];

                            if (bodypart.bodysystem == 'Skin') {

                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId]) {

                                    if ($scope.report.data['diagnostictestresults' + bodypart.concateId].mainTextA.length > 0) {
                                        returnValue = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return returnValue;
        }

        $scope.checkOnlySectionExist = function (section) {

            var returnValue = false;

            if ($scope.report) {
                if ($scope.report.data) {

                    if ($scope.report.data[section]) {

                        angular.forEach($scope.report.data[section], function (value, key) {

                            if (!returnValue) {
                                if (value && value.length > 0) {
                                    returnValue = true;
                                }
                            }

                        });
                    }
                }
            }

            return returnValue;
        };

        //Added by Unais dated 31-01-2015 for handling disable radio button for PR2
        $scope.checkOnlySectionExistPr2 = function (section) {

            var returnValue = false;

            if ($scope.report) {
                if ($scope.report.data) {

                    if ($scope.report.data[section]) {

                        angular.forEach($scope.report.data[section], function (value, key) {
                            if (!returnValue) {
                                if ((value && value.length > 0) && ($scope.report.data[section].disableradio != 1 && $scope.report.data[section].disableradio != 'No')) {
                                    returnValue = true;
                                }
                            }

                        });
                    }
                }
            }

            return returnValue;
        };

        $scope.checkWholeBDPartExist = function (section) {

            var returnValue = false;

            if ($scope.report) {
                if ($scope.report.data) {

                    if ($scope.report.data.selectinjuries) {

                        for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {

                            var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];
                            if ($scope.report.data[section + bodypart.concateId]) {
                                angular.forEach($scope.report.data[section + bodypart.concateId], function (value, key) {

                                    if (!returnValue) {
                                        if (key!='treatcurrentradio' && (value && value.length > 0)) {											
											returnValue = true;											                                           
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            }

            return returnValue;
        };
		
		$scope.checkWholeBDPartExist2 = function (section, bdpart) {

            var returnValue = false;

            if ($scope.report) {
                if ($scope.report.data) {

                    //if ($scope.report.data.selectinjuries) {

                        //for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {

                            //var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];
                            if ($scope.report.data[section + bdpart.concateId]) {
                                angular.forEach($scope.report.data[section + bdpart.concateId], function (value, key) {

                                    if (!returnValue) {
                                        if (key!='treatcurrentradio' && (value && value.length > 0)) {											
											returnValue = true;											                                           
                                        }
                                    }
                                });
                            }
                        //}
                    //}
                }
            }

            return returnValue;
        };

        //Added by Unais dated 31-01-2015 for handling disable radio button for PR2
        $scope.checkWholeBDPartExistPr2 = function (section) {

            var returnValue = false;

            if ($scope.report) {
                if ($scope.report.data) {

                    if ($scope.report.data.selectinjuries) {

                        for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {

                            var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];
                            if ($scope.report.data[section + bodypart.concateId]) {
                                angular.forEach($scope.report.data[section + bodypart.concateId], function (value, key) {

                                    if (!returnValue) {
                                        if ((value && value.length > 0) && ($scope.report.data[section + bodypart.concateId].disableradio != 1 && $scope.report.data[section + bodypart.concateId].disableradio != 'No')) {
                                            returnValue = true;
                                        }
                                    }

                                });
                            }
                        }
                    }
                }
            }

            return returnValue;
        };

        $scope.checkWholeBDPartExistPR2 = function (section) {
            var returnValue = false;
            if ($scope.report) {
                if ($scope.report.data) {

                    if ($scope.report.data.selectinjuries) {

                        for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {

                            var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];
                            if (bodypart.bodysystem != 'Other') {
                                if ($scope.report.data[section + bodypart.concateId]) {
                                    angular.forEach($scope.report.data[section + bodypart.concateId], function (value, key) {
                                        if (!returnValue) {
                                            if (key != 'treatcurrentradio') {
                                                if (value && value.length > 0) {
                                                    returnValue = true;
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
            }

            return returnValue;
        };

        $scope.objectivefindingsCoverpage = function () {

            $scope.ofValue = false;
            var returnValue = false;
            if ($scope.report) {
                if ($scope.report.data) {

                    if ($scope.report.data['objectivefindingsgeneral']) {
                        if ($scope.report.data['objectivefindingsgeneral']['OfGeneral'] && $scope.report.data['objectivefindingsgeneral']['OfGeneral'] != 'Choose') {
                            $scope.ofValue = true;
                            returnValue = true;
                        }
                    }
                    if (!$scope.ofValue) {
                        angular.forEach($scope.report.data['objectivefindingsgait'], function (value, key) {

                            if (!$scope.OfValue) {
                                if (value && value.length > 0) {
                                    $scope.ofValue = true;
                                    returnValue = true;
                                }
                            }
                        });
                    }
                    if (!$scope.ofValue) {
                        angular.forEach($scope.report.data['objectivefindings'], function (value, key) {

                            if (!$scope.OfValue && key != 'OfTempratureRadio') {
                                if (value && value.length > 0 && value != 'Choose') {
                                    $scope.ofValue = true;
                                    returnValue = true;
                                }
                            }
                        });
                    }
                    if (!$scope.ofValue) {
                        if ($scope.report.data.selectinjuries) {
                            for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                                var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];

                                if ($scope.report.data['objectivefindings' + bodypart.concateId]) {

                                    angular.forEach($scope.report.data['objectivefindings' + bodypart.concateId], function (value, key) {
                                        if (!$scope.ofValue) {
                                            if (value && value.length > 0 && value != 'Choose') {
                                                $scope.ofValue = true;
                                                returnValue = true;
                                            }
                                        }
                                    });

                                }
                            }
                        }
                    }
                }
                return returnValue;
            }
        };

        //Added by Unais dated 31-01-2015 for handling disable radio button for PR2
        $scope.objectivefindingsCoverpagePr2 = function () {

            $scope.ofValue = false;
            var returnValue = false;
            if ($scope.report) {
                if ($scope.report.data) {

                    if ($scope.report.data['objectivefindingsgeneral']) {
                        if (($scope.report.data['objectivefindingsgeneral']['OfGeneral'] && $scope.report.data['objectivefindingsgeneral']['OfGeneral'] != 'Choose') && ($scope.report.data['objectivefindingsgeneral'].disableradio != 1 && $scope.report.data['objectivefindingsgeneral'].disableradio != 'No')) {
                            $scope.ofValue = true;
                            returnValue = true;
                        }
                    }
                    if (!$scope.ofValue) {
                        angular.forEach($scope.report.data['objectivefindingsgait'], function (value, key) {

                            if (!$scope.OfValue) {
                                if ((value && value.length > 0) && ($scope.report.data['objectivefindingsgait'].disableradio != 1 && $scope.report.data['objectivefindingsgait'].disableradio != 'No')) {
                                    $scope.ofValue = true;
                                    returnValue = true;
                                }
                            }
                        });
                    }
                    if (!$scope.ofValue) {
                        angular.forEach($scope.report.data['objectivefindings'], function (value, key) {

                            if (!$scope.OfValue && key != 'OfTempratureRadio') {
                                if ((value && value.length > 0 && value != 'Choose')) {
                                    $scope.ofValue = true;
                                    returnValue = true;
                                }
                            }
                        });
                    }
                    if ($scope.report.data['objectivefindingsgeneral']) {
                        if (($scope.report.data['objectivefindingsgeneral']['objfindingstxtSummary'] && $scope.report.data['objectivefindingsgeneral']['objfindingstxtSummary'] != '') && ($scope.report.data['objectivefindingsgeneral'].disableradio != 1 && $scope.report.data['objectivefindingsgeneral'].disableradio != 'No')) {
                            $scope.ofValue = true;
                            returnValue = true;
                        }
                    }
                    if (!$scope.ofValue) {
                        if ($scope.report.data.selectinjuries) {
                            for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                                var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];

                                if ($scope.report.data['objectivefindings' + bodypart.concateId]) {

                                    angular.forEach($scope.report.data['objectivefindings' + bodypart.concateId], function (value, key) {
                                        if (!$scope.ofValue) {
                                            if ((value && value.length > 0 && value != 'Choose') && ($scope.report.data['objectivefindings' + bodypart.concateId].disableradio != 1 && $scope.report.data['objectivefindings' + bodypart.concateId].disableradio != 'No')) {
                                                $scope.ofValue = true;
                                                returnValue = true;
                                            }
                                        }
                                    });

                                }
                            }
                        }
                    }
                }
                return returnValue;
            }
        };
		
		$scope.objectivefindingsCoverpagePr2V4 = function () {

           $scope.ofValue = false;
            var returnValue = false;
            if ($scope.report) {
                if ($scope.report.data) {

                    if ($scope.report.data['objectivefindingsgeneral']) {
                        if (($scope.report.data['objectivefindingsgeneral']['objfindingsrdoComment'] && $scope.report.data['objectivefindingsgeneral']['objfindingsrdoComment'] != '') && ($scope.report.data['objectivefindingsgeneral'].disableradio != 1 && $scope.report.data['objectivefindingsgeneral'].disableradio != 'No')) {
                            $scope.ofValue = true;
                            returnValue = true;
                        }
                    }
                    if (!$scope.ofValue) {
                        angular.forEach($scope.report.data['objectivefindingsgait'], function (value, key) {

                            if (!$scope.OfValue) {
                                if ((value && value.length > 0) && ($scope.report.data['objectivefindingsgait'].disableradio != 1 && $scope.report.data['objectivefindingsgait'].disableradio != 'No')) {
                                    $scope.ofValue = true;
                                    returnValue = true;
                                }
                            }
                        });
                    }
                    if (!$scope.ofValue) {
                        angular.forEach($scope.report.data['objectivefindings'], function (value, key) {

                            if (!$scope.OfValue && key != 'OfTempratureRadio') {
                                if ((value && value.length > 0 && value != 'Choose')) {
                                    $scope.ofValue = true;
                                    returnValue = true;
                                }
                            }
                        });
                    }
                    if ($scope.report.data['objectivefindingsgeneral']) {
                        if (($scope.report.data['objectivefindingsgeneral']['objfindingstxtSummary'] && $scope.report.data['objectivefindingsgeneral']['objfindingstxtSummary'] != '') && ($scope.report.data['objectivefindingsgeneral'].disableradio != 1 && $scope.report.data['objectivefindingsgeneral'].disableradio != 'No')) {
                            $scope.ofValue = true;
                            returnValue = true;
                        }
                    }
                    if (!$scope.ofValue) {
                        if ($scope.report.data.selectinjuries) {
                            for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                                var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];

                                if ($scope.report.data['objectivefindings' + bodypart.concateId]) {

                                    angular.forEach($scope.report.data['objectivefindings' + bodypart.concateId], function (value, key) {
                                        if (!$scope.ofValue) {
                                            if ((value && value.length > 0 && value != 'Choose') && ($scope.report.data['objectivefindings' + bodypart.concateId].disableradio != 1 && $scope.report.data['objectivefindings' + bodypart.concateId].disableradio != 'No')) {
                                                $scope.ofValue = true;
                                                returnValue = true;
                                            }
                                        }
                                    });

                                }
                            }
                        }
                    }
                }
                return returnValue;
            }
        };

        $scope.objectivefindingsGeneralMain = function () {

            $scope.ofValue = false;
            var returnValue = false;
            if ($scope.report) {
                if ($scope.report.data) {

                    if ($scope.report.data['objectivefindingsgeneral']) {
                        if ($scope.report.data['objectivefindingsgeneral']['OfGeneral'])
						{
							if ($scope.report.data['objectivefindingsgeneral']['OfGeneral'] && $scope.report.data['objectivefindingsgeneral']['OfGeneral'] != 'Choose') {
								$scope.ofValue = true;
								returnValue = true;
							}
						}	
                    }

                    if (!$scope.ofValue) {
                        angular.forEach($scope.report.data['objectivefindings'], function (value, key) {

                            if (!$scope.OfValue && key != 'OfTempratureRadio') {
                                if (value && value.length > 0 && value != 'Choose') {
                                    $scope.ofValue = true;
                                    returnValue = true;
                                }
                            }
                        });
                    }
                }
                return returnValue;
            }
        };
		
		$scope.objectivefindingsGeneralMainV4 = function () {

            $scope.ofValue = false;
            var returnValue = false;
            if ($scope.report) {
                if ($scope.report.data) {

                    if ($scope.report.data['objectivefindingsgeneral']) {
                        if ($scope.report.data['objectivefindingsgeneral']['OfGeneral'])
						{
							if ($scope.report.data['objectivefindingsgeneral']['OfGeneral'] && $scope.report.data['objectivefindingsgeneral']['OfGeneral'] != 'Choose') {
								$scope.ofValue = true;
								returnValue = true;
							}
						}	
                    }

                    //if (!$scope.ofValue) {
                        angular.forEach($scope.report.data['objectivefindings'], function (value, key) {

                            if (!$scope.OfValue && key != 'OfTempratureRadio') {
                                if (value && value.length > 0 && value != 'Choose') {
                                    $scope.ofValue = true;
                                    returnValue = true;
                                }
                            }
                        });
                    //}
                }
                return returnValue;
            }
        };

        $scope.appendPeriod = function (data) {

            if (data) {
                if (data.length > 0) {

                    var removedPtags = data.replace(/(<p>|<\/p>|&nbsp;)/g, "");
                    var cleanText = data.replace(/<\/?[^>]+(>|$)/g, "");
                    cleanText = cleanText.replace(/&nbsp;/g, '').trim();
                    var lastChar = cleanText.substr(cleanText.length - 1);
                    var form_replacechar = (String(removedPtags).replace(/<[^>]+>/gm, ''));
                    var to_replacechar = form_replacechar.substring(0, 1).toUpperCase() + form_replacechar.substring(1);
                    removedPtags = removedPtags.replace(form_replacechar, to_replacechar);
                    if (lastChar == '.' || lastChar == '!' || lastChar == '?' || removedPtags.trim() == "") {
                        return removedPtags.trim();
                    } else {
                        return removedPtags.trim() + '. ';
                    }
                } else {

                    return data;
                }
            }

            return '';
        };

        $scope.appendPeriodWithoutTrailingSpace = function (data) {

            if (data) {
                if (data.length > 0) {

                    var removedPtags = data.replace(/(<p>|<\/p>|&nbsp;)/g, "");
                    var cleanText = data.replace(/<\/?[^>]+(>|$)/g, "");
                    cleanText = cleanText.replace(/&nbsp;/g, '').trim();
                    var lastChar = cleanText.substr(cleanText.length - 1);
                    var form_replacechar = (String(removedPtags).replace(/<[^>]+>/gm, ''));
                    var to_replacechar = form_replacechar.substring(0, 1).toUpperCase() + form_replacechar.substring(1);
                    removedPtags = removedPtags.replace(form_replacechar, to_replacechar);
                    if (lastChar == '.' || lastChar == '!' || lastChar == '?') {
                        return removedPtags.trim();
                    } else {
                        return removedPtags.trim() + '.';
                    }
                } else {

                    return data;
                }
            }

            return '';
        };

        $scope.checkExist = function (item, section) {
            if ($scope.report) {
                var isSectiondataExist = false;
                if ($scope.report.data[section + item.concateId]) {
                    angular.forEach($scope.report.data[section + item.concateId], function (val, k) {

                        if (val.length > 0 && !isSectiondataExist) {
                            isSectiondataExist = true;
                        }
                    });

                    return isSectiondataExist;
                }
            }
        };

        $scope.checkExistSkin = function (item, section) {

            if ($scope.report) {
                var isSectiondataExist = false;
                if (item.bdsides != 'none' && item.bdsides != '' && item.bdsides != 'n/a') {
                    if ($scope.report.data[section + item.id + item.bdsides]) {
                        if ($scope.report.data[section + item.id + item.bdsides].btnMode == 'Comment' || $scope.report.data[section + item.id + item.bdsides].btnMode == 'Normal') {
                            isSectiondataExist = true;
                            return isSectiondataExist;
                        }
                    }
                }
                else {
                    if ($scope.report.data[section + item.id]) {
                        if ($scope.report.data[section + item.id].btnMode == 'Comment' || $scope.report.data[section + item.id].btnMode == 'Normal') {
                            isSectiondataExist = true;
                            return isSectiondataExist;
                        }
                    }
                }
            }
        };

        $scope.checkExistById = function (item, section, id) {
             
            if ($scope.report) {
                var isSectiondataExist = false;
                if ($scope.report.data[section + item.concateId]) {

                    angular.forEach($scope.report.data[section + item.concateId], function (val, k) {
                        if ($scope.report.data[section + item.concateId][id]) {
                            if ($scope.report.data[section + item.concateId][id].length > 0 && !isSectiondataExist) {
                                isSectiondataExist = true;
                            }
                        }
                    });

                    return isSectiondataExist;
                }
            }
        };

        $scope.findbodysystem = function (data) {
            if ($scope.report) {
                if ($scope.report.data.selectinjuries) {
                    return eval("$filter('filter')($scope.report.data['selectinjuries'].sibodypart, { bodysystem: data }).length > 0");
                }
            }
        };

        $scope.findbodypart = function (bdpart) {           
            if ($scope.report) {
                if ($scope.report.data.selectinjuries) {
                    return eval("$filter('filter')($scope.report.data['selectinjuries'].sibodypart, { id: bdpart }).length > 0");
                }
            }
        };

        $scope.checkIfReadyForRating = function (bdpart) {
            
            
            if ($cookies.formType == 'pr4') {
                var j = 0
                if (typeof $scope.report.data.selectinjuries != 'undefined') {
                    //var newdata = $scope.report.data.selectinjuries.sibodypart;

                    //var bdpart = eval("$filter('filter')($scope.report.data['selectinjuries'].sibodypart, { concateId: currentId })");                                       

                    if (bdpart.ratebodypart == true) {
                        if (typeof bdpart.dateOfRating == "undefined" || bdpart.dateOfRating == '') {
                            return false;
                        }
                    }

                    if (typeof bdpart.ratebodyYesNoRadio != "undefined") {
                        if (bdpart.ratebodyYesNoRadio == 'Yes') {
                            return true;
                        }
                    }
                }
                return false;
            }
			else
				return true;
        };
		
		$scope.checkIfReadyForRatingById = function (bdpartid) {
			 
            return "($scope.report.data['selectinjuries'].concatedbodypart, {'concateId' : '" + bdpartid + "', 'ratebodyYesNoRadio': 'Yes'}).ratebodyYesNoRadio=='Yes'";
        };

        $scope.getAge = function (dateString) {
            var today = new Date();
            var birthDate = new Date(dateString);
            var age = today.getFullYear() - birthDate.getFullYear();
            var m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        };

        $scope.getCommmaString = function (data) {

            var returnStringArray = new Array();

            $.each(data, function (index, item) {

                if (item.value == true) {
                    returnStringArray.push(item.id);
                }
            });

            var ret_text = '';

            if (returnStringArray.length == 1)
                ret_text = returnStringArray[0].toLowerCase();
            if (returnStringArray.length > 1) {
                for (var k = 0; k < returnStringArray.length; k++) {
                    if (k == returnStringArray.length - 1)
                        ret_text = ret_text + 'and ' + returnStringArray[k].toLowerCase();
                    if (k != returnStringArray.length - 1)
                        ret_text = ret_text + returnStringArray[k].toLowerCase() + ', ';
                }
            }

            return ret_text;

        };

        $scope.getdurable = function (data) {
            var appendValue = '';
            if (eval(data) >= 1) {
                appendValue = ' (number of devices used: ' + eval(data) + ')';
            }
            return appendValue;

        };

        $scope.getCommmaStringCheck = function (data) {

            var returnStringArray = new Array();
            var captialValue = ["AFO", "KAFO", "H-Wave unit", "TENS unit"];

            angular.forEach(data, function (value, key) {
                if (value) {
                    if (eval(value).length > 0) {
                        var actualValue = eval(value);
                        var appendValue = '';

                        if (actualValue[0]) {
                            if (actualValue == 'Cane') {
                                appendValue = $scope.getdurable(report.data['relevantmedicalsocialhistory'].durableMedicalCaneSelect);
                            } else if (actualValue == 'Crutch') {

                                appendValue = $scope.getdurable(report.data['relevantmedicalsocialhistory'].durableMedicalCrutchSelect);
                            } else if (actualValue == 'AFO') {
                                appendValue = $scope.getdurable(report.data['relevantmedicalsocialhistory'].durableMedicalAFOSelect);
                            } else if (actualValue == 'KAFO') {
                                appendValue = $scope.getdurable(report.data['relevantmedicalsocialhistory'].durableMedicalKAFOSelect);
                            }
                        }
                        if (captialValue.indexOf(actualValue[0]) != '-1') {
                            returnStringArray.push(actualValue[0] + appendValue);
                        } else {
                            returnStringArray.push(actualValue[0].toLowerCase() + appendValue);
                        }
                    }

                }
            });

            var ret_text = '';

            if (returnStringArray.length == 1)
                ret_text = returnStringArray[0];
            if (returnStringArray.length > 1) {
                for (var k = 0; k < returnStringArray.length; k++) {

                    if (k == returnStringArray.length - 1) {
                        ret_text = ret_text + 'and ' + returnStringArray[k];
                    }
                    if (k != returnStringArray.length - 1) {
                        ret_text = ret_text + returnStringArray[k] + ', ';
                    }
                }
            }

            return ret_text;

        };

        //ADL Publish text manipulating functions
        $scope.adlText = function (section, bodypart, activity, compare) {

            var returnStringArray = new Array();

            var activities = [];

            switch (activity) {

                case 'selfcare':
                    {
                        activities = [{ 'id': 'ADLselfCareUrinBody', 'value': 'Urinating', 'subsection': 'ADLselfCare1' }, { 'id': 'ADLselfCareDefeBody', 'value': 'Defecating', 'subsection': 'ADLselfCare2' }, { 'id': 'ADLselfCareTeethBody', 'value': 'Brushing teeth', 'subsection': 'ADLselfCare3' }, { 'id': 'ADLselfCareHairBody', 'value': 'Combing hair', 'subsection': 'ADLselfCare4' }, { 'id': 'ADLselfCareDressBody', 'value': 'Dressing oneself', 'subsection': 'ADLselfCare6' }, { 'id': 'ADLselfCareBathBody', 'value': 'Bathing', 'subsection': 'ADLselfCare5' }, { 'id': 'ADLselfCareEatBody', 'value': 'Eating', 'subsection': 'ADLselfCare7' }];
                        break;
                    }
                case 'communication':
                    {
                        activities = [{ 'id': 'ADLcommWritBody', 'value': 'Writing', 'subsection': 'ADLcomm1' }, { 'id': 'ADLcommTypingBody', 'value': 'Typing', 'subsection': 'ADLcomm2' }, { 'id': 'ADLcommSeeingBody', 'value': 'Seeing', 'subsection': 'ADLcomm3' }, { 'id': 'ADLcommHearingBody', 'value': 'Hearing', 'subsection': 'ADLcomm4' }, { 'id': 'ADLcommSpeakingBody', 'value': 'Speaking', 'subsection': 'ADLcomm5' }];
                        break;
                    }
                case 'physical activity':
                    {
                        activities = [{ 'id': 'ADLPhysicalStandBody', 'value': 'Standing', 'subsection': 'ADLphysicalActivity1' }, { 'id': 'ADLPhysicalSitBody', 'value': 'Sitting', 'subsection': 'ADLphysicalActivity2' }, { 'id': 'ADLPhysicalRecliBody', 'value': 'Reclining', 'subsection': 'ADLphysicalActivity3' }, { 'id': 'ADLPhysicalWalkBody', 'value': 'Walking', 'subsection': 'ADLphysicalActivity4' }, { 'id': 'ADLPhysicalClimbBody', 'value': 'Climbing stairs', 'subsection': 'ADLphysicalActivity5' }];
                        break;
                    }
                case 'sensory function':
                    {
                        activities = [{ 'id': 'ADLsensoryHearBody', 'value': 'Hearing', 'subsection': 'ADLsensory1' }, { 'id': 'ADLsensorySeeBody', 'value': 'Seeing', 'subsection': 'ADLsensory2' }, { 'id': 'ADLsensoryTactileBody', 'value': 'Tactile feeling', 'subsection': 'ADLsensory3' }, { 'id': 'ADLsensoryTastBody', 'value': 'Tasting', 'subsection': 'ADLsensory4' }, { 'id': 'ADLsensorySmellBody', 'value': 'Smelling', 'subsection': 'ADLsensory5' }];
                        break;
                    }
                case 'non-specialized hand activites':
                    {
                        activities = [{ 'id': 'ADLnonSpecGraspBody', 'value': 'Grasping', 'subsection': 'ADLnonSpec1' }, { 'id': 'ADLnonSpecLiftBody', 'value': 'Lifting', 'subsection': 'ADLnonSpec2' }, { 'id': 'ADLnonSpecTactBody', 'value': 'Tactile discrimination', 'subsection': 'ADLnonSpec3' }];
                        break;
                    }
                case 'travel':
                    {
                        activities = [{ 'id': 'ADLtravelRidBody', 'value': 'Riding', 'subsection': 'ADLtravel1' }, { 'id': 'ADLtravelDrivBody', 'value': 'Driving', 'subsection': 'ADLtravel2' }, { 'id': 'ADLtravelFlyBody', 'value': 'Flying', 'subsection': 'ADLtravel3' }];
                        break;
                    }
                case 'sexual functioning':
                    {
                        if ($scope.report.data['bginfo'].gender == '') {
                            activities = [{ 'id': 'ADLsexualOrgaBody', 'value': 'Orgasm', 'subsection': 'ADLsexual1' }, { 'id': 'ADLsexualEjacBody', 'value': 'Ejaculation', 'subsection': 'ADLsexual2' }, { 'id': 'ADLsexualLubriBody', 'value': 'Lubrication', 'subsection': 'ADLsexual3' }, { 'id': 'ADLsexualErecBody', 'value': 'Erection', 'subsection': 'ADLsexual4' }];
                        }
                        else if ($scope.report.data['bginfo'].gender == 'Male') {
                            activities = [{ 'id': 'ADLsexualOrgaBody', 'value': 'Orgasm', 'subsection': 'ADLsexual1' }, { 'id': 'ADLsexualEjacBody', 'value': 'Ejaculation', 'subsection': 'ADLsexual2' }, { 'id': 'ADLsexualErecBody', 'value': 'Erection', 'subsection': 'ADLsexual4' }];
                        }
                        else if ($scope.report.data['bginfo'].gender == 'Female') {
                            activities = [{ 'id': 'ADLsexualOrgaBody', 'value': 'Orgasm', 'subsection': 'ADLsexual1' }, { 'id': 'ADLsexualLubriBody', 'value': 'Lubrication', 'subsection': 'ADLsexual3' }];
                        }
                        break;
                    }
                case 'sleep':
                    {
                        activities = [{ 'id': 'ADLsleepRestBody', 'value': 'Restful sleep', 'subsection': 'ADLsleep1' }, { 'id': 'ADLsleepNoctBody', 'value': 'Nocturnal sleep patterns', 'subsection': 'ADLsleep2' }];
                        break;
                    }
            }

            $.each(activities, function (index, item) {
                if ($scope.report.data[section][item.subsection] == 'Comment' && $scope.report.data[section][item.id + bodypart + 'radio'] == compare) {
                    returnStringArray.push(item.value);
                }
            });

            var ret_text = '';

            if (returnStringArray.length == 1)
                ret_text = returnStringArray[0].toLowerCase();
            if (returnStringArray.length > 1) {
                for (var k = 0; k < returnStringArray.length; k++) {
                    if (k == returnStringArray.length - 1)
                        ret_text = ret_text + 'and ' + returnStringArray[k].toLowerCase();
                    if (k != returnStringArray.length - 1)
                        ret_text = ret_text + returnStringArray[k].toLowerCase() + ', ';
                }
            }

            return ret_text;

        };

        $scope.adlCheck = function (activity) {
            if ($scope.report) {

                var returnValue = true; //return true when all the values are not equal to 'Comment'

                var activities = [];

                switch (activity) {

                    case 'selfcare':
                        {
                            activities = [{ 'id': 'ADLselfCareUrinBody', 'value': 'Urinating', 'subsection': 'ADLselfCare1' }, { 'id': 'ADLselfCareDefeBody', 'value': 'Defecating', 'subsection': 'ADLselfCare2' }, { 'id': 'ADLselfCareTeethBody', 'value': 'Brushing teeth', 'subsection': 'ADLselfCare3' }, { 'id': 'ADLselfCareHairBody', 'value': 'Combing hair', 'subsection': 'ADLselfCare4' }, { 'id': 'ADLselfCareDressBody', 'value': 'Dressing oneself', 'subsection': 'ADLselfCare6' }, { 'id': 'ADLselfCareBathBody', 'value': 'Bathing', 'subsection': 'ADLselfCare5' }, { 'id': 'ADLselfCareEatBody', 'value': 'Eating', 'subsection': 'ADLselfCare7' }];
                            break;
                        }
                    case 'communication':
                        {
                            activities = [{ 'id': 'ADLcommWritBody', 'value': 'Writing', 'subsection': 'ADLcomm1' }, { 'id': 'ADLcommTypingBody', 'value': 'Typing', 'subsection': 'ADLcomm2' }, { 'id': 'ADLcommSeeingBody', 'value': 'Seeing', 'subsection': 'ADLcomm3' }, { 'id': 'ADLcommHearingBody', 'value': 'Hearing', 'subsection': 'ADLcomm4' }, { 'id': 'ADLcommSpeakingBody', 'value': 'Speaking', 'subsection': 'ADLcomm5' }];
                            break;
                        }
                    case 'physical activity':
                        {
                            activities = [{ 'id': 'ADLPhysicalStandBody', 'value': 'Standing', 'subsection': 'ADLphysicalActivity1' }, { 'id': 'ADLPhysicalSitBody', 'value': 'Sitting', 'subsection': 'ADLphysicalActivity2' }, { 'id': 'ADLPhysicalRecliBody', 'value': 'Reclining', 'subsection': 'ADLphysicalActivity3' }, { 'id': 'ADLPhysicalWalkBody', 'value': 'Walking', 'subsection': 'ADLphysicalActivity4' }, { 'id': 'ADLPhysicalClimbBody', 'value': 'Climbing stairs', 'subsection': 'ADLphysicalActivity5' }];
                            break;
                        }
                    case 'sensory function':
                        {
                            activities = [{ 'id': 'ADLsensoryHearBody', 'value': 'Hearing', 'subsection': 'ADLsensory1' }, { 'id': 'ADLsensorySeeBody', 'value': 'Seeing', 'subsection': 'ADLsensory2' }, { 'id': 'ADLsensoryTactileBody', 'value': 'Tactile feeling', 'subsection': 'ADLsensory3' }, { 'id': 'ADLsensoryTastBody', 'value': 'Tasting', 'subsection': 'ADLsensory4' }, { 'id': 'ADLsensorySmellBody', 'value': 'Smelling', 'subsection': 'ADLsensory5' }];
                            break;
                        }
                    case 'non-specialized hand activites':
                        {
                            activities = [{ 'id': 'ADLnonSpecGraspBody', 'value': 'Grasping', 'subsection': 'ADLnonSpec1' }, { 'id': 'ADLnonSpecLiftBody', 'value': 'Lifting', 'subsection': 'ADLnonSpec2' }, { 'id': 'ADLnonSpecTactBody', 'value': 'Tactile discrimination', 'subsection': 'ADLnonSpec3' }];
                            break;
                        }
                    case 'travel':
                        {
                            activities = [{ 'id': 'ADLtravelRidBody', 'value': 'Riding', 'subsection': 'ADLtravel1' }, { 'id': 'ADLtravelDrivBody', 'value': 'Driving', 'subsection': 'ADLtravel2' }, { 'id': 'ADLtravelFlyBody', 'value': 'Flying', 'subsection': 'ADLtravel3' }];
                            break;
                        }
                    case 'sexual functioning':
                        {
                            if ($scope.report.data['bginfo'].gender == '') {
                                activities = [{ 'id': 'ADLsexualOrgaBody', 'value': 'Orgasm', 'subsection': 'ADLsexual1' }, { 'id': 'ADLsexualEjacBody', 'value': 'Ejaculation', 'subsection': 'ADLsexual2' }, { 'id': 'ADLsexualLubriBody', 'value': 'Lubrication', 'subsection': 'ADLsexual3' }, { 'id': 'ADLsexualErecBody', 'value': 'Erection', 'subsection': 'ADLsexual4' }];
                            }
                            else if ($scope.report.data['bginfo'].gender == 'Male') {
                                activities = [{ 'id': 'ADLsexualOrgaBody', 'value': 'Orgasm', 'subsection': 'ADLsexual1' }, { 'id': 'ADLsexualEjacBody', 'value': 'Ejaculation', 'subsection': 'ADLsexual2' }, { 'id': 'ADLsexualErecBody', 'value': 'Erection', 'subsection': 'ADLsexual4' }];
                            }
                            else if ($scope.report.data['bginfo'].gender == 'Female') {
                                activities = [{ 'id': 'ADLsexualOrgaBody', 'value': 'Orgasm', 'subsection': 'ADLsexual1' }, { 'id': 'ADLsexualLubriBody', 'value': 'Lubrication', 'subsection': 'ADLsexual3' }];
                            }
                            break;
                        }
                    case 'sleep':
                        {
                            activities = [{ 'id': 'ADLsleepRestBody', 'value': 'Restful sleep', 'subsection': 'ADLsleep1' }, { 'id': 'ADLsleepNoctBody', 'value': 'Nocturnal sleep patterns', 'subsection': 'ADLsleep2' }];
                            break;
                        }
                }

                $.each(activities, function (index, item) {
                    if ($scope.report.data['ActivitiesofDailyLiving'][item.subsection] == 'Comment') {
                        returnValue = false;
                    }
                });

                return returnValue;
            }
        };

        //ADL Publish text manipulating function for Flavor A
        $scope.adlTextFlavorA = function (section, bodypart, activity, compare) {
            var returnStringArray = new Array();

            var activities = [];

            switch (activity) {

                case 'selfcare':
                    {
                        activities = [{ 'id': 'ADLselfCareUrinBody', 'value': 'Urinating', 'subsection': 'ADLselfCare1' }, { 'id': 'ADLselfCareDefeBody', 'value': 'Defecating', 'subsection': 'ADLselfCare2' }, { 'id': 'ADLselfCareTeethBody', 'value': 'Brushing teeth', 'subsection': 'ADLselfCare3' }, { 'id': 'ADLselfCareHairBody', 'value': 'Combing hair', 'subsection': 'ADLselfCare4' }, { 'id': 'ADLselfCareDressBody', 'value': 'Dressing oneself', 'subsection': 'ADLselfCare6' }, { 'id': 'ADLselfCareBathBody', 'value': 'Bathing', 'subsection': 'ADLselfCare5' }, { 'id': 'ADLselfCareEatBody', 'value': 'Eating', 'subsection': 'ADLselfCare7' }];
                        break;
                    }
                case 'communication':
                    {
                        activities = [{ 'id': 'ADLcommWritBody', 'value': 'Writing', 'subsection': 'ADLcomm1' }, { 'id': 'ADLcommTypingBody', 'value': 'Typing', 'subsection': 'ADLcomm2' }, { 'id': 'ADLcommSeeingBody', 'value': 'Seeing', 'subsection': 'ADLcomm3' }, { 'id': 'ADLcommHearingBody', 'value': 'Hearing', 'subsection': 'ADLcomm4' }, { 'id': 'ADLcommSpeakingBody', 'value': 'Speaking', 'subsection': 'ADLcomm5' }];
                        break;
                    }
                case 'physical activity':
                    {
                        activities = [{ 'id': 'ADLPhysicalStandBody', 'value': 'Standing', 'subsection': 'ADLphysicalActivity1' }, { 'id': 'ADLPhysicalSitBody', 'value': 'Sitting', 'subsection': 'ADLphysicalActivity2' }, { 'id': 'ADLPhysicalRecliBody', 'value': 'Reclining', 'subsection': 'ADLphysicalActivity3' }, { 'id': 'ADLPhysicalWalkBody', 'value': 'Walking', 'subsection': 'ADLphysicalActivity4' }, { 'id': 'ADLPhysicalClimbBody', 'value': 'Climbing stairs', 'subsection': 'ADLphysicalActivity5' }];
                        break;
                    }
                case 'sensory function':
                    {
                        activities = [{ 'id': 'ADLsensoryHearBody', 'value': 'Hearing', 'subsection': 'ADLsensory1' }, { 'id': 'ADLsensorySeeBody', 'value': 'Seeing', 'subsection': 'ADLsensory2' }, { 'id': 'ADLsensoryTactileBody', 'value': 'Tactile feeling', 'subsection': 'ADLsensory3' }, { 'id': 'ADLsensoryTastBody', 'value': 'Tasting', 'subsection': 'ADLsensory4' }, { 'id': 'ADLsensorySmellBody', 'value': 'Smelling', 'subsection': 'ADLsensory5' }];
                        break;
                    }
                case 'non-specialized hand activites':
                    {
                        activities = [{ 'id': 'ADLnonSpecGraspBody', 'value': 'Grasping', 'subsection': 'ADLnonSpec1' }, { 'id': 'ADLnonSpecLiftBody', 'value': 'Lifting', 'subsection': 'ADLnonSpec2' }, { 'id': 'ADLnonSpecTactBody', 'value': 'Tactile discrimination', 'subsection': 'ADLnonSpec3' }];
                        break;
                    }
                case 'travel':
                    {
                        activities = [{ 'id': 'ADLtravelRidBody', 'value': 'Riding', 'subsection': 'ADLtravel1' }, { 'id': 'ADLtravelDrivBody', 'value': 'Driving', 'subsection': 'ADLtravel2' }, { 'id': 'ADLtravelFlyBody', 'value': 'Flying', 'subsection': 'ADLtravel3' }];
                        break;
                    }
                case 'sexual functioning':
                    {
                        if ($scope.report.data['bginfo'].gender == '') {
                            activities = [{ 'id': 'ADLsexualOrgaBody', 'value': 'Orgasm', 'subsection': 'ADLsexual1' }, { 'id': 'ADLsexualEjacBody', 'value': 'Ejaculation', 'subsection': 'ADLsexual2' }, { 'id': 'ADLsexualLubriBody', 'value': 'Lubrication', 'subsection': 'ADLsexual3' }, { 'id': 'ADLsexualErecBody', 'value': 'Erection', 'subsection': 'ADLsexual4' }];
                        }
                        else if ($scope.report.data['bginfo'].gender == 'Male') {
                            activities = [{ 'id': 'ADLsexualOrgaBody', 'value': 'Orgasm', 'subsection': 'ADLsexual1' }, { 'id': 'ADLsexualEjacBody', 'value': 'Ejaculation', 'subsection': 'ADLsexual2' }, { 'id': 'ADLsexualErecBody', 'value': 'Erection', 'subsection': 'ADLsexual4' }];
                        }
                        else if ($scope.report.data['bginfo'].gender == 'Female') {
                            activities = [{ 'id': 'ADLsexualOrgaBody', 'value': 'Orgasm', 'subsection': 'ADLsexual1' }, { 'id': 'ADLsexualLubriBody', 'value': 'Lubrication', 'subsection': 'ADLsexual3' }];
                        }
                        break;
                    }
                case 'sleep':
                    {
                        activities = [{ 'id': 'ADLsleepRestBody', 'value': 'Restful sleep', 'subsection': 'ADLsleep1' }, { 'id': 'ADLsleepNoctBody', 'value': 'Nocturnal sleep patterns', 'subsection': 'ADLsleep2' }];
                        break;
                    }
            }

            $.each(activities, function (index, item) {
                if ($scope.report.data[section][item.subsection] == 'Comment' && $scope.report.data[section][item.id + bodypart + 'radio'] == compare) {
                    returnStringArray.push(item.value);
                }
            });

            var ret_text = '';

            if (returnStringArray.length == 1) {
                ret_text = 'activity of ' + returnStringArray[0].toLowerCase();
            }
            else if (returnStringArray.length > 1) {
                ret_text = 'activities of ';
                for (var k = 0; k < returnStringArray.length; k++) {
                    if (k == returnStringArray.length - 1)
                        ret_text = ret_text + 'and ' + returnStringArray[k].toLowerCase();
                    if (k != returnStringArray.length - 1)
                        ret_text = ret_text + returnStringArray[k].toLowerCase() + ', ';
                }
            }
            return ret_text;

        };

        //ADL Publish text manipulating function for Flavor B
        $scope.adlTextFlavorB = function (section, bodypart, activity, compare) {
            var returnStringArray = new Array();

            var activities = [];

            switch (activity) {

                case 'selfcare':
                    {
                        activities = [{ 'id': 'ADLselfCareUrinBody', 'value': 'Urinating', 'subsection': 'ADLselfCare1' }, { 'id': 'ADLselfCareDefeBody', 'value': 'Defecating', 'subsection': 'ADLselfCare2' }, { 'id': 'ADLselfCareTeethBody', 'value': 'Brushing teeth', 'subsection': 'ADLselfCare3' }, { 'id': 'ADLselfCareHairBody', 'value': 'Combing hair', 'subsection': 'ADLselfCare4' }, { 'id': 'ADLselfCareDressBody', 'value': 'Dressing oneself', 'subsection': 'ADLselfCare6' }, { 'id': 'ADLselfCareBathBody', 'value': 'Bathing', 'subsection': 'ADLselfCare5' }, { 'id': 'ADLselfCareEatBody', 'value': 'Eating', 'subsection': 'ADLselfCare7' }];
                        break;
                    }
                case 'communication':
                    {
                        activities = [{ 'id': 'ADLcommWritBody', 'value': 'Writing', 'subsection': 'ADLcomm1' }, { 'id': 'ADLcommTypingBody', 'value': 'Typing', 'subsection': 'ADLcomm2' }, { 'id': 'ADLcommSeeingBody', 'value': 'Seeing', 'subsection': 'ADLcomm3' }, { 'id': 'ADLcommHearingBody', 'value': 'Hearing', 'subsection': 'ADLcomm4' }, { 'id': 'ADLcommSpeakingBody', 'value': 'Speaking', 'subsection': 'ADLcomm5' }];
                        break;
                    }
                case 'physical activity':
                    {
                        activities = [{ 'id': 'ADLPhysicalStandBody', 'value': 'Standing', 'subsection': 'ADLphysicalActivity1' }, { 'id': 'ADLPhysicalSitBody', 'value': 'Sitting', 'subsection': 'ADLphysicalActivity2' }, { 'id': 'ADLPhysicalRecliBody', 'value': 'Reclining', 'subsection': 'ADLphysicalActivity3' }, { 'id': 'ADLPhysicalWalkBody', 'value': 'Walking', 'subsection': 'ADLphysicalActivity4' }, { 'id': 'ADLPhysicalClimbBody', 'value': 'Climbing stairs', 'subsection': 'ADLphysicalActivity5' }];
                        break;
                    }
                case 'sensory function':
                    {
                        activities = [{ 'id': 'ADLsensoryHearBody', 'value': 'Hearing', 'subsection': 'ADLsensory1' }, { 'id': 'ADLsensorySeeBody', 'value': 'Seeing', 'subsection': 'ADLsensory2' }, { 'id': 'ADLsensoryTactileBody', 'value': 'Tactile feeling', 'subsection': 'ADLsensory3' }, { 'id': 'ADLsensoryTastBody', 'value': 'Tasting', 'subsection': 'ADLsensory4' }, { 'id': 'ADLsensorySmellBody', 'value': 'Smelling', 'subsection': 'ADLsensory5' }];
                        break;
                    }
                case 'non-specialized hand activites':
                    {
                        activities = [{ 'id': 'ADLnonSpecGraspBody', 'value': 'Grasping', 'subsection': 'ADLnonSpec1' }, { 'id': 'ADLnonSpecLiftBody', 'value': 'Lifting', 'subsection': 'ADLnonSpec2' }, { 'id': 'ADLnonSpecTactBody', 'value': 'Tactile discrimination', 'subsection': 'ADLnonSpec3' }];
                        break;
                    }
                case 'travel':
                    {
                        activities = [{ 'id': 'ADLtravelRidBody', 'value': 'Riding', 'subsection': 'ADLtravel1' }, { 'id': 'ADLtravelDrivBody', 'value': 'Driving', 'subsection': 'ADLtravel2' }, { 'id': 'ADLtravelFlyBody', 'value': 'Flying', 'subsection': 'ADLtravel3' }];
                        break;
                    }
                case 'sexual functioning':
                    {
                        if ($scope.report.data['bginfo'].gender == '') {
                            activities = [{ 'id': 'ADLsexualOrgaBody', 'value': 'Orgasm', 'subsection': 'ADLsexual1' }, { 'id': 'ADLsexualEjacBody', 'value': 'Ejaculation', 'subsection': 'ADLsexual2' }, { 'id': 'ADLsexualLubriBody', 'value': 'Lubrication', 'subsection': 'ADLsexual3' }, { 'id': 'ADLsexualErecBody', 'value': 'Erection', 'subsection': 'ADLsexual4' }];
                        }
                        else if ($scope.report.data['bginfo'].gender == 'Male') {
                            activities = [{ 'id': 'ADLsexualOrgaBody', 'value': 'Orgasm', 'subsection': 'ADLsexual1' }, { 'id': 'ADLsexualEjacBody', 'value': 'Ejaculation', 'subsection': 'ADLsexual2' }, { 'id': 'ADLsexualErecBody', 'value': 'Erection', 'subsection': 'ADLsexual4' }];
                        }
                        else if ($scope.report.data['bginfo'].gender == 'Female') {
                            activities = [{ 'id': 'ADLsexualOrgaBody', 'value': 'Orgasm', 'subsection': 'ADLsexual1' }, { 'id': 'ADLsexualLubriBody', 'value': 'Lubrication', 'subsection': 'ADLsexual3' }];
                        }
                        break;
                    }
                case 'sleep':
                    {
                        activities = [{ 'id': 'ADLsleepRestBody', 'value': 'Restful sleep', 'subsection': 'ADLsleep1' }, { 'id': 'ADLsleepNoctBody', 'value': 'Nocturnal sleep patterns', 'subsection': 'ADLsleep2' }];
                        break;
                    }
            }

            $.each(activities, function (index, item) {
                if ($scope.report.data[section][item.subsection] == 'Comment' && $scope.report.data[section][item.id + bodypart + 'radio'] == compare) {
                    returnStringArray.push(item.value);
                }
            });

            var ret_text = '';

            if (returnStringArray.length == 1) {
                if (compare == 'Cannot perform activity at all')
                    ret_text = 'The activity of ' + returnStringArray[0].toLowerCase() + ' is limited by the ';
                else if (compare == 'Only Pain')
                    ret_text = 'The activity of ' + returnStringArray[0].toLowerCase() + ' causes pain to the ';
                else if (compare == 'No limitations')
                    ret_text = 'neither limits nor causes pain during the activity of ' + returnStringArray[0].toLowerCase();
            }
            else if (returnStringArray.length > 1) {
                if (compare == 'Cannot perform activity at all') {
                    ret_text = 'The activities of ';
                    for (var k = 0; k < returnStringArray.length; k++) {
                        if (k == returnStringArray.length - 1)
                            ret_text = ret_text + 'and ' + returnStringArray[k].toLowerCase();
                        if (k != returnStringArray.length - 1)
                            ret_text = ret_text + returnStringArray[k].toLowerCase() + ', ';
                    }
                    ret_text = ret_text + ' are limited by the ';
                }
                else if (compare == 'Only Pain') {
                    ret_text = 'The activities of ';
                    for (var k = 0; k < returnStringArray.length; k++) {
                        if (k == returnStringArray.length - 1)
                            ret_text = ret_text + 'and ' + returnStringArray[k].toLowerCase();
                        if (k != returnStringArray.length - 1)
                            ret_text = ret_text + returnStringArray[k].toLowerCase() + ', ';
                    }
                    ret_text = ret_text + ' cause pain to the ';
                }
                else if (compare == 'No limitations') {
                    ret_text = 'neither limits nor cause pain during the activities of ';
                    for (var k = 0; k < returnStringArray.length; k++) {
                        if (k == returnStringArray.length - 1)
                            ret_text = ret_text + 'and ' + returnStringArray[k].toLowerCase();
                        if (k != returnStringArray.length - 1)
                            ret_text = ret_text + returnStringArray[k].toLowerCase() + ', ';
                    }
                }
            }
            return ret_text;
        };

        //Makes sentence from the input string
        $scope.makeSentence = function (input) {
            // 
            var ret_text = '';
            var arr = input.split('~');
            var arr2 = new Array();

            for (var k = 0; k < arr.length; k++) {
                if (arr[k] != '' && arr[k] != 'false')
                    arr2.push(arr[k]);
            }

            if (arr2.length == 0)
                return ret_text;
            if (arr2.length == 1) {
                if (arr2[0] == 'TENS unit' || arr2[0] == 'H-Wave unit' || arr2[0] == 'AFO' || arr2[0] == 'KAFO') {
                    ret_text = arr2[0] + '.';
                } else {
                    ret_text = arr2[0].toLowerCase() + '.';
                }
            }
            if (arr2.length > 1) {
                for (var k = 0; k < arr2.length; k++) {
                    if (arr2[k] != '') {
                        if (k == arr2.length - 1) {
                            if (arr2[k] == 'TENS unit' || arr2[k] == 'H-Wave unit' || arr2[k] == 'AFO' || arr2[k] == 'KAFO') {
                                ret_text = ret_text + 'and ' + arr2[k] + '.';
                            } else {
                                ret_text = ret_text + 'and ' + arr2[k].toLowerCase() + '.';
                            }

                        }
                        if (k != arr2.length - 1) {
                            if (arr2[k] == 'TENS unit' || arr2[k] == 'H-Wave unit' || arr2[k] == 'AFO' || arr2[k] == 'KAFO') {
                                ret_text = ret_text + arr2[k] + ', ';
                            } else {
                                ret_text = ret_text + arr2[k].toLowerCase() + ', ';
                            }

                        }
                    }
                }
            }

            return ret_text;
        };

        $scope.makeStatementNevi = function (input) {

            var ret_text = '';
            var arr = input.split('~');
            var arr2 = new Array();

            for (var k = 0; k < arr.length; k++) {
                if (arr[k] != '' && arr[k] != 'false')
                    arr2.push(arr[k].toLowerCase());
            }

            if (arr2.length == 0)
                return ret_text.charAt(0).toUpperCase() + ret_text.slice(1).toLowerCase();
            if (arr2.length == 1) {
                ret_text = arr2[0] + ' ';
            }
            if (arr2.length > 1) {
                for (var k = 0; k < arr2.length; k++) {
                    if (arr2[k] != '') {
                        if (k == arr2.length - 1) {
                            ret_text = ret_text + 'and ' + arr2[k] + ' ';
                        }
                        if (k != arr2.length - 1) {
                            ret_text = ret_text + arr2[k] + ', ';
                        }
                    }
                }
            }
            return ret_text.charAt(0).toUpperCase() + ret_text.slice(1).toLowerCase();
        };

        $scope.makeKneeSentence = function (data) {

            var returnStringArray = new Array();

            $.each(data, function (index, item) {
                if (item.subsection != '') {
                    returnStringArray.push(item.section + '; ' + item.subsection);
                } else {
                    returnStringArray.push(item.section);
                }
            });

            var ret_text = '';

            if (returnStringArray.length == 1)
                ret_text = returnStringArray[0].toLowerCase();
            if (returnStringArray.length > 1) {
                for (var k = 0; k < returnStringArray.length; k++) {
                    if (k == returnStringArray.length - 1)
                        ret_text = ret_text + 'and ' + returnStringArray[k].toLowerCase();
                    if (k != returnStringArray.length - 1)
                        ret_text = ret_text + returnStringArray[k].toLowerCase() + ', ';
                }
            }

            return ret_text;


        };

        $scope.makeKneeSentence2 = function (data) {
            var returnStringArray = new Array();

            $.each(data, function (index, item) {
                if (item.section != undefined) {
                    if (item.section != '' && item.section != undefined && item.section != 'undefined' && item.section != 'false' && item.section != false) {
                        if (item.subsection != '' && item.subsection != 'false' && item.subsection != false && item.subsection != 'undefined' && item.subsection != undefined) {

                            //Replaced the above four lines of code by Unais dated 16-Feb-2015 with below one as per suggestion of the client to reverse the punctuations
                            //if (item.subsection.split(' ')[0] == 'With' || item.subsection.split(' ')[0] == 'Without') {

                            //returnStringArray.push(item.section + ', ' + item.subsection.charAt(0).toLowerCase() + item.subsection.slice(1));
                            if (item.section.split(' ').length == 2)
                                returnStringArray.push(item.section.split(' ')[0] + ' ' + item.section.split(' ')[1].charAt(0).toLowerCase() + item.section.split(' ')[1].slice(1) + ', ' + item.subsection.charAt(0).toLowerCase() + item.subsection.slice(1));
                            else
                                returnStringArray.push(item.section + ', ' + item.subsection.toLowerCase());
                            //}
                            //else {
                            //    returnStringArray.push(item.section + ', ' + item.subsection);
                            //}
                        } else {
                            //returnStringArray.push(item.section);
                            if (item.section.split(' ').length == 2)
                                returnStringArray.push(item.section.split(' ')[0] + ' ' + item.section.split(' ')[1].charAt(0).toLowerCase() + item.section.split(' ')[1].slice(1));
                            else
                                returnStringArray.push(item.section);
                        }
                    }
                }
            });

            var ret_text = '';

            if (returnStringArray.length == 1)
                ret_text = returnStringArray[0];
            if (returnStringArray.length > 1) {
                for (var k = 0; k < returnStringArray.length; k++) {

                    //Replaced the above four lines of code by Unais dated 16-Feb-2015 with below one as per suggestion of the client to reverse the punctuations
                    if (k == returnStringArray.length - 1)
                        ret_text = ret_text + returnStringArray[k];
                    if (k != returnStringArray.length - 1)
                        ret_text = ret_text + returnStringArray[k] + '. ';
                }
            }
            if (ret_text == '')
                return ret_text;
            else
                return ret_text + '.';
        };

        $scope.makeStatement = function (input) {
            var ret_text = '';
            var arr = input.split('~');
            var arr2 = new Array();

            for (var k = 0; k < arr.length; k++) {
                if (arr[k] != '' && arr[k] != 'false')
                    arr2.push(arr[k].toLowerCase());
            }

            if (arr2.length == 0)
                return ret_text;
            if (arr2.length == 1) {
                ret_text = arr2[0] + '.';
            }
            if (arr2.length > 1) {
                for (var k = 0; k < arr2.length; k++) {
                    if (arr2[k] != '') {
                        if (k == arr2.length - 1) {
                            ret_text = ret_text + 'and ' + arr2[k] + '.';
                        }
                        if (k != arr2.length - 1) {
                            ret_text = ret_text + arr2[k] + ', ';
                        }
                    }
                }
            }
            return ret_text;
        };

        //Makes sentence from the input string (with first letter as capital)
        $scope.makeSentenceCapitalizeFirst = function (input) {
            // 
            var ret_text = '';
            var arr = input.split('~');
            var arr2 = new Array();

            for (var k = 0; k < arr.length; k++) {
                if (arr[k] != '' && arr[k] != 'false')
                    arr2.push(arr[k]);
            }

            if (arr2.length == 0)
                return ret_text;
            if (arr2.length == 1) {
                if (arr2[0] == 'TENS unit' || arr2[0] == 'H-Wave unit' || arr2[0] == 'AFO' || arr2[0] == 'KAFO') {
                    ret_text = arr2[0] + '.';
                } else {
                    ret_text = arr2[0].toLowerCase() + '.';
                }
            }
            if (arr2.length > 1) {
                for (var k = 0; k < arr2.length; k++) {
                    if (arr2[k] != '') {
                        if (k == arr2.length - 1) {
                            if (arr2[k] == 'TENS unit' || arr2[k] == 'H-Wave unit' || arr2[k] == 'AFO' || arr2[k] == 'KAFO') {
                                ret_text = ret_text + 'and ' + arr2[k] + '.';
                            } else {
                                ret_text = ret_text + 'and ' + arr2[k].toLowerCase() + '.';
                            }

                        }
                        if (k != arr2.length - 1) {
                            if (arr2[k] == 'TENS unit' || arr2[k] == 'H-Wave unit' || arr2[k] == 'AFO' || arr2[k] == 'KAFO') {
                                ret_text = ret_text + arr2[k] + ', ';
                            } else {
                                ret_text = ret_text + arr2[k].toLowerCase() + ', ';
                            }

                        }
                    }
                }
            }
            ret_text = ret_text.charAt(0).toUpperCase() + ret_text.slice(1);
            return ret_text;
        };

        $scope.makePathologyStatement = function (input) {

            var ret_text = '';
            var arr = input.split('~');
            var arr2 = new Array();

            for (var k = 0; k < arr.length; k++) {
                if (arr[k] != '' && arr[k] != 'false')
                    arr2.push(arr[k]);
            }

            if (arr2.length == 0)
                return ret_text.charAt(0).toUpperCase() + ret_text.slice(1).toLowerCase();
            if (arr2.length == 1) {
                ret_text = arr2[0] + ' is reported.';
            }
            //if (arr2.length == 2) {
            //    ret_text = arr2[0] + 'and ' + arr2[1] + ' are reported.';
            //}
            if (arr2.length > 1) {
                for (var k = 0; k < arr2.length; k++) {
                    if (arr2[k] != '') {
                        if (k == arr2.length - 1) {
                            ret_text = ret_text + 'and ' + arr2[k] + ' are reported.';
                        }
                        if (k != arr2.length - 1) {
                            ret_text = ret_text + arr2[k] + ', ';
                        }
                    }
                }
            }
            //return ret_text;
            return ret_text.charAt(0).toUpperCase() + ret_text.slice(1).toLowerCase();
        };

        $scope.makeSemiColonSeparatedWithPeriod = function (input, inputval) {

            var ret_text = '';
            var arr = input.split('~');
            var arr2 = new Array();
            var arr3 = inputval.split('~');
            var arr4 = new Array();

            for (var k = 0; k < arr.length; k++) {
                if (arr[k] != '' && arr[k] != 'false')
                    arr2.push(arr[k]);
            }

            for (var k = 0; k < arr3.length; k++) {
                if (arr[k] != 'false')// || arr3[k] != '')
                    arr4.push(arr3[k]);
            }

            if (arr4.length == 0)
                return ret_text;
            if (arr4.length == 1) {
                ret_text = arr4[0] + '.';
            }
            //if (arr4.length == 2) {
            //    ret_text = arr4[0] + '; ' + arr4[1] + '.';
            //}
            if (arr4.length > 1) {
                for (var k = 0; k < arr4.length; k++) {
                    if (arr4[k] != '') {
                        if (k == arr4.length - 1) {
                            ret_text = ret_text + arr4[k] + '.';
                        }
                        if (k != arr4.length - 1) {
                            ret_text = ret_text + arr4[k] + '; ';
                        }
                    }
                }
            }
            return ret_text;
        };

        $scope.treatmentCoverPage = function () {
            if ($scope.report) {
                if ($scope.report.data.selectinjuries) {
                    var NoCount = 0;
                    for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                        var concateId = $scope.report.data.selectinjuries.concatedbodypart[i].concateId;
                        var a = $scope.report.data['treatment' + concateId];
                        if ($scope.report.data['treatment' + concateId]) {

                            if ($scope.report.data['treatment' + concateId].treatcurrentradio == 'Yes') {
                                return true;
                            }
                            if ($scope.report.data['treatment' + concateId].treatcurrentradio == 'No') {
                                NoCount = NoCount + 1;
                            }
                        }
                    }
                    if (NoCount == $scope.report.data.selectinjuries.concatedbodypart.length) {
                        $scope.NoCount = true;
                    }
                }
            }
        }

        $scope.workRestrictionCoverPage = function () {
            if ($scope.report) {
                if ($scope.report.data.selectinjuries) {
                    for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                        if ($scope.report.data['workrestriction']) {
                            return true;
                        }
                    }
                }
            }
        }

        //GT:RISHU 24th November 2014 Code for date format
        $scope.dateFilter = function (input) {

            if (input == null) { return ""; }

            var date = $filter('date')(new Date(input), 'dd-MMM-yyyy');
            return date;
        }

        $scope.datenewFormat = function (input) {
            if (input == null) { return ""; }

            var date = $filter('date')(new Date(input), 'MM/dd/yyyy');
            return date;
        }

        $scope.getTotalPage = function () {
            if (document.getElementById('rptHtmlData')) {
                if (document.getElementById('rptHtmlData').offsetHeight) {
                    var divHeight = document.getElementById('rptHtmlData').offsetHeight;
                    var lineHeight = parseInt(document.getElementById('rptHtmlData').style.lineHeight);
                    var lines = divHeight / lineHeight;

                    $scope.totalpages = Math.ceil(lines / 42);
                    if (!$scope.report.data.documentation) {
                        $scope.report.data.documentation = new Object();
                    }

                    if ($scope.report.data.documentation) {
                        $scope.report.data.documentation.noofpages = $scope.totalpages;
                    }
                }
            }
        }

        //old commented code
        /*   $scope.getTotalPage = function () {
              if (document.getElementById('reportHtmlData')) {
                  if (document.getElementById('reportHtmlData').offsetHeight) {
                      var divHeight = document.getElementById('reportHtmlData').offsetHeight;
                      var lineHeight = parseInt(document.getElementById('reportHtmlData').style.lineHeight);
                      var lines = divHeight / lineHeight;
  
                      $scope.totalpages = Math.ceil(lines / 42);
                      if (!$scope.report.data.documentation) {
                          $scope.report.data.documentation = new Object();
                      }
  
                      if ($scope.report.data.documentation) {
                          $scope.report.data.documentation.noofpages = $scope.totalpages;
                      }
                  }
              }
          } */

        $scope.getBillingCalPath = function () {
            /*try{
            if($rootScope.billingcalculatoromfs=="on"){
                return 'partials/billingcalculator' + $cookies.selectedStatecode + '.html';
            }else{                
                return "";
            }
        }catch(e){
           
            return "";
        }*/
            try {
                if ($scope.practiceInfo.billingcalculatoromfs == "off" && $scope.report.data.bc.length == 0) {
                   
                    $(".hide_calc_off").hide();
                }
            }
            catch (e) {
                       	
            }
            return 'partials/billingcalculator' + $cookies.selectedStatecode + '.html';
        }

        $scope.showHideBillingCal = function () {            
            try {
                if ($rootScope.billingcalculatoromfs == "on") {
                    return false;
                }
                else {
                    return true;
                }
            }
            catch (e) {
                return true;
            }
        }

        $scope.getTotal = function () {

            var total = 0;
            for (var i = 0; i < $scope.report.data.bc.length; i++) {
                if ($scope.report.data.bc[i].billing.price) {
                    var price = parseFloat($scope.report.data.bc[i].billing.price);
                    total += price;
                }
            }
            return total.toFixed(2);
        };

        //Below 3 functions used to check checkboxes on PR2 upper section
        $scope.checkNeedForSurgery = function (section) {
            var returnValue = false;
            if ($scope.report) {
                if ($scope.report.data) {

                    if ($scope.report.data.selectinjuries) {

                        for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {

                            var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];
                            //if (bodypart.bodysystem != 'Other') {
                            if ($scope.report.data[section + bodypart.concateId]) {
                                angular.forEach($scope.report.data[section + bodypart.concateId], function (value, key) {
                                    if (!returnValue) {
                                        if (key != 'treatcurrentradio' && key != 'maintextA') {
                                            if (value && value.length > 0) {
                                                returnValue = true;
                                            }
                                        }
                                    }
                                });
                            }
                            //}
                        }
                    }
                }
            }

            return returnValue;
        };


        $scope.checkTreatmentIndicated = function (section) {
            var returnValue = false;
            if ($scope.report) {
                if ($scope.report.data) {

                    if ($scope.report.data.selectinjuries) {

                        for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {

                            var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];
                            if (bodypart.bodysystem != 'Other') {
                                if ($scope.report.data[section + bodypart.concateId]) {
                                    angular.forEach($scope.report.data[section + bodypart.concateId], function (value, key) {
                                        if (!returnValue) {
                                            if (key == 'treatcurrentradio') {
                                                if (value && value.length > 0 && value == 'Yes') {
                                                    returnValue = true;
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
            }

            return returnValue;
        };

        $scope.checkReferral = function (section) {
            var returnValue = false;
            if ($scope.report) {
                if ($scope.report.data) {

                    if ($scope.report.data.selectinjuries) {

                        for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {

                            var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];
                            if (bodypart.bodysystem != 'Other') {
                                if (bodypart.id == 'thoracic') {
                                    if ($scope.report.data[section + bodypart.concateId]) {
                                        angular.forEach($scope.report.data[section + bodypart.concateId], function (value, key) {
                                            if (!returnValue) {
                                                if (key != 'treatcurrentradio') {
                                                    if (key == 'treatmentreferral' || key == 'treatmenttherapy') {
                                                        //if (typeof $scope.report.data[section + bodypart.concateId][key] == "object") {
                                                        //    angular.forEach($scope.report.data[section + bodypart.concateId][key], function (key2, value2) {
                                                        //        if (key2['othertextareaTherapytext'] !='')
                                                        //            returnValue = true;
                                                        //    });
                                                        //}
                                                        //else {
                                                        //    if(key.length>0)
                                                        //        returnValue = true;
                                                        //}
                                                        if (value && value.length > 0)
                                                            returnValue = true;
                                                    }
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return returnValue;
        };

        $scope.setCounty = function () {
            if ($scope.report) {
                if ($scope.report.data) {
                    if ($scope.report.data['patientcomplaints']) {
                        if ($scope.report.data['patientcomplaints'].cliniclocation) {

                            var clinicLocation = $scope.report.data['patientcomplaints'].cliniclocation;
                            var countyArray = clinicLocation.split(",", 1);
                            var county = countyArray[0];
                            return county;
                        }
                    }
                }
            }
        }

        $scope.mypracticename = $rootScope.currentUser.practicename;

        $scope.setAddress = function () {
            if ($scope.report) {
                if ($scope.report.data) {
                    if ($scope.report.data['patientcomplaints']) {
                        if ($scope.report.data['patientcomplaints'].cliniclocation) {

                            var clinicLocation = $scope.report.data['patientcomplaints'].cliniclocation;
                            var addressArray = clinicLocation.split(",");
                            addressArray.splice(0, 1);
                            return addressArray.join(', ');
                        }
                    }
                }
            }
        }

        $scope.checkExistHip = function (section) {
            var isSectiondataExist = false;
            if ($scope.report) {
                if ($scope.report.data) {
                    if ($scope.report.data['hipactivities']) {
                        if ($scope.report.data['hipactivities'].ADLhipActivities != 'Choose' && $scope.report.data['hipactivities'].ADLhipActivities != 'Normal')
                            if ($scope.report.data['hipactivities'].ddlWalkingOptions.length > 0 || $scope.report.data['hipactivities'].ddlClimbingOptions.length > 0 || $scope.report.data['hipactivities'].ddlSittingOptions || $scope.report.data['hipactivities'].ddlPuttingShoesOptions || $scope.report.data['hipactivities'].ddlPublicTransportationOptions) {
                                isSectiondataExist = true;
                            }
                        return isSectiondataExist;
                    }
                }
            }
        };

        $scope.getAbsValue = function (item) {
            if (typeof (item) != 'undefined') {
                if (item.toString().indexOf("-") > -1)
                    return item;
                else
                    return Math.abs(item);
            }
        };

        $scope.checkArray = function (inputValue) {
            if (inputValue) {
                if (typeof inputValue === 'string') {
                    return inputValue;
                }
                else {
                    if (Object.prototype.toString.call(inputValue) === '[object Array]') {
                        return inputValue[0];
                    }
                }
            }
        };

        $scope.treatmentCheckTotalRemission = function () {
            if ($scope.report) {
                var returnValue = false;
                if (!returnValue) {
                    if ($scope.report.data) {
                        if ($scope.report.data.selectinjuries) {
                            if ($scope.report.data.selectinjuries.concatedbodypart) {
                                for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                                    var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];
                                    if ($scope.report.data['patientcomplaints' + bodypart.concateId]) {
                                        if ($scope.report.data['patientcomplaints' + bodypart.concateId].totalremissionradio) {
                                            if ($scope.report.data['patientcomplaints' + bodypart.concateId].totalremissionradio == 'Yes') {
                                                returnValue = true;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return returnValue;
        };

        $scope.checkApportionmentExistAll = function () {
            if ($scope) {
                if ($scope.report) {
                    if ($scope.report.data) {
                        if ($scope.report.data['apportionment']) {
                            if ($scope.report.data['apportionment'].rdopainassessment) {
                                if ($scope.report.data['apportionment'].rdopainassessment.length > 0) {
                                    return true;
                                }
                            }
                        }
                        if ($scope.report.data.selectinjuries) {
                            if ($scope.report.data.selectinjuries.concatedbodypart) {
                                for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                                    var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];

                                    if ($scope.report.data['apportionment' + bodypart.concateId]) {
                                        if (typeof ($scope.report.data['apportionment' + bodypart.concateId].txtPreExisitng) != 'undefined') {
                                            if ($scope.report.data['apportionment' + bodypart.concateId].txtPreExisitng.toString().length > 0) {
                                                return true;
                                            }
                                        }
                                        if (typeof ($scope.report.data['apportionment' + bodypart.concateId].txtImaging) != 'undefined') {
                                            if ($scope.report.data['apportionment' + bodypart.concateId].txtImaging.toString().length > 0) {
                                                return true;
                                            }
                                        }
                                        if (typeof ($scope.report.data['apportionment' + bodypart.concateId].txtObesity) != 'undefined') {
                                            if ($scope.report.data['apportionment' + bodypart.concateId].txtObesity.toString().length > 0) {
                                                return true;
                                            }
                                        }
                                        if (typeof ($scope.report.data['apportionment' + bodypart.concateId].txtOther2) != 'undefined') {
                                            if ($scope.report.data['apportionment' + bodypart.concateId].txtOther2.length > 0) {
                                                return true;
                                            }
                                        }
                                        if (typeof ($scope.report.data['apportionment' + bodypart.concateId].textareaComment) != 'undefined') {
                                            if ($scope.report.data['apportionment' + bodypart.concateId].textareaComment.length > 0) {
                                                return true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return false;
        };

        $scope.checkDaysDifference = function (dateParam1, dateParam2) {

            var date1 = new Date();
            var date2 = new Date();
            if (dateParam1)
                date1 = new Date(dateParam1);
            if (dateParam2)
                date2 = new Date(dateParam2);
            var timeDiff = 0;
            if (typeof dateParam1 != 'undefined' && typeof dateParam2 != 'undefined')
                timeDiff = Math.abs(date2.getTime() - date1.getTime());
            else
                return false;
            var diffDays;
            if (timeDiff > 0)
                diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            if (diffDays >= 0)
                return true;
            else
                return false;
        };			
    }
    //End publish functions

})

.controller('bdpartupdateCtrl', function ($scope, $http, $filter, $routeParams, $cookies, $rootScope, $route, Injuries, $modalInstance, $q, $sessionStorage) {
    $scope.AddanotherImage = true;
    $scope.isLoad = false;

    $scope.bodyparts = [{ bodysystem: 'Spine', id: 'cervical', text: 'Cervical', sequence: 1, selectable: true }, { bodysystem: 'Spine', id: 'thoracic', text: 'Thoracic', sequence: 2, selectable: true }, { bodysystem: 'Spine', id: 'lumbar', text: 'Lumbar', sequence: 3, selectable: true }, { bodysystem: 'Upper Extremity', id: 'shoulder', text: 'Shoulder', sequence: 4, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Upper Extremity', id: 'elbow', text: 'Elbow', sequence: 5, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Upper Extremity', id: 'wrist', text: 'Wrist', sequence: 6, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Upper Extremity', id: 'thumb', text: 'Thumb', sequence: 7, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Upper Extremity', id: 'fingerindex', text: 'Index Finger', sequence: 8, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Upper Extremity', id: 'fingermiddle', text: 'Middle Finger', sequence: 9, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Upper Extremity', id: 'fingerring', text: 'Ring Finger', sequence: 10, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Upper Extremity', id: 'fingerlittle', text: 'Little Finger', sequence: 11, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Lower Extremity', id: 'pelviship', text: 'Hip/Pelvis', sequence: 12, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Lower Extremity', id: 'knee', text: 'Knee', sequence: 13, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Lower Extremity', id: 'anklefoot', text: 'Ankle/foot', sequence: 14, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Lower Extremity', id: 'toe', text: 'Toe(s)', sequence: 15, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Other', id: 'other', text: 'Other', sequence: 16, sides: ['Right', 'Left', 'N/A'], selectable: true }, { bodysystem: 'Skin', id: 'neck', text: 'Head/Neck', sequence: 17, selectable: true }, { bodysystem: 'Skin', id: 'upperextremity', text: 'Upper Extremity', sequence: 18, sides: ['Left', 'Right'], selectable: true }, { bodysystem: 'Skin', id: 'trunk', text: 'Trunk', sequence: 19, selectable: true }, { bodysystem: 'Skin', id: 'lowerextremity', text: 'Lower Extremity', sequence: 20, sides: ['Left', 'Right'], selectable: true }, { bodysystem: 'Skin', id: 'groingenitalia', text: 'Groin/Genitalia', sequence: 21, selectable: true }];

    $scope.bodysystem = ['Spine', 'Upper Extremity', 'Lower Extremity', 'Skin', 'Other'];

    $scope.clearbodypart = function (index) {
        var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
        if (confi) {
            $scope.selectedbodypart[index] = {};
        }
    };

    $scope.deletebodypart = function (index) {

        var confi = confirm("If you delete this row, you will lose all selections you have made for this body part.");
        if (confi) {
            $scope.AddanotherImage = true;
             
            if ($scope.selectedbodypart[index].bodypartsides) {
                if ($scope.sides[$scope.selectedbodypart[index].bodypart]) {
                    if ($scope.sides[$scope.selectedbodypart[index].bodypart].indexOf($scope.selectedbodypart[index].bodypartsides) == -1) {
                        $scope.sides[$scope.selectedbodypart[index].bodypart].push($scope.selectedbodypart[index].bodypartsides);
                    }
                } else {
                    var aa = angular.fromJson($scope.selectedbodypart[index].bodypart).text;
                    var fdfd = $filter("filter")($scope.bodyparts, { text: angular.fromJson($scope.selectedbodypart[index].bodypart).text })[0];
                    $filter("filter")($scope.bodyparts, { text: angular.fromJson($scope.selectedbodypart[index].bodypart).text })[0].selectable = true;
                }
            }
            $scope.selectedbodypart.splice(index, 1);
            //$scope.sides[$scope.selectedbodypart[i].bodypart].splice($scope.sides[$scope.selectedbodypart[i].bodypart].indexOf(sds), 1);

             
            if ($scope.selectedbodypart.length == 0) {
                $scope.isAcceptedbodypart = false;
            }
        }
    };

    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    }

    $scope.sides = new Object();

    $scope.changebodypart = function (bdpart, index) {
        var data = angular.fromJson(bdpart);
         
        if (!data.sides) {
            //data.sides = 'None';               
            index.bodypartsides = 'None';
            index.Hidebdpartsides = true;
             
        }
        else {

            index.Hidebdpartsides = false;
        }
        if (!$scope.sides[index.bodypart]) {
            $scope.sides[index.bodypart] = data.sides;
        }
        //$scope.sides = angular.fromJson(bdpart).sides;
        //$scope.selectedbodypart = index;
        if (data.sequence == 28) {
            index.otherBodypartshow = true;
        }
    }

    $scope.selectedbodypart = new Array;

    $scope.InjuryDemographic = function (injuryId) {
         
        var countobject = 0;
        $scope.injuryId = $sessionStorage.InjuryId;
        for (var i = 0; i < $scope.InjuriesDate.length; i++) {
            if ($scope.InjuriesDate[i]._id == injuryId) {
                 
                try {
                    $scope.selectedbodypart = $filter("filter")($scope.InjuriesDate[i].injurydata.acceptedbodyparts, { status: "current" })[0].injuredbodypart;
                } catch (err) {
                    $scope.InjuriesDate[i].injurydata.acceptedbodyparts = [{
                        injuredbodypart: [],
                        status: "current",
                        updateddate: Date.now(),
                        //timeofpriorevaluation: dtime,
                        updatedby: $rootScope.currentUser.username
                    }];
                }
                 
                $scope.injurydata = $scope.InjuriesDate[i].injurydata;
                $scope.injurydata.locationaddressinjury = $filter("filter")($scope.injurydata.locationaddressinjury, { status: "current" });
                $scope.injurydata.acceptedbodyparts = $filter("filter")($scope.injurydata.acceptedbodyparts, { status: "current" });
                if ($scope.injurydata.acceptedbodyparts[0].injuredbodypart.length > 0) {
                    $scope.isAcceptedbodypart = true;
                } else {
                    $scope.isAcceptedbodypart = false;
                }
                //$scope.sides = ['Left', 'Right', 'N/A'];
                //var aaa = angular.fromJson($scope.injurydata.acceptedbodyparts[0].injuredbodypart);
                 
                for (var j = 0; j < angular.fromJson($scope.injurydata.acceptedbodyparts[0].injuredbodypart).length; j++) {
                    $scope.sides[angular.fromJson($scope.injurydata.acceptedbodyparts[0].injuredbodypart[j]).bodypart] = angular.fromJson($scope.injurydata.acceptedbodyparts[0].injuredbodypart[j].bodypart).sides;
                }

            }
        }
         
        if ($scope.selectedbodypart.length == 0)
            $scope.addAnother(false);
    };

    /**
    * Scroll function for add injury
    */
    $scope.scrollBottom = function () {
        function scroll(height, ele) {
            this.stop().animate({
                scrollTop: height
            }, 1000, function () {
                var dir = height ? "top" : "bottom";
                $(ele).html("scroll to " + dir).attr({
                    id: dir
                });
            });
        };
        try {
            var height = 0;

            var scrollbtm = $('#scroll');
            height = height < scrollbtm[0].scrollHeight ? scrollbtm[0].scrollHeight : 0;
            scroll.call(scrollbtm, height, this);

        } catch (err) {
            //console.log(err);
        }
    }

    $scope.addAnother = function (iseDeleted) {
         
        //NEW
        $scope.scrollBottom();
        $scope.isAcceptedbodypart = true;

        for (var i = 0; i < $scope.selectedbodypart.length; i++) {
             
            var a = angular.fromJson($scope.selectedbodypart[i].bodypart).text;
            if (!angular.fromJson($scope.selectedbodypart[i].bodypart).sides) {
                $filter("filter")($scope.bodyparts, { text: angular.fromJson($scope.selectedbodypart[i].bodypart).text })[0].selectable = false;
            } else {
                var k = angular.fromJson($scope.selectedbodypart[i].bodypart).sides;
                var sds = ($scope.selectedbodypart[i].bodypartsides);
                var p = $scope.sides[$scope.selectedbodypart[i].bodypart].indexOf(sds);
                if (p != -1) {
                    var lala = $scope.selectedbodypart[i].bodypart;
                    $scope.sides[$scope.selectedbodypart[i].bodypart].splice($scope.sides[$scope.selectedbodypart[i].bodypart].indexOf(sds), 1);
                }
                if ($scope.sides[$scope.selectedbodypart[i].bodypart].length == 0) {
                    $filter("filter")($scope.bodyparts, { text: angular.fromJson($scope.selectedbodypart[i].bodypart).text })[0].selectable = false;
                } else {
                    $filter("filter")($scope.bodyparts, { text: angular.fromJson($scope.selectedbodypart[i].bodypart).text })[0].selectable = true;
                }
            }
        }

        $scope.injurydata.acceptedbodyparts[0].injuredbodypart = $scope.selectedbodypart;
        //$scope.merge(angular.fromJson($scope.selectedbodypart[$scope.selectedbodypart.length - 1].bodypart).id           
        if (!iseDeleted) {
            $scope.AddanotherImage = false;
            $scope.selectedbodypart.push({ bodypart: '', bodypart_mechanism: '' });
        }
    };

    $scope.checkvalidateBodypart = function (datamodel) {
         
        var isRepeat = false;
        var deferred = $q.defer();
        var count = '';
        if (datamodel.injuredbodypart) {
            for (var i = 0; i < datamodel.injuredbodypart.length; i++) {
                var isRepeatbodyPart = $filter('filter')(datamodel.injuredbodypart, { bodysystem: datamodel.injuredbodypart[i].bodysystem, bodypartsides: datamodel.injuredbodypart[i].bodypartsides, bodypart: datamodel.injuredbodypart[i].bodypart }).length;
                if (datamodel.injuredbodypart[i].bodysystem != 'Other') {
                    count = $filter('filter')(datamodel.injuredbodypart, { bodysystem: datamodel.injuredbodypart[i].bodysystem, bodypartsides: datamodel.injuredbodypart[i].bodypartsides, bodypart: datamodel.injuredbodypart[i].bodypart }).length;
                } else {
                    count = $filter('filter')(datamodel.injuredbodypart, { otherBodysystem: datamodel.injuredbodypart[i].otherBodysystem, bodypartsides: datamodel.injuredbodypart[i].bodypartsides, otherBodyparts: datamodel.injuredbodypart[i].otherBodyparts }).length;
                }
                if (count > 1) {
                    isRepeat = true;
                    try {
                        alert('You cannot add the body part "' + angular.fromJson(datamodel.injuredbodypart[i].bodypart).text + '" twice.');
                    } catch (error) {
                        alert("Please complete the Injured Body System(s) section.");
                        return false;
                    }
                    break;
                }
            }
        }
        deferred.resolve(isRepeat);
        return deferred.promise;
    }

    $scope.addEntity = function (text, datamodel) {

        var promise = $scope.checkvalidateBodypart(datamodel);
        promise.then(function (isRepeat) {

             
            var bodysystem = '';
            var bodypart = '';
            var side = '';
            var mechanismofinjury = '';
            $scope.ValidBodypart = true;
            if (datamodel.injuredbodypart.length > 0) {
                for (var i = 0; i < datamodel.injuredbodypart.length; i++) {
                    //this below line i sadded by shridhar for MMI feature
                    datamodel.injuredbodypart[i].ratebodyYesNoRadio = 'No';
                    bodysystem = datamodel.injuredbodypart[i].bodysystem ? datamodel.injuredbodypart[i].bodysystem == 'Other' ? datamodel.injuredbodypart[i].otherBodysystem ? datamodel.injuredbodypart[i].otherBodysystem : '' : datamodel.injuredbodypart[i].bodysystem : '';
                    var jsonbdpart = '';
                    try { jsonbdpart = angular.fromJson(datamodel.injuredbodypart[i].bodypart); } catch (err) { jsonbdpart = ''; }
                    bodypart = jsonbdpart ? jsonbdpart : '';
                    side = datamodel.injuredbodypart[i].bodypartsides ? datamodel.injuredbodypart[i].bodypartsides : '';
                    mechanismofinjury = datamodel.injuredbodypart[i].bodypart_mechanism ? datamodel.injuredbodypart[i].bodypart_mechanism == 'Other' ? datamodel.injuredbodypart[i].otherbodypart_mechanismshowmodel ? datamodel.injuredbodypart[i].otherbodypart_mechanismshowmodel : '' : datamodel.injuredbodypart[i].bodypart_mechanism : '';
                    if (bodysystem && bodypart && side && mechanismofinjury) { } else {
                        alert("Please complete the Injured Body System(s) section.");
                        $scope.ValidBodypart = false;
                        break;
                    }

                }

                if ($scope.ValidBodypart && !isRepeat) {
                    $scope.isLoad = false;
                    datamodel.status = "current";
                    delete datamodel._id;
                    Injuries.updatesubinjuriesforbdpart().save({ injid: $scope.injuryId, injurydata: datamodel, text: text, changetoarchive: true }, function (res) {

                    }).$promise.then(function () {


                         
                        Injuries.updatesubinjuriesforbdpart().save({ injid: $scope.injuryId, injurydata: datamodel, text: text, changetoarchive: false }, function (res) {
                             
                            alert("Succesfully updated!");
                            $scope.isLoad = true;
                            $modalInstance.close();
                        });
                    });
                }

            }

        });


    };

    $scope.checkOther = function (modal) {
         
        if (modal) {
            $scope.AddanotherImage = true;
        } else {
            $scope.AddanotherImage = false;
        }
    }
    $scope.changebodypartmechanism = function (bdpart, index) {
         
        $scope.AddanotherImage = true;
        if (index.bodypart_mechanism == 'Other') {
            $scope.AddanotherImage = false;
        }

        if (bdpart == "Other") {
            index.otherbodypart_mechanismshow = true;
        }
    };

    $scope.loadbdpartsides = function (index, modal) {
         
        if (modal) {
            index.bodypart = angular.toJson({ "bodysystem": "Other", "id": "other", "text": "Other", "sequence": 31, "sides": ["Right", "Left", "N/A"] });
            $scope.sides[index.bodypart] = ['Left', 'Right', 'N/A'];
        } else {
            delete $scope.sides[index.bodypart];
            index.bodypart = null;
            delete index.bodypart_mechanism;
            delete index.bodypartsides;
        }
    }

    $scope.changebodysystem = function (bdpart, index, arrayindex) {
         
        if (index.bodypart != "" && index.bodypart) {

            var confi = confirm("If you change the body system, then the other menus for this body part will reset. Are you sure that you want to continue?");
            if (confi) {
                $scope.selectedbodypart[arrayindex] = {}
                $scope.selectedbodypart[arrayindex].bodysystem = index.bodysystem;
            } else {
                index.bodysystem = angular.fromJson(bdpart).bodysystem
            }
        }
        if (index.bodysystem == 'Other') {
            //index.bodypart = angular.toJson({ "bodysystem": "Other", "id": "other", "text": "Other", "sequence": 31, "sides": ["Right", "Left", "N/A"] });
            //$scope.sides[index.bodypart] = ['Left', 'Right', 'N/A'];
        }
    };

    Injuries.getlatestinjuries().query({ ptid: $sessionStorage.patientId, skip: 0 }, function (res) {

        $scope.dateofInj = new Array();
        $scope.InjuriesDate = $filter("filter")(res[0].injury, { _id: $sessionStorage.InjuryId }); (res[0].injury);
        var totaldata = $scope.InjuriesDate;
         
        $scope.InjuriesDatelist = totaldata.slice(0, 5);
        $scope.totalItems = $scope.InjuriesDate.length;
        $scope.basicinformation = $filter("filter")(res[0].basicinformation, { status: "current" })[0];
         
        $scope.InjuryDemographic($sessionStorage.InjuryId);
         
    }).$promise.then(function () {
         
        $scope.isLoad = true;
    });
})

.controller('DemoCtrl', function ($scope, $idle, $keepalive, $modal, $rootScope, $modalInstance, $sessionStorage) {
    $scope.started = false;
     
    function closeModals() {

        if ($scope.warning) {
            $scope.warning.close();
            $scope.warning = null;
        }

        if ($scope.timedout) {
            $scope.timedout.close();
            $scope.timedout = null;
        }
    }

    $scope.close = function () {
         
        $modalInstance.close('cancel');
    }

    //$scope.$on('$idleStart', function () {
    //    closeModals();

    //    $scope.warning = $modal.open({
    //        templateUrl: 'warning-dialog.html',
    //        windowClass: 'modal-danger'
    //    });
    //});

    //$scope.$on('$idleEnd', function () {
    //    closeModals();
    //});

    //$scope.$on('$idleTimeout', function () {
    //    closeModals();
    //    $scope.timedout = $modal.open({
    //        templateUrl: 'timedout-dialog.html',
    //        windowClass: 'modal-danger'
    //    });
    //});

    //$scope.start = function () {
    //    closeModals();
    //    $idle.watch();
    //    $scope.started = true;
    //};

})

.controller('reportformpopupSavectrl', function ($scope, $modalInstance, text, $sessionStorage) {
     
    $scope.cancel = function () {
         
        $modalInstance.dismiss('cancel');
    }

    $scope.save = function () {
        $modalInstance.close('save');
    }

    $scope.leave = function () {
        $modalInstance.close('leave');
    }
})

.controller('submitreportCtrl', function ($scope, $modal, $rootScope, $cookies, getsubmittedpr4Reportdata, $location, $sessionStorage) {
     
    /*if(!(($rootScope.currentUser.rolename=="rater1" || $rootScope.currentUser.rolename=="rater2") &&  $rootScope.currentUser.practicename=="ratefast" )){
    	$location.path('/admin/dashboard');
    }
	else
	{*/
    //Setting for Pagination
    $scope.maxsize = '3';

    $scope.getsubmittedpr4Reportdata = '';
    $scope.level1loader = false;
    $scope.level2loader = false;
    $scope.ratingcompleteloader = false;

    $scope.dateOptions = {
        startingDay: 1,
        changeMonth: true,
        changeYear: true,
        showAnim: "clip",
        clearBtn: true
    };

    $scope.submittedreportData = function (pagenumber, status) {
         
        if (status) {
            var query = {
                statusController: 'status',
                status: status,
                pagenum: pagenumber,
                pageController: 'page'
            };
        }

        var query = {
            pagenum: pagenumber,
            pageController: 'page'
        };

        $scope.currentPage = pagenumber;

        getsubmittedpr4Reportdata.query(query, function (result) {
            if (result) {
                $scope.submittedpr4reportData = result.getsubmittedpr4Reportdata;
                $scope.totalItems = result.totalitem;
                $scope.noOfPages = result.pages;
                $scope.itemsperpage = result.itemsperpage;
                 
            }
        }).$promise.then(function (result) {

        });
    };

    $scope.completedList = function (pagenumber, extquery) {
        var query = {
            statusController: 'status',
            status: 'closed',
            stateController: 'state',
            state: $cookies.selectedStatecode,
            pagenum: pagenumber,
            pageController: 'page'
        };
        if ($scope.search) {
            query.ser = $scope.search;
        }
        $scope.currentPage = pagenumber;

        getsubmittedpr4Reportdata.save(query, function (result) {
             
        }).$promise.then(function (result) {
            if (result) {
                $scope.completedpr4reports = result.getsubmittedpr4Reportdata;
                $scope.totalItems = result.totalitem;
                $scope.noOfPages = result.pages;
                $scope.itemsperpage = result.itemsperpage;
            }
        });
    };

    $scope.newcasesList = function (pagenumber, extquery) {
        $scope.level1loader = true;
        var query = {
            statusController: 'status',
            status: 'level1',
            stateController: 'state',
            state: $cookies.selectedStatecode,
            pagenum: pagenumber,
            pageController: 'page'
        };
        if ($scope.search) {
            query.ser = $scope.search;
        }
        $scope.currentPagefornewcases = pagenumber;

        getsubmittedpr4Reportdata.save(query, function (result) {
             
        }).$promise.then(function (result) {
            $scope.level1loader = false;
            if (result) {
                $scope.submittedpr4reportData = result.getsubmittedpr4Reportdata;
                $scope.totalItemsfornewcases = result.totalitem;
                $scope.noOfPagesfornewcases = result.pages;
                $scope.itemsperpagefornewcases = result.itemsperpage;
            }
        });
    }

    $scope.level1casesList = function (pagenumber) {
        var query = {
            statusController: 'status',
            status: 'level2',
            stateController: 'state',
            state: $cookies.selectedStatecode,
            pagenum: pagenumber,
            pageController: 'page'
        }
        if ($scope.search) {
            query.ser = $scope.search;
        }
        $scope.currentPagefornewcases = pagenumber;

        getsubmittedpr4Reportdata.save(query, function (result) {
             
        }).$promise.then(function (result) {
            if (result) {
                $scope.submittedpr4level1reportData = result.getsubmittedpr4Reportdata;
                $scope.totalItemsforlevel1cases = result.totalitem;
                $scope.noOfPagesforlevel1cases = result.pages;
                $scope.itemsperpageforlevel1cases = result.itemsperpage;
                 
            }
        });
    };

    $scope.searchPatients = function (pagenumber) {
         
        $scope.showMessage = false;
        var query = { state: $cookies.selectedStatecode };
        $scope.search;
        //Query for Search Controller
        if ($scope.search) {
            if ($scope.search.practicename) {
                query.practicename = $scope.search.practicename;
                query.practiceController = 'practicename';
            }
            if ($scope.search.datesubmittedfrom) {
                $scope.fromdate = $scope.search.datesubmittedfrom;
            } else {
                $scope.fromdate = '';
            }
            if ($scope.search.datesubmittedto) {
                $scope.todate = $scope.search.datesubmittedto;
            }
            else {
                $scope.todate = Date.now();
            }
            if ($scope.search.patientfname) {
                query.patientfname = $scope.search.patientfname.toLowerCase();
                query.patientfnameController = 'fname';
            }
            if ($scope.search.patientlname) {
                query.patientlname = $scope.search.patientlname.toLowerCase();
                query.patientlnameController = 'lname';
            }
			if ($scope.search.reportID) {
				query.reportID = $scope.search.reportID;
			}

            $scope.level1casesList(1, $scope.search);
            $scope.newcasesList(1, $scope.search);
            $scope.completedList(1, $scope.search);
        }
        else {
            $scope.level1casesList(1);
            $scope.newcasesList(1);
            $scope.completedList(1);
        }
    };

    $scope.resetSearch = function () {
        $scope.search = new Object;
        $scope.level1casesList(1);
        $scope.newcasesList(1);
        $scope.completedList(1);
    }

    $scope.reportConfirmation = function (reportid, patientid, injuryid, reportstatus, reportcategory, formType, formversion, formid) {

         
        $scope.reportid = reportid;
        $scope.patientid = patientid;
        $scope.reportcategory = reportcategory;
        $scope.formversion = formversion;
        $rootScope.formVersion = formversion;
        $scope.formid = formid;
        if ($cookies.formType) {
            delete $cookies.formType;
        }
        $cookies.formType = formType;

        if ($cookies.formVersion) {
            delete $cookies.formVersion;
        }
        $cookies.formVersion = formversion;

        if ($sessionStorage.reportId) {
            delete $sessionStorage.reportId;
        }
        if ($cookies.patientId) {
            delete $sessionStorage.patientId;
        }
        if ($sessionStorage.InjuryId) {
            delete $sessionStorage.InjuryId;
        }
        $sessionStorage.reportId = reportid;
        $sessionStorage.patientId = patientid;
        $sessionStorage.InjuryId = injuryid;
        $cookies.reportstatus = reportstatus;

        $rootScope.modalInstance = $modal.open({
            templateUrl: 'partials/reportconfirmation.html',
            controller: 'reportPreviewctrl',
            resolve: {
                patientid: function () {
                    return $scope.patientid;
                },
                reportid: function () {
                    return $scope.reportid;
                },
                formVersion: function () {
                    return $scope.formversion;
                },
                formid: function () {
                    return $scope.formid;
                }
            }
        });
    }
    //}    
})

.controller('popupMessagectrl', function ($scope, $modalInstance, message, $sessionStorage) {

    $scope.message = message;

    $scope.ok = function () {
        $modalInstance.dismiss(false);
    }
})

.controller('confirmSubmitReratingctrl', function ($scope, $modalInstance, $sessionStorage) {

    $scope.cancel = function () {
        $modalInstance.dismiss(false);
    }

    $scope.no = function () {
        $scope.displayReratingdiv = 'NoRerating';
        $modalInstance.close($scope.displayReratingdiv);

    }

    $scope.yes = function () {
        $scope.displayReratingdiv = 'YesRerating';
        $modalInstance.close($scope.displayReratingdiv);
    }

})

/*

.config(['$keepaliveProvider', '$idleProvider', function ($keepaliveProvider, $idleProvider) {
    $idleProvider.idleDuration(295);
    $idleProvider.warningDuration(5);
    $keepaliveProvider.interval(10);
}]);*/