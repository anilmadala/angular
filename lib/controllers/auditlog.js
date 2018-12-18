'use strict';

var mongoose = require('mongoose'),
    Userlog = mongoose.model('Userlog'),
     Reportlog = mongoose.model('Reportlog'),
     Openreportinfo = mongoose.model('Openreportinfo'),
     Practice = mongoose.model('Practice'),
    config = require('../config/config');

exports.signinevent = function (req) {
	var userinformation = {
		'username': req.user.userInfo.username,
		'userid': req.user.userInfo.id,
		'signindate': Date.now(),
		'practicename': req.user.userInfo.practicename,
		'device': req.get('User-Agent'),
		'ip': req.connection.remoteAddress,

		'sessionid': req.sessionID
	};
	var newlog = new Userlog(userinformation);
	newlog.save(function (err) 
	{
		//if(err)
			//return res.json(500, {message: err});
	});
};

exports.signoutevent = function (userdata, sessionid) {
	Userlog.findOne({ 'sessionid': sessionid }, { '_id': 1 }).exec(function (finderror, result) {
		//Updated by Unais to handle error
		if(!finderror)
		{
			Userlog.update({ '_id': result._id }, { '$set': { 'signoutdate': Date.now() } }).exec(function (updateerr, status) {	
				/*if(updateerr)
					res.json(500, {message: updateerr});
				else
					res.send(200);*/
			});
		}
		else
			res.json(500, {message:finderror});
	});
}

exports.openreportlog = function (req, res) {
    var Openreportinfodb = new Openreportinfo({ 'username': req.user.userInfo.username, 'reportid': req.params.reportid });

        Openreportinfodb.save(function (err) {
			if(err)				
				res.json(500, [{message: err}]);
        });

        var reportinformation = {
            'username': req.user.userInfo.username,
            'reportid': req.params.reportid,
            'userid': req.user.userInfo.id,
            'opendate': Date.now(),
            'practicename': req.user.userInfo.practicename,
            'role': req.user.userInfo.role,
            'rolename': req.user.userInfo.rolename,
            'level': req.user.userInfo.level,
            'status': 'updated'
        };
        var newlog = new Reportlog(reportinformation);
        newlog.save(function (err) {
           
            //Below line commented and replaced to get rid of "expected resource to contain an array but got an object" error
			//res.send(200);
			if(!err)
				res.send(200, [{ 'msg': 'successfully updated' }]); //res.send() added by Unais
			else	
				res.json(500, [{message: err}]); //res.send() added by Unais
        });
}

exports.closereportlog = function (req, res) {
        Reportlog.find({ 'reportid': req.params.reportid, 'userid': req.user.userInfo.id, 'practicename': req.user.userInfo.practicename }).sort({ "opendate": -1 }).limit(1).exec(function (finderror, result) {            
            if (result) {
                if (result.length > 0) {
                    
                    Reportlog.update({ '_id': result[0]._id }, { '$set': { 'closedate': Date.now() } }).exec(function (updateerr, status) {
						if(updateerr)
							res.json(500, [{message: updateerr}]);
                    });
                }
                // new report entry
                var newlog = new Reportlog({
                    'username': req.user.userInfo.username,
                    'reportid': req.params.reportid,
                    'userid': req.user.userInfo.id,
                    'closedate': Date.now(),
                    'practicename': req.user.userInfo.practicename,
                    'role': req.user.userInfo.role,
                    'rolename': req.user.userInfo.rolename,
                    'level': req.user.userInfo.level,
                    'status': 'new'
                });
                newlog.save(function (err) {
                    //Below line commented and replaced to get rid of "expected resource to contain an array but got an object" error
					//res.send(200);
					if(!err)
						res.json([{ 'msg': 'succesfully updated' }]);
					else
						res.json(500, [{message: err}]);
                });
            }
			else
				res.json(500, [{message: finderror}])            
        });
}

