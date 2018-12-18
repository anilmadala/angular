'use strict';

module.exports = {
  env: 'production',
  domainurl: 'http://ratefast.azurewebsites.net',
  mongo: {
    uri: process.env.mongolab_uri ||
         process.env.mongohq_url 
  }
};



