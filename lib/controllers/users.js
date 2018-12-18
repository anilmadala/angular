'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    crypto = require('crypto'),
    passport = require('passport'),
    IncrementRecord = mongoose.model('IncrementRecord'),
    config = require('../config/config');
	var mail = require('./mail');

var Grid = require('gridfs-stream'),
    fs = require('fs');
	
	var encryptionKey = process.env.ENCRYPTED_KEY;	
	
	function encrypt(text) {		
		if (text === null || typeof text === 'undefined') { return text; };
		var cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
		var crypted = cipher.update(text,'utf8','hex');
		crypted += cipher.final('hex');				
		return crypted;
	} 

	function decrypt(text) {		
		if (text === null || typeof text === 'undefined') {return text;};
		var decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
		var dec = decipher.update(text,'hex','utf8');
		dec += decipher.final('utf8');
			
		return dec;
	}

/**
 * Create user
 */
exports.create = function (req, res, next) {
    var newUser = new User(req.body);
    newUser.provider = 'local';
    newUser.save(function (err) {
        if (err) {
            // Manually provide our own message for 'unique' validation errors, can't do it from schema
            if (err.errors.email.type === 'Value is not unique.') {
                err.errors.email.type = 'The specified email address is already in use.';
            }
            return res.json(400, err);
        }
        req.logIn(newUser, function (err) {
            if (err) return next(err);
            return res.json(req.user.userInfo);
        });
    });
};


/**
 *  Get profile of specified user
 */
exports.show = function (req, res, next) {
    var userId = req.params.id;

    User.findById(userId, function (err, user) {
        if (err) return next(new Error('Failed to load User'));

        if (user) {
            res.send({ profile: user.profile });
        } else {
            res.send(404, 'USER_NOT_FOUND');
        }
    });
};

exports.getCurrentloggedinUserData = function (req, res) {
    var userId = req.params.userid;
    var select = { hashedPassword: 0, salt: 0, question: 0, answer: 0 };

    if (req.user.userInfo.role.trim().toLowerCase() == "siteadmin") {
        var query = { _id: userId };
    }
    else {
        query = { _id: userId, 'practice': { $elemMatch: { 'name': req.user.practicename, 'status': 'active' } } };
    }

    User.find(query, select).exec(function (err, result) {
        if (err) res.send(500, 'Failed to load User');
        if (result) {
            res.jsonp([
                    {
                        userData: result
                    }
            ]);
        }
    });
};


