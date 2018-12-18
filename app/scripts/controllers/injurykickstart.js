/**
 * New node file
 */
'use strict';

angular.module('ratefastApp')
	.controller('injurykickstart', function ($scope, $location, $anchorScroll, $http, $modal, $rootScope, vcRecaptchaService, $window) {
		$scope.type = '';
		$scope.status = '';
		$scope.step = 1;
		//$scope.patientModel={};
		$scope.submitted = false;
		$("#spiningwheel").hide();
				
		$scope.tinymceOptions = {
            resize: false,
            menubar: false,
            plugins: '',
            browser_spellcheck: true,
            contextmenu: false,
            toolbar: "bold italic underline"
        };

		$scope.dateOptions = {
			startingDay: 1,
			changeMonth: true,
			changeYear: true,
			showAnim: "clip",
			clearBtn: true,
			yearRange: "-125:+0",
			defaultDate: '-18Y',
			maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + -10)),
			minDate: new Date(new Date().setFullYear(new Date().getFullYear() + -125))
		};
		$scope.dateOptionsInjury = {
			startingDay: 1,
			changeMonth: true,
			changeYear: true,
			showAnim: "clip",
			clearBtn: true,
			yearRange: "-125:+0",
			//defaultDate: '-18Y',
			maxDate: new Date()
		};

		$scope.verifiedURL = '';
		//$scope.captchaPublicKey = "6LdUyQkUAAAAAAYCeIzPcV_H4-vyXz5v8fBuP4Xv";
		$scope.captchaPublicKey = "6LfjQAoUAAAAADf3GsuyKsP9Bm6_zNdt9I38FnWZ";
		$scope.faxnumber = '(206) 338-3005';
		
		$scope.returnInnerText = function(inputText) {
			if(typeof inputText=='undefined')
				return '';
			else
			{
				if(inputText==null)
					return '';
				else
					return inputText.substr(inputText.indexOf('<p>') + 3, inputText.indexOf('</p>') - 3)
			}
		}
		
		$scope.initPatientModel = function () {
			$scope.appointment_notes="";
			$scope.appointment_schedule="";
			
			$scope.patientModel = {
				"sh": [
					{
						"updateddate": new Date(),
						//"updatedby": "siteadmin",
						"status": "current",
						"SHrdoMaritalStatus": null,
						"SHrdoEmploymentStatus": null,
						"chkOccupationalHistoryOtherTextarea": null,
						"txtCaffeine": null,
						"txtStreetDrug": null,
						"txtTobacco": null,
						"txtAlcohol": null,
						"shfreedataentry": null,
						"SHrdoLevelOfEducation": null,
						"SHrdoLevelOfEducationtextA": null,
						"rdoSecondJobs": null,
						"rdoSecondJobsTextarea": null,
						"rdoSelfEmployment": null,
						"rdoSelfEmploymentTextarea": null,
						"rdoMilitaryService": null,
						"rdoMilitaryServiceTextarea": null,
						"chkHobbiesOtherTextarea": null,
						"chkHobbies": [],
						"chkHobbiesNone": [],
						"chkAlcohol": [],
						"chkTobacco": [],
						"chkStreetDrug": [],
						"chkCaffeine": [],
						"chkCaffeineNegative": [],
						"SHchkOccupationalHistory": []
					}
				],
				"medicalhistory": [
					{
						"shgeneralpriorhealthradio": null,
						"shgeneralhealthontritextother": null,
						"shgeneralhealthpriorsurgeryradio": null,
						"shgeneralhealthpriorsurgerytextother": null,
						"shcurrentmedicationradio": null,
						"shcurrentmedicationsothertext": null,
						"shknownallergiesOthercheckTextarea": null,
						"shknownallergiesothertext": null,
						"shpriorillnessradio": null,
						"shgeneralreviewpriorothertext": null,
						"shgeneraleyesothertext": null,
						"shgeneralthroatothertext": null,
						"shgeneralcardiovascularothertext": null,
						"shgeneralrespiratoryothertext": null,
						"shgeneralgastrointestinalothertext": null,
						"shgeneralgenitourinaryothertext": null,
						"shgeneralmusculoskeletalothertext": null,
						"shgeneralskinothertext": null,
						"shgeneralneurologicalothertext": null,
						"shgeneralpsychiatricothertext": null,
						"shgeneralendocrineothertext": null,
						"shgeneralhematologicalothertext": null,
						"shgeneralallergicothertext": null,
						"status": "current",
						"updateddate": new Date(),
						//"updatedby": "siteadmin",
						"shgeneralallergiccheck": [],
						"shgeneralhematologicalcheck": [],
						"shgeneralendocrinecheck": [],
						"shgeneralpsychiatric": [],
						"shgeneralneurologicalcheck": [],
						"shgeneralskincheck": [],
						"shgeneralmusculoskeletalcheck": [],
						"shgeneralgenitourinary": [],
						"shgeneralgastrointestinalcheck": [],
						"shgeneralrespiratorycheck": [],
						"shgeneralcardiovascularcheck": [],
						"shgeneralthroatcheck": [],
						"shgeneraleyescheck": [],
						"negativeshgeneralconstitutionalcheck": [],
						"shgeneralconstitutionalcheck": [],
						"shgeneralreviewpriorcheck": [],
						"shknownallergiesOthercheck": [],
						"shknownallergiescheck": [],
						"shknownallergiesNonecheck": [],
						"shcurrentmedications": [],
						"shgeneralhealthpriorsugeycheck": [],
						"shgeneralhealthcontricheck": []
					}
				],
				basicinformation: [
					{
						firstname: "",
						middlename: "",
						lastname: "",
						gender: "",
						dateofbirth: "",
						dateofdeath: "",
						socialsecurityno: "",
						employeehandedness: "",
						medicalrecordno: "",
						status: "current",
						updateddate: new Date(),
						updatedby: ""
					}
				],
				contactinformation: [
					{
						email: "",
						homephone: "",
						cellphone: "",
						workphone: "",
						extension: "",
						phonenumberselect: "homephone",
						phonenumberselectsecond: "",
						phonenumberselectthird: "",
						voicemailthirdradio: "No",
						voicemailsecondradio: "No",
						voicemailradio: "No",
						preferredcommunication: "",
						preferredcommunicationother: "",
						status: "current",
						updateddate: new Date(),
						updatedby: ""
					}
				],
				address: [
					{
						addressline1: "",
						addressline2: "",
						city: "",
						state: "",
						zipcode: "",
						status: "current",
						updateddate: new Date(),
						updatedby: ""
					}
				],
				demographics: [
					{
						preferredlanguage: "English",
						preferredlanguageother: "",
						ethnicity: "",
						ethnicityother: "",
						race: "",
						raceother: "",
						status: "current",
						updateddate: new Date(),
						updatedby: ""
					}
				],
				occupation: [
					{
						currentoccupation: "",
						currentoccupationother: "",
						status: "current",
						updateddate: new Date(),
						updatedby: ""
					}
				],
				emergencycontactinfo: [
					{
						relationship: "",
						emergencyrelationother: "",
						firstname: "",
						lastname: "",
						email: "",
						homephone: "",
						cellphone: "",
						workphone: "",
						extension: "",
						status: "current",
						updateddate: new Date(),
						updatedby: "",
						address: [
							{
								addressline1: "",
								addressline2: "",
								city: "",
								state: "",
								zipcode: "",
								status: "current",
								updateddate: new Date(),
								updatedby: ""
							}
						]
					}
				],

				createddate: Date,
				createdby: String,
				updateddate: Date,
				updatedby: String,
				patientrecordno: String,
				state: String,
				injury: [
					{
						injurydata: {
							injuryinformation: [
								{
									injuryinformationdetail: "",
									dateofinjury: "",
									dateoflastwork: "",
									dateofpermanent: "",
									timeofinjury: "",
									injuryplace: "",
									isinjurywitnes: "",
									other_isinjurywitnes: "",
									other_injuryplace: "",
									firstaid: "",
									firstaid_measure: {},
									other_measure_text: "",
									reportedemployer: "",
									reportedemploye: {},
									other_reportedemploye: "",
									afterworking: "",
									other_afterworking: "",
									additionaldetail: "",
									status: "current",
									witnes: {},
									evaluated_prior: "",
									timeofpriorevaluation: "",
									dateofpriorevaluation: "",
									otherwitnes: "",
									reportedemployOther: "",
									updateddate: new Date(),
									updatedby: String
								}
							],
							communication: {
								patientcommunicationcomment: "",
								admincommunicationcomment: "",
								diagnostictesting: "",
								othernotes: "",
							},
							viewinformation: [
								{
									viewdate: Date,
									viewby: ""
								}
							],
							locationaddressinjury: [
								{
									location_address1: "",
									location_address2: "",
									location_city: "",
									location_state: "",
									location_zipcode: "",
									status: "current",
									updateddate: new Date(),
									updatedby: ""
								}
							],
							acceptedbodyparts: [
								{
									injuredbodypart: [],
									//employeehandedness: String,
									status: "current",
									updateddate: new Date(),
									updatedby: ""
								}
							],

							employer: [
								{
									company: "",
									natureofbusiness: "",
									othernatureofbusiness: "",
									emp_telephone: "",
									emp_extension: "",
									emp_fax: "",
									status: "current",
									updateddate: new Date(),
									updatedby: ""
								}
							],
							employment: [
								{
									status: "current",
									updateddate: Date,
									updatedby: "",
									jobtitle: "",
									durationofemployement: "",
									durationtype: "",
								}
							],
							employeraddress: [
								{
									emp_address1: "",
									emp_address2: "",
									emp_city: "",
									emp_zipcode: "",
									emp_state: "",
									status: "current",
									updateddate: new Date(),
									updatedby: String
								}
							],
							employercontact: [
								{
									employercontact_firstname: "",
									employercontact_lastname: "",
									employercontact_telephoneno: "",
									employercontact_extension: "",
									employercontact_email: "",
									employercontact_fax: "",
									employercontact_address: "",
									employercontact_city: "",
									employercontact_state: "",
									employercontact_zipcode: "",
									status: "current",
									updateddate: new Date(),
									updatedby: String
								}
							],
							insurance: [
								{
									insurance_claimsadministrator: "",
									insurance_claimsnumber: "",
									insurancezipcode: "",
									insurancecity: "",
									insurancestate: "",
									insuranceaddressline1: "",
									insuranceaddressline2: "",
									status: "current",
									updateddate: new Date(),
									updatedby: String
								}
							],
							claimsadjuster: [
								{
									claimsadjuster_firstname: "",
									claimsadjuster_lastname: "",
									claimsadjuster_telephoneno: "",
									claimsadjuster_extension: "",
									claimsadjuster_email: "",
									claimsadjuster_fax: "",
									claimsadjuster_address: "",
									claimsadjuster_city: "",
									claimsadjuster_state: "",
									claimsadjuster_zipcode: "",
									claimsadjuster_company: "",
									status: "current",
									updateddate: new Date(),
									updatedby: ""
								}
							],
							billreview: [
								{
									billreview_firstname: "",
									billreview_lastname: "",
									billreview_telephoneno: "",
									billreview_extension: "",
									billreview_email: "",
									billreview_fax: "",
									billreview_address: "",
									billreview_city: "",
									billreview_state: "",
									billreview_zipcode: "",
									billreview_company: "",
									status: "current",
									updateddate: new Date(),
									updatedby: String
								}
							],
							utilizationreview: [
								{
									utilizationreview_firstname: "",
									utilizationreview_lastname: "",
									utilizationreview_telephoneno: "",
									utilizationreview_extension: "",
									utilizationreview_email: "",
									utilizationreview_fax: "",
									utilizationreview_address: "",
									utilizationreview_city: "",
									utilizationreview_state: "",
									utilizationreview_zipcode: "",
									utilizationreview_company: "",
									status: "current",
									updateddate: new Date(),
									updatedby: String
								}
							],
							applicantattorney: [
								{
									involvementradio: "",
									applicantattorney_firstname: "",
									applicantattorney_lastname: "",
									applicantattorney_telephoneno: "",
									applicantattorney_extension: "",
									applicantattorney_email: "",
									applicantattorney_fax: "",
									applicantattorney_address: "",
									applicantattorney_city: "",
									applicantattorney_state: "",
									applicantattorney_zipcode: "",
									applicantattorney_company: "",
									status: "current",
									updateddate: new Date(),
									updatedby: "",
								}
							],
							defenseattorney: [
								{
									defenseattorney_firstname: "",
									defenseattorney_lastname: "",
									defenseattorney_telephoneno: "",
									defenseattorney_extension: "",
									defenseattorney_email: "",
									defenseattorney_fax: "",
									defenseattorney_address: "",
									defenseattorney_city: "",
									defenseattorney_state: "",
									defenseattorney_zipcode: "",
									defenseattorney_company: "",
									status: "current",
									updateddate: new Date(),
									updatedby: ""
								}
							],
							rncasemanager: [
								{
									rncasemanager_firstname: "",
									rncasemanager_lastname: "",
									rncasemanager_telephoneno: "",
									rncasemanager_extension: "",
									rncasemanager_email: "",
									rncasemanager_fax: "",
									rncasemanager_address: "",
									rncasemanager_city: "",
									rncasemanager_state: "",
									rncasemanager_zipcode: "",
									rncasemanager_company: "",
									status: "current",
									updateddate: new Date(),
									updatedby: ""
								}
							],
							provider: [
								{
									provider_firstname: "",
									provider_lastname: "",
									provider_telephoneno: "",
									provider_extension: "",
									provider_email: "",									
									provider_company: "",
									status: "current",
									updateddate: new Date(),
									updatedby: ""
								}
							],
							createddate: new Date(),
							createdtime: "",
							createdby: "",
							involvementradio: 'applicantattorney',
							updateddate: new Date(),
							updatedby: ""
						}
					}
				]
			}
		};

		$scope.formatFax = function (faxno) {

			var formattedFax = String(faxno);
			
			if (faxno.length < 12) {
				formattedFax = '(' + formattedFax.slice(0, 3) + ') ' + formattedFax.slice(3, 6) + ' ' + formattedFax.slice(6, 10);
			}
			
			return formattedFax
		}
		$scope.initPatientModel();
		var urlArray = window.location.pathname.split('/');
		debugger;
		$http.post("/api/injurykickstart/verifyurl/" + urlArray[urlArray.length - 1]).then(function (response) {              //    
			debugger;
			$scope.verifiedURL = 'YES';			
			$scope.faxnumber = response.data.faxnumber != '' ? response.data.faxnumber : "(206) 338-3005";
			$scope.kickstart_page = response.data.kickstart_page;

		}, function (response) {
			$scope.verifiedURL = 'NO';
		});

		$scope.isShown = function (type) {
			if ($scope.type != '') { $scope.status = 'true'; }
			return type === $scope.type;
		};

		$scope.resetPreferredPhone = function (type) {
			var workphone = $scope.patientModel.contactinformation[0].workphone;
			var cellphone = $scope.patientModel.contactinformation[0].cellphone;
			var homephone = $scope.patientModel.contactinformation[0].homephone;
			switch (type) {
				case 'homephone':

					$scope.patientModel.contactinformation[0].workphone = '';
					$scope.patientModel.contactinformation[0].cellphone = '';
					$scope.patientModel.contactinformation[0].homephone = workphone != "" ? workphone : (cellphone != "" ? cellphone : homephone);
					break;

				case 'cellphone':

					$scope.patientModel.contactinformation[0].workphone = '';
					$scope.patientModel.contactinformation[0].homephone = '';
					$scope.patientModel.contactinformation[0].cellphone = workphone != "" ? workphone : (homephone != "" ? homephone : cellphone);
					break;

				case 'workphone':

					$scope.patientModel.contactinformation[0].homephone = '';
					$scope.patientModel.contactinformation[0].cellphone = '';
					$scope.patientModel.contactinformation[0].workphone = cellphone != "" ? cellphone : (homephone != "" ? homephone : workphone);

					break;
			}
			$scope.resetLeaveVoiceMail(type);
			
		};

		$scope.resetLeaveVoiceMail = function (type) {

			switch (type) {
				case 'homephone':

					$scope.patientModel.contactinformation[0].voicemailthirdradio = 'No';
					$scope.patientModel.contactinformation[0].voicemailsecondradio = 'No';
					//$scope.patientModel.contactinformation[0].voicemailradio				=	'No';

					break;

				case 'cellphone':

					$scope.patientModel.contactinformation[0].voicemailthirdradio = 'No';
					//$scope.patientModel.contactinformation[0].voicemailsecondradio	=	'No';
					$scope.patientModel.contactinformation[0].voicemailradio = 'No';

					break;

				case 'workphone':

					//$scope.patientModel.contactinformation[0].voicemailthirdradio		=	'No';
					$scope.patientModel.contactinformation[0].voicemailsecondradio = 'No';
					$scope.patientModel.contactinformation[0].voicemailradio = 'No';

					break;
			}

		};
		/*$scope.restinvolvementOb = function (involvement) {
				$scope.patientModel.injury[0].injurydata[involvement][0][involvement + '_company']='';
				$scope.patientModel.injury[0].injurydata[involvement][0][involvement + '_firstname']='';
				$scope.patientModel.injury[0].injurydata[involvement][0][involvement + '_lastname']='';
				$scope.patientModel.injury[0].injurydata[involvement][0][involvement + '_telephoneno']='';
				$scope.patientModel.injury[0].injurydata[involvement][0][involvement + '_extension']='';
				$scope.patientModel.injury[0].injurydata[involvement][0][involvement + '_email']='';
		};*/

		$scope.restinvolvementOb = function (involvement, attorney) {
			$scope.patientModel.injury[0].injurydata[attorney][0][attorney + '_company'] = $scope.patientModel.injury[0].injurydata[involvement][0][involvement + '_company'];
			$scope.patientModel.injury[0].injurydata[attorney][0][attorney + '_firstname'] = $scope.patientModel.injury[0].injurydata[involvement][0][involvement + '_firstname'];
			$scope.patientModel.injury[0].injurydata[attorney][0][attorney + '_lastname'] = $scope.patientModel.injury[0].injurydata[involvement][0][involvement + '_lastname'];
			$scope.patientModel.injury[0].injurydata[attorney][0][attorney + '_telephoneno'] = $scope.patientModel.injury[0].injurydata[involvement][0][involvement + '_telephoneno'];
			$scope.patientModel.injury[0].injurydata[attorney][0][attorney + '_extension'] = $scope.patientModel.injury[0].injurydata[involvement][0][involvement + '_extension'];
			$scope.patientModel.injury[0].injurydata[attorney][0][attorney + '_email'] = $scope.patientModel.injury[0].injurydata[involvement][0][involvement + '_email'];

			$scope.patientModel.injury[0].injurydata[involvement][0][involvement + '_company'] = '';
			$scope.patientModel.injury[0].injurydata[involvement][0][involvement + '_firstname'] = '';
			$scope.patientModel.injury[0].injurydata[involvement][0][involvement + '_lastname'] = '';
			$scope.patientModel.injury[0].injurydata[involvement][0][involvement + '_telephoneno'] = '';
			$scope.patientModel.injury[0].injurydata[involvement][0][involvement + '_extension'] = '';
			$scope.patientModel.injury[0].injurydata[involvement][0][involvement + '_email'] = '';
		};

		$scope.validateMedicalForm = function (medicalhistoryform) {
			$scope.submitted = true;
			$scope.validate = false;
			if (medicalhistoryform.$valid) {
				var urlArray = window.location.pathname.split('/');
				
				//Appending "Patient comment: " to Medical History text areas
				if($scope.patientModel.medicalhistory[0].shgeneralhealthontritextother!=null && $scope.patientModel.medicalhistory[0].shgeneralhealthontritextother!='')
					$scope.patientModel.medicalhistory[0].shgeneralhealthontritextother = 'Patient comment: "' + $scope.returnInnerText($scope.patientModel.medicalhistory[0].shgeneralhealthontritextother) + '"';
				
				
				if($scope.patientModel.medicalhistory[0].shcurrentmedicationsothertext!=null && $scope.patientModel.medicalhistory[0].shcurrentmedicationsothertext!='')
					$scope.patientModel.medicalhistory[0].shcurrentmedicationsothertext = 'Patient comment: "' + $scope.returnInnerText($scope.patientModel.medicalhistory[0].shcurrentmedicationsothertext) + '"';
				
				if($scope.patientModel.medicalhistory[0].shknownallergiesOthercheckTextarea!=null && $scope.patientModel.medicalhistory[0].shknownallergiesOthercheckTextarea!='')
					$scope.patientModel.medicalhistory[0].shknownallergiesOthercheckTextarea = 'Patient comment: "' + $scope.returnInnerText($scope.patientModel.medicalhistory[0].shknownallergiesOthercheckTextarea) + '"';
				
				if($scope.patientModel.medicalhistory[0].shgeneralhealthpriorsurgerytextother!=null && $scope.patientModel.medicalhistory[0].shgeneralhealthpriorsurgerytextother!='')
					$scope.patientModel.medicalhistory[0].shgeneralhealthpriorsurgerytextother = 'Patient comment: "' + $scope.returnInnerText($scope.patientModel.medicalhistory[0].shgeneralhealthpriorsurgerytextother) + '"';
								
				if($scope.patientModel.medicalhistory[0].shgeneralreviewpriorothertext!=null && $scope.patientModel.medicalhistory[0].shgeneralreviewpriorothertext!='')
					$scope.patientModel.medicalhistory[0].shgeneralreviewpriorothertext = 'Patient comment: "' + $scope.returnInnerText($scope.patientModel.medicalhistory[0].shgeneralreviewpriorothertext) + '"';
				
				if($scope.patientModel.medicalhistory[0].shgeneraleyesothertext!=null && $scope.patientModel.medicalhistory[0].shgeneraleyesothertext!='')
					$scope.patientModel.medicalhistory[0].shgeneraleyesothertext = 'Patient comment: "' + $scope.returnInnerText($scope.patientModel.medicalhistory[0].shgeneraleyesothertext) + '"';
				
				if($scope.patientModel.medicalhistory[0].shgeneralthroatothertext!=null && $scope.patientModel.medicalhistory[0].shgeneralthroatothertext!='')
					$scope.patientModel.medicalhistory[0].shgeneralthroatothertext = 'Patient comment: "' + $scope.returnInnerText($scope.patientModel.medicalhistory[0].shgeneralthroatothertext) + '"';
				
				if($scope.patientModel.medicalhistory[0].shgeneralcardiovascularothertext!=null && $scope.patientModel.medicalhistory[0].shgeneralcardiovascularothertext!='')
					$scope.patientModel.medicalhistory[0].shgeneralcardiovascularothertext = 'Patient comment: "' + $scope.returnInnerText($scope.patientModel.medicalhistory[0].shgeneralcardiovascularothertext) + '"';
				
				if($scope.patientModel.medicalhistory[0].shgeneralrespiratoryothertext!=null && $scope.patientModel.medicalhistory[0].shgeneralrespiratoryothertext!='')
					$scope.patientModel.medicalhistory[0].shgeneralrespiratoryothertext = 'Patient comment: "' + $scope.returnInnerText($scope.patientModel.medicalhistory[0].shgeneralrespiratoryothertext) + '"';
				
				if($scope.patientModel.medicalhistory[0].shgeneralgastrointestinalothertext!=null && $scope.patientModel.medicalhistory[0].shgeneralgastrointestinalothertext!='')
					$scope.patientModel.medicalhistory[0].shgeneralgastrointestinalothertext = 'Patient comment: "' + $scope.returnInnerText($scope.patientModel.medicalhistory[0].shgeneralgastrointestinalothertext) + '"';
				
				if($scope.patientModel.medicalhistory[0].shgeneralgenitourinaryothertext!=null && $scope.patientModel.medicalhistory[0].shgeneralgenitourinaryothertext!='')
					$scope.patientModel.medicalhistory[0].shgeneralgenitourinaryothertext = 'Patient comment: "' + $scope.returnInnerText($scope.patientModel.medicalhistory[0].shgeneralgenitourinaryothertext) + '"';
				
				if($scope.patientModel.medicalhistory[0].shgeneralmusculoskeletalothertext!=null && $scope.patientModel.medicalhistory[0].shgeneralmusculoskeletalothertext!='')
					$scope.patientModel.medicalhistory[0].shgeneralmusculoskeletalothertext = 'Patient comment: "' + $scope.returnInnerText($scope.patientModel.medicalhistory[0].shgeneralmusculoskeletalothertext) + '"';
				
				if($scope.patientModel.medicalhistory[0].shgeneralskinothertext!=null && $scope.patientModel.medicalhistory[0].shgeneralskinothertext!='')
					$scope.patientModel.medicalhistory[0].shgeneralskinothertext = 'Patient comment: "' + $scope.returnInnerText($scope.patientModel.medicalhistory[0].shgeneralskinothertext) + '"';
				
				if($scope.patientModel.medicalhistory[0].shgeneralneurologicalothertext!=null && $scope.patientModel.medicalhistory[0].shgeneralneurologicalothertext!='')
					$scope.patientModel.medicalhistory[0].shgeneralneurologicalothertext = 'Patient comment: "' + $scope.returnInnerText($scope.patientModel.medicalhistory[0].shgeneralneurologicalothertext) + '"';
						
				
				if($scope.patientModel.medicalhistory[0].shgeneralpsychiatricothertext!=null && $scope.patientModel.medicalhistory[0].shgeneralpsychiatricothertext!='')
					$scope.patientModel.medicalhistory[0].shgeneralpsychiatricothertext = 'Patient comment: "' + $scope.returnInnerText($scope.patientModel.medicalhistory[0].shgeneralpsychiatricothertext) + '"';
				
				if($scope.patientModel.medicalhistory[0].shgeneralendocrineothertext!=null && $scope.patientModel.medicalhistory[0].shgeneralendocrineothertext!='')
					$scope.patientModel.medicalhistory[0].shgeneralendocrineothertext = 'Patient comment: "' + $scope.returnInnerText($scope.patientModel.medicalhistory[0].shgeneralendocrineothertext) + '"';
				
				if($scope.patientModel.medicalhistory[0].shgeneralhematologicalothertext!=null && $scope.patientModel.medicalhistory[0].shgeneralhematologicalothertext!='')
					$scope.patientModel.medicalhistory[0].shgeneralhematologicalothertext = 'Patient comment: "' + $scope.returnInnerText($scope.patientModel.medicalhistory[0].shgeneralhematologicalothertext) + '"';
				
				if($scope.patientModel.medicalhistory[0].shgeneralallergicothertext!=null && $scope.patientModel.medicalhistory[0].shgeneralallergicothertext!='')
					$scope.patientModel.medicalhistory[0].shgeneralallergicothertext = 'Patient comment: "' + $scope.returnInnerText($scope.patientModel.medicalhistory[0].shgeneralallergicothertext) + '"';
				
				/********************************************************************************************************************/
				
				$http.post("/api/injurykickstart/medicalhistory/" + urlArray[urlArray.length - 1], { patientModel: $scope.patientModel, submittedby: $scope.type, step1patient: $scope.step1patientres }).then(function (response) {
					
					var msg = 'Information is submitted successfully to the RateFast team.!';
					setTimeout(function () { $("#spiningwheel").hide(); }, 2000);
					debugger;
					$scope.step = 3;
					$('body').scrollTop(0);
				}, function (response) {
					setTimeout(function () { $("#spiningwheel").hide(); }, 2000);
					var msg = typeof (response.data.message) != "undefined" ? response.data.message : 'Something went wrong. Please retry';

					$rootScope.modalInstance = $modal.open({
						template: '<div class="modal-header"><button type="button" class="close" aria-hidden="true" ng-click="close()">&times;</button><h3>RateFast</h3></div><div class="modal-body"><div class="login-sign"><h3>A unknown Error has occured</h3></div></div><div class="modal-footer"><button class="btn btn-primary" ng-click="close()">Ok</button></div>',
						controller: 'popupButtonCtrlclose'
					});
				}
				);
				$("#spiningwheel").show();
			}
		}
		
		$scope.scheduleAppointmentForm = function (appointmentform) {
			
			$scope.submitted = true;
			$scope.validate = false;
			
			var appointment_notes_val='';
			
			if (appointmentform.$valid) {
				var urlArray = window.location.pathname.split('/');		

				if(typeof appointmentform.appointment_notes=='undefined')	
					appointment_notes_val='';
				else
					appointment_notes_val = appointmentform.appointment_notes.$viewValue;
				
				$http.post("/api/injurykickstart/scheduleappointment/" + urlArray[urlArray.length - 1], { patientModel: $scope.patientModel, submittedby: $scope.type, step1patient: $scope.step1patientres ,appointment_notes:appointment_notes_val,appointment_schedule:$scope.appointment_schedule}).then(function (response) {					
					var msg = 'Information is submitted successfully to the RateFast team.!';
					setTimeout(function () { $("#spiningwheel").hide(); }, 2000);
					$window.location.href = '/injurykickstartsuccess/' + urlArray[urlArray.length - 1];
				}, function (response) {
					setTimeout(function () { $("#spiningwheel").hide(); }, 2000);
					var msg = typeof (response.data.message) != "undefined" ? response.data.message : 'Something went wrong. Please retry';

					$rootScope.modalInstance = $modal.open({
						template: '<div class="modal-header"><button type="button" class="close" aria-hidden="true" ng-click="close()">&times;</button><h3>RateFast</h3></div><div class="modal-body"><div class="login-sign"><h3>A unknown Error has occured</h3></div></div><div class="modal-footer"><button class="btn btn-primary" ng-click="close()">Ok</button></div>',
						controller: 'popupButtonCtrlclose'
					});
				}
				);
				$("#spiningwheel").show();
			}
		}

		$scope.validateSocialForm = function (socialhistoryform) {
			$scope.submitted = true;
			$scope.validate = false;
			if (socialhistoryform.$valid) {
				var urlArray = window.location.pathname.split('/');
				
				//Appending "Patient comment: " to Social History text areas				
				if($scope.patientModel.sh[0].chkOccupationalHistoryOtherTextarea!=null && $scope.patientModel.sh[0].chkOccupationalHistoryOtherTextarea!='')
					$scope.patientModel.sh[0].chkOccupationalHistoryOtherTextarea = 'Patient comment: "' + $scope.returnInnerText($scope.patientModel.sh[0].chkOccupationalHistoryOtherTextarea) + '"';
				
				if($scope.patientModel.sh[0].shfreedataentry!=null && $scope.patientModel.sh[0].shfreedataentry!='')
					$scope.patientModel.sh[0].shfreedataentry = 'Patient comment: "' + $scope.returnInnerText($scope.patientModel.sh[0].shfreedataentry) + '"';
				
				if($scope.patientModel.sh[0].SHrdoLevelOfEducationtextA!=null && $scope.patientModel.sh[0].SHrdoLevelOfEducationtextA!='')
					$scope.patientModel.sh[0].SHrdoLevelOfEducationtextA = 'Patient comment: "' + $scope.returnInnerText($scope.patientModel.sh[0].SHrdoLevelOfEducationtextA) + '"';
				
				if($scope.patientModel.sh[0].rdoSecondJobsTextarea!=null && $scope.patientModel.sh[0].rdoSecondJobsTextarea!='')
					$scope.patientModel.sh[0].rdoSecondJobsTextarea = 'Patient comment: "' + $scope.returnInnerText($scope.patientModel.sh[0].rdoSecondJobsTextarea) + '"';
				
				if($scope.patientModel.sh[0].rdoSelfEmploymentTextarea!=null && $scope.patientModel.sh[0].rdoSelfEmploymentTextarea!='')
					$scope.patientModel.sh[0].rdoSelfEmploymentTextarea = 'Patient comment: "' + $scope.returnInnerText($scope.patientModel.sh[0].rdoSelfEmploymentTextarea) + '"';
				
				if($scope.patientModel.sh[0].rdoMilitaryServiceTextarea!=null && $scope.patientModel.sh[0].rdoMilitaryServiceTextarea!='')
					$scope.patientModel.sh[0].rdoMilitaryServiceTextarea = 'Patient comment: "' + $scope.returnInnerText($scope.patientModel.sh[0].rdoMilitaryServiceTextarea) + '"';
				
				if($scope.patientModel.sh[0].chkHobbiesOtherTextarea!=null && $scope.patientModel.sh[0].chkHobbiesOtherTextarea!='')
					$scope.patientModel.sh[0].chkHobbiesOtherTextarea = 'Patient comment: "' + $scope.returnInnerText($scope.patientModel.sh[0].chkHobbiesOtherTextarea) + '"';
				
				if($scope.patientModel.sh[0].txtCaffeine!=null && $scope.patientModel.sh[0].txtCaffeine!='')
					$scope.patientModel.sh[0].txtCaffeine = 'Patient comment: "' + $scope.patientModel.sh[0].txtCaffeine + '"';
				
				if($scope.patientModel.sh[0].txtStreetDrug!=null && $scope.patientModel.sh[0].txtStreetDrug!='')
					$scope.patientModel.sh[0].txtStreetDrug = 'Patient comment: "' + $scope.patientModel.sh[0].txtStreetDrug + '"';
				
				if($scope.patientModel.sh[0].txtTobacco!=null && $scope.patientModel.sh[0].txtTobacco!='')
					$scope.patientModel.sh[0].txtTobacco = 'Patient comment: "' + $scope.patientModel.sh[0].txtTobacco + '"';
				
				if($scope.patientModel.sh[0].txtAlcohol!=null && $scope.patientModel.sh[0].txtAlcohol!='')
					$scope.patientModel.sh[0].txtAlcohol = 'Patient comment: "' + $scope.patientModel.sh[0].txtAlcohol + '"';
				
				
				$http.post("/api/injurykickstart/socialhistory/" + urlArray[urlArray.length - 1], { patientModel: $scope.patientModel, submittedby: $scope.type, step1patient: $scope.step1patientres }).then(function (response) {
					
					var msg = 'Information is submitted successfully to the RateFast team.!';
					setTimeout(function () { $("#spiningwheel").hide(); }, 2000);
					debugger;
					$scope.step = 4;
					$('body').scrollTop(0);
				}, function (response) {
					setTimeout(function () { $("#spiningwheel").hide(); }, 2000);
					var msg = typeof (response.data.message) != "undefined" ? response.data.message : 'Something went wrong. Please retry';
					$rootScope.modalInstance = $modal.open({
						template: '<div class="modal-header"><button type="button" class="close" aria-hidden="true" ng-click="close()">&times;</button><h3>RateFast</h3></div><div class="modal-body"><div class="login-sign"><h3>A unknown Error has occured</h3></div></div><div class="modal-footer"><button class="btn btn-primary" ng-click="close()">Ok</button></div>',
						controller: 'popupButtonCtrlclose'
					});
				}
				);
				$("#spiningwheel").show();
			}
		}
		
		$scope.validateForm = function (kickstartform) {
			$scope.submitted = true;
			$scope.validate = false;
			$scope.type = kickstartform.empType.$viewValue;
			if (kickstartform.$valid) {
				$("#spiningwheel").show();
				//if ($scope.terms) { 
				var captcha_response = vcRecaptchaService.getResponse();



				if (captcha_response === "") {
					setTimeout(function () { $("#spiningwheel").hide(); }, 2000);
					$rootScope.modalInstance = $modal.open({
						template: '<div class="modal-header"><button type="button" class="close" aria-hidden="true" ng-click="close()">&times;</button><h3>RateFast</h3></div><div class="modal-body"><div class="login-sign"><h3>Please resolve the captcha and submit!</h3></div></div><div class="modal-footer"><button class="btn btn-primary" ng-click="close()">Ok</button></div>',
						controller: 'popupButtonCtrlclose'
					});
				} else {
					var urlArray = window.location.pathname.split('/');

					try {
						var today = new Date();
						var dd = today.getDate();
						var mm = today.getMonth() + 1; //January is 0!
						var yyyy = today.getFullYear();

						if (dd < 10) { dd = '0' + dd }
						if (mm < 10) { mm = '0' + mm }
						var today = mm + '/' + dd + '/' + yyyy;
						today = new Date();
						var hours = today.getHours();
						var minutes = today.getMinutes();
						var ampm = hours >= 12 ? 'pm' : 'am';
						hours = hours % 12;
						hours = hours ? hours : 12; // the hour '0' should be '12'
						minutes = minutes < 10 ? '0' + minutes : minutes;
						var strTime = hours + ':' + minutes + ' ' + ampm;

						var otherAdditionalComments = "";

						if ($scope.type != 'Attorney') {
							var workertype='';
							if($scope.type=='InjuredWorker')
								workertype='injured worker';
							else
								workertype=$scope.type;
							
							otherAdditionalComments = "Claim information submitted by the " + workertype + " on " + today + " at " + strTime + " from the " + window.location.href + " form.";
							if ($scope.patientModel.injury[0].injurydata.communication.othernotes != '') {
								otherAdditionalComments = otherAdditionalComments + '<br/> The ' + workertype + ' included the following additional comments: "' + $scope.patientModel.injury[0].injurydata.communication.othernotes + '!"';
																
							}
							else {
								otherAdditionalComments = otherAdditionalComments + '<br/> The ' + workertype + ' did not include any additional comments.';
							}
						}
						if ($scope.type == 'Attorney') {
							if ($scope.patientModel.injury[0].injurydata.involvementradio == 'applicantattorney') {
								otherAdditionalComments = "Claim information submitted by the applicant attorney on " + today + " at " + strTime + " from the " + window.location.href + " form.";

								if ($scope.patientModel.injury[0].injurydata.communication.othernotes != '') {
									otherAdditionalComments = otherAdditionalComments + '<br/> The applicant attorney included the following additional comments: "' + $scope.patientModel.injury[0].injurydata.communication.othernotes + '!"';
								} else {
									otherAdditionalComments = otherAdditionalComments + "<br/>  The applicant attorney did not include any additional comments.";
								}
							}
							else if ($scope.patientModel.injury[0].injurydata.involvementradio == 'defenseattorney') {
								otherAdditionalComments = "Claim information submitted by the defense attorney on " + today + " at " + strTime + " from the " + window.location.href + " form.";

								if ($scope.patientModel.injury[0].injurydata.communication.othernotes != '') {
									otherAdditionalComments = otherAdditionalComments + '<br/> The defense attorney included the following additional comments: "' + $scope.patientModel.injury[0].injurydata.communication.othernotes + '!"';
								} else {
									otherAdditionalComments = otherAdditionalComments + "<br/> The defense attorney did not include any additional comments.";
								}
							}
						}

						
						$scope.patientModel.injury[0].injurydata.communication.othernotes = otherAdditionalComments;
						

					} catch (err) {
						//console.log(err);
						//setTimeout(function(){ $("#spiningwheel").hide(); }, 2000);
					}
					debugger;

					$http.post("/api/injurykickstart/" + urlArray[urlArray.length - 1], { 'response': captcha_response, patientModel: $scope.patientModel, submittedby: $scope.type }).then(function (response) {
						var msg = 'Information is submitted successfully to the RateFast team.!';
						setTimeout(function () { $("#spiningwheel").hide(); }, 2000);
						debugger;
						if ($scope.type == "InjuredWorker") {
							$scope.step = 2;
							$scope.step1patientres = response.data.data;
							$('body').scrollTop(0);
						} else {
							$window.location.href = '/injurykickstartsuccess/' + urlArray[urlArray.length - 1];
						}
					}, function (response) {
						setTimeout(function () { $("#spiningwheel").hide(); }, 2000);
						var msg = typeof (response.data.message) != "undefined" ? response.data.message : 'Something went wrong. Please retry';
						vcRecaptchaService.reload();
						$rootScope.modalInstance = $modal.open({
							template: '<div class="modal-header"><button type="button" class="close" aria-hidden="true" ng-click="close()">&times;</button><h3>RateFast</h3></div><div class="modal-body"><div class="login-sign"><h3>' + msg + '</h3></div></div><div class="modal-footer"><button class="btn btn-primary" ng-click="close()">Ok</button></div>',
							controller: 'popupButtonCtrlclose'
						});
					}
					);
				}

			}
			else {
				setTimeout(function () { $("#spiningwheel").hide(); }, 2000);
				$rootScope.modalInstance = $modal.open({
					template: '<div class="modal-header"><button type="button" class="close" aria-hidden="true" ng-click="close()">&times;</button><h3>RateFast</h3></div><div class="modal-body"><div class="login-sign"><h3>Please enter all required fields.</h3></div></div><div class="modal-footer"><button class="btn btn-primary" ng-click="close()">Ok</button></div>',
					controller: 'popupButtonCtrlclose'
				});

			}
		}
	});