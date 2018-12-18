'use strict';

module.exports = {
    env: 'development',
    domainurl: 'http://localhost:9000',
    mongo: {
        uri: process.env.MONGOLAB_URI ||
             process.env.MONGOHQ_URL
    }
};




