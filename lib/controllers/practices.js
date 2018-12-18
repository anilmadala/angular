
'use strict';

var mongoose = require('mongoose'),
    Practice = mongoose.model('Practice'),
    User = mongoose.model('User'),
	crypto = require('crypto'),
    IncrementRecord = mongoose.model('IncrementRecord'),

    config = require('../config/config'),
	logger = require('../config/logger');

var authorizecim = require('./authorize-cim');

var mail = require('./mail');
var Grid = require('gridfs-stream'),
    fs = require('fs');
// For Local Path
var path = 'http://127.0.0.1:9000';
var copyPath = '127.0.0.1:9000';
//For server Path Change
//var path = 'http://';

/**
 * Create new Practice
 */
var _this=this;

var encryptionKey = process.env.ENCRYPTED_KEY;

function encrypt(text) {

	var crypted;
	if (text === null || typeof text === 'undefined') { return text; };
	var cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
	crypted = cipher.update(text,'utf8','hex');
	crypted += cipher.final('hex');
	return crypted;
}

exports.create = function (req, res, next) {
    IncrementRecord.findOneAndUpdate(
        { 'id': 'newuserpid' },
        { "$inc": { "patientrecordno": 1 } },
        { "upsert": true },
       function (err, increment) {
           if (err) return res.send(500)
           else {
               var newPractice = new Practice(req.body);
               var practiceUser = new User(req.body);

               newPractice.pid = increment.patientrecordno;
               newPractice.address = newPractice.address;
               newPractice.pid = increment.patientrecordno;
               newPractice.dfrfreereport = '';
               newPractice.pr2freereport = '';
               newPractice.pr4freereport = '';
               newPractice.dfrcharge = '';
               newPractice.pr2charge = '';
               newPractice.pr4charge = '';
               newPractice.pricingtype = 'defaultpricing';

               practiceUser.practice = [
                   { 'name': newPractice.practicename, 'role': 'superadmin', 'rolename': 'superadmin', 'level': 'level4', 'status': 'active' }
               ];
               var userAlreadyExist = false;
               var createPractice = function (err, result) {
                   if (!err) {
                       newPractice.billingaddress.customerAddressId = result.customerAddressId;
                       newPractice.save(function (err) {
                           if (err) {
                               // Manually provide our own message for 'unique' validation errors, can't do it from schema

                               if (err.errors.practicename.type === 'Value is not unique.') {
                                   err.errors.practicename.type = 'The specified practicename is already in use.';
                               }
                               return res.json(500, err);
                           }
                           //Send activation email to the admin

						   //this used to add recent pwd into oldpassword array
                            var newPasswordVerify = encrypt(req.body.password);
                       		var pwdAry=[];
                       		pwdAry.push(newPasswordVerify);
                       		practiceUser.oldpasswords=pwdAry;

                           practiceUser.save(function (err) {

                               if (err) {

                                   return res.json(500, err);
                               }
                               else {
                                   var locals = {
                                       to: practiceUser.email
                                   };

                                   var placeholders = {
                                       firstname: practiceUser.firstname,
                                       link: process.env.EMAIL_URL + '/activation/' + newPractice._id,
                                       copyLink: process.env.EMAIL_URL + '/activation/' + newPractice._id,
                                       practicename: newPractice.practicename
                                   };
                                   mail.sendMailMsg('Registration', locals, placeholders, function (err, res) {
                                       if (err) {
                                            return res.json(500, err);
                                           //return res.json(200, "You have been Successfully registered. Please check your email for activation.");
                                       }
                                   });

                                   /*
								   * Send alert to sales@rate-fast.com on registration
								   */

								    //code
									var today = new Date();
									var dd = today.getDate();
									var mm = today.getMonth()+1; //January is 0!

									var yyyy = today.getFullYear();
									if(dd<10){
											dd='0'+dd
									}
									if(mm<10){
											mm='0'+mm
									}
									var today = dd+'/'+mm+'/'+yyyy;
								    //


                                   var phone = String(req.body.billingaddress.phonenumber);
                                   phone = phone.replace(/[^0-9]/g, '');
                                   phone = phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");

								   var alertPlaceHolder = {
									   billing_address: newPractice.billingaddress.billingaddres,
									   provider_name: req.body.firstname + " " + req.body.lastname,
									   provider_type: req.body.accounttype,
									   practice_name: newPractice.practicename,
									   county_billing: newPractice.billingaddress.county,
									   city_billing: newPractice.billingaddress.city,
									   state_billing: newPractice.billingaddress.state,
									   zip_billing: newPractice.billingaddress.zipcode,
									   phone_number: phone,
									   email_address: practiceUser.email,
									   username: req.body.username,
									   created_date: today
								   }


								   mail.sendMailMsg('registrationalert', { to: process.env.SALES_MAIL_ID }, alertPlaceHolder, function (err, res) {
									   if (err) {
										    return res.json(500, err);
									   }
								   });

                                   return res.json(200, "Successfully registered. Please check your email for activation.");

                               }
                           });
                       });
                   } else {
                       return res.json(500, err);
                   }
               }

               var createCimProfiles = function (err, result) {
				   if(err)
					   return res.json(500, err);
				   else
                   authorizecim.customCreateProfile(newPractice, practiceUser, createPractice);
               };

               var userValidProfile = function (err, result) {
                   if (err) {

                       return res.json(500, err);
                   }
                   if (result == false) {

                       //Credentials mismatch
                       return res.json(401, "Invalid Credentials");
                   }
                   else {

                       //call authroize to create profile
                       practiceUser = result;
                       createCimProfiles();
                   }
               };

               var userExist = function (err, result) {
                   if (err) {

                       return res.json(500, err);
                   }
                   if (result > 0) {

                       userAlreadyExist = true;
                       practiceUser.validProfileInfo(req.body.password, userValidProfile);
                   }
                   else {

                       //call authroize to create profile
                       createCimProfiles();
                   }
               };
               var practiceExist = function (err, result) {
                   if (err) {
                       return res.json(500, err);
                   }
                   if (result > 0) {
                       return res.json(500, "Practice Name is already registered");
                   }
                   //Check resgitering user alredy exist and have valid crentials

                   practiceUser.isPresent(userExist);
               };
               //Create Practice after validations
               newPractice.isExist(practiceExist);
           }
       });
};

