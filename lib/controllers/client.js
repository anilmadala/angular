// Load required packages
var mongoose = require('mongoose'),
    Client = mongoose.model('Client');
var User =mongoose.model('User'); 
var Token = mongoose.model('Token'); 
var Code = mongoose.model('Code');	
var passport = require('passport');		
var crypto = require('crypto');	

// Create endpoint /api/client for POST
exports.postClients = function(req, res) {
	if(typeof(req.user)=='undefined'){
		res.json({ message: 'Error in processing your request. Please try again later' ,code:205});
	}
	if(typeof(req.user.userInfo)=='undefined'){
		res.json({ message: 'Error in processing your request. Please try again later' ,code:205});
	}
	
	if(typeof(req.user.userInfo.enableOauth)!='undefined'){
		if(req.user.userInfo.enableOauth==true){
				// Create a new instance of the Client model
				var client = new Client();
				
				//Set the client properties that came from the POST data
				if(typeof(req.user.userInfo.id)!='undefined'){
					client.userId = req.user.userInfo.id;
				}else{
						res.json({ message: 'Error in processing your request. Please try again later',code:205});
				}
				if(typeof(req.body.appname)!='undefined'){
					client.name = req.body.appname;
				}else{
						res.json({ message: 'Error in processing your request. Please try again later' ,code:205});
				}
				if(typeof(req.user.userInfo.practicename)!='undefined'){
					client.practicename = req.user.userInfo.practicename;
				}else{
						res.json({ message: 'Error in processing your request. Please try again later' ,code:205});
				}
				client.id = random(20);
				client.secret = random(20);
				
				// Save the client and check for errors
				var bac={ name: req.body.appname };
				Client.find(bac, function(err, clients) {
					if (err){
							res.json({ message: 'Error in processing your request. Please try again later' ,code:205});
					}else{
					 
					 if(clients.length==0){
						 client.save(function(err) {
									
							if (err){
									res.json({ message: 'Error in processing your request. Please try again later' ,code:205});
							}else{
									res.json({ message: 'The client has been added successfully.', data: client ,code:200});
							}
						});
						}else{
								res.json({ message: 'The client name already present. Please check and try again.',code:205});
						}
					}
				});
		}else{
				res.json({ message: 'You are not Authorized to access this api',code:205});
		}
	}else{
			res.json({ message: 'You are not Authorized to access this api',code:205});
	}
};

// Create endpoint /api/clients for GET
exports.deleteClients = function(req, res) {
 if(typeof(req.user.userInfo.enableOauth)!='undefined'){
		if(req.user.userInfo.enableOauth==true){
			var bac={};
			bac.userId=req.user.userInfo.id;
			bac.practicename=req.user.userInfo.practicename;
			bac.name=req.body.name;
			bac.secret=req.body.secret;
			Client.findOneAndRemove(bac, function (err, Client) {
				if (err) {
				
				
					res.json({ message: 'Error in processing your request. Please try again later', code:205});
				}else{
				res.json({ message: 'The client has been added successfully.', code:200});
				}
			})
		}else{
				res.json({ message: 'You are not Authorized to access this api' ,code:205});
		}
 }else{
			res.json({ message: 'You are not Authorized to access this api' ,code:205});
	}
};

// Create endpoint /api/clients for GET
exports.getClients = function(req, res) {
	if(typeof(req.user.userInfo.enableOauth)!='undefined'){
		if(req.user.userInfo.enableOauth==true){
			 // Use the Client model to find all clients
				var bac={ userId: req.user.userInfo.id };
				Client.find(bac, function(err, clients) {
					if (err)
						res.send(err);
					res.json(clients);
				});
			}else{
				res.json({ message: 'You are not Authorized to access this api',code:205});
		}
 }else{
			res.json({ message: 'You are not Authorized to access this api',code:205});
	}
 
};


function random (howMany, chars) {
    chars = chars 
        || "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
    var rnd = crypto.randomBytes(howMany)
        , value = new Array(howMany)
        , len = chars.length;

    for (var i = 0; i < howMany; i++) {
        value[i] = chars[rnd[i] % len]
    };

    return value.join('');
}
// Create endpoint /api/clients for GET
exports.getRequiredData = function(req, res,next) {
			
			req.zres={};
			Token.findOne({value: req.body.access_token }, function (err, token) {
					if (err) { return next( ); }

					// No token found
					if (!token) { return next() }
					req.zres.token=token
						
					User.findOne({ _id: token.userId }, function (err, user) {
						if (err) { return next() }

						// No user found
						if (!user) { return next()}
							
						
							req.zres.user=user
						//find the clinet and related practice name
								Client.findOne({ _id: token.clientId }, function (err, client) {
									if (err) { return next() }
											
							
									// No user found
									if (!client) { return next()}
						
										req.zres.client=client;
											
											// Simple example with no scope
										next()
								});
						
					});
				});
};

exports.isAuthenticated = passport.authenticate(['local-auth', 'bearer'], { session : false });
exports.isClientAuthenticated = passport.authenticate('client-basic-local', { session : false });
exports.isBearerAuthenticated = passport.authenticate('bearer', { session : false });
