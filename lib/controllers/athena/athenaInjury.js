var mongoose = require('mongoose'),
    Patient = mongoose.model('Patient'),
    Athenacode = mongoose.model('Athenacode');

var athenahealthapi = require('../../athena-routes/helper-files/athenahealthapi')
var events = require('events')


var key = 'rs97qxku39p85qkny77y56hf'
var secret = 'xv9J9WPDw74nU8E'
var version = 'preview1'
var practiceid = 1

//var api = new athenahealthapi.Connection(version, key, secret, practiceid)

var api;
var codeFileName='athenaInjury.js';


//api.status.on('ready', main)
/*
api.status.on('error', function(error) {
	
})
*/

 function log_error(error) { 	
	//logAthenaDetails('',JSON.stringify(error));
 } 

//get injury details from athena

exports.getInjuryDetails = function(req,res){
	
	api = new athenahealthapi.Connection(version, key, secret, req.query.practiceid);
	
	api.GET('/patients/'+ req.query.patientid +'/insurances', {
		params: { 
			practiceid: req.query.practiceid,
			departmentid: req.query.departmentid,
			showcancelled: true,
			showfullssn: true	
		}
	}).on('done', function(injuryresponse) {
		
		if(typeof injuryresponse.error !='undefined'){
			var msg = injuryresponse.error;
			if(typeof injuryresponse.detailedmessage !='undefined'){
				msg= msg + " : " +injuryresponse.detailedmessage; 
			}
			//logAthenaDetails('getInjuryDetails', msg);			
			res.json(400, msg);
		}else{
			api.GET('/patients/'+req.query.patientid,{
					params: { 
						practiceid: req.query.practiceid,
						departmentid: req.query.departmentid	
					}
				}).on('done', function(patientresponse) {			
					if(typeof patientresponse.error !='undefined'){
						var msg = patientresponse.error;
						if(typeof patientresponse.detailedmessage !='undefined'){
							msg= msg + " : " +patientresponse.detailedmessage; 
						}	
						//logAthenaDetails('getInjuryDetails', msg);		
						res.json(400, msg);
					}else{
						var insuranceDetails = {}
						insuranceDetails.athenaInjury = injuryresponse;
						insuranceDetails.athenaPatient = patientresponse;
						res.json(200,insuranceDetails);
					}				
			}).on('error', log_error)	
		}			
	}).on('error', log_error)	
}


exports.getInjuryRatefastStatus = function(req,res){
	// if required, call all field currently only call --> injury :1
	 Patient.find({ _id: req.query.ratefast_patientId ,'injury.injurydata.athena_insurancepackageid':req.query.insurancepackageid},{'injury.$': 1, "injury": 1}).exec(function (err, patients) {
	        if (err){
					//logAthenaDetails('getInjuryRatefastStatus', JSON.stringify(err));
	        		res.send(400,err);
	        	}
	        else {
	            res.json(200,{patients: patients});
	        }
	    });
}

exports.getAthenaCodes = function(req,res){		
	if(req.body.mode=='codename'){
		//Athenacodenew.find({'codename': { $in:[req.body.industrycode,req.body.occupationcode] } }).exec(function (err, codes) {
		Athenacode.find({ $or : [	{ $and: [ { codename: req.body.industrycode }, { type: 'industry' } ] },
		                				{ $and: [ { codename: req.body.occupationcode }, { type: 'occupation' } ] }
							]  }).exec(function (err, codes) {
		        if (err){
						//logAthenaDetails('getAthenaOccupationIndustryCodes', JSON.stringify(err));
		        		res.send(400,err);
		        	}
		        else {
		            res.json(200,{codeDetails: codes});
		        }
		    });
	}else{
		
		Athenacode.find({ $or : [	{ $and: [ { code: req.body.industrycode }, { type: 'industry' } ] },
		                				{ $and: [ { code: req.body.occupationcode }, { type: 'occupation' } ] }
							]  }).exec(function (err, codes) {
		        if (err){
						//logAthenaDetails('getAthenaOccupationIndustryCodes', JSON.stringify(err));
		        		res.send(400,err);
		        	}
		        else {		
		            res.json(200,{codeDetails: codes});
		        }
		    });
	}		
}

exports.getpatient = function (req, res) {

    var patientid = req.query.patientid;
    //var category = req.query.category;

    var selection = {
        basicinformation: 1,
        patientrecordno: 1,		
        athena_patientid:1,
        'basicinformation.$': 1        
    };

    Patient.find({ _id: patientid,'basicinformation.status' : 'current'}, selection)
    .exec(function (err, patients) {
    	if (err){
			//logAthenaDetails('getpatient', JSON.stringify(err));
    		res.send(400,err);
    	}
        else {
            res.json(200,{patients: patients});
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
        if (err)
		{			
			return res.send(500);
		}			
        else {
                    
            Patient.update({ _id: patientid }, {
                $push: queryPush
            }).exec(function (err, result) {
                if (err) 
					return res.send(401);
                else {                    
                    return res.send(200, 'Updated');
                }
            });
        }
    });
};

exports.updateAthenaInsuranceData = function(req,res){
    api = new athenahealthapi.Connection(version, key, secret, req.body.practiceid);
    
    //patients/{patientid}/insurances/{insuranceid}
    
    
    api.PUT('/patients/'+ req.body.patientid +'/insurances/'+req.body.insuranceid,{
        params : req.body
    }).on('done', function(response){
        
        if(typeof response.error !='undefined'){            
            var msg = response.error;
            if(typeof response.detailedmessage !='undefined'){
                msg= msg + " : " +response.detailedmessage; 
            }            
            res.json(400, msg);
        }else{            
            res.json(200,{ updatedInsurance : response });
        }    
    }).on('error', log_error)
}