exports.updateUser = function (req, res) {
    var currentuserrole = req.user.userInfo.rolename.trim().toLowerCase();
    var currentpractice = req.user.userInfo.practicename.trim().toLowerCase();
    var rolenameCur = '';
    var practiceArray = req.body.data.practice;

    //set role of Admin and Non Admin by concating the role and level
    for (var i = 0; i < req.body.data.practice.length; i++) {

        var rolename = req.body.data.practice[i].rolename;
        var level = req.body.data.practice[i].level;

        if (rolename == 'admin' || rolename == 'nonadmin') {
            practiceArray[i].role = rolename + ' ' + level;
        } else {
            practiceArray[i].role = practiceArray[i].rolename;
        }
		
        if (practiceArray[i].name == currentpractice) {
            rolenameCur = practiceArray[i].rolename;
			
        }
    }
    function proUpdate() {
        var userId = req.body.id;
        var otherprofessiontext = req.body.data.otherprofessiontext ? req.body.data.otherprofessiontext : '';


        if (!req.body.data.usernpinumber) {
            req.body.data.usernpinumber = '';
        }
        if (!req.body.data.userphonenumber) {
            req.body.data.userphonenumber = '';
        }
        if (!req.body.data.userextension) {
            req.body.data.userextension = '';
        }

        var options = {
            id: userId,
            firstname: req.body.data.firstname,
            lastname: req.body.data.lastname,
            profession: req.body.data.profession,
            licensenumber: req.body.data.licensenumber,
            practice: practiceArray,
            speciality: req.body.data.speciality,
            professionothertext: otherprofessiontext,
            usernpinumber: req.body.data.usernpinumber,
            //shridhar 27 oct 2015 as per client new requirement -- add phone number n extension
            userphonenumber: req.body.data.userphonenumber,
            userextension: req.body.data.userextension
        };
        var updateobj = {
            'firstname': options.firstname,
            'lastname': options.lastname,
            'profession': options.profession,
            'licensenumber': options.licensenumber ? options.licensenumber : '',
            'speciality': options.speciality,
            'otherprofessiontext': options.professionothertext ? options.professionothertext : '',
        }
    
        updateobj.practice = options.practice;
        
        if (req.user.userInfo.role.trim().toLowerCase() == "siteadmin" || req.user.userInfo.role.trim().toLowerCase() == "superadmin" || req.user.userInfo.rolename.trim().toLowerCase() == "admin") {
            updateobj.usernpinumber = options.usernpinumber;
            updateobj.userphonenumber = options.userphonenumber;
            updateobj.userextension = options.userextension;
            User.update({ _id: options.id }, {
                $set: updateobj
            }).exec(function (err, result) {
                if (err) {


                    return res.send(500);
                }
                else { return res.send(200); }
            });
        }
        else {
            if ((req.user.userInfo.rolename.trim().toLowerCase() == "nonadmin" || req.user.userInfo.rolename.trim().toLowerCase() == "rater1" || req.user.userInfo.rolename.trim().toLowerCase() == "rater2") && req.user.userInfo.id == options.id) {
                User.update({ _id: options.id }, {
                    $set: updateobj
                }).exec(function (err, result) {
                    if (err) return res.send(500);
                    else return res.send(200);
                });
            }
        }
    }
    if (currentuserrole == 'siteadmin') {
       
        proUpdate();
    }
   
    if (currentuserrole == 'superadmin') {
      
        if (rolenameCur == "admin" || rolenameCur == "nonadmin" || rolenameCur == "superadmin") {
            
            proUpdate();
        } else {
            
            return res.json(500, { 'message': 'You do not have the required permission.', 'id': req.body.id });
        }
    }
    if (currentuserrole == 'admin') {
        
        if (rolenameCur == "admin" || rolenameCur == "nonadmin") {
           
            proUpdate();
        } else {
           
            return res.json(500, { 'message': 'You do not have the required permission.', 'id': req.body.id });
        }
    }
    if (currentuserrole == 'nonadmin') {
        if (rolenameCur == "nonadmin") {
           proUpdate();
        }else{
            return res.json(500, { 'message': 'You do not have the required permission.', 'id': req.body.id });
        }
    }
    if (currentuserrole == 'rater1') {
       if (rolenameCur == "rater2") {
           proUpdate();
        }else{
            return res.json(500, { 'message': 'You do not have the required permission.', 'id': req.body.id });
        }
    }
    if (currentuserrole == 'rater2') {
        if (rolenameCur == "rater2") {
           proUpdate();
        }else{
            return res.json(500, { 'message': 'You do not have the required permission.', 'id': req.body.id });
        }
    }
};

/**
 * CheckCredentails for forgot username 
 */
exports.checkcredentails = function (req, res) {

    var practiceName = String(req.body.practicename);
    var email = String(req.body.email);
    var userPass = String(req.body.password);

    var puser = new User(req.body);
    // check if credentials are Ok
    // role:superadmin, make sure that user is changing his own credentials
    // todo : include password column
    //todo : whether to include role as superadmin

    User.find({ 'email': email, 'practice': { $elemMatch: { 'name': practiceName, 'status': 'active' } } }, function (err, user) {
        
        if (err) return res.json(401, err);
        if (user.length == 1) {
            //check password          
            puser.validPassword(userPass, function (err, result) {
                if (err) return res.send(401);
                else {

                    if (result == false) {
                        res.send(401);
                    }
                    else {

                        res.send(200);
                    }
                }
            });

        }
        else {
            return res.send(401);
        }

    });

};



/**
 * Change password : for reset pwd user & password expired
 */
