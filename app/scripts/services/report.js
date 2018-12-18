/**
 * Created by Mayur.Mathurkar on 2/21/14.
 */
'use strict';

angular.module('ratefastApp').factory('FormTypeList', ['$resource', function ($resource) {
    return $resource('/api/getreports');
}]);

//angular.module('ratefastApp').factory('getReportlist', ['$resource', function ($resource) {
//    //return $resource('/api/getreportslist');
//	 return $resource('/api/getreportslist', { //parameters default
//        update: {
//            method: 'POST',
//            params: {}
//        }
//    });
//}]);

angular.module('ratefastApp').factory('getFormdata', ['$resource', function ($resource) {
    return $resource('/api/getformdata/:id');
}]);


angular.module('ratefastApp').factory('versionList', ['$resource', function ($resource) {
    return $resource('/api/getversions/:formid');
}]);

angular.module('ratefastApp').factory('saveForm', ['$resource', function ($resource) {
    return $resource('/api/savenewform/:id', {
        id: '@id'
    }, { //parameters default
        update: {
            method: 'PUT',
            params: {}
        }
    });
}]);

angular.module('ratefastApp').factory('saveReport', ['$resource', function ($resource) {
    return $resource('/api/savereport');
}]);

angular.module('ratefastApp').factory('getReportlist', ['$resource', function ($resource) {
    return $resource('/api/getreportlist/:statusController/:statusId/:searchController/:searchId/:pageController/:pagenum', {
        searchId: '@searchId',
        searchController: '@searchController',
        pagenum: '@pagenum',
        pageController: '@pageController',
        statusId: '@statusId',
        statusController: '@statusController'
    });
}]);

angular.module('ratefastApp').factory('getReportlistPost', ['$resource', function ($resource) {
    return $resource('/api/getreportlistpost/', {},
	{
	    update: {
	        method: 'POST',
	        params: {}
	    }
	});
}]);

angular.module('ratefastApp').factory('FormList', ['$resource', function ($resource) {
    
	/* return $resource('/api/getformlist/:statusController/:statusId/:searchController/:searchId/:pageController/:pagenum', {
        searchId: '@searchId',
        searchController: '@searchController',
        pagenum: '@pagenum',
        pageController: '@pageController',
        statusId: '@statusId',
        statusController: '@statusController'
    });
	*/
	return $resource('/api/getformlist', {},
    { 
        update: {
            method: 'POST',
            params: {}
        }

    });
}]);

angular.module('ratefastApp').factory('updatereportdata', ['$resource', function ($resource) {
    return $resource('/api/updatereportdata/:reportid', {
        reportid: '@reportid'
    }, { 
        update: {
            method: 'PUT',
            params: {}
        }
    });
}]);

angular.module('ratefastApp').factory('reportFormdata', ['$resource', function ($resource) {
    return $resource('/api/reportform/status/:id', {
        id: '@id'      
    });
}]);

angular.module('ratefastApp').factory('reportFormdataByVersion', ['$resource', function ($resource) {
    return $resource('/api/reportformbyversion/:id/:version', {
        id: '@id',
        version: '@version'
    });
}]);

angular.module('ratefastApp').factory('reportFormdataById', ['$resource', function ($resource) {
    return $resource('/api/reportformbyid/:id', {
        id: '@id'
    }, {
        get: {
            method: "GET",
            cache: true
        }
    });
}]);

angular.module('ratefastApp').factory('getReportdata', ['$resource', function ($resource) {
    return $resource('/api/reportdata/:id', {
        id: '@id'
    });
}]);

angular.module('ratefastApp').factory('getSavedreportdata', ['$resource', function ($resource) {
    return $resource('/api/saveddata');
}]);

angular.module('ratefastApp').factory('getReportListData', ['$resource', function ($resource) {
    return $resource('/api/reportlistdata/:type/:version', {
        type: '@type',
        version: '@version'
    });
}]);

angular.module('ratefastApp').factory('newpatientData', ['$resource', function ($resource) {
    return $resource('/api/patientdata/:patientid', {
        patientid: '@patientid'
    });
}]);

angular.module('ratefastApp').factory('savePatientdata', ['$resource', function ($resource) {
    return $resource('/api/patientdata/save',
                  {}, { 'save': { method: 'POST' } });
}]);

angular.module('ratefastApp').factory('updateReportStatus', ['$resource', function ($resource) {
    return $resource('/api/updatereportstatus/:reportid', {
        reportid: '@reportid'
    });
}]);