/**
    Auto Increment Field
**/

exports.resendInvitation = function (req, res) {

    var fullname;

	if(req.body)
		if(req.body.firstname)
			if(req.body.firstname.length>0)
				fullname = req.body.firstname.charAt(0).toUpperCase() + req.body.firstname.slice(1);

    var emailid = req.body.email;
    var currentpracticename = req.body.resendPracticename;


    var sendinvitation = function (templates, link) {
        var locals = {
            to: emailid
        };
        var sendLink = process.env.EMAIL_URL + link + req.body._id + "/" + currentpracticename;

        var placeholders = {
            link: sendLink,
            firstname: fullname,
            practicename: currentpracticename
        };

        mail.sendMailMsg(templates, locals, placeholders, function (err, result) {
            if (err) {
                res.send('error', { status: 500, id: req.body.id });
            }
            return res.json(200, { id: req.body.id });
        });
    }

    sendinvitation('InviteNewuser', '/useractivation/');
}


exports.resetpassword = function (req, res) {

    var fullname = req.body.firstname;
    var emailid = req.body.email;
    var searchemail = new RegExp('^' + emailid + '$', "i");
    var currentpracticename = req.user.practicename;
    var newpassword = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8);


    var sendinvitation = function (templates, link) {
        var locals = {
            to: emailid
        };
        var sendLink = process.env.EMAIL_URL + link;

        var placeholders = {
            link: sendLink,
            firstname: fullname,
            practicename: currentpracticename,
            password: newpassword
        };

        mail.sendMailMsg(templates, locals, placeholders, function (err, result) {
            if (err) {

				logger.info('[practices/resetpassword] Line. 290. Error: ' + JSON.stringify(err));
				res.send('error', { status: 500, id: req.body.id });

            }
            return res.json(200, { id: req.body.id });
        });
    }

    User.findOneAndUpdate({ 'email': searchemail }, { isresetpwdExpire: true, resetpwddateExpire: Date.now(), password: newpassword, loginattempts: 0 },
       function (err, users) {
           if (err) {
               res.send(500, err);
           } else {

               users.password = String(newpassword);
               users.save(function (err) {
                   if (err) {
                       res.json(500, { message: err });
                   }
                   else {
                       //update the resetpwddate in collection to null
                       users.update({ '_id': users._id }, { 'resetpwddate': '' });
                   }
               });
               sendinvitation('Resetpasswordbyadmin', '/login');
           }
       });
}



