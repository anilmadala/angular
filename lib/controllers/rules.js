//     http://www.bizrez.com
//     (c) 2004-2014 David Mallon
//     Freely distributed under the MIT license.

/*global module: false */

var _ = require("rulesengine/node_modules/underscore");

// Closure Object creation
var Rules = (function () {

    "use strict";

    function Rules() {

        Rules.prototype.rules = [
            {
                "id": "CAFace",
                "description": "Return Billing Code based on Interpreter & time",
                "condition": function (facts) {
                    // We will calculate the results regardless
                    return true;
                },
                "action": function (facts) {
                    
                    var decisionTable
                        = [
                        //{ interpreter: "Yes", facefrom: 1, faceto: 9, billing: { label: "E/M Est. Visit: ", billingcode: "99211-17-93", level: 1, units: 1, price: 30.90 } }, //arun changed
                        { interpreter: "No", facefrom: 1, faceto: 9, billing: { label: "E/M Est. Visit: ", billingcode: "99211-17", level: 1, units: 1, price: 30.90 } }, //arun changed
                        
						
						//{ interpreter: "Yes", facefrom: 10, faceto: 14, billing: { label: "E/M Est. Visit: ", billingcode: "99212-17-93", level: 2, units: 1, price: 61.67 } },//arun changed
                        { interpreter: "No", facefrom: 10, faceto: 14, billing: { label: "E/M Est. Visit: ", billingcode: "99212-17", level: 2, units: 1, price: 61.67 } },//changed
                        
						
						//{ interpreter: "Yes", facefrom: 15, faceto: 24, billing: { label: "E/M Est. Visit: ", billingcode: "99213-17-93", level: 3, units: 1, price: 101.39 } },//arun changed
                        { interpreter: "No", facefrom: 15, faceto: 24, billing: { label: "E/M Est. Visit: ", billingcode: "99213-17", level: 3, units: 1, price: 101.39 } },//changed
                        
						
						//{ interpreter: "Yes", facefrom: 25, faceto: 39, billing: { label: "E/M Est. Visit: ", billingcode: "99214-17-93", level: 4, units: 1, price: 149.32} },//arun changed
                        { interpreter: "No", facefrom: 25, faceto: 39, billing: { label: "E/M Est. Visit: ", billingcode: "99214-17", level: 4, units: 1, price: 149.32 } },//changed
                        
						
						//{ interpreter: "Yes", facefrom: 40, faceto: 999, billing: { label: "E/M Est. Visit: ", billingcode: "99215-17-93", level: 5, units: 1, price: 200.52 } },//arun changed
                        { interpreter: "No", facefrom: 40, faceto: 999, billing: { label: "E/M Est. Visit: ", billingcode: "99215-17", level: 5, units: 1, price: 200.52 } }//changed
                        ];

                    var resultArray;

                    // MAP
                    resultArray = _.map(decisionTable, function (row) {
                        var result = "";
                        if (facts.input.interpreter == row.interpreter && facts.input.face >= row.facefrom && facts.input.face <= row.faceto) {
                            result = row.billing;
                        }
                        return result;
                    });
                    
                    // Reduce
                    var result = _.reduce(resultArray, function (memory, element) {
                        if (element !== "") {
                            memory = element;
                        }
                        return  memory;
                    });
                    facts.output.billing = result;

                }
            },
            {
                "id": "CAPages",
                "description": "Return Billing Code based on Interpreter & time",
                "condition": function (facts) {
                    // We will calculate the results regardless
                    return true;
                },
                "action": function (facts) {
					
					//var priceCal = 39.42 + ((facts.input.totalpages - 1) * 24.25); //new value
					var priceCal = 40.45 + ((facts.input.totalpages - 1) * 24.88); //new value
                    priceCal = parseFloat(priceCal).toFixed(2);

                    var decisionTable
                        = [
                        { interpreter: "Yes", totalpagesfrom: 0, totalpagesto: 0, isadditionalpages: "Yes", billing: { label: "PR4 Page(s)/Pre-authorized for 8+ pages: ", billingcode: "", level: "", units: "", price: "" } },
                        { interpreter: "Yes", totalpagesfrom: 0, totalpagesto: 0, isadditionalpages: "No", billing: { label: "PR4 Page(s): ", billingcode: "", level: "", units: "", price: "" } },
                        { interpreter: "No", totalpagesfrom: 0, totalpagesto: 0, isadditionalpages: "Yes", billing: { label: "PR4 Page(s)/Pre-authorized for 8+ pages: ", billingcode: "", level: "", units: "", price: "" } },
                        { interpreter: "No", totalpagesfrom: 0, totalpagesto: 0, isadditionalpages: "No", billing: { label: "PR4 Page(s): ", billingcode: "", level: "", units: "", price: "" } },
                        { interpreter: "Yes", totalpagesfrom: 1, totalpagesto: 1, isadditionalpages: "Yes", billing: { label: "PR4 Page(s)/Pre-authorized for 8+ pages: ", billingcode: "WC004-17", level: "", units: 1, price: 40.45 } },//changed
                        { interpreter: "Yes", totalpagesfrom: 1, totalpagesto: 1, isadditionalpages: "No", billing: { label: "PR4 Page(s): ", billingcode: "WC004-17", level: "", units: 1, price: 40.45 } },//changed
                        { interpreter: "No", totalpagesfrom: 1, totalpagesto: 1, isadditionalpages: "Yes", billing: { label: "PR4 Page(s)/Pre-authorized for 8+ pages: ", billingcode: "WC004-17", level: "", units: 1, price: 40.45 } },//changed
                        { interpreter: "No", totalpagesfrom: 1, totalpagesto: 1, isadditionalpages: "No", billing: { label: "PR4 Page(s): ", billingcode: "WC004-17", level: "", units: 1, price: 40.45 } },//changed
                        { interpreter: "Yes", totalpagesfrom: 2, totalpagesto: 7, isadditionalpages: "Yes", billing: { label: "PR4 Page(s)/Pre-authorized for 8+ pages: ", billingcode: "WC004-17", level: "", units: facts.input.totalpages, price: priceCal } },
                        { interpreter: "Yes", totalpagesfrom: 2, totalpagesto: 7, isadditionalpages: "No", billing: { label: "PR4 Page(s): ", billingcode: "WC004-17", level: "", units: facts.input.totalpages, price: priceCal } },
                        { interpreter: "No", totalpagesfrom: 2, totalpagesto: 7, isadditionalpages: "Yes", billing: { label: "PR4 Page(s)/Pre-authorized for 8+ pages: ", billingcode: "WC004-17", level: "", units: facts.input.totalpages, price: priceCal } },
                        { interpreter: "No", totalpagesfrom: 2, totalpagesto: 7, isadditionalpages: "No", billing: { label: "PR4 Page(s): ", billingcode: "WC004-17", level: "", units: facts.input.totalpages, price: priceCal } },
                        { interpreter: "Yes", totalpagesfrom: 8, totalpagesto: 999, isadditionalpages: "Yes", billing: { label: "PR4 Page(s)/Pre-authorized for 8+ pages: ", billingcode: "WC004-17", level: "", units: facts.input.totalpages, price: 189.73 } },
                        { interpreter: "Yes", totalpagesfrom: 8, totalpagesto: 999, isadditionalpages: "No", billing: { label: "PR4 Page(s): ", billingcode: "WC004-17", level: "", units: 7, price: 189.73 } },
                        { interpreter: "No", totalpagesfrom: 8, totalpagesto: 999, isadditionalpages: "Yes", billing: { label: "PR4 Page(s)/Pre-authorized for 8+ pages: ", billingcode: "WC004-17", level: "", units: facts.input.totalpages, price: 189.73 } },
                        { interpreter: "No", totalpagesfrom: 8, totalpagesto: 999, isadditionalpages: "No", billing: { label: "PR4 Page(s): ", billingcode: "WC004-17", level: "", units: 7, price: 189.73 } }
                        ];

                    var resultArray;

                    // MAP
                    resultArray = _.map(decisionTable, function (row) {
                        var result = "";
                        if (facts.input.interpreter == row.interpreter && facts.input.totalpages >= row.totalpagesfrom && facts.input.totalpages <= row.totalpagesto && facts.input.isadditionalpages == row.isadditionalpages) {
                            result = row.billing;
                        }
                        return result;
                    });

                    // Reduce
                    var result = _.reduce(resultArray, function (memory, element) {
                        if (element !== "") {
                            memory = element;
                        }
                        return memory;
                    });
                    facts.output.billing = result;

                }
            },
            {
                "id": "CAChartReview",
                "description": "Return Billing Code based on Interpreter & time",
                "condition": function (facts) {
                    // We will calculate the results regardless
                    return true;
                },
                "action": function (facts) {
                    
                    var chartReviewTime = Math.floor(facts.input.chartreviewtime/15);
                    var priceCal = chartReviewTime * 36.34;

                    priceCal = parseFloat(priceCal).toFixed(2);

                    var decisionTable
                        = [
                        { interpreter: "Yes", chartreviewtimefrom: 0, chartreviewtimeto: 0, ischartreviewtime: "Yes", billing: { label: "Chart Review Pre-authorized: ", billingcode: "", level: "", units: "", price: "" } },
                        { interpreter: "Yes", chartreviewtimefrom: 0, chartreviewtimeto: 0, ischartreviewtime: "No", billing: { label: "Chart Review Pre-authorized: ", billingcode: "", level: "", units: "", price: "" } },
                        { interpreter: "No", chartreviewtimefrom: 0, chartreviewtimeto: 0, ischartreviewtime: "Yes", billing: { label: "Chart Review Pre-authorized: ", billingcode: "", level: "", units: "", price: "" } },
                        { interpreter: "No", chartreviewtimefrom: 0, chartreviewtimeto: 0, ischartreviewtime: "No", billing: { label: "Chart Review Pre-authorized: ", billingcode: "", level: "", units: "", price: "" } },
                        { interpreter: "Yes", chartreviewtimefrom: 1, chartreviewtimeto: 29, ischartreviewtime: "Yes", billing: { label: "Chart Review Pre-authorized: ", billingcode: "99358-17", level: 1, units: 1, price: 36.34 } },
                        { interpreter: "Yes", totalpagesfrom: 1, chartreviewtimeto: 29, ischartreviewtime: "No", billing: { label: "Chart Review Pre-authorized: ", billingcode: "", level: "", units: "", price: "" } },
                        { interpreter: "No", chartreviewtimefrom: 1, chartreviewtimeto: 29, ischartreviewtime: "Yes", billing: { label: "Chart Review Pre-authorized: ", billingcode: "99358-17", level: 1, units: 1, price: 36.34 } },
                        { interpreter: "No", chartreviewtimefrom: 1, chartreviewtimeto: 29, ischartreviewtime: "No", billing: { label: "Chart Review Pre-authorized: ", billingcode: "", level: "", units: "", price: "" } },
                        { interpreter: "Yes", chartreviewtimefrom: 30, chartreviewtimeto: 999, ischartreviewtime: "Yes", billing: { label: "Chart Review Pre-authorized: ", billingcode: "99358-17", level: chartReviewTime, units: chartReviewTime, price: priceCal } },
                        { interpreter: "Yes", chartreviewtimefrom: 30, chartreviewtimeto: 999, ischartreviewtime: "No", billing: { label: "Chart Review Pre-authorized: ", billingcode: "", level: "", units: "", price: "" } },
                        { interpreter: "No", chartreviewtimefrom: 30, chartreviewtimeto: 999, ischartreviewtime: "Yes", billing: { label: "Chart Review Pre-authorized: ", billingcode: "99358-17", level: chartReviewTime, units: chartReviewTime, price: priceCal } },
                        { interpreter: "No", chartreviewtimefrom: 30, chartreviewtimeto: 999, ischartreviewtime: "No", billing: { label: "Chart Review Pre-authorized: ", billingcode: "", level: "", units: "", price: "" } }
                        ];

                    var resultArray;

                    // MAP
                    resultArray = _.map(decisionTable, function (row) {
                        var result = "";
                        if (facts.input.interpreter == row.interpreter && facts.input.chartreviewtime >= row.chartreviewtimefrom && facts.input.chartreviewtime <= row.chartreviewtimeto && facts.input.ischartreviewtime == row.ischartreviewtime) {
                            result = row.billing;
                        }
                        return result;
                    });
                    
                    // Reduce
                    var result = _.reduce(resultArray, function (memory, element) {
                        if (element !== "") {
                            memory = element;
                        }
                        return  memory;
                    });
                    facts.output.billing = result;

                }
            },
            {
                "id": "CAChartPrep",
                "description": "Return Billing Code based on Interpreter & time",
                "condition": function (facts) {
                    // We will calculate the results regardless
                    return true;
                },
                "action": function (facts) {

                    var reportpreparationtime = Math.floor(facts.input.chartpreparationtime / 15);
                    var priceCal = reportpreparationtime * 36.34;

                    priceCal = parseFloat(priceCal).toFixed(2);

                    var decisionTable
                        = [
                        { interpreter: "Yes", chartpreparationtimefrom: 0, chartpreparationtimeto: 0, isreportpreparationtime: "Yes", billing: { label: "Report Preparation Pre-authorized: ", billingcode: "", level: "", units: "", price: "" } },
                        { interpreter: "Yes", chartpreparationtimefrom: 0, chartpreparationtimeto: 0, isreportpreparationtime: "No", billing: { label: "Report Preparation Pre-authorized: ", billingcode: "", level: "", units: "", price: "" } },
                        { interpreter: "No", chartpreparationtimefrom: 0, chartpreparationtimeto: 0, isreportpreparationtime: "Yes", billing: { label: "Report Preparation Pre-authorized: ", billingcode: "", level: "", units: "", price: "" } },
                        { interpreter: "No", chartpreparationtimefrom: 0, chartpreparationtimeto: 0, isreportpreparationtime: "No", billing: { label: "Report Preparation Pre-authorized: ", billingcode: "", level: "", units: "", price: "" } },
                        { interpreter: "Yes", chartpreparationtimefrom: 1, chartpreparationtimeto: 29, isreportpreparationtime: "Yes", billing: { label: "Report Preparation Pre-authorized: ", billingcode: "99358-17", level: 1, units: 1, price: 36.34 } },
                        { interpreter: "Yes", chartpreparationtimefrom: 1, chartpreparationtimeto: 29, isreportpreparationtime: "No", billing: { label: "Report Preparation Pre-authorized: ", billingcode: "", level: "", units: "", price: "" } },
                        { interpreter: "No", chartpreparationtimefrom: 1, chartpreparationtimeto: 29, isreportpreparationtime: "Yes", billing: { label: "Report Preparation Pre-authorized: ", billingcode: "99358-17", level: 1, units: 1, price: 36.34 } },
                        { interpreter: "No", chartpreparationtimefrom: 1, chartpreparationtimeto: 29, isreportpreparationtime: "No", billing: { label: "Report Preparation Pre-authorized: ", billingcode: "", level: "", units: "", price: "" } },
                        { interpreter: "Yes", chartpreparationtimefrom: 30, chartpreparationtimeto: 999, isreportpreparationtime: "Yes", billing: { label: "Report Preparation Pre-authorized: ", billingcode: "99358-17", level: reportpreparationtime, units: reportpreparationtime, price: priceCal } },
                        { interpreter: "Yes", chartpreparationtimefrom: 30, chartpreparationtimeto: 999, isreportpreparationtime: "No", billing: { label: "Report Preparation Pre-authorized: ", billingcode: "", level: "", units: "", price: "" } },
                        { interpreter: "No", chartpreparationtimefrom: 30, chartpreparationtimeto: 999, isreportpreparationtime: "Yes", billing: { label: "Report Preparation Pre-authorized: ", billingcode: "99358-17", level: reportpreparationtime, units: reportpreparationtime, price: priceCal } },
                        { interpreter: "No", chartpreparationtimefrom: 30, chartpreparationtimeto: 999, isreportpreparationtime: "No", billing: { label: "Report Preparation Pre-authorized: ", billingcode: "", level: "", units: "", price: "" } }
                        ];

                    var resultArray;

                    // MAP
                    resultArray = _.map(decisionTable, function (row) {
                        var result = "";
                        if (facts.input.interpreter == row.interpreter && facts.input.chartpreparationtime >= row.chartpreparationtimefrom && facts.input.chartpreparationtime <= row.chartpreparationtimeto && facts.input.isreportpreparationtime == row.isreportpreparationtime) {
                            result = row.billing;
                        }
                        return result;
                    });

                    // Reduce
                    var result = _.reduce(resultArray, function (memory, element) {
                        if (element !== "") {
                            memory = element;
                        }
                        return memory;
                    });
                    facts.output.billing = result;

                }
            }
        ];

    }

    return Rules;

})();

module.exports = Rules;





