var mongoose = require('mongoose'),
    Patient = mongoose.model('Patient'),
    User = mongoose.model('User'),
    Practice = mongoose.model('Practice'),
    IncrementRecord = mongoose.model('IncrementRecord'),
	crypto = require('crypto');

	var athenahealthapi = require('../../athena-routes/helper-files/athenahealthapi')
	var events = require('events')


	var key = 'rs97qxku39p85qkny77y56hf';
	var secret = 'xv9J9WPDw74nU8E';
	var version = 'preview1';
	var practiceid = 1;
	
	var encryptionKey = process.env.ENCRYPTED_KEY;	

	//var api = new athenahealthapi.Connection(version, key, secret, practiceid);
	
	var api;
	var codeFileName='athenaPatient.js';
	
	var salt = crypto.randomBytes(16).toString('base64');
	
	// If you want to change which practice you're working with after initialization, this is how.
	
	// api.practiceid = 1
	
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
	
	function encryptPassword(password) {
        if (!password || !salt) return '';
        var salt2 = new Buffer(salt, 'base64');
        return crypto.pbkdf2Sync(password, salt2, 10000, 64).toString('base64');
		/*crypto.pbkdf2(password,salt2, 10000, 64, (err, derivedKey) => {
			if (err) throw err;
			return derivedKey.toString('base64');  
		});*/
    }
	
	function encryptPasswordFromSalt(pwd, existingSalt) {
        if (!pwd || !existingSalt) return '';
        var saltNew = new Buffer(existingSalt, 'base64');
        return crypto.pbkdf2Sync(pwd, saltNew, 10000, 64).toString('base64');
		/*crypto.pbkdf2(pwd,saltNew, 10000, 64, (err, derivedKey) => {
			if (err) throw err;
			return derivedKey.toString('base64');  
		});*/
    }
	
	function makeSalt() {
        return crypto.randomBytes(16).toString('base64');
    }
	
	

//api.status.on('ready', main)
/*api.status.on('error', function(error) {
	
})
*/

 function log_error(error) { 	
	//logAthenaDetails('',JSON.stringify(error));
 }


//get practice details from athena
exports.getPracticeDetails = function (req, res) {
	
	api.GET('/practiceinfo', {
		params: { 
			practiceid: 1
		}
	}).on('done', function(response) {
		res.send(200,response);
	}).on('error', log_error)	
}


//get patient details from athena by ID
exports.getAthenaPatientByID = function(req,res){	
	/*api.GET('/patients/'+req.query.patientid).on('done', function(response) {				
		res.jsonp({ PatientDetail : response});
	}).on('error', log_error)	
	*/
	
	api = new athenahealthapi.Connection(version, key, secret, req.query.practiceid);
	 
	api.GET('/patients/'+req.query.patientid,{
		params: { 
			practiceid: req.query.practiceid,
			departmentid : req.query.departmentid
		}
	}).on('done', function(response) {
		if(typeof response.error !='undefined'){
			var msg = response.error;
			if(typeof response.detailedmessage !='undefined'){
				msg= msg + " : " +response.detailedmessage; 
			}		
			//logAthenaDetails('getAthenaPatientByID', msg);	
			res.json(400, msg);
		}else{
			res.jsonp(200,{ PatientDetail : response});
		}		
	}).on('error', log_error)
}


//get patient details from athena by firstname, lastname, DOB
exports.getAthenaPatientList = function (req, res) {
	api = new athenahealthapi.Connection(version, key, secret, req.query.practiceid);
	
	api.GET('/patients', {
		params: { 
			practiceid: req.query.practiceid,
			dob: req.query.dob,
			firstname: req.query.firstname,
			lastname:req.query.lastname
		}
	}).on('done', function(response) {
		if(typeof response.error !='undefined'){
			var msg = response.error;
			if(typeof response.detailedmessage !='undefined'){
				msg= msg + " : " +response.detailedmessage; 
			}	
			//logAthenaDetails('getAthenaPatientList', msg);	
			res.json(400, msg);
		}else{
			res.json(200,{ patients : response });
		}		
	}).on('error', log_error)	
}


//check existance of athena patient into ratefast 
exports.checkAthenaPatientExistance = function(req,res){
	Patient.find({athena_patientid:req.query.patientid},{athena_patientid:1}).exec(function(err,patient){
		if(err){
			//logAthenaDetails('checkAthenaPatientExistance', JSON.stringify(err));
			res.json(400, err);
		}else{
			res.json(200,{patients : patient});
		}
	})
}

