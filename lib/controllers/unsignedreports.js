var mongoose = require('mongoose'),
    Patientreport = mongoose.model('Patientreport'),
    IncrementRecord = mongoose.model('IncrementRecord');

//Get all reports with status open i.e. Unsigned Reports 
exports.getUnsignedReports = function (req, res, next) {
	
    var selectedstatecode = req.params.selectedstatecode;

    Patientreport.find({ 'status': 'open', 'practicename': req.user.practicename, 'state': selectedstatecode }, { createdby: 1, 'data.bginfo.firstname': 1, 'data.bginfo.middlename': 1, 'data.bginfo.lastname': 1, createddate: 1, formtype: 1, patientid: 1, injuryid: 1, formid: 1, createdDate: 1 }).sort({ createdDate: 1 })
    .exec(function (err, unsignedreports) {
        if (err)  return res.send(500) 
        else 
        	res.jsonp([
	            {
	                unsignedreports: unsignedreports
	            }
	        ]);
        
    })
};