exports.changePassword = function (req, res, next) {
    var userId = req.body.id;
    
    var updatePasswordToDatabase = function (user,newPasswordVerify){
   		//encrypt password
			 	var newPwd = new User({
			     	hashedPassword: '',
			     	salt:'',
					hashedString: ''
			     });
		     
			 	user.save(function (err) {
		            if (err) {
		                res.send(500, err);
		            }else{
		            	newPwd.password=req.body.password;
				 	
				 		var passwordEmailAlert={"day60Sent" : false,"day83Sent" : false,"expiredSent" : false};  

				 		User.update({ _id: req.body.id }, { $set: {'hashedPassword': newPwd.hashedPassword,'salt':newPwd.salt, 'hashedString': newPwd.hashedString }, 'passwordchangedate': new Date(), 'passwordEmailAlert':passwordEmailAlert, $push:{'oldpasswords':{$each: [ newPasswordVerify ],$slice: -5}}}).exec(function (err, result) {
					 		if (!err){
						 		//send mail to user for password change notification   		 			
						 		// passwordChangeNotification('passwordchangeAlert',user)
						 		res.json({validpassword:'change'});	   		         	  
				         	}
				           else{	   		        	  	   		         	
				         		return res.send(500);	   		        	   	
				         	}
				 		});		 		
		            }
		        });		 		
   	}	
    
    User.findById(userId, function (err, user) {
       // user.password = Pass;
        user.isresetpwdExpire = false;
        user.resetpwddateExpire = new Date();
        user.passwordchangedate =  new Date();
		user.passwordEmailAlert={"day60Sent" : false,"day83Sent" : false,"expiredSent" : false};
        
		var newPasswordVerify = encrypt(req.body.password);	 
		
		
		if(typeof user.oldpasswords !='undefined'){
        	if(user.oldpasswords.length>0){            	
            			// loop to check password is repeating or not
	            		 var blnCheckRepeat=false;
	            		 user.oldpasswords.forEach(function(oldPassword_value) { 
	         				if(newPasswordVerify==oldPassword_value){			      			         					
	         					blnCheckRepeat=true;
	         				}
	     				});
	            	   
	            	   if(blnCheckRepeat){
	            		  
	            		   res.json({validpassword:'repeat'});   // status : repeat :- New password is one of the last five passwords
	            	   }else{
	            		   updatePasswordToDatabase(user,newPasswordVerify);
	            	   }			            	          				            	  
        	}else{
        		updatePasswordToDatabase(user,newPasswordVerify);
        	}			            	
    	}else{
    		updatePasswordToDatabase(user,newPasswordVerify);
    	}
    });
};

exports.list = function (req, res) {
    
    //check user role
    //if user role is siteadmin then var query = {}
    //if user role is superadmin then var query = {practice: req.user.practicename
    var page = (req.param('pagenum') > 0 ? req.param('pagenum') : 1) - 1
    var perPage = 9;
    var options = {
        perPage: perPage,
        page: page
    };
   
    if (req.user.userInfo.rolename != 'siteadmin') {
        var query = { 'practice': { $elemMatch: { 'name': req.user.userInfo.practicename } } };
    } else {
        var query = {};
    }
    var select = { hashedPassword: 0, salt: 0, question: 0, answer: 0 };
   

    User.list(query, select, options, function (err, users) {
        if (err) 
			//return res.render('500')
			return res.send(500);//Changed by Unais
        User.count(query).exec(function (err, count) {
            res.jsonp([{
                title: 'UsersList',
                usersList: users,
                page: page + 1,
                pages: Math.ceil(count / perPage),
                totalitem: count
            }]);
        })
    })
};

