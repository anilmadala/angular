	
'use strict';
/**
 * [Winston](https://github.com/winstonjs/winston)
 * A multi-tranport async logging library
 * 
 * Use winston to implement our logger, but the rest of the app uses
 * the generic logger interface that we export. This decouples logging 
 * logic in our code from implementation with Winston.
 * 
 * [Winston Loggly Bulk](https://github.com/loggly/winston-loggly-bulk)
 * A version of `winston-loggly` which is maintained by Loggly. Use this 
 * instead of the original because it ties into Loggly documentation
 */

var winston = require('winston');

	var day = new Date(); 
	var dd = day.getDate();
	var mm = day.getMonth()+1; 
	var yy = day.getFullYear();
	var hh = day.getHours();
	var logfilename ='./log/System_'+dd+'_'+mm+'_'+yy+'_'+hh+'.log';
	var errorlogfile ='./log/Error_'+dd+'_'+mm+'_'+yy+'_'+hh+'.log';
	var exceptionlogfile ='./log/uncaughtError_'+dd+'_'+mm+'_'+yy+'_'+hh+'.log';
		

const level = process.env.debuglevel || 'info'

// define the custom settings for each transport (file, console)
 
	const logger = winston.createLogger({
  level: level,
  format: winston.format.json(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `System_.log` 
    // - Write all logs error (and below) to `Error_.log`.
    //
    new winston.transports.File({ filename: errorlogfile, level: 'error' }),
    new winston.transports.File({ filename: logfilename })
  ],
    // - Write all uncaught exceptions
  exceptionHandlers: [

    new winston.transports.File({ filename: exceptionlogfile })

  ],
  exitOnError: false 

});
 
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transpssorts (file and console)
    logger.info(message);
  },
};

module.exports = logger;

