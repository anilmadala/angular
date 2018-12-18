'use strict';

module.exports = {
    env: 'staging',
    domainurl: 'http://ratefastcloud.azurewebsites.net',
    mongo: {
        uri: process.env.MONGOLAB_URI ||
             process.env.MONGOHQ_URL
    }
};