function getAthenaSocialHistory(query){
	
	return new Promise(function(resolve, reject) {
		api.GET('/chart/' + query.athena_patientid + '/socialhistory', {
			params: { 
				practiceid: query.practiceid,
				departmentid : query.departmentid
			}
		}).on('done', function(response) {  
			var social = '';
			if(typeof response != 'undefined'){
				if(typeof response.questions != 'undefined'){
					if(response.questions.length > 0){						
						response.questions.forEach(function(item){
						    if(item.key == "SMOKINGSTATUS"){
						    	var social = 'Positive for tobacco';
						    	resolve(social);
						    }
						})						
					}else{
						resolve(social);
					}
				}else{
					resolve(social);
				}
			}else{
				resolve(social);
			}
		}).on('error', log_error)
	  });
}

function getAthenaMedicalData(query){
	return new Promise(function(resolve, reject) {
		api.GET('/chart/' + query.athena_patientid + '/allergies', {		
			params: { 
				practiceid: query.practiceid,
				departmentid : query.departmentid
			}
		}).on('done', function(response) {  
			var allerge = '';
			if(typeof response != 'undefined'){
				if(typeof response.allergies != 'undefined'){
					if(response.allergies.length>0){
						
						var severity = '';
						var sectionnote='';
						var allergenname =''; 
						
						
						if(typeof response.allergies[0].reactions != 'undefined'){
							if(response.allergies[0].reactions.length>0){
								if(typeof response.allergies[0].reactions[0].severity != 'undefined'){
									if(response.allergies[0].reactions[0].severity != ''){
										severity = " (severity: "+response.allergies[0].reactions[0].severity+"). ";
									}                					
								}
							}
						}
					
					
					
						if(typeof response.allergies[0].allergenname != 'undefined'){
							allergenname = response.allergies[0].allergenname.charAt(0).toUpperCase() + response.allergies[0].allergenname.slice(1)
					
							if(severity ==''){
								allergenname = allergenname +".";
							}
						}
						
						
						if(typeof response.sectionnote != 'undefined'){
							sectionnote = response.sectionnote;
						}
						
						allerge = allergenname + severity +	sectionnote;	                			
						
						resolve(allerge);
											
					}else{
						resolve(allerge);
					}
				}else{
					resolve(allerge);
				}
			}else{
				resolve(allerge);
			}							
		}).on('error', log_error)
	  });
}


function newAthenaPatient(data){	
	return new Promise(function(resolve, reject) {
		 var pattern = 'RF-';
		    IncrementRecord.findOneAndUpdate(
		        { 'id': 'patientrecord' },
		        { "$inc": { "patientrecordno": 1 } },
		        { "upsert": true },
		       function (err, increment) {
		           if (err) 
					   return res.send(500)
		           else {
		               var recordnumber = increment.patientrecordno; // This value i get dynamically.
		               var patientrecordno = pattern + ('00000' + recordnumber).slice(-6);

		               var newPatient = new Patient(data.body);
		               newPatient.patientrecordno = patientrecordno;
		               newPatient.createdby = data.user.userInfo.username;
		               newPatient.createddate = Date.now();

		               newPatient.save(function (err, resp) {
		                   if (err) {
							   //logAthenaDetails('newAthenaPatient', JSON.stringify(err));		                       
		                       reject(err);
		                   } else
						   {                       	   
		                	   resolve(resp._id);
						   }                                  
		               });
		           }
		       });	
	})	
}



//insert athena patient into ratefast
exports.createAthenaPatient = function(req,res){
	var medicalQuery = {};
	
	medicalQuery.athena_patientid = req.body.athena_patientid;
	medicalQuery.departmentid = req.body.athena_departmentid;
	medicalQuery.practiceid = req.body.athena_practiceid;

	api = new athenahealthapi.Connection(version, key, secret, req.body.athena_practiceid);
	
	getAthenaMedicalData(medicalQuery).then(function(allergyMedicalHistory){
		
			req.body.medicalhistory[0].shknownallergiesothertext=allergyMedicalHistory;
									
			getAthenaSocialHistory(medicalQuery).then(function(socialdata){
				
				req.body.sh[0].chkTobacco=socialdata;
				
				newAthenaPatient(req).then(function(newPatientID){		 
					res.jsonp(200,{ newPatientID : newPatientID });
				}).catch(function (err) {		  					
		  			res.json(500, err);
			  	})
			}).catch(function(err){
				//logAthenaDetails('createAthenaPatient', JSON.stringify(err));				 			
	  			res.json(500, err);
			})		
		}).catch(function(err){
			//logAthenaDetails('createAthenaPatient', JSON.stringify(err));						
			res.json(500, err);
	})
}

