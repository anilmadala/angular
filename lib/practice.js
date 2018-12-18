
'use strict';

var mongoose = require('mongoose'),
    practicecollection = mongoose.model('Practice'),
    usercollection = mongoose.model('User');

var auditlog = require('./controllers/auditlog');
var logger = require('./config/logger');

/**
 * Custom practice middleware used by the application
 */
module.exports = {

/**
   * Authentication check for practice name active and exists
   */
 authenticate: function(req, res, next) {
  var practiceName = String(req.body.practicename);
  var userName = String(req.body.username);
  var userPass = String(req.body.password);

  practicecollection.find({'practicename':practiceName},{'status' : 'active'},
    function (err, result){
        
        // PSHA: 26th June 2016: Error Logging 
        if (err) {
            var path = 'Inside "pratice.js-> practicecollection.find method"';
            //auditlog.loggingError(req, err, path);
			logger.error('[practice/authenticate/ln. 30]' + error);
            return res.send(500, { message: err });
        }
      if (result.length == 1){        
         
        // Check if username for practice name is active
          usercollection.find({'username' : userName , 'practice': {$elemMatch: {'name': practiceName, 'status': 'active'}} }).exec( function (err, result ){
             
            // PSHA: 26th June 2016: Error Logging  
              if (err) {
                var path = 'Inside "pratice.js-> usercollection.find method"';
                //auditlog.loggingError(req, err, path);
				logger.error('[practice/authenticate/ln. 42]' + error);
                return res.send(500, { message: err });
            }
          if (result.length == 1){
             // res.send(200);
            return next();
          }
          else{  
             return res.send(401 ,{message:'Invalid credentials or user inactive'}); 
             }
            });
      }
      else{
         res.send(401,{message:'Invalid credentials or practice inactive'});
         return;
      }
    });   
  }
};


