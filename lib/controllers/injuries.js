'use strict';

var mongoose = require('mongoose'),
    Patient = mongoose.model('Patient'),
    Patientdata = mongoose.model('Patientreport'),
    User = mongoose.model('User'),

    insurance_administrator = mongoose.model('insurance_administrator'),
	logger = require('../config/logger');



exports.getpatientinjuries = function (req, res) {

    Patient.find({ _id: req.params.id }, { injury: 1 }).sort({ updateddate: 1 }).exec(function (err, patients) {
        if (err) return res.send(500)

        if (patients.length == 0) {
            return res.send(204);
        }
        else {
            res.jsonp([
                {
                    title: 'Patientinjury',
                    patients: patients
                }
            ]);
        }
    });
}

exports.addViewer = function (req, res) {
    //var viewer = { "injurydata": { "injuryinformation": { "viewinformation": [{ "viewdate": Date.now(), "viewby": req.body.username }] } } };
    //var viewer = { "viewinformation": { "viewdate": Date.now(), "viewby": req.body.username } };
    var viewer = { "viewdate": Date.now(), "viewby": req.body.username };
    Patient.update({ "injury._id": req.body.injid }, {
        "$pull": {
            "injury.$.injurydata.viewinformation": { "viewby": req.body.username }
        }
    }).exec(function (err, result) {
        Patient.update({ 'injury._id': req.body.injid }, { $push: { 'injury.$.injurydata.viewinformation': viewer } }).exec(function (err, result) {
            if (!err) {

                res.send(200, 'addviewer');
            } else {

                res.send(500, {message: err});
            }
        });
    });
}

exports.saveinjury = function (req, res) {

    //var one = { "injurydata": { "locationaddressinjury": [{ "address1": "444", "address2": "444", "city": "555" }] } };
    Patient.update({ _id: req.body.ptid }, { $push: { 'injury': req.body } }).exec(function (err, result) {

        if (err) {
			logger.error('[injuries/saveinjury] Line. 57. Error: ' + JSON.stringify(err));
			res.json(500, {message: err});

        }
        else {

            res.send({ mesg: 'success saved', id: result._id });
        }
    });
}

exports.getlatestinjuries = function (req, res) {


    Patient.find({ _id: req.params.ptid }, { "injury": 1, "basicinformation": 1 }).sort({ "injury.injurydata.createddate": 1 }).skip(req.params.skip * 5).limit(5).exec(function (err, result) {

        if(err){
			logger.error('[injuries/getlatestinjuries] Line. 71. Error: ' + JSON.stringify(err));
			res.json(500, {message: err});

		}
		else{
			res.jsonp(result);
		}
    })
}

exports.getinjurylibrary = function (req, res) {

	var query={};
	if(req.user.userInfo.role=='siteadmin' || req.user.userInfo.role=='rater1' || req.user.userInfo.role=='rater1'){
		query={ _id: req.params.ptid };
	}else{
		query={ _id: req.params.ptid,'practicename': req.user.userInfo.practicename};
	}

	// Athena changes
    Patient.find( query, {'athena_patientid' : 1, 'confirmed':1, 'injury._id': 1, 'injury.injurydata.injuryinformation': 1, 'injury.injurydata.viewinformation': 1, 'basicinformation': { $elemMatch: { 'status': 'current' } } }).sort({ "injury.injurydata.createddate": 1 }).skip(req.params.skip * 5).limit(5).exec(function (err, result) {

        if(err){
			logger.error('[injuries/getinjurylibrary] Line. 91. Error: ' + JSON.stringify(err));
			res.json(500, {message: err});

		}
		else{
			res.jsonp(result);
		}
    })
}

exports.getidpinfo = function (req, res) {

    Patient.find({ _id: req.params.ptid }, { 'injury': 1 }).exec(function (err, result) {
        if(err){
			logger.error('[injuries/getidpinfo] Line. 104. Error: ' + JSON.stringify(err));

		}
		else{
			res.jsonp(result);
		}
    })

}

exports.getclaimadmin = function (req, res) {
    var like = req.param('q').trim();
    insurance_administrator.find({ "text": { $regex: like, $options: 'i' } }, { "text": 1 }).exec(function (err, claimadminlist) {
        if(err){
			logger.error('[injuries/getclaimadmin] Line. 117. Error: ' + JSON.stringify(err));

		}
		else{
			res.jsonp(claimadminlist);
		}
    });
}

exports.UpdateInjury = function (req, res) {

    Patient.update({ 'injury._id': req.body.injid }, { '$set': { 'injury.$.injurydata': req.body.injurydata } }).exec(function (err, result) {
        if (err) return res.send(500);
        else return res.send(200);
    });
}

