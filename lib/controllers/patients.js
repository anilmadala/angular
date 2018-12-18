

var mongoose = require('mongoose'),
    Patient = mongoose.model('Patient'),
    IncrementRecord = mongoose.model('IncrementRecord'),
    User = mongoose.model('User'),
	Patientdata = mongoose.model('Patientreport');
	Practice = mongoose.model('Practice');

	const logger = require('../config/logger');

var crypto = require('crypto');

var encryptionKey = process.env.ENCRYPTED_KEY;

function encrypt(text) {
    var crypted;

	if (text === null || typeof text === 'undefined') { return text; };
	var cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
	var crypted = cipher.update(text, 'utf8', 'hex');
	crypted += cipher.final('hex');
	return crypted;
	return crypted;
}

/**
 * Get All Patients from the Loggedin Practice Account
 */
exports.getpatientlist = function (req, res, next) {

    var practicename = req.params.practicename;
    var role = req.user.userInfo.role.trim().toLowerCase();
    var criteria;

    if (role == 'siteadmin') {
        criteria = {};
    }
    else {
        criteria = { practicename: practicename };
    }

    var page = (req.param('pagenum') > 0 ? req.param('pagenum') : 1) - 1
    var perPage = 50
    var options = {
        perPage: perPage,
        page: page,
        criteria: criteria
    }

    Patient.find(criteria, { basicinformation: { $elemMatch: { 'status': 'current' } }, address: { $elemMatch: { 'status': 'current' } } })
        //.limit(options.perPage)
        .sort({ updateddate: 1 })
        //.skip(options.perPage * options.page)
        .exec(function (err, patients) {
            if (err) return res.send(500)

            Patient.count(options.criteria).exec(function (err, count) {

                res.jsonp([
                    {
                        title: 'Patient',
                        patients: patients,
                        page: page + 1,
                        pages: Math.ceil(count / perPage),
                        totalitem: count
                    }
                ]);

            })
        })

};

/**
 * Get Recent Patients from the Loggedin Practice Account
 */
exports.getrecentpatients = function (req, res, next) {

    var practicename = req.user.userInfo.practicename;
    var selectedstatecode = req.params.selectedstatecode;
    var page = (req.param('pagenum') > 0 ? req.param('pagenum') : 1) - 1
    var perPage = 5
    var options = {
        perPage: perPage,
        page: page
    }

    // Athena changes
    Patient.find({ practicename: practicename, state: selectedstatecode }, { basicinformation: { $elemMatch: { 'status': 'current' } }, confirmed:1, athena_patientid : 1 })
        .sort({ 'recentviews.vieweddate': -1 })
        .limit(5)
        .skip(options.perPage * options.page)
        .exec(function (err, patients) {
            if (err) return res.send(500)

            Patient.count({ practicename: practicename }).exec(function (err, count) {
				if (err) return res.send(500)
				else
				{
					if (patients.length == 0) {
						return res.send(204);
					}
					else {

						res.jsonp([
							{
								title: 'Patient',
								patients: patients,
								page: page + 1,
								pages: Math.ceil(count / perPage),
								totalitem: count
							}])
					}
				}
            })
        })
};
/**
 * Get Patient data by Category
 */
