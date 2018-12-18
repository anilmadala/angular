

var mongoose = require('mongoose'),
    Patient = mongoose.model('Patient'),
    IncrementRecord = mongoose.model('IncrementRecord'),
    Practice = mongoose.model('Practice'),
    User = mongoose.model('User'),
    Patientdata = mongoose.model('Patientreport');



var mongoose = require('mongoose'),
    Patient = mongoose.model('Patient'),
    IncrementRecord = mongoose.model('IncrementRecord'),
    Practice = mongoose.model('Practice'),
    User = mongoose.model('User'),
    Patientdata = mongoose.model('Patientreport');

var Client = mongoose.model('Client');
var Token = mongoose.model('Token');
var Code = mongoose.model('Code');
var validate = require('validator');
/**
 * Add New Patient
 */
var _this=this;
 exports.checkData=function(req, res,callback){
    var dt=req.body;
   
	var dtBasic=dt.basicinformation[0];
    var dtCont=dt.contactinformation[0];
    var dtAddress=dt.address[0];
    var dtDemographics=dt.demographics[0];
    var dtOccupation=dt.occupation[0];
    var dtEmergency=dt.emergencycontactinfo[0];

    if(!validate.isEmpty(dtBasic.firstname) && dtBasic.firstname!=null && !validate.isEmpty(dtBasic.gender) && dtBasic.gender!=null&& !validate.isEmpty(dtBasic.dateofbirth) && dtBasic.dateofbirth!=null && !validate.isEmpty(dtBasic.dateofdeath)  && dtBasic.dateofdeath!=null && !validate.isEmpty(dtBasic.lastname) && dtBasic.lastname!=null){
        if(validate.isAlpha(dtBasic.firstname) && validate.isAlpha(dtBasic.lastname)&& validate.isAlpha(dtBasic.gender)){
            if(dtBasic.gender=='Male' || dtBasic.gender=='Female'){
                if(validate.isDate(dtBasic.dateofbirth) && validate.isDate(dtBasic.dateofdeath )){
                    //check socialsecurityno
                    var message=[];
                    var isValidAll=true;
                   
                    if(!validate.isEmpty(String(dtBasic.socialsecurityno)) && dtBasic.socialsecurityno==null){
                        if(!validate.isNumeric(String(dtBasic.socialsecurityno))){
                            message.push("Please send socialsecurityno in correct format. It must be Number with 9 digits and cannot be null");
                            isValidAll=isValidAll && false;
                            //callback(req,res,false,"Please send socialsecurityno in correct format. It must be Number with 9 digits and cannot be null"); 
                        }
                    }
                     //check employeehandedness
                    if(!validate.isEmpty(String(dtBasic.employeehandedness)) && dtBasic.employeehandedness==null){
                        if(!dtBasic.employeehandedness=='Right' || !dtBasic.employeehandedness=='Left' || !dtBasic.employeehandedness=='Ambidextrous'){
                             message.push("Please send employeehandedness in correct format.Possible values Right, Left, Ambidextrous");
                            isValidAll=isValidAll && false;
                            //callback(req,res,false,"Please send employeehandedness in correct format.Possible values Right, Left, Ambidextrous"); 
                        }
                    }
                    
                    //check contactinfo email
                    if(!validate.isEmpty(String(dtCont.email)) && dtCont.email!=null){
                        if(!validate.isEmail(String(dtCont.email))){
                            message.push("Please send Contact email in correct format");
                            isValidAll=isValidAll && false;
                           // callback(req,res,false,"Please send Contact email in correct format."); 
                        }
                    }

                    //check contactinfo homephone
                    if(!validate.isEmpty(String(dtCont.homephone)) && dtCont.homephone!=null){
                        if(!validate.isNumeric(String(dtCont.homephone)) && !validate.isLength(String(dtCont.homephone,{min:10,max:10}))){
                            message.push("Please send Contact homephone in correct format.");
                            isValidAll=isValidAll && false;
                           // callback(req,res,false,"Please send Contact homephone in correct format."); 
                        }
                    }
                     //check contactinfo workphone
                    if(!validate.isEmpty(String(dtCont.cellphone)) && dtCont.cellphone!=null){
                        if(!validate.isNumeric(String(dtCont.cellphone)) && !validate.isLength(String(dtCont.cellphone),{min:10,max:10})){
                             message.push("Please send Contact cellphone in correct format.");
                            isValidAll=isValidAll && false;
                            //callback(req,res,false,"Please send Contact cellphone in correct format."); 
                        }
                    }
                     //check contactinfo workphone
                    if(!validate.isEmpty(String(dtCont.workphone)) && dtCont.workphone!=null){
                        if(!validate.isNumeric(String(dtCont.workphone)) && !validate.isLength(String(dtCont.workphone),{min:10,max:10})){
                            message.push("Please send Contact workphone in correct format.");
                            isValidAll=isValidAll && false;
                           // callback(req,res,false,"Please send Contact workphone in correct format."); 
                        }
                    }
                     //check contactinfo voicemailthirdradio
                    if(!validate.isEmpty(String(dtCont.voicemailthirdradio))){
                        if(!dtCont.voicemailthirdradio=='Yes' || !dtCont.voicemailthirdradio=='No'){
                             message.push("Please send Contact voicemailthirdradio in correct format.");
                            isValidAll=isValidAll && false;
                            //callback(req,res,false,"Please send Contact voicemailthirdradio in correct format."); 
                        }
                    }
                    //check contactinfo voicemailsecondradio
                    if(!validate.isEmpty(String(dtCont.voicemailsecondradio))){
                        if(!dtCont.voicemailsecondradio=='Yes' || !dtCont.voicemailsecondradio=='No'){
                             message.push("Please send Contact voicemailsecondradio in correct format.");
                            isValidAll=isValidAll && false;
                            //callback(req,res,false,"Please send Contact voicemailthirdradio in correct format."); 
                        }
                    }
                    //check contactinfo voicemailradio
                    if(!validate.isEmpty(String(dtCont.voicemailradio))){
                        if(!dtCont.voicemailradio=='Yes' || !dtCont.voicemailradio=='No'){
                            message.push("Please send Contact voicemailradio in correct format.");
                            isValidAll=isValidAll && false;
                           // callback(req,res,false,"Please send Contact voicemailthirdradio in correct format."); 
                        }
                    }

                    //check contactinfo extension
                    if(!validate.isEmpty(String(dtCont.extension))){
                        if(!validate.isNumeric(String(dtCont.extension)) && !validate.isLength(String(dtCont.extension),{min:0,max:7})){
                             message.push("Please send Contact extension in correct format.");
                            isValidAll=isValidAll && false;
                            //callback(req,res,false,"Please send Contact extension in correct format."); 
                        }
                    }
                     //check contactinfo preferredcommunication
                    if(!validate.isEmpty(String(dtCont.preferredcommunication))){
                        if(!dtCont.preferredcommunication=='Home phone' || !dtCont.preferredcommunication=='Cell phone' || !dtCont.preferredcommunication=='Work phone' || !dtCont.preferredcommunication=='Other'){
                             message.push("Please send Contact preferredcommunication in correct format.");
                            isValidAll=isValidAll && false;
                            //callback(req,res,false,"Please send Contact preferredcommunication in correct format."); 
                        }
                    }
                    if(!validate.isEmpty(String(dtCont.preferredcommunicationother))){
                        if(dtCont.preferredcommunication=='Other'){
                            if(!validate.isAlpha(dtCont.preferredcommunicationother) && dtCont.preferredcommunicationother==null){
                            
                                  message.push("Please send Contact preferredcommunication in correct format.");
                                isValidAll=isValidAll && false;
                             }
                            //callback(req,res,false,"Please send Contact preferredcommunication in correct format."); 
                        }
                    }

                     //check Address addressline1
                    if(!validate.isEmpty(String(dtAddress.addressline1))  && dtAddress.addressline1!=null){
                        if(!validate.isAlpha(String(dtAddress.addressline1))){
                            message.push("Please send Address addressline1 in correct format.");
                            isValidAll=isValidAll && false;
                           // callback(req,res,false,"Please send Address addressline1 in correct format."); 
                        }
                    }
                    
                     //check Address addressline1
                    if(!validate.isEmpty(String(dtAddress.addressline2))  && dtAddress.addressline2!=null){
                        if(!validate.isAlpha(String(dtAddress.addressline1))){
                            message.push("Please send Address addressline1 in correct format.");
                            isValidAll=isValidAll && false;
                           // callback(req,res,false,"Please send Address addressline1 in correct format."); 
                        }
                    }
                    
                     //check Address city
                    if(!validate.isEmpty(String(dtAddress.city)) && dtAddress.city==null){
                        if(!validate.isAlpha(String(dtAddress.city))){
                             message.push("Please send Address city in correct format.");
                            isValidAll=isValidAll && false;
                            //callback(req,res,false,"Please send Address city in correct format."); 
                        }
                    }
                    //check Address state
                    if(!validate.isEmpty(String(dtAddress.state)) && dtAddress.state!=null){
                        if(!validate.isAlpha(String(dtAddress.state))){
                            message.push("Please send Address state in correct format.");
                            isValidAll=isValidAll && false;
                           // callback(req,res,false,"Please send Address state in correct format."); 
                        }
                    }
                    //check Address zipcode
                    if(!validate.isEmpty(String(dtAddress.zipcode))  && dtAddress.zipcode!=null){
                        if(!validate.isNumeric(String(dtAddress.zipcode)) && !validate.isLength(String(dtAddress.zipcode),{min:5,max:9})){
                            message.push("Please send Address zipcode in correct format.");
                            isValidAll=isValidAll && false;
                           // callback(req,res,false,"Please send Address state in correct format."); 
                        }
                    }

                    //check emergency contact data
                         //check contactinfo email
                    if(!validate.isEmpty(String(dtEmergency.email)) && dtEmergency.email!=null){
                        if(!validate.isEmail(String(dtEmergency.email))){
                            message.push("Please send Contact email in correct format");
                            isValidAll=isValidAll && false;
                           // callback(req,res,false,"Please send emergencycontactinfo email in correct format."); 
                        }
                    }

                    //check contactinfo homephone
                    if(!validate.isEmpty(String(dtEmergency.homephone)) && dtEmergency.homephone!=null){
                        if(!validate.isNumeric(String(dtEmergency.homephone)) && !validate.isLength(String(dtEmergency.homephone,{min:10,max:10}))){
                            message.push("Please send Contact homephone in correct format.");
                            isValidAll=isValidAll && false;
                           // callback(req,res,false,"Please send emergencycontactinfo homephone in correct format."); 
                        }
                    }
                     //check contactinfo workphone
                    if(!validate.isEmpty(String(dtEmergency.cellphone)) && dtEmergency.cellphone!=null){
                        if(!validate.isNumeric(String(dtEmergency.cellphone)) && !validate.isLength(String(dtEmergency.cellphone),{min:10,max:10})){
                             message.push("Please send Contact cellphone in correct format.");
                            isValidAll=isValidAll && false;
                            //callback(req,res,false,"Please send emergencycontactinfo cellphone in correct format."); 
                        }
                    }
                     //check contactinfo workphone
                    if(!validate.isEmpty(String(dtEmergency.workphone)) && dtEmergency.workphone!=null){
                        if(!validate.isNumeric(String(dtEmergency.workphone)) && !validate.isLength(String(dtEmergency.workphone),{min:10,max:10})){
                            message.push("Please send Contact workphone in correct format.");
                            isValidAll=isValidAll && false;
                           // callback(req,res,false,"Please send emergencycontactinfo workphone in correct format."); 
                        }
                    }
                    //check contactinfo extension
                    if(!validate.isEmpty(String(dtEmergency.extension))){
                        if(!validate.isNumeric(String(dtEmergency.extension)) && !validate.isLength(String(dtEmergency.extension),{min:0,max:7})){
                             message.push("Please send Contact extension in correct format.");
                            isValidAll=isValidAll && false;
                            //callback(req,res,false,"Please send Contact extension in correct format."); 
                        }
                    }
                    /*
                    //check Address zipcode
                    if(!validate.isEmpty(String(dtAddress.zipcode))){
                        if(!validate.isNumeric(String(dtAddress.zipcode)) && !validate.isLength(String(dtAddress.zipcode),{min:5,max:9})){
                            message.push("Please send socialsecurityno in correct format. It must be Number with 9 digits and cannot be null");
                            isValidAll=isValidAll && false;
                           // callback(req,res,false,"Please send Address state in correct format."); 
                        }
                    }*/
                     callback(req,res,isValidAll,message);
                     /*
                        if(isValidAll){
                            callback(req,res,true,message); 
                        }else{
                            callback(req,res,false,message); 
                        }
                    */
                }else{
                    callback(req,res,false,"Please check the format for date and dateofdeath");
                }
                
                
            }else{
                callback(req,res,false,"Gender Field can have 2 possible values Male or Female"); 
            }
        }else{
            callback(req,res,false,"Firstname, lastname, gender can have only Alphabets "); 
        }
    }else{
        callback(req,res,false,"Please send required field. Firstname, lastname, gender, dateofbirth, dateofdeath is required "); 
    } 
 }
