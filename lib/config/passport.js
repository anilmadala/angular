// 'use strict';

// var mongoose = require('mongoose'),
//     User = mongoose.model('User'),
//     passport = require('passport'),
//     LocalStrategy = require('passport-local').Strategy;

// /**
//  * Passport configuration
//  */
// module.exports = function() {
//   passport.serializeUser(function(user, done) {
//     done(null, user.id);
//   });
//   passport.deserializeUser(function(id, done) {
//     User.findOne({
//       _id: id
//     }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
//       done(err, user);
//     });
//   });

//   // add other strategies for more authentication flexibility
//   passport.use(new LocalStrategy({
//       usernameField: 'username',
//       passwordField: 'password' // this is the virtual field on the model
//     },
//     function(username, password, done) {
//       User.findOne({
//         username: username
//       }, function(err, user) {
//         if (err) return done(err);
        
//         if (!user) {
//           return done(null, false, {
//             message: 'This user is not registered.'
//           });
//         }
//         if (!user.authenticate(password)) {
//           return done(null, false, {
//             message: 'This password is not correct.'
//           });
//         }
//         return done(null, user);
//       });
//     }
//   ));
// };

'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
	Client = mongoose.model('Client'), //Used for third part integration with RateFast
    Token = mongoose.model('Token'), //Used for third part integration with RateFast
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;  //Used for third part integration with RateFast
var BearerStrategy = require('passport-http-bearer').Strategy;  //Used for third part integration with RateFast

/**
 * Passport configuration
 */
module.exports = function () {    
	passport.serializeUser(function (user, done) {
    done(null, {id:user.id,practice:user.practicename});
  });
    passport.deserializeUser(function (userobj, done) {
   
    User.findOne({
      _id: userobj.id
    }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
        if (!err && user)
           user.practicename = userobj.practice;
      done(err, user);
    });
  });

  // add other strategies for more authentication flexibility
  passport.use(new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
	  passReqToCallback: true	  // this is the virtual field on the model
    },
    function(req,username, password, done) {
      User.findOne({
        username: username
      }, function(err, user) {
        if (err) return done(err);
        
        if (!user) {
          return done(null, false, {
            message: 'This user is not registered.'
          });
        }
        if (!user.authenticate(password)) {
		   /**
			 * author: manoj
			 * Description: Validates user's attempts to sign into application.
			 * If user tries to login 3rd time,user will be  prompted for forget password.
			 *	After 5 attempts user will be blocked.
			 */
			
			 if((typeof user.loginattempts)!=undefined){
				 
				var conditions = { _id: user['_id']},
				update = { $inc: { loginattempts: 1 }},
				options = { multi: false };
				User.update(conditions, update, options, function(err, numAffected){
					
				});
				if(user.loginattempts>=4){
				
				  return done(null, false, {
					message: 'Your account has been blocked. Please call practice account administrator for further assistance.',
					loginattempts:user.loginattempts+1
				  });
				}
			 }
			 //Login attempts ends here
			  return done(null, false, {
				message: 'This password is not correct.',
				loginattempts:user.loginattempts+1
			  });
        }
		//after every sucessfull login make login attempts 0
		 var conditions = { _id: user['_id']},
			 update = {loginattempts: 0},
			 options = { multi: false };
		 User.update(conditions, update, options, function(err, numAffected){
		 });
        return done(null, user);
      });
    }
  ));
  
  passport.use('client-basic-local', new LocalStrategy({
	  passReqToCallback: true	  // this is the virtual field on the model
    },function(req,clientid,clientsecret, callback) {
					
					var clientid=req.body.clientid;
					var clientsecret=req.body.clientsecret;
					
					Client.findOne({ id: clientid, secret:clientsecret}, function (err, client) {
					
								
								
							if (err) { return callback(err); }

							// No client found with that id or bad password
							if (!client || client.secret !== clientsecret) { return callback(null, false); }

							// Success
							
							return callback(null, client);
						});
				
				
				}
			));
		
		passport.use(new BearerStrategy(
			function(accessToken, callback) {
				
			
			 
				Token.findOne({value: accessToken }, function (err, token) {
					if (err) { return callback(err); }

					// No token found
					if (!token) { return callback(null, false); }

					User.findOne({ _id: token.userId }, function (err, user) {
						if (err) { return callback(err); }

						// No user found
						if (!user) { return callback(null, false); }

						// Simple example with no scope
						callback(null, user, { scope: '*' });
					});
				});
			}
		));
		
		
		//new loacl stargey for new updates
		
		
		passport.use('local-auth',new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
	  passReqToCallback: true	  // this is the virtual field on the model
    },
    function(req,username, password, done) {
      User.findOne({
        username: username
      }, function(err, user) {
        if (err) return done(err);
        
        if (!user) {
          return done(null, false, {
            message: 'This user is not registered.'
          });
        }
        if (!user.authenticate(password)) {
		   /**
			 * author: manoj
			 * Description: Validates user's attempts to sign into application.
			 * If user tries to login 3rd time,user will be  prompted for forget password.
			 *	After 5 attempts user will be blocked.
			 */
			
			 if((typeof user.loginattempts)!=undefined){
				 
				var conditions = { _id: user['_id']},
				update = { $inc: { loginattempts: 1 }},
				options = { multi: false };
				User.update(conditions, update, options, function(err, numAffected){
					
				});
				if(user.loginattempts>=4){
				
				  return done(null, false, {
					message: 'Your account has been blocked. Please call practice account administrator for further assistance.',
					loginattempts:user.loginattempts+1
				  });
				}
			 }
			 //Login attempts ends here
			  return done(null, false, {
				message: 'This password is not correct.',
				loginattempts:user.loginattempts+1
			  });
        }
		//after every sucessfull login make login attempts 0
		 var conditions = { _id: user['_id']},
			 update = {loginattempts: 0},
			 options = { multi: false };
		 User.update(conditions, update, options, function(err, numAffected){
		 });
        return done(null, user);
      });
    }
  ));
		//end here new local stargey
		
	//ends hereoauth2
	
};