exports.getOnlyMedicalSocialData = function(req,res){
        var medicalQuery = {};
        
        medicalQuery.athena_patientid = req.query.patientid;
        medicalQuery.departmentid = req.query.departmentid;
        medicalQuery.practiceid = req.query.practiceid;
        
        api = new athenahealthapi.Connection(version, key, secret, req.query.practiceid);
        
        getAthenaMedicalData(medicalQuery).then(function(allergyMedicalHistory){
            
                getAthenaSocialHistory(medicalQuery).then(function(socialdata){                
                    var alleriesdata = {}
                        alleriesdata.medicalData = allergyMedicalHistory;
                        alleriesdata.socialData = socialdata;    
                    
                        res.json(200,{alleriesdata : alleriesdata})
                      
                }).catch(function(err){                            
                      res.json(400, err);
                })        
            }).catch(function(err){                        
                res.json(400, err);
        })
}

exports.addUserPracticeData = function(req,res){
  
    var dataupdate = req.body.practice[0]; 
	
	var pwd = String(req.body.password);
        
	 User.findById(req.body.userid, function (err, user) {        
	 
     if(err){
        return res.json(500, {msg : err}); 
     }
     else{                                                    
         if (pwd) {
			var data={};			 
           if (!user.authenticate(pwd)){                       
				data.comparison='not matched';
                return res.json(200, data);                  
           }
           else{    
				User.update({'username' : req.body.username}, {$set: {'hashedString': encrypt(req.body.password), "athena_username" : dataupdate.athena_username  } ,$push: {'practice': dataupdate } }).exec(function (err, result) {                
					if (err){						
						return res.json(500,'Update failed');
					}
					else { 
						data.comparison = 'matched';
						data.result = result;
						res.json(200,data);
					}
				})				                      
               }            
            }
         }
   });	
}

//insert athena user into ratefast
exports.createUser = function(req,res){
		
	var newpracticeUsers = new User(req.body);		
	newpracticeUsers.save(function (err,response) {
            if (err) {	
				//logAthenaDetails('createUser', JSON.stringify(err));			            	
            	res.json(500, err);
            }
            else {            	
            	res.json(200,{data : response});
            }
        });  	
}


// check exixtance of athena user into ratefast
exports.checkUserExistence = function(req,res){
	
	var data={};
	
	var athenaPracticeID = req.query.athena_practiceid; 
		
	Practice.find({'athena_practiceid': athenaPracticeID},{practicename:1,athena_practicename:1,athena_practiceid:1}).exec(function(err,practice){
		if(err){
			return res.json(400, err);
		}else{
			if(practice.length>0){
				//get practice data
				
				var practice = practice[0];
				var newUsername = practice.practicename+'_'+req.query.username;
				
				User.find({'username' : newUsername, 'practice.athena_practiceid': athenaPracticeID }).exec(function(err,user){
					if(err){
						//logAthenaDetails('checkUserExistence', JSON.stringify(err));						
						return res.json(500, err);
					}else{						
						if(user.length>0){
							data.user=user;
							var randomString;                                       
                            data.randomString= decrypt(user[0].hashedString);
												
							data.userResponseMsg = "user present";
							res.json(200,{data : data});
						}
						else
						{                           
                            //step 3 : check athena user existance against email
                            User.find({'email' : req.query.email}).exec(function(err,userDataByEmail){                                  
                                if(err){                                                                        
                                    return res.json(500, err);
                                }else{          
                                   
                                    if(userDataByEmail.length>0){
                                        
                                        var dataFlag = false;
                                        var dataindex = 0;
                                        var datacount = 0;
                                        
                                        for(var i=0; i<userDataByEmail[0].practice.length; i++){
                                            if(userDataByEmail[0].practice[i].athena_practiceid == athenaPracticeID){
                                                dataFlag = true;
                                                dataindex = i;                                              
                                            }
                                            datacount++;
                                        }                                                                                
                                        
                                        if(datacount == userDataByEmail[0].practice.length){
                                            if(dataFlag == true){                                                
                                                
                                                if(req.query.username==userDataByEmail[0].practice[dataindex].athena_username){
                                            		var tempUserData =  userDataByEmail;
	                                                tempUserData[0].practice = [userDataByEmail[0].practice[dataindex]];
	                                                                                                
	                                                var randomString;           
	                                                                                               
	                                                data.randomString= decrypt(userDataByEmail[0].hashedString);
																									
	                                                data.user = tempUserData;
	                                                data.userResponseMsg = "user present";
	                                                
	                                                res.json(200,{data : data});
                                            	}else{                                            			                                                
	                                                data.userResponseMsg = "Email id present against athena practice";	                                                
	                                                res.json(200,{data : data});
                                            	}
                                                                                                
                                            }else{
                                                
                                                //existingUserPracticename : for this we use [0] th name.. but if this [0]th is inactive then???
                                                var emailuserdata = {
                                                        firstname : userDataByEmail[0].firstname,
                                                        lastname : userDataByEmail[0].lastname,
                                                        email : userDataByEmail[0].email,
                                                        username : userDataByEmail[0].username, //req.query.username,
                                                        password : 'dummypassword',
                                                        athena_departmentid : req.query.athena_departmentid,
														existingUserPracticename:userDataByEmail[0].practice[0].name,
														userid: userDataByEmail[0]._id														
                                                    }
                                    
                                                //check role here...non admin 
                                                var emailpracticedata = {
                                                                    "name" : practice.practicename,
                                                                    "role" : "nonadmin level4",
                                                                    "rolename" : "nonadmin",
                                                                    "level" : "level4",
                                                                    "status" : "active",
                                                                    "stampapproval" : "off",
                                                                    "athena_practiceid" : athenaPracticeID,
                                                                    "athena_practicename" : practice.athena_practicename,
																	"athena_username" : req.query.username
                                                                }
                                            
                                                //user data ready to insert
                                            
                                                emailuserdata.practice = [emailpracticedata];                                           
                                                data.user= emailuserdata;                                               
                                                data.userResponseMsg = "Email id not present against athena practice";
                                                
                                                //pass user datails to frontend. 
                                                res.json(200,{data : data});    
                                                
                                            }
                                        }
                                        
                                        
                                    }else
									{
										//Neither username nor email id is present in the system, hence create a fresh athena user
                                        var userdata = {
												firstname : req.query.firstname,
												lastname : req.query.lastname,
												email : req.query.email,
												username : newUsername,
												password : 'dummypassword',
												athena_departmentid : req.query.athena_departmentid
											}
							
											var practicedata = {
										            "name" : practice.practicename,
										            "role" : "nonadmin level4",
										            "rolename" : "nonadmin",
										            "level" : "level4",
										            "status" : "active",
										            "stampapproval" : "off",
													"athena_practiceid" : athenaPracticeID,
													"athena_practicename" : practice.athena_practicename,
													"athena_username" : req.query.username
										        }
							
											//user data ready to insert
											userdata.practice = [practicedata];
											
											data.userResponseMsg = "user not present";
											data.user= userdata;
											
											
											//pass user datails to frontend. 
											res.json(200,{data : data});	   
                                    }   
                                }
                            })                                                      
                        }
					}
				})				
			}else{
				data.userResponseMsg = "Athena practice account does not exist";
				res.json(200,{data : data});
			}
		}
	}) 	
}


