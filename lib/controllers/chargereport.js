//'use strict';

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


//shridhar function
exports.getChargeReportData = function (req, res) {
	var pname = req.body.practicename;    
	var date1 = req.body.startdate;
	var date2 = req.body.enddate;	
	var street, city;
	
	if(pname!='All Accounts')
	{
		/*
		 *if user select specific location then query contain street n city
		 * user want records for all locations then strret n city will be empty
		 * this condition base on all locations then it means user want for all location
		 */	 
			
			street = req.body.locationname.street;	
			city= req.body.locationname.city;		
	}
	
	

	date1 = new Date(date1);
	date2 = new Date(date2);
	date2.setDate(date2.getDate() + 1);


	var requiredFeild={};
	var reportQuery={};
	
	if(pname!='All Accounts')
	{
		if(req.body.locationname.all=='All Locations'){
			reportQuery={$and: [{ $or: [{ status: 'level1' },{ status: 'closed' },{ status: 'level2' }] }, 
								{ 'submittedDate': { $gte: date1, $lte: date2 } }, 
								{ practicename: pname}
							 ] };
		}
		else{
			reportQuery={$and: [{ $or: [{ status: 'level1' },{ status: 'closed' },{ status: 'level2' }] }, 
								{ 'submittedDate': { $gte: date1, $lte: date2 } }, 
								{ practicename: pname},
								{'data.patientcomplaints.cliniclocationobj.street':street},
								{'data.patientcomplaints.cliniclocationobj.city':city }
							 ] };
		}
	}
	else{
		reportQuery={$and: [{ $or: [{ status: 'level1' },{ status: 'closed' },{ status: 'level2' }] }, 
							{ 'submittedDate': { $gte: date1, $lte: date2 } }
						 ] };
	}
					
	
	
	var reportRequiredFeild={ 
				practicename: 1,
				'data.patientcomplaints.cliniclocation': 1,
				submittedDate: 1,
				formtype: 1,
				reportcharge: 1,
				'data.patientcomplaints.treatphynamedropdown': 1,
				'data.patientcomplaints.currentexamdate': 1,
				'data.bginfo.firstname': 1,
				'data.bginfo.lastname': 1,
				_id: 1,
				submittedBy: 1,
				'data.signDoctor.level4.firstname': 1,
				'data.signDoctor.level4.lastname': 1
				//'data.bginfo.dateofbirth': 1,
				//'data.bginfo.company': 1,
				//'data.bginfo.insurance_claimsadministrator': 1
			};
	
	Patientdata.find(reportQuery,reportRequiredFeild).sort({ practicename: 1, submittedDate : 1 }).exec(function (err, result) {
		if (err){
			return res.send(500, { message: err });
		}
		else 
		{	
			/**
			 * Async loop to be used to execute and find treating physician 
			 */
			
			var finalresult = JSON.stringify(result);
			var finalresult2 = JSON.parse(finalresult);	
			var i=0;
			function asyncLoop( i, callback ) {
				if( i < result.length ) {
					if(result[i].data.patientcomplaints.treatphynamedropdown!=''){
						User.find({ _id: result[i].data.patientcomplaints.treatphynamedropdown }, { firstname: 1, lastname: 1}).exec(function (err, resultTreating) {							
							if (err) return res.send(500, { message: err });
							else {					
								if(resultTreating.length>0){
									finalresult2[i].data.patientcomplaints.treatphynamedropdown = resultTreating[0].firstname + ' ' + resultTreating[0].lastname;	
								}												
							}
							asyncLoop( i+1, callback );
						});
					}else{
						asyncLoop( i+1, callback );
					}
					
				} else {
					callback();
				}
			}
			asyncLoop( 0, function() {
				res.send(200, { data: finalresult2 });
			});
			
			/**
			 * Ends here async loop
			 */
		}
	});
};



