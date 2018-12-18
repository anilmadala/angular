'use strict';
	
var express = require('express'),
path = require('path'),
mongoose = require('mongoose');
var fs=require('fs');
const logger = require('./lib/config/logger');

var morgan = require('morgan'); //Used for asynchronous logging 


//Following code is for enabling application insights in production
/*const appInsights = require("applicationinsights");

appInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
		.setAutoDependencyCorrelation(true)
		.setAutoCollectRequests(true)
		.setAutoCollectPerformance(true)
		.setAutoCollectExceptions(true)
		.setAutoCollectDependencies(true)
		.setAutoCollectConsole(true)
		.setUseDiskRetryCaching(true)			

if(process.env.NODE_ENV=='production')
	appInsights.start();*/



/*const memwatch = require('memwatch-next');
var nodemailer = require("nodemailer");*/


// Default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
//console.log(process.env.NODE_ENV);

//Detecting memory leak
/*memwatch.on('leak', (info) => { 
  var message = 'Memory leak detected: ' + JSON.stringify(info) + ' Date: ' + Date() + '\n';
    logError(message);
	
	var recipient = 
	{
		to: 'devteam@greyfast.com',
		cc: 'greyfast100@gmail.com'
	};
	
	sendMail('Memory leak detected', message, recipient, null, function (err, res) 
	{
		if (err) {
			//
		} else {
			//
		}
	});
});*/

// add this handler before emitting any events
//This handler was active. It has been commented now to make sure process stops in case of an unhandled error.
/*process.on('uncaughtException', function (err) {
    console.log('UNCAUGHT EXCEPTION - keeping process alive:', err); // err.message is "foobar"
    
});*/


// Application Config
var config = require('./lib/config/config');

// Connect to database
//var db = mongoose.connect(config.mongo.uri, config.mongo.options);

var opts = {
    //useMongoClient: true,
    autoReconnect: true,
	autoIndex: false, // Don't build indexes
    //reconnectTries: 100, // Never stop trying to reconnect /* Not used for replica set */
    //reconnectInterval: 500, // Reconnect every 500ms  /* Not used for replica set */
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    /*bufferMaxEntries: 0*/
	connectTimeoutMS: 30000,
	socketTimeoutMS: 10000
  };



var db = mongoose.connection;
var connected;
db.on('open', function (ref) {
    connected = true;
    //console.log('open connection to mongo server.');
});

db.on('connected', function (ref) {
    //console.log('Connected connection to mongo server.');
});

db.on('disconnected', function (ref) {
    //console.log('disconnected connection.');	
});

db.on('close', function (ref) {
    connected = false;
    //console.log('close connection.');
    connect();
});

db.on('error', function (ref) {
    //console.log('Error connection.');
    mongoose.disconnect();
});

db.on('reconnected', function () {
    //console.log('MongoDB reconnected!');
});


function connect() {	

    /*mongoose.connect(config.mongo.uri, opts);
	console.log('connected successfully');*/
	
	//Following line is Added by Unais to avoid mongoose warning of deprecated promise library
	//Tell Mongoose to use the native Node.js promise library
	mongoose.Promise = global.Promise;
	mongoose.connect(config.mongo.uri,opts).then(
	()=>{
		//console.log("connected successfully")
		},
	(err)=>{
		//console.log("mongoose connection error",err);
	})
}

connect();

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
    require(modelsPath + '/' + file);
});

// Populate empty DB with sample data
require('./lib/config/dummydata');

// Passport Configuration
require('./lib/config/passport')();

var app = express();

// compress all requests 
//app.use(compression());

//Code block for morgan logging

app.use(morgan('tiny', {
    stream: logger.stream
}));

//var timeout = express.timeout // express v3 and below
//var timeout = require('connect-timeout'); //express v4

//app.use(timeout(20000));
//app.use(haltOnTimedout);

/*function haltOnTimedout(req, res, next){	
	var dt = {};
	if(req.user)
		dt = {id: req.user.userInfo.id, 'practicename': req.user.userInfo.practicename, 'username': req.user.userInfo.username, 'rolename': req.user.userInfo.rolename, 'level': req.user.userInfo.level, 'firstname':req.user.userInfo.firstname, 'lastname':req.user.userInfo.lastname}
	
	if(req.user)
<<<<<<< HEAD
		logger.error(JSON.stringify(dt));	
=======
		//APILogger.logAPIPerformance(req.originalUrl, JSON.stringify(req.route), JSON.stringify(dt));			
>>>>>>> athenafinal
  if (!req.timedout) next();
}*/

var server = require('http').createServer(app);

/*var server = require('http').createServer(app, function(req,res)
{
	var fs = require('fs'),
 ws = fs.createWriteStream('debugdump/'+Date.now() + '.heapsnapshot'),
 profiler = require('v8-profiler'),
 snapshot = profiler.takeSnapshot(),
 callback = ws.end.bind(ws);
 
 snapshot.serialize(function(data) {
 ws.write('' + data);
 }, callback);
});*/

var socketio = require('socket.io')(server, {
    serveClient: (config.env === 'production') ? false : true,
    path: '/socket.io-client'
});

// Express settings
require('./lib/config/express')(app);

// Routing

// Athena changes 
/***************** Athena routes *******************/

require('./lib/athena-routes/patient')(app);

require('./lib/athena-routes/injury')(app);

require('./lib/athena-routes/athena-sso')(app);

/***************** Athena routes *******************/
//-- Athena changes 

require('./lib/routes')(app);

require('./lib/config/socketio')(socketio);

// Middleware
//app.use(app.router); // you need this line so the .get etc. routes are run and if an error within, then the error is parsed to the next middleware (your error reporter)

app.use(function (err, req, res, next) {   
    if (!err) return next(); // you also need this line   
	
    var message = 'Error: ' + err.message + ', Stack trace: ' + err.stack + ', req: ' + JSON.stringify(req.params) + ', session: ' + JSON.stringify(req.session) + ',  Date: ' + Date() + '\n';
	logger.error('[server/application_error/]' + message)
	res.send((err.status || 500), {error: err});	
});

// Start server
server.listen(config.port, config.ip, function () {
    //console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));	
});


// Expose app
exports = module.exports = app;