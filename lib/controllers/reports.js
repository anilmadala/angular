'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    FormTypes = mongoose.model('FormTypes'),
    ReportList = mongoose.model('Reports'),
    FormList = mongoose.model('FormList'),
    Patient = mongoose.model('Patient');


exports.getformtype = function (req, res) {

    FormTypes.find().exec(function (err, listtypes) {

        if (err) {
            /*res.render('error', {
                status: 500
            });*/
			res.send(500, {msg: err});//Changed by Unais
        } else {
            res.jsonp(listtypes);
        }
    });
};

exports.getformlist = function (req, res) {
	var page = (req.body.pagenum > 0 ? req.body.pagenum : 2) - 1
    var perPage = 9;
    var state = req.body.state;
    var options = {
        perPage: perPage,
        page: page
    }
    var query={};
    query.type=typeof(req.body.formType)=='undefined'?'form':req.body.formType;
	if(typeof(req.body.statusId)!='undefined'){
		if(req.body.statusId!=""){
			query.status=req.body.statusId;
		}
		
	}
    if(typeof(req.body.searchId)!='undefined'){
		if(req.body.searchId!=""){
			query.formname={ $regex: req.body.searchId, $options: 'i' };
		}
		
	}
    FormList.find(query,{ formname: 1,version: 1,status: 1,formtype: 1,type:1}).limit(options.perPage).skip(options.perPage * options.page).exec(function (err, lists) {   

    //FormList.list(options, function (err, lists) {
    	if (err) 
			//return res.render('500')
			return res.send(500);//Changed by Unais
    	FormList.find(query).count().exec(function (err, count) {
        //FormList.count().exec(function (err, count) {
			if (err) 
				return res.send(500);//Changed by Unais
			else
			{	
				res.jsonp({
					formList: lists,
					page: page + 1,
					pages: Math.ceil(count / perPage),
					totalitem: count,

					itemsperpage:perPage
				});
			}
        })
    })
};
exports.formSearch = function (req, res) {
    var searchId = req.params.searchId;
    var page = (req.param('pagenum') > 0 ? req.param('pagenum') : 1) - 1
    var perPage = 9
    var options = {
        perPage: perPage,
        page: page,
        search: searchId
    }

    FormList.find({
        $or: [
            { 'formname': { $regex: searchId } },
            { 'formtype': { $regex: searchId } }
        ]
    }).exec(function (err, searchlist) {
		
		if(err)
		{
			res.send(500, {msg: err});//Changed by Unais
		}
		else
		{
			res.jsonp([
				{
					title: 'UsersList',
					formList: searchlist,
					page: page + 1,
					pages: Math.ceil(searchlist.length / perPage),
					totalitem: searchlist.length
				}
			]);
		}
    });

};


exports.status = function (req, res) {
    var statusId = req.params.statusId;
    var criteria = { status: statusId };
    var page = (req.param('pagenum') > 0 ? req.param('pagenum') : 1) - 1
    var perPage = 9
    var options = {
        perPage: perPage,
        page: page,
        status: criteria
    }

    FormList.find({ 'status': options.status.status }).exec(function (err, responce) {
	
		if(err)
		{
			res.send(500, {msg: err});//Changed by Unais
		}
		else
		{
			res.jsonp([
				{
					title: 'Practice',
					formList: responce,
					page: page + 1,
					pages: Math.ceil(responce.length / perPage),
					totalitem: responce.length
				}
			]);
		}
    })
};

exports.getversions = function (req, res) {
    var formID = req.params.formid;
    FormList.find({ 'formtype': formID }).exec(function (err, versionlist) {
        if(err)
		{
			res.send(500, {msg: err});//Changed by Unais
		}
		else
		{
			return res.jsonp(versionlist);
		}
    })
}

