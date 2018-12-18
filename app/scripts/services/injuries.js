'use strict';

angular.module('ratefastApp').factory('Injuries', ['$resource', function ($resource) {
    return {
        getclaimadmin: function () {
            return $resource('/api/getclaimadmin');
        },
        saveinjuries: function () {
            return $resource('/api/patients/createinjuries');
        },
        getlatestinjuries: function () {
            return $resource('/api/patients/getlatestinjuries/:ptid/:skip');
        },
        getinjurylibrary: function () {
            return $resource('/api/patients/getinjurylibrary/:ptid/:skip');
        },
        getidpinfo: function () {
            return $resource('/api/patients/getidpinfo/:ptid/:skip');
        },
        getinjuries: function () {
            return $resource('/api/patients/getinjuriesinformation/:ptid/:injid');
        },
        updateinjuries: function () {
            return $resource('/api/patients/updateinjurydetails/:injid');
        },
        updateinjuryinfo: function () {
            return $resource('/api/patients/updateinjuryinformationdetails/:injid');
        },
        updatecommunicationinfo: function () {
            return $resource('/api/patients/updatecommunicationdetails');
        },
        updatesubinjuries: function () {
            return $resource('/api/patients/addsubinjuries');
        },
        updatesubinjuriesforbdpart: function () {
            return $resource('/api/patients/addsubinjuriesbdpart');
        },
        updatearchiveStatus: function () {
            return $resource('/api/injuries/archiveStatus');
        },
        deleteInjury: function () {
            return $resource('/api/injuries/deleteInjury');
        },
        addViewer: function () {
            return $resource('/api/injuries/addViewer');
        },
        basicsearch: function () {
            return $resource('/api/injuries/search',
                {}, { 'save': { method: 'POST' } });
        },
        //basicsearch: function () {
        //    //return $resource('/api/injuries/search/:reporttype/:startdate/:enddate/:bodypart/:provider');
        //    return $resource('/api/injuries/search/:ptid/:rstatus/:provider');
        //},
        basicreportsearch: function () {
            return $resource('/api/injuries/searchforreport',
                {}, { 'save': { method: 'POST' } });
        },
        //basicreportsearch: function () {
        //    //return $resource('/api/injuries/search/:reporttype/:startdate/:enddate/:bodypart/:provider');
        //    return $resource('/api/injuries/searchforreport/:start/:end/:ptid/:rstatus/:injid/:provider');
        //},
        getuserlist: function () {
            //return $resource('/api/injuries/search/:reporttype/:startdate/:enddate/:bodypart/:provider');
            return $resource('/api/injuries/getuserlist/:practiceaccnt');
        },
        getreportinfo: function () {
            return $resource('/api/injuries/getreportinfo/:repid');
        },
        updateEmployeehandedness: function () {
            return $resource('/api/injuries/updateEmployeeHandedness');
        },
		updatePatientConfirmStatus: function () {
            return $resource('/api/injuries/updatepatientConfirmedStatus');
        }
    }

}]);