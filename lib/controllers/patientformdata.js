'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    FormTypes = mongoose.model('FormTypes'),
    FormList = mongoose.model('FormList'),
    Patient = mongoose.model('Patient'),
    User = mongoose.model('User'),
    Patientdata = mongoose.model('Patientreport'),
    auditlog = require('./auditlog'),
    Practice = mongoose.model('Practice');

	/**
 * fax related configuration starts here
 * make sure o install phaxio by command below
 * npm install phaxio
 */

	var apikey = process.env.PHAXIO_API_KEY;
	var apisecret = process.env.PHAXIO_API_SECRET;
	var Logfax = mongoose.model('Logfax');
	var Phaxio = require('phaxio'),
	phaxio = new Phaxio(apikey,apisecret),
	callback = function(err,data){};

	var _this=this;

	var fs = require('fs');
	var mail = require('./mail');
	var billingcal = require('../controllers/billingcal');

	//Added Encryption for Search Patient name in the Rater Dashboard page
	var crypto = require('crypto');

	var encryptionKey = process.env.ENCRYPTED_KEY;

function encrypt(text) {
    if (text === null || typeof text === 'undefined') { return text; };
    var cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

/**
 *  Save new Report
 */
exports.savePatientform = function (req, res) {
    //following variable used to send the alert mail to rater 1 n rater2

	var mail_reratecomment=typeof req.body.mail_reratecomment != 'undefined' ? req.body.mail_reratecomment : '';
	var mail_reratetype=typeof req.body.mail_reratetype != 'undefined' ? req.body.mail_reratetype : '';

    //Clinic address for sending the address in the email alert mail template
    var add_line1 = '';
    if (req.body.data.patientcomplaints) {
        if (req.body.data.patientcomplaints.cliniclocation) {
            //add_line1 = req.body.data.patientcomplaints.cliniclocation;
            var clinicLocation = req.body.data.patientcomplaints.cliniclocation;
            var add_line1 = clinicLocation.split(",");
            add_line1.splice(0, 1);
            add_line1.join(', ');
        }
    }


    var nextcount = 0;
    var reportid = req.body.reportid;
    var currentDate = Date.now();
    var status = req.body.status ? req.body.status : null;
    var submittedBy = req.user.userInfo.username;
    var userLevel = req.user.userInfo.level ? req.user.userInfo.level : 'level4';
    var practicename = req.user.userInfo.practicename ? req.user.userInfo.practicename : null;

	/*
     * Link for login in ratefast
     */
    //var sendLink = 'https://' + process.env.DOMAIN_URL + "/login";
    var sendLink = process.env.EMAIL_URL + "/login";
    //if (req.body.submittedByrole) {
    //    var submitbyrole = req.body.submittedByrole;
    //}

    var newPatient = new Patientdata();
    newPatient.data = req.body.data ? req.body.data : null;

	/**
       *  Helper function to send emails
        * @param emailid string email to which Mail is to be send
       *  @param placeholders object contains placeholder key value pair.
       */
        var sendAlerts = function (emailid, placeholders,templatename) {
            var locals = {
                to: emailid
            };
            //Placeholder text will be replaced  in the pr4alert(template name) in template collection


            placeholders.url = '<a href="' + sendLink + '">login to RateFast</a>';
            mail.sendMailMsg(templatename, locals, placeholders, function (err, result) {
                if (err) {
                    return false;
                }
            });
        };

		/**
        * Send Alerts to rater1 and rater2 user when PR4 Report is submitted for rating.
        * @param req object express request object
        * @param res object express response object
        * @returns {boolean}
        */
       var alertPr4Submit = function (req, res,level,ReportID) {
          /*  step 1 : Find all rater1 and rater2 role user
           *  step 2 : Send email alert to each one of them
           *  Email template used : pr4Alert_submit
           */

	   //Find rater1 and rater 2 user.
	   var template="";
	   if(level==2){
			template="pr4Alert_level2";
			if(mail_reratetype=='withchange'){
				template="pr4Alert_level2_rerate_withchange";
			}else if(mail_reratetype=='nochange'){
				template="pr4Alert_level2_rerate_nochange";
			}
			var query={"practice.rolename":"rater2"};
	   }else{
			template="pr4Alert_level1";
			if(mail_reratetype=='withchange'){
				template="pr4Alert_level1_rerate_withchange";
			}else if(mail_reratetype=='nochange'){
				template="pr4Alert_level1_rerate_nochange";
			}
		   var query={$or:[{"practice.rolename":"rater1"},{"practice.rolename":"rater2"}]};
	   }

	   User.find(query).select({ "firstname": 1,"lastname": 1,"email": 1,"username": 1 }).exec(function (err, raterList) {
			  if (err){
			   return res.json(500, err);
			  }else{

			   var len 	= 	raterList.length;
			   var i 	=	0;
			   for(i=0;i<len;i++){
					if(mail_reratetype=='nochange'){
						sendAlerts(raterList[i].email, { firstname: raterList[i].firstname, report_id: ReportID, login_url: sendLink,retercomment:mail_reratecomment, practicename:practicename },template);
					}else{
						sendAlerts(raterList[i].email, { firstname: raterList[i].firstname, report_id: ReportID, login_url: sendLink, practicename:practicename },template);
					}
			   }
			  }
		  });

          return true;
      };

    if (reportid && !req.body.reratecomment) {

        //log for close report
        //auditlog.closereportlog(req);


        /**
         *
         * @param req object express request object
         * @param res object express response object
         * @param submitedBy string username of the person submitting the report
         */
        var sendAlertSubmitBy = function (req, res, submitedBy) {
            User.find({ 'username': submitedBy }).select({ "email": 1, "firstname": 1 }).exec(function (err, result) {
                if (err) return res.json(500, err);
                if (result.length == 1) {
                    sendAlerts(result[0].email, { firstname: result[0].firstname, id: reportid, practice_address_line1: add_line1 },'pr4Alert');
                }
            });
        }

        /**
         *
         * @param req object express request object
         * @param res object express response object
         * @returns {boolean}
         */
        var exeAlerts = function (req, res) {
            /* DescCode to send email alerts
             *  step 1 : check submitted user's username,treated_by username id.
             *  step 2 : if both username is same, send 1 email else send mail to both users
             *  Email template used : pr4Alert
             */

			//Get submittedby and treating Physician details.

			Patientdata.find({ '_id': reportid }).select({ "submittedBy": 1 }).exec(function (err, subBy) {
				if (err) return res.json(500, err);
				if (subBy.length == 1) {
					var submitedBy = subBy[0].submittedBy;
					var treatedBy = req.body.data.patientcomplaints.treatphynamedropdown;
					if (treatedBy == "" || (typeof req.body.data.patientcomplaints.treatphynamedropdown === 'undefined')) {
						sendAlertSubmitBy(req, res, submitedBy);
					} else {
						User.find({ '_id': treatedBy }).select({ "email": 1, "username": 1, "firstname": 1, "_id": 1 }).exec(function (err, _treatedBy) {
							if (err) return res.json(500, err);
							if (_treatedBy.length == 1) {
								//match treating physician username it submitted by username.
								// if match is found send email else fetch details of sender username
								if (_treatedBy[0].username == submitedBy) {
									sendAlerts(_treatedBy[0].email, { firstname: _treatedBy[0].firstname, id: reportid, practice_address_line1: add_line1 },'pr4Alert');
								} else {
									sendAlerts(_treatedBy[0].email, { firstname: _treatedBy[0].firstname, id: reportid, practice_address_line1: add_line1 },'pr4Alert');
									sendAlertSubmitBy(req, res, submitedBy);
								}
							} else {
								sendAlertSubmitBy(req, res, submitedBy);
							}
						});
					}
				}
			});

            return true;
        };


        if (req.body.formtype == 'pr4') {
            if (status == 'level2') {

				alertPr4Submit(req,res,2, reportid);
                Patientdata.update({ _id: reportid }, { $set: { 'data': req.body.data, 'status': 'level2', 'modifiedby': req.user.userInfo.username, 'modifieddate': currentDate, 'submittedAtLevel1': req.user.userInfo.username, 'submittedDateAtLevel1': currentDate, rfas:req.body.rfas } }).exec(function (err, result) {
                    if (err) return res.jsonp(500, { message: err });
                    else
					{
						return res.send(200, 'Updated');
					}
                });
            }
            else if (status == 'closed') {


               // var b = billingcal.rulesenginemethod(req, res);

                req.body.data.bc = new Object();
				var b= new Object();

				/*req.body.data.bc = b;
                Patientdata.update({ _id: reportid }, { $set: { 'data': req.body.data, 'status': 'closed', 'modifiedby': req.user.userInfo.username, 'modifieddate': currentDate, 'submittedAtLevel2': req.user.userInfo.username, 'submittedDateAtLevel2': currentDate, rfas:req.body.rfas } }).exec(function (err, result) {
                    if (err) return res.jsonp(500, { message: err });
                    //send
                    exeAlerts(req, res);
                    if (!err) return res.send(200, 'Updated');

                });*/
				Patientdata.findOne({ _id: reportid }).exec(function (err, dataReport) {
				   if (err) return res.jsonp(500, { message: err });
				   //send
				   else{
					   var practicename=dataReport.practicename;
					   Practice.findOne({ practicename:  practicename }).exec(function (error,  response) {
						if (error) return res.send(500);
						else {
						   //if off then dont execute the  billingcalculatoromfs
							if( response.billingcalculatoromfs=="on"){
								b =billingcal.rulesenginemethod(req, res);
								req.body.data.bc = b;
							}
						   Patientdata.update({ _id: reportid }, { $set: { 'data': req.body.data, 'status': 'closed', 'modifiedby': req.user.userInfo.username, 'modifieddate': currentDate, 'submittedAtLevel2': req.user.userInfo.username, 'submittedDateAtLevel2': currentDate, rfas:req.body.rfas } }).exec(function (err, result) {
							   if (err) return res.jsonp(500, { message: err })
							   else
							   {
								   return res.send(200, 'Updated');
							   }
								//send
							   exeAlerts(req, res);
						   });
						}
					});
				   }

				});

            }
            else if (status == 'level1') {

				/**
                 * Send alert to rater1 and rater2 type users
                 */
                alertPr4Submit(req,res,1, reportid);
                Patientdata.update({ _id: reportid }, { $set: { 'data': req.body.data, 'status': 'level1', 'modifiedby': req.user.userInfo.username, 'modifieddate': currentDate, 'submittedBy': req.user.userInfo.username, 'submittedDate': currentDate, 'reportcharge': req.body.reportcharge, rfas:req.body.rfas } }).exec(function (err, result) {
                    if (err) return res.jsonp(500, { message: err });
                    else
					{

					   return res.send(200, 'Updated');
					}

                });
            }
            else {

                Patientdata.update({ _id: reportid }, { $set: { 'data': req.body.data, 'modifiedby': req.user.userInfo.username, 'modifieddate': currentDate,rfas:req.body.rfas} }).exec(function (err, result) {
                    if (err) return res.jsonp(500, { message: err });
                    else
					{
					   return res.send(200, 'Updated');
					}
                });
            }
        }
        else if (status == 'closed') {

            Patientdata.update({ _id: reportid }, { $set: { 'data': req.body.data, 'status': 'closed', 'modifiedby': req.user.userInfo.username, 'modifieddate': currentDate, 'submittedBy': req.user.userInfo.username, 'submittedDate': currentDate, 'reportcharge': req.body.reportcharge,rfas:req.body.rfas } }).exec(function (err, result) {
                if (err) return res.jsonp(500, { message: err });
                else
				{
				   return res.send(200, 'Updated');
				}
            });
        }
        else {

            Patientdata.update({ _id: reportid }, { $set: { 'data': req.body.data, 'modifiedby': req.user.userInfo.username, 'modifieddate': currentDate,rfas:req.body.rfas  } }).exec(function (err, result) {
                if (err) return res.jsonp(500, { message: err });
                else
				{
				   return res.send(200, 'Updated');
				}
            });
        }
    }
    else {

        //var newPatient = new Patientdata();
        newPatient.patientid = req.body.patientid ? req.body.patientid : null;
        newPatient.injuryid = req.body.injuryid ? req.body.injuryid : null;
        newPatient.data = req.body.data ? req.body.data : null;
        newPatient.formtype = req.body.formtype ? req.body.formtype : null;
        newPatient.version = req.body.version ? req.body.version : 0;
		//Added by Unais to save flavor data
		newPatient.flavor = req.body.flavor ? req.body.flavor : 'a';

        newPatient.status = status;
        newPatient.reportpublishid = req.body.reportpublishid ? req.body.reportpublishid : null;
        newPatient.practicename = practicename;
        newPatient.dateofinjury = req.body.dateofinjury ? req.body.dateofinjury : null;
        newPatient.reratecomment = req.body.reratecomment ? req.body.reratecomment : null;
        newPatient.rerateflag = req.body.rerateflag ? req.body.rerateflag : false;
        newPatient.reportcopiedfrom = req.body.reportcopiedfrom ? req.body.reportcopiedfrom : '';
        newPatient.reratetype = req.body.reratetype ? req.body.reratetype : '';
        newPatient.formid = req.body.formid ? req.body.formid : '';
        newPatient.previousclosedreport = req.body.previousclosedreport ? req.body.previousclosedreport : '';
        newPatient.reportcharge = req.body.reportcharge ? req.body.reportcharge : '';
        newPatient.state = req.body.state ? req.body.state : null;
        newPatient.userlevel = userLevel;
        newPatient.createdby = req.user.userInfo.username;
        newPatient.createdDate = currentDate;
        newPatient.modifieddate = currentDate;
        newPatient.modifiedby = req.user.userInfo.username;
        newPatient.submittedBy = req.body.submittedBy ? req.body.submittedBy : null;
        newPatient.submittedDate = req.body.submittedDate ? req.body.submittedDate : null;
		newPatient.rfas = req.body.rfas;
		newPatient.athena_patientid = req.body.athena_patientid ? req.body.athena_patientid : 0;    // Athena changes
        newPatient.athena_practiceid = req.body.athena_practiceid ? req.body.athena_practiceid : 0;    // Athena changes
        newPatient.athena_departmentid = req.body.athena_departmentid ? req.body.athena_departmentid : 0;    // Athena changes

        var reportcopiedfrom = req.body.reportcopiedfrom ? req.body.reportcopiedfrom : '';


        newPatient.save(function (err, response) {
            if (err) {

                return res.jsonp(500, { message: err });
            } else {

                //log for close report
                req.params.reportid = response._id;
                //auditlog.closereportlog(req);

                var saveReportResp = response;

                //Re-rated report cannot be re-rated again so updating the flag of re-rating to true
                if (req.body.reratetype) {

                    Patientdata.update({ _id: reportcopiedfrom }, { $set: { 'rerateflag': 'true' } }).exec(function (err, result) {
                        if (err) return res.jsonp(500, { message: err });
                        else {
							if(status=='level1'){
								//if ratertype is nochange then send mail
								var reqdata={};
								var resdata={};
								alertPr4Submit(reqdata,resdata,1,response._id);
							}
							return res.send(200, { mesg: 'success saved', id: saveReportResp._id, status: saveReportResp.status });
						}
                    });

                } else {


                    res.send({ mesg: 'success saved', id: response._id, status: response.status });
                }
            }
        });
    }
};

exports.saveReportData = function (req, res) {
    //Pass the data from newPatient Object for encrupting report data
    var newPatient = new Patientdata();
    newPatient.data = req.body.data ? req.body.data : null;

    Patientdata.update({ _id: req.body.reportid }, { $set: { 'data': req.body.data } }).exec(function (err, result) {
        if (err) return res.jsonp(500, { message: err });
        else return res.jsonp(200, { message: 'Updated' });
    });
};

exports.updateReportStatus = function (req, res) {

    var reportid = req.params.reportid;
    Patientdata.update({ _id: reportid }, { $set: { 'status': 'open' } }).exec(function (err, result) {
	//Preventing unauthorized access by including practicename parameter (2nd February, 2016)
	//Patientdata.update({$and:[{ _id: reportid },{'practicename': req.user.userInfo.practicename},{'status':{$ne:'deleted'}}]}, { $set: { 'status': 'open' } }).exec(function (err, result) {
        if (err) return res.jsonp(500, { message: err });
        else return res.send(200, 'Updated');
    });
};

/**
 *  Addendum feature
 * @date : 19-Jan-2017
 * @author : <manoj97738>
 */
exports.saveAddendum = function (req, res) {

	if(typeof req.body.reportid != 'undefined'){
		Patientdata.update({ _id: req.body.reportid ,status:'closed'}, {  $push: { 'addendum': req.body.addendum } }).exec(function (err, result) {
			if (err) return res.jsonp(500, { message: err });
			else return res.send(200, 'Updated');
		});
	}else{
		return res.jsonp(500, { message: error });
	}

}

/**
 * Update work status note feature in the report. As per specification any logged in user can print work status note level 1 to 4
 * @date : 4-march-2016
 * @author : manoj gupta
 */
exports.saveWorkStatus = function (req, res) {

	if(typeof req.body.reportid != 'undefined'){
		Patientdata.update({ _id: req.body.reportid }, {  $push: { 'workStatusNote': req.body.workStatusData } }).exec(function (err, result) {
			if (err) return res.jsonp(500, { message: err });
			else return res.send(200, 'Updated');
		});
	}else{
		return res.jsonp(500, { message: error });
	}
}
//saveWorkStatus ends here
/**
 * Update work status note feature in the report. As per specification any logged in user can print work status note level 1 to 4
 * @date : 4-march-2016
 * @author : manoj gupta
 */
exports.faxWorkStatus = function (req, res) {

	var opt = {};
	var html=req.body.workStatusData.html;
	if(typeof req.body.reportid != 'undefined'){
		req.body.workStatusData.html ="";
		delete req.body.workStatusData.html;
		//send fax if sucessfull the save the logas and then send
		opt.to 				= [];
		opt.to.push(req.body.workStatusData.recipientfaxnumber);
		opt.string_data 	 = '<!DOCTYPE HTML><html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /></head>'+html+'</body></html>';
		opt.string_data_type ='html';

		phaxio.sendFax(opt, function(err,faxres) {
			opt.workStatsuData	=	req.body.workStatusData;
			opt.faxHeader 		=	faxres;

			if(!err){
				if(faxres.success){
					Patientdata.update({ _id: req.body.reportid }, {  $push: { 'workStatusNote': req.body.workStatusData } }).exec(function (err2, result) {
						if (err2){

							return res.jsonp(500, { message: err2 });
						}
						else {
							var logingFax = new Logfax();
							delete opt.string_data;
							logingFax.faxData	=	opt;
							logingFax.reportid = req.body.reportid;
							logingFax.sendDate = new Date();
							logingFax.useripdaddress = req.headers['X-Real-IP'] || req.connection.remoteAddress;
							logingFax.save(function(err3,response3){
								res.send(200, 'Updated');
							})
						}
					});


				}else{
					return res.jsonp(500, { message: faxres });
				}


			}else{
				return res.jsonp(500, { message: err });
			}
		});
	}else{
		return res.jsonp(500, { message: error });
	}

}
//saveWorkStatus ends here

// Updating patient demographics table Data
exports.updatePatientform = function (req, res) {
    var patientid = req.body.id;
    var injuryid = req.body.injuryid;

    Patient.update({
        _id: patientid,
        basicinformation: { $elemMatch: { 'status': 'current' } },
        contactinformation: { $elemMatch: { 'status': 'current' } },
        address: { $elemMatch: { 'status': 'current' } },
        occupation: { $elemMatch: { 'status': 'current' } },
        demographics: { $elemMatch: { 'status': 'current' } }
    }, {
        $set:
        {
            'basicinformation.$.firstname': req.body.data.bginfo.firstname, 'basicinformation.$.middlename': req.body.data.bginfo.middlename, 'basicinformation.$.lastname': req.body.data.bginfo.lastname, 'basicinformation.$.gender': req.body.data.bginfo.gender, 'basicinformation.$.dateofbirth': req.body.data.bginfo.dateofbirth, 'basicinformation.$.socialsecurityno': req.body.data.bginfo.socialsecurityno,
            'contactinformation.$.email': req.body.data.bginfo.email, 'contactinformation.$.homephone': req.body.data.bginfo.homephone, 'contactinformation.$.cellphone': req.body.data.bginfo.cellphone, 'contactinformation.$.workphone': req.body.data.bginfo.workphone, 'contactinformation.$.extension': req.body.data.bginfo.extension, 'contactinformation.$.preferredcommunication': req.body.data.bginfo.preferredcommunication, 'contactinformation.$.preferredcommunicationother': req.body.data.bginfo.preferredcommunicationother,
            'address.$.addressline1': req.body.data.bginfo.addressline1, 'address.$.addressline2': req.body.data.bginfo.addressline2, 'address.$.city': req.body.data.bginfo.city, 'address.$.state': req.body.data.bginfo.state, 'address.$.zipcode': req.body.data.bginfo.zipcode,
            'occupation.$.currentoccupation': req.body.data.bginfo.currentoccupation, 'occupation.$.currentoccupationother': req.body.data.bginfo.currentoccupationother,
            'demographics.$.ethnicity': req.body.data.selectinjuries.ethnicityselect, 'demographics.$.ethnicityother': req.body.data.selectinjuries.ethnicityselectother, 'demographics.$.race': req.body.data.selectinjuries.injuredrace, 'demographics.$.raceother': req.body.data.selectinjuries.injuredraceother
        }

    }).exec(function (err, result) {
        if (err) return res.send(500);
        else return res.send(200, 'Updated');
    });
    Patient.update({ 'injury._id': injuryid }, { $set: { 'injury.$.injurydata.injuryinformation': req.body.injurydata } }).exec(function (err, result) {
        if (err) return res.send(500);
        else return res.send(200, 'Updated');
    });
};

// Updating patient report Data table if patient id exist

exports.updatepatientFormData = function (req, res) {
    var patientid = req.body.id;
    var injuryid = req.body.injuryid;

    //Pass the data from newPatient Object for encrupting report data
    var newPatient = new Patientdata();
    newPatient.data = req.body.data ? req.body.data : null;

    Patientdata.update({ $and: [{ patientid: patientid }, { injuryid: injuryid }] }, { $set: { 'data': req.body.data } }).exec(function (err, result) {
        if (err) return res.send(500);
        else return res.send(200, 'Updated');
    });
}

//Getting all Data from newly created Patient

exports.getPatientData = function (req, res) {
    var reportid = req.params.reportid;

	 /**
     *
     * Necessary changes are made so that siteadmin,rater1,rater2 see all data & other practice can see their data only
     * shridhar -  New change start ID:04/02/2016
     */
		var searchQuery={};

		if(req.user.userInfo.role=='siteadmin' || req.user.userInfo.role=='rater1' || req.user.userInfo.role=='rater2'){
			searchQuery={ _id: reportid };
		}else{
			searchQuery={ _id: reportid,'practicename': req.user.userInfo.practicename};
		}
    /**
     * End here new change ID:04/02/2016
     */

    Patientdata.find(searchQuery).exec(function (err, patientData) {
        //if (err) return res.send(500, 'Error Occured');
        //if (!err) return res.jsonp([{ 'patientData': patientData }]);

		//Above two lines commented and below code written to make sure old reports work after PR4 select body part feature
		if (err) return res.send(500, 'Error Occured');

        else{

			if(patientData[0].formtype=='pr4' && patientData[0].status!='open' && patientData[0].status!='deleted'){
				if(typeof patientData[0].submittedDate!='undefined' && patientData[0].submittedDate!='' && patientData[0].submittedDate!=null){
					var pr4ratingPriorReportsDate = new Date('2016-08-26T21:30:00Z');
					var submittedReportdate = new Date(patientData[0].submittedDate);
					//Please do not change the above date in code. It would have harmful consequences on the PR4 select body part feature
					if (pr4ratingPriorReportsDate >= submittedReportdate) {
						for(var j=0;j<patientData[0].data.selectinjuries.sibodypart.length;j++){
							if(typeof patientData[0].data.selectinjuries.sibodypart[j].ratebodyYesNoRadio=='undefined'){
								patientData[0].data.selectinjuries.sibodypart[j].ratebodyYesNoRadio='Yes';
								patientData[0].data.selectinjuries.sibodypart[j].dateOfRating=patientData[0].submittedDate;
								patientData[0].data.selectinjuries.sibodypart[j].ratebodypart=true;
							}
						}

						for(var j=0;j<patientData[0].data.selectinjuries.concatedbodypart.length;j++){
							if(typeof patientData[0].data.selectinjuries.concatedbodypart[j].ratebodyYesNoRadio=='undefined'){
								patientData[0].data.selectinjuries.concatedbodypart[j].ratebodyYesNoRadio='Yes';
								patientData[0].data.selectinjuries.concatedbodypart[j].dateOfRating=patientData[0].submittedDate;
								patientData[0].data.selectinjuries.concatedbodypart[j].ratebodypart=true;
							}
						}
					}
				}
			}

        	return res.jsonp([{ 'patientData': patientData }]);
        }
    });

	//Above code commented

}

//Getting all Data from patientreports table based on injuryid & patientid

exports.getsavedPatientdataList = function (req, res) {
    var patientid = req.params.patientid;
    var injuryid = req.params.injuryid;


		Patientdata.find({ $and: [{ patientid: patientid }, { injuryid: injuryid }] }).exec(function (err, patients) {
		//Preventing unauthorized access by including practicename parameter (2nd February, 2016)
		//Patientdata.find({ $and: [{ patientid: patientid }, { injuryid: injuryid }] }).exec(function (err, patients) {
        if (err) return res.send(500);
        if (patients.length == 0) {
            return res.send(204);
        }
        else {
            res.jsonp([
                {
                    title: 'Patients',
                    patients: patients
                }
            ]);
        }
    });
};


exports.getlatestclosedreport = function (req, res) {
    var patientid = req.params.patientid;
    var injuryid = req.params.injuryid;
    var currentDate = Date.now();
    var startDate = new Date(2014, 3, 1);

		Patientdata.find({ $and: [{ patientid: patientid }, { injuryid: injuryid }, { status: 'closed' }] }).sort({ "submittedDate": -1 }).limit(1).exec(function (err, patients) {
		//Preventing unauthorized access by including practicename parameter (2nd February, 2016)
		//Patientdata.find({ $and: [{ patientid: patientid }, { injuryid: injuryid }, {'practicename': req.user.userInfo.practicename}, { status: 'closed' }] }).sort({ "submittedDate": -1 }).limit(1).exec(function (err, patients) {
        if (err) return res.send(500);
        if (patients.length == 0) {
            return res.send(204);
        }
        else
		{


			/**
			 * Necessary changes are made so that when pr2,pr4 report are imported the visited is set to false for each section and bodyparts.
			 * Author : Manoj Gupta<manoj97738@gmail.com>
			 * Date: 22-Jan-2016
			 */
			if(patients[0].data.selectinjuries){
				patients[0].data.selectinjuries.visited			=	false;
			}

			if(patients[0].data.bginfo){
				patients[0].data.bginfo.visited					=	true;
			}
			if(patients[0].data.patientcomplaints){
				patients[0].data.patientcomplaints.visited			=	false;
			}
			if(patients[0].data.ActivitiesofDailyLiving){
				patients[0].data.ActivitiesofDailyLiving.visited	=	false;
			}
			if(patients[0].data.sh){
				patients[0].data.sh.visited						=	false;
			}
			if(patients[0].data.objectivefindings){
				patients[0].data.objectivefindings.visited			=	false;
			}
			if(patients[0].data.objectivefindingsgeneral){
				patients[0].data.objectivefindingsgeneral.visited			=	false;
			}
			if(patients[0].data.objectivefindingsgait){
				patients[0].data.objectivefindingsgait.visited				=	false;
			}
			if(patients[0].data.objectivefindingslimb){
				patients[0].data.objectivefindingslimb.visited				=	false;
			}
			if(patients[0].data.relevantmedicalsocialhistory){
				patients[0].data.relevantmedicalsocialhistory.visited		=	false;
			}
			if(patients[0].data.diagnostictestresults){
				patients[0].data.diagnostictestresults.visited             =   false;
			}
			if(patients[0].data.diagnoses){
				patients[0].data.diagnoses.visited                         =   false;
			}
			if(patients[0].data.decisionmaking){
				patients[0].data.decisionmaking.visited                    =   false;
			}
			if(patients[0].data.treatment){
				patients[0].data.treatment.visited                         =   false;
			}
			if(patients[0].data.workrestriction){
				patients[0].data.workrestriction.visited			=	false;
			}
			if(patients[0].data.documentation){
				patients[0].data.documentation.visited				=	false;
			}
			if(patients[0].data.bc){
				patients[0].data.bc.visited							=	false;
			}
			//Some key are dynamically generated like objectivefindings, relevantmedicalsocialhistory and patientcomplaints
			var selLen=patients[0].data.selectinjuries.concatedbodypart.length;
			var contactbody=patients[0].data.selectinjuries.concatedbodypart;
			var i=0;
			for(i=0;i<selLen;i++){
				//objective finding condition
				if(patients[0].data["objectivefindings"+contactbody[i].concateId]){
					patients[0].data["objectivefindings"+contactbody[i].concateId].visited				=	false;
				}

				//relevantmedicalsocialhistory
				if(patients[0].data["relevantmedicalsocialhistory"+contactbody[i].concateId]){
					patients[0].data["relevantmedicalsocialhistory"+contactbody[i].concateId].visited	=	false;
				}

				//patientcomplaints
				if(patients[0].data["patientcomplaints"+contactbody[i].concateId]){
					patients[0].data["patientcomplaints"+contactbody[i].concateId].visited	=	false;
				}
				//diagnoses
				if(patients[0].data["diagnoses"+contactbody[i].concateId]){
					patients[0].data["diagnoses"+contactbody[i].concateId].visited	=	false;
				}
				//treatment
				if(patients[0].data["treatment"+contactbody[i].concateId]){
					patients[0].data["treatment"+contactbody[i].concateId].visited	=	false;
				}
				//treatment
				if(patients[0].data["diagnostictestresults"+contactbody[i].concateId]){
					patients[0].data["diagnostictestresults"+contactbody[i].concateId].visited	=	false;
				}
			}

            res.jsonp([
                {
                    title: 'Patients',
                    patients: patients
                }
            ]);
        }
    });
};

exports.getReportCardViewList = function (req, res) {
    var patientid = req.params.patientid;
    var injuryid = req.params.injuryid;

	 /**
     *
     * Necessary changes are made so that siteadmin,rater1,rater2 see all data & other practice can see their data only
     * shridhar -  New change start ID:04/02/2016
     */
    var searchQuery={}
	if(req.user.userInfo.role=='siteadmin' || req.user.userInfo.role=='rater1' || req.user.userInfo.role=='rater2'){
		searchQuery={ $and: [{ 'patientid': patientid }, { 'injuryid': injuryid },{ 'status': { $ne: 'deleted' } }] };
	}else{
		/*searchQuery={ $and: [{ 'patientid': patientid }, { 'injuryid': injuryid }, {'practicename': req.user.userInfo.practicename}, { 'status': { $ne: 'deleted' } }] };*/
		//Below query sequence modified by Unais to satisfy index
		searchQuery={ $and: [{ 'patientid': patientid }, { 'injuryid': injuryid }, { 'status': { $ne: 'deleted' } }, {'practicename': req.user.userInfo.practicename}] };
	}
    /**
     * End here new change ID:04/02/2016
     */

		//Patientdata.find({ $and: [{ 'patientid': patientid }, { 'injuryid': injuryid }, { 'status': { $ne: 'deleted' } }] }, { status: 1, "data.patientcomplaints": 1, formid: 1, formtype: 1, version: 1, patientid: 1, state: 1, createdby: 1, submittedBy: 1, submittedDate: 1, submittedDateAtLevel2: 1, injuryid: 1 }).exec(function (err, patients) {
		//Preventing unauthorized access by including practicename parameter (2nd February, 2016)
		Patientdata.find( searchQuery, { status: 1, "data.patientcomplaints": 1, formid: 1, formtype: 1, version: 1, patientid: 1, state: 1, createdby: 1, submittedBy: 1, submittedDate: 1, submittedDateAtLevel2: 1, injuryid: 1 }).exec(function (err, patients) {
		if (err) return res.send(500);
        if (patients.length == 0) {
            return res.send(204);
        }
        else {
            res.jsonp([
                {
                    title: 'Patients',
                    patients: patients
                }
            ]);
        }
    });
};

exports.getsubmittedReportcount = function (req, res) {

    var role = req.user.userInfo.role.trim().toLowerCase();

    if (role == 'siteadmin' || role == 'rater1' || role == 'rater2') {
        return res.jsonp([{ count: 999 }]);

    } else {

        var practicename = req.params.practicename;
        var formtype = req.params.formtype;
        var currentDate = Date.now();

        Practice.find({ practicename: practicename }).exec(function (error, response) {
            if (error) return res.send(500);
            else {

                if (formtype == 'dfr' && response[0].dfrfreereport == 'unlimited') {
                    res.jsonp([{ count: 0 }]);
                }
                else if (formtype == 'pr2' && response[0].pr2freereport == 'unlimited') {
                    res.jsonp([{ count: 0 }]);
                }
                else if (formtype == 'pr4' && response[0].pr4freereport == 'unlimited') {
                    res.jsonp([{ count: 0 }]);
                }
                else {
                    Patientdata.find({ practicename: practicename, formtype: formtype })
                    .where('status').in(['closed', 'level1', 'level2'])
                    .count().exec(function (err, count) {
                        if (err) {
                            return res.send(500);
                        } else {
                            res.jsonp([{ count: count }]);
                        }
                    });
                }
            }
        });
    }
};

exports.getccchargereportdetails = function (req, res) {


    if (req.user.userInfo.role == 'siteadmin') {
        var pname = req.body.practicename;
    } else {
        var pname = req.user.userInfo.practicename;
    }

    var date1 = req.body.startdate;
    var date2 = req.body.enddate;

    date1 = new Date(date1);

    date2 = new Date(date2);
    date2.setDate(date2.getDate() + 1);

    Patientdata.find({ $and: [{ $or: [{ status: 'level1' }, { status: 'closed' }, { status: 'level2' }] }, { 'submittedDate': { $gte: date1, $lte: date2 } }, { practicename: pname }] }, { practicename: 1, reportcharge: 1, submittedDate: 1, formtype: 1, submittedBy: 1, 'data.signDoctor.level4': 1 }).sort({ submittedDate: -1 }).exec(function (err, result) {
        //res.jsonp([{ 'data': result }])
        if (err) return res.send(500, { message: err });
        else return res.send(200, { data: result });
    });
}

exports.getsubmittedpr4ReportData = function (req, res) {

    var page = (req.body.pagenum > 0 ? req.body.pagenum : 2) - 1
    var perPage = 5
    var state = req.body.state;
    var options = {
        perPage: perPage,
        page: page
    }

    if (req.body.status) {
        var query = { 'status': req.body.status, 'state': state, 'formtype': 'pr4' };

		if (typeof (req.body.ser) !== 'undefined') {

			var temp = [];
			if (typeof (req.body.ser.practicename) !== 'undefined') {
				if (req.body.ser.practicename != "") {
					temp.push({ 'practicename': req.body.ser.practicename });
				}
			}

			if (typeof (req.body.ser.patientfname) !== 'undefined') {
				if (req.body.ser.patientfname != "") {
					temp.push({ 'data.bginfo.firstname': encrypt(req.body.ser.patientfname) });
				}
			}
			if (typeof (req.body.ser.patientlname) !== 'undefined') {
				if (req.body.ser.patientlname != "") {
					temp.push({ 'data.bginfo.lastname': encrypt(req.body.ser.patientlname) });
				}
			}

			if (typeof (req.body.ser.reportID) !== 'undefined') {
				if (req.body.ser.reportID != "") {
					if (req.body.ser.reportID.match(/^[0-9a-fA-F]{24}$/)) {
							temp.push({ '_id': req.body.ser.reportID });
						}
				}
			}

			/*
		   * Code to check date range query
			*/
			if (typeof (req.body.ser.datesubmittedfrom) !== 'undefined') {
				if (req.body.ser.datesubmittedfrom != "" || req.body.ser.datesubmittedfrom != null) {
					if (typeof (req.body.ser.datesubmittedto) !== 'undefined') {
						var toDate = new Date(req.body.ser.datesubmittedto);
						toDate.setDate(toDate.getDate() + 1);

						if (req.body.ser.datesubmittedfrom == req.body.ser.datesubmittedto) {
							temp.push({ 'submittedDate': { $gte: new Date(req.body.ser.datesubmittedfrom), $lt: (new Date((new Date(req.body.ser.datesubmittedfrom)).valueOf() + 1000 * 3600 * 24)) } });
						} else {
							if (req.body.ser.datesubmittedto != "" && req.body.ser.datesubmittedto != null) {
								temp.push({ 'submittedDate': { $gte: req.body.ser.datesubmittedfrom, $lte: toDate } });
							} else {
								temp.push({ 'submittedDate': { $gte: req.body.ser.datesubmittedfrom, $lte: new Date() } });
							}
						}
					} else {
						temp.push({ 'submittedDate': { $gte: req.body.ser.datesubmittedfrom, $lte: new Date() } });
					}
				}
			}

			if (typeof (req.body.ser.patientfname) !== 'undefined') {
				if (req.body.ser.patientfname != "") {
					var patientfname = req.body.ser.patientfname;
				}
			}
			if (typeof (req.body.ser.patientlname) !== 'undefined') {
				if (req.body.ser.patientlname != "") {
					var patientlname = req.body.ser.patientlname;
				}
			}
			if (temp.length > 0) {
				query.$and = temp;
			}
		}

        if (req.body.status == 'level1') {
            var sortQuery = { 'submittedDate': 1 };
        } else if (req.body.status == 'level2') {
            var sortQuery = { 'submittedDateAtLevel1': 1 };
        } if (req.body.status == 'closed') {
            var sortQuery = { 'submittedDateAtLevel2': -1 };
        }

        Patientdata.find(query, { dateofinjury: 1, practicename: 1, createdby: 1, submittedBy: 1, state: 1, userlevel: 1, modifiedby: 1, modifieddate: 1, status: 1, version: 1, formid: 1, formtype: 1, 'data.bginfo': 1, 'data.patientcomplaints': 1, injuryid: 1, patientid: 1, _id: 1, submittedDate: 1, submittedAtLevel1: 1, submittedDateAtLevel1: 1, submittedAtLevel2: 1, submittedDateAtLevel2: 1 }).sort(sortQuery).limit(options.perPage).skip(options.perPage * options.page).exec(function (err, result) {
            if (err) return res.send(500);
            else {
                Patientdata.find(query).count().exec(function (err, count) {
                    res.jsonp(
                      {
                          getsubmittedpr4Reportdata: result,
                          page: page + 1,
                          pages: Math.ceil(count / perPage),
                          totalitem: count,
                          itemsperpage: perPage
                      }
                    );
                });
            }
        });
    }
    else {
        Patientdata.find({ 'status': { $ne: 'open' }, 'state': state, 'formtype': 'pr4' }, { dateofinjury: 1, practicename: 1, createdby: 1, submittedBy: 1, state: 1, userlevel: 1, modifiedby: 1, modifieddate: 1, status: 1, version: 1, formtype: 1, 'data.bginfo': 1, 'data.patientcomplaints': 1, injuryid: 1, patientid: 1, _id: 1, submittedDate: 1, submittedAtLevel1: 1, submittedDateAtLevel1: 1, submittedAtLevel2: 1, submittedDateAtLevel2: 1 }).exec(function (err, result) {

            if (err) return res.send(500);
            else {
                Patientdata.find({ 'status': { $ne: 'open' }, 'state': state, 'formtype': 'pr4' }).count().exec(function (err, count) {
                    if(err)
						res.send(500, {msg: err});
					else
					{
						res.jsonp(
							{
								getsubmittedpr4Reportdata: result
							}
						);
					}
                });
            }
        });
    }
};

exports.getpr4ClosedReports = function (req, res) {
    var state = req.body.state;
    var practicename = req.user.userInfo.practicename;
    if (req.body.state) {
        var query = { 'status': 'closed', 'state': state, 'formtype': 'pr4', 'practicename': practicename };


        Patientdata.find(query, { dateofinjury: 1, practicename: 1, createdby: 1, submittedBy: 1, state: 1, userlevel: 1, modifiedby: 1, modifieddate: 1, status: 1, version: 1, formid: 1, formtype: 1, 'data.bginfo': 1, 'data.patientcomplaints': 1, 'data.signDoctor': 1, injuryid: 1, patientid: 1, _id: 1, submittedDate: 1, submittedAtLevel1: 1, submittedDateAtLevel1: 1, submittedAtLevel2: 1, submittedDateAtLevel2: 1 }).sort({ submittedDateAtLevel2: -1 }).exec(function (err, result) {
            if (err) return res.send(500);
            else {
                res.jsonp(
                    {
                        getsubmittedpr4Reportdata: result,
                    }
                );
            }
        });
    } else {
        return res.send(500);
    }

};

exports.searchSubmittedreports = function (req, res) {

    var state = req.params.state;
    if (req.params.practicename) {
        var practicename = req.params.practicename;
    }
    else {
        var practicename = '';
    }

    if (req.params.patientfname) {
        var patientfname = '.*' + req.params.patientfname + '.*';
    }
    else {
        var patientfname = '';
    }
    if (req.params.patientlname) {
        var patientlname = '.*' + req.params.patientlname + '.*';
    }
    else {
        var patientlname = '';
    }

    Patientdata.find({ 'status': { $ne: 'open' }, state: state, 'formtype': 'pr4', $and: [{ 'practicename': practicename }, { 'data.bginfo.firstname': { $regex: patientfname, $options: 'i' } }, { 'data.bginfo.lastname': { $regex: patientlname, $options: 'i' } }] }, function (err, result) {
        if (err) res.send(500, 'Error Occured');
        else {
            res.jsonp([{
                searchedReports: result
            }]);
        }
    });
}

exports.deletereport = function (req, res) {

    var reportid = req.params.reportid;
    var practicename = req.user.userInfo.practicename;
    var conditions = { 'status': 'open', 'practicename': practicename, _id: reportid }
        , update = { $set: { status: 'deleted' } };


    Patientdata.update(conditions, update, function (err, numAffected) {
        // numAffected is the number of updated documents
        if (err || numAffected == 0) return res.send(500);
        else return res.send(200, [{ msg: 'Updated'}]);
    });
}

exports.downloadreport = function (req, res) {

    if (process.env.node_env == 'development') {
        //var dir = 'app/views/tmp';
        var dir = 'app/tmp';
       // try {

            fs.lstatSync(dir).isDirectory();
        /*} catch (e) {

            fs.mkdirSync(dir);
        }*/
        //var filePath = 'app/views/tmp/';
        var filePath = 'app/tmp/';
    } else {
        //var dir = 'views/tmp';
        var dir = 'public/tmp';
        //try {

            fs.lstatSync(dir).isDirectory();
        /*} catch (e) {

            fs.mkdirSync(dir);
        }*/
        //var filePath = 'views/tmp/';
        var filePath = 'public/tmp/';
    }
    //'app/views/partials/reports/'

    fs.writeFile(filePath + req.body.filename, req.body.content, function (err, response) {
        if (err) res.send(500, {msg: err});

        else {
            //res.send(200, req.body.filename);
            //res.sendfile(filePath + req.body.filename);
			res.download( filePath + req.body.filename);
        }
    });

}

exports.getdfrdiscovery = function (req, res) {

    if (req.user.role == 'siteadmin') {
        var practicename = req.params.practicename;
    } else {
        var practicename = req.user.userInfo.practicename;
    }

    var state = req.params.state;
    var type = 'dfr';
    var status = 'closed';
    Patientdata.find({ "practicename": practicename, "state": state, status: 'closed', formtype: 'dfr' }, {
        '_id': 1, 'data.bginfo.fname': 1,
        'data.bginfo.company': 1, 'data.bginfo.emp_address1': 1, 'data.bginfo.emp_address2': 1, 'data.bginfo.emp_city': 1, 'data.bginfo.emp_state': 1, 'data.bginfo.emp_zipcode': 1,
        'data.bginfo.location_address1': 1, 'data.bginfo.location_address2': 1, 'data.bginfo.location_city': 1, 'data.bginfo.location_state': 1, 'data.bginfo.location_zipcode': 1,
        'data.selectinjuries.sibodypart': 1,
        'data.decisionmaking.mdmq2': 1,
        'data.decisionmaking.mdmq3': 1,
        'data.workrestriction.WRpatientReturnOptions': 1,
    }).exec(function (err, data) {
		if (err) res.send(500, {msg: err});
		else
			res.jsonp([{ dfrdata: data }]);
    });
}

/**
 * Get report count based on claim administrator name
 * @date : 14-March-2016
 * @author : Unais K
 */
exports.getClaimAdmWiseReportCount = function (req, res) {

	//if (req.user.role == 'siteadmin') {
		//Patientdata.aggregate({"$group" : { _id: { 'data_bginfo_insurance_claimsadministrator': '$data.bginfo.insurance_claimsadministrator' }, count: {$sum:1}}}, function (err, data) {
		//Patientdata.distinct("data.bginfo.insurance_claimsadministrator", function(err,data){
		//Patientdata.find(distinct("data.bginfo.insurance_claimsadministrator"), function(err,data){
		Patientdata.find({"data.bginfo.insurance_claimsadministrator": {$exists: true, $ne: ""}}, {"data.bginfo.insurance_claimsadministrator":1}, function(err,data){
			 if (err) res.send(500, err.message);
			 else
			 {
				//res.jsonp([{ claimadmdata: data }]);
			 }
		});
	//}
	//else{
	//	return res.jsonp(500, { message: "User is unauthorized to view this data" });
	//}


}
