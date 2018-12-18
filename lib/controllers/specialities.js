'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Speciality = mongoose.model('Speciality');

/**
 * All States List
 */

exports.allspecialities = function(req, res) {
    Speciality.find().sort('-created').exec(function(err, specialities) {
        if (err) {
            /*res.render('error', {
                status: 500
            });*/
			res.send(500);//Changed by Unais
        } else {
            res.jsonp(specialities);
        }
    });
};