exports.getpatient = function (req, res, next) {

    var patientid = req.params.patientid;
    var category = req.params.category;

	// Athena changes
    var selection = {
        basicinformation: 1,
        address: 1,
        contactinformation: 1,
        emergencycontactinfo: 1,
        demographics: 1,
        occupation: 1,
        patientrecordno: 1,
		medicalhistory:1,
        sh:1,
		athena_patientid : 1 //Athena changes
    };

    Patient.find({ _id: patientid }, selection)
    .exec(function (err, patients) {
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

function zeroFill(number, width) {
    width -= number.toString().length;
    if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number + ""; // always return a string
};

/**
 * Add New Patient
 */
exports.createpatient = function (req, res) {

    var pattern = 'RF-';
    IncrementRecord.findOneAndUpdate(
        { 'id': 'patientrecord' },
        { "$inc": { "patientrecordno": 1 } },
        { "upsert": true },
       function (err, increment) {
           if (err) return res.send(500)
           else {
               var recordnumber = increment.patientrecordno; // This value i get dynamically.
               var patientrecordno = pattern + ('00000' + recordnumber).slice(-6);

               var newPatient = new Patient(req.body);
               newPatient.patientrecordno = patientrecordno;
               newPatient.createdby = req.user.userInfo.username;
               newPatient.createddate = Date.now();

               newPatient.save(function (err, resp) {
                   if (err) {
                       return res.json(500, err);
                   } else
				   {
					   //Below line commented to send patient details
					   //return res.jsonp('Patient Created Successfully.');
					   res.jsonp({ PatientDetails: resp });
				   }

               });
           }
       });
};

/**
 * Update Patient by Category
 */
exports.updatepatient = function (req, res) {

    var patientid = req.body.patientid;
    var category = req.body.category;
    var categorySet = category + '.$.status';
    var categorynewdata = req.body.categorynewdata;

    categorynewdata._id = mongoose.Types.ObjectId();
    categorynewdata.updateddate = Date.now();
    categorynewdata.updatedby = req.user.userInfo.username;

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
                if (err) return res.send(500);
                else {

                    return res.send(200, 'Updated');
                }
            });
        }
    });

};

/**
 * Search Patients
 */
exports.searchpatients = function (req, res) {

    var practicename = req.user.userInfo.practicename;
    var selectedstatecode = req.body.selectedstatecode;

    var firstname, lastname, dateofbirth, start_date, date_add, end_date, socialsecurityno, gender, confirmed;
    if (req.body.sfname != 0 && req.body.sfname != '')
        firstname = req.body.sfname;
    else
        firstname = '';
    if (req.body.slname != 0 && req.body.slname != '')
        lastname = req.body.slname;
    else
        lastname = '';

    if (req.body.ssocial != 0 && req.body.ssocial != '')
        socialsecurityno = req.body.ssocial;
    else
        socialsecurityno = '';

	if (req.body.gender != 0 && req.body.gender != '')
    	gender = req.body.gender;
    else
    	gender = '';

    var searchId = req.body.searchId;

    var page = (req.param('pagenum') > 0 ? req.param('pagenum') : 1) - 1;
    var perPage = 10
    var options = {
        perPage: perPage,
        page: page,
        searchId: searchId
    };

    var dob = req.body.sdob ? req.body.sdob : '';

	var query={};
    if(req.body.confirmed){
    	query.practicename= practicename,
    	query.state= selectedstatecode,
    	query.confirmed= false
    }else{
    	query.practicename= practicename,
    	query.state= selectedstatecode
    }

	Practice.findOne({'practicename':practicename},{enable_kickstart:1}).exec(function(err,kickstartDetails){
		if (err) return res.send(500);
		else{
			var kickstartdata = req.user.userInfo.role == 'siteadmin' ? true : false;

			if(req.user.userInfo.role != 'siteadmin'){
				kickstartdata = kickstartDetails.enable_kickstart == true ? true:false;
			}


    //For full Search of Patient Example
    Patient.find(query, {  confirmed:1, basicinformation: { $elemMatch: { 'status': 'current' } }, address: { $elemMatch: { 'status': 'current' } }, contactinformation: {$elemMatch : {'status':'current'}}, "_id": 1, "contactinformation.homephone": 1 ,"basicinformation.firstname":1,"basicinformation.middlename":1,"basicinformation.status":1,"basicinformation.lastname":1, "contactinformation.homephone": 1,"basicinformation.gender":1,"basicinformation.dateofbirth":1,"address.addressline1":1,"address.addressline2":1,"address.city":1,"address.state":1,"address.zipcode":1 })
    .exec(function (err, patients) {
        if (err) return res.send(500);
        else {

            var results = patients.filter(function (val) {

				return (new RegExp('.*' + firstname + '.*', 'i').exec(val.basicinformation[0].firstname) != null &&
						new RegExp('.*' + lastname + '.*', 'i').exec(val.basicinformation[0].lastname) != null &&
					   (socialsecurityno == '' || val.basicinformation[0].socialsecurityno == socialsecurityno) &&
						(dob == '' || dob == 0 || new Date(val.basicinformation[0].dateofbirth).toDateString() == new Date(dob).toDateString()) &&
						(gender == '' || val.basicinformation[0].gender == gender)
					);


            });


			res.send(200, {
				data:
					{
						title: 'Patient',
						patients: results,
						page: page + 1,
						pages: Math.ceil(results.length / perPage),
						totalitem: results.length,
						kickstartEnable:kickstartdata
					}
			});

        }
    });
		}
});
};