/* Shridhar code for new user search */
exports.usersSearch = function (req, res, next) {
	
	var page = (req.body.pagenum > 0 ? req.body.pagenum : 1) - 1;
    var perPage = 24;
    var options = {
        perPage: perPage,
        page: page
    }
    var query={};
	
	 if(req.body.usernameFromPracticeProfile){  
    	
    	query=[{$project : { accounttype:1,firstname:1,lastname:1,email:1,username:1,licensenumber:1,_id:1,practice:1,speciality:1,profession:1,				usernpinumber: 1, userextension:1,userphonenumber:1, otherprofessiontext:1}},
    				{$match: {'username':req.body.usernameFromPracticeProfile}}
    		  ];
    }
    else
	{
		var searchPracticeText=req.user.userInfo.practicename.toLowerCase();
		if(typeof(req.body.searchId)!='undefined'){
			if(req.body.searchId!=""){	
				
				var searchText=req.body.searchId.toLowerCase();			
				var regexName={'$regex':req.body.searchId,$options:'i'};
				 if (req.user.userInfo.rolename != 'siteadmin') {
					 
					 query= [ {  $project : { accounttype:1,licensenumber:1,_id:1,practice:1,speciality:1,profession:1,usernpinumber: 1, userextension:1,userphonenumber:1, otherprofessiontext:1, firstname : {$toLower : "$firstname"},lastname : {$toLower : "$lastname"},username : {$toLower : "$username"},email : {$toLower : "$email"}} },
							   {  $match: {$and:[ { $or:[ {firstname:searchText},{lastname: searchText},{username: searchText},{email: searchText} ] },
														  { 'practice.name':searchPracticeText }
											   ] }                              
							  } ]				   
				 } else  {		
					 
					 
					 //start changes here for search by practice name
									 if(typeof(req.body.searchPracticename)!='undefined'){
										 query= [ {  $project : { accounttype:1,licensenumber:1,_id:1,practice:1,speciality:1,profession:1,usernpinumber: 1, userextension:1,userphonenumber:1, otherprofessiontext:1, firstname : {$toLower : "$firstname"},lastname : {$toLower : "$lastname"},username : {$toLower : "$username"},email : {$toLower : "$email"}} },
												   {  $match: {$and:[ { $or:[ {firstname:searchText},{lastname: searchText},{username: searchText},{email: searchText},{'practice.name': searchText} ] },
																			  { 'practice.name':req.body.searchPracticename.toLowerCase() }
																   ] }                              
												  } ]
									 }else{
												 query= [ {  $project : { accounttype:1,licensenumber:1,_id:1,practice:1,speciality:1,profession:1,userextension:1,usernpinumber: 1, userphonenumber:1, otherprofessiontext:1,firstname : {$toLower : "$firstname"},lastname : {$toLower : "$lastname"},username : {$toLower : "$username"},email : {$toLower : "$email"}} },
														   {  $match: {$or:[ {firstname:searchText},{lastname: searchText},{username: searchText},{email: searchText},{'practice.name': searchText} ] }                            
													} ]
											 }
										 }
					//end changes here for search by practice name
				 
				 
			}	
			else if (req.user.userInfo.rolename != 'siteadmin') {
							query=[{$project : { accounttype:1,firstname:1,lastname:1,email:1,username:1,licensenumber:1,_id:1,practice:1,speciality:1,profession:1,usernpinumber: 1, userextension:1,userphonenumber:1, otherprofessiontext:1}},
									 {$match: {'practice.name': searchPracticeText}}
								  ]
						}		
		}else if (req.user.userInfo.rolename != 'siteadmin') {   
						query=[{$project : { accounttype:1,firstname:1,lastname:1,email:1,username:1,licensenumber:1,_id:1,practice:1,speciality:1,profession:1,usernpinumber: 1, userextension:1,userphonenumber:1, otherprofessiontext:1}},
							   {$match: {'practice.name': searchPracticeText}}
							  ]
		}else{
			
			
			//start changes here for search by practice name
			if(typeof(req.body.searchPracticename)!='undefined'){    		
				query=[{$project : { accounttype:1,firstname:1,lastname:1,email:1,username:1,licensenumber:1,_id:1,practice:1,speciality:1,profession:1,usernpinumber: 1, userextension:1,userphonenumber:1, otherprofessiontext:1}},
					   {$match: {'practice.name': req.body.searchPracticename.toLowerCase()}}
					  ]	
			}else{
				query=[{$project : { accounttype:1,firstname:1,lastname:1,email:1,username:1,licensenumber:1,_id:1,practice:1,speciality:1,profession:1,usernpinumber: 1, userextension:1,userphonenumber:1, otherprofessiontext:1}}];
			}
			
			//end changes here for search by practice name
			
		} 
	
	}
    
	//get login user data
	var currentUserData={}
	currentUserData=[{$project : { accounttype:1,firstname:1,lastname:1,email:1,username:1,licensenumber:1,_id:1,practice:1,speciality:1,profession:1,usernpinumber: 1, userextension:1,userphonenumber:1, otherprofessiontext:1}},
			{$match: {'username': req.user.userInfo.username.toLowerCase()}}
	  ];
	
   // var select_col = { hashedPassword: 0, salt: 0, question: 0, answer: 0,resetpwddateExpire: 0,isresetpwdExpire:0 };
    //User.find(query,select_col).limit(options.perPage).skip(options.perPage * options.page).exec(function (err, users) {
       	
    //step 1 : get only total count
    // step 2 : get users with skip n limit
	User.aggregate(query,function (err, count) {
		if (err) 			
			return res.send(500);//Changed by Unais
		else
		{
			query.push({ $skip : options.perPage * options.page });
			query.push({ $limit : options.perPage })
			User.aggregate(currentUserData,function (err, dataCurrentuser) {
				if (err) 			
					return res.send(500);//Changed by Unais
				else
				{	
					User.aggregate(query,function (err, users) {    				    		
						if (err) 
							return res.send(500);
						res.jsonp({
							title: 'UsersList',
							usersList: users,
							page: page + 1,
							pages: Math.ceil(count.length / perPage),
							totalitem: count.length,
							loginCurrentUserdata : dataCurrentuser
						});
					})
				}
			})
		}
	});
};

