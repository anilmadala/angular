/**
 * Socket.io configuration
 */

'use strict';
var express = require('express'),
    config = require('./config'),
    passport = require('passport'),
    mongoStore = require('connect-mongo')(express),
    mongoose = require('mongoose'),
	path = require('path');


//var sessionStore = new mongoStore({
//    url: config.mongo.uri,
//    collection: 'sessions'
//})
//Passing the moongoose connection
var sessionStore = new mongoStore({ mongooseConnection: mongoose.connection, collection: 'sessions' })

function parseSessionCookie(cookie, sid, secret) {
    var cookies = require('cookie').parse(cookie)
      , parsed = require('./utils').parseSignedCookies(cookies, secret)
    ;
    return parsed[sid] || null;
}
// When the user disconnects.. perform this
function onDisconnect(socket) {
    socket.on('logout', function (data) {
    });

}

// When the user connects.. perform this
function onConnect(socket) {
    // When the client emits 'login', this listens and executes
    socket.on('login', function (data) {
      
        //create room with practicename
        socket.join(data.practicename);
        //broadcast to the room with user data
        socket.broadcast.to(data.practicename).emit('samelogin', data);
    });

    // When the client emits 'reportopened', this listens and executes
    socket.on('reportopenedbyuser', function (data) {
       
        //create room with practicename
        socket.join(data.user.practicename);
        //broadcast to the room with user data
        socket.broadcast.to(data.user.practicename).emit('reportopenedbyuser', data);
    });

    // Insert sockets below
    //require('../api/thing/thing.socket').register(socket);
}

module.exports = function (socketio) {
    // socket.io (v1.x.x) is powered by debug.
    // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
    //
    // ex: DEBUG: "http*,socket.io:socket"

    // We can authenticate socket.io users and access their token through socket.handshake.decoded_token
    //
    // 1. You will need to send the token in `client/components/socket/socket.service.js`
    //
    // 2. Require authentication here:
    var Session = require('connect').middleware.session.Session;
    socketio.set('authorization', function (data, accept) {
       
        if(typeof data!= 'undefined')
		{
			
			if(typeof data.headers!= 'undefined')
			{
				
				if(typeof data.headers.cookie!='undefined')
				{
					
					if(typeof data.headers.cookie=='string')
					{
						
						var sid = parseSessionCookie(data.headers.cookie, 'connect.sig', 'angular-fullstack secret');
						if (sid) {
							data.sessionStore = sessionStore;
							sessionStore.load(sid, function (err, session) {
								if (err || !session) {
									accept("Error", false);
								} else {
									
									data.session = new Session(data, session);
									accept(null, true);
								}
							});
					
					} else {
						return accept('No cookie transmitted.', false);
					}
					}else {
							return accept('No cookie transmitted.', false);
						}	
					}	
				else
				{
					
					return accept('No cookie transmitted.', false);
				}
			}	
			else
			{
				
				return accept('No cookie transmitted.', false);
			}
		}
		else
		{
			
			return accept('No cookie transmitted.', false);
		}
    });

	var dir = 'log';
	var message='';
	var socketIoConnectionCnt = 0;
    socketio.on('connection', function (socket) {
		socketIoConnectionCnt++; 
	
		message = "Socket IO Connection count: " + socketIoConnectionCnt + ' Date: ' + Date() + '\n';
		//logError(message);
	

        // Call onDisconnect.
        socket.on('disconnect', function () {
            onDisconnect(socket);
			socketIoConnectionCnt--; 

								
			message = "Socket IO Connection count in disconnect: " + socketIoConnectionCnt + ' Date: ' + Date() + '\n';
			//logError(message);
		

        });

        // Call onConnect.
        onConnect(socket);
    });
};