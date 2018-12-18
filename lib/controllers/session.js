'use strict';

var mongoose = require('mongoose'),
    practicecollection = mongoose.model('Practice'),
    User = mongoose.model('User'),
    mail = require('./mail'),
    crypto = require('crypto'),
	uid = require('uid2'),
    LocalStrategy = require('passport-local').Strategy,
    passport = require('passport'),
    practice = require('../practice'),
    config = require('../config/config'),
    auditlog = require('./auditlog');
	

	var logger = require('../config/logger');


var SALT_WORK_FACTOR = 10;

/**
 * Logout
 */
exports.logout = function (req, res) {
    if (req.user) {
        auditlog.signoutevent(req.user.userInfo, req.sessionID);
    }
    req.logout();
    req.session={};
	res.clearCookie('session', { path: '/' });
    res.clearCookie('session.sig', { path: '/' });
    res.send(200);
};


/**
 * CheckCredentails for forgot password /username
 */

exports.checkcredentails = function (req, res) {
   
    var practicename = String(req.body.practicename);
    var email = String(req.body.email);
    var forgotuser = Boolean(req.body.forgotuser);
    var username = String(req.body.username);
    var password = String(req.body.password);
    var securityquestion = String(req.body.securityquestion);
    var answer = String(req.body.answer);
    //Validate user by his email id and practice
    User.findOne({'email': email, 'practice': {$elemMatch: {'name': practicename, 'status': 'active'}} }).exec(function (err, user) {
        if (err) return res.json(401, err);
       
        //User not found
        if (!user) return res.json(401, "Invalid Credentials");
        
        //invalid password if forgot username

        if (password) {
            
            if (!user.authenticate(password)) return res.json(401, "Invalid Credentials");
        }
        else {
           
            if (user.username != username) return res.json(401, "Invalid Credentials");
        }
       
        //invalid question and answer
        if ((user.question != securityquestion) || (user.answer != answer)) return res.json(401, "Invalid Credentials");
        //send him mail
        if (password) {
           
            var locals = {
                to: email
            }
            var placeholders = {
                username: user.username
            }

            mail.sendMailMsg('ForgotUsername', locals, placeholders, function (err, result) {
                
                //if (err) res.render('error', {status: 500});
				if (err) res.send(500);//Changed by Unais
            });
        }
        else {
           

            mail.sendMailMsg('ForgotPassword', { to: email }, { link: process.env.EMAIL_URL + '/confirmpassword/' + user._id }, null, function (err, result) {
                //if (err) res.render('error', {status: 500});
				if (err) res.send(500);//Changed by Unais 
                User.update({'email': email }, {'resetpwddateExpire': new Date() }).exec(function (err, result) {
                    if (err) return res.send(500);
                });
            });
        }

        return res.send(200);

    });
};


/**
 * CheckCredentails for forgot password
 */
exports.checkcredentailspassword = function (req, res) {

    var practiceName = String(req.body.practicename);
    var email = String(req.body.email);
    var userName = String(req.body.password); //username

    // check if credentials are Ok
    // role:superadmin, make sure that user is changing his own credentials
    // todo : include password column

    User.find({'email': email, 'username': userName, 'practice': {$elemMatch: {'name': practiceName, 'status': 'active', 'role': 'superadmin' }} }).exec(function (err, result) {
        if (err) return res.json(401, err);
        if (result.length == 1) {

            return res.send(200);
        }
        else {

            return res.send(401);
        }

    });

};

exports.checkUserRoles = function (roles) {
    return function (req, res, next) {
       
        if (req.user != null) {
           
            for (var i = 0; i < req.user["practice"].length; ++i) {
                var person_i = req.user.practice[i];

                if (person_i["name"] == req.user.practicename && person_i["status"] == "active" && roles.indexOf(person_i["role"]) != -1) {
                    // found ! do something with 'person_i'.
                    return next();
                    break;
                }
            }
            res.send(401, "You are not authorised");
        }
    };
};

/**
 * CheckAnswer for forgot password/username
 */