exports.inviteusers = function (req, res) {

    var fullname = req.body.firstname;
    var lastname = req.body.lastname;
    var emailid = req.body.emailId;
    var searchemail = new RegExp('^' + emailid + '$', "i");


    var role = req.body.role;
    var level = req.body.level;


    var currentuserrole = req.user.userInfo.role.trim().toLowerCase();
    var currentpracticename = req.user.practicename;
    var superadminlevel = ['4', '1', '2', '3'];
    var siteadminRoles = ['rater1', 'rater2', 'siteadmin'];

    var sendinvitation = function (templates, user, link) {

        var locals = {
            to: emailid
        };

        var sendLink = link ? process.env.EMAIL_URL + link + user._id + "/" + currentpracticename : process.env.EMAIL_URL + "/login";

        var placeholders = {
            link: sendLink,
            firstname: fullname,
            practicename: currentpracticename
        };

        mail.sendMailMsg(templates, locals, placeholders, function (err, result) {
            if (err) {
        logger.info('[practices/inviteusers] Line. 350. Error: ' + JSON.stringify(err));
            if(templates=='InviteNewuser'){
        User.findOneAndRemove({_id : user._id}, function (err,result){
          if(err){

          }
          else{
            res.send({mesaage:'something went wrong'});
          }

        });
      }
				// Changed by Unais from "res.send('error', { status: 500, id: req.body.id });" to "res.json(500, { message: err });"
				res.json(500, { message: err });
            }

            return res.json(200, { id: req.body.id });
        });
    }


    var checkemail = function () {

        User.count({ 'email': searchemail }).exec(function (err, count) {

			if(err)
				res.json(500, { message: err });
			else
			{
				if (count > 0) {
					// user already exist


					if (currentuserrole == 'siteadmin') {
						var newpractice = {
							name: currentpracticename,
							role: role,
							rolename: role,
							level: '',
							status: 'active'
						}
					} else {

						var newpractice = {
							name: currentpracticename,
							role: role + " level" + level,
							rolename: role,
							level: "level" + level,
							status: 'active'
						}
					}
					User.findOneAndUpdate({ 'email': searchemail }, { $push: { practice: newpractice } }, { safe: true, upsert: true, sparse: true },
						function (err, users) {
							if (err) {
							   res.json(500, { message: err });
							} else {
								sendinvitation('InviteExcitinguser', users, '');
							}
						});
				} else {
					//new user


					if (currentuserrole == 'siteadmin') {
						var newpracticeUsers = new User({
							firstname: fullname, lastname: lastname,email: emailid,  password: 'dummypassword', practice: [
								{ name: currentpracticename, role: role, rolename: role, status: 'invited' }
							], username: Math.random().toString(36).substring(7)
						});
					} else {
						var newpracticeUsers = new User({
							firstname: fullname, lastname: lastname,email: emailid,password: 'dummypassword', practice: [
								{ name: currentpracticename, role: role + " level" + level, rolename: role, level: "level" + level, status: 'invited' }
							], username: Math.random().toString(36).substring(7)
						});
					}

					newpracticeUsers.save(function (err) {
						if (err) {

							res.json(500, { message: err });
						}
						else {
							sendinvitation('InviteNewuser', newpracticeUsers, '/useractivation/');
						}
					});
				}
			}
        });
    };

    var validateinputs = function () {

        //validate email should present
        if (!fullname) {
            return res.json(400, { 'message': 'FirstName Required for Inviting User, ', 'id': req.body.id });
        }
        if (!lastname) {
            return res.json(400, { 'message': 'LastName Required for Inviting User, ', 'id': req.body.id });
        }
        if (!emailid) {
            return res.json(400, { 'message': 'Email Required for Inviting User, ', 'id': req.body.id });
        }
        if (!role) {
            return res.json(400, { 'message': 'Role Required for Inviting User, ', 'id': req.body.id });
        }
        if (currentuserrole == 'superadmin' && superadminlevel.indexOf(level) == -1) {
            return res.json(400, "Invalid Levels");
        }
        User.count({ 'email': searchemail, 'practice': { $elemMatch: { 'name': currentpracticename } } }).exec(function (err, count) {
            if(err)
				return res.json(500, { message: err });
			else
			{
				if (count > 0) {
					//return res.json(400, "message:User have already assign with this practice,id:"+req.body.id);

          return res.json(400, { 'message': 'The email ' + emailid + ' already has access to this practice!', 'id': req.body.id });

				}
				//TODO check for siteadmin
				if (currentuserrole == 'siteadmin' && siteadminRoles.indexOf(role) == -1) {
					return res.json(400, "Invalid Role");
				}
				checkemail();
			}
        });
    }

    /**
     * check user role before processessing further
     * This is accessible to following user
     * 'superadmin','siteadmin','admin level1','admin level2','admin level3','admin level4'
     */


  if(currentuserrole=='siteadmin' || currentuserrole=='superadmin' || currentuserrole=='admin level1' || currentuserrole=='admin level2' || currentuserrole=='admin level3' || currentuserrole=='admin level4'){

    if(currentuserrole=='siteadmin'){

       if(role=="siteadmin" || role=="rater1" || role=="rater2"){

            validateinputs();
       }else{

            return res.json(500, { 'message': 'You donot have the required permission.','id': req.body.id});
       }
    }

     if(currentuserrole=='superadmin'){

       if(role=="admin" || role=="nonadmin"){

            validateinputs();
       }else{

            return res.json(500, { 'message': 'You donot have the required permission.','id': req.body.id });
       }
    }
     if(currentuserrole=='admin level1' ||currentuserrole=='admin level2'||currentuserrole=='admin level3'||currentuserrole=='admin level4' ){

      if(role=="admin" || role=="nonadmin"){

            validateinputs();
       }else{

            return res.json(500, { 'message': 'You donot have the required permission.','id': req.body.id});
       }
    }
  }else{

    return res.json(500, { 'message': 'You donot have the required permission.','id': req.body.id});
  }

}