exports.saveNewform = function (req, res) {
    var nextcount = 0;
   
    //create
   
    if (req.body.action == 0 && req.body.type == 'form') {
        FormTypes.findOne({ 'formtype': req.body.addform }).exec(function (err, doc) {
			if(err)
				res.json(500, {msg : err});//Added by Unais
			else
			{
				nextcount = (doc.versioncount + 1);
				var form = new FormList();
				form.formname = doc.title;
				form.formtype = req.body.addform;
				form.type = 'form';
				form.status = 'draft';
				form.version = nextcount;
				//form.formdata = { "sections": [{}], "forms": {}, "data": {} };
				//form.reportdata = { sections: [], reportdata: [] };
				form.save(function (error, data) {
					if (error) 
						res.send(500, {msg: error});
					else 
					{						
						FormTypes.findById(doc._id, function (err, formtp) {
							if (err) 
								res.send(500, {msg: err});
							else
							{
								formtp.versioncount = nextcount;
								formtp.save(function (error, tpdata) {
									if (error) {
										res.send(500, "error occured");
									}
									else {
										res.send({ mesg: 'success saved', id: data._id });
									}
								});
							}
						});
					}	
				});
			}	
        });
    }
    
	//copy
    else if (req.body.action == 1 && req.body.type == 'form') {
        FormList.find({ formtype: req.body.mainform, version: req.body.version }).exec(function (err, result) {
            FormTypes.findOne({ 'formtype': req.body.addform }).exec(function (err, doc) {
				if(err)
					res.json(500, {msg : err});//Added by Unais
				else
				{
					nextcount = (doc.versioncount + 1);
					var form = new FormList();
					form.formname = doc.title;
					form.formtype = req.body.addform;
					form.status = 'draft';
					form.type = 'form';
					form.version = nextcount;
					form.formdata = result[0].formdata;
					//form.reportdata = { sections: [{}], data: [{}] };
					form.save(function (error, data) {
						if (error) 
							res.send(500, {msg: error});
						else
						{
							FormTypes.findById(doc._id, function (err, formtp) {
								if (err) 
									res.send(500, {msg: err});
								else
								{
									formtp.versioncount = nextcount;
									formtp.save(function (error, tpdata) {
										if (error) {
											res.send(404, "error occured");
										}
										else {
											res.send({ mesg: 'success saved', id: data._id });
										}
									});
								}
							});
						}
					});
				}
            });
        });
    }
    else if (req.body.action == 0 && req.body.type == 'template') {
        var form = new FormList();
        form.formtype = req.body.addform;
        form.status = 'draft';
        //form.formdata = { "sections": [{}], "forms": {}, "data": {} };
        //form.reportdata = { sections: [], reportdata: [] };
        form.type = 'template';
        form.formname = req.body.templatename
        form.save(function (error, data) {
			if(error)
				res.send(500, {msg : error});//Added by Unais
			else
				res.send({ mesg: 'success saved', id: data._id });
        });

    } else if (req.body.action == 1 && req.body.type == 'template') {
        FormList.find({ formtype: req.body.mainform, type: 'template' }).exec(function (err, result) {
            if(err)
				res.json(500, {msg : err});//Added by Unais
			else
			{
				var form = new FormList();
				form.formtype = req.body.addform;
				form.type = 'template';
				form.status = 'draft';
				form.formname = req.body.templatename,
				//form.formdata = result[0].formdata;
				//form.reportdata = { sections: [], reportdata: [] };
				form.formdata = result[0].formdata,
				form.save(function (error, data) {
					if(error)
						res.send(500, {msg : error});//Added by Unais
					else
						res.send({ mesg: 'success saved', id: data._id });
				});
			}
        });
    }
}

exports.saveForm = function (req, res) {
    var formID = req.body.id;
    //var formdatas = JSON.stringify(req.body.data);
    var formdatas = (req.body.data);
    var reportdatas = JSON.stringify(req.body.reportdata);
    var type = (req.body.type);
    
    if (formdatas) {
       
        FormList.update({ _id: formID }, { $set: { 'formdata': formdatas } }).exec(function (err, result) {
            if (err) {              
                return res.send(500)
            }
            else {               
                return res.send(200)
            };
        });
    }

    if (reportdatas) {
       
        FormList.update({ _id: formID }, { $set: { 'reportformdata': reportdatas } }).exec(function (err, result) {
            if (err) return res.send(500);
            else return res.send(200);
        });
    }
};