exports.getselectinjuriesData = function (req, res) {

    var injuryid = req.params.injuryid;

    Patient.find({ "injury._id": injuryid }, { "injury.$": 1 }).exec(function (err, selectinjuries) {
        if (err) return res.send(500);
        else {
            res.jsonp([
                {
                    title: 'Patients',
                    selectinjuries: selectinjuries
                }
            ]);
        }
    });
};

/**
 * Update Recent Views of Patients
 */
exports.updaterecentviews = function (req, res) {

    var patientid = req.body.patientid;
    var viewedby = req.user.userInfo.username;
    var vieweddate = Date.now();

    var query = {
        '_id': patientid,
        'recentviews.viewedby': viewedby
    }

    var setQuery = {
        'recentviews.$': {
            'viewedby': viewedby,
            'vieweddate': vieweddate
        }
    }

    Patient.update(query, {
        $set: setQuery
    })
         .exec(function (err, result) {
             if (err) return res.send(500);
             else {
                 //if (result == 0) {
				 if (result.nModified == 0) {
                     Patient.update({
                         '_id': patientid
                     },
                    {
                        '$push': {
                            'recentviews': {
                                'viewedby': viewedby,
                                'vieweddate': vieweddate
                            }
                        }
                    })
                     .exec(function (err, result) {
                         if (err) return res.send(500);
                     });
                 }
                 return res.send(200, 'Updated');
             };
         });

};

exports.getLoggedinPatientpracticename = function (req, res) {
    var patientid = req.params.patientid;

    Patient.find({ "_id": patientid }, { "practicename": 1 }).exec(function (err, practicename) {
        if (err) return res.send(500);
        else {
            res.jsonp([
                {
                    patientData: practicename
                }
            ]);
        }
    });
};

exports.Updateemployeehandedness = function (req, res) {

    Patient.update({
        _id: (req.body.ptid),
        'basicinformation.status': 'current'
    },
    {
        "$set": {
            "basicinformation.$.employeehandedness": encrypt(req.body.handedness)
        }
    }).exec(function (err, responce) {
		if (err) return res.send(500);
		else
			res.jsonp(responce);
    });
};


