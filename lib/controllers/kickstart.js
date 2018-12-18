var mongoose = require('mongoose'),
	Practice = mongoose.model('Practice'),
	Patient = mongoose.model('Patient'),
	User = mongoose.model('User'),
	IncrementRecord = mongoose.model('IncrementRecord'),
	request = require('request');
var crypto = require('crypto');
var mail = require('./mail');
var _this = this;



this.kickstart = function (req, res) {
	//verify capatcha
	_this.captchVerification(req, res, function (is_verified) {
		if (is_verified) {
			//verify if url is present or not
			_this.verify_url(req, res, function (is_verified, pract) {
				if (is_verified) {
					_this.createpatient(req, res, pract, function (is_verified, pract, req, res, newpatient) {
						if (is_verified) {
							//get superadmin ends here
							//get superadmin for this user
							_this.getSuperadmin(req, res, pract, function (is_verified, superadminData, req, res, pract) {
								
								if (is_verified) {
									//send email for the practice account and superadmin role.
									if (typeof (superadminData.email) != 'undefined') {
										//we should not send email if user fname and lanme is not defined
																				
										_this.searchpatients(req, res, pract, superadminData, function (is_verified, req, res, pract, superadminData) {
											if ((typeof (req.body.patientModel.basicinformation[0].firstname) != 'undefined') && (typeof (req.body.patientModel.basicinformation[0].lastname) != 'undefined') && (typeof (req.body.patientModel.contactinformation[0].email) != 'undefined')) {
												//var placeholdersSuper = {practicename: pract.practicename,url:process.env.EMAIL_URL + "/login",fname:req.body.patientModel.basicinformation[0].firstname,lname:req.body.patientModel.basicinformation[0].lastname[0]};

												var placeholdersSuper = { practicename: pract.practicename, url: process.env.EMAIL_URL + "/login", fname: req.body.patientModel.basicinformation[0].firstname, lname: req.body.patientModel.basicinformation[0].lastname[0], kickstarturl: process.env.EMAIL_URL + "/injury/" + req.params['id'] };

												var localSuper = { to: [pract.kickstart_page.email_recipient] };
												var placeholdersUser = {};
												var localsUser = { to: req.body.patientModel.contactinformation[0].email };

												
												if (typeof req.body.submittedby != 'undefined') {
													if (req.body.submittedby != '') {
														if (req.body.submittedby == 'Employer') {
															if (typeof req.body.patientModel.injury[0].injurydata.employercontact[0].employercontact_email != 'undefined') {
																if (req.body.patientModel.injury[0].injurydata.employercontact[0].employercontact_email != '') {
																	localsUser = { to: req.body.patientModel.injury[0].injurydata.employercontact[0].employercontact_email };
																}
															}
														}
														if (req.body.submittedby == 'Insurance') {
															if (typeof req.body.patientModel.injury[0].injurydata.claimsadjuster[0].claimsadjuster_email != 'undefined') {
																if (req.body.patientModel.injury[0].injurydata.claimsadjuster[0].claimsadjuster_email != '') {
																	localsUser = { to: req.body.patientModel.injury[0].injurydata.claimsadjuster[0].claimsadjuster_email };
																}
															}
														}
														if (req.body.submittedby == 'Nurse') {
															if (typeof req.body.patientModel.injury[0].injurydata.rncasemanager[0].rncasemanager_email != 'undefined') {
																if (req.body.patientModel.injury[0].injurydata.rncasemanager[0].rncasemanager_email != '') {
																	localsUser = { to: req.body.patientModel.injury[0].injurydata.rncasemanager[0].rncasemanager_email };
																	
																}
															}
														}
														if (req.body.submittedby == 'Provider') {
															if (typeof req.body.patientModel.injury[0].injurydata.provider[0].provider_email != 'undefined') {
																if (req.body.patientModel.injury[0].injurydata.provider[0].provider_email != '') {
																	localsUser = { to: req.body.patientModel.injury[0].injurydata.provider[0].provider_email };
																	
																}
															}
														}
														if (req.body.submittedby == 'Attorney') {
															
															
															if (typeof req.body.patientModel.injury[0].injurydata[req.body.patientModel.injury[0].injurydata.involvementradio][0][req.body.patientModel.injury[0].injurydata.involvementradio + '_email'] != 'undefined') {
																if (req.body.patientModel.injury[0].injurydata[req.body.patientModel.injury[0].injurydata.involvementradio][0][req.body.patientModel.injury[0].injurydata.involvementradio + '_email'] != '') {
																	
																	localsUser = { to: req.body.patientModel.injury[0].injurydata[req.body.patientModel.injury[0].injurydata.involvementradio][0][req.body.patientModel.injury[0].injurydata.involvementradio + '_email'] };
																	
																}
															}
														}
													}
												}
												 
												
												_this.sendmail(localsUser, placeholdersUser, localSuper, placeholdersSuper, is_verified, pract, function (is_verified, err) {
													if (is_verified) {
														res.json(200, { "code": 0, "message": "Data recorded successfully.", data: newpatient });
													} else {
														res.json(400, { "code": 1, "message": "Error sending mail." });
													}
												});

											} else {
												res.json(400, { "code": 1, "message": "Please send proper data." });
											}
										});
										
									} else {
										res.json(400, { "code": 1, "message": "No data for for the account" });
									}
								} else {
									res.json(400, { "code": 1, "message": "Unable to get superadmindata." });
								}
							});
							//get superadmin ends here
						} else {
							res.json(400, { "code": 1, "message": "Unable to create patient." });
						}
					})
				} else {
					res.json(400, { "code": 1, "message": "Unable to verify URL." });
				}
			});
		} else {
			res.json(400, { "code": 1, "message": "Failed captcha verification." });
		}
	})
}