exports.getreportlistpost = function (req, res) {

    var page = (req.body.pagenum > 0 ? req.body.pagenum : 1) - 1
    var perPage = 9;
    var options = {
        perPage: perPage,
        page: page
    }

    var query={};
    //query.type='form'
	if(typeof(req.body.statusId)!='undefined'){
		if(req.body.statusId!=""){
			query.reportstatus=req.body.statusId;
		}
		
	}
    if(typeof(req.body.searchId)!='undefined'){
		if(req.body.searchId!=""){
			query.formtitle={ $regex: req.body.searchId, $options: 'i' };
		}
		
	}
    ReportList.find(query,{ createdby:1,reportstatus: 1,reportformat: 1,reporttype: 1,formversion: 1,formtitle: 1,formtype: 1, reportversion: 1,modifieddate: 1, createddate: 1}).limit(options.perPage).skip(options.perPage * options.page).exec(function (err, lists) {   
    //FormList.list(options, function (err, lists) {
    	if (err) 
			//return res.render('500')
			return res.send(500);//Changed by Unais
		else
		{			
			ReportList.find(query).count().exec(function (err, count) {
				if (err) 			
					return res.send(500);//Changed by Unais
				else
				{
					res.jsonp({
						title: 'replist',
						reportList: lists,
						page: page + 1,
						pages: Math.ceil(count / perPage),
						totalitem: count

					});
				}
			})
		}	
    })
}

exports.reportSearch = function (req, res) {
    var searchId = req.params.searchId;
    var page = (req.param('pagenum') > 0 ? req.param('pagenum') : 1) - 1
    var perPage = 9
    var options = {
        perPage: perPage,
        page: page,
        search: searchId
    }
   
    ReportList.find({
        $or: [
            { 'formtitle': { $regex: searchId } },
            { 'formtype': { $regex: searchId } }
        ]
    }).exec(function (err, searchlist) {
        if(err)		
			res.json(500, {msg : err});//Added by Unais        
		else 
		{
            res.jsonp([
                {
                    title: 'UsersList',
                    reportList: searchlist,
                    page: page + 1,
                    pages: Math.ceil(searchlist.length / perPage),
                    totalitem: searchlist.length
                }
            ]);
        }
    });

};


exports.reportstatus = function (req, res) {
    var statusId = req.params.statusId;
    var criteria = { status: statusId };
    var page = (req.param('pagenum') > 0 ? req.param('pagenum') : 1) - 1
    var perPage = 9
    var options = {
        perPage: perPage,
        page: page,
        status: criteria
    }

    ReportList.find({ 'reportstatus': options.status.status }).exec(function (err, responce) {
		if(err)
			res.json(500, {msg : err});//Added by Unais
		else
		{
			res.jsonp([
				{
					title: 'Practice',
					reportList: responce,
					page: page + 1,
					pages: Math.ceil(responce.length / perPage),
					totalitem: responce.length
				}
			]);
		}
    })
};

exports.AllSearch = function () {
   
    var statusId = req.params.statusId;
    var searchId = req.params.searchId;
    ReportList.find({
        $or: [
            { 'formtitle': { $regex: searchId } },
            { 'formtype': { $regex: searchId } }
        ], $and: [
            { 'reportstatus': statusId }
        ]
    }).exec(function (err, responce) {
		if(err)
			res.json(500, {msg : err});//Added by Unais
		else
		{
			res.jsonp([
				{
					title: 'Practice',
					reportList: responce,
					page: page + 1,
					pages: Math.ceil(responce.length / perPage),
					totalitem: responce.length
				}
			]);
		}
    })
}

exports.getformdata = function (req, res) {
    var options = {}

    if (req.params.id != "all") {
        if (req.params.id == "forreport") {
            options = {
                status: 'publish'
            }
        }
        else {
            options = {
                _id: req.params.id
            }
        }
        FormList.find(options).exec(function (err, data) {
            if(err)
				res.json(500, {msg : err});//Added by Unais
			else	
			{		
				if (data.length > 0) {
					res.jsonp([
						{
							dataform: data[0].formdata,
							reportdata: data[0].reportformdata,
							title: data[0].formname,
							version: data[0].version,
							type: data[0].type,
							formtype: data[0].formtype
							//templatedata: data[0].templatedata,
							//templatename: data[0].templatename
						}
					]);
				}
				else {
					res.jsonp([{ dataform: 'Error' }]);
				}
			}				
        });
    } else {
        var result = {
            formdata: 0
        }
        FormList.find(options).exec(function (err, data) {
            if(err)
				res.json(500, {msg : err});//Added by Unais
			else
			{
				if (data.length > 0) {
					res.jsonp(data);
				}
				else {
					res.jsonp([{}]);
				}
			}
        });
    }
};