exports.uniquename = function (req, res) {

    var pname = req.params.practiceName;
    var options = {
        pname: pname
    }

    Practice.uniquename(options, function (err, practices) {
        if (err) {
            /*res.render('error', {
                status: 500
            });*/
			res.send(500);//Changed by Unais
        }
        else {
            Practice.count().exec(function (err, count) {
				if(err)
				{
					res.send(500);
				}
				else
				{
					if (practices) {
						if (practices == "")
							res.send(true)
						else
							res.send(false)
					}
				}
            })
        }
    })
};

exports.uniquelicense = function (req, res) {
    var ulicense = req.params.licenseNumber;
    var options = {
        ulicense: ulicense
    }

    Practice.uniquelicense(options, function (err, practices) {
        if (err) {
            /*res.render('error', {
                status: 500
            });*/
			res.send(500);//Changed by Unais
        } else {
            Practice.count().exec(function (err, count) {
                if(err)
				{
					res.send(500);
				}
				else
				{
					if (practices == "")
						res.send(true)
					else
						res.send(false)
				}
            })
        }

    })
};

exports.practiceList = function (req, res, next) {

    Practice.find().exec(function (err, practices) {
        if (err) {
            /*res.render('error', {
                status: 500
            });*/
			res.send(500);//Changed by Unais
        } else {
            res.jsonp(practices);
        }
    });
};

exports.getPracticeByName = function (req, res, next) {

    var currentpractice = req.user.userInfo.practicename;
    var practicename = req.params.practiceName;
    var role = req.user.userInfo.role.trim().toLowerCase();

    if (currentpractice != practicename && role != 'siteadmin') {
        return res.send(500, 'You are not authorized to access this Practice');
    }

    var options = {
        practicename: practicename
    }

    Practice.find(options, function (err, practices) {
        if (err) return res.send(500)

        if (practices.length == 0) {
            return res.send(204);
        }

        res.jsonp({
            practices: practices
        });

    })
};

