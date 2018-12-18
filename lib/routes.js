'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    session = require('./controllers/session'),
    mail = require('./controllers/mail'),
    blogs = require('./controllers/blogs'),
    salespersons = require('./controllers/salespersons'),
    states = require('./controllers/states'),
    countries = require('./controllers/countries'),
    questions = require('./controllers/questions'),
    practices = require('./controllers/practices'),
    specialities = require('./controllers/specialities'),
    forms = require('./controllers/forms'),
    reports = require('./controllers/reports'),
    patients = require('./controllers/patients'),
    injuries = require('./controllers/injuries'),
    patientforms = require('./controllers/patientformdata'),
	chargereport = require('./controllers/chargereport'),
    unsignedreports = require('./controllers/unsignedreports'),
    authcim = require('./controllers/authorize-cim'),
    reportpricing = require('./controllers/reportpricing'),
    billingcal = require('./controllers/billingcal'),
	 rfa = require('./controllers/rfa.controller.js'),
    //tinymce = require('./controllers/tinymce'),
    testimonial = require('./controllers/testimonial'),
    auditlog = require('./controllers/auditlog');
var middleware = require('./middleware');
var practice = require('./practice');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var encrypted = require('./controllers/encrypted');
var path= require('path');

//Used for Ratefast integration with third party
var passport = require('passport'); //Used for Ratefast integration with third party
var oauth2Controller = require('./controllers/oauth2'); //Used for Ratefast integration with third party
var oauthAPI = require('./controllers/oauthapi'); //Used for Ratefast integration with third party
var clientController = require('./controllers/client.js'); //Used for Ratefast integration with third party

//For injury kickstart system
var kickstartController  = require('./controllers/kickstart.js'); //Used for Ratefast injury kickstart system

////////////////////////////////////////////////////////////////////////////////////////////////////
// Setup
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Application routes
 */