exports.deletereportlog = function (status) {
    return function (req, res, next) {        
        Reportlog.find({ 'reportid': req.params.reportid, 'userid': req.user.userInfo.id, 'practicename': req.user.userInfo.practicename }).sort({ "opendate": -1 }).limit(1).exec(function (finderror, result) {
            
			if (finderror)//Error handling added by Unais 
				return res.json(500, { message: finderror });
			else				
			{
				if (result.length > 0) {
					Reportlog.update({ '_id': result[0]._id }, { '$set': { 'closedate': Date.now(), 'status': status } }).exec(function (updateerr, status) {
						if (updateerr)//Error handling added by Unais 
							return res.json(500, { message: updateerr });
						else
							return res.json(200, {message: 'Successfully updated'});	
					});
				}
				return next();
			}
			
        });
    };
};

exports.submitedreportcloselog = function (req, res) {

    Reportlog.find({ 'reportid': req.params.reportid, 'userid': req.user.userInfo.id, 'practicename': req.user.userInfo.practicename }).sort({ "opendate": -1 }).limit(1).exec(function (finderror, result) {	
		if(!finderror)
		{
			if (result.length > 0) {
					
				Reportlog.update({ '_id': result[0]._id }, { '$set': { 'closedate': Date.now() } }, { upsert: false, multi: false }).exec(function (updateerr, status) {
					if(!updateerr)
						res.json(200, { 'msg': new Error('successfully updated') });	
					else 	
						res.json(500, { message : updateerr }); //Error handling by Unais
				});
			}			
		}
		else
			return res.json(500, {message: finderror});			
    });
}

exports.reportupdatelog = function (req, res) {
    
    Openreportinfo.update({ username: req.user.userInfo.username, reportid: req.params.reportid }, { $set: { createdAt: new Date() } }).exec(function (err, resp) {
        if (err)//Error handling added by Unais 
			return res.json(500, { message: err });
		else
			res.json([{ 'msg': 'succesfully deleted' }]);
    });
}

exports.reporTracktremovelog = function (req, res) {
    
    Openreportinfo.remove({ username: req.params.username, reportid: req.params.reportid }).exec(function (err, resp) {
        if (err)//Error handling added by Unais 
			return res.json(500, { message: err });
		else
			res.json([{ 'msg': 'succesfully deleted' }]);
    });
}

exports.getopenedreportcount = function (req, res) {   
    Openreportinfo.find()
       .where('reportid').in([req.params.reportid])
       .count().exec(function (err, count) {
           if (err) {
               return res.json(500, {msg: err});
           } else {              
               res.jsonp([{ count: count }]);
           }
       });
}

exports.getreportactivity = function (req, res) {
   
    var pname = req.body.practicename;

    var date1 = req.body.startdate;
    var date2 = req.body.enddate;

    date1 = new Date(date1);

    date2 = new Date(date2);
    date2.setDate(date2.getDate() + 1);

    Userlog.find({ "signindate": { $gte: date1, $lte: date2 }, "practicename": pname }).sort({ signindate: -1 }).exec(function (err, result) {
       
        if (err) return res.send(500, { message: err });
        else return res.send(200, { data: result });
    });
}

exports.getreportAllactivity = function (req, res) {
   
    var pname = req.body.practicename;

    var date1 = req.body.startdate;
    var date2 = req.body.enddate;

    date1 = new Date(date1);

    date2 = new Date(date2);
    date2.setDate(date2.getDate() + 1);

    Reportlog.find({ $and: [{ $or: [{ "opendate": { $gte: date1, $lte: date2 } }, { "closedate": { $gte: date1, $lt: date2 } }] }, { practicename: pname }] }).sort({ opendate: -1 }).exec(function (err, result) {
        //res.jsonp([{ 'data': result }])
        if (err) return res.send(500, { message: err });
        else return res.send(200, { data: result });
    });
}

exports.getPracticename = function (req, res) {
    Practice.find({}, { practicename: 1 }).exec(function (err, result) {
        if (err)//Error handling added by Unais 
			return res.json(500, { message: err });
		else
			res.jsonp([{ 'data': result }])
    });
}