exports.getPracticeById = function (req, res, next) {

    var practiceId = req.params.practiceId;
    var options = {
        practiceId: practiceId
    };

    Practice.findById(options, function (err, practices) {
        if (err) return res.send(500)

        if (practices.length == 0) {
            return res.send(204);
        }

        Practice.count().exec(function (err, count) {
			if (err)
				return res.send(500)
			else
			{
				res.jsonp([
					{
						title: 'Practice',
						practices: practices
					}
				]);
			}
        })
    })
};

exports.getPracticeDatabyName = function (req, res) {

    var criteria;
    var practicename = req.params.practicename;
    var role = req.user.userInfo.role.trim().toLowerCase();

    if (role == 'siteadmin' || role == 'rater1' || role == 'rater2') {
        criteria = { practicename: practicename };
    } else {
        criteria = { practicename: req.user.practicename };
    }

    Practice.find(criteria).exec(function (err, practices) {
        if (err) return res.send(500)
        else {
            res.jsonp([
                {
                    practices: practices
                }]);
        }
    });
};

/**Code update by Shridhar. This function is no longer used now due to recent update in search code which is done with only two functions now (searchAllPractice and getPracticeSearch functions) **/
exports.index = function (req, res) {

    var role = req.user.userInfo.role.trim().toLowerCase();
    var criteria;

    if (role == "siteadmin") {
        criteria = {};
    }
    else if (role == 'superadmin' || role == 'admin level1' || role == 'admin level2' || role == 'admin level3' || role == 'admin level4') {
        criteria = { practicename: req.user.practicename };
    }

    var page = (req.param('pagenum') > 0 ? req.param('pagenum') : 1) - 1
    var perPage = 9
    var options = {
        perPage: perPage,
        page: page,
        criteria: criteria
    }

    Practice.list(options, function (err, practices) {
        if (err) return res.send(500)
        Practice.count(options.criteria).exec(function (err, count) {
            res.jsonp([
                {
                    title: 'Practice',
                    practices: practices,
                    page: page + 1,
                    pages: Math.ceil(count / perPage),
                    totalitem: count
                }
            ]);

        })
    })
};

/**Code update by Shridhar. This function is no longer used now due to recent update in search code which is done with only two functions now (searchAllPractice and getPracticeSearch functions) **/
exports.status = function (req, res) {

    var page = (req.param('pagenum') > 0 ? req.param('pagenum') : 1) - 1
    var perPage = 9
    var options = {
        perPage: perPage,
        page: page,
        status: req.params.statusId,
        searchId: req.params.searchId
    }

    var Query = {}
	if(options.status){
		if(options.searchId){
			Query={'status':options.status,'practicename':{$regex: options.searchId, $options: 'i'}}
		}
		else{
			Query={'status':options.status}
		}
	}
	else if(options.searchId){
		Query={'practicename':{$regex: options.searchId, $options: 'i'}}
	}

    Practice.find(Query).sort({ 'practicename': 1 }).limit(options.perPage).skip(options.perPage * options.page)
    .exec(function (err, practices) {
        if (err) return res.send(500)
	        if (practices.length == 0) {
	            return res.send(204);
	        }
		  Practice.count(Query).exec(function (err, count) {
			if (err)
				   return res.send(500)
			else
			{
			  res.jsonp([
				  {
					  title: 'Practice',
					  practices: practices,
					  page: page + 1,
					  pages: Math.ceil(count / perPage),
					  totalitem: count
				  }
			  ]);
			}
		  })
    })
};

/**Code update by Shridhar. This function is no longer used now due to recent update in search code which is done with only two functions now (searchAllPractice and getPracticeSearch functions) **/
exports.search = function (req, res) {

    var searchId = req.params.searchId;
    var page = (req.param('pagenum') > 0 ? req.param('pagenum') : 1) - 1
    var perPage = 9
    var options = {
        perPage: perPage,
        page: page,
        searchId: searchId
    }

    var Query = {}
	if(options.searchId){
			Query={'practicename':{$regex: options.searchId, $options: 'i'}}
	}

    Practice.find(Query).sort({ 'practicename': 1 }).limit(options.perPage).skip(options.perPage * options.page)
    .exec(function (err, practices) {

        if (err)
			//return res.render('500')
			return res.send(500);
		else
		{
			Practice.count(Query).exec(function (err, count) {
				if (err)
					return res.send(500)
				else
				{
					res.jsonp([
						{
							title: 'Practice',
							practices: practices,
							page: page + 1,
							pages: Math.ceil(count / perPage),
							totalitem: count
						}
					]);
				}

			})
		}
    })
};

