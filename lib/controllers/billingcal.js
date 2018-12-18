'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    // ReportPricing = mongoose.model('Reportpricings'),
    // Salesperson = mongoose.model('Salespersons');
	
    rulesEngine = require('rulesengine'),
    Facts = require('../controllers/facts'),
    Rules = require('../controllers/rules');

exports.rulesenginemethod = function (req, res) {

    var state = req.body.state;
    var rules = new Rules();
    rulesEngine.loadRules(rules);
    
    //data from Patient complaints General Section
    var interpreter = req.body.data.patientcomplaints.interpreterused ? req.body.data.patientcomplaints.interpreterused : 'No';
    var isadditionalpages = req.body.data.patientcomplaints.isadditionalpages ? req.body.data.patientcomplaints.isadditionalpages : 'No';
    var ischartreviewtime = req.body.data.patientcomplaints.ischartreviewtime ? req.body.data.patientcomplaints.ischartreviewtime : 'No';
    var isreportpreparationtime = req.body.data.patientcomplaints.isreportpreparationtime ? req.body.data.patientcomplaints.isreportpreparationtime : 'No';
    //Data from Documentation General Section
    var facetoface , chartreviewtime, chartpreparationtime, totalpages;
    if (req.body.data.documentation) {
        facetoface = req.body.data.documentation.doctdface ? req.body.data.documentation.doctdface : 0;
        chartreviewtime = req.body.data.documentation.doctdreview ? req.body.data.documentation.doctdreview : 0;
        chartpreparationtime = req.body.data.documentation.doctdprepare ? req.body.data.documentation.doctdprepare : 0;
        totalpages = req.body.data.documentation.noofpages ? req.body.data.documentation.noofpages : 0;
    }    	

    switch (state) {
        case 'CA':
            /*var stateInput = [
                { row: "CAFace", "interpreter": interpreter, face: facetoface },
                { row: "CAPages", "interpreter": interpreter, "totalpages": totalpages, "isadditionalpages": isadditionalpages },
                { row: "CAChartReview", "interpreter": interpreter, "chartreviewtime": chartreviewtime, "ischartreviewtime": ischartreviewtime },
                { row: "CAChartPrep", "interpreter": interpreter, "chartpreparationtime": chartpreparationtime, "isreportpreparationtime": isreportpreparationtime }
            ]*/
			var stateInput = [
                { row: "CAFace", "interpreter": interpreter, face: facetoface },
                { row: "CAPages", "interpreter": interpreter, "totalpages": totalpages, "isadditionalpages": isadditionalpages }
            ]
            break;
    };

    
   
    var response = [];

    for (var i = 0; i < stateInput.length; i++) {
        var input = stateInput[i];
        var output = {};
        var ruleId = stateInput[i].row;
        var facts = new Facts(input, output);
        facts.result = {};
        var err = null;

        rulesEngine.execute(err, facts, ruleId, function () {
            if (err) 
			{
				return response; //Added by Unais
			}				
        });
        response.push(facts.output);

    }
    return response;
    //res.send(response);

    
};