'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    State = mongoose.model('State');

/**
 * All States List
 */

exports.allstates = function(req, res) {
    
    State.find({},{'state': 1}).sort({state: 1}).exec(function(err, states) {
        if (err) {
            /*res.render('error', {
                status: 500
            });*/
			res.send(500); //Changed by Unais
        } else {    
            res.jsonp(states);

        }
    });
};

exports.getStatesByStatus = function (req, res) {
    
    var status = req.params.status;
  
    var options = {
        status: status
    }

    State.find(options, function (err, states) {
        if (err) 
			//return res.render('500');
			  return res.send(500);	//Changed by Unais
        State.count().exec(function (err, count) {            
            res.jsonp(states);
        })
    })
   
};