angular.module('ratefastApp').factory('getsavedPatientid', ['$resource', function ($resource) {
    return $resource('/api/getpatientdata/:patientid',
                    { patientid: '@patientid' });
}]);

angular.module('ratefastApp').factory('getExistingdata', ['$resource', function ($resource) {
    return $resource('/api/getexistingdata/:patientid/:injuryid',
                    { patientid: '@patientid', injuryid: '@injuryid' });
}]);

angular.module('ratefastApp').factory('getLatestClosedReport', ['$resource', function ($resource) {
    return $resource('/api/getlatestclosedreport/:patientid/:injuryid',
                    { patientid: '@patientid', injuryid: '@injuryid' });
}]);

angular.module('ratefastApp').factory('getReportCardView', ['$resource', function ($resource) {
    return $resource('/api/getreportcardview/:patientid/:injuryid',
                    { patientid: '@patientid', injuryid: '@injuryid' });
}]);

angular.module('ratefastApp').factory('deletereport', ['$resource', function ($resource) {
    return $resource('/api/deletereport/:reportid',
                    { reportid: '@reportid'});
}]);

angular.module('ratefastApp').factory('updatePatientdata', ['$resource', function ($resource) {
    return $resource('/api/updatepatientdata/:id/:injuryid', {
        id: '@id',
        injuryid: '@injuryid'
    }, { //parameters default
        update: {
            method: 'PUT',
            params: {}
        }
    });
}]);

angular.module('ratefastApp').factory('getexistingpatientData', ['$resource', function ($resource) {
    return $resource('/api/getexistingpatient/:reportid', {}, {
        'query': { method: 'GET', isArray: true }
    });
}]);

angular.module('ratefastApp').factory('selectinjuriesPatientdata', ['$resource', function ($resource) {
    return $resource('/api/selectinjuriespatientdata/:injuryid', {
        injuryid: '@injuryid'
    });
}]);

angular.module('ratefastApp').factory('getReportListData', ['$resource', function ($resource) {
    return $resource('/api/reportlistdata/:type/:version', {
        type: '@type',
        version: '@version'
    });
}]);

//angular.module('ratefastApp').factory('newpatientData', ['$resource', function ($resource) {
//    return $resource('/api/patientdata/:id', {
//        id: '@id'
//    });
//}]);

angular.module('ratefastApp').factory('updatePatienttable', ['$resource', function ($resource) {
    return $resource('/api/updatepatienttable', {
    }, { //parameters default
        update: {
            method: 'POST',
            params: {}
        }
    });
}]);

angular.module('ratefastApp').factory('savePatientdata', ['$resource', function ($resource) {
    return $resource('/api/patientdata/save');
}]);

angular.module('ratefastApp').factory('getExistingdata', ['$resource', function ($resource) {
    return $resource('/api/getexistingdata/:patientid/:injuryid',
                    { patientid: '@patientid', injuryid: '@injuryid' });
}]);

angular.module('ratefastApp').factory('chargeReport', ['$resource', function ($resource) {
    return $resource('/api/cardpayment/:practicename/:chargeamount', {
        practicename: '@practicename'
    });
}]);

angular.module('ratefastApp').factory('currentUserdata', ['$resource', function ($resource) {
    return $resource('/api/currentuserdata/:userid', {
        userid: '@userid'
    });
}]);

angular.module('ratefastApp').factory('getPublishReportId', ['$resource', function ($resource) {
    return $resource('/api/getrandompublishreportid/:formtype/:formversion', {
        formtype: '@formtype',
        formversion: '@formversion'
    });
}]);

angular.module('ratefastApp').factory('getReportDataById', ['$resource', function ($resource) {
    return $resource('/api/reportdatabyid/:reportid', {
        reportid: '@reportid'
    });
}]);

angular.module('ratefastApp').factory('getsubmittedpr4Reportdata', ['$resource', function ($resource) {
    return $resource('/api/patientsubmittedreportdata',
      {},
      { 'save': { method: 'POST' } });
}]);


angular.module('ratefastApp').factory('openedReportTrack', ['$resource', function ($resource) {
    return {
        updatereportloginfo: function () {
            return $resource('/api/log/updatereportloginfo/:reportid');
        },
        deletereportloginfo: function () {
            return $resource('/api/log/deletereportloginfo/:username/:reportid');
        },
        getopenedreportcount: function () {
            return $resource('/api/log/getopenedreportcount/:reportid');
        }
    }
}]);