/**
 * Get current user
 */
exports.me = function (req, res) {
    res.json(req.user || null);
};

exports.uniquename = function (req, res) {
    var uname = req.params.username;
    var options = {
        uname: uname
    }

    User.uniquename(options, function (err, users) {
        if (err) {
            /*res.render('error', {
                status: 500
            });*/
			res.send(500);//Changed by Unais
        } else {
            User.count().exec(function (err, count) {
                if (users == "")
                    res.send(true)
                else
                    res.send(false)
            })
        }

    })
};

exports.uniqueemail = function (req, res) {
    var uemail = req.params.email.toLowerCase();

    var options = {
        uemail: uemail
    }

    User.uniqueemail(options, function (err, users) {
        if (err) {
            /*res.render('error', {
                status: 500
            });*/
			res.send(500);//Changed by Unais
        } else {
            User.count().exec(function (err, count) {
                if (users == "")
                    res.send(true)
                else
                    res.send(false)
            })
        }

    })
};

exports.getInviteuserStatusLevel = function (req, res) {
    var uid = req.params.uid;
   
    User.find({ '_id': uid, 'practice': { $elemMatch: { 'name': req.params.pname } } }).lean(true).exec(function (err, user) {
        if (err) {
            res.jsonp(500, { message: 'error' });
        } else {
            if (user[0]) {
                if (user[0].practice) {
                   

                    for (var i = 0; i < user[0].practice.length; ++i) {
                        
                        var person_i = user[0].practice[i];
                        if (person_i.name == req.params.pname && person_i.status == 'invited') {
                            
                        }
                        else if (person_i.name == req.params.pname && person_i.status == 'active') {
                            return res.send(500, 'active');
                        }
                        else {
                            delete user[0].practice[i];
                            //user[0].practice[i].remove();
                        }
                    }
                    return res.send(user);
                }
            }
            else {
                res.jsonp(500, { message: 'error' });
            }
           
        }
    });
};