exports.saveNewreport = function (req, res) {
    var data1 = "";
    
    FormTypes.findOne({ 'formtype': req.body.data.formtype }).exec(function (err, doc) {
        if(err)
			res.json(500, {msg : err});//Added by Unais
		else
		{
			var rep = new ReportList();
			rep.formtype = req.body.data.formtype;
			rep.formtitle = doc.title;
			rep.formversion = req.body.data.formversion;
			rep.reporttype = req.body.data.formtype;
			rep.reportformat = req.body.data.reportformat;
			rep.reportstatus = 'draft';
			rep.createdby = 'Mayur';
			rep.save(function (error, data) {
				data1 = data;
			});
			ReportList.find({ formtype: req.body.data.formtype, formversion: req.body.data.formversion, reportversion: req.body.data.reportversion }, function (err, reptlist) {           
				if(err)
					res.json(500, {msg : err});//Added by Unais
				else
				{
					ReportList.count({ formtype: req.body.data.formtype, formversion: req.body.data.formversion }, function (err, count) {
						if(err)
							res.json(500, {msg : err});//Added by Unais
						else
						{
							rep.reportversion = count;
							if (reptlist[0]) {
								rep.reportdata = reptlist[0].reportdata;
							}

							rep.save(function (error, tpdata) {
								if (error) {
									res.send(500, "error occured");
								}
								else {
									
									res.send({ mesg: 'success saved', data: data1 });
								}
							});
						}	
					});
				}
			});
		}	
    });
};

exports.saveReportdata = function (req, res) {

    ReportList.update({ _id: req.params.reportid }, { $set: { reportdata: req.body.rdata } }).exec(function (err, result) {

        if (err) {
           
            return res.send(500);
        }
        else {           
            return res.send(200);
        }        
    });
};

exports.getreportlist = function (req, res) {
    var page = (req.param('pagenum') > 0 ? req.param('pagenum') : 1) - 1
    var perPage = 9
    var options = {
        perPage: perPage,
        page: page
    }
    if (req.param('pagenum') != 9999) {
        ReportList.list(options, function (err, rlist) {
            if (err) 
				//return res.render('500')
				return res.send(500);//Changed by Unais
            ReportList.count().exec(function (err, count) {
				if(err)
					res.json(500, {msg : err});//Added by Unais
				else
				{
					res.jsonp([{
						title: 'replist',
						reportList: rlist,
						page: page + 1,
						pages: Math.ceil(count / perPage),
						totalitem: count
					}]);
				}
            })
        })
    } else {
        ReportList.find({ _id: req.param('id') }, function (err, rlist) {
            if (err) 
				//return res.render('500')
				res.json(500, {msg : err});//Added by Unais
            res.jsonp([{
                title: 'reports',
                reportList: rlist,
            }]);
        })
    }
};


exports.getnewReportList = function (req, res) {
    var reporttype = req.params.formtype;
    var reportversion = req.params.formversion;
    ReportList.find({ $and: [{ 'formtype': reporttype }, { 'formversion': reportversion }, { 'reportstatus': 'publish' }] }).exec(function (err, result) {
        if (result) {
            res.jsonp([{ reportList: result }]);
        }
        else {
            res.send(500, 'Error Occured');
        }
    })
};

exports.getnewPatientData = function (req, res) {
   
    var patientid = req.params.patientid;
    
	// Athena changes
    var criteria = { _id: patientid };
    Patient.find(criteria, { basicinformation: { $elemMatch: { 'status': 'current' } }, contactinformation: { $elemMatch: { 'status': 'current' } }, address: { $elemMatch: { 'status': 'current' } }, occupation: { $elemMatch: { 'status': 'current' } }, demographics: { $elemMatch: { 'status': 'current' } },  medicalhistory: { $elemMatch: { 'status': 'current' } }, sh: { $elemMatch: { 'status': 'current' } }, createddate: 1, createdby: 1, athena_patientid : 1}).exec(function (err, patientList) {
        if (err) {           
			res.send(500, {'getnewPatientData error': err});
        }
        else {
            res.jsonp([{ patientsList: patientList }]);
        }
    });
};