angular.module('ratefastApp').factory('reportLogging', ['$resource', function ($resource) {
    return {
        reportopen: function () {
            return $resource('/api/log/reportopenlog/:reportid');
        },
        reportclose: function () {
            return $resource('/api/log/submitedreportcloselog/:reportid');
        }
    }
}]);

angular.module('ratefastApp').factory('downloadReportSafari', ['$resource', function ($resource) {
    return $resource('/api/downloadreport',
                  {}, { 'save': { method: 'POST' } });
}]);

angular.module('ratefastApp').factory('updateReportData', ['$resource', function ($resource) {
    return $resource('/api/savereportdata',
                  {}, { 'save': { method: 'POST' } });
}]);

angular.module('ratefastApp').factory('getccchargereport', ['$resource', function ($resource) {
    return $resource('/api/ccchargereport/getdetails',
                  {}, { 'save': { method: 'POST' } });
}]);

//Service for master charge report
angular.module('ratefastApp').factory('getmasterchargereportdata', ['$resource', function ($resource) {
    return $resource('/api/masterchargereport/getdata',
                  {}, { 'save': { method: 'POST' } });
}]);

angular.module('ratefastApp').factory('getreportactivity', ['$resource', function ($resource) {
    return $resource('/api/getreportactivity/getdetails',
                  {}, { 'save': { method: 'POST' } });
}]);

angular.module('ratefastApp').factory('getreportAllactivity', ['$resource', function ($resource) {
    return $resource('/api/getreportAllactivity/getdetails',
                  {}, { 'save': { method: 'POST' } });
}]);

angular.module('ratefastApp').factory('getpr4ClosedReports', ['$resource', function ($resource) {
    return $resource('/api/getpr4ClosedReports',
        {},
        { 'save': { method: 'POST' } });
}]);

/**
 * RFA service for card view
 */
angular.module('ratefastApp').factory('rfacard', ['$resource','$http','$q','$cookies', function ($resource,$http,$q,$cookies) {
   
 
      //new factory setting
      
      
     var service={};     
	 service.getCard=function(query){
		 var deferred=$q.defer();
		 $http.get('/api/rfacard/'+query.injuryid+'/'+query.patientid+'/'+query.state).success(function(data) {
			 deferred.resolve(data)
	  	     service.card=data[0].rfacards	    	
	  	  });
		 return deferred.promise;
	 }
	 
	 service.getUserData=function(query){
			 return $resource('/api/rfacarduserdetail', {},{ 
			 query: { method: "GET", isArray: true }
			 //query: { method: "GET"}
			 });					 
	 }
	 
	 service.rfacarduser=function(query){
		 return $resource('/api/rfacarduser/:id', {},{ 
			 query: { method: "GET", isArray: true }
			 });		
	 }
	
	 service.updateRfaCard=function(){
		return $resource('/api/rfacard', {},{	   
	    update:{method: 'PUT'}
	  });		
	 }
	 	 
	 service.setCurrReport=function(rfa){
		 service.selectedRfa=rfa;
		
	 }
	 service.setCurrRfaIndex=function(index){
		 service.selectedRfaIndex=index;
		
	 }
	 service.getCurrReport=function(){
		 return service.selectedRfa;		
	 }
	 service.getCurrRfaIndex=function(){
		 return service.selectedRfaIndex;
	 }
	  return service;
	
	/* return $resource('/api/rfacard/:injuryid/:patientid/:state',
      {
      });*/
	 
	
}]);

/**
 * Service for saving work status note feature
 * 
 */
angular.module('ratefastApp').factory('serviceworkstatusnote', ['$resource', function ($resource) {
    return $resource('/api/workstatus',
                  {}, { 'save': { method: 'POST' } });
}]);


angular.module('ratefastApp').factory('serviceworkstatusnotefax', ['$resource', function ($resource) {
    return $resource('/api/workstatus/fax',
                  {}, { 'save': { method: 'POST' } });
}]);

/**Service to display report count as per claim administrator
 *Author: Unais K
 *Date: 14th March, 2016
 **/
angular.module('ratefastApp').factory('serviceGetReportsClaimAdmWise', ['$resource', function ($resource) {
    return $resource('/api/claimadm/count',
                  {}, { 'save': { method: 'POST' } });
}]);


