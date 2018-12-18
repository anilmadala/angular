'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Country = mongoose.model('Country');

/**
 * All States List
 */

exports.allcountries = function (req, res) {
    Country.find().sort({ state: 1 }).exec(function (err, countries) {
        if (err) {
            /*res.render('error', {
                status: 500
            });*/
			res.send(500); //Changed by Unais
        } else {
            res.jsonp(countries);
        }
    });
};