'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    ReportPricing = mongoose.model('Reportpricings'),
    Salesperson = mongoose.model('Salespersons');

/**
 Get all Data from reportPricing table
 */
exports.getAllreportData = function (req, res) {
    var formtype = req.params.formtype;
   
    ReportPricing.find().exec(function (err, result) {
        if (err) {
            return res.json(500, err);
        }
        else {
			res.json(result);
		}
    });
};

/**
 Get all Data on basis of formtype from reportPricing table
 */

exports.getReportPriceByType = function (req, res) {
    var formtype = req.params.formtype;
   
    ReportPricing.find({ formtype: formtype }).exec(function (err, result) {        
        if (err) {
            return res.json(500, err);
        }
        else {
			res.json(result);
		}
    });
};

/**

Save all Pricing Data

**/

exports.savePricing = function (req, res) {
    var Pricing = new ReportPricing(req.body);
    Pricing.save(function (err) {
        if (err) {
            return res.json(500, err);
        }
        else {
            return res.json('Successfully saved');
        }
    });
};

exports.getReportPricingList = function (req, res) {

    ReportPricing.find().exec(function (err, result) {
        if (err) {
            return res.json(500, err);
        }
        else {
			res.json(result);
		}
    });
};

exports.updateGlobalPricing = function (req, res) {

   
    var pricing = req.body.pricing;
    var reportType = ['dfr', 'pr2', 'pr4'];
    
    for (var i = 0; i < reportType.length; i++) {
       
        ReportPricing.findOneAndUpdate({ 'formtype': reportType[i] }, { 'pricing': pricing[reportType[i]] },
           function (err, response) {
               if (err) {
                   return res.json(500, err);
               } else {
                   return res.json(200, { result: 'updated' });
               }
           });
    }


};