'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Question = mongoose.model('Question');

/**
 * All States List
 */

exports.allquestions = function (req, res) {
    Question.find().sort('-created').exec(function (err, questions) {
        if (err) {
            /*res.render('error', {
                status: 500
            });*/
			return res.send(500);//Changed by Unais
        } else {
            res.jsonp(questions);
        }
    });
};

exports.getQuestionByemail = function (req, res) {
    User.findOne({ email: req.params.emailid }, { question: 1 }).exec(function (err, user) {       
        if (user) {
            Question.findOne({ _id: user.question }).sort('-created').exec(function (err, questions) {
                if (err) {
                    /*res.render('error', {
                        status: 500
                    });*/
					return res.send(500);//Changed by Unais
                } else {
                    res.jsonp(questions);
                }
            });
        } else {
            return res.send(500);//Changed by Unais
        }
    });


};