exports.create = function (req, res) {
	
	_this.checkData(req,res,function(req,res,isValid,msg){
		
        
        if(isValid){
            
			 //create patinet and send proper message with created patient data
             var pattern = 'RF-';
    IncrementRecord.findOneAndUpdate(
        { 'id': 'patientrecord' },
        { "$inc": { "patientrecordno": 1 } },
        { "upsert": true },
        function (err, increment) {
            if (err){
                return res.send(500);
               
            } 
            else {
                var recordnumber = increment.patientrecordno; // This value i get dynamically.
                var patientrecordno = pattern + ('00000' + recordnumber).slice(-6);


                var access_token = req.body.access_token;
                delete req.body.access_token;
                //var username=req.body.zres
                var zres = req.body.zres;
                delete req.body.zres;
                var rebody = req.body;               

				var dob = req.body.basicinformation[0].dateofbirth;
				var dod = req.body.basicinformation[0].dateofdeath;
				if (dob != "" && dod != "") {
					var dobdt = new Date(dob);
					var doddt = new Date(dod);
					if (dobdt > doddt) {
						return res.json(200, { message: 'Date of death cannot be less than date of birth' });
					}
				}
				 
				//get userid and client details
				/**
				* Oauth API
				*/
				Token.findOne({ value: access_token }, function (err, tokencode) {
					 
					if (err) {
						res.jsonp({ error: { message: 'Unable to create please check json' } });
					} else {
						
						if (typeof tokencode.clientId != 'undefined') {
						   
							Client.findOne({ _id: tokencode.clientId }, function (err, clientDetails) {
								if (err) {
									res.jsonp({ error: { message: 'Unable to create please check json' } });
								} else {
								   
									if (typeof clientDetails.userId != 'undefined') {

										//user data
										User.findOne({ _id: clientDetails.userId }, function (err, userDetails) {
										   
											if (err) {
												res.jsonp({ error: { message: 'Unable to create please check json' } });
											} else {
												if (typeof userDetails.username != 'undefined') {
													/*
													* new patinet starts here
													*/
													/*
													* Oauth API ends here
													*/
													var newPatient = new Patient(req.body);
													newPatient.patientrecordno = patientrecordno;
													newPatient.practicename = clientDetails.practicename;
													newPatient.createdby = userDetails.username;
													newPatient.createddate = Date.now();
													var recent = {};
													recent.vieweddate = Date.now();
													newPatient.recentviews = [];
													newPatient.recentviews.push(recent);

													newPatient.save(function (err, resp) {
														if (err) {
														   
															return res.json(400, err);
														} else {
															
															res.jsonp({ PatientDetails: resp });
														}
													});
												} else {
													res.jsonp({ error: { message: 'Unable to create please check json' } });
												}
											}
										});
									} else {
										res.jsonp({ error: { message: 'Unable to create please check json' } });
									}
								}
							});
						} else {
							res.jsonp({ error: { message: 'Unable to create please check json' } });
						}
					}
				});                
            }
         });
		}else{
            if(msg.length==0){
                msg.push("Unable to create patient please call administrator for support.")
            }
			return res.json(200, { message: msg});
		}
	});
};