this.updateData = function (req, res, category, callback) {

	//new updated data
	var patientid = req.body.step1patient._id;
	var category = category;
	var categorySet = category + '.$.status';
	var categorynewdata = req.body.patientModel[category][0];

	categorynewdata._id = mongoose.Types.ObjectId();
	categorynewdata.updateddate = Date.now();

	if (categorynewdata.id) {
		delete categorynewdata.id;
	}


	var query = {
		_id: patientid
	}
	var querySet = {};
	var queryPush = {};

	query[category] = { $elemMatch: { 'status': 'current' } };
	querySet[categorySet] = 'archive';
	queryPush[category] = categorynewdata;

	Patient.update(query, {
		$set: querySet
	}).exec(function (err, result) {
		if (err) return res.send(500);
		else {
			
			
			Patient.update({ _id: patientid }, {
				$push: queryPush
			}).exec(function (err, result) {
				if (err) {
					callback(false, err, req, res);
				}
				else {
					callback(true, result, req, res);
				}
			});
		}
	});
}
 
this.updateAppointment = function (req, res,category, callback) {
	var patientid = req.body.step1patient._id;
	var str="";
	if(req.body.appointment_schedule=='Yes'){
		str='<br/>The injured worker made the following comment regarding a desired appointment time: "' + req.body.appointment_notes + '"';
	}else{
		str='<br/>The injured worker does not need to schedule an appointment.'
	}
	var query = {
		_id: patientid
	}
	var querySet = {};
	var newstr=req.body.step1patient.injury[0].injurydata.communication.othernotes+str;
	
	Patient.update(query, {
		$set: {'injury.0.injurydata.communication.othernotes':newstr}
	}).exec(function (err, result) {
		if (err) {
			callback(false, err, req, res);
		}
		else {
			callback(true, result, req, res);
		}
	});
}
this.verifycookie = function (req, res, callback) {

	if (req.cookies['kickstartsessioncookie']) {
		callback(true);
	} else {
		callback(true);
	}
}
this.medicalhistory = function (req, res) {
	
	_this.verify_url(req, res, function (is_verified, pract) {
		
		_this.updateData(req, res, 'medicalhistory', function (is_verified, result, req, res) {
			if (is_verified) {
				res.json(200, { "code": 0, "message": "Data recorded successfully.", data: JSON.stringify(req.body) });
			} else {
				res.json(400, { "code": 1, "message": "Unable to verify URL." });
			}
		})

	});
}
this.socialhistory = function (req, res) {
	
	_this.verify_url(req, res, function (is_verified, pract) {
		
		_this.updateData(req, res, 'sh', function (is_verified, result, req, res) {
			if (is_verified) {
				res.json(200, { "code": 0, "message": "Data recorded successfully.", data: JSON.stringify(req.body) });
			} else {
				res.json(400, { "code": 1, "message": "Unable to verify URL." });
			}
		})
	});
}
this.scheduleappointment = function (req, res) {
	
	_this.verify_url(req, res, function (is_verified, pract) {
		
		_this.updateAppointment(req, res, 'appointment', function (is_verified, result, req, res) {
			if (is_verified) {
				res.json(200, { "code": 0, "message": "Data recorded successfully.", data: JSON.stringify(req.body) });
			} else {
				res.json(400, { "code": 1, "message": "Unable to verify URL." });
			}
		})
	});
}

