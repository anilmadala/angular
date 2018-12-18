'use strict';

angular.module('ratefastApp')
  .factory('Patients', ['$resource', function ($resource) {
      var patients = $resource('/api/patients/:searchController/:pageController/:pagenum/:practicename/:sfname/:slname/:sdob/:ssocial/:selectedstatecode', {
          practicename: '@practicename',
          searchController: '@searchController',
          pageController: '@pageController',
          pagenum: '@pagenum',
          sfname: '@sfname',
          slname: '@slname',
          sdob: '@sdob',
          ssocial: '@ssocial',
          selectedstatecode: '@selectedstatecode'
      });
      var getpatient = $resource('/api/patients/:patientid/:category', {
          patientid: '@_patientid',
          category: '@_category'
      });
      return {
          patientSearch: function () {
              return $resource('/api/patientsearch',
                  {}, { 'save': { method: 'POST' } });
          },
          getRecentPatients: function () {
              return $resource('/api/patients/recent/:pageController/:pagenum/:selectedstatecode', {});
          },
          createPatient: function () {
              return $resource('/api/patients/create',
                  {}, { 'save': { method: 'POST' } });
          },
          updatePatient: function () {
              return $resource('/api/patients/update',
                  {}, { 'save': { method: 'POST' } });
          },
          updateRecentViews: function () {
              return $resource('/api/patients/updateRecentViews',
                  {}, { 'save': { method: 'POST' } });
          },
          getcurrentPatientpracticeName: function () {
              debugger;
              return $resource('/api/getcurrentloggedinpatient/:patientid', {
                  patientid: '@_patientid'
              });
          },
          getDFRDiscovery: function () {
              return $resource('/api/getdfrdiscovery/:practicename/:state', {});
          },
		  patientWithReportSearch: function () {
              return $resource('/api/searchpatientwithreports',
                  {}, { 'save': { method: 'POST' } });
          },
          patients: patients,
          getpatient: getpatient
      }
  }]);

