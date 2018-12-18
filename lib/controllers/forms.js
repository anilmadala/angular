'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Forms = mongoose.model('Forms');

/**
 * All States List
 */

exports.pricing = function(req, res) {
    Forms.find().sort('-created').exec(function(err, formitems) {
        if (err) {
            /*res.render('error', {
                status: 500
            });*/
			res.send(500);//Changed by Unais
        } else {
            res.jsonp(formitems);
        }
    });
};
