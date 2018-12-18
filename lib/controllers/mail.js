'use strict';
var mongoose = require('mongoose'),
config = require('../config/config'),
Template = mongoose.model('Template'),

nodemailer = require("nodemailer"),
logger = require('../config/logger');


/**
 * Mail
 * Parameters : Template Name (Criteria for pulling data from Template table)
 * Parameters : locals include Receiver's Mail address, CC & BCC
 * Parameters : Data for replacing placeholders
 */

var formatPlaceholders = (function () {
    var replacer = function (context) {
        return function (s, name) {
            return context[name];
        };
    };
    return function (input, context) {
        return input.replace(/\{(\w+)\}/g, replacer(context));
    };
})();

exports.sendMailMsg = function (templateName, locals, placeholders, callback) {

    var template_subject, template_html, cc, bcc;

    Template.findOne({ name: templateName }, function (err, template) {
        if (err === null && template == null) {
            // no error, but no result found
            err = new Error('Template :' + templateName + ' not found');
            callback(err);
            return;
        }
        if (err) {

            callback(err);
            return;
        }

        template_subject = template.subject;
        template_html = template.dataMsg;

        if (placeholders != null) {
            template_html = formatPlaceholders(template_html, placeholders);
            template_subject = formatPlaceholders(template_subject, placeholders);
        }
        //----- Provide the credentials -----//
        var NODE_ENV=process.env.NODE_ENV;
		 if(NODE_ENV=='development'){
				var smtpTransport = nodemailer.createTransport("SMTP",{
				 host: 'smtp.gmail.com',
					secureConnection: true,
					port: 465,
					transportMethod: 'SMTP',
					secure: true, // use SSL,
											// you can try with TLS, but port is then 587
					auth: {
						user: 'greyfast100@gmail.com', // Your email id
						pass: 'ratefast@1989' // Your password
					}
			});
		 }else{
				 var smtpTransport = nodemailer.createTransport("SMTP", {
				 //var smtpTransport = nodemailer.createTransport({
						/*host: config.mailer.service.host,
						port: config.mailer.service.port,
						requiresAuth: config.mailer.service.requiresAuth,*/
						host: process.env.MAILHOST,
						port: process.env.MAILPORT,
						requiresAuth: process.env.MAILAUTH,

						//secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
						//requireTLS: true,
						auth: {
								//user: config.mailer.auth.user,
								//pass: config.mailer.auth.pass

								//Changed by Unais to read from Azure config
								user: process.env.MAILER_USERNAME,
								pass: process.env.MAILER_PASSWORD
						}/*,
						tls: {
							ciphers: 'SSLv3'
						}*/

				});

		 }

        if (!locals.to) {

            callback('Receivers email id not specified.');
            return;
        }
        if (!locals.cc) {
            cc = '';
        } else {
            cc = locals.cc;
        }
        if (!locals.bcc) {
            bcc = '';
        } else {
            bcc = locals.bcc;
        }

		//----- Email Options -----//
        var mailOptions = {
            from: "RateFast <sales@rate-fast.com>", // sender address
            to: locals.to, // list of receivers
            cc: cc,
            bcc: bcc,
            subject: template_subject, // Subject line
            html: template_html // html body
            /* Addtional Options
             attachments: [
             {   // use URL as an attachment
             fileName: "license.txt",
             filePath: "https://raw.github.com/andris9/Nodemailer/master/LICENSE"
             }
             ]
             */
        };
        if (locals.from) {
            mailOptions.from = locals.from;
        }
        //----- Send Email -----//
        smtpTransport.sendMail(mailOptions, function (err, res) {

            if (err) {
				logger.error('[mail/sendMailMsg] Line. 130. Error: ' + JSON.stringify(err));
				callback(err);
				return;

            } else {
                if (callback)
                    callback(null, res);
            }
        });
    });
};

var _this = this;
exports.sendfeedbackmail = function (req, res) {

    var mailsendStatus = function (err, result) {
        if (!err) {
            res.send(200);
        } else {
            res.send(500, { message: err });
        }
    }
    var locals = {
        to: 'RateFast <sales@rate-fast.com>',
        from: req.user.email
        //to: 'mayur.mathurkar@hotmail.com',
        //from: 'mayur.mathurkar7@gmail.com'
    };
    var placeholders = {
        username: req.user.username,
        feedback: req.params.feedback
    };
    _this.sendMailMsg('Sendfeedback', locals, placeholders, mailsendStatus);
}


exports.sendMailWithoutTemplate = function (template_subject, template_html,locals, placeholders, callback) {
    var template_subject, template_html, cc, bcc;
        template_subject = template_subject;
        template_html = template_html;

        if (placeholders != null) {
            template_html = formatPlaceholders(template_html, placeholders);
            template_subject = formatPlaceholders(template_subject, placeholders);
        }

        var NODE_ENV=process.env.NODE_ENV;
		 if(NODE_ENV=='development'){
				var smtpTransport = nodemailer.createTransport("SMTP",{
				 host: 'smtp.gmail.com',
					secureConnection: true,
					port: 465,
					transportMethod: 'SMTP',
					secure: true,
					auth: {
						user: 'greyfast100@gmail.com',
						pass: 'ratefast@1989'
					}
			});
		 }else{
				var smtpTransport = nodemailer.createTransport("SMTP", {
				//var smtpTransport = nodemailer.createTransport({
						/*host: config.mailer.service.host,
						port: config.mailer.service.port,
						requiresAuth: config.mailer.service.requiresAuth,*/
						host: process.env.MAILHOST,
						port: process.env.MAILPORT,
						requiresAuth: process.env.MAILAUTH,

						//secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
						//requireTLS: true,

						auth: {
								//user: config.mailer.auth.user,
								//pass: config.mailer.auth.pass

								//Changed by Unais to read from Azure config
								user: process.env.MAILER_USERNAME,
								pass: process.env.MAILER_PASSWORD
						}/*,
						tls: {
							ciphers: 'SSLv3'
						}*/

				});

		 }

        if (!locals.to) {
            callback('Receivers email id not specified.');
            return;
        }
        if (!locals.cc) {
            cc = '';
        } else {
            cc = locals.cc;
        }
        if (!locals.bcc) {
            bcc = '';
        } else {
            bcc = locals.bcc;
        }

        var mailOptions = {
            from: "RateFast <sales@rate-fast.com>",
            to: locals.to,
            cc: cc,
            bcc: bcc,
            subject: template_subject,
            html: template_html

        };
        if (locals.from) {
            mailOptions.from = locals.from;
        }

        smtpTransport.sendMail(mailOptions, function (err, res) {

            if (err) {
				logger.error('[mail/sendMailWithoutTemplate] Line. 246. Error: ' + JSON.stringify(err));
				callback(err);
				return;


            } else {
                if (callback)
                    callback(null, res);
            }
        });

};