exports.invitedUsers = function (req, res) {
    var userId = req.body.id;

    if (!req.body.data.licensenumber) {
        req.body.data.licensenumber = '';
    }
	if(!req.body.data.userphonenumber)
	{
		req.body.data.userphonenumber='';
	}
	if(!req.body.data.userextension)
	{
		req.body.data.userextension='';
	}
	
	var newPasswordVerify = encrypt(req.body.data.password);	 
	var pwdAry=[];
	pwdAry.push(newPasswordVerify);

    User.update({ _id: req.body.data._id }, {
        $set: {
            'firstname': req.body.data.firstname,
            'lastname': req.body.data.lastname,
            'username': req.body.data.username,
            'speciality': req.body.data.speciality,
            'profession': req.body.data.profession,
            'email': req.body.data.email,
            //'practice':req.body.data.practice,
            'licensenumber': req.body.data.licensenumber,
            'answer': req.body.data.answer,
            'question': req.body.data.question,
            'otherprofessiontext': req.body.data.professionothertext ? req.body.data.professionothertext : '',
			//shridhar 27 oct 2015 as per client new requirement -- add phone number n extension
            'userphonenumber': req.body.data.userphonenumber,
            'userextension': req.body.data.userextension
        }
    }).exec(function (err, result) {
        if (err) {            
            return res.send(500);
        }
        else { return res.send(200); }
    });

    User.findById(req.body.data._id, function (err, user) {
		if (err) 			
			res.send(500, err);//Changed by Unais
		else
		{
			user.password = req.body.data.password;
			for (var i = 0; i < user.practice.length; i++) {
				var user_i = user.practice[i];
				if (user_i.status == 'invited' && user_i.name == req.body.data.practice[0].name) {
					user.practice[i].status = 'active';
					user_i.status = 'active';
				}
			}
			//password updatind
			user.save(function (err) {
				if (err) {                
					res.send(500, err);				
				}
				else
					res.send(200);
			});
		}

    });
};

exports.updateinvitedUsersStatus = function (req, res) {
    User.findById(req.params.id, function (err, user) {
		if (err) 			
			res.send(500, err);//Changed by Unais
		else
		{	
			for (var i = 0; i < user.practice.length; i++) {           
				var user_i = user.practice[i];
				if (user_i.status == 'invited' && user_i.name == req.body.data) {               
					user_i.status = 'active';
					user.save(function (err) {
						if (err) {                
							res.send(500, err);				
						}
						else
							res.send(200);
					})

				}
			}
		}
    });
};

exports.uploadLogo = function (req, res, next) {

    var userId = req.body.userId;
    var id = mongoose.Types.ObjectId();

    User.update({ _id: userId }, {
        $set: {
            'personalsignature': id
        }
    }).exec(function (err, result) {
        if (err) return res.send(500);
    });

    var conn = mongoose.createConnection(config.dbconnection.db);

    conn.once('open', function () {

        var tempfile = req.files.signature.path;
        var origname = req.files.signature.name;

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
        });

    });

};

exports.getusersData = function (req, res) {

    var practicename = req.params.currentuserid;
    
    /*following condition added by shridhar 4 Feb
	 * siteadmin rater 1,2 can see data of all patients
	 * rather than siteadmin, other user can see data of there practice only
	 */
    //here code in if & else-if is same....bcz siteadmin rater1 rater2 can access any data of any practice
    
    if(req.user.userInfo.role=='siteadmin' || req.user.userInfo.role=='rater1' || req.user.userInfo.role=='rater2'){
		User.find({ $and: [{ "practice.name": practicename, "practice.status": "active", 'practice.level': {$in:['level3','level4']} }] }, { firstname: 1, lastname: 1, _id: 1, profession: 1, otherprofessiontext: 1 }).sort({ 'firstname':1 }).exec(function (err, response) {
			if (err) res.send(500, 'Error Occured');
			else {	        	
				res.send([{
					userList: response
				}]);
			}
		});
    }
    else if(req.user.userInfo.practicename==practicename) {    	
		User.find({ $and: [{ "practice.name": practicename, "practice.status": "active", 'practice.level': {$in:['level3','level4']} }] }, { firstname: 1, lastname: 1, _id: 1, profession: 1, otherprofessiontext: 1 }).sort({ 'firstname':1 }).exec(function (err, response) {
			if (err) res.send(500, 'Error Occured');
			else {	        	
				res.send([{
					userList: response
				}]);
			}
		});
	}
    else{    
		res.send([{
			userList: []
        }]);
   	}
};