exports.searchPatientWithReport = function (req, res) {

    var practicename = req.user.userInfo.practicename;
    var selectedstatecode = req.body.selectedstatecode;

    var query={};

    if(req.body.recordsBy== 'signingphysician'){

    	query={practicename: practicename,'status': { $nin: [ 'open' , 'deleted' ] },'data.signDoctor.level4.firstname':req.user.userInfo.firstname,'data.signDoctor.level4.lastname':req.user.userInfo.lastname};
    	//query={'data.signDoctor.level4.firstname':'manoj','data.signDoctor.level4.lastname':'gupta',practicename: practicename};
    }else{
    query={practicename: practicename,formtype:{$in:req.body.reporttype},status:{$in:req.body.status}};

    var firstname, lastname,socialsecurityno,gender,dob;
    var startInjuryDate,endInjuryDate,startServiceDate,endServiceDate,startSubmitDate,endSubmitate;

    if (req.body.sfname != 0 && req.body.sfname != '')
        firstname = req.body.sfname;
    else
        firstname = '';
    if (req.body.slname != 0 && req.body.slname != '')
        lastname = req.body.slname;
    else
        lastname = '';
    if (req.body.ssocial != 0 && req.body.ssocial != '')
        socialsecurityno = req.body.ssocial;
    else
        socialsecurityno = '';
    if (req.body.gender != 0 && req.body.gender != '')
    	gender = req.body.gender;
    else
    	gender = '';
    if (req.body.sdob != 0 && req.body.sdob != '')
    	dob = req.body.sdob;
    else
    	dob = '';

    if (req.body.startInjuryDate != 0 && req.body.startInjuryDate != ''){
	    	startInjuryDate = req.body.startInjuryDate;

	    	endInjuryDate = new Date(req.body.endInjuryDate);
	    	endInjuryDate.setDate(endInjuryDate.getDate()+1);
    	}
    else{
	    	startInjuryDate = '';
	    	endInjuryDate = '';
    	}
    if (req.body.startServiceDate != 0 && req.body.startServiceDate != ''){
	    	startServiceDate = req.body.startServiceDate;

	    	endServiceDate = new Date(req.body.endServiceDate);
	    	endServiceDate.setDate(endServiceDate.getDate()+1);
    	}
    else{
    	startServiceDate = '';
    	endServiceDate = '';
    	}
	 if (req.body.startSubmitDate != 0 && req.body.startSubmitDate != ''){
		    	startSubmitDate = req.body.startSubmitDate;

		    	endSubmitate = new Date(req.body.endSubmitate);
		 		endSubmitate.setDate(endSubmitate.getDate()+1);

		 		// add to query bcz this date is not save in encrepted format
		 		query.submittedDate = {$gte:new Date(startSubmitDate),$lt:new Date(endSubmitate)};
	 		}
	    else{
	    	startSubmitDate = '';
	    	endSubmitate = '';
	    }

    }

    var searchId = req.body.searchId;

    var page = (req.param('pagenum') > 0 ? req.param('pagenum') : 1) - 1;
    var perPage = 10
    var options = {
        perPage: perPage,
        page: page,
        searchId: searchId
    };

    var fieldsToFetch={'patientid':1,'injuryid':1, 'version': 1, 'data.bginfo.firstname':1,'data.bginfo.middlename':1,'data.bginfo.lastname':1,'data.bginfo.gender':1,'data.bginfo.dateofbirth':1,'data.bginfo.socialsecurityno':1,'formtype':1,'data.selectinjuries.dateofinjury':1,'data.patientcomplaints.currentexamdate':1,'submittedDate':1,'status':1,'data.signDoctor.level4.firstname':1,'data.signDoctor.level4.lastname':1};

    Patientdata.find(query,fieldsToFetch).exec(function (err, patients) {
        if (err) return res.send(500);
        else {
        	var  results={};
        	if(req.body.recordsBy== 'signingphysician'){
	        	results=patients;
        	}else{
	        	results = patients.filter(function (val) {
	                return (new RegExp('.*' + firstname + '.*', 'i').exec(val.data.bginfo.firstname) != null &&
	                        new RegExp('.*' + lastname + '.*', 'i').exec(val.data.bginfo.lastname) != null &&
	                       (socialsecurityno == '' || val.data.bginfo.socialsecurityno == socialsecurityno) &&
	                        (dob == '' || dob == 0 || new Date(val.data.bginfo.dateofbirth).toDateString() == new Date(dob).toDateString()) &&
	                        (gender == '' || val.data.bginfo.gender == gender)&&
	                        (startInjuryDate == '' || startInjuryDate == 0 || new Date(val.data.selectinjuries.dateofinjury) >= new Date(startInjuryDate)) &&
	                        (endInjuryDate == '' || endInjuryDate == 0 || new Date(val.data.selectinjuries.dateofinjury) < endInjuryDate) &&
	                        (startServiceDate == '' || startServiceDate == 0 || new Date(val.data.patientcomplaints.currentexamdate) >= new Date(startServiceDate)) &&
	                        (endServiceDate == '' || endServiceDate == 0 || new Date(val.data.patientcomplaints.currentexamdate) < endServiceDate)
	                	);
	            });
        	}

            res.send(200, {
                data:
                    {
                        title: 'Patient',
                        patients: results,
                        page: page + 1,
                        pages: Math.ceil(results.length / perPage),
                        totalitem: results.length
                    }
            });
        }
    });
};