/**Author: Shridhar Gadhave
  Date: 09.03.2016
  Purpose: Used for practice search by Email, Name and Practice name filtered by status
  **/

exports.searchAllPractice = function (req, res) {
  var role = req.user.userInfo.role.trim().toLowerCase();

  if(role=='rater1' || role=='rater2'){
	 	  return res.render('500');
  }

  var searchId='';
  if(typeof req.body.searchId!="undefined"){
	  if(req.body.searchId !='')
		  searchId=req.body.searchId.toLowerCase();
  }

  /*
   * if role != siteadmin then page=0
   */
  var page=0;

  	if(role == 'siteadmin'){
	  	page = (req.body.pagenum > 0 ? req.body.pagenum : 1) - 1
	  }

   var perPage = 9
   var options = {
       perPage: perPage,
       page: page,
       status: req.body.statusId,
       searchId: searchId
   }

  var Query = {}

  //if (role == 'superadmin' || role == 'admin level1' || role == 'admin level2' || role == 'admin level3' || role == 'admin level4') {
  if(role != 'siteadmin')
  {
      Query={practicename: req.user.practicename }
   	_this.getPracticeSearch(req,res,Query,options);
  }
  else
  {
	  if(typeof req.body.usersearch!="undefined"){
		  var searchUserBy=req.body.usersearch;
	  }

	   if(searchUserBy!="byUsername" && searchUserBy!="byEmail"){
				if(options.status){
					if(options.searchId){
						//Query={'status':options.status,'practicename':{$regex: options.searchId, $options: 'i'}}
						Query={'status':options.status,'practicename':options.searchId}
					}
					else{
						Query={'status':options.status}
					}
				}
				else if(options.searchId){
					Query={'practicename': options.searchId}
				}
		_this.getPracticeSearch(req,res,Query,options);
	   }
	   else{

			var usersearchQuery={};

			if(searchUserBy=="byUsername"){
				usersearchQuery= [ {  $project : { practice:1,firstname : {$toLower : "$firstname"},lastname : {$toLower : "$lastname"}}},
										  {  $match: {$or:[ {firstname:options.searchId},{lastname: options.searchId}] }
										  }
								 ]
			}else if(searchUserBy=="byEmail"){
				usersearchQuery= [ {  $project : { practice:1,email : {$toLower : "$email"}}},
									  {  $match: {email:options.searchId} }
								 ]
			}

			User.aggregate(usersearchQuery,function (err,userresult){
				if(err){

						return res.render('500');
					}

				(function(userresult,_this){
		   		  var activeUser=[];

		   		  var i = 0;
		   		  var j = 0;
		   		  function forloop1(){
		   		    if(i< userresult.length){
		   		      j = 0;
		   		      forloop2();
		   		    }else{
		   			    	if(options.status){
		   			   			Query={'status':options.status,'practicename':{$in:activeUser}};
		   			   		}else{
		   			   			Query={'practicename':{$in:activeUser}};
		   			   		}

		   			   		_this.getPracticeSearch(req,res,Query,options);
		   		    }
		   		  }
		   		  function forloop2(){
		   		    if(j< userresult[i].practice.length){
			   		    	if(userresult[i].practice[j].status=='active'){
			    				activeUser.push(userresult[i].practice[j].name);
			    			}
			   		    j++;
		   		      setTimeout(forloop2, 0);
		   		    }else{
		   		      i++;
		   		      setTimeout(forloop1, 0);
		   		    }
		   		  }
		   		  forloop1();
		   		})(userresult,_this);

			})
	   }
  }
};

/**Author: Shridhar Gadhave
  Date: 09.03.2016
  Purpose: Used for practice search Practice name only filtered by status
  **/