exports.verifyanswer = function (req, res) {

    var question = String(req.body.question);
    var answer = String(req.body.answer);
    var email = String(req.body.email);
    var flg = String(req.body.flg);

    // Set locals object
    var locals = {
        to: email
    };

    // check both question and answer based on unique email id
    User.find({'question': question, 'answer': answer, 'email': email }).exec(function (err, result) {
        if (err) return res.json(401, err);
        if (result.length == 1) {
            // Set placeholders object

            // if flg = 1 then it is forgot username
            if (flg == 1) {
                var placeholders = {
                    username: result[0].username
                };
                //send mail
                mail.sendMailMsg('ForgetUsername', locals, placeholders);
            }

            else {
                var placeholders = {
                    link: "http://127.0.0.1:9000/confirmpassword/" + result[0]._id
                };
                //send mail
                mail.sendMailMsg('ForgetPassword', locals, placeholders);
                //if mail is sent update field in user collection
                User.update({'email': email }, {'resetpwddateExpire': new Date() }).exec(function (err, result) {
                    if (err) return res.send(401);
                    else return res.send(200);
                });

            }

            return res.send(200);
        }
        else {
            return res.send(401);
        }

    });

};


/**
 * check status of parctice account
 */
exports.checkaccountstatus = function (req, res) {

    var practiceId = req.params.activateid;
   
    practicecollection.find({'_id': practiceId, 'status': 'registered' }).exec(function (err, result) {
       
        if (err) return res.json(500, err);
        // if registered make it active and redirect to login page
        if (result.length == 1) {

            practicecollection.update({ '_id': practiceId }, {'status': 'active'}).exec(function (err, result) {

                if (err) return res.json(500, 'Internal Error');
                else return res.json(200, 'You have successfully activated your account');
            });
        }
        else {
            return res.json(500, 'Link broken');
        }

    });
};



var _this=this;

// Athena changes (Added parameter "isAthenaValue")
_this.passwordExpiryhandler = function (req,res,user, isAthenaValue ,callback) {
	// added by shridhar 10Feb 2017    
	// Athena changes
	if(!isAthenaValue){
		var todaysDate= new Date(); // todays date
		var getPWDchangeDate=user.passwordchangedate; // last password change date	            
		var locals = { to: String(user.email) };
		
		// difference between todays date and last password change date	        
		var diffdays=Math.round((todaysDate-getPWDchangeDate)/(1000*60*60*24));

		var ExpiryDate = getPWDchangeDate;
		
		if(diffdays >= 60 ){
			// if diff > 60 then we want to send expiry date to user	    		
			if(diffdays < 90){
				ExpiryDate.setDate(ExpiryDate.getDate() + 90); 
				var dd = ExpiryDate.getDate();
				var mm = ExpiryDate.getMonth()+1; 
				var yyyy = ExpiryDate.getFullYear();

				if(dd<10){
					dd='0'+dd;
				} 

				if(mm<10){
					mm='0'+mm;
				} 
				ExpiryDate = mm+'/'+dd+'/'+yyyy;	    	 		    		    	
					
				
			}
			var sendLink = process.env.EMAIL_URL + "/login";
				
				//email_url here   change it   
				
				var placeholders = {
						link : sendLink,
						expirydate : ExpiryDate
				}
			var passwordEmailAlert={};
			if(typeof user.passwordEmailAlert==undefined){
				passwordEmailAlert={"day60Sent" : false,"day83Sent" : false,"expiredSent" : false}
			}else{
				
				passwordEmailAlert.day60Sent=typeof user.passwordEmailAlert.day60Sent==undefined ? false : user.passwordEmailAlert.day60Sent;
				passwordEmailAlert.day83Sent=typeof user.passwordEmailAlert.day83Sent==undefined ? false : user.passwordEmailAlert.day83Sent;
				passwordEmailAlert.expiredSent=typeof user.passwordEmailAlert.expiredSent==undefined ? false : user.passwordEmailAlert.expiredSent;
				
			}

			var emailtemp=null;
			if(diffdays >= 90 && passwordEmailAlert.expiredSent==false){	    		
				var emailtemp ='passwordExpireToday';
				var objSet={'passwordEmailAlert.expiredSent':true };
			}else if(diffdays >= 83 && diffdays < 90 && passwordEmailAlert.day83Sent==false){
				var emailtemp ='passwordExpire7days';
				var objSet={'passwordEmailAlert.day83Sent':true }; 
			}else if(diffdays >= 60 && diffdays < 83 && passwordEmailAlert.day60Sent==false){
				var emailtemp ='passwordExpire30days';
				var objSet={'passwordEmailAlert.day60Sent':true }; 
			}
			if(emailtemp!=null){
				mail.sendMailMsg(emailtemp,locals, placeholders,function(err){
					
				});
				 User.update({ _id: user.id }, { $set: objSet}).exec(function (err, result) {
						if (!err){	
							callback(req,res,true);	
						}else{	   		        	  	   		         	
						   callback(req,res,false);	   		        	   	
						}
					});
			}else{
				callback(req,res,true);
			}
		}else{
			
			//the password inst expired yet so login proceed
			callback(req,res,true);
		}
	}
	else{		
    	//the password inst expired yet so login proceed
    	callback(req,res,true);
    }
}

