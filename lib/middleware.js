'use strict';


var logger = require('./config/logger');

/**
 * Custom middleware used by the application
 */
module.exports = {

  /**
   *  Protect routes on your api from unauthenticated access
   */

  auth: function auth(req, res, next) {	 		 	
	if (req.isAuthenticated()) return next();
	res.send(401);	 
  },

  /**
   * Set a cookie for angular so it knows we have an http session
   */
  setUserCookie: function(req, res, next) {
    if(req.user) {
      //res.cookie('user', JSON.stringify(req.user.userInfo));
	   var dt={};
      dt=req.user.userInfo;
      dt.practiceDetails=req.session.passport.user.practiceDetails;
      res.cookie('user', JSON.stringify(dt));
    }
    next();
  },
	Oauth2: function Oauth2(req, res, next) {
    if (req.isAuthenticated()) return next();
     //res.render('oauth/oauth_login.html');		
		 res.render('partials/oauth_login.html', {rebody: req.query });
  }

};