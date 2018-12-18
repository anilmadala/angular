'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
  root: rootPath,
  port: process.env.PORT || 3000,
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

   mailer: {
       service:{
           host: "smtp.office365.com",
           port: 587,
           requiresAuth: true
       },
        /*auth: {
            user: "sales@rate-fast.com",
            //pass: "Johni$anut"
			pass: "3Kurap0yurlginf0"
        }*/
		/*auth: {
            user: "info@rate-fast.com",            
			pass: "R8f@st!nf0"
        }*/		
    },
dbconnection: {       
           db: "mongodb://ratefastadmin:beCyMHRzG8h7@ds039487.mongolab.com:39487/ratefast"
    }

};