exports.login = function (req, res, next) {

    passport.authenticate('local', function (err, user, info) {
        var error = err || info;
        if (error) {
            // PSHA: 26th June 2016: Error Logging
            var path = 'Inside "session.js exports.login-> passport.authenticate"';
            //auditlog.loggingError(req, error);

			logger.error('[session/login/lm. 328]' + JSON.stringify(error));

            return res.json(401, error);
        }
		
			logger.info('[session/login] authenticated');
	        user.practicename = String(req.body.practicename);
	        req.logIn(user, function (err) {
            
            if (err) {
                // PSHA: 26th June 2016: Error Logging
                var path = 'Inside "session.js exports.login-> req.logIn"';
                //auditlog.loggingError(req, err, path);

				logger.error('[session/login/lm. 340]' + JSON.stringify(error));
                return res.send(err);
            }            		
			
			// Athena changes
            Practice.find({practicename:user.practicename}).select({practicename : 1,  kickstart_page : 1, kickstart_url: 1, enable_docx_footer: 1, enable_docx_header: 1, enable_report_docx_header_dfr: 1, enable_report_docx_header_pr2: 1, enable_report_docx_header_pr4: 1, enable_report_docx_footer_dfr: 1, enable_report_docx_footer_pr2: 1, enable_report_docx_footer_pr4: 1, enable_ws_docx_header_dfr: 1, enable_ws_docx_header_pr2: 1, enable_ws_docx_header_pr4: 1, enable_ws_docx_footer_dfr: 1, enable_ws_docx_footer_pr2: 1, enable_ws_docx_footer_pr4: 1, practicename2: 1,irsnumber: 1,rfadetails: 1, session_timeout: 1, logout_warning_seconds: 1, report_autosave : 1, isAthena : 1, athena_practiceid:1  }).exec(function (err, practices) {
			
                if (!err) {					
                    auditlog.signinevent(req);                   
                    //shridhar line                   
					if(practices)
					{	
						if(practices.length>0){							
							var newData={};
							newData=req.user.userInfo;
							newData.practiceDetails=practices[0];							
							req.session.passport.user.practiceDetails=practices[0];
						}
						// Athena changes
						var isAthenaValue = typeof practices[0].isAthena == 'undefined' ? false : practices[0].isAthena;
						// Athena changes
						
						_this.passwordExpiryhandler(req,res,user, isAthenaValue ,function(req,res,isExpired){
							res.json(newData);
						});
					}                    
                } else {

                    return res.json(401, "Unauthorized");
                }
            });
        });
    })(req, res, next);
};



/**
 * Login : Called after middleware practice is called
 */
exports.loginOauth = function (req, res, next) {

    passport.authenticate('local', function (err, user, info) {

        var error = err || info;
        if (error) {
            // PSHA: 26th June 2016: Error Logging
            var path = 'Inside "session.js exports.login-> passport.authenticate"';
            //auditlog.loggingError(req, error);
			logger.error('[session/loginOauth/lm. 390]' + JSON.stringify(error));
            return res.json(401, error);
        }
        user.practicename = String(req.body.practicename);
        req.logIn(user, function (err) {
            
            if (err) {
                // PSHA: 26th June 2016: Error Logging
                var path = 'Inside "session.js exports.login-> req.logIn"';
                //auditlog.loggingError(req, err, path);
				logger.error('[session/loginOauth/lm. 400]' + JSON.stringify(error));
                return res.send(err);
            }
            auditlog.signinevent(req);
						next();
        });
    })(req, res, next);
};