this.verifyPractice = function (req, res) {
	//verify if url is present or not
	_this.verify_url(req, res, function (is_verified, pract) {
		if (is_verified) {
			res.json(200, { "responseCode": 0, "responseDesc": "Data recoreded successfully.", faxnumber: typeof (pract.faxnumber) != 'undefined' ? pract.faxnumber : '(206) 338-3005', kickstart_page: pract.kickstart_page });
		} else {
			res.json(400, { "responseCode": 1, "responseDesc": "Unable to verify URL" });
		}
	});
}

this.captchVerification = function (req, res, callback) {
	
	var requestQuery = req.body;
	var captch_key = process.env.CAPTCHA_KEY
	if (requestQuery != undefined && requestQuery != '' && requestQuery != null && requestQuery.response != undefined && requestQuery.response != '' && requestQuery.response != null) {
		var response = requestQuery.response;
		var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + captch_key + "&response=" + response;
		request(verificationUrl, function (error, response, body) {
			body = JSON.parse(body);
			if (body.success !== undefined && !body.success) {
				callback(false);
				//res.send({"code" : 1,"message" : "Failed captcha verification"});
			} else {
				callback(true);
				//_this.verify_url(req, res);
			}
		});
	} else {
		callback(false);
		//res.send({"code" : 1,"message" : "Failed captcha verification"});
	}

}
/*
* This function is used to verify if a particular url is presnt 
*/
this.verify_url = function (req, res, callback) {
	
	var requestQuery = req.params;
	if (typeof (requestQuery['id']) != 'undefined') {
		
		Practice.findOne({ 'enable_kickstart': true, kickstart_url: requestQuery['id'] }, function (err, pract) {
			
			if (err) {
				callback(false, null);
				//res.send({"code" : 1,"message" : "Failed captcha verification"});
			} else {
				if (pract != null) {
					callback(true, pract);
					//res.send({"code" : 0,"message" : "Sucess"});	
				} else {
					callback(false, null);
				}

			}
		});
	} else {
		
		callback(false, null);
		//res.send({"code" : 1,"message" : "Failed captcha verification"});
	}
}

/*
* This function is used to verify if a particular url is presnt 
*/
this.getSuperadmin = function (req, res, pract, callback) {
	
	if (typeof (pract.practicename) != 'undefined') {
		User.findOne({ 'practice.rolename': 'superadmin', 'practice.status': 'active', 'practice.name': pract.practicename }, function (err, superadminData) {
			
			if (err) {
				callback(false, null, req, res, pract);
				//res.send({"code" : 1,"message" : "Failed captcha verification"});
			} else {
				if (superadminData != null) {
					
					callback(true, superadminData, req, res, pract);
					//res.send({"code" : 0,"message" : "Sucess"});	
				} else {
					callback(false, null, req, res, pract);
				}

			}
		});
	} else {
		
		callback(false, null, req, res, pract);
		//res.send({"code" : 1,"message" : "Failed captcha verification"});
	}
}
/*
	* This function is used to verify if a particular url is presnt 
*/
this.sendmail = function (localsUser, placeholdersUser, localSuper, placeholdersSuper, is_verified, pract, callback) {
	//send email to superadmin about he new user registration 		
	var superadminmail = is_verified == true ? 'kickStartRegSuperadminV2' : 'kickStartRegSuperadmin';
	mail.sendMailMsg(superadminmail, localSuper, placeholdersSuper, function (err, res) {
		if (err) {
			callback(true, err);
		} else {
			//mail.sendMailMsg('kickStartRegUser', localsUser, placeholdersUser, function (err, res) {
			mail.sendMailWithoutTemplate(pract.kickstart_page.email_content.email_subject, pract.kickstart_page.email_content.email_body, localsUser, placeholdersUser, function (err, res) {
				if (err) {
					callback(true, err);
				} else {
					callback(true, {});
				}
			});
		}
	});
}