exports.getPracticeSearch = function (req,res,Query,options) {
	Practice.find(Query).sort({ 'practicename': 1 }).limit(options.perPage).skip(options.perPage * options.page)
  .exec(function (err, practices) {

      if (err)
		  //return res.render('500')
		  return res.send(500);//Changed by Unais
	  else
	  {
		  Practice.count(Query).exec(function (err, count) {
			if (err)
				  return res.send(500);//Changed by Unais
			else
			{
				res.jsonp([
					{
					  title: 'Practice',
					  practices: practices,
					  page: options.page + 1,
					  pages: Math.ceil(count / options.perPage),
					  totalitem: count
					}
				]);
			}
		  })
	  }
  })
}

exports.editPractice = function (req, res, next) {
    // mayur update
    var fax='';
    var phonenumber='';
    var billingextension='';
    var practicename2='';

    if(typeof(req.body.faxnumber) == undefined)    	{
    	fax='';
    }
    else{
    	fax=req.body.faxnumber;
    }

    if(typeof(req.body.billingaddress)!='undefined'){
    	if(typeof(req.body.billingaddress.phonenumber)!='undefined'){
    		phonenumber=req.body.billingaddress.phonenumber;
    	}
    	else{
    		phonenumber='';
    	}
    	if(typeof(req.body.billingaddress.billingextension)!='undefined'){
    		billingextension=req.body.billingaddress.billingextension;
    	}
    	else{
    		billingextension='';
    	}
	}
    else{
    	phonenumber='';
    	billingextension='';
    }

    if(typeof(req.body.practicename2) == undefined)    	{
    	practicename2='';
    }
    else{
    	practicename2=req.body.practicename2;
    }

    var practiceId = req.body._id;
    req.body.editionama = (req.body.editionama) ? req.body.editionama : "";
    req.body.billingcalculatoromfs = (req.body.billingcalculatoromfs) ? req.body.billingcalculatoromfs : "";
    var options = {
        practiceId: practiceId,
        name: req.body.name,
        status: req.body.status,
        practiceaddress: req.body.practiceaddress,
        editionama: req.body.editionama,
        billingcalculatoromfs: req.body.billingcalculatoromfs,
		faxnumber:fax,
        phonenumber:phonenumber,
        billingextension:billingextension,
        rfadetails:req.body.rfadetails,
        irsnumber:req.body.irsnumber,
		practicename2:practicename2
    };

    Practice.update({ _id: options.practiceId }, {
        $set: {
            'name': options.name,
            'status': options.status,
            'practiceaddress': options.practiceaddress,
            'editionama': options.editionama,
            'billingcalculatoromfs': options.billingcalculatoromfs,
			'faxnumber':options.faxnumber,
			'billingaddress.phonenumber':options.phonenumber,
            'billingaddress.billingextension':options.billingextension,
			'practicename2':options.practicename2,
			'rfadetails': options.rfadetails,
			'irsnumber': options.irsnumber
        }
    }).exec(function (err, result) {

        if (err) return res.send(500);
        else return res.send(200);
    });
};

exports.editCreditCard = function (req, res, next) {

    var expmonth = req.body.month;
    var expyear = req.body.year;
    var cardno = req.body.cardno;

    var save_practice = function (error) {
        if (!error) {
            var practiceId = req.body._id;

            var options = {
                practiceId: practiceId,
                billingaddress: req.body.billingaddress
            };

            Practice.update({ _id: options.practiceId }, {
                $set: {
                    'billingaddress': options.billingaddress
                }
            }).exec(function (err, result) {
                debugger;
                if (err) return res.send(500);
                else {
                    res.jsonp({ 'msg': 'succesful' });
                }
            });
        } else {
            res.send({ 'ccerror': 'invalid credit card' });
        }
    }

    if (expmonth != null && expyear != null && cardno != null) {

        if (expmonth.length == 1) {
            expmonth = "0" + expmonth;
        }
        var expdate = expyear + '-' + expmonth;
        var customer_payment_info = {
            profileId: req.body.cimprofileid,
            paymentProfileId: req.body.paymentprofileid,
            cardNumber: req.body.cardno,
            expirationDate: expdate,
            billingaddress: req.body.billingaddress,
            userinfo: req.user.userInfo
        }
        //try {
            authorizecim.updateCustomerPaymentProfile(customer_payment_info, save_practice);
        //}
        /*catch (err) {
            res.send({ 'ccerror': 'invalid credit card' });
        }*/
    } else {
        save_practice();
    }
};