exports.getPasswordbyUsername = function (req, res, next) {
    User.findOne({username: req.query.username, 'practice.name': req.query.practicename}, function (err, user) {
        if (err)
		{
			//logAthenaDetails('getPasswordbyUsername', JSON.stringify(err));
			return next(new Error('Failed to load User'));
		}								
		
        if (user) {
			var randomString;			
			
			randomString= decrypt(user.hashedString);	 
			
            res.send(200, { randomString: randomString });
        } else {
            res.send(404, 'USER_NOT_FOUND');
        }
    });
};


exports.getMedications = function(req,res){

	api = new athenahealthapi.Connection(version, key, secret, req.query.athena_practiceid);
	
	api.GET('/chart/' + req.query.athena_patientid + '/medications', {		
		params: { 
			practiceid: req.query.athena_practiceid,
			departmentid : req.query.athena_departmentid
		}
	}).on('done', function(response) {
		if(typeof response.error !='undefined'){
			var msg = response.error;
			if(typeof response.detailedmessage !='undefined'){
				msg= msg + " : " +response.detailedmessage; 
			}
			//logAthenaDetails('getMedications', JSON.stringify(msg));
			res.json(400, msg);
		}else{
			res.json(200,{ medicationData : response });
		}		
	}).on('error', log_error)	
}

exports.getPatientChanged = function(req,res){
	api = new athenahealthapi.Connection(version, key, secret, req.query.athena_practiceid);	
	api.GET('/patients/changed',{
		params:{
			practiceid: req.query.athena_practiceid
		}
	}).on('done', function(response){
		if(typeof response.error !='undefined'){
			var msg = response.error;
			if(typeof response.detailedmessage !='undefined'){
				msg= msg + " : " +response.detailedmessage; 
			}		
			//logAthenaDetails('getPatientChanged', JSON.stringify(msg));	
			res.json(400, msg);
		}else{			
			res.json(200,{ patients : response.patients });
		}	
	}).on('error', log_error)
}

exports.updateAthenaPatient = function(req,res){
    api = new athenahealthapi.Connection(version, key, secret, req.body.practiceid);
    
    api.PUT('/patients/'+ req.body.patientid,{
        params : req.body
    }).on('done', function(response){
       
        if(typeof response.error !='undefined'){            
            var msg = response.error;
            if(typeof response.detailedmessage !='undefined'){
                msg= msg + " : " +response.detailedmessage; 
            }    
			//logAthenaDetails('updateAthenaPatient', JSON.stringify(msg));	
            res.json(400, msg);
        }else{            
            res.json(200,{ updatedpatient : response });
        }    
    }).on('error', log_error)
}