exports.UpdateInjuryinformation = function (req, res) {

    Patient.update({ 'injury._id': req.body.injid }, { '$set': { 'injury.$.injurydata.injuryinformation': req.body.injuryinformation } }).exec(function (err, result) {
        if (err) return res.jsonp(500, { message: err });
        else return res.send(200);
    });
}

exports.UpdateCommunication = function (req, res) {

    Patient.update({ 'injury._id': req.body.injid }, { '$set': { 'injury.$.injurydata.communication': req.body.communicationinfo } }).exec(function (err, result) {
        if (err) return res.send(500);
        else return res.send(200);
    });
}

exports.archiveStatus = function (req, res) {

	req.body.injurydata.status = 'archive';
    delete req.body.injurydata._id;
    Patient.findOne({
        $and: [{ 'injury._id': req.body.injid }]
    }).exec(function (err, record) {
		if(!err)
		{
			for (var i = 0; i < record.injury.length; i++) {
				if (record.injury[i]._id == req.body.injid) {
					record.injury.forEach(function (item) {
						if (item._id == req.body.injid) {
							item.injurydata[req.body.sectionname].forEach(function (injurystatus) {

								if (injurystatus._id == req.body.currentId) {
									injurystatus.status = 'current';
									//injurystatus.status = 'archive';
								} else {
									injurystatus.status = 'archive';
								}
								injurystatus.markModified('status');
								injurystatus.save(function(err,resp)
								{
									if(err)
										res.send(500, {msg: err})
								});
							});
							//item.markModified('status');
							//item.save();
						}
					});
				}
			}
			record.save(function(err,resp)
			{
				if(err)
					res.send(500, {msg: err})
				else
					res.send(200, {msg: resp})
			});
		}
		else
			res.send(500, {msg: err})

    });

    var category = 'injury.$.injurydata.' + req.body.sectionname;
    var queryPush = {
    };
    queryPush[category] = req.body.injurydata;


    Patient.update({ 'injury._id': req.body.injid }, {
        $push: queryPush
    }).exec(function (err, result) {
        if (err) return res.send(err);
        else return res.send(200);
    });

}

exports.addsubinjuries = function (req, res) {


    /**
     * Don't update if company information is blank.
     */

	var section = req.body.text.split('.')[3];
	var usingItNow = function (callback) {
		var section = req.body.text.split('.')[3];

		Patient.findOne({
			$and: [{ 'injury._id': req.body.injid }]
		}).exec(function (err, record) {
			if (err) return res.send(err);
			else
			{
				if (record) {
					if (record.injury) {
						for (var i = 0; i < record.injury.length; i++) {
							if (record.injury[i]._id == req.body.injid) {
								record.injury.forEach(function (item) {
									if (item._id == req.body.injid) {
										item.injurydata[section].forEach(function (injurystatus) {
											injurystatus.status = 'archive';
											injurystatus.markModified('status');
											injurystatus.save(function(err,resp)
											{
												if(err)
													res.send(500, {msg: err})
												else
												{
													record.save(function(err,resp)
													{
														if(err)
															res.send(500, {msg: err})
													});
												}
											});
										});
										//item.markModified('status');
										//item.save();
									}
								});
							}
						}
						record.save(function(err,resp)
						{
							if(err)
								res.send(500, {msg: err})
						});
					}
				}
			}
		});
		callback();
	};
	var myCallback = function () {

		var category = req.body.text;
		var queryPush = {
		};
		queryPush[category] = req.body.injurydata;

		Patient.update({ 'injury._id': req.body.injid }, {
			$push: queryPush
		}).exec(function (err, result) {
			if (err) return res.send(err);
			else return res.send(200);
		});
	};
	usingItNow(myCallback);
}



exports.addsubinjuriesbodypart = function (req, res) {

	var changetoarchive = req.body.changetoarchive;
	var section = req.body.text.split('.')[3];
	if (changetoarchive) {
		Patient.findOne({
			$and: [{ 'injury._id': req.body.injid }]
		}).exec(function (err, record) {
			if (!err)
			{
				if(typeof record!='undefined')
				{
					if(typeof record.injury!='undefined')
					{
						for (var i = 0; i < record.injury.length; i++) {
							if (record.injury[i]._id == req.body.injid) {
									record.injury.forEach(function (item) {
									if (item._id == req.body.injid) {
											item.injurydata[section].forEach(function (injurystatus) {
												injurystatus.status = 'archive';
												injurystatus.markModified('status');
												injurystatus.save(function(err,resp)
												{
													if(err)
														res.send(500, {msg: err})
													else
													{
														record.save(function(err,resp)
														{
															if(err)
																res.send(500, {msg: err})
														});
													}
												});
											});
											//item.markModified('status');
											// item.save();
											//record.save();
									}

								});
							}
						}
						record.save(function(err,resp)
						{
							if(err)
								res.send(500, {msg: err})
						});
					}
				}
				return res.send(200);
			}
			else
			{
				return res.send(err);
			}
		});
	}
	else if (!changetoarchive)
	{
		var category = req.body.text;
		var queryPush = {
		};
		queryPush[category] = req.body.injurydata;

		Patient.update({ 'injury._id': req.body.injid }, {
			$push: queryPush
		}).exec(function (err, result) {
			if (err) return res.send(err);
			else return res.send(200);
		});
	}
}