exports.editStampApproval = function (req, res, next) {

    var options = {
        practiceId: req.body._id,
        stampapproval: req.body.stampapproval
    };

    Practice.update({ _id: options.practiceId }, {
        $set: {
            'stampapproval': options.stampapproval
        }
    }).exec(function (err, result) {
        if (err) return res.send(500);
        else return res.send(200);
    });

};

exports.uploadLogo = function (req, res, next) {

    var practiceId = req.body.practiceId;
    var id = mongoose.Types.ObjectId();
    Practice.update({ _id: practiceId }, {
        $set: {
            'letterhead': id
        }
    }).exec(function (err, result) {
        if (err) return res.send(500);
    });

    var conn = mongoose.createConnection(config.dbconnection.db);

    conn.once('open', function () {

        var tempfile = req.files.letterhead.path;
        var origname = req.files.letterhead.name;

        var gfs = Grid(conn.db, mongoose.mongo);

        var writestream = gfs.createWriteStream({ _id: id, filename: origname });

        fs.createReadStream(tempfile)
            .on('end', function () {

                res.redirect("back");
            })
            .on('error', function () {
               res.send(500);
            })
            .pipe(writestream);

    });


};

exports.getLogo = function (req, res, next) {

    var id = req.query.id;

    var conn = mongoose.createConnection(config.dbconnection.db);

    conn.once('open', function () {

        var gfs = Grid(conn.db, mongoose.mongo);

        var bufs = [];
        var readstream = gfs.createReadStream({ _id: id });

        readstream
            .on("data", function (chunk) {
                bufs.push(chunk);
            })
            .on('end', function () { // done

                var fbuf = Buffer.concat(bufs);

                var base64 = (fbuf.toString('base64'));

                res.jsonp({
                    data: base64
                });
            })
			.on('error', function () {
               res.send(500);
            });

    });

};


exports.getClinicLocation = function (req, res) {
    var username = req.params.currentusername;
    Practice.find({ "practicename": username }).exec(function (err, response) {
        if (err) res.send(500, 'Error Occured');
        else {
            res.send([{
                clinicLocation: response
            }]);
        }
    });
};

exports.getStampofApproval = function (req, res) {
    Practice.findOne({ practicename: req.params.practicename }, { stampapproval: 1 }).exec(function (err, user) {
		if(err)
			return res.send(500);
		else
			return res.send(user);
    });
};

exports.updateCustomReportPricing = function (req, res, next) {

    var practiceId = req.body._id;

    var options = {
        practiceId: practiceId,
        pricingtype: req.body.pricingtype,
        reportpricing: req.body.reportpricing
    };

    Practice.update({ _id: options.practiceId }, {
        $set: {
            'pricingtype': options.pricingtype,
            'reportpricing': options.reportpricing,
        }
    }).exec(function (err, result) {

        if (err) return res.send(500);
        else return res.send(200);
    });
};

exports.getUserList= function(req,res){

	var page = (req.body.pagenum > 0 ? req.body.pagenum : 1) - 1;
    var perPage = 9;
    var options = {
        perPage: perPage,
        page: page
    }
	var query={};

	query=[{$match: {'practice.name': req.body.practicename}},
	       {$unwind: '$practice'},
	       {$match: {'practice.name': req.body.practicename}}
		  ]


	User.aggregate(query,function (err, count) {
		if (err)
			return res.send(500);
		else
		{
			query.push({ $skip : options.perPage * options.page });
			query.push({ $limit : options.perPage })

			User.aggregate(query,function (err, users) {
				if (err){
						return res.send(500);
					}
				else{
						res.jsonp({
							userdata: users,
							page: page + 1,
							pages: Math.ceil(count.length / perPage),
							totalitem: count.length
						});
					}
			});
		}
	})
};
