'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Patientreport = mongoose.model('Patientreport'),
    User = mongoose.model('User');

/**
 * Retrieve RFA card based on particular patient and Injury ID
 * @param req.body.injuryid : Injury id for which data is to be retrieved
 */
exports.cards = function (req, res) {

	//Return empty Result if no injury id is received from front end
	if(typeof(req.param('injuryid'))==undefined){
		return res.send(404);
	}
	
	//Return if no injury id is received
	if(req.param('injuryid')==''){
		return res.send(404);
	}
	
	var columnRequired	=	{};//{ rfas: 1,injuryid: 1,state:1,patientid: 1,formtype: 1,status: 1,practicename: 1,createdDate: 1, submittedBy: 1,'data.bginfo':1,'data.signDoctor':1};	
	var sortQuery		=	{};
	
	//Query for searching RFA for a particular injury id
	/*var query 			= 	{ };
		query.injuryid	=	req.param('injuryid');
		query.patientid	=	req.param('patientid');
		query.state		=	req.param('state');
		query.rfas		=	{$ne:null,$not: {$size: 0}}; 		//Return only if RFA is present
		query.status	=	{$ne:'deleted'};    //Not to return for deleted report*/
		
	//Below query sequence modified by Unais to satisfy index	
	var query 			= 	{ };
		query.patientid	=	req.param('patientid');
		query.injuryid	=	req.param('injuryid');      			
		query.status	=	{$ne:'deleted'};    //Not to return for deleted report
		query.state		=	req.param('state');
		query.rfas		=	{$ne:null,$not: {$size: 0}}; 		//Return only if RFA is present					
		
		//Retrieve the Patient Report
		Patientreport.find(query, columnRequired).sort(sortQuery).exec(function (err, result) {
		if (err){
			return res.send(500);
		}else {
			res.jsonp(
			  [{
				  rfacards: result,                          
			  }]
			);
		}
	});
};



exports.getuserdetails = function (req, res) {

	var columnRequired	=	{ profession: 1,username: 1,firstname:1,lastname:1};	    	       	    
	//Query 
	var query 			= 	{ };
		query.username	=	req.param('username');      	
		User.find(query, columnRequired).exec(function (err, result) {
		if (err){
			return res.send(500);
		}else {
			res.json(result);
		}
	});
};

exports.updateCards = function (req, res) {
	var query = { };
	query.injuryid	=	req.body.injuryid;
	query.patientid	=	req.body.patientid;
	query.state		=	req.body.state;      			
	query._id		=	req.body._id;      			
	var updateData={$set:{rfas:req.body.rfas}};
	//update the Patient Report rfas
	Patientreport.update(query,updateData).exec(function (err, result) {
		if (err){
			return res.send(500);
		}else {
			return res.send(200);
		}
	});					
}

exports.getuser = function (req, res) {
	var userId = req.params.id;	
	
	var columnRequired	=	{ firstname: 1,lastname: 1,otherprofessiontext:1,speciality:1,profession:1};	    	       	    
	//Query 
	var query 			= 	{ };
		query._id	=	 req.params.id;      	
		
		User.find(query, columnRequired).exec(function (err, result) {	            
			if (err){
				return res.send(500);
			}else {			
				res.json(result);
			}
		});

}