exports.getStatus = function (req, res) {
    var formType = req.params.formType;
    FormList.findOne({'formtype': formType, 'status': 'publish','type': 'form'}).exec(function (err, responce) {
		if(err)
			res.json(500, {msg : err});//Added by Unais
		else
        {
			res.jsonp([
				{
					title: 'Practice',
					formList: responce
				}
			]);
		}
    })
};


//Function changed by Unais to get form from file 
/*exports.getStatus = function (req, res) {
	
	fs.readFile('./forms/' + req.params.formType + '-v4.json', 'utf8', function (err, data) {	
	  if (err) throw err;
	 
	   res.jsonp([
                {
                    title: 'Practice',
                    formList: JSON.parse(data[0])
                }
            ]);	  
	});
	   
};*/



exports.getFormdataByVersion = function (req, res) {
    var formType = req.params.formtype;
    var formVersion = req.params.version;
  
    FormList.find({ 'formtype': formType, 'type': 'form', 'version': formVersion }).exec(function (err, responce) {
        if(err)
			res.json(500, {msg : err});//Added by Unais
		else
		{
			res.jsonp([
				{
					title: 'Practice',
					form: responce
				}
			]);
		}
    })
};

exports.getFormdataById = function (req, res) {
    var formid = req.params.formid;
    
    FormList.find({ _id:formid }).exec(function (err, responce) {
        if(err)
			res.json(500, {msg : err});//Added by Unais
		else
		{
			res.jsonp([
				{
					title: 'Practice',
					form: responce
				}
			]);
		}
    })
};

/*
//Function changed by Unais to get form from file 
exports.getFormdataById = function (req, res) {	
	fs.readFile('./forms/dfr-' + req.params.formid + '.json', 'utf8', function (err, data) {	
	  if (err) throw err;	 
	   res.jsonp([
                {
                    title: 'Practice',
                    form: JSON.parse(data)
                }
            ]);	  
	});	   
};
*/

exports.getReportdatalist = function (req, res) {
    var reportID = req.params.reportid;
   
    FormList.find({ 'status': 'publish', 'formtype': 'dfr' }).exec(function (err, dataList) {
        if (err) {
            res.json(500, {msg: new Error('Error occured')});
        }
        else {
            res.jsonp([{
                dataList: dataList
            }]);
        }
    });
};

exports.getrandompublishreportid = function (req, res) {
    var formType = req.params.formtype;
    var formVersion = req.params.formversion;
    var randomnumber;	
    
    //ReportList.find({ 'formtype': formType, 'formversion': formVersion, 'reportstatus': 'publish', 'reportversion': '1' }, { 'ObjectId': 1 }).exec(function (err, responce) {
	//Above line commented and replaced by Unais to make the query dynamic and fetch the new report object which is in publish state
	ReportList.find({ 'formtype': formType, 'formversion': formVersion, 'reportstatus': 'publish'}, { 'ObjectId': 1 }).exec(function (err, responce) {
	//ReportList.find({ 'formtype': formType, 'formversion': 4, 'reportstatus': 'publish'}, { 'ObjectId': 1 }).exec(function (err, responce) {

        if (err) {
            res.send(500, 'Report not found.');
        } else {            
            res.send(200, [{reportId: responce}]);

        }
    })

    //ReportList.find({ 'formtype': formType, 'formversion': formVersion, 'reportstatus': 'publish' }).count().exec(function (err, responce) {
        
    //    if (err) {
    //        res.send(500, 'Report not found.');
    //    } else {
            
    //        randomnumber = Math.floor(Math.random() * ((responce - 1) - 0 + 1)) + 0;
            
    //        ReportList.find({ 'formtype': formType, 'formversion': formVersion, 'reportstatus': 'publish' }, { 'ObjectId': 1 }).limit(-1).skip(randomnumber).exec(function (err, report) {
    //            if (report) {

    //                res.jsonp([
    //                    {
    //                        reportId: report
    //                    }
    //                ]);

    //            } else {
    //                res.send(500, 'Random Report not found.');
    //            }
    //        });

    //    }
    //})
};

exports.getreportDataByID = function (req, res) {
    var reportId = req.params.reportId;

    ReportList.find({ _id: reportId }).exec(function (err, result) {
        if (result) {
            res.jsonp([{ reportList: result }]);
        }
        else {
            res.send(500, 'Error Occured');
        }
    })
};