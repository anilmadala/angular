'use strict';

var express = require('express'),
    path = require('path'),
    config = require('./config'),
    passport = require('passport'),
	session = require('cookie-session'),
    mongoStore = require('connect-mongo')(express),
    mongoose = require('mongoose');

	
	//Following line is Added by Unais to avoid mongoose warning of deprecated promise library
	//mongoose.Promise = global.Promise;
	
	/*var bunyan = require('bunyan');

	var logger = bunyan.createLogger({
		name: "ErrorLogger",                     // logger name
		serializers: {
			req: bunyan.stdSerializers.req,     // standard bunyan req serializer
			err: bunyan.stdSerializers.err      // standard bunyan error serializer
		},
		streams: [
			{				
				level: 'info',                  // loging level
				//stream: process.stdout          // log INFO and above to stdout
				path: 'log/APIs/APILog.log',
				type: 'rotating-file',        
				period: '1h',   // daily rotation
				count: 3        // keep 3 back copies
			}/*,
			{
				path: 'errors.log',
				level: 'trace'
			},
			{
				path: 'errors.log',
				level: 'debug'
			},
			{
				path: 'errors.log',
				level: 'error'
			}
		]
	});*/

/**
 * Express configuration
 */
module.exports = function(app) {
	app.set('trust proxy', 1);
	//Add middleware that will trick Express
	//into thinking the request is secure
	app.use(function(req, res, next) {
	  if(req.headers['x-arr-ssl'] && !req.headers['x-forwarded-proto']) {
		req.headers['x-forwarded-proto'] = 'https';
	  }
	  return next();
	});
  app.configure('development', function(){
    app.use(require('connect-livereload')());

    // Disable caching of scripts for easier testing
    app.use(function noCache(req, res, next) {
      if (req.url.indexOf('/scripts/') === 0) {
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', 0);
      }
      next();
    });

    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'app')));
    app.use(express.errorHandler());	
    app.set('views', config.root + '/app/views');
	
	/*app.use(express.session)({
		cookie: {			
			secure: true
		}
	})*/
	
  });

  app.configure('production', function(){
    app.use(express.favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public')));
    app.set('views', config.root + '/views');
	
	/*app.use(express.session)({
		cookie: {
			httpOnly: true,
			secure: true
		}
	})*/
  });

  app.configure(function(){
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(express.logger('dev'));
     app.use(express.bodyParser({ limit: '50mb' }));
    app.use(express.methodOverride());
    app.use(express.cookieParser());

    // Persist sessions with mongoStore
    //app.use(express.session({
    //  secret: 'angular-fullstack secret',
    //  store: new mongoStore({
    //    url: config.mongo.uri,
    //    collection: 'sessions'
    //  })
    //}));

      // Persist sessions with mongoStore
   /*  app.use(express.session({
        secret: 'angular-fullstack secret',
        store: new mongoStore({ mongooseConnection: mongoose.connection, collection: 'sessions' }),		
    })); */
	app.use(session({
		name: 'session',
		keys: ['key1', 'key2'],
		cookie: {
			secure: true,
			httpOnly: true
		},
		 store: new mongoStore({ mongooseConnection: mongoose.connection, collection: 'sessions' }),		
		})) 
		
	/* app.use(express.session({
        secret: 'angular-fullstack secret',
        cookie: {
          secure: true,
          httpOnly: true
        },
        store: new mongoStore({ mongooseConnection: mongoose.connection, collection: 'sessions' }),		
    })); */
	
    //use passport session
    app.use(passport.initialize());
    app.use(passport.session({cookie: { secure: true }}));
    
	/*app.use('/', function (req, res, next) {
		req.log = logger;
		next();
	});*/
	
    // Router needs to be last
    app.use(app.router);
  });
};