exports.deleteInjury = function (req, res) {
    Patient.update({ 'injury._id': req.body.injid }, { '$pull': { "injury": { "_id": req.body.injid } } }).exec(function (err,result) {
		if(!err)
			res.send(200, {message: 'Injury successfully deleted' });
		else
			res.json(500, {message: err});
    });
}

exports.basicsearch = function (req, res) {

    var query = {
        patientid: req.body.ptid,
        status: req.body.rstatus,
        createdby: req.body.provider
    }

    if (req.body.rstatus == "all") {
        delete query.status;
    }
    if (req.body.provider == "all") {
        delete query.createdby;
    }

    Patientdata.find(query, { injuryid: 1, status: 1, formtype: 1, createdby: 1, 'data.selectinjuries.concatedbodypart': 1, 'data.patientcomplaints.currentexamdate': 1, 'data.bginfo.dateofinjury': 1, patientid: 1, formid: 1 }).exec(function (err, result) {
        if (err) return res.send(500, { message: err });
        else return res.send(200, { data: result });
    });
}

exports.reportsearch = function (req, res) {

    if (req.body.rstatus != "all" && req.body.provider == "all") {

        Patientdata.find({ "patientid": req.body.ptid, status: req.body.rstatus, injuryid: req.body.injid }, { injuryid: 1, patientid: 1, modifieddate: 1, createdby: 1, status: 1, formtype: 1, 'data.patientcomplaints.currentexamdate': 1 }).exec(function (err, result) {
            if (err) return res.send(500, { message: err });
            else return res.send(200, { Data: result });

        });
    } else if (req.body.rstatus != "all" && req.body.provider != "all") {

        Patientdata.find({ "patientid": req.body.ptid, status: req.body.rstatus, injuryid: req.body.injid, createdby: { '$regex': req.body.provider } }, { injuryid: 1, patientid: 1, modifieddate: 1, createdby: 1, formtype: 1, 'data.patientcomplaints.currentexamdate': 1, status: 1 }).exec(function (err, result) {
            if (err) return res.send(500, { message: err });
            else return res.send(200, { Data: result });

        });
    } else if (req.body.rstatus == "all" && req.body.provider != "all") {

        Patientdata.find({ "patientid": req.body.ptid, injuryid: req.body.injid, createdby: { '$regex': req.body.provider } }, { injuryid: 1, patientid: 1, modifieddate: 1, createdby: 1, status: 1, formtype: 1, 'data.patientcomplaints.currentexamdate': 1 }).exec(function (err, result) {
            if (err) return res.send(500, { message: err });
            else return res.send(200, { Data: result });

        });
    } else if (req.body.rstatus == "all" && req.body.provider == "all") {

        Patientdata.find({ "patientid": req.body.ptid, injuryid: req.body.injid }, { injuryid: 1, patientid: 1, modifieddate: 1, createdby: 1, status: 1, formtype: 1, 'data.patientcomplaints.currentexamdate': 1 }).exec(function (err, result) {
            if (err) return res.send(500, { message: err });
            else return res.send(200, { Data: result });

        });
    }


};

exports.getuserlist = function (req, res) {

    User.find({ "practice.name": req.params.practiceaccnt, "practice.status": "active" }, { username: 1, firstname: 1, lastname: 1 }, function (err, user) {
        if (err)
			res.send(500, { message: err });
		else
			res.jsonp(user);
    });
};

exports.getreportinfo = function (req, res) {

    Patientdata.find({ _id: req.params.repid }, { modifieddate: 1, modifiedby: 1, status: 1 }).exec(function (err, repinfo) {
        if (err)
			res.send(500, { message: err });
		else
			res.jsonp(repinfo);
    });
};


/*
 * shridhar 24 oct 2016 : this function used to set patient confirmed=true
 */
exports.UpdatePatientConfirmedStatus = function (req, res) {

    Patient.update({_id: req.body.ptid}, {"$set": {'confirmed': true}}).exec(function (err, responce) {
        if (err)
			res.send(500, { message: err });
		else
			res.jsonp(responce);
    });
};