module.exports = function (app) {

	 /**
		*  Oauth 2 .0
		*  Before any we should check the client
		*  1. Create a new login api route where its authentiacte and sends authorization code.
		*/

		app.get('/api/oauth2/authorize*', middleware.Oauth2,oauth2Controller.authorization);
		app.post('/api/oauth2/authorize/login*',practice.authenticate, session.loginOauth,oauth2Controller.authorization);
		app.post('/api/oauth2/authorize',middleware.Oauth2,oauth2Controller.decision);
		app.post('/api/oauth2/token',clientController.isClientAuthenticated,oauth2Controller.token);
		app.post('/api/oauth2/patientsearch', clientController.isBearerAuthenticated,clientController.getRequiredData,patients.searchpatients);
		app.post('/api/oauth2/patients/create',  clientController.isBearerAuthenticated,clientController.getRequiredData, oauthAPI.create);
		app.get('/api/clients',middleware.auth,clientController.getClients);
		app.post('/api/clients',middleware.auth,clientController.postClients);
		app.post('/api/clients/delete',middleware.auth,clientController.deleteClients);

		 /**
		*  Oauth 2 .0 ends here.
		*/





    app.post('/api/users/search', middleware.auth, users.usersSearch);
    //app.get('/api/users/page/:pagenum', middleware.auth, users.list);
    //app.get('/api/users/search/:searchId/page/:pagenum', middleware.auth, users.usersSearch);
    app.get('/api/users/me', middleware.auth, users.me);
    app.get('/api/users/:id', middleware.auth, users.show);
    app.put('/api/users/update/:id', middleware.auth, users.updateUser);
    app.get('/api/users/uniqueemail/:email', users.uniqueemail);
    app.get('/api/users/uniquename/:username', users.uniquename);
    app.post('/api/users', users.create);
    app.put('/api/users/:id', users.changePassword);
    app.post('/api/usersUpload', multipartMiddleware, users.uploadLogo);
    app.get('/api/usersGetLogo', users.getLogo);
    app.get('/api/users/userdata/:username', middleware.auth, users.getCurrentuserData);
    app.get('/api/getdataapi/:currentuserid/:currentuserlevel', middleware.auth, users.getusersData);
    app.get('/api/currentuserdata/:userid', middleware.auth, users.getCurrentloggedinUserData);
	app.post('/api/users/updateuserpassword/:id', middleware.auth, users.updateUserPaswword);
    //For Invite Users
    app.post('/api/users/inviteusers', practices.inviteusers);
    app.post('/api/users/resendinviteusers', practices.resendInvitation);
    app.post('/api/users/resetpassword', practices.resetpassword);
    app.put('/api/updateinvitedusers/:pname', users.invitedUsers);
    app.put('/api/updateinviteuserstatus/:id', users.updateinvitedUsersStatus);
    app.get('/api/getinviteuserinfo/:uid/:pname', users.getInviteuserStatusLevel);
    app.get('/api/getdataclinic/:currentusername', practices.getClinicLocation);
    app.get('/api/getstampofapproval/:practicename', practices.getStampofApproval);
	app.post('/api/getUserListByPracticename', practices.getUserList);

    //For all salesperson API calls
    app.get('/api/salespersons/page/:pagenum', middleware.auth, session.checkUserRoles(['siteadmin', 'superadmin']), salespersons.index);
    app.get('/api/salespersons/status/:statusId/page/:pagenum', salespersons.status);
    app.get('/api/salespersons/search/:searchId/page/:pagenum', salespersons.search);
    app.get('/api/salespersons/status/:statusId/search/:searchId/page/:pagenum', salespersons.combinedSearch);
    app.get('/api/salespersons/list', salespersons.listAll);
    app.post('/api/salespersons', salespersons.createSalesperson);
    app.put('/api/salespersons/:id', salespersons.updateSalesperson);

    //For All practices API calls
    app.get('/api/practice/uniquepractice/:practiceName', practices.uniquename);
    app.get('/api/practice/uniquelicense/:licenseNumber', practices.uniquelicense);
    app.post('/api/practices', practices.create);
	/**
     * New post api for practices search
     *
     */
    app.post('/api/practices/search', middleware.auth, practices.searchAllPractice);
	/**** End of post api. The following four apis are not used now****/
    app.get('/api/practices/page/:pagenum', middleware.auth, session.checkUserRoles(['siteadmin', 'superadmin', 'admin level1', 'admin level2', 'admin level3', 'admin level4']), practices.index);
    app.get('/api/practices/search/:searchId/page/:pagenum', middleware.auth, practices.search);
    app.get('/api/practices/status/:statusId/page/:pagenum', middleware.auth, session.checkUserRoles(['siteadmin']), practices.status);
	app.get('/api/practices/status/:statusId/search/:searchId/page/:pagenum', middleware.auth, session.checkUserRoles(['siteadmin']), practices.status);

    app.get('/api/practicesGetLogo', middleware.auth, practices.getLogo);
    app.post('/api/practicesUpload', multipartMiddleware, session.checkUserRoles(['siteadmin', 'superadmin', 'admin level1', 'admin level2', 'admin level3', 'admin level4']), practices.uploadLogo);
    app.put('/api/practicesUpdate/:practiceId', middleware.auth, session.checkUserRoles(['siteadmin', 'superadmin', 'admin level1', 'admin level2', 'admin level3', 'admin level4']), practices.editPractice);
    app.put('/api/updateCustomReportPricing/:practiceId', middleware.auth, session.checkUserRoles(['siteadmin', 'superadmin', 'admin level1', 'admin level2', 'admin level3', 'admin level4']), practices.updateCustomReportPricing);
    //app.put('/api/practicesUpdate/:practiceId', practices.editPractice);
    app.put('/api/practicesCreditCardUpdate/:practiceId', middleware.auth, session.checkUserRoles(['siteadmin', 'superadmin', 'admin level1', 'admin level2', 'admin level3', 'admin level4']), practices.editCreditCard);
    app.put('/api/practicesStampUpdate/:practiceId', middleware.auth, session.checkUserRoles(['siteadmin', 'superadmin', 'admin level1', 'admin level2', 'admin level3', 'admin level4']), practices.editStampApproval);

    app.get('/api/practices/:practiceId', middleware.auth, practices.getPracticeById);
    app.get('/api/practicesByName/:practiceName', middleware.auth, practices.getPracticeByName);
    app.get('/api/practices', middleware.auth, session.checkUserRoles(['siteadmin', 'superadmin', 'admin level1', 'admin level2', 'admin level3', 'admin level4']), practices.practiceList);

    app.get('/api/practices/activation/:activateid', session.checkaccountstatus);
    app.get('/api/getpracticedata/:practicename', middleware.auth, practices.getPracticeDatabyName);

    // For all Login related API calls
    app.post('/api/session', practice.authenticate, session.login);
    app.post('/api/session/forgotusername', users.checkcredentails);
    app.post('/api/session/checkcredentails', session.checkcredentails);
    app.post('/api/session/forgotpassword', session.checkcredentailspassword);
    app.post('/api/session/verifyanswer', session.verifyanswer);
    app.del('/api/session', session.logout);

    //For all Blogs
    app.get('/api/blog/:blogId', blogs.findone);
    app.get('/api/blog/page/:pagenum', blogs.index);
    app.get('/api/blog/cat/:catId/page/:pagenum', blogs.category);
    app.get('/api/blog/search/:searchId/page/:pagenum', blogs.search);

    // Testimonilas API Routes
    //app.get('/api/nodeenv', testimonial.nodeenv);
    app.get('/api/testimonial/random', testimonial.getRandom);
    app.get('/api/testimonial/page/:pagenum', testimonial.index);
    //For all forms API's
    app.get('/api/getreports', middleware.auth, session.checkUserRoles(['siteadmin']), reports.getformtype);
    //new api created by manoj
    app.post('/api/getformlist', middleware.auth, session.checkUserRoles(['siteadmin']), reports.getformlist);
    //below three api are commented and combined to single API
    //app.get('/api/getformlist/page/:pagenum', middleware.auth, reports.getformlist);
    //app.get('/api/getformlist/search/:searchId/page/:pagenum', middleware.auth, session.checkUserRoles(['siteadmin']), reports.formSearch);
    //app.get('/api/getformlist/status/:statusId/page/:pagenum', middleware.auth, session.checkUserRoles(['siteadmin']), reports.status);
    app.get('/api/getversions/:formid', middleware.auth, session.checkUserRoles(['siteadmin']), reports.getversions);
    app.post('/api/savenewform', middleware.auth, session.checkUserRoles(['siteadmin']), reports.saveNewform);
    app.put('/api/savenewform/:formid', middleware.auth, session.checkUserRoles(['siteadmin']), reports.saveForm);
    //new api created by manoj
    app.post('/api/getReportlistpost', middleware.auth, session.checkUserRoles(['siteadmin']), reports.getreportlistpost);
    //For all Reports API's
    app.get('/api/getreportlist/page/:pagenum', middleware.auth, session.checkUserRoles(['siteadmin']), reports.getreportlist);
    app.get('/api/getreportlist/search/:searchId/page/:pagenum', middleware.auth, session.checkUserRoles(['siteadmin']), reports.reportSearch);
    app.get('/api/getreportlist/status/:statusId/page/:pagenum', middleware.auth, session.checkUserRoles(['siteadmin']), reports.reportstatus);
    app.post('/api/savereport', middleware.auth, session.checkUserRoles(['siteadmin', 'superadmin', 'admin level1', 'admin level2', 'admin level3', 'admin level4', 'nonadmin level1', 'nonadmin level2', 'nonadmin level3', 'nonadmin level4']), reports.saveNewreport);
    app.get('/api/patientdata/:patientid', middleware.auth, reports.getnewPatientData);
    app.get('/api/reportform/status/:formType', middleware.auth, reports.getStatus);
    app.get('/api/reportformbyversion/:formtype/:version', middleware.auth, reports.getFormdataByVersion);
    app.get('/api/reportformbyid/:formid', middleware.auth, reports.getFormdataById);
    app.get('/api/reportdata/:reportid', middleware.auth, reports.getReportdatalist);
    app.get('/api/reportlistdata/:formtype/:formversion', middleware.auth, reports.getnewReportList);
    app.post('/api/patientdata/save', middleware.auth, patientforms.savePatientform);
    app.post('/api/updatepatienttable', middleware.auth, patientforms.updatePatientform);
    app.get('/api/updatereportstatus/:reportid', middleware.auth, patientforms.updateReportStatus);
    app.post('/api/savereportdata', middleware.auth, patientforms.saveReportData);

    // For Patients Form
    app.put('/api/updatepatientdata/:patientid', middleware.auth, patientforms.updatepatientFormData);
    app.get('/api/getexistingpatient/:reportid', middleware.auth, patientforms.getPatientData);
   // app.get('/api/getpatientdata/:patientid', middleware.auth, patientforms.getPatientData);
    app.get('/api/getexistingdata/:patientid/:injuryid', middleware.auth, patientforms.getsavedPatientdataList);
    app.get('/api/getlatestclosedreport/:patientid/:injuryid', middleware.auth, patientforms.getlatestclosedreport);
    app.get('/api/getReportCardView/:patientid/:injuryid', middleware.auth, patientforms.getReportCardViewList);
    app.get('/api/getdfrdiscovery/:practicename/:state', middleware.auth, patientforms.getdfrdiscovery);
    //download Report Safari
    app.post('/api/downloadreport', middleware.auth, patientforms.downloadreport);
    app.post('/api/ccchargereport/getdetails', middleware.auth, patientforms.getccchargereportdetails);
	app.post('/api/masterchargereport/getdata', middleware.auth, chargereport.getChargeReportData);
    //app.get('/api/ccchargereport/getdetails/:startdate/:enddate/:practicename', middleware.auth, patientforms.getccchargereportdetails);
    //audit log
    app.post('/api/getreportactivity/getdetails', middleware.auth, session.checkUserRoles(['siteadmin']), auditlog.getreportactivity);
    //app.get('/api/getreportactivity/getdetails/:startdate/:enddate/:practicename', middleware.auth, session.checkUserRoles(['siteadmin']), auditlog.getreportactivity);
    app.post('/api/getreportAllactivity/getdetails', middleware.auth, session.checkUserRoles(['siteadmin']), auditlog.getreportAllactivity);
    //app.get('/api/getreportAllactivity/getdetails/:startdate/:enddate/:practicename', middleware.auth, session.checkUserRoles(['siteadmin']), auditlog.getreportAllactivity);
    app.get('/api/getreportactivity/getpractices', middleware.auth, session.checkUserRoles(['siteadmin']), auditlog.getPracticename);

    app.get('/api/submittedReportcount/:practicename/:formtype', middleware.auth, patientforms.getsubmittedReportcount);
    //deleteReport
    app.get('/api/deletereport/:reportid', middleware.auth, session.checkUserRoles(['siteadmin', 'superadmin', 'admin level1', 'admin level2', 'admin level3', 'admin level4', 'nonadmin level3', 'nonadmin level4']), auditlog.deletereportlog('deleted'), patientforms.deletereport);
    //submited reportlog
    app.get('/api/log/submitedreportcloselog/:reportid', middleware.auth, auditlog.submitedreportcloselog);
    //Report Open Log
    app.get('/api/log/reportopenlog/:reportid', middleware.auth, auditlog.openreportlog);

    //opened Report Log
    app.get('/api/log/updatereportloginfo/:reportid', middleware.auth, auditlog.reportupdatelog);
    app.get('/api/log/deletereportloginfo/:username/:reportid', auditlog.reporTracktremovelog);
    app.get('/api/log/getopenedreportcount/:reportid', middleware.auth, auditlog.getopenedreportcount);

    app.get('/api/getformdata/:id', middleware.auth, reports.getformdata);
    app.put('/api/updatereportdata/:reportid', middleware.auth, reports.saveReportdata);

    // For all Patients
    app.get('/api/patients/page/:pagenum', middleware.auth, patients.getpatientlist);
    app.get('/api/patients/recent/page/:pagenum/:selectedstatecode', middleware.auth, patients.getrecentpatients);
    app.get('/api/patients/:patientid/:category', middleware.auth, patients.getpatient);

	//get patient's reports on home dashboard
    app.post('/api/searchpatientwithreports', middleware.auth, patients.searchPatientWithReport);
	app.post('/api/patientsearch', middleware.auth, patients.searchpatients);
    //app.get('/api/patients/search/page/:pagenum/:sfname/:slname/:sdob/:ssocial/:selectedstatecode', middleware.auth, patients.searchpatients);
    app.get('/api/selectinjuriespatientdata/:injuryid', middleware.auth, patients.getselectinjuriesData);
    app.post('/api/patients/create', middleware.auth, patients.createpatient);
    app.post('/api/patients/update', middleware.auth, patients.updatepatient);
    app.post('/api/patients/updateRecentViews', middleware.auth, patients.updaterecentviews);
    app.get('/api/getcurrentloggedinpatient/:patientid', middleware.auth, patients.getLoggedinPatientpracticename);
    //Encrypt check
    app.post('/api/encrypted/createrecord', encrypted.createrecord);
    app.get('/api/encrypted/fetchrecord', encrypted.fetchrecord);
    //Feedback
    app.get('/api/sendfeedbackmail/:feedback', middleware.auth, mail.sendfeedbackmail);
    // FOR INJURIES
    app.get('/api/patients/injuries/:id', middleware.auth, injuries.getpatientinjuries);
    app.post('/api/patients/createinjuries', middleware.auth, injuries.saveinjury);
    app.get('/api/getclaimadmin', middleware.auth, injuries.getclaimadmin);
    app.get('/api/patients/getlatestinjuries/:ptid/:skip', middleware.auth, injuries.getlatestinjuries);
    app.get('/api/patients/getinjurylibrary/:ptid/:skip', middleware.auth, injuries.getinjurylibrary);
    app.get('/api/patients/getidpinfo/:ptid/:skip', middleware.auth, injuries.getidpinfo);
    app.post('/api/patients/updateinjurydetails', middleware.auth, injuries.UpdateInjury);
    app.post('/api/patients/addsubinjuries', middleware.auth, injuries.addsubinjuries);
    app.post('/api/patients/updateinjuryinformationdetails', middleware.auth, injuries.UpdateInjuryinformation);
    app.post('/api/patients/addsubinjuriesbdpart', middleware.auth, injuries.addsubinjuriesbodypart);
    app.post('/api/injuries/archiveStatus', middleware.auth, injuries.archiveStatus);
    app.post('/api/injuries/deleteInjury', middleware.auth, injuries.deleteInjury);
    app.post('/api/injuries/addViewer', middleware.auth, injuries.addViewer);
    //app.get('/api/injuries/search/:ptid/:rstatus/:provider', middleware.auth, injuries.basicsearch);
    app.post('/api/injuries/search', middleware.auth, injuries.basicsearch);
    app.post('/api/injuries/searchforreport', middleware.auth, injuries.reportsearch);
    //app.get('/api/injuries/searchforreport/:start/:end/:ptid/:rstatus/:injid/:provider', middleware.auth, injuries.reportsearch);
    app.get('/api/injuries/getuserlist/:practiceaccnt', middleware.auth, injuries.getuserlist);
    app.get('/api/injuries/getreportinfo/:repid', middleware.auth, injuries.getreportinfo);
    app.post('/api/injuries/updateEmployeeHandedness', middleware.auth, patients.Updateemployeehandedness);
    app.post('/api/patients/updatecommunicationdetails', middleware.auth, injuries.UpdateCommunication);
	app.post('/api/injuries/updatepatientConfirmedStatus', middleware.auth, injuries.UpdatePatientConfirmedStatus);

    // For Reports
    //app.get('/api/patientdata/:practicename', middleware.auth, reports.getnewPatientData);
    app.get('/api/reportform/status', middleware.auth, reports.getStatus);
    app.get('/api/reportdata/:reportid', middleware.auth, reports.getReportdatalist);
    app.get('/api/reportlistdata/:formtype/:formversion', middleware.auth, reports.getnewReportList);
    app.get('/api/getrandompublishreportid/:formtype/:formversion', middleware.auth, reports.getrandompublishreportid);
    app.get('/api/reportdatabyid/:reportId', middleware.auth, reports.getreportDataByID);


    // For Unsigned Reports
    app.get('/api/unsignedreports/:practicename/:selectedstatecode', middleware.auth, session.checkUserRoles(['siteadmin', 'superadmin', 'admin level4', 'nonadmin level4']), unsignedreports.getUnsignedReports);

    //// FOR CREDIT CARD PAYMENTS
    app.get('/api/cardpayment/:chargeamount', middleware.auth, authcim.getCustomerProfile);

    //Billing Calculator
    app.get('/api/billingcalculator', middleware.auth, billingcal.rulesenginemethod);

    //manoj code
    app.post('/api/patientsubmittedreportdata', middleware.auth, patientforms.getsubmittedpr4ReportData);
    app.post('/api/getpr4ClosedReports', middleware.auth, patientforms.getpr4ClosedReports);

    //All other Api's for getting data on different controllers
    app.get('/api/speciality', specialities.allspecialities);
    app.get('/api/specialities', specialities.allspecialities);
    app.get('/api/states', states.allstates);
    app.get('/api/states/:status', states.getStatesByStatus);
    app.get('/api/countries', countries.allcountries);
    app.get('/api/questions', questions.allquestions);
    app.get('/api/forms/pricing', forms.pricing);
    app.get('/api/getquestionByEmail/:emailid', questions.getQuestionByemail);
    //For TinyMCE Demo
    //app.post('/api/tinymce', tinymce.saveText);
    //app.get('/api/tinymcedata', tinymce.getText);

    //All Report Pricing
    app.get('/api/reportpricing/:formtype', middleware.auth, reportpricing.getAllreportData);
    app.get('/api/getreportpricing/:formtype', middleware.auth, reportpricing.getReportPriceByType)
    app.post('/api/reportpricing', middleware.auth, reportpricing.savePricing);
    app.get('/api/getreportpricinglist', reportpricing.getReportPricingList);
    app.post('/api/updateglobalpricing', middleware.auth, reportpricing.updateGlobalPricing);
    // All other routes to use Angular routing in app/scripts/app.js
    app.get('/partials/*', index.partials);
    app.get('/tmp/*', index.tmp);

	 /**
     * API to download pdf issue
     */
    app.post('/api/download/DFR', function(req,res){

		res.download(__dirname + '/tmp/DFR_Report_John_Doe.pdf');

		//res.download(__dirname + '/tmp/PR2_Report_John_Doe.pdf');
    });
    app.post('/api/download/PR2', function(req,res){
    	res.download(__dirname + '/tmp/PR2_Report_John_Doe.pdf');
    });
    app.post('/api/download/PR4', function(req,res){
    	res.download(__dirname + '/tmp/PR4_Report_John_Doe.pdf');
    });

	/**
	 * Work status update feature for reports
	 */
    app.post('/api/workstatus', middleware.auth, patientforms.saveWorkStatus);
    app.post('/api/workstatus/fax', middleware.auth, patientforms.faxWorkStatus);

	 /**
	 * Addendum Api Feature for reports
	 */
	 app.post('/api/addendum', middleware.auth, patientforms.saveAddendum);
	 /**

	/* Injury kickstart API */
	app.post('/api/injurykickstart/:id', kickstartController.kickstart);
	app.post('/api/injurykickstart/verifyurl/:id', kickstartController.verifyPractice);
    app.post('/api/injurykickstart/medicalhistory/:id', kickstartController.medicalhistory);
    app.post('/api/injurykickstart/socialhistory/:id', kickstartController.socialhistory);
    app.post('/api/injurykickstart/scheduleappointment/:id', kickstartController.scheduleappointment);

     /* RFA card starts here*/

    app.get('/api/rfacard/:injuryid/:patientid/:state', middleware.auth, rfa.cards);
	app.post('/api/rfacard', middleware.auth, rfa.updateCards);
   	app.get('/api/rfacarduserdetail', middleware.auth, rfa.getuserdetails);
	app.post('/api/claimadm/count', middleware.auth, patientforms.getClaimAdmWiseReportCount);
	app.get('/api/rfacarduser/:id', middleware.auth, rfa.getuser);
	/* RFA routing ends here */
    app.get('/*', middleware.setUserCookie, index.index);
    // Routes to check error log working
    //app.get('/', function(request, response) {
    //    throw "some exception";
    //    response.send('hello world!');
    //});



};
