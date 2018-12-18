'use strict';

angular.module('ratefastApp').controller('addendumCtrl', function ($scope,$rootScope,$modal, $filter,$location,$anchorScroll, $http,getexistingpatientData) {	
		$scope.dispayProgress = true;
		$scope.addendumText='';
		$scope.urlArray='';
		$scope.date = new Date();
		$scope.currentUser = $rootScope.currentUser;
		$scope.urlArray = window.location.pathname.split('/');
		$scope.reportid = $scope.urlArray[$scope.urlArray.length-1];
		$scope.getexistingpatientData=getexistingpatientData;
		$scope.formTypeName="";
		$scope.patientName ="";
		
		/**
		 * this function return the template url
		 * url used to load file as per version and flavor defined
		 */
    $scope.getHTMLTemplatePreviewSubmit = function (formtype, version, flavor) {
        var strTemplate = "";
        flavor = 'a';
        strTemplate = "partials/" + formtype + "/v" + version + "/" + flavor + "/" + formtype + "-main.html";
        return strTemplate;
    }
		$scope.datenewFormat = function (input) {
				if (input == null) { return ""; }

				var date = $filter('date')(new Date(input), 'MM/dd/yyyy');
				return date;
		}

		$scope.getReport=function(callback){
					$scope.getexistingpatientData.query({ 'reportid': $scope.reportid }).$promise.then(function (result) {
					if(result[0].patientData.length>0){
							$scope.report=result[0].patientData[0];
							$scope.patientName = $scope.report.data.bginfo.firstname + " " + $scope.report.data.bginfo.lastname;
							if ($scope.report.formtype) {
								switch ($scope.report.formtype) {
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
							callback();
						}else{
							$rootScope.modalInstance = $modal.open({
								 templateUrl: 'partials/popupmessage.html',
								 controller: 'popupMessagectrl',
								 resolve: {
										 message: function () {
												 return "No such report Present";
										 }
								 }
						 });
						}
				});
		}
		//call the function to get report data
		$scope.getReport(function(){
				$scope.dispayProgress = false;
		});
	$scope.previewReport = function () {
			$scope.getReport(function(){
				$scope.dispayProgress = true;
				$scope.report.data.addendum=[];				
				
				if(typeof($scope.report.addendum)=="undefined"){
						$scope.report.data.addendum=[];
				}else{
					if($scope.report.addendum.length>0){
						$scope.report.data.addendum=$scope.report.addendum;
					}
				}
				
				$scope.report.data.addendum.push({
					user:$scope.currentUser,	
					comment:$scope.addendumText,
					creation_date:new Date()
				});
				
			var strTemplate = $scope.getHTMLTemplatePreviewSubmit($scope.report.formtype, $scope.report.version,$scope.report.flavor);
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
									return $scope.report.flavor;
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
									return "";
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
				$rootScope.modalPreview.result.then(function (isconfirm) {
						$scope.dispayProgress = false;
				}, function () {
						$scope.dispayProgress = false;
				});
			})
		
				
		}
		$scope.cancelExit = function() {
			$location.path('/createreport');
			$location.replace();
		};
		
		$scope.saveAddendum = function() {
						
			if ($scope.addendum.$valid) {
				$scope.dispayProgress = true; 
					var addendumData={
							addendum:{
								user:$scope.currentUser,	
								comment:$scope.addendumText,
								creation_date:new Date()
							},
							reportid:$scope.report._id
					}
				$http.post('/api/addendum', addendumData).then(function(data){
				//success
				
				$rootScope.modalInstance = $modal.open({
						 templateUrl: 'partials/popupmessage.html',
						 controller: 'popupMessagectrl',
						 resolve: {
								 message: function () {
										 return "Your addendum has been added to the bottom of the report.";
								 }
						 }
				 });
					$scope.dispayProgress = false; 
					$location.path('/createreport');
					$location.replace();
			}, function(err){
			$scope.dispayProgress = false; 
				$rootScope.modalInstance = $modal.open({
						 templateUrl: 'partials/popupmessage.html',
						 controller: 'popupMessagectrl',
						 resolve: {
								 message: function () {
										 return "Something Went Wrong.";
								 }
						 }
				 });
			});
			}else{
				$scope.dispayProgress = false;
			
				$rootScope.modalInstance = $modal.open({
						 templateUrl: 'partials/popupmessage.html',
						 controller: 'popupMessagectrl',
						 resolve: {
								 message: function () {
										 return "Please complete all the fields";
								 }
						 }
				 });
			}
		};
});