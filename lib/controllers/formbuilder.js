'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Formbuilder = mongoose.model('Formbuilder');


exports.create = function (req, res, next) {
    var formBuilder = new Formbuilder(req.body);
    if (req.user) {
		 if (req.user.userInfo) {
			 if (req.user.userInfo.role) {
				if (req.user.userInfo.role.trim().toLowerCase() == "siteadmin") {
					formBuilder.save(function (err) {
						if (err) {
							return res.json(500, err);
						}
					});
				}
			}
		}
	}
}