exports.getCurrentuserData = function (req, res) {
    var username = req.params.username;

    if (req.user.userInfo.role.trim().toLowerCase() == "siteadmin") {
        var query = { 'username': username };
    }
    else {
        query = { 'username': username, 'practice': { $elemMatch: { 'name': req.user.practicename, 'status': 'active' } } };
    }
   
    var select = { hashedPassword: 0, salt: 0, question: 0, answer: 0 };

    User.find(query, select).exec(function (err, response) {
        if (err) res.send(500, 'Error');
        else {
            res.send([{ userData: response }]);
        }
    });
};



exports.updateUserPaswword=function(req,res){		
	//this password use to check with old password
	var password = String(req.body.oldpassword);
	 User.findById(req.body.id, function (err, user) {		
	 if(err){
		return res.send(500);//Added by Unais
	 }
	 else{			 			 	 				 	
		 if (password) {           
            if (!user.authenticate(password)){			            
            	 return res.json({validpassword:'wrong'});	// status : wrong :- password entered is wrong             	
            }
            else{	            	            	 
            		var currentdate= new Date(); // todays date
	                var getPWDchangeDate=user.passwordchangedate; // last password change date	            
	                
	                // difference between todays date and last password change date
	            	var diffMins=Math.round((currentdate.getTime()-getPWDchangeDate.getTime())/60000); 
	            	
	            	var newPasswordVerify = encrypt(req.body.newpassword);	 
		            	
	            	if(typeof user.oldpasswords !='undefined'){
		            	if(user.oldpasswords.length>0){
			            	if(diffMins>30){    
			            			// loop to check password is repeating or not
				            		 var blnCheckRepeat=false;
				            		 user.oldpasswords.forEach(function(oldPassword_value) { 
				         				if(newPasswordVerify==oldPassword_value){			      			         					
				         					blnCheckRepeat=true;
				         				}
				     				});
				            	   
				            	   if(blnCheckRepeat){
				            		   
				            		   res.json({validpassword:'repeat'});   // status : repeat :- New password is one of the last five passwords
				            	   }else{
				            		   updatePasswordToDB(user,newPasswordVerify);
				            	   }			            	  
		            		}else{
			            		res.json({validpassword:'wait'});    // status : wait :- user should not allowed to change password agian within 30 minutes of last password change   
			            	}		            	   
		            	}else{
		            		updatePasswordToDB(user,newPasswordVerify);
		            	}			            	
	            	}else{
	            		updatePasswordToDB(user,newPasswordVerify);
	            	}	            	
             	}            
	        }
	 	}
    });
	 
	 
	 //mail function	 
	var passwordChangeNotification = function (templates,user) {
	    	
		var locals = {
			to: user.email
		};	        
	   
		var placeholders = {
			link: process.env.RATEFAST_EMAILID,
			ratefastPhoneNumber:process.env.RATEFAST_PHONENUMBER
		};
		
		mail.sendMailMsg(templates, locals, placeholders, function (err, result) {
			if(!err)	
				return true;
			else return false;
		});
	}
	   	    
	   	    
	var updatePasswordToDB = function (user,newPasswordVerify){
		//encrypt password
		var newPwd = new User({
			hashedPassword: '',
			salt:'',
			hashedString: ''
		 });
		 
		newPwd.password=req.body.newpassword;
		var passwordEmailAlert={"day60Sent" : false,"day83Sent" : false,"expiredSent" : false};	
		User.update({ _id: req.body.id }, { $set: {'hashedPassword': newPwd.hashedPassword,'salt':newPwd.salt, 'hashedString': newPwd.hashedString },'passwordchangedate': new Date(), 'passwordEmailAlert':passwordEmailAlert, $push:{'oldpasswords':{$each: [ newPasswordVerify ],$slice: -5}}}).exec(function (err, result) {
			if (!err){ 	   		        	  
			  //send mail to user for password change notification   		 		
			  passwordChangeNotification('passwordchangeAlert',user)
			  res.json({validpassword:'change'});	   		         	  
			}
		    else{	   		        	  	   		         	
				return res.send(500);	   		        	   	
			}
	   });
	}	   	    
}