this.createpatient = function (req, res, pract, callback) {

	var pattern = 'RF-';
	IncrementRecord.findOneAndUpdate({ 'id': 'patientrecord' }, { "$inc": { "patientrecordno": 1 } }, { "upsert": true }, function (err, increment) {
		if (err) {
			callback(false, pract, req, res);
		} else {

			var patientrecordno = pattern + ('00000' + increment.patientrecordno).slice(-6);
			var newPatient = new Patient(req.body.patientModel);
			newPatient.patientrecordno = patientrecordno;
			newPatient.createdby = pract.practicename;
			newPatient.practicename = pract.practicename;
			newPatient.createdFromLandingPage = true;
			newPatient.state = 'CA';
			newPatient.confirmed = false;
			newPatient.createddate = Date.now();

			var recent = {};
			recent.vieweddate = Date.now();
			newPatient.recentviews = [];
			newPatient.recentviews.push(recent);

			newPatient.save(function (err, resp) {
				if (err) {
					
					callback(false, pract, req, res);
				} else {
					
					callback(true, pract, req, res, resp);
				}
			});
		}
	});
};

this.searchpatients = function (req, res, pract, superadminData, callback) {

	if (req.body.patientModel.basicinformation[0].firstname != 0 && req.body.patientModel.basicinformation[0].firstname != '')
		var firstname = req.body.patientModel.basicinformation[0].firstname;

	if (req.body.patientModel.basicinformation[0].lastname != 0 && req.body.patientModel.basicinformation[0].lastname != '')
		var lastname = req.body.patientModel.basicinformation[0].lastname;

	if (req.body.patientModel.basicinformation[0].dateofbirth != 0 && req.body.patientModel.basicinformation[0].dateofbirth != '')
		var dateofbirth = req.body.patientModel.basicinformation[0].dateofbirth;

	//For full Search of Patient Example
	Patient.find({ practicename: pract.practicename }
		, { basicinformation: { $elemMatch: { 'status': 'current' } }, "basicinformation.firstname": 1, "basicinformation.middlename": 1, "basicinformation.status": 1, "basicinformation.lastname": 1, "contactinformation.homephone": 1, "basicinformation.gender": 1, "basicinformation.dateofbirth": 1 })
		.exec(function (err, patients) {
			if (err) return callback(false, req, res, pract, superadminData);
			else {
				
				var results = patients.filter(function (val) {

					if (val.basicinformation.length > 0) {
						return (new RegExp('.*' + firstname + '.*', 'i').exec(val.basicinformation[0].firstname) != null &&
							new RegExp('.*' + lastname + '.*', 'i').exec(val.basicinformation[0].lastname) != null &&
							(new Date(val.basicinformation[0].dateofbirth).toDateString() == new Date(dateofbirth).toDateString())
						);
					} else {
						return false;
					}
				});
				if (results.length > 1) {					
					callback(true, req, res, pract, superadminData);
				} else {
					callback(false, req, res, pract, superadminData);
				}
			}
		});
};
module.exports = {
	captchVerification: this.captchVerification,
	verify_url: this.verify_url,
	createpatient: this.createpatient,
	kickstart: this.kickstart,
	searchpatients: this.searchpatients,
	verifyPractice: this.verifyPractice,
	getSuperadmin: this.getSuperadmin,
	medicalhistory: this.medicalhistory,
	scheduleappointment: this.scheduleappointment,
	socialhistory